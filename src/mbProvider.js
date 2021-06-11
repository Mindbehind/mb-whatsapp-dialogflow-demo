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
    recipient_type: "individual",
    type: "image",
    image: {
      link: params.media.url,
    }
  };
  const response = axios.post(`${config.mbBaseUrl}/v1/messages`, request, { headers: { "MB-API-KEY": config.mbAPIKey } });
  return response;
}

module.exports = {
  sendWhatsappTextMessage,
  sendWhatsappImage,
};
