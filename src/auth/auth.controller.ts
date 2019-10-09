import { Controller, Post, Get, Res, Body, HttpStatus } from '@nestjs/common';
import { Response } from 'express'
import { AuthDTO } from './dto/Auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { readFileSync } from 'fs'
import { sign } from 'jsonwebtoken'
@Controller('auth')
export class AuthController {

    private privateKey: string
    private publicKey: string

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService) {}

        

    @Post('register')
    async createAuth(
        @Res() response: Response,
        @Body() authDTO : AuthDTO
    ) {

        if(!await this.authService.Register(authDTO)) {
            return response.status(HttpStatus.CONFLICT).send('Auth already registered')
        }

        const jwt = await   this.GenerateJWT(authDTO.email)

        return response.status(HttpStatus.CREATED).json({
            message: 'Auth created succesfully',
            auth: authDTO,
            jwt: jwt
        })
    }

    @Post('authenticate')
    async authenticate(
        @Res() response: Response,
        @Body() authDTO: AuthDTO
    ) {
        if(! await this.authService.Authenticate(authDTO.email, authDTO.password)) {
            return response.status(HttpStatus.UNAUTHORIZED).send()
        }

        const jwt = await this.GenerateJWT(authDTO.email)
        return response.status(HttpStatus.OK).json({
            message: 'Authorized',
            auth: authDTO,
            jwt: jwt
        })
    }
	
    @Get('')
    async check() {   return "ok";    }   

    private async GenerateJWT(email: string) : Promise<string> {
        //  Retrieve user data
        const userData = await this.userService.FindByEmail(email)

        this.privateKey = readFileSync('rsa_keys/private', 'utf8')
        this.publicKey  = readFileSync('rsa_keys/public', 'utf8')

        //  hardcoded for learning purposes
        const issuer   = 'VW México'            //  Who issues the token
        const subject  = 'contact@vw.com.mx'    //  Who can use the token
        const audience = 'https://vw.com.mx'    //  Identity of the intended recipient of the token
        
        const jwtOptions = {
            issuer: issuer,
            subject: subject,
            audience: audience,
            expiresIn : '12h',
            algorithm : 'RS256' 
        }

        const jwtPayload = {
            _id: userData._id,
            firstName: userData.firstName,
            middleName: userData.middleName,
            surname1: userData.surname1,
            surname2: userData.surname2,
            email: userData.email,
            roles: userData.roles,
            permissions: userData.permissions,
            active: userData.active
        }

        const token = sign(jwtPayload, this.privateKey, jwtOptions)
        return token
    }
}
