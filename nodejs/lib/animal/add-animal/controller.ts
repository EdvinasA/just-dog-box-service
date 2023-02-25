import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { uuid } from 'uuidv4';
import { verifyToken } from '../../shared/authorization';
import { postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { defaultResponsePut, returnErrorsIfInvalid } from '../../shared/validation';
import { AddAnimalRequest } from './request';

export async function handler(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: AddAnimalRequest = JSON.parse(event.body);

    const errors = await returnErrorsIfInvalid(parsedBody, AddAnimalRequest, callback);

    let response: ServiceResponse = defaultResponsePut();

    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null) {
        await postItem('Animal', { ...parsedBody, email: tokenData.email, id: uuid() });
        callback(null, response);
        return;
    }
    callback(null, errors);
}