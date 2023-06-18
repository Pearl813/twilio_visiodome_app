import { useState, useEffect } from 'react';
import { LocalAudioTrack, LocalVideoTrack, RemoteAudioTrack, RemoteVideoTrack } from 'twilio-video';

type TrackType = LocalAudioTrack | LocalVideoTrack | RemoteAudioTrack | RemoteVideoTrack | undefined;

export default function useIsTrackEnabled(track: TrackType) {
  const [isEnabled, setIsEnabled] = useState(track ? track.isEnabled : false);

  useEffect(() => {
    console.log(track?.isEnabled, track, 'useIsTrackEnabled');
    setIsEnabled(track ? track.isEnabled : false);
    if (track) {
      const setEnabled = () => setIsEnabled(true);
      const setDisabled = () => setIsEnabled(false);
      track.on('enabled', setEnabled);
      track.on('disabled', setDisabled);
      return () => {
        track.off('enabled', setEnabled);
        track.off('disabled', setDisabled);
      };
    }
  }, [track]);

  return isEnabled;
}
