import { IsDefined, IsEmail } from "class-validator";

export class EditUserInformationForm {
    @IsDefined()
    firstName: string;
    @IsDefined()
    lastName: string;
    @IsDefined()
    @IsEmail()
    email: string;
    age: string;
    address: string;
}