import { IsDefined } from "class-validator";

export class GetAnimalByIdRequest {
    @IsDefined()
    id?: string;
}