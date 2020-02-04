`nophprequired` branch is more maintained.



# LightDiscordClient
Lightest Discord client ever - even working on Internet Explorer 4!

Try it out: http://bx2901.ct8.pl:41693/

## Installing & running

- Extract all files
- Download latest version of PHP (if you don't want to deal with PHP files go to `nophprequired` branch): https://www.php.net/downloads.php
- Extract PHP files to the same folder where you downloaded this repo's files
- Go to start.js, and change clientPath variable to domain where you plan to keep your self-hosted client (not required, you can also clear variable's contents)
- Open the console (Command Prompt/Terminal) in the directory with repository
- Type: `npm install express request php-express`
- To run the client, type: `node start.js`
To make sure everything works, try going to http://localhost/ in your browser and check if it works.

If you need to change port the client listens to, you can in line 307 of start.js, just change the number `80` with your desired port.

## Screenshots

![Screenshot1](https://pbs.twimg.com/media/EE7ViaqXYAAZOMS?format=png&name=900x900)
![Screenshot2](https://pbs.twimg.com/media/EE_0hKBWkAALgJ8?format=png&name=900x900)
