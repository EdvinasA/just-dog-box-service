import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { verifyToken } from '../../shared/authorization';
import { postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { defaultResponsePut, returnErrorsIfInvalid } from '../../shared/validation';
import { EditAnimalRequest } from './request';

export async function handler(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: EditAnimalRequest = JSON.parse(event.body);

    const errors = await returnErrorsIfInvalid(parsedBody, EditAnimalRequest, callback);

    let response: ServiceResponse = defaultResponsePut();

    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null) {
        await postItem('Animal', { ...parsedBody });
        callback(null, response);
        return;
    }
    callback(null, errors);
}