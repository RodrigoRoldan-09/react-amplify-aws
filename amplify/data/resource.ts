import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Definición del schema para la tabla de proyectos
const schema = a.schema({
  Project: a
    .model({
      name: a.string().required(),
      description: a.string(),
      image: a.string(),
      githubLink: a.string().required(),
      projectLink: a.string().required(),
      // Para tags, usamos un formato que pueda almacenarse en DynamoDB
      // Como string que podemos parsear como JSON
      tags: a.string(),
      // Añadimos categoría para filtrar
      category: a.string(),
      // Campo para ordenamiento
      createdAt: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});