import React from 'react';
import useTrack from '../../hooks/useTrack/useTrack';
import VideoTrack from '../VideoTrack/VideoTrack';

import { IVideoTrack } from '../../types';
import { LocalTrackPublication, Participant, RemoteTrackPublication, Track } from 'twilio-video';

interface PublicationProps {
  publication: LocalTrackPublication | RemoteTrackPublication;
  participant: Participant;
  isLocalParticipant?: boolean;
  videoOnly?: boolean;
  videoPriority?: Track.Priority | null;
  isForceMirroringDisabled?: boolean;
}

export default function Publication({
  publication,
  isLocalParticipant,
  videoPriority,
  isForceMirroringDisabled,
}: PublicationProps) {
  const track = useTrack(publication);

  if (!track) return null;

  console.log(isForceMirroringDisabled);
  // Even though we only have one case here, let's keep this switch() in case
  // we even need to add a 'data' case for rendering DataTracks.
  switch (track.kind) {
    case 'video':
      return (
        <VideoTrack
          track={track as IVideoTrack}
          priority={videoPriority}
          isLocal={!track.name.includes('screen') && isLocalParticipant}
          isForceMirroringDisabled={isForceMirroringDisabled}
        />
      );
    // All participant audio tracks are rendered in ParticipantAudioTracks.tsx
    default:
      return null;
  }
}
