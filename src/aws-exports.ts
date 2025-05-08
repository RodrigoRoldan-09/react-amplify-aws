// src/aws-exports.ts
const awsconfig = {
  API: {
    GraphQL: {
      endpoint: 'https://tu-endpoint-de-api-graphql.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'API_KEY', // Añadido este campo requerido
      apiKey: 'tu-api-key'
    }
  }
};

export default awsconfig;