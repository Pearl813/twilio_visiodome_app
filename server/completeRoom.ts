import { RequestHandler } from 'express';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const completeRoom: RequestHandler = (req, res) => {
  const accessToken = req.headers.authorization;

  const headers = {
    Authorization: `${accessToken}`,
  };

  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(roomDetail => {
      let userId = roomDetail.data.id;
      let uniqueName = roomDetail.data.streamURL;
      if (uniqueName === null) {
        res.status(500).send({ message: 'No exist.' });
      } else {
        client.video.v1.rooms
          .list({
            uniqueName: uniqueName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length === 0) {
              res.status(500).send({ message: 'no exist' });
            } else if (room[0].uniqueName === uniqueName) {
              client.video.v1
                .rooms(uniqueName)
                .update({ status: 'completed' })
                .then((room: { status: any }) => {
                  if (room.status === 'completed') res.status(200).send({ message: 'completed' });
                  // axios
                  //   .put(
                  //     `${process.env.REACT_APP_STRAPI_URL}/api/users/${userId}`,
                  //     {
                  //       streamURL: null,
                  //       description: null,
                  //     },
                  //     { headers }
                  //   )
                  //   .then(updateResponse => {
                  //     res.status(200).send({ message: 'completed' });
                  //   })
                  //   .catch((error: any) => {
                  //     res.status(500).send(error);
                  //     console.log(error);
                  //   });
                });
            }
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ error });
    });
};
