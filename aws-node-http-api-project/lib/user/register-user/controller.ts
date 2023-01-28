import { postItem } from '../../shared/database';

type RegisterForm = {
    fullName: string;
    email: string;
    password: string;
}

export async function register(event, context, callback) {
    const parsedBody: RegisterForm = JSON.parse(event.body);

    await postItem('Users', parsedBody);

    const response = {
        statusCode: 200,
        body: JSON.stringify({
            input: event
        }),
    };

    callback(null, response);
}