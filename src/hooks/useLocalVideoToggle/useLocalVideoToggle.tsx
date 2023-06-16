import { LocalVideoTrack } from 'twilio-video';
import { useCallback, useState, useEffect } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalVideoToggle() {
  const { room, localTracks, getLocalVideoTrack, removeLocalVideoTrack, onError } = useVideoContext();
  const localParticipant = room?.localParticipant;
  const videoTrack = localTracks.find(
    track => !track.name.includes('screen') && track.kind === 'video'
  ) as LocalVideoTrack;
  const [isPublishing, setIspublishing] = useState(false);

  // useEffect(() => {
  //   if (room?.localParticipant.identity === 'visiodomeapp') {
  //     setIspublishing(true);
  //   }
  // }, []);

  const toggleVideoEnabled = useCallback(() => {
    console.log(0);
    if (!isPublishing) {
      if (videoTrack) {
        console.log(111, videoTrack);
        const localTrackPublication = localParticipant?.unpublishTrack(videoTrack);
        // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
        localParticipant?.emit('trackUnpublished', localTrackPublication);
        removeLocalVideoTrack();
      } else {
        console.log(2222);
        setIspublishing(true);
        getLocalVideoTrack()
          .then((track: LocalVideoTrack) => localParticipant?.publishTrack(track, { priority: 'low' }))
          .catch(onError)
          .finally(() => {
            setIspublishing(false);
          });
      }
    }
  }, [videoTrack, localParticipant, getLocalVideoTrack, isPublishing, onError, removeLocalVideoTrack]);

  return [!!videoTrack, toggleVideoEnabled] as const;
}
