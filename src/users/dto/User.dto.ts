import { IsString, IsNumberString, IsNumber, IsOptional, IsPhoneNumber, IsEmail, IsArray,  } from 'class-validator'

export class UserDTO {
    _id : string
    firstName: string
    middleName: string
    surname1 : string
    surname2: string
    age:  number
    phone: string
    email: string
    roles: string[]
    permissions: string[]
    photo: string
    active: boolean
    deleted: boolean
}

export class CreateUserDTO {
    @IsString()
    readonly firstName: string
    @IsOptional()
    @IsString()
    readonly middleName: string
    @IsString()
    readonly surname1 : string
    @IsString()
    readonly surname2: string
    @IsNumber()
    readonly age:  number
    @IsPhoneNumber('MX')
    @IsNumberString()
    readonly phone: string
    @IsEmail()
    @IsString()
    readonly email: string
    @IsArray()
    @IsString({each: true})
    readonly roles: string[]
}

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    readonly firstName: string
    @IsOptional()
    @IsString()
    readonly middleName: string
    @IsOptional()
    @IsString()
    readonly surname1 : string
    @IsOptional()
    @IsString()
    readonly surname2: string
    @IsOptional()
    @IsNumber()
    readonly age:  number
    @IsOptional()
    @IsPhoneNumber('MX')
    @IsNumberString()
    readonly phone: string
    @IsOptional()
    @IsEmail()
    @IsString()
    readonly email: string
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    readonly roles: string[]
    @IsOptional()
    @IsArray()
    @IsString({each: true})
    readonly permissions: string[]
    @IsOptional()
    @IsString()
    readonly photo: string
}