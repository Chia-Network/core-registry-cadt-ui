import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { loadLocaleData } from '@/translations';
import '@/App.css';
import { AppNavigator } from '@/routes';
import { resetApiHost, setConfigFileLoaded, setHost, setLocale } from '@/store/slices/app';
import { ComponentCenteredSpinner } from '@/components';
import { Config, useGetThemeColorsQuery, useGetUiConfigQuery } from '@/api';
import { coreRegistryUiBaseName, notifyParentOfAppLoad } from '@/utils/iframe-utils';

/**
 * @returns app react component to be rendered by electron as the UI
 */
function App() {
  const isCoreRegistryUiChildApp = Boolean(coreRegistryUiBaseName());
  if (isCoreRegistryUiChildApp) {
    notifyParentOfAppLoad();
  }

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

  const setThemeColors = (colors: any) => {
    // apply loaded theme colors via changing css property values (see App.css)
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value as string);
    });
  };

  const setConfig = (config: Config | undefined) => {
    if (config) {
      if (config?.apiHost) {
        dispatch(setHost({ apiHost: config.apiHost }));
      }
      dispatch(setConfigFileLoaded({ configFileLoaded: true }));
    } else if (appStore.configFileLoaded) {
      dispatch(resetApiHost());
      dispatch(setConfigFileLoaded({ configFileLoaded: false }));
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

  // handle setting the config when fetched as standalone app
  useEffect(() => {
    if (!configFileLoading && !isCoreRegistryUiChildApp) {
      setConfig(fetchedConfig);
    }
  }, [configFileLoading, fetchedConfig]);

  /*
   2 different loading scenarios:
   - as a stand-alone app fetching files
   - as a child app waiting for connection settings from its parent. in this case the config file is ignored
   the below logic has been nested to represent the two cases
   */

  useEffect(() => {
    // give the setConfigFileLoaded action time to dispatch
    if (isCoreRegistryUiChildApp) {
      console.log('todo: child app loading conditions here');
    } else {
      if (!configFileLoading) {
        setTimeout(() => setAppLoading(false), 400);
      }
    }
  }, [configFileLoading, isCoreRegistryUiChildApp]);

  if (isCoreRegistryUiChildApp) {
    console.log('todo: child app loading conditions here');
  } else {
    if (!translationTokens || configFileLoading || themeColorsFileLoading || appLoading) {
      return <ComponentCenteredSpinner />;
    }
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
