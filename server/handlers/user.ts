import { RequestHandler } from 'express';
import axios from 'axios';
import { RESULT_CODE_SUCCESS, RESULT_MESSAGE_SUCCESS } from '../constants';

export const validatePresenter: RequestHandler = (req, res) => {
  const username = req.body.username;
  const headers = {
    Authorization: `Bearer ${process.env.REACT_APP_STRAPI_ACCESS_TOKEN}`,
  };

  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/?filters[username][$eq]=${username}`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.length === 0) {
        res.status(200).send({ code: 1, message: 'No exist' });
      } else {
        res
          .status(200)
          .send({ code: RESULT_CODE_SUCCESS, message: RESULT_MESSAGE_SUCCESS, roomName: roomDetail.data[0].streamURL });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ code: -1, error });
    });
};

export const validateToken: RequestHandler = (req, res) => {
  const accessToken = req.headers.authorization;

  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(roomDetail => {
      if (roomDetail.data.username) {
        res.status(200).send({
          code: RESULT_CODE_SUCCESS,
          message: RESULT_MESSAGE_SUCCESS,
          username: roomDetail.data.username,
          roomName: roomDetail.data.streamURL,
        });
      } else {
        res.status(200).send({ code: 1, message: 'No exist' });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ code: -1, error });
    });
};

export const login: RequestHandler = (req, res) => {
  axios
    .post(`${process.env.REACT_APP_STRAPI_URL}/api/auth/local`, {
      identifier: req.body.email,
      password: req.body.password,
    })
    .then(authResponse => {
      if (authResponse.data.user.PackageType === 'Mobile') {
        res.status(200).send({
          code: RESULT_CODE_SUCCESS,
          message: RESULT_MESSAGE_SUCCESS,
          payload: {
            token: authResponse.data.jwt,
            username: authResponse.data.user.username,
            roomName: authResponse.data.user.streamURL,
          },
        });
      } else {
        res.status(200).send({ code: 1, message: 'permission error' });
      }
    })
    .catch((error: any) => {
      res.status(500).send({ code: -1, error });
    });
};