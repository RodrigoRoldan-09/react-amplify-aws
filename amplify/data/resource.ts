import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*
 * Define el esquema para la tabla de proyectos
 */
const schema = a.schema({
  Project: a
    .model({
      name: a.string(),
      description: a.string(),
      image: a.string(),
      githubLink: a.string(),
      projectLink: a.string(),
      // Para versiones que no soportan a.array, usamos string directamente
      tags: a.string(), // Almacenaremos los tags como string JSON
      category: a.string().required(), // Categoría principal
    })
    .authorization((allow) => [allow.publicApiKey()])
    // No podemos usar .index directamente en esta versión
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