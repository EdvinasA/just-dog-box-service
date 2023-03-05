import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { verifyToken } from '../../shared/authorization';
import { getByField } from '../../shared/database';
import { defaultResponseGet, defaultResponseGetSuccess, returnErrorsIfInvalid } from '../../shared/validation';
import { GetAnimalByIdRequest } from './request';

export async function handler(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const parsedBody: GetAnimalByIdRequest = event.pathParameters;

    const errors = await returnErrorsIfInvalid(parsedBody, GetAnimalByIdRequest, callback);

    if (errors.length > 0) {
        return;
    }

    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null && parsedBody.id) {
        const values = await getByField('Animal', 'id', parsedBody.id);
        if (values.Items && values.Items?.length > 0) {
            callback(null, defaultResponseGetSuccess(values.Items[0]));
            return;
        }
        return;
    }
    callback(null, defaultResponseGet());
}