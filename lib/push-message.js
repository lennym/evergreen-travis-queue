const AWS = require('aws-sdk');

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

function pushMessage (repo) {
  const params = {
    QueueUrl: process.env.EVERGREEN_SQS_QUEUE,
    MessageBody: JSON.stringify({ repo: repo })
  };
  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err) => {
      console.log(`Pushing SQS message: ${repo}`);
      err ? reject(err) : resolve();
    });
  });
}

module.exports = pushMessage;
