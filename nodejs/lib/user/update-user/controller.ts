import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { verifyToken } from '../../shared/authorization';
import { getByEmail, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { returnErrorsIfInvalid } from '../../shared/validation';
import { EditUserInformationForm } from './request';

export async function updateUser(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: EditUserInformationForm = JSON.parse(event.body);
    const tokenData = await verifyToken(event.headers.authorization);

    await returnErrorsIfInvalid(parsedBody, EditUserInformationForm, callback);

    const user = await getByEmail('Users', tokenData.email).then((user) => {
        // @ts-ignore
        return user.Item;
    });

    await postItem('Users', {
        email: user.email,
        password: user.password,
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