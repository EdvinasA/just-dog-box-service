import { sign } from 'jsonwebtoken';
import { genSaltSync, hashSync } from 'bcrypt';

export const signToken = async (email: string, fullName: string) => {
    return sign({ email: email, fullName: fullName }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
    });
}

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await genSaltSync(10);
    const hashed = await hashSync(password, salt)

    return hashed;
}