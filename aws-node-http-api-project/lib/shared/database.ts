import { ExecuteStatementCommand, ExecuteStatementCommandInput, ExecuteStatementCommandOutput, DynamoDBClient, PutItemCommandInput, PutItemCommand, AttributeValue } from "@aws-sdk/client-dynamodb";

const ddb: DynamoDBClient = new DynamoDBClient({ region: 'fake', endpoint: 'http://localhost:8777' });


export const getAllItems = async (tableName: string) => {
    const getUser: ExecuteStatementCommandInput = {
        Statement: `SELECT * FROM ${tableName}`,
    };

    let finalData: any = {};

    try {
        const data: ExecuteStatementCommandOutput = await ddb.send(new ExecuteStatementCommand(getUser));
        finalData = data;
    } catch (err) {
        console.error(err);
    }

    return finalData;
}

export const putItem = async (tableName: string, itemToPost: Record<string, AttributeValue> | undefined) => {
    const item: PutItemCommandInput = {
        TableName: tableName,
        Item: itemToPost
    };

    let finalData: any = {};

    try {
        console.log(item);
        const data: ExecuteStatementCommandOutput = await ddb.send(new PutItemCommand(item));
        console.log("Failed 3");
        finalData = data;
    } catch (err) {
        console.error(err);
    }

    return finalData;
}