import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { getByEmail, getByField, postItem } from '../../shared/database';
import { ServiceResponse } from '../../shared/models';

type SubscribeToEmailForm = {
    email: string;
}

export async function subscribe(event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) {
    const generatedUUID = await uuidv4();

    const input: SubscribeToEmailForm = JSON.parse(event.body);

    let response: ServiceResponse = {
        statusCode: 200,
        body: {}
    };

    await getByEmail('SubscriptionToEmail', input.email).then((response) => {
        // @ts-ignore
        if (response.Item) {
            const response: ServiceResponse = {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email is already added to subscription list' }),
            };
            callback(null, response);
        }
    });

    await postItem('SubscriptionToEmail', { id: generatedUUID, email: input.email })
        .then(() => {
            const response: ServiceResponse = {
                statusCode: 200,
                body: JSON.stringify({ message: 'Email added!' }),
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

    callback(null, response);
}