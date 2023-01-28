import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import {
  CreateTableCommandInput, ScanOutput
} from "@aws-sdk/client-dynamodb"
import { getByEmail } from '../shared/database';

export const params: CreateTableCommandInput = {
  AttributeDefinitions: [
    { AttributeName: "fullName", AttributeType: "S", },
    { AttributeName: "email", AttributeType: "S", },
  ],
  KeySchema: [
    { AttributeName: "email", KeyType: "HASH", },
    { AttributeName: "fullName", KeyType: "RANGE", },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: "Users",
  StreamSpecification: {
    StreamEnabled: false,
  },
  BillingMode: "PAY_PER_REQUEST"
};

export async function getUser(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
  let data: ScanOutput = {}

  await getByEmail('Users', 'edvinasalimas98@gmail.com').then((output) => {
    data = output
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: data
    }),
  };

  callback(null, response);
}