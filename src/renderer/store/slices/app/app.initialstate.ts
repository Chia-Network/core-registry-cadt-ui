export interface AppState {
  locale?: string | null;
  apiHost: string;
  apiKey?: string | null;
  configFileLoaded: boolean;
  isDarkTheme: boolean;
  isCoreRegistryUiApp: boolean;
}

const initialState: AppState = {
  locale: null,
  apiHost: '', // Empty string means no default API host
  apiKey: null,
  configFileLoaded: false,
  isDarkTheme: false,
  isCoreRegistryUiApp: false,
};

export default initialState;
