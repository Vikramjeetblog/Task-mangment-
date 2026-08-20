import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { PublicUser, UsersService } from '../users/users.service';
import { GoogleProfile } from './strategies/google.strategy';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  signToken(user: UserDocument): string {
    return this.jwtService.sign({
      sub: user.id,
      provider: user.provider,
    });
  }

  toPublicUser(user: UserDocument): PublicUser {
    return this.usersService.toPublicUser(user);
  }

  async loginAsGuest() {
    const user = await this.usersService.createGuest();
    return { token: this.signToken(user), user: this.toPublicUser(user) };
  }

  async loginWithGoogle(profile: GoogleProfile) {
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return { token: this.signToken(user), user: this.toPublicUser(user) };
  }
}
