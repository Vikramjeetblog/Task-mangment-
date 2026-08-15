import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

const AVATAR_COLORS = [
  '#F59E0B',
  '#3B82F6',
  '#EC4899',
  '#F43F5E',
  '#10B981',
  '#8B5CF6',
];

function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createGuest(): Promise<UserDocument> {
    const guestNumber = Math.floor(1000 + Math.random() * 9000);
    return this.userModel.create({
      name: `Guest ${guestNumber}`,
      provider: 'guest',
      avatarColor: randomAvatarColor(),
    });
  }

  async findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    name: string;
  }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({
      googleId: profile.googleId,
    });
    if (existing) return existing;

    return this.userModel.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.googleId,
      provider: 'google',
      avatarColor: randomAvatarColor(),
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}
