import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import GenerateRoomLinkScreen from './GenerateRoomLinkScreen/GenerateRoomLinkScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import axios from 'axios';
import Snackbar from '../Snackbar/Snackbar';
import { Typography, Grid, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAuth } from '../AuthProvider';

export enum Steps {
  roomNameStep,
  linkGenerateStep,
  deviceSelectionStep,
}

interface streamURLs {
  presenter: string;
  customer: string;
  visiodome: string;
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks, connect: videoConnect } = useVideoContext();
  const { authUser } = useAuth();
  const { connect: chatConnect } = useChatContext();

  const { userName, URLRoomName, visiodomeapp } = useParams<{
    userName?: string;
    URLRoomName?: string;
    visiodomeapp?: string;
  }>();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageHeader, setMessageHeader] = useState('');
  const [messageType, setMessageType] = useState<any>('');
  const [isCreated, setIsCreated] = useState(false);
  const [mediaError, setMediaError] = useState<Error>();
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiodome, setIsVisiodome] = useState(false);
  const [isGetLink, setIsGetLink] = useState(false);
  const [roomLinks, setRoomLinks] = useState<streamURLs>({
    presenter: '',
    customer: '',
    visiodome: '',
  });

  const history = useHistory();

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
    if (URLRoomName) {
      setRoomName(URLRoomName);
      setIsGetLink(true);
    }
    if (visiodomeapp === 'presenter') {
      setIsLoading(true);
      let urlString: string = window.location.href;
      // Create a URL object
      const url = new URL(urlString);

      if (window.location.search.includes('token')) {
        let token: string = url.searchParams.get('token')!;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .get(`${process.env.REACT_APP_TOKEN_SERVER_URL}/users/validate-user`, { headers })
          .then(res => {
            if (res.data.message === 'success') {
              setIsLoading(false);
              setName(res.data.username);
              setRoomName(res.data.roomName);
              setIsGetLink(false);
              setStep(Steps.deviceSelectionStep);
            } else {
              setIsLoading(false);
              setIsInvalidRoom(false);
            }
          })
          .catch((e: any) => {
            setIsLoading(false);
            setIsInvalidRoom(false);
          });
      } else {
        setIsLoading(false);
        setIsInvalidRoom(true);
      }
    }
    if (visiodomeapp === 'visiodomeapp') {
      setIsLoading(true);
      setIsVisiodome(true);
      let name: string = 'visiodomeapp';
      let roomName: string = URLRoomName!;

      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/validate`, { roomName })
        .then(res => {
          if (res.data.message === 'success') {
            setName(name);
            setRoomName(roomName);
            setStep(Steps.deviceSelectionStep);
            setIsLoading(false);
            // getToken(name, roomName).then(({ token }) => {
            //   videoConnect(token);
            //   process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
            // });
          } else {
            setIsLoading(false);
            setIsInvalidRoom(true);
          }
        })
        .catch(e => console.log(e));
    }
  }, [user, URLRoomName, visiodomeapp]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  useEffect(() => {
    if (authUser && step === Steps.linkGenerateStep) {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${authUser.token}`,
      };
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/get-links`, { roomName: authUser.roomName }, { headers })
        .then(res => {
          console.log(res.data);
          if (res.data.message === 'success') {
            setIsInvalidRoom(false);
            setRoomLinks({
              ...roomLinks,
              presenter: res.data.streamURLs.presenter,
              customer: res.data.streamURLs.customer,
              visiodome: res.data.streamURLs.visiodome,
            });
            setIsLoading(false);
          } else {
            setIsInvalidRoom(true);
            setIsLoading(false);
          }
        })
        .catch(e => {
          setIsInvalidRoom(true);
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [step]);

  const handleRoomName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // @ts-ignore
    if (!window.location.origin.includes('twil.io') && !window.STORYBOOK_ENV) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/validate`, { roomName })
      .then(res => {
        if (res.data.message === 'success') {
          console.log('soefijsoefij');
          setIsLoading(false);
          setStep(Steps.deviceSelectionStep);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleGenerateLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(Steps.deviceSelectionStep);
  };

  const endRoom = () => {
    setIsLoading(true);
    if (authUser) {
      const headers = {
        Authorization: `Bearer ${authUser.token}`,
      };
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/end`, {}, { headers })
        .then(response => {
          if (response.data.message === 'completed') {
            setIsOpen(true);
            setMessageHeader('Success!');
            setMessageContent('Room Closed Successfully.');
            setMessageType('info');
            setIsLoading(false);
            history.replace('/rooms');
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const isSnackbarOpen = isOpen;

  return (
    <IntroContainer>
      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <CircularProgress variant="indeterminate" />
          </div>
          <div>
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              {isVisiodome ? `Joining Meeting...` : `Loading...`}
            </Typography>
          </div>
        </Grid>
      ) : isInvalidRoom ? (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              {isInvalidRoom && isGetLink
                ? `The room is not existed.`
                : `The Room is expired because there is nobody in the room for 2minutes.`}
            </Typography>
          </div>
          {isInvalidRoom && isGetLink ? (
            <></>
          ) : (
            <Button
              variant="contained"
              type="submit"
              color="primary"
              style={{ marginTop: '8px' }}
              onClick={() => {
                history.replace(`/rooms`);
              }}
            >
              Start again.
            </Button>
          )}
        </Grid>
      ) : (
        <>
          <Snackbar
            headline={messageHeader}
            message={messageContent}
            variant={messageType}
            open={isSnackbarOpen}
            handleClose={() => {
              setIsOpen(false);
            }}
          />
          <MediaErrorSnackbar error={mediaError} />
          {step === Steps.roomNameStep && (
            <RoomNameScreen
              name={name}
              roomName={roomName}
              isCreated={isCreated}
              setName={setName}
              setRoomName={setRoomName}
              setIsCreated={setIsCreated}
              handleSubmit={handleRoomName}
            />
          )}
          {step === Steps.linkGenerateStep && (
            <GenerateRoomLinkScreen
              name={name}
              roomName={roomName}
              setStep={setStep}
              roomLinks={roomLinks}
              handleSubmit={handleGenerateLink}
              endRoom={endRoom}
            />
          )}
          {step === Steps.deviceSelectionStep && (
            <DeviceSelectionScreen
              name={name}
              roomName={roomName}
              isCreated={isCreated}
              isGetLink={isGetLink}
              setStep={setStep}
            />
          )}
        </>
      )}
    </IntroContainer>
  );
}
