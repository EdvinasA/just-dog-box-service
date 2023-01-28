import { sign } from 'jsonwebtoken';

export const signToken = async (email: string, fullName: string) => {
    return sign({ email: email, fullName: fullName }, 'secret', {
        expiresIn: 86400 // expires in 24 hours
    });
}