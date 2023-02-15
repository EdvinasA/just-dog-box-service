import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
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
export async function updateResponseContextWithValidation<T extends object>(
    context: any,
    requestBody: unknown,
    targetClass: ClassConstructor<T>,
    validatorOptions?: ValidatorOptions
): Promise<void> {
    if (!requestBody || !isJson(requestBody)) {
        context.res = {
            status: 400,
            body: 'Malformed request',
        };
        return;
    }

    const options = {
        defaultValidatorOptions,
        ...validatorOptions,
    };

    const errors: ValidationError[] = await validateObject(
        requestBody,
        targetClass,
        options
    );

    if (errors.length > 0) {
        context.res = {
            status: 400,
            body: errors,
        };
    }
}

export async function validateObject<T extends object>(
    requestBody: unknown,
    targetClass: ClassConstructor<T>,
    validatorOptions?: ValidatorOptions
): Promise<ValidationError[]> {
    const request = plainToInstance(targetClass, requestBody);

    const options = {
        defaultValidatorOptions,
        ...validatorOptions,
    };

    const errors: ValidationError[] = await validate(request, options);

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