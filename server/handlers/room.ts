import { RequestHandler } from 'express';
import axios from 'axios';
import { RESULT_CODE_SUCCESS, RESULT_MESSAGE_SUCCESS, PRESENTER_LINK_NAME, VISIODOMEAPP_LINK_NAME } from '../constants';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const generateStreamURLs = (serverURL: string, roomName: string, token: string) => {
  return {
    presenter: `${serverURL}/room/${roomName}/${PRESENTER_LINK_NAME}?token=${token}`,
    customer: `${serverURL}/room/${roomName}`,
    visiodome: `${serverURL}/room/${roomName}/${VISIODOMEAPP_LINK_NAME}`,
  };
};

export const startRoom: RequestHandler = (req, res) => {
  const roomName = req.body.roomName;
  const accessToken = req.headers.authorization;
  const token = accessToken?.split(' ')!;
  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(response => {
      if (response?.data?.roomName !== null) {
        client.video.v1.rooms
          .list({
            uniqueName: response?.data?.roomName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length === 0) {
              client.video.v1.rooms
                .create({ uniqueName: roomName, emptyRoomTimeout: 2 })
                .then((room: any) => {
                  if (room.sid) {
                    res.status(200).send({
                      code: RESULT_CODE_SUCCESS,
                      message: RESULT_MESSAGE_SUCCESS,
                      roomName: roomName,
                      streamURLs: generateStreamURLs(process.env.REACT_APP_FRONTEND_URL!, roomName, token[1]),
                    });
                  }
                })
                .catch((e: any) => {
                  console.log(e);
                });
            } else if (room[0].uniqueName === response?.data?.roomName) {
              res.status(200).send({
                code: 1,
                message: 'This room is already created!',
                roomName: roomName,
                streamURLs: generateStreamURLs(process.env.REACT_APP_FRONTEND_URL!, roomName, token[1]),
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
    .then(response => {
      let uniqueName = response.data.roomName;
      if (uniqueName === null) {
        res.status(200).send({ code: -1, message: 'No exist.' });
      } else {
        client.video.v1.rooms
          .list({
            uniqueName: uniqueName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length === 0) {
              res.status(200).send({ code: -1, message: 'no exist' });
            } else if (room[0].uniqueName === uniqueName) {
              client.video.v1
                .rooms(uniqueName)
                .update({ status: 'completed' })
                .then((room: { status: any }) => {
                  if (room.status === 'completed')
                    res.status(200).send({ code: RESULT_CODE_SUCCESS, message: 'completed' });
                });
            }
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
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
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[roomName][$eq]=${roomName}`, { headers })
    .then(response => {
      if (response.data.length === 0) {
        res.status(200).send({ code: -1, message: 'No exist' });
      } else {
        client.video.v1.rooms
          .list({
            uniqueName: roomName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length > 0) {
              res.status(200).send({
                code: RESULT_CODE_SUCCESS,
                message: RESULT_MESSAGE_SUCCESS,
                roomName: roomName,
                streamURLs: generateStreamURLs(process.env.REACT_APP_FRONTEND_URL!, roomName, token[1]),
              });
            } else {
              res.status(200).send({ code: -1, message: 'no in progress room.' });
            }
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const validateRoom: RequestHandler = (req, res) => {
  const roomName = req.body.roomName;
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[roomName][$eq]=${roomName}`, { headers })
    .then(response => {
      if (response.data.length === 0) {
        res.status(200).send({ code: -1, message: 'No exist' });
      } else {
        client.video.v1.rooms
          .list({
            uniqueName: roomName,
            status: 'in-progress',
          })
          .then((room: any) => {
            if (room.length > 0) {
              res.status(200).send({
                code: RESULT_CODE_SUCCESS,
                message: RESULT_MESSAGE_SUCCESS,
              });
            } else {
              res.status(200).send({ code: -1, message: 'no in progress room.' });
            }
          });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};
