import { RequestHandler } from 'express';
import axios from 'axios';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

export const startRoom: RequestHandler = (req, res) => {
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
        client.video.v1.rooms
          .list({
            uniqueName: roomDetail?.data?.streamURL,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length === 0) {
              client.video.v1.rooms
                .create({ uniqueName: roomDetail.data.streamURL, emptyRoomTimeout: 2 })
                .then((room: any) => {
                  if (room.sid) {
                    res.status(200).send({
                      message: 'Room is created successfully!',
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
            } else if (room[0].uniqueName === roomDetail?.data?.streamURL) {
              res.status(200).send({
                message: 'This room is already created!',
                roomName: roomDetail.data.streamURL,
                streamURLs: {
                  presenter: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/presenter?token=${token[1]}`,
                  customer: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}`,
                  visiodome: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/visiodomeapp`,
                },
              });
            }
          })
          .catch((error: any) => {
            res.status(500).send(error);
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const endRoom: RequestHandler = (req, res) => {
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
                });
            }
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ error });
    });
};

export const getRoomLinks: RequestHandler = (req, res) => {
  const roomName = req.params.roomName;
  const accessToken = req.headers.authorization;
  const token = accessToken?.split(' ')!;
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[streamURL][$eq]=${roomName}`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.length === 0) {
        res.status(200).send({ message: 'No exist' });
      } else {
        client.video.v1.rooms
          .list({
            uniqueName: roomName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length > 0) {
              res.status(200).send({
                message: 'success',
                roomName: roomName,
                streamURLs: {
                  presenter: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/presenter?token=${token[1]}`,
                  customer: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}`,
                  visiodome: `${process.env.REACT_APP_FRONTEND_URL}/room/${roomName}/visiodomeapp`,
                },
              });
            } else {
              res.status(200).send({ message: 'no in progress room.' });
            }
          });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};

export const validateRoom: RequestHandler = (req, res) => {
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
        client.video.v1.rooms
          .list({
            uniqueName: roomName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length > 0) {
              res.status(200).send({
                message: 'success',
              });
            } else {
              res.status(200).send({ message: 'no in progress room.' });
            }
          });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
};
