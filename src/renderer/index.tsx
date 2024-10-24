import 'flowbite';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
// @ts-ignore
import { persistor, store } from '@/store';
import { BrowserRouter } from 'react-router-dom';
import { coreRegistryUiBaseName } from '@/utils/iframe-utils';

const root = ReactDOM.createRoot(document.getElementById('root') || document.createElement('div'));

// see https://github.com/Chia-Network/core-registry-ui for basename use case
const basename = coreRegistryUiBaseName();
localStorage.theme = 'light';

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
