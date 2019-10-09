import {MongoClient, ObjectId } from 'mongodb'
import { IDBProvider } from './db.provider'
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../users/dto/User.dto'
import { AuthDTO } from 'src/auth/dto/Auth.dto'
import { hashSync, compareSync } from 'bcrypt'

export class UsersMongoDBProvider implements IDBProvider {
    private mongoClient: MongoClient
    private url: string
    private dbName : string

    constructor() {
        this.url = "mongodb://mongodb:27017"
        this.dbName = "vw-auth"
        this.mongoClient = new MongoClient(this.url,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    public async RegisterAuth( auth: AuthDTO) : Promise<boolean> {
        return new Promise( async( resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)
                const hashPassword = hashSync(auth.password, 10)

                db.collection('vwAuth').findOne({
                    email: auth.email
                }, (err, res) => {
                    if(err) {
                        client.close()
                        return reject( new Error('Error finding document in database'))
                    }
                    if(!res) {
                        db.collection('vwAuth').insertOne({
                            email: auth.email,
                            password: hashPassword
                        }, err => {
                            if(err) {
                                client.close()
                                return reject( new Error('Error inserting document to database'))
                            }
                        })
                        client.close()
                        resolve(true)
                    }
                    client.close()
                    resolve(false)
                })
            })
        })
    }

    public async Authenticate( email : string, password: string) : Promise<boolean> {
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)
                db.collection('vwAuth').find({ email: email }).next((err, item) => {
                    if(err) {
                        client.close()
                        return reject( new Error('Could not retrieve documents from database'))
                    }

                    if(item === null) {
                        client.close()
                        return resolve(false)
                    }

                    if(compareSync(password, item.password)) {
                        client.close()
                        resolve(true)
                    }
                    else {
                        client.close()
                        resolve(false)
                    }
                    
                })
                
            })
        })
    }

    public async Create(newUser: CreateUserDTO ) : Promise<boolean> {
        return new Promise( async (resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error("Could not connect to database") )
                }
                
                const db = client.db(this.dbName)

                db.collection('users').findOne({ email: newUser.email }, (err, res) => {
                    if(err) {
                        client.close();
                        return reject( new Error("Error finding document in database"))
                    }
                    if(!res) {
                        //  We add active property to insert into database
                        //  for soft delete control and active status
                        newUser["active"]  = true
                        newUser["deleted"] = false
                        db.collection('users').insertOne(newUser, (err) => {
                            if(err) {
                                client.close()
                                return reject( new Error("Error inserting document to database"))
                            }
                        })
                        client.close()
                        resolve(true)
                    }
                    client.close()
                    resolve(false)
                })
            })
        })   
    }

    public async Read() : Promise<UserDTO[]> {
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)

                db.collection('users').find({ deleted: false }).toArray((err, items) => {
                    if(err) {
                        return reject( new Error('Could not retrieve documents from database'))
                    }
                    
                    let users : UserDTO[] = []

                    items.forEach( item  => {

                        const user = new UserDTO
                        user._id = item._id
                        user.firstName = item.firstName
                        user.middleName = item.middleName
                        user.surname1 = item.surname1
                        user.surname2 = item.surname2
                        user.age = item.age
                        user.phone = item.phone
                        user.email = item.email
                        user.roles = item.roles
                        user.permissions = item.permissions
                        user.photo = item.photo

                        users.push(user)
                    });

                    resolve(users)
                })
            })
        })
    }

    public async ReadOne(userId: string) : Promise<UserDTO> {
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)

                db.collection('users').find({ _id: ObjectId(userId) }).next((err, item) => {
                    if(err) {
                        return reject( new Error('Could not retrieve documents from database'))
                    }
                    
                    if(!item) {
                        return reject( new Error('User not found'))
                    }

                    const user = new UserDTO
                    user._id = item._id
                    user.firstName = item.firstName
                    user.middleName = item.middleName
                    user.surname1 = item.surname1
                    user.surname2 = item.surname2
                    user.age = item.age
                    user.phone = item.phone
                    user.email = item.email
                    user.roles = item.roles
                    user.permissions = item.permissions
                    user.photo = item.photo
                    user.deleted = item.deleted
                    user.active = item.active
 
                    resolve(user)
                })
            })
        })
    }

    public async FindByEmail(userEmail: string) : Promise<UserDTO> {
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)

                db.collection('users').find({ email: userEmail , deleted: false }).next((err, item) => {
                    if(err) {
                        return reject( new Error('Could not retrieve documents from database'))
                    }
                    
                    const user = new UserDTO
                    user._id = item._id
                    user.firstName = item.firstName
                    user.middleName = item.middleName
                    user.surname1 = item.surname1
                    user.surname2 = item.surname2
                    user.age = item.age
                    user.phone = item.phone
                    user.email = item.email
                    user.roles = item.roles
                    user.permissions = item.permissions
                    user.photo = item.photo
 
                    resolve(user)
                })
            })
        })
    }

    public async Update(userId: string, user: UpdateUserDTO) : Promise<boolean> {
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)

                //  Dynamic construction of isnert object
                //  If key does not exist in DTO we avoid overriding
                //  the actual document data
                const userData = {}
                if('firstName' in user)     userData['firstName'] = user.firstName
                if('middleName' in user)    userData['middleName'] = user.middleName
                if('surname1' in user)      userData['surname1'] = user.surname1
                if('surname2' in user)      userData['surname2'] = user.surname2
                if('age' in user)           userData['age'] = user.age
                if('phone' in user)         userData['phone'] = user.phone
                if('email' in user)         userData['email'] = user.email
                if('roles' in user)         userData['roles'] = user.roles
                if('permissions' in user)   userData['permissions'] = user.permissions
                if('photo' in user)         userData['photo'] = user.photo

                db.collection('users').updateOne({ _id: ObjectId( userId )}, {$set: userData }, (err, res) => {
                    if(err) {
                        client.close()
                        return reject( new Error('Error updating document in database'))
                    }
                    client.close()
                    resolve(res.result.nModified)
                })
            })
        })
    }

    public async Delete(userID: string) : Promise<boolean>{
        return new Promise( async(resolve, reject) => {
            await this.mongoClient.connect((err, client) => {
                if(err) {
                    return reject( new Error('Could not connect to database'))
                }

                const db = client.db(this.dbName)

                db.collection('users').updateOne({ _id: ObjectId( userID) }, { $set: { deleted: true } }, (err, res) => {
                    if(err) {
                        client.close()
                        return reject( new Error('Error deleteing document in database'))
                    }
                    client.close()
                    resolve(res.result.nModified)
                })
            })
        })
    }
}