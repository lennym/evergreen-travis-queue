const Promise = require('bluebird');

const getRepos = require('./get-repository-list');
const pushMessage = require('./push-message');

function processRepos (event, context, callback) {
  Promise.resolve()
    .then(() => {
      return getRepos();
    })
    .then((repos) => {
      console.log(`Found ${repos.length} repositories`);
      return Promise.each(repos, (repo) => {
        return pushMessage(repo);
      });
    })
    .then(() => { callback(); })
    .catch(callback);
}

module.exports = processRepos;
