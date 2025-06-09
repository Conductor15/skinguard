import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  // constructor(private usersService: UsersService) {}
  // async validateUser(username: string, pass: string): Promise<any> {
  // const user = await this.usersService.findOne(username);
  // if (user && user.password === pass) {
  //   const { password, ...result } = user;
  //   return result;
  // }
}
