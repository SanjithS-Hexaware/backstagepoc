import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { getArtifactory } from '@backstage/plugin-artifacts-backend';
import { z } from 'zod';

export const repoExists = () => {
  return createTemplateAction({
    id: 'myorg:repo:exists',
    schema: {
      input: z.object({
        repoUrl: z.string().describe('The URL of the repository to check for'),
      }),
    },
    async handler(ctx) {
      const artifactory = await getArtifactory();
      artifactory.repositories.findByUrl(ctx.input.repoUrl);
    },
  });
};