import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { hashPassword, signToken } from '../../shared/authorization';
import { getByEmail, postItem } from '../../shared/database';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
}

export async function register(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: RegisterForm = JSON.parse(event.body);

    await getByEmail('Users', parsedBody.email).then((user) => {
        // @ts-ignore
        if (user.Item) {
            const response = {
                statusCode: 400,
                body: JSON.stringify({ error: 'Use already exist' }),
            };

            callback(null, response);
        }
    });

    const hashed = await hashPassword(parsedBody.password);

    await postItem('Users', { email: parsedBody.email, fullName: parsedBody.fullName, password: hashed })
        .then(() => {
            return signToken(parsedBody.email, parsedBody.fullName);
        })
        .then((token: string) => {
            const response = {
                statusCode: 200,
                body: JSON.stringify({ token }),
            };

            callback(null, response);
        })
        .catch((err) => {
            const response = {
                statusCode: 500,
                body: JSON.stringify({ err }),
            };

            callback(null, response);
        });
}