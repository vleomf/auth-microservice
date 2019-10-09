import { IsString, MinLength, IsEmail } from 'class-validator'

export class AuthDTO {
    @IsString()
    @IsEmail()
    readonly email : string
    @IsString()
    @MinLength(6)
    readonly password: string
}