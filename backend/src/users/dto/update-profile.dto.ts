import { IsOptional, IsString, MaxLength } from 'class-validator';

// All fields optional so the frontend can send only what changed (PATCH, not PUT)
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  username?: string;
}
