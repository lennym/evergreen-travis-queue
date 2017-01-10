const https = require('https');
const bl = require('bl');

function read (url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode >= 300) {
        return reject(new Error(`No file found at ${url}`));
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
