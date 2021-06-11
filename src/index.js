const express = require('express');
const dialogflow = require('dialogflow');
const whatsappClient = require('./mbProvider');
const { trendsHandler } = require('./trendsIntent');
const { availabilityHandler } = require('./availabilityIntent');
const { priceHandler } = require('./priceIntent');
const config = require('../config.json');


const messageHandler = async (req, res) => {
  const targetMessage = req.body.messages[0];
  try {
    const projectId = config.projectId;
    const sessionId = targetMessage.from;
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: targetMessage.text.body,
          languageCode: 'en-US',
        },
      },
    };

    const result = await sessionClient.detectIntent(request);
    let response;

    switch (result[0].queryResult.action) {
      case 'fashion.trends':
        response = trendsHandler(result[0]);
        break;

      case 'product.availability':
        response = availabilityHandler(result[0]);
        break;

      case 'product.price':
        response = priceHandler(result[0]);
        break;

      default:
        response = {
          text: result[0].queryResult.fulfillmentText,
        };
    }
    
    if (config.debug) {
      console.log(require('util').inspect(response, false, 15));
    } else {
      await whatsappClient.sendWhatsappTextMessage({
        to: targetMessage.from,
        text: response.text,
      });
      if (response.pictures) {
        for (let picture of response.pictures) {
          await whatsappClient.sendWhatsappImage({
            to: targetMessage.from,
            media: picture,
          });
        }
      }
    }

    res.status(204).send();

  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}

const app = express();
app.use(express.json());
app.post('/callback/message', messageHandler);
app.listen(config.port, () => console.log(`Server listening on port ${config.port}.`));

module.exports = {
  config,
};
