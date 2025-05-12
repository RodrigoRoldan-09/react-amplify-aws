// /amplify/functions/projectFunctions/write.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface ProjectInput {
  name: string;
  description?: string;
  image?: string;
  githubLink: string;
  projectLink: string;
  tags: string[];
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: "Missing request body" })
      };
    }
    
    // Parsear el cuerpo de la solicitud
    const requestBody = JSON.parse(event.body) as ProjectInput;
    
    // Validar campos requeridos
    if (!requestBody.name || !requestBody.githubLink || !requestBody.projectLink) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }
    
    // Determinar la categoría principal basada en las etiquetas
    let category = "Other"; // Valor por defecto
    if (requestBody.tags && requestBody.tags.length > 0) {
      // Usar la primera etiqueta como categoría principal
      category = requestBody.tags[0];
    }
    
    // Crear item para DynamoDB
    const project = {
      id: randomUUID(),
      name: requestBody.name,
      description: requestBody.description || "No description provided",
      image: requestBody.image || `https://via.placeholder.com/500x300/1e1e1e/ff7d00?text=${encodeURIComponent(requestBody.name)}`,
      githubLink: requestBody.githubLink,
      projectLink: requestBody.projectLink,
      tags: requestBody.tags || [],
      category: category,
      createdAt: new Date().toISOString()
    };
    
    const tableName = process.env.API_PROJECTAPI_PROJECTTABLE_NAME || 'Projects';
    
    const command = new PutCommand({
      TableName: tableName,
      Item: project
    });
    
    await docClient.send(command);
    
    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST"
      },
      body: JSON.stringify(project)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "Error creating project" })
    };
  }
};