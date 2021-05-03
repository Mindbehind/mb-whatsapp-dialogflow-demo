const axios = require('axios');
const config = require('../config.json');

const sendWhatsappTextMessage = async params => {
  const request = {
    to: params.to,
    recipient_type: "individual",
    type: "text",
    text: {
      body: params.text,
    }
  };

  return axios.post(`${config.mbBaseUrl}/v1/messages`, request, { headers: { "MB-API-KEY": config.mbAPIKey } });
}

const sendWhatsappImage = async params => {
  const request = {
    to: params.to,
    to: params.to,
    recipient_type: "individual",
    type: "text",
    image: {
      link: params.media,
    }
  };

  return axios.post(`${config.mbBaseUrl}/v1/messages`, request, { headers: { "MB-API-KEY": config.mbAPIKey } });
}

module.exports = {
  sendWhatsappTextMessage,
  sendWhatsappImage,
};
