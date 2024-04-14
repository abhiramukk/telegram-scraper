from telethon import TelegramClient
from telethon.tl.types import UpdateNewChannelMessage
from telethon import events

import logging
from utils.helpers import *
from utils.mail import send_mail

logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

config = json.load(open('config.json'))
api_id = config['api_id']
api_hash = config['api_hash']
channel_id = config['channel_id']
db_table = config['db_table']

client = TelegramClient('mbk', api_id, api_hash)


async def parse_media(message, download_path=''):
    media = message.media

    if not media: return ''

    if hasattr(media, 'photo'):
        file_id = media.photo.id
        ext = 'jpg'
    elif hasattr(media, 'webpage'):
        return media.webpage.url
    else:
        file_id = media.document.id 
        ext = ''
        for attr in media.document.attributes:
            if hasattr(attr, 'file_name'):
                ext = attr.file_name.split('.')[-1]
    
    file_name = f"{file_id}.{ext}"
    if download_path:
        path = f'{download_path}//{file_name}'
        logging.info(f'Downloading file {file_name}')

        # comment to skip downloading media files
        await message.download_media(file=path) 
        logging.info(f'File saved to {path}')  # printed after download is done

    return file_name


def parse_reaction(reactions):
    if not reactions: return ''

    results = []
    for reaction in reactions.results:
        results.append({
                        'reaction': reaction.reaction.emoticon,
                        'count' : reaction.count
                        })
    return results
    # return '; '.join([f"{rcrd['reaction']} : {rcrd['count']}" for rcrd in results])


async def parse_message(message):
    record = {}

    record['channel'] = channel_id
    record['id'] = message.id
    record['text'] = message.text
    record['postDate'] = message.date
    record['author'] = message.post_author
    record['media'] = await parse_media(message, './media')
    record['reactions'] = parse_reaction(message.reactions)
    
    insert_post(record, db_table)
    return record


@client.on(events.NewMessage(incoming=True))
async def handleNewPost(event):
    # Respond whenever someone says "Hello" and something else
    if isinstance(event, UpdateNewChannelMessage):
        await parse_message(event.message)
        send_mail(f"A new post has been posted in {channel_id}")
   


async def crawl_messages(exisitng_ids):
    async for message in client.iter_messages(channel_id):
        if message.id not in exisitng_ids:
            await parse_message(message)


async def main():
    init_table(db_table)
    exisitng_ids = existing_posts(db_table)
    await crawl_messages(exisitng_ids)



if __name__ == '__main__':
    with client:
        client.loop.run_until_complete(main())
        client.add_event_handler(handleNewPost)
        client.run_until_disconnected()