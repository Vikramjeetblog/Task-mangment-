import {
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { PRIORITIES, type Priority } from '../../common/task-fields';

/** Every field optional — a PATCH only carries what changed. */
export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(1, 120)
  name?: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: Priority;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lead?: string;
}
