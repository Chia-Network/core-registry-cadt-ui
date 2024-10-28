import React from 'react';
import { BrowserRouter as Router, Navigate, redirect, Route, Routes } from 'react-router-dom';
import ROUTES from '@/routes/route-constants';
import * as Pages from '@/pages';
import { Template } from '@/components';
import { coreRegistryUiBaseName } from '@/utils/unified-ui-utils';

const AppNavigator: React.FC = () => {
  // see https://github.com/Chia-Network/core-registry-ui for basename use case
  const basename = coreRegistryUiBaseName();

  return (
    <>
      <Router basename={basename}>
        <Routes>
          <Route // remove trailing slash
            path="*(/+)"
            loader={({ params }) => redirect(params['*'] || '/')}
          />
          <Route path="" element={<Template />}>
            <Route path="/" element={<Navigate to={ROUTES.PROJECTS_LIST} />} />
            <Route path={ROUTES.PROJECTS_LIST} element={<Pages.ProjectsListPage />} />
            <Route path={ROUTES.UNITS_LIST} element={<Pages.UnitsListPage />} />
            <Route path={ROUTES.AUDIT} element={<Pages.AuditPage />} />
            <Route path={ROUTES.GLOSSARY} element={<Pages.GlossaryPage />} />
            <Route path={ROUTES.MY_ORGANIZATION} element={<Pages.MyOrganizationPage />} />
            <Route path={ROUTES.MY_PROJECTS} element={<Pages.MyProjectsPage />} />
            <Route path={ROUTES.MY_UNITS_LIST} element={<Pages.MyUnitsPage />} />
            <Route path="*" element={<Navigate replace to={ROUTES.PROJECTS_LIST} />} />
          </Route>
        </Routes>
        {/* app-wide blocking modals go below this comment*/}
      </Router>
    </>
  );
};

export { AppNavigator };
