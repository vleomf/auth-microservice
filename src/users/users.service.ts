import { Injectable, HttpException } from '@nestjs/common';
import { UsersMongoDBProvider } from '../db_providers/mongodb.provider'
import { IDBProvider } from '../db_providers/db.provider'
import { CreateUserDTO, UpdateUserDTO, UserDTO } from './dto/User.dto';
 
@Injectable()
export class UsersService {
    private dbDriver = 'mongodb'
    private dbProvider : IDBProvider
    constructor() {
        switch(this.dbDriver) {
            case 'mongodb':
                this.dbProvider = new UsersMongoDBProvider
                break
        }
    }

    public Create( newUser: CreateUserDTO) : Promise<boolean>{
        return new Promise( async (resolve, reject) => {
            let userCreated
            try {
                userCreated = await this.dbProvider.Create(newUser)
            }
            catch(e) {
                reject(new HttpException(e.message, 500))
            }
            resolve(userCreated)
        })
    }

    public Read() : Promise<UserDTO[]> {
        return new Promise( async (resolve, reject) => {
            let users
            try {
                users = await this.dbProvider.Read()
            }
            catch(e) {
                reject(new HttpException(e.message, 500))
            }
            resolve(users)
        })
    }

    public ReadOne(userID: string) : Promise<UserDTO> {
        return new Promise( async (resolve, reject) => {
            let user
            try {
                user = await this.dbProvider.ReadOne(userID)
            }
            catch(e) {
                let statusCode = 500
                if(e.message == 'User not found') statusCode = 404 
                reject( new HttpException(e.message, statusCode))
            }
            resolve(user)
        })
    }

    public FindByEmail(userEmail: string) : Promise<UserDTO> {
        return new Promise( async (resolve, reject) => {
            let user
            try {
                user = await this.dbProvider.FindByEmail(userEmail)
            }
            catch(e) {
                reject( new HttpException(e.message, 500))
            }
            resolve(user)
        })
    }

    public Update( userId: string , user: UpdateUserDTO) {
        return new Promise( async( resolve, reject) => {
            let userUpdated
            try
            {
                userUpdated = await this.dbProvider.Update(userId, user)
            }
            catch(e) {
                reject(new HttpException(e.message, 500))
            }
            resolve(userUpdated)
        })
    }

    public Delete(userId: string) {
        return new Promise(async(resolve, reject) => {
            let userDeleted
            try {
                userDeleted = await this.dbProvider.Delete(userId)
            }
            catch(e) {
                reject( new HttpException(e.message, 500))
            }
            resolve(userDeleted)
        })
    }
}
