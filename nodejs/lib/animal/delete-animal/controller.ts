import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { verifyToken } from '../../shared/authorization';
import { deleteItem } from '../../shared/database';
import { returnErrorsIfInvalid } from '../../shared/validation';
import { DeleteAnimalRequest } from './request';

export async function handler(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: DeleteAnimalRequest = event.pathParameters;

    const errors = await returnErrorsIfInvalid(parsedBody, DeleteAnimalRequest, callback);

    if (errors.length > 0) {
        return;
    }

    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null && parsedBody.id) {
        try {
            await deleteItem('Animal', parsedBody.id, tokenData.email);
        } catch (error) {
            callback(null, { statusCode: 500, body: error });
        }
        callback(null, { statusCode: 200 });
        return;
    }
    callback(null, errors);
}