import { Injectable, HttpException } from '@nestjs/common';
import { IDBProvider } from 'src/db_providers/db.provider';
import { UsersMongoDBProvider } from '../db_providers/mongodb.provider';
import { AuthDTO } from './dto/Auth.dto';
import { rejects } from 'assert';

@Injectable()
export class AuthService {
    private dbDriver = 'mongodb'
    private dbProvider : IDBProvider
    constructor() {
        switch(this.dbDriver) {
            case 'mongodb':
                this.dbProvider = new UsersMongoDBProvider
                break
        }
    }

    public Register( registerAuth : AuthDTO ) : Promise<boolean> {
        return new Promise( async( resolve, reject ) => {
            let authRegistered
            try
            {
                authRegistered = this.dbProvider.RegisterAuth(registerAuth)
            }
            catch(e) {
                reject( new HttpException(e.message, 500))
            }
            resolve(authRegistered)
        })
    }

    public Authenticate(email: string, password: string) : Promise<boolean> {
        return new Promise( async( resolve, reject) => {
            let authenticated
            try
            {
                authenticated = this.dbProvider.Authenticate(email, password)
            }
            catch(e) {
                reject( new HttpException(e.message, 500))
            }
            resolve(authenticated)
        })
    }
}
