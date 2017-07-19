// const ejs = require('ejs');
// const awsUtils = require('./aws');
//
// /**
//  *
//  * @param {String} emailName - Name of the template
//  * @param {Object} data - Data to fill the EJS template with
//  */
// const getEmailTemplate = (emailName, data) => {
//   const options = {
//     cache: true,
//     filename: emailName,
//   };
//   return new Promise((resolve, reject) => {
//     ejs.renderFile(`${__dirname}/../emails/templates/${emailName}.ejs`,
//       data, options, (err, emailTemplate) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(emailTemplate);
//       });
//   });
// };
//
//
// /**
//  * Sends an email with a template
//  * @param {String} dest - Email address of the user
//  * @param {String} emailName - The name of the email template
//  * @param {Object} data - Data to populate the EJS template with
//  * @param {String} emailSubject - Subject heading of the email
//  * @return {Promise}
//  */
// const sendEmail = (dest, emailName, data, emailSubject) =>
//   getEmailTemplate(emailName, data)
//     .then(email => awsUtils.sendEmail(dest, email, emailSubject));
//
// module.exports = {
//   getEmailTemplate,
//   sendEmail,
// };

const sendEmail = (dest, emailName, data, emailSubject) => {
  console.log('EMAIL');
  console.log(dest, emailName, data, emailSubject);
}

module.exports = {
  sendEmail
}
