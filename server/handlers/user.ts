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
    .then(response => {
      if (response.data.length === 0) {
        res.status(200).send({ code: -1, message: 'No exist' });
      } else {
        res
          .status(200)
          .send({ code: RESULT_CODE_SUCCESS, message: RESULT_MESSAGE_SUCCESS, roomName: response.data[0].roomName });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const validateToken: RequestHandler = (req, res) => {
  const accessToken = req.headers.authorization;

  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
    .then(response => {
      console.log(response.data);
      if (response.data.username) {
        res.status(200).send({
          code: RESULT_CODE_SUCCESS,
          message: RESULT_MESSAGE_SUCCESS,
          username: response.data.username,
          roomName: response.data.roomName,
        });
      } else {
        res.status(200).send({ code: -1, message: 'No exist' });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const login: RequestHandler = (req, res) => {
  axios
    .post(`${process.env.REACT_APP_STRAPI_URL}/api/auth/local`, {
      identifier: req.body.email,
      password: req.body.password,
    })
    .then(response => {
      if (
        response.data.user.PackageType === 'Developer' ||
        response.data.user.PackageType === 'Pro1C2M' ||
        response.data.user.PackageType === 'Demo'
      ) {
        console.log(response.data.user);
        res.status(200).send({
          code: RESULT_CODE_SUCCESS,
          message: RESULT_MESSAGE_SUCCESS,
          payload: {
            token: response.data.jwt,
            username: response.data.user.username,
          },
        });
      } else {
        res.status(200).send({ code: -1, message: 'permission error' });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};

export const generateRoomName: RequestHandler = (req, res) => {
  const accessToken = req.headers.authorization;

  const headers = {
    Authorization: `${accessToken}`,
  };
  axios
    .get(`${process.env.REACT_APP_STRAPI_URL}/api/user/generateRoomName`, { headers })
    .then(response => {
      if (response.data.success) {
        res.status(200).send({
          code: RESULT_CODE_SUCCESS,
          message: RESULT_MESSAGE_SUCCESS,
          roomName: response.data.roomName,
        });
      } else {
        res.status(200).send({ code: -1, message: 'No exist' });
      }
    })
    .catch((error: any) => {
      res.status(500).send(error);
    });
};
