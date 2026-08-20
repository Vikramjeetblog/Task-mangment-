import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  PRIORITIES,
  TASK_STATUSES,
  type Priority,
  type TaskStatus,
} from '../../common/task-fields';

export type TaskDocument = HydratedDocument<Task>;

/** Subtasks and comments are only ever read and written through their task,
 *  so they're subdocuments rather than collections of their own. */
@Schema({ timestamps: true, _id: true })
export class Subtask {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ enum: PRIORITIES, default: 'none' })
  priority: Priority;

  @Prop()
  dueDate?: Date;

  @Prop({ default: false })
  done: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);

@Schema({ timestamps: true, _id: true })
export class Comment {
  @Prop({ required: true, trim: true })
  body: string;

  // The author's name and avatar are copied in at write time, so reading a task
  // never needs a second lookup. A later rename doesn't rewrite old comments.
  @Prop({ type: Types.ObjectId, required: true })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  authorName: string;

  @Prop()
  authorAvatarColor?: string;

  @Prop()
  authorAvatarUrl?: string;

  // Set when this comment is a reply; top-level comments leave it undefined.
  @Prop({ type: Types.ObjectId })
  parentId?: Types.ObjectId;

  // Emoji reactions, stored on the comment rather than as separate documents.
  @Prop({ type: [String], default: [] })
  reactions: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

/** A link or document attached to a task. */
@Schema({ timestamps: true, _id: true })
export class Resource {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  url: string;
}

export const ResourceSchema = SchemaFactory.createForClass(Resource);

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: TASK_STATUSES, default: 'todo' })
  status: TaskStatus;

  @Prop({ enum: PRIORITIES, default: 'none' })
  priority: Priority;

  @Prop()
  assignee?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: [String], default: [] })
  labels: string[];

  // Optional — tasks can stand alone, outside any project.
  @Prop({ type: Types.ObjectId, index: true })
  projectId?: Types.ObjectId;

  @Prop({ type: [SubtaskSchema], default: [] })
  subtasks: Subtask[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];

  @Prop({ type: [ResourceSchema], default: [] })
  resources: Resource[];

  @Prop({ type: Types.ObjectId, required: true, index: true })
  owner: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
