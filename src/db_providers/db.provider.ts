import { CreateUserDTO, UserDTO, UpdateUserDTO } from "../users/dto/User.dto";
import { AuthDTO } from "src/auth/dto/Auth.dto";

export interface IDBProvider {
    Create( newUser: CreateUserDTO) : Promise<boolean>
    Update( userId: string, user: UpdateUserDTO ) : Promise<boolean>
    Read() : Promise<UserDTO[]>
    ReadOne(userId: string) : Promise<UserDTO>
    Delete(userId: string) : Promise<boolean>
    FindByEmail(userEmail: string) : Promise<UserDTO>
    RegisterAuth( auth: AuthDTO ) : Promise<boolean>
    Authenticate( email: string, password: string) : Promise<boolean>
}
