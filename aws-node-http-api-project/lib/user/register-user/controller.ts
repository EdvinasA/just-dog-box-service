import * as _ from 'lodash'
import { AttributeValue, ExecuteStatementCommandOutput, PutItemInput } from "@aws-sdk/client-dynamodb";
import { putItem } from '../../shared/database';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
}

export async function register(event, context, callback) {
    const parsedBody: RegisterForm = JSON.parse(event.body);
    const postItem = {
        'email': parsedBody.email,
        'fullName': parsedBody.fullName,
        'password': parsedBody.password
    }

    console.log(event.body.email);

    let output = await putItem('Users', postItem);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            input: event
        }),
    };

    callback(null, response);
}