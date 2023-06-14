import { RequestHandler } from 'express';
import axios from 'axios';

export const checkIsOrganizer: RequestHandler = (req, res) => {
  const username = req.body.username;
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
  };

  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[username][$eq]=${username}`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.length === 0) {
        res.status(200).send({ message: 'No exist' });
      } else {
        res.status(200).send({ message: 'success', roomName: roomDetail.data[0].streamURL });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const checkIsValidUser: RequestHandler = (req, res) => {
  const accessToken = req.headers.authorization;

  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.username) {
        res
          .status(200)
          .send({ message: 'success', username: roomDetail.data.username, roomname: roomDetail.data.streamURL });
      } else {
        res.status(200).send({ message: 'No exist' });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ error });
    });
};
