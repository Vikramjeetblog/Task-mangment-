import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export type AuthProvider = 'guest' | 'google';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop()
  avatarColor: string;

  // Set for Google accounts (their real profile photo). Guests don't have one.
  @Prop()
  avatarUrl?: string;

  @Prop()
  title?: string;

  @Prop()
  username?: string;

  @Prop({ required: true, enum: ['guest', 'google'] })
  provider: AuthProvider;

  @Prop({ index: true, sparse: true, unique: true })
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
