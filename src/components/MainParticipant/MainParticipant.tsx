import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React from 'react';
import useMainParticipant from '../../hooks/useMainParticipant/useMainParticipant';
import useSelectedParticipant from '../VideoProvider/useSelectedParticipant/useSelectedParticipant';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { LocalVideoTrack } from 'twilio-video';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import { DEFAULT_VIDEO_DEVICE_LABEL } from '../../constants';

export default function MainParticipant() {
  const mainParticipant = useMainParticipant();
  const { room, localTracks } = useVideoContext();
  const localParticipant = room!.localParticipant;
  const [selectedParticipant] = useSelectedParticipant();
  const screenShareParticipant = useScreenShareParticipant();

  const videoPriority =
    (mainParticipant === selectedParticipant || mainParticipant === screenShareParticipant) &&
    mainParticipant !== localParticipant
      ? 'high'
      : null;

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);

  console.log('this is mediaStreamTrack-----', mediaStreamTrack);
  console.log('this is local Track-----', localVideoTrack);

  if (mediaStreamTrack?.label === DEFAULT_VIDEO_DEVICE_LABEL) {
    console.log('this is right device', mediaStreamTrack?.label);
    // setMirrorForceDisabled(true);
  }
  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        videoOnly
        enableScreenShare={mainParticipant !== localParticipant}
        videoPriority={videoPriority}
        isLocalParticipant={mainParticipant === localParticipant}
        isForceMirroringDisabled={true}
      />
    </MainParticipantInfo>
  );
}
