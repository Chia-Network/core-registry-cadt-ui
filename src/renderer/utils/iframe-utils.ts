export const coreRegistryUiBaseName = () => {
  const isInIframe = window.self !== window.top;
  const basenameInLocalStorage = localStorage.getItem('cadtChildUiBasename');
  return basenameInLocalStorage && isInIframe ? basenameInLocalStorage : '';
};

export const notifyParentOfAppLoad = () => {
  const childAppOrigin = window.location.origin;
  // this child app and the parent should have the same origin
  window.parent.postMessage('childAppLoaded', childAppOrigin);
};
