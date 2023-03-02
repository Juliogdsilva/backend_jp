const Mailjet = require('node-mailjet');

// eslint-disable-next-line no-unused-vars
module.exports = (app) => {
  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_SECRET_KEY,
  });

  const sendMailWelcome = async (email, name) => {
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'no-reply@responsiblegamingseminar.com.br',
              Name: 'Responsible Gaming',
            },
            To: [
              {
                Email: `${email}`,
                Name: `${name}`,
              },
            ],
            TemplateID: 4619357,
            TemplateLanguage: true,
            Subject: 'Bem-Vindo',
            Variables: {},
          },
        ],
      });
    request
      .then(() => {
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { sendMailWelcome };
};
