import React, { useEffect } from 'react';
import { styled, Theme } from '@material-ui/core/styles';

import MenuBar from './components/MenuBar/MenuBar';
import MobileTopMenuBar from './components/MobileTopMenuBar/MobileTopMenuBar';
import PreJoinScreens from './components/PreJoinScreens/PreJoinScreens';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import RecordingNotifications from './components/RecordingNotifications/RecordingNotifications';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';
import { SELECTED_VIDEO_INPUT_KEY } from './constants';
import { LocalVideoTrack } from 'twilio-video';
import useVideoContext from './hooks/useVideoContext/useVideoContext';

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: '1fr auto',
});

const Main = styled('main')(({ theme }: { theme: Theme }) => ({
  overflow: 'hidden',
  paddingBottom: `${theme.footerHeight}px`, // Leave some space for the footer
  background: 'black',
  [theme.breakpoints.down('sm')]: {
    paddingBottom: `${theme.mobileFooterHeight + theme.mobileTopBarHeight}px`, // Leave some space for the mobile header and footer
  },
}));

export default function App() {
  const roomState = useRoomState();
  const { localTracks } = useVideoContext();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();

  useEffect(() => {
    const selectedVideoDeviceId = window.localStorage.getItem(SELECTED_VIDEO_INPUT_KEY);
    console.log(selectedVideoDeviceId);
    const videoTrack = localTracks.find(
      track => !track.name.includes('screen') && track.kind === 'video'
    ) as LocalVideoTrack;
    console.log(videoTrack);
    console.log(localTracks);
    // console.log('seofijseofijseofij');
    // getDeviceInfo().then(({ videoInputDevices, hasVideoInputDevices }) => {
    //   if (hasVideoInputDevices === true) {
    //     const visiodomeVideoDevice = videoInputDevices.find(device => device.label === DEFAULT_VIDEO_DEVICE_LABEL);
    // const videoTrack = localTracks.find(
    //   track => !track.name.includes('screen') && track.kind === 'video'
    // ) as LocalVideoTrack;
    //     console.log(visiodomeVideoDevice, videoTrack.mediaStreamTrack.label);
    //   }
    // });
  }, []);

  return (
    <Container style={{ height }}>
      {roomState === 'disconnected' ? (
        <PreJoinScreens />
      ) : (
        <Main>
          <ReconnectingNotification />
          <RecordingNotifications />
          <MobileTopMenuBar />
          <Room />
          <MenuBar />
        </Main>
      )}
    </Container>
  );
}
