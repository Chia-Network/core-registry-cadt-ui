/*
  this app can be run as a child application of the unified 'core-registry-ui' application
  these functions provide functionality for managing app behavior when run as a child app
  see https://github.com/Chia-Network/core-registry-ui
 */

export interface ParentSettings {
  colors?: any;
  selectedLanguageCode?: string;
  apiHost?: string;
  apiKey?: string;
}

export const isIframe = () => {
  return window.self !== window.top;
};

export const notifyParentOfAppLoad = () => {
  // this child app and the parent should have the same origin
  window.parent.postMessage('childAppLoaded', window.location.origin);
};

export const getParentSettings = (): ParentSettings => {
  // local storage keys set as constants in parent app
  const colorsFromStorage = localStorage.getItem('themeColors');
  const selectedLanguageCode = localStorage.getItem('selectedLanguageCode');
  const apiHost = localStorage.getItem('cadtApiHost');
  const apiKey = localStorage.getItem('cadtApiKey');

  try {
    return {
      colors: colorsFromStorage ? JSON.parse(colorsFromStorage) : undefined,
      selectedLanguageCode: selectedLanguageCode || undefined,
      apiHost: apiHost || undefined,
      apiKey: apiKey || undefined,
    };
  } catch {
    console.error('error retrieving settings from parent local storage');
    return {};
  }
};

/**
 * this should be called instead of window.location.reload() in all cases.
 * window.location.reload() when running as a child app will cause problems
 */
export const reloadApplication = () => {
  if (isIframe()) {
    window.parent.postMessage('reload', window.location.origin);
  } else {
    window.location.reload();
  }
};
