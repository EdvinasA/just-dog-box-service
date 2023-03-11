import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { verifyToken } from '../../shared/authorization';
import { getByField } from '../../shared/database';
import { defaultResponseGet, defaultResponseGetSuccess } from '../../shared/validation';

export async function handler(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const tokenData = await verifyToken(event.headers.authorization);

    if (event.headers.authorization && tokenData !== null) {
        const values = await getByField('Subscription', 'email', tokenData.email);
        callback(null, defaultResponseGetSuccess(values.Items));
        return;
    }
    callback(null, defaultResponseGet());
}