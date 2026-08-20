import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PRIORITIES, type Priority } from '../../common/task-fields';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ enum: PRIORITIES, default: 'none' })
  priority: Priority;

  @Prop()
  dueDate?: Date;

  // Free text, matching how far the design goes — there is no member registry.
  @Prop()
  lead?: string;

  // Every project belongs to the user who created it; all queries filter on this.
  @Prop({ type: Types.ObjectId, required: true, index: true })
  owner: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
