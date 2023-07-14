import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { repositoryCheckPluginPlugin, RepositoryCheckPluginPage } from '../src/plugin';

createDevApp()
  .registerPlugin(repositoryCheckPluginPlugin)
  .addPage({
    element: <RepositoryCheckPluginPage />,
    title: 'Root Page',
    path: '/repository-check-plugin'
  })
  .render();
