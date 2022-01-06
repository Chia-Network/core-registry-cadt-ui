import socketIO from 'socket.io-client';
import { messageTypes } from '../../utils/message-types';
import { keyMirror } from '../store-functions';

export const actions = keyMirror(
  'SOCKET_PROJECTS_UPDATE',
  'SOCKET_UNITS_UPDATE',
  'SOCKET_STATUS',
);

export const SOCKET_STATUS = keyMirror(
  'OFFLINE',
  'CONNECTED',
  'AUTHENTICATED',
  'UNAUTHORIZED',
);

let socket;
let interval;

const initListenersForEachMessageType = dispatch => {
  Object.keys(messageTypes).forEach(key => {
    console.log('### Listening for: ' + key);
    socket.on(key, data => {
      console.log('### received message for: ' + key);

      switch (key) {
        case 'change:projects':
          console.log('projects have been updated');
          dispatch(projectsHaveBeenUpdated(data));
          break;
        case 'change:units':
          console.log('units have been updated');
          dispatch(unitsHaveBeenUpdated(data));
          break;
        default:
          break;
      }
    });
  });
};

export const disconnectSocket = () => {
  socket && socket.emit('forceDisconnect');
  socket && socket.disconnect();
  if (interval) {
    clearInterval(interval);
  }
};

// Helper to emit a redux action to our websocket server
export const emitAction = actionCreator => {
  return (...args) => {
    // This return the action object which gets sent to our backend
    // server via the socket connection
    const result = actionCreator.apply(this, args);
    socket.emit(result.key, {
      ...result.payload,
      type: result.type,
    });
    return result;
  };
};

const reconnectSocket = dispatch => {
  if (!socket || (socket && !socket.connected)) {
    dispatch(initiateSocket());
    setTimeout(() => {
      if (!socket || (socket && !socket.connected)) {
        reconnectSocket(dispatch);
      }
    }, 5000);
  }
};

export const initiateSocket = () => {
  disconnectSocket();

  const WS_HOST = `http://localhost:3030/v1/ws`;
  const transports = ['websocket', 'polling'];

  socket = socketIO(WS_HOST, {
    path: '/socket.io',
    transports,
  });

  console.log('initiateSocket');
  return dispatch => {
    socket
      .on('error', err => {
        reconnectSocket(dispatch);
        console.log('socket error' + err);
      })
      .on('authenticated', () => {
        console.log('### Socket Authenticated ###');
        dispatch(setSocketStatus(SOCKET_STATUS.AUTHENTICATED));

        console.log('Joining project updates');
        socket.emit('/subscribe', 'projects', response => {
          console.log('Following projects updates', response);
        });

        console.log('Joining units updates');
        socket.emit('/subscribe', 'units', response => {
          console.log('Following units updates', response);
        });
      })
      .on('disconnect', reason => {
        console.log('### socket disconnected ###', reason);
        dispatch(setSocketStatus(SOCKET_STATUS.OFFLINE));
        socket = null;
        reconnectSocket(dispatch);
      })
      .on('reconnect_error', err => {
        console.log('### socket reconnect error ###', err);
        dispatch(setSocketStatus(SOCKET_STATUS.OFFLINE));
        socket = null;
        reconnectSocket(dispatch);
      })
      .on('reconnect_failed', err => {
        console.log('### socket reconnect error ###', err);
        dispatch(setSocketStatus(SOCKET_STATUS.OFFLINE));
        socket = null;
        reconnectSocket(dispatch);
      })
      .on('unauthorized', msg => {
        dispatch(setSocketStatus(SOCKET_STATUS.UNAUTHORIZED));
        console.error(msg);
      })
      .on('connect', () => {
        console.log('Attempting to connect to socket_id: ', socket.id);
        console.log('### Socket Connected ###');
        dispatch(setSocketStatus(SOCKET_STATUS.CONNECTED));
        socket.emit('authentication');
      });

    initListenersForEachMessageType(dispatch);

    interval = setInterval(() => {
      if (!socket || (socket && !socket.connected)) {
        dispatch(setSocketStatus(SOCKET_STATUS.OFFLINE));
        clearInterval(interval);
        reconnectSocket(dispatch);
      }
    }, 5000);
  };
};

export const emit = (type, payload) => {
  socket && socket.emit(type, payload);
};

export const setSocketStatus = status => {
  console.log('CONNECTION:', status);
  return {
    type: actions.SOCKET_STATUS,
    payload: status,
  };
};

export const projectsHaveBeenUpdated = data => {
  return dispatch => {
    if (window.location.href.includes('/projects')) {
      dispatch({
        type: actions.SOCKET_PROJECTS_UPDATE,
        key: 'change:projects',
        payload: {
          ...data,
        },
      });
    }
  };
};

export const unitsHaveBeenUpdated = data => {
  return dispatch => {
    if (window.location.href.includes('/units')) {
      dispatch({
        type: actions.SOCKET_UNITS_UPDATE,
        key: 'change:units',
        payload: {
          ...data,
        },
      });
    }
  };
};
