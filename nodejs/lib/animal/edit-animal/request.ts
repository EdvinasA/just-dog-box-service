import { IsDefined } from "class-validator";

export class EditAnimalRequest {
    @IsDefined()
    id: string;
    @IsDefined()
    email: string;
    @IsDefined()
    name: string;
    @IsDefined()
    type: string;
    @IsDefined()
    birthdayDate: Date;
    @IsDefined()
    weightCategory: string;
    @IsDefined()
    subscription: string;
    @IsDefined()
    allergies: string;
}