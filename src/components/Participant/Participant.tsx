import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import { DEFAULT_VIDEO_DEVICE_LABEL } from '../../constants';
import { LocalVideoTrack } from 'twilio-video';
interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
}

export function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant,
  isDominantSpeaker,
}: ParticipantProps) {
  const { localTracks } = useVideoContext();

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  let isForceMirroringDisabled = false;

  console.log('this is mediaStreamTrack-----', mediaStreamTrack);
  console.log('this is local Track-----', localVideoTrack);

  if (mediaStreamTrack?.label === DEFAULT_VIDEO_DEVICE_LABEL) {
    console.log('this is right device', mediaStreamTrack?.label);
    isForceMirroringDisabled = true;
  }

  console.log(isLocalParticipant, participant);
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
      isDominantSpeaker={isDominantSpeaker}
    >
      <ParticipantTracks
        participant={participant}
        videoOnly={videoOnly}
        enableScreenShare={enableScreenShare}
        isLocalParticipant={isLocalParticipant}
        isForceMirroringDisabled={isForceMirroringDisabled}
      />
    </ParticipantInfo>
  );
}

export default React.memo(Participant);
