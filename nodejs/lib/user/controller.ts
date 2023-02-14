import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import {
  ScanOutput
} from "@aws-sdk/client-dynamodb"

import { getByEmail } from '../shared/database';
import { verifyToken } from '../shared/authorization';
import { defaultResponseGet, defaultResponseGetSuccess } from '../shared/validation';
import { ServiceResponse } from '../shared/models';

export async function getUser(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  let response: ServiceResponse = defaultResponseGet();

  const tokenData = await verifyToken(event.headers.authorization);

  if (event.headers.authorization && tokenData !== null) {
    const output = await getByEmail('Users', tokenData.email);

    //@ts-ignore
    response = defaultResponseGetSuccess(output.Item);
  }

  callback(null, response);
}