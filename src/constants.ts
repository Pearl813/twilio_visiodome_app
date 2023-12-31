export const DEFAULT_VIDEO_CONSTRAINTS: MediaStreamConstraints['video'] = {
  width: 1280,
  height: 720,
  frameRate: 24,
};

// These are used to store the selected media devices in localStorage
export const SELECTED_AUDIO_INPUT_KEY = 'TwilioVideoApp-selectedAudioInput';
export const SELECTED_AUDIO_OUTPUT_KEY = 'TwilioVideoApp-selectedAudioOutput';
export const SELECTED_VIDEO_INPUT_KEY = 'TwilioVideoApp-selectedVideoInput';

// This is used to store the current background settings in localStorage
export const SELECTED_BACKGROUND_SETTINGS_KEY = 'TwilioVideoApp-selectedBackgroundSettings';

export const GALLERY_VIEW_ASPECT_RATIO = 9 / 16; // 16:9
export const GALLERY_VIEW_MARGIN = 3;

export const PRESENTER_LINK_NAME = 'presenter';
export const VISIODOMEAPP_LINK_NAME = 'visiodomeapp';

export const RESULT_MESSAGE_SUCCESS = 'success';
export const RESULT_CODE_SUCCESS = 0;

export const DEFAULT_VIDEO_DEVICE_LABEL = 'NDI Webcam Video 1';
export const DEFAULT_AUDIO_DEVICE_LABEL = 'NDI Webcam 1 (NewTek NDI Audio)';
