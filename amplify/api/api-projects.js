// /amplify/api/api-projects.ts
import { defineBackend } from '@aws-amplify/backend';
import { ProjectReadFunction } from '../functions/projectFunctions/read';
import { ProjectWriteFunction } from '../functions/projectFunctions/write';

export const api = defineBackend({
  projectAPI: {
    endpoints: [
      {
        path: '/projects',
        methods: ['GET'],
        function: ProjectReadFunction
      },
      {
        path: '/projects',
        methods: ['POST'],
        function: ProjectWriteFunction
      }
    ]
  }
});