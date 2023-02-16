import { IsDefined, IsEmail } from "class-validator";

export class SubscribeToEmailForm {
    @IsDefined()
    @IsEmail()
    email: string;
}