const f = require("./functions");
const express = require('express');
const path = require('path');
const conf = require('nconf');
conf.argv().env().file({file: "./config.json"});

var app = express();
app.set('view engine', 'ejs')

app.get('/', async function(req, res) {
  res.send('<html><body><font style="font-family: courier;">Try /badge/<b>nickname</b></font></body></html>')
})

app.get('/badge/:nickname', async function(req, res) {
  let users_accepted = conf.get("USERS_ACCEPTED");
  if ((typeof users_accepted !== "undefined") && (users_accepted.indexOf(req.params.nickname) == -1))  {
    res.send("Nickname not allowed");
  } else {
    let user = await f.getBadge(req.params.nickname);
    res.render('badge', { user: user });
  }
})

app.get('/static/:file', function(req,res) {
  res.sendFile(path.join(__dirname + '/static/' + req.params.file));
})

app.listen(conf.get("PORT"));
