const nconf = require('nconf');
const AWS = require('aws-sdk');

const awsConfig = nconf.get('aws');
const source = awsConfig.ses.source;

const SES = new AWS.SES({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
  apiVersion: awsConfig.apiVersion,
});

/**
 * @param {String|String[]} emails - An email or an array of emails
 * @param {String} message - Message to sent to the provided email(s)
 * @param {String} subject - The subject heading for the email, defaults to Partneur Notifications if not defined
 */
const sendEmail = (emails, message, subject = 'Chimichanga Notifications') => {
  const addresses = Array.isArray(emails) ? emails : [emails];

  const params = {
    Destination: {
      BccAddresses: addresses,
    },
    Message: {
      Body: {
        Html: {
          Data: message,
        }
      },
      Subject: {
        Data: subject,
      }
    },
    Source: source,
  };

  return new Promise((resolve, reject) => {
    SES.sendEmail(params, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

module.exports = {
  sendEmail
};
