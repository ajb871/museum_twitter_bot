# Tweet Museum Bot

## About
The Tweet Museum bot is a bot that creates a beautifully rich archive of users Tweets from across Twitter. With these tweets, this bot creates gorgeous, multi-dimensional works of art.

This bot was created with Node.js and Processing.


## How to Use
The bot is currently on a posting Interval of every 30 minutes. As of this push, the bot only runs on-computer, and has not yet been tested for deployment. 

**For Windows users** -> the directory of processing-java.exe must be added to the PATH variable in order to run processing-java from the command line.
**For Mac users** -> replace `"%cd%\\my_sketch"` with ``` `pwd`/my_sketch ``` in the cmd variable.

Note: config.js and config_g.js files, referenced in bot.js, contain API keys, tokens, secrets, etc. See [Twit Documentation](https://www.npmjs.com/package/twit) and [Google-Images package Documentation](https://www.npmjs.com/package/twit) to see structure and more info.

Node Packages Used: Twit, Request, Google-Images

## Known Bugs/Future Fixes
Occasionally, the bot will select a URL included in a tweet as one of the "keywords". Upon the image search, there will be no results, which will result in a download error. The tweet is not sent, and the interval is started over, resulting in a missed post. This can/will be easily resolved by:
1. Not allowing non-alphabetic characters to be in keywords (eliminating URLS, emojis, etc)
2. Not continuing with download/tweet send if there are NO image results.