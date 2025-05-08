// src/graphql/queries.ts
export const listProjects = `
  query ListProjects {
    listProjects {
      items {
        id
        name
        description
        image
        githubLink
        projectLink
        tags
      }
    }
  }
`;

export const getProject = `
  query GetProject($id: ID!) {
    getProject(id: $id) {
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