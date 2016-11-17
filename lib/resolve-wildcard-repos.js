const GitHub = require('github');

function fetchPage (user, page) {
  page = page || 1;
  const github = new GitHub();
  return new Promise((resolve, reject) => {
    console.log(`Fetching page ${page} for user ${user}`);
    github.authenticate({ type: 'token', token: process.env.GITHUB_ACCESS_TOKEN });
    github.repos.getForUser({ username: user, page: page, per_page: 100 }, (err, repos) => {
      if (err) {
        reject(err);
      } else if (repos.length === 100) {
        fetchPage(user, page + 1).then((nextPage) => {
          resolve(repos.concat(nextPage));
        }, reject);
      } else {
        resolve(repos.map(r => {
          return { fork: r.fork, full_name: r.full_name };
        }));
      }
    });
  });
}

function resolveWildcardRepos (user) {
  return fetchPage(user)
    .then((repos) => {
      return repos.filter(r => !r.fork);
    })
    .then((repos) => {
      return repos.map(r => r.full_name);
    });
}

module.exports = resolveWildcardRepos;
