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

  @Prop({ required: true, enum: ['guest', 'google'] })
  provider: AuthProvider;

  @Prop({ index: true, sparse: true, unique: true })
  googleId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
