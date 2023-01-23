import * as _ from 'lodash'
import {
  CreateTableCommandInput
} from "@aws-sdk/client-dynamodb"

export const params: CreateTableCommandInput = {
  AttributeDefinitions: [
    { AttributeName: "FullName", AttributeType: "S", },
    { AttributeName: "Email", AttributeType: "S", },
  ],
  KeySchema: [
    { AttributeName: "Email", KeyType: "HASH", },
    { AttributeName: "FullName", KeyType: "RANGE", },
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

export async function getUser(event, context, callback) {

  

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event.body
    }),
  };

  callback(null, response);
}