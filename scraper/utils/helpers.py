import json
import datetime
from db.pg import Postgres
from psycopg2.extensions import AsIs

import logging
logger = logging.getLogger(__name__)


def save_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=4, default=str)


def init_table(tablename):
    create_statement = f'''
        CREATE TABLE IF NOT EXISTS {tablename} (
            channel TEXT,
            id INTEGER,
            text TEXT,
            "postDate" TIMESTAMP,
            author TEXT,
            media TEXT,
            reactions JSONB,
            "createdAt" TIMESTAMP,
            "updatedAt" TIMESTAMP
            );
    '''
    
    logger.info(f"Creating table '{tablename}' if not exits.")
    with Postgres() as (con, cur):
        cur.execute(create_statement)
        con.commit()
    

def insert_post(record, table):
    record['reactions'] = json.dumps(record['reactions'])
    record['createdAt'] = datetime.datetime.now()
    record['updatedAt'] = datetime.datetime.now()
    columns = record.keys()
    values = [record[column] for column in columns]
    columns = [f'"{col}"' for col in columns]

    insert_statement = 'insert into ' + table +' (%s) values %s'

    logger.info(f"Inserting post to table")
    with Postgres() as (con, cur):
        cur.execute(insert_statement, (AsIs(','.join(columns)), tuple(values)))
        con.commit()


def existing_posts(tablename):
    ids = []
    logger.debug(f"Fetching all post ids")
    query = f'SELECT id from {tablename}'
    with Postgres() as (con, cur):
        cur.execute(query)
        ids = cur.fetchall()
        ids = [rcrd['id'] for rcrd in ids]
    return ids
