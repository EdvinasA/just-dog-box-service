import {
    DynamoDBClient,
    ScanOutput,
    PutItemInput,
    AttributeValue
} from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "aws-sdk";
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";

const ddb = new DynamoDB.DocumentClient({ region: 'fake', endpoint: 'http://localhost:8777' });
const client = new DynamoDBClient({ region: 'fake', endpoint: 'http://localhost:8777' });


export const getAllItems = async (tableName: string): Promise<ScanOutput> => {
    const parameters = {
        TableName: tableName
    };

    let defaultReponse: ScanOutput = {}

    try {
        const data = await ddb.scan(parameters).promise();
        return data;
    } catch (err) {
        console.error(err);
    }

    return Promise.resolve(defaultReponse);
}

export const getByEmail = async (tableName: string, email: string) => {
    const parameters = {
        TableName: tableName,
        Key: {
            email: email
        }
    };

    let defaultReponse: ScanOutput = {}

    try {
        const data = await ddb.get(parameters).promise();
        return data;
    } catch (err) {
        console.error(err);
    }

    return Promise.resolve(defaultReponse);
}

export const putItem = async (tableName: string | undefined, itemToPost: any | undefined) => {
    const parameters: PutItemInput = {
        TableName: tableName,
        Item: itemToPost
    };

    let defaultReponse: ScanOutput = {}

    try {
        const data = await ddb.put(parameters).promise();
        return data;
    } catch (err) {
        console.error(err);
    }

    return Promise.resolve(defaultReponse);
}