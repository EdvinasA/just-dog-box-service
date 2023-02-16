import { IsDefined, IsEmail } from "class-validator";

export class LoginForm {
    @IsDefined()
    @IsEmail()
    email: string;
    @IsDefined()
    password: string;
}