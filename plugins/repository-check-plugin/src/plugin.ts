import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const repositoryCheckPluginPlugin = createPlugin({
  id: 'repo-checking-plugin',
  routes: {
    root: rootRouteRef,
  },
});

export const RepositoryCheckPluginPage = repositoryCheckPluginPlugin.provide(
  createRoutableExtension({
    name: 'RepoCheckingPluginPage',
    component: () =>
      import('./components/RepoCheckerCard').then(m => m.RepoCheckerCard),
      mountPoint: rootRouteRef,
  }),
);