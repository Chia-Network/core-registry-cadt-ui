import { createSlice } from '@reduxjs/toolkit';
import initialState from './app.initialstate';

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLocale: (state, { payload }) => {
      state.locale = payload;
    },
    setHost: (state, { payload }) => {
      state.apiHost = payload.apiHost;

      if (payload.apiKey) {
        state.apiKey = payload.apiKey;
      }
    },
    resetApiHost: (state) => {
      state.apiHost = initialState.apiHost;
      state.apiKey = initialState.apiKey;
    },
    setConfigLoaded: (state, { payload }: { payload: { configLoaded: boolean } }) => {
      state.configFileLoaded = payload.configLoaded;
    },
    toggleThemeMode: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
    setIsCoreRegistryUiApp: (state, { payload }: { payload: { isCoreRegistryUiApp: boolean } }) => {
      state.isCoreRegistryUiApp = payload.isCoreRegistryUiApp;
    },
  },
});

export const { setLocale, setHost, resetApiHost, setConfigLoaded, toggleThemeMode, setIsCoreRegistryUiApp } =
  appSlice.actions;

export const selectCurrentHost = (state) => state.app.host;

export default appSlice.reducer;
