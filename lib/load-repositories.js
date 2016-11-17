const https = require('https');
const bl = require('bl');

function read (repo) {
  const url = process.env.EVERGREEN_REPOSITORY_LIST_URL;
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300) {
        return reject(new Error(`Repository list not found at ${url}`));
      }
      response.pipe(bl((err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(data.toString()));
      }));
    }).on('error', reject);
  });
}

module.exports = read;
