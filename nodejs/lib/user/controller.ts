import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import {
  ScanOutput
} from "@aws-sdk/client-dynamodb"
import { getByEmail } from '../shared/database';
import { verifyToken } from '../shared/authorization';

export async function getUser(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  let data: ScanOutput = {}
  const tokenData = await verifyToken(event.headers.authorization);

  await getByEmail('Users', tokenData.email).then((output) => {
    //@ts-ignore
    data = output.Item
  });


  const response = {
    statusCode: 200,
    body: JSON.stringify(data)
  };

  callback(null, response);
}