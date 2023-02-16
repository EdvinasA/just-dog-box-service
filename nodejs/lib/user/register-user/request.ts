import { IsDefined, IsEmail } from "class-validator";

export class RegisterForm {
    @IsDefined()
    firstName: string;
    @IsDefined()
    lastName: string;
    @IsDefined()
    @IsEmail()
    email: string;
    @IsDefined()
    password: string;
}