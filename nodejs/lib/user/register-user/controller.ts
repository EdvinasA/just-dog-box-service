import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { signToken } from '../../shared/authorization';
import { getByEmail, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';

type RegisterForm = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export async function register(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: RegisterForm = JSON.parse(event.body);

    await getByEmail('Users', parsedBody.email).then((user) => {
        // @ts-ignore
        if (user.Item) {
            const response: ServiceResponse = {
                statusCode: 400,
                body: JSON.stringify({ error: 'Use already exist' }),
            };

            callback(null, response);
        }
    });

    await postItem('Users', { email: parsedBody.email, firstName: parsedBody.firstName, lastName: parsedBody.lastName, password: parsedBody.password,
        address: '', age: ''  })
        .then(() => {
            return signToken(parsedBody.email);
        })
        .then((token: string) => {
            const response: ServiceResponse = {
                statusCode: 200,
                body: JSON.stringify({ token }),
            };

            callback(null, response);
        })
        .catch((error) => {
            const response: ServiceResponse = {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };

            callback(null, response);
        });
}