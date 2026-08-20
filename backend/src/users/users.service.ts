import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthProvider, User, UserDocument } from './schemas/user.schema';

// Shape we actually send to the frontend - keeps internal fields (like googleId) out of API responses
export interface PublicUser {
  id: string;
  name: string;
  email?: string;
  avatarColor: string;
  avatarUrl?: string;
  title?: string;
  username?: string;
  provider: AuthProvider;
}

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
    avatarUrl?: string;
  }): Promise<UserDocument> {
    const existing = await this.userModel.findOne({
      googleId: profile.googleId,
    });
    if (existing) {
      // Keep the photo fresh in case they changed it on their Google account
      existing.avatarUrl = profile.avatarUrl;
      await existing.save();
      return existing;
    }

    return this.userModel.create({
      name: profile.name,
      email: profile.email,
      googleId: profile.googleId,
      avatarUrl: profile.avatarUrl,
      provider: 'google',
      avatarColor: randomAvatarColor(),
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async updateProfile(
    id: string,
    changes: { name?: string; title?: string; username?: string },
  ): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, changes, { new: true });
  }

  toPublicUser(user: UserDocument): PublicUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      avatarUrl: user.avatarUrl,
      title: user.title,
      username: user.username,
      provider: user.provider,
    };
  }
}
