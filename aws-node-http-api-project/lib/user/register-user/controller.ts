import * as _ from 'lodash'
import { AttributeValue, ExecuteStatementCommandOutput } from "@aws-sdk/client-dynamodb";
import { putItem } from '../../shared/database';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
}

export async function register(event, context, callback) {
    const parsedBody: RegisterForm = JSON.parse(event.body);
    console.log(event.body);
    const postItem: Record<string, AttributeValue> | undefined = {
        "Email": { S: parsedBody.email },
        "FullName": { S: parsedBody.fullName },
        "Password": { S: parsedBody.password }
    }

    console.log(event.body.email);

    let output: ExecuteStatementCommandOutput = await putItem('Users', postItem);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            input: event
        }),
    };

    callback(null, response);
}