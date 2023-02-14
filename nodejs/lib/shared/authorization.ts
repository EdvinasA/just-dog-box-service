import { sign, verify } from 'jsonwebtoken';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

export const signToken = async (email: string) => {
    return sign({ email: email }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
    });
}

export const verifyToken = async (token: string) => {
    try {
        return await verify(token, 'secret');
    } catch (error) {
        return null;
    }
}

export const encryptData = async (value: string) => {
    return hashSync(value, genSaltSync(10, 'b'));
}

export const compareEncryptedData = async (value: string, hashedValue: string) => {
    return compareSync(value, hashedValue);
}