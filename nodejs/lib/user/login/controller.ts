import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { compareEncryptedData, signToken } from '../../shared/authorization';
import { getByEmail } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { defaultResponsePut, returnErrorsIfInvalid } from '../../shared/validation';
import { LoginForm } from './request';

export async function login(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const input: LoginForm = JSON.parse(event.body);

    await returnErrorsIfInvalid(input, LoginForm, callback);

    let response: ServiceResponse = defaultResponsePut();

    let data: any = {};

    try {
        await getByEmail('Users', input.email).then((output) => {
            //@ts-ignore
            data = output.Item
        });
    } catch (error) {
        response = { statusCode: 500, body: JSON.stringify({ message: error }) }
    }

    if (!data) {
        response = { statusCode: 401, body: JSON.stringify({ message: 'No user found!' }) }
    }

    if (data && await compareEncryptedData(input.password, data.password) && (input.email === data.email)) {
        const token = await signToken(input.email);
        response = {
            statusCode: 200,
            body: JSON.stringify({ token })
        };
    }

    callback(null, response);
}