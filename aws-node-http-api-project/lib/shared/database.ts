import {
    ScanOutput
} from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "aws-sdk";

const ddb = new DynamoDB.DocumentClient({ region: 'fake', endpoint: 'http://localhost:8777' });


export const getAllItems = async (tableName: string): Promise<ScanOutput> => {
    const parameters = {
        TableName: tableName
    };

    let defaultReponse: ScanOutput = {}

    try {
        await ddb.scan(parameters).promise().then((response: ScanOutput) => {
            return response;
        });
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
        await ddb.get(parameters).promise().then((response: ScanOutput) => {
            return response;
        });
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

    let defaultReponse: ScanOutput = {}

    try {
        await ddb.put(parameters).promise().then((response: ScanOutput) => {
            return response;
        });
    } catch (err) {
        console.error(err);
    }

    return Promise.resolve(defaultReponse);
}