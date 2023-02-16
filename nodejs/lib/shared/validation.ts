import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { APIGatewayProxyCallback } from 'aws-lambda';

import { ServiceResponse } from './models';

const defaultValidatorOptions = {
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    whitelist: true,
    stopAtFirstError: true,
};

/**
 * Validates request body and sets context error status and messages
 */
export async function returnErrorsIfInvalid<T extends object>(
    requestBody: unknown,
    targetClass: ClassConstructor<T>,
    callback: APIGatewayProxyCallback
): Promise<void> {
    const options = {
        ...defaultValidatorOptions
    };

    const errors: ValidationError[] = await validateObject(
        requestBody,
        targetClass,
        options
    );

    if (errors.length > 0) {
        callback(null, { statusCode: 400, body: JSON.stringify(errors) });
    }
    return;
}

export async function validateObject<T extends object>(
    requestBody: unknown,
    targetClass: ClassConstructor<T>,
    validatorOptions?: ValidatorOptions
): Promise<ValidationError[]> {
    const request = plainToInstance(targetClass, requestBody);

    const errors: ValidationError[] = await validate(request, validatorOptions);

    return errors;
}

const isJson = (requestBody: unknown): boolean => {
    return typeof requestBody === 'object';
};

export const defaultResponseGet = (): ServiceResponse => {
    return { statusCode: 204, body: JSON.stringify({}) };
}

export const defaultResponsePut = (): ServiceResponse => {
    return { statusCode: 200 };
}

export const defaultResponseGetSuccess = (body: any): ServiceResponse => {
    return { statusCode: 200, body: JSON.stringify(body) };
}