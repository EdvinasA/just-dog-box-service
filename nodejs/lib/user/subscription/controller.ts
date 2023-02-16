import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { getByEmail, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';
import { returnErrorsIfInvalid } from '../../shared/validation';
import { SubscribeToEmailForm } from './request';

export async function subscribe(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const generatedUUID = await uuidv4();
    const input: SubscribeToEmailForm = JSON.parse(event.body);

    await returnErrorsIfInvalid(input, SubscribeToEmailForm, callback)

    let response: ServiceResponse = {
        statusCode: 200
    };

    await getByEmail('SubscriptionToEmail', input.email).then((output) => {
        // @ts-ignore
        if (output.Item) {
            response = {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is already added to subscription list' }),
            };
            callback(null, response);
        }
    });

    await postItem('SubscriptionToEmail', { id: generatedUUID, email: input.email })
        .then(() => {
            response = {
                statusCode: 200,
                body: JSON.stringify({ message: 'Email added!' }),
            };
        })
        .catch((error) => {
            response = {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };
        });

    callback(null, response);
}