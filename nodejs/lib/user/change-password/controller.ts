import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { ValidationError } from 'class-validator';
import { compareEncryptedData, encryptData, signToken, verifyToken } from '../../shared/authorization';
import { getByEmail, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { defaultResponsePut, returnErrorsIfInvalid } from '../../shared/validation';
import { ChangePasswordFormClass } from './request';

type ChangePasswordForm = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export async function changePassword(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: ChangePasswordForm = JSON.parse(event.body);

    await returnErrorsIfInvalid(parsedBody, ChangePasswordFormClass, callback);

    let response: ServiceResponse = defaultResponsePut();

    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null && parsedBody.newPassword === parsedBody.confirmPassword) {
        const user = await getByEmail('Users', tokenData.email).then((user) => {
            // @ts-ignore
            return user.Item;
        });

        if (await compareEncryptedData(parsedBody.currentPassword, user.password)) {
            await postItem('Users', {
                email: user.email,
                password: await encryptData(parsedBody.newPassword),
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                age: user.age
            })
                .then(() => {
                    response = {
                        statusCode: 200
                    };
                })
                .catch((error) => {
                    response = {
                        statusCode: 500,
                        body: JSON.stringify({ error }),
                    };
                })
                .finally(() => {
                    callback(null, response);
                });
        }
    }
    response = { statusCode: 400, body: JSON.stringify({ message: "Bad request!" }) }
    callback(null, response);
}