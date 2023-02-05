import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { signToken, verifyToken } from '../../shared/authorization';
import { getByEmail, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';

type EditUserInformationForm = {
    firstName: string;
    lastName: string;
    address: string;
    age: string;
}

export async function updateUser(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: EditUserInformationForm = JSON.parse(event.body);
    const tokenData = await verifyToken(event.headers.authorization);

    const user = await getByEmail('Users', tokenData.email).then((user) => {
        // @ts-ignore
        return user.Item;
    });

    await postItem('Users', {
        email: user.email,
        firstName: parsedBody.firstName,
        lastName: parsedBody.lastName,
        address: parsedBody.address,
        age: parsedBody.age
    })
        .then(() => {
            const response: ServiceResponse = {
                statusCode: 200,
                body: "Success",
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