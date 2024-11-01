import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { loadLocaleData } from '@/translations';
import '@/App.css';
import { AppNavigator } from '@/routes';
import { resetApiHost, setConfigLoaded, setHost, setIsCoreRegistryUiApp, setLocale } from '@/store/slices/app';
import { ComponentCenteredSpinner } from '@/components';
import { useGetThemeColorsQuery, useGetUiConfigQuery } from '@/api';
import {
  getParentSettings,
  isIframe,
  notifyParentOfAppLoad,
  ParentSettings,
  reconcileSavedUrl,
} from '@/utils/unified-ui-utils';

/**
 * @returns app react component to be rendered by electron as the UI
 */
function App() {
  const isCoreRegistryUiChildApp = Boolean(isIframe());
  console.log('^^^^^^^^ cadt is child app', isCoreRegistryUiChildApp);
  let settingsFromParentApp: ParentSettings | null = null;
  if (isCoreRegistryUiChildApp) {
    notifyParentOfAppLoad();
    settingsFromParentApp = getParentSettings();
  }

  reconcileSavedUrl();

  const dispatch = useDispatch();
  const appStore = useSelector((state: any) => state.app);
  const [translationTokens, setTranslationTokens] = useState<object>();
  const [appLoading, setAppLoading] = useState(true);
  const { data: fetchedConfig, isLoading: configFileLoading } = useGetUiConfigQuery(undefined, {
    skip: isCoreRegistryUiChildApp,
  });
  const { data: fetchedThemeColors, isLoading: themeColorsFileLoading } = useGetThemeColorsQuery(undefined, {
    skip: isCoreRegistryUiChildApp,
  });

  if (isCoreRegistryUiChildApp !== appStore.isCoreRegistryUiApp) {
    dispatch(setIsCoreRegistryUiApp({ isCoreRegistryUiApp: isCoreRegistryUiChildApp }));
  }

  const setThemeColors = (colors: any) => {
    // apply loaded theme colors via changing css property values (see App.css)
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value as string);
    });
  };

  const setConfig = ({ apiHost, apiKey }: { apiHost: string; apiKey?: string }) => {
    if (apiHost) {
      if (apiKey) {
        dispatch(setHost({ apiHost, apiKey }));
      } else {
        dispatch(setHost({ apiHost }));
      }
      dispatch(setConfigLoaded({ configLoaded: true }));
    } else if (appStore.configFileLoaded) {
      dispatch(resetApiHost());
      dispatch(setConfigLoaded({ configLoaded: false }));
    }
  };

  useEffect(() => {
    if (appStore.locale) {
      const processTranslationTokens = async () => {
        setTranslationTokens(await loadLocaleData(appStore.locale));
      };

      processTranslationTokens();
    } else {
      dispatch(setLocale(navigator.language));
    }
  }, [appStore.locale, dispatch]);

  // handle setting the theme colors when fetched as standalone app
  useEffect(() => {
    if (fetchedThemeColors && !isCoreRegistryUiChildApp) {
      setThemeColors(fetchedThemeColors);
    }
  }, [fetchedThemeColors, isCoreRegistryUiChildApp]);

  /*
   2 different loading scenarios:
   - as a stand-alone app fetching files
   - as a child app getting connection settings from parent local storage. in this case the config file is ignored
   */

  // handle setting the config when fetched as standalone app
  useEffect(() => {
    if (!configFileLoading && fetchedConfig?.apiHost && !isCoreRegistryUiChildApp) {
      setConfig({ apiHost: fetchedConfig?.apiHost });
    }
  }, [configFileLoading, fetchedConfig /* do not add setConfig */]);

  //handle setting theme colors when loaded as child app
  useEffect(() => {
    if (isCoreRegistryUiChildApp && settingsFromParentApp?.colors) {
      setThemeColors(settingsFromParentApp.colors);
    }
  }, [isCoreRegistryUiChildApp, settingsFromParentApp?.colors]);

  //handle setting config when loaded as child app
  useEffect(() => {
    if (isCoreRegistryUiChildApp && settingsFromParentApp?.apiHost) {
      setConfig({ apiHost: settingsFromParentApp?.apiHost, apiKey: settingsFromParentApp.apiKey });
    }
  }, [
    isCoreRegistryUiChildApp,
    settingsFromParentApp?.apiHost,
    settingsFromParentApp?.apiKey,
    /* do not add setConfig */
  ]);

  useEffect(() => {
    // give the setConfigFileLoaded action time to dispatch
    if (!configFileLoading || isCoreRegistryUiChildApp) {
      setTimeout(() => setAppLoading(false), 400);
    }
  }, [configFileLoading, isCoreRegistryUiChildApp]);

  if (!translationTokens || configFileLoading || themeColorsFileLoading || appLoading) {
    return <ComponentCenteredSpinner />;
  }

  return (
    <div className="h-full dark:bg-gray-800 dark:text-white">
      <IntlProvider
        locale={appStore.locale}
        defaultLocale="en"
        //@ts-ignore
        messages={translationTokens.default}
      >
        <AppNavigator />
      </IntlProvider>
    </div>
  );
}

export default App;
