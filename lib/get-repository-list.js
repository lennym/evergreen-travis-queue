const Promise = require('bluebird');

const resolve = require('./resolve-wildcard-repos');
const loadRepos = require('./load-github-json');

function getRepos () {
  const url = process.env.EVERGREEN_REPOSITORY_LIST_URL;
  const ignore = process.env.EVERGREEN_IGNORE_LIST_URL;
  return loadRepos(url)
    .then((repos) => {
      return Promise.reduce(repos, (list, repo) => {
        if (repo.split('/')[1] === '*') {
          return resolve(repo.split('/')[0])
            .then((userRepos) => {
              console.log(userRepos);
              return list.concat(userRepos);
            });
        } else {
          list.push(repo);
          return list;
        }
      }, []);
    })
    .then((repos) => {
      return loadRepos(ignore)
        .then((ignorelist) => {
          return repos.filter(repo => !ignorelist.includes(repo))
        })
    });
}

module.exports = getRepos;
