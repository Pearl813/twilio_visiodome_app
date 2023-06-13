import { RequestHandler } from 'express';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const checkValidRoom: RequestHandler = (req, res) => {
  const roomName = req.body.roomName;
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[streamURL][$eq]=${roomName}`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.length === 0) {
        res.status(200).send({ message: 'No exist' });
      } else {
        client.video.v1
          .rooms(roomName)
          .fetch()
          .then((room: any) => {
            res.status(200).send({
              message: 'success',
              roomName: roomName,
              streamURLs: {
                presenter: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/presenter?token=${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
                customer: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}`,
                visiodome: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/visiodomeapp`,
              },
            });
          })
          .catch((e: any) => {
            res.status(200).send({ message: 'no in progress room.' });
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};
