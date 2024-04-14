# Telegram Post Scraper

The project has two modules

- scraper
- server

---

Scraper is written in python

- install all depenedenices from requirements.txt
- update config.json file with
  - telegram app details
  - postgress database details
  - gmail credentials

Start the scraper with command

```
cd scraper
pip install -r requirements.txt
python3 main.py
```

Note:
On first time starting the scraper,
Need to login to telegram by entering phone number used to create telegram app and enter otp sent to same telegram no account
once logged the same session would be used in future
The script scrapes all posts from channel_id and will start to listen to any new posts continously
Once a new post is posted its scraped immediately and a mail is sent to receiver_mail

---

Backend in Node.js
Install all node dependecies with command

```
cd backend
npm install
```

Update postgress db details in `backend/app/config/db.config.js` file

Start the server with command
`npm run start`

The api is live at localhost port 8080
visit http://localhost:8080/api/posts
for docs visit http://localhost:8080/api-docs/
