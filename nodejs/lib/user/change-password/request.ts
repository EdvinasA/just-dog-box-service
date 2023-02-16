import { IsDefined } from "class-validator";

export class ChangePasswordFormClass {
    @IsDefined()
    currentPassword: string;
    @IsDefined()
    newPassword: string;
    @IsDefined()
    confirmPassword: string;
}