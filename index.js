const f = require("./functions");
const express = require('express');
const path = require('path');

var app = express();
app.set('view engine', 'ejs')

app.get('/', async function(req, res) {
  res.send('<html><body><font style="font-family: courier;">Try /badge/<b>nickname</b></font></body></html>')
})

app.get('/badge/:nickname', async function(req, res) {
  user = await f.getBadge(req.params.nickname);
  res.render('badge', { user: user });
})

app.get('/css/:file', function(req,res) {
  res.sendFile(path.join(__dirname + '/static/' + req.params.file));
})

app.listen(8080);
