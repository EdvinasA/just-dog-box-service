import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { compareEncryptedData, signToken } from '../../shared/authorization';
import { getByEmail } from '../../shared/database';

type LoginForm = {
    email: string;
    password: string;
}

export async function login(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const input: LoginForm = JSON.parse(event.body);

    let response = {
        statusCode: 400,
        body: JSON.stringify({})
    };

    let data: any = {};

    await getByEmail('Users', input.email).then((output) => {
        //@ts-ignore
        data = output.Item
    });

    if (await compareEncryptedData(input.password, data.password) && (input.email === data.email)) {
        const token = await signToken(input.email);
        response = {
            statusCode: 200,
            body: JSON.stringify({ token })
        };
    }

    callback(null, response);
}