import React from 'react';
import { Participant, Track } from 'twilio-video';
import Publication from '../Publication/Publication';
import usePublications from '../../hooks/usePublications/usePublications';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import { DEFAULT_VIDEO_DEVICE_LABEL } from '../../constants';
import { LocalVideoTrack } from 'twilio-video';

interface ParticipantTracksProps {
  participant: Participant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  videoPriority?: Track.Priority | null;
  isLocalParticipant?: boolean;
}

/*
 *  The object model for the Room object (found here: https://www.twilio.com/docs/video/migrating-1x-2x#object-model) shows
 *  that Participant objects have TrackPublications, and TrackPublication objects have Tracks.
 *
 *  The React components in this application follow the same pattern. This ParticipantTracks component renders Publications,
 *  and the Publication component renders Tracks.
 */

export default function ParticipantTracks({
  participant,
  videoOnly,
  enableScreenShare,
  videoPriority,
  isLocalParticipant,
}: ParticipantTracksProps) {
  const publications = usePublications(participant);
  const { localTracks } = useVideoContext();

  const localVideoTrack = localTracks.find(track => track.kind === 'video') as LocalVideoTrack | undefined;
  const mediaStreamTrack = useMediaStreamTrack(localVideoTrack);
  let isForceMirroringDisabled = false;

  if (isLocalParticipant && mediaStreamTrack?.label === DEFAULT_VIDEO_DEVICE_LABEL) {
    isForceMirroringDisabled = true;
  }

  let filteredPublications;

  if (enableScreenShare && publications.some(p => p.trackName.includes('screen'))) {
    // When displaying a screenshare track is allowed, and a screen share track exists,
    // remove all video tracks without the name 'screen'.
    filteredPublications = publications.filter(p => p.trackName.includes('screen') || p.kind !== 'video');
  } else {
    // Else, remove all screenshare tracks
    filteredPublications = publications.filter(p => !p.trackName.includes('screen'));
  }

  return (
    <>
      {filteredPublications.map(publication => (
        <Publication
          key={publication.kind}
          publication={publication}
          participant={participant}
          isLocalParticipant={isLocalParticipant}
          videoOnly={videoOnly}
          videoPriority={videoPriority}
          isForceMirroringDisabled={isForceMirroringDisabled}
        />
      ))}
    </>
  );
}
