// src/graphql/mutations.ts
export const createProject = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      name
      description
      image
      githubLink
      projectLink
      tags
    }
  }
`;