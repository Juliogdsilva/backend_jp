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

  // const sendPayment = async (email, name, text, link) => {
  const sendMailPayment = async (req, res) => {
    const data = { ...req.body };
    if (!data.email || !data.name || !data.text || !data.link) return res.status(400).send({ msg: 'Dados não preenchidos' });

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
                Email: `${data.email}`,
                Name: `${data.name}`,
              },
            ],
            TemplateID: 4629463,
            TemplateLanguage: true,
            Subject: 'Instruções de Pagamento',
            Variables: {
              text: data.text,
              link: data.link,
            },
          },
        ],
      });
    request
      .then(() => {
        res.status(200).send();
      })
      .catch(() => {
        res.status(500).send();
      });

    return true;
  };

  const sendMailComplet = async (first_name, email, cod) => {
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
                Name: `${first_name}`,
              },
            ],
            TemplateID: 4642399,
            TemplateLanguage: true,
            Subject: 'Boas Noticias',
            Variables: {
              cod,
            },
          },
        ],
      });
    request
      .then(() => {
      })
      .catch((err) => {
        console.log(err);
      });

    return true;
  };

  return { sendMailWelcome, sendMailPayment, sendMailComplet };
};
