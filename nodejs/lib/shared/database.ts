import {
    ScanOutput
} from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "aws-sdk";

const ddb = process.env.ENDPOINT !== '' ? new DynamoDB.DocumentClient({ region: process.env.REGION, endpoint: process.env.ENDPOINT })
    : new DynamoDB.DocumentClient({ region: process.env.REGION });

export const getAllItems = async (tableName: string): Promise<ScanOutput> => {
    const parameters = {
        TableName: tableName
    };

    let defaultReponse: ScanOutput = {}

    try {
        return await ddb.scan(parameters).promise();
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
        return await ddb.get(parameters).promise();
    } catch (err) {
        console.error(err);
    }
    return Promise.resolve(defaultReponse);
}

export const getByField = async (tableName: string, fieldName: string, fieldValue: string) => {
    let defaultReponse: ScanOutput = {}

    try {
        return await ddb
            .scan({
                TableName: tableName,
                FilterExpression: `${fieldName} = :field`,
                ExpressionAttributeValues: { ':field': fieldValue }
            })
            .promise();
    } catch (err) {
        console.error(err);
    }
    return Promise.resolve(defaultReponse);
}

export const postItem = async (tableName: string, itemToPost: any) => {
    const parameters = {
        TableName: tableName,
        Item: itemToPost
    };

    try {
        await ddb.put(parameters).promise();
    } catch (err) {
        console.error(err);
    }
}

export const deleteItem = async (tableName: string, itemId: string, sortKey: string) => {
    const parameters = {
        Key: {
            'id': itemId,
            'email': sortKey
        },
        TableName: tableName,
    };

    try {
        await ddb.delete(parameters).promise();
    } catch (err) {
        console.error(err);
    }
}