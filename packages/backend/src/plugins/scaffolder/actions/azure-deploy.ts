import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import axios from 'axios'
import { z } from 'zod';

export const azureDeplyAction = () => {
  return createTemplateAction({
    id: 'azure:code:deploy',
    schema: {
      input: z.object({
        owner: z
          .string()
          .describe('The owner name you want to check for.'),
        repo: z
          .string()
          .describe('The repository name you want to check for.'),
      }),
    },

    
    async handler(ctx) {
        await axios.get(`https://api.github.com/repos/${ctx.input.owner}/${ctx.input.repo}`);
    },
  });
};