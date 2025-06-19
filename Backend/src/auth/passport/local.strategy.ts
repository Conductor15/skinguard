import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // Cấu hình để sử dụng 'email' thay vì 'username'
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('LocalStrategy.validate called with:', {
      email,
      password: '***',
    });

    const user = await this.authService.validateUser(email, password);
    console.log(
      'AuthService.validateUser returned:',
      user ? 'User found' : 'No user',
    );

    if (!user) {
      console.log('Throwing UnauthorizedException');
      throw new UnauthorizedException();
    }
    return user; // req.user
  }
}
