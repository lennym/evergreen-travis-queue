const Promise = require('bluebird');

const getRepos = require('./get-repository-list');
const pushMessage = require('./push-message');
const loadVersions = require('./load-github-json');

function processRepos (event, context, callback) {
  Promise.resolve()
    .then(() => {
      return getRepos();
    })
    .then((repos) => {
      console.log(`Found ${repos.length} repositories`);
      const url = process.env.EVERGREEN_VERSION_LIST_URL;
      return loadVersions(url)
        .then((versions) => {
          return Promise.each(repos, (repo) => {
            return pushMessage(repo, versions);
          });
        });
    })
    .then(() => { callback(); })
    .catch(callback);
}

module.exports = processRepos;
