var express = require('express');
var fs = require('fs');
var request = require("request"); // do requestów do api discorda

var app = express();
var clientPath = "http://bx2901.ct8.pl:41693/" /*domena na której planujesz trzymać klienta, wymagane dla kompatybilności z ie4 (i pewnie innymi starszymi przeglądarkami)

(pamiętaj o dodaniu "/" na końcu)


domain where you plan to keep your client , required for compatibility with IE4 (and probably other old browsers)
(remember to add "/" at the end)
*/

app.get('/', (req,res) => {
  res.redirect(clientPath + "index.html")
});

app.get('/loader.php', (req,res) => {
  var token = req.originalUrl.split("?d=")[1].replace(/\"/g, "")
  request({
    method: 'get',
    url: 'https://discordapp.com/api/v6/users/@me',
    headers: {
        authorization: token
    }
    }, (error, response, body) => {
      var userinfo = response.toJSON().body
      var username = JSON.parse(userinfo).username;
      var discrim = JSON.parse(userinfo).discriminator;
      var userid = JSON.parse(userinfo).id;
      renderedhtml = '<html>\n<head>\n<title>Discord Mobile - Browser</title>\n<meta charset="UTF-8">\n</head>\n<body>\n<p>Welcome, ' + username + '#'+ discrim +'<br><br>Your user ID: '+ userid +'</p>\n<a href="serverlist.php?auth='+ token +'">Go to your server list</a>\n<br>\n<a href="dms.php?auth='+ token +'">Go to your DMs</a>\n</body></html>'
      res.send(renderedhtml);
  })
});

app.get('/serverlist.php', (req,res) => {
  var token = req.originalUrl.split("?auth=")[1].replace(/\"/g, "")
  var renderedhtml = '<html><head><title>Discord Mobile - Browser</title><meta charset="UTF-8"></head><body><p>Your server list:</p><br>'
  request({
    method: 'get',
    url: 'https://discordapp.com/api/v6/users/@me/guilds',
    headers: {
        authorization: token
    }
    }, (error, response, body) => {
      var userinfo = response.toJSON().body
      var jsonified = JSON.parse(userinfo);
      jsonified.forEach(function(guild) {
        renderedhtml += '<a href="server.php?id=' + guild.id +'&auth=' + token + '">' + guild.name + '</a><br>'
      })
      renderedhtml += "<br><br><br><p>Want to join a server? Use form below!</p><br><form action='join.php' method='GET'><input type='text' placeholder='Invite code/link' name='invite'></input></input><input type='hidden' name='auth' value='"+ token +"'></input><input type='submit' value='Join!'></form></body></html>"
      res.send(renderedhtml)
  })
});

app.get('/server.php', (req,res) => {
  var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
  var renderedhtml = '<html><head><title>Discord Mobile - Browser</title><meta charset="UTF-8"></head><body><p>List of channels for selected server</p><br>'
  request({
    method: 'get',
    url: 'https://discordapp.com/api/v6/guilds/' + req.originalUrl.split("?id=")[1].split("&auth=")[0] + '/channels',
    headers: {
        authorization: token
    }
    }, (error, response, body) => {
      var userinfo = response.toJSON().body
      var jsonified = JSON.parse(userinfo);
      jsonified.forEach(function(channel) {
        if(channel.type == 0) {
          renderedhtml += '<a href="channel.php?id=' + channel.id +'&auth=' + token + '">#' + channel.name + '</a><br>'
        } else if(channel.type == 4) {
          renderedhtml += "<p>Category: " + channel.name + "</p>"
        } else if(channel.type == 2) {
          renderedhtml += '<p>[VOICE CHANNEL] ' + channel.name + '</p>'
        } else if(channel.type == 5) {
          renderedhtml += '<a href="channel.php?id=' + channel.id +'&auth=' + token + '">[NEWS] #' + channel.name + '</a><br>'
        }
      })
      renderedhtml += "</body></html>"
      res.send(renderedhtml);
  })
});

app.get('/channel.php', (req,res) => {
  var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
  var channel = req.originalUrl.split("?id=")[1].split("&auth=")[0];
  var renderedhtml = '<html><head><title>Discord Mobile - Browser</title><meta charset="UTF-8"></head><body><a href="serverlist.php?auth=' + token + '">Go back to server list</a><p>Last 50 messages<br>(if you want messages updated, just refresh the page)</p><br><form action="sendMessage.php" method="GET"><input type="text" name="message" autocomplete="off" placeholder="Want to talk?"><input type="hidden" name="id" value="' + channel + '"><input type="hidden" name="auth" value="'+ token +'"><input type="submit" value="Post"></form><br>'
  setTimeout(function() {
    request({
      method: 'get',
      url: 'https://discordapp.com/api/v6/channels/' + channel + '/messages',
      headers: {
          authorization: token
      }
      }, (error, response, body) => {
        var userinfo = response.toJSON().body
        var jsonified = JSON.parse(userinfo);
        jsonified.forEach(function(message) {
          renderedhtml += "<p>" + message.author.username + "#" + message.author.discriminator + " wrote:<br>" + message.content
          message.attachments.forEach(function(attach) {
            if(JSON.stringify(attach).includes("url")) {
              renderedhtml += "<br><a href=" + attach.url + ">Attachment (" + attach.filename + ")</a>"
            }
          })
          renderedhtml += "<br>==================</p>"
        })
        renderedhtml += "</body></html>"
        res.send(renderedhtml);
    })
  }, 2000)
});


app.get('/dms.php', (req,res) => {
  var token = req.originalUrl.split("?auth=")[1].replace(/\"/g, "")
  var renderedhtml = '<html><head><title>Discord Mobile - Browser</title><meta charset="UTF-8"></head><body><p>List of your DMs</p><br>'
  request({
    method: 'get',
    url: 'https://discordapp.com/api/v6/users/@me/channels',
    headers: {
        authorization: token
    }
    }, (error, response, body) => {
      var userinfo = response.toJSON().body
      var jsonified = JSON.parse(userinfo);
      jsonified.forEach(function(user) {
        user.recipients.forEach(function(user2) {
          renderedhtml += "<a href='dm.php?id=" + user.id + "&auth="+ token +"'>"+ user2.username +"#"+ user2.discriminator +"</a><br>"
        })
      })
      renderedhtml += '<p>Want to start DMs with someone? Do this here! (put their ID here)</p><form action="startdms.php" method="GET"><input type="text" name="id" autocomplete="off" placeholder="User ID..."><input type="hidden" name="auth" value="'+ token +'"><input type="submit" value="Start DMs"></form></body></html>'
      res.send(renderedhtml);
  })
});


app.get('/startdms.php', (req,res) => {
  var id = req.originalUrl.split("?id=")[1].replace(/\"/g, "").split("&")[0]
  var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
  var channelId = "";

  request({
    method: 'post',
    url: 'https://discordapp.com/api/v6/users/@me/channels',
    json: {
      "content-type": "application/json",
      "recipient_id": id
    },
    headers: {
        authorization: token,
    }
    }, (error, response, body) => {
      var userinfo = response.toJSON().body;
      channelId = userinfo.id;
      request({
        method: 'post',
        url: "https://discordapp.com/api/v6/channels/" + channelId + "/messages",
        json: {
          "content":"hey",
         "content-type": "application/json",
         "tts": false,
         authorization: token
        },
        headers: {
          authorization: token
        }
      }, (error, response2, body) => {
        try {
          res.redirect(clientPath + "dms.php?auth=" + token)
        }
        catch(error) {
   
        }
      });
  })
});

app.get('/dm.php', (req,res) => {
  var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
  var channel = req.originalUrl.split("?id=")[1].split("&auth=")[0];
  var renderedhtml = '<html><head><title>Discord Mobile - Browser</title><meta charset="UTF-8"></head><body><a href="dms.php?auth=' + token + '">Go back to your DMs list</a><p>Last 50 messages<br>(if you want messages updated, just refresh the page)</p><br><form action="sendDM.php" method="GET"><input type="text" name="message" autocomplete="off" placeholder="Want to talk?"><input type="hidden" name="id" value="' + channel + '"><input type="hidden" name="auth" value="'+ token +'"><input type="submit" value="Post"></form><br>'
  setTimeout(function() {
    request({
      method: 'get',
      url: 'https://discordapp.com/api/v6/channels/' + channel + '/messages',
      headers: {
          authorization: token
      }
      }, (error, response, body) => {
        var userinfo = response.toJSON().body
        var jsonified = JSON.parse(userinfo);
        jsonified.forEach(function(message) {
          renderedhtml += "<p>" + message.author.username + "#" + message.author.discriminator + " wrote:<br>" + message.content
          message.attachments.forEach(function(attach) {
            if(JSON.stringify(attach).includes("url")) {
              renderedhtml += "<br><a href=" + attach.url + ">Attachment (" + attach.filename + ")</a>"
            }
          })
          renderedhtml += "<br>==================</p>"
        })
        renderedhtml += "</body></html>"
        res.send(renderedhtml);
    })
  }, 2000)
});

app.get('/join.php', (req,res) => {
  var code = decodeURIComponent(req.originalUrl.split("?invite=")[1].split("&auth=")[0])
  if(code.startsWith("https://discord.gg/") || code.startsWith("discord.gg/")) {
    code = code.replace("https://discord.gg/", "").replace("discord.gg/", "")
  }
  request({
      method: 'post',
      url: "https://discordapp.com/api/v6/invite/" + code,
      headers: {
          authorization: req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
      }
    }, (error, response, body) => {
      setTimeout(function() {
        res.redirect(clientPath + "serverlist.php?auth=" + req.originalUrl.split("&auth=")[1])
      }, 2000)
    });
});

app.get('/sendMessage.php', (req,res) => {
  var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
    var channelId = req.originalUrl.split("&id=")[1].split("&")[0];
    var message = req.originalUrl.split("?message=")[1].split("&")[0];
 request({
     method: 'post',
     url: "https://discordapp.com/api/v6/channels/" + channelId + "/messages",
     json: {
       "content":decodeURIComponent(message.replace(/\+/g, " ")),
      "content-type": "application/json",
      "tts": false,
      authorization: token
     },
     headers: {
       authorization: token
     }
   }, (error, response, body) => {
    try {
      res.redirect(clientPath + "channel.php?id="+ channelId +"&auth=" + token)
    }
    catch(error) {
      
    }
   });

});

app.get('/sendDM.php', (req,res) => {
 var token = req.originalUrl.split("&auth=")[1].replace(/\"/g, "")
    var channelId = req.originalUrl.split("&id=")[1].split("&")[0];
    var message = req.originalUrl.split("?message=")[1].split("&")[0];
 request({
     method: 'post',
     url: "https://discordapp.com/api/v6/channels/" + channelId + "/messages",
     json: {
       "content":decodeURIComponent(message.replace(/\+/g, " ")),
      "content-type": "application/json",
      "tts": false,
      authorization: token
     },
     headers: {
       authorization: token
     }
   }, (error, response, body) => {
     try {
       res.redirect(clientPath + "dm.php?id="+ channelId +"&auth=" + token)
     }
     catch(error) {

     }
   });
});

app.use(express.static('./views'))
var server = app.listen(80, function () {
});