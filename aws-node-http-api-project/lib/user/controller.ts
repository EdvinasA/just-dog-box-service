import * as _ from 'lodash'
import {
  CreateTableCommandInput, ScanOutput
} from "@aws-sdk/client-dynamodb"
import { getAllItems, getByEmail } from '../shared/database';

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

  let data: ScanOutput = {}

  // await getAllItems('Users').then((output) => {
  //   data = output
  // });

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