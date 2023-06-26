import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPageV/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { ParticipantProvider } from './components/ParticipantProvider';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';
import { AuthProvider } from './components/AuthProvider/index';
import { AuthRoute } from './components/AuthRoute/index';
import RoomCreateScreen from './components/RoomCreateScreen/RoomCreateScreen';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ParticipantProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ParticipantProvider>
    </VideoProvider>
  );
};

export const ReactApp = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UnsupportedBrowserWarning>
      <Router>
        <AppStateProvider>
          <AuthProvider>
            <Switch>
              <AuthRoute exact path="/">
                <RoomCreateScreen />
              </AuthRoute>
              <AuthRoute exact path="/rooms">
                <RoomCreateScreen />
              </AuthRoute>
              <PrivateRoute exact path="/room/:URLRoomName">
                <VideoApp />
              </PrivateRoute>
              <PrivateRoute exact path="/room/:URLRoomName/:roleName">
                <VideoApp />
              </PrivateRoute>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Redirect to="/" />
            </Switch>
          </AuthProvider>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
  </MuiThemeProvider>
);

ReactDOM.render(<ReactApp />, document.getElementById('root'));
