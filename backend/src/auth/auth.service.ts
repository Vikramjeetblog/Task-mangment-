import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

export interface PublicUser {
  id: string;
  name: string;
  email?: string;
  avatarColor: string;
  provider: 'guest' | 'google';
}

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
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      provider: user.provider,
    };
  }

  async loginAsGuest() {
    const user = await this.usersService.createGuest();
    return { token: this.signToken(user), user: this.toPublicUser(user) };
  }

  async loginWithGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
  }) {
    const user = await this.usersService.findOrCreateGoogleUser(profile);
    return { token: this.signToken(user), user: this.toPublicUser(user) };
  }
}
