import { Controller, Get, Post, Body, Res, HttpStatus, Patch, Param, Delete } from '@nestjs/common'
import { CreateUserDTO, UpdateUserDTO } from './dto/User.dto'
import { UsersService } from './users.service'
import { Response } from 'express'

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @Post()
    async createUser(
        @Res()  response: Response,
        @Body() userDTO: CreateUserDTO) {
        
        if(!await this.userService.Create(userDTO)) {
            return response.status(HttpStatus.CONFLICT).send('User already exist on database')
        }

        return response.status(HttpStatus.CREATED).json({
            message: 'User created succesfully',
            user: userDTO
        })
    }

    @Get()
    async getUsers(@Res() response: Response) {
        const users = await this.userService.Read()
        return response.json(users)
    }

    @Get(':userID')
    async getUser(
        @Res() response: Response,
        @Param('userID') userID: string) {
            const user = await this.userService.ReadOne(userID)
            return response.json(user)
        }

    @Patch(':userID')
    async updateUser(
        @Res()  response: Response,
        @Body() userDTO: UpdateUserDTO,
        @Param('userID') userID: string ){
        
        const updatedUser = await this.userService.Update(userID, userDTO)
        
        if(!updatedUser) return response.status(HttpStatus.OK).json({
            message: 'User could not be updated',
            user: userDTO
        })

        return response.status(HttpStatus.OK).json({
            message: 'User updated succesfully',
            user: userDTO
        })
    }

    @Delete(':userID')
    async deleteUser(
        @Res() response: Response,
        @Param('userID') userID: string ) {
    
        const deletedUser = await this.userService.Delete(userID)

        if(!deletedUser) return response.status(HttpStatus.OK).json({
            message: 'User could not be deleted',
            userID: userID
        })

        return response.status(HttpStatus.OK).json({
            message: 'User deleted succesfully',
            userID: userID
        })
    }

}
