// /amplify/functions/projectFunctions/read.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.API_PROJECTAPI_PROJECTTABLE_NAME || 'Projects';

    // Comprobar si hay parámetros de consulta para filtrar por categoría
    if (event.queryStringParameters && event.queryStringParameters.category) {
      const category = event.queryStringParameters.category;
      
      // Usar el índice secundario para consultar por categoría si existe
      const command = new QueryCommand({
        TableName: tableName,
        IndexName: 'byCategoryIndex',
        KeyConditionExpression: 'category = :categoryValue',
        ExpressionAttributeValues: {
          ':categoryValue': category
        }
      });
      
      const data = await docClient.send(command);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(data.Items || [])
      };
    } else {
      // Si no hay categoría, hacer un escaneo completo
      const command = new ScanCommand({
        TableName: tableName
      });
      
      const data = await docClient.send(command);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET"
        },
        body: JSON.stringify(data.Items || [])
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ error: "Error fetching projects" })
    };
  }
};