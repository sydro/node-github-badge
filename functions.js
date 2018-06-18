const axios = require("axios");
const cheerio = require("cheerio");
const _ = require('lodash');
const fs = require('fs');
const conf = require('nconf');
conf.argv().env().file({file: "./config.json"});

async function getInfo(nickname) {
  let url = conf.get("GITHUB_URL") + nickname;
  let user = { login: nickname }
  await axios.get(url).then(async function(response) {
    const $ = cheerio.load(response.data);
    user.fullname = $('.p-name').text();
    user.avatar_url = $('.avatar')['1'].attribs.src;
    console.log($('.avatar')['1'].attribs.src)
    user.repos = $('.UnderlineNav-item').children()[0].children[0].data.trim();
    user.stars = $('.UnderlineNav-item').children()[1].children[0].data.trim();
    user.followers = $('.UnderlineNav-item').children()[2].children[0].data.trim();
    user.following = $('.UnderlineNav-item').children()[3].children[0].data.trim();
    user.languages = _.uniq($('.repo-language-color').parent().text().replace(/[^A-Za-z ]/g, '').replace(/\s\s+/g, ' ').trim().split(" ")).slice(0,3).join(",");

    user.last_project = await axios.get(conf.get("GITHUB_URL") + 'users/' + nickname + '/created_commits').then(function(response) {
      const $ = cheerio.load(response.data);
      last_commits = $('div')[0];
      return (typeof last_commits !== 'undefined') ? last_commits.children[1].attribs['href'].slice(1) : "";
    })

  });
  return user;
}

async function getBadge(nickname) {
  let cache_dir = conf.get("CACHE_DIR");
  let file_cache = cache_dir + nickname + '.cache';
  let user;
  try { fs.statSync(cache_dir); } catch(err) { fs.mkdirSync(cache_dir)};

  try {
    stats = fs.statSync(file_cache);
    if ( (stats.mtime.getTime() + conf.get("CACHE_INTERVAL")) > new Date().getTime() ) {
      user = JSON.parse(fs.readFileSync(file_cache, 'utf8'));
      // console.log("Valid cache file");
    } else {
      user = await getInfo(nickname);
      fs.writeFileSync(file_cache, JSON.stringify(user));
      // console.log("Expired cache file");
    }
  } catch(err) {
    user = await getInfo(nickname);
    fs.writeFileSync(file_cache, JSON.stringify(user));
    //console.log("Cache file not exists");
  }
  return user;
}

module.exports = {
  getBadge,
  getInfo
};
