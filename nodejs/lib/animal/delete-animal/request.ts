import { IsDefined, IsString } from "class-validator";

export class DeleteAnimalRequest {
    @IsDefined()
    @IsString()
    id?: string;
}