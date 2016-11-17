const Promise = require('bluebird');

const resolve = require('./resolve-wildcard-repos');
const loadRepos = require('./load-repositories');

function getRepos () {
  return loadRepos()
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
    });
}

module.exports = getRepos;
