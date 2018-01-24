const axios = require("axios");
const cheerio = require("cheerio");
const _ = require('lodash');

const GITHUB_URL = "https://www.github.com/";

async function getBadge(nickname) {
  let url = GITHUB_URL + nickname;
  let user = { login: nickname }
  await axios.get(url).then(async function(response) {
    const $ = cheerio.load(response.data);
    user.fullname = $('.p-name').text();
    user.avatar_url = $('.avatar')['0'].attribs.src;
    user.repos = $('.UnderlineNav-item').children()[0].children[0].data.trim();
    user.stars = $('.UnderlineNav-item').children()[1].children[0].data.trim();
    user.followers = $('.UnderlineNav-item').children()[2].children[0].data.trim();
    user.following = $('.UnderlineNav-item').children()[3].children[0].data.trim();
    user.languages = _.uniq($('.repo-language-color').parent().text().replace(/[^A-Za-z ]/g, '').replace(/\s\s+/g, ' ').trim().split(" ")).slice(0,3).join(",");

    user.last_project = await axios.get(GITHUB_URL + 'users/' + nickname + '/created_commits').then(function(response) {
      const $ = cheerio.load(response.data);
      last_commits = $('div')[0];
      return (typeof last_commits !== 'undefined') ? last_commits.children[1].attribs['href'].slice(1) : "";
    })

  });
  return user;
}

module.exports = {
  getBadge
};
