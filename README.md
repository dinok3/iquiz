## IQUIZ

## Description 
Quiz app made with Django + React.

## Current features
* Registration and Login -> JWT or oauth2 (Facebook and Google)
* Multiple choice question type
* True/False question type
* Choosing between different categories 
* Hard, Medium, Easy difficulty
* Fetching question from trivia quiz api
* Keeping track of current score
* Correct and Incorrect answers are shown the moment you click on the answer
* Solo (normal) or Group game (custom)
* Creating your own room
* Room owner has ability to change settings, kick players
* Room chat
* Kick player via chat /kickplayer '[name]' or button
* Time limit for each question in custom game
* Deleting rooms where there are no players & only owners can prevent that from happening by joining it


## Working on
* Adding statistics for each user
* Deploying it

## Installation
- Django & React are managed independently so you should set them up separately

Setting up backend:
------------------
```
python -m venv venv
venv/scripts/activate
git clone https://github.com/dinok3/iquiz.git
cd iquiz
cd iquiz
*python -m pip install --upgrade pip* - if needed (can't install requirements.txt)
pip install -r requirements.txt
py manage.py migrate
py manage.py runserver
```

Setting up frontend:
------------------
```
cd frontend
npm install
npm start
```

![Brief look at the app](https://github.com/dinok3/iquiz/tree/master/iquiz/main/static)
