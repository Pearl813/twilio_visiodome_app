import { RequestHandler } from 'express';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const createRoom: RequestHandler = (req, res) => {
  const roomName = req.body.roomName;
  const accessToken = req.headers.authorization;
  const token = accessToken?.split(' ')!;

  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(roomDetail => {
      if (roomDetail?.data?.streamURL !== null) {
        // res.status(403).send({ message: 'Already Exist.' });
        client.video.v1.rooms
          .create({ uniqueName: roomDetail.data.streamURL })
          .then((room: any) => {
            console.log(room.sid);
            if (room.sid) {
              res.status(200).send({
                message: 'room created',
                roomName: roomDetail.data.streamURL,
                streamURLs: {
                  presenter: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/presenter?token=${token[1]}`,
                  customer: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}`,
                  visiodome: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/visiodomeapp`,
                },
              });
            }
          })
          .catch((e: any) => {
            console.log(e);
          });
      } else {
        let userId = roomDetail.data.id;
        const streamURLs: object = {
          presenter: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/presenter?token=${accessToken}`,
          customer: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}`,
          visiodome: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/visiodomeapp`,
        };
        let streamURL: string = JSON.stringify(streamURLs).replace('/"/g', '\\"');

        axios
          .put(
            `${process.env.REACT_APP_STRAPI_URL}/api/users/${userId}`,
            {
              streamURL: roomName,
              description: streamURL,
            },
            { headers }
          )
          .then(updateResponse => {
            res
              .status(200)
              .send({ roomName: updateResponse.data.streamURL, streamURLs: updateResponse.data.description });
          })
          .catch((error: any) => {
            res.status(500).send(error);
          });
      }
    })
    .catch((error: any) => {
      console.log(error);
      res.status(500).send(error);
    });
};
