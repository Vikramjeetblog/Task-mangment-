import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import {
  CreateCommentDto,
  CreateResourceDto,
  CreateSubtaskDto,
  CreateTaskDto,
  UpdateSubtaskDto,
  UpdateTaskDto,
  ReactionDto,
} from './dto/task.dto';
import type { UserDocument } from '../users/schemas/user.schema';
import type { Priority, TaskStatus } from '../common/task-fields';

export interface PublicSubtask {
  id: string;
  title: string;
  priority: Priority;
  dueDate?: string;
  done: boolean;
}

export interface PublicResource {
  id: string;
  name: string;
  url: string;
}

export interface PublicComment {
  id: string;
  body: string;
  createdAt: string;
  parentId?: string;
  reactions: string[];
  author: {
    id: string;
    name: string;
    avatarColor?: string;
    avatarUrl?: string;
  };
}

export interface PublicTask {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  labels: string[];
  projectId?: string;
  subtasks: PublicSubtask[];
  comments: PublicComment[];
  resources: PublicResource[];
  createdAt: string;
}

// Mongoose gives subdocuments an _id and timestamps; these describe what we read
// back off them without reaching for `any`.
type SubtaskDoc = Task['subtasks'][number] & { _id: Types.ObjectId };
type ResourceDoc = Task['resources'][number] & { _id: Types.ObjectId };
type CommentDoc = Task['comments'][number] & {
  parentId?: Types.ObjectId;
  _id: Types.ObjectId;
  createdAt: Date;
};
type WithTimestamps = { createdAt: Date };

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(owner: string, projectId?: string): Promise<PublicTask[]> {
    const filter: Record<string, unknown> = {
      owner: new Types.ObjectId(owner),
    };
    if (projectId) filter.projectId = this.toObjectId(projectId);

    const tasks = await this.taskModel.find(filter).sort({ createdAt: 1 });
    return tasks.map((task) => this.toPublicTask(task));
  }

  async findOne(owner: string, id: string): Promise<PublicTask> {
    return this.toPublicTask(await this.getOwned(owner, id));
  }

  async create(owner: string, dto: CreateTaskDto): Promise<PublicTask> {
    const task = await this.taskModel.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      projectId: dto.projectId ? new Types.ObjectId(dto.projectId) : undefined,
      owner: new Types.ObjectId(owner),
    });
    return this.toPublicTask(task);
  }

  async update(
    owner: string,
    id: string,
    dto: UpdateTaskDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, id);

    if (dto.title !== undefined) task.title = dto.title;
    if (dto.description !== undefined) task.description = dto.description;
    if (dto.status !== undefined) task.status = dto.status;
    if (dto.priority !== undefined) task.priority = dto.priority;
    if (dto.assignee !== undefined) task.assignee = dto.assignee;
    if (dto.labels !== undefined) task.labels = dto.labels;
    if (dto.dueDate !== undefined) task.dueDate = new Date(dto.dueDate);
    if (dto.projectId !== undefined) {
      task.projectId = new Types.ObjectId(dto.projectId);
    }

    await task.save();
    return this.toPublicTask(task);
  }

  async remove(owner: string, id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({
      _id: this.toObjectId(id),
      owner: new Types.ObjectId(owner),
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  // --- Subtasks: nested, so each call returns the updated task ---

  async addSubtask(
    owner: string,
    taskId: string,
    dto: CreateSubtaskDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    task.subtasks.push({
      title: dto.title,
      priority: dto.priority ?? 'none',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      done: false,
    });
    await task.save();
    return this.toPublicTask(task);
  }

  async updateSubtask(
    owner: string,
    taskId: string,
    subtaskId: string,
    dto: UpdateSubtaskDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    const subtask = (task.subtasks as SubtaskDoc[]).find(
      (item) => item._id.toString() === subtaskId,
    );
    if (!subtask) throw new NotFoundException('Subtask not found');

    if (dto.title !== undefined) subtask.title = dto.title;
    if (dto.priority !== undefined) subtask.priority = dto.priority;
    if (dto.done !== undefined) subtask.done = dto.done;
    if (dto.dueDate !== undefined) subtask.dueDate = new Date(dto.dueDate);

    await task.save();
    return this.toPublicTask(task);
  }

  async removeSubtask(
    owner: string,
    taskId: string,
    subtaskId: string,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    const before = task.subtasks.length;
    task.subtasks = (task.subtasks as SubtaskDoc[]).filter(
      (item) => item._id.toString() !== subtaskId,
    );
    if (task.subtasks.length === before) {
      throw new NotFoundException('Subtask not found');
    }
    await task.save();
    return this.toPublicTask(task);
  }

  // --- Comments ---

  async addComment(
    author: UserDocument,
    taskId: string,
    dto: CreateCommentDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(author.id, taskId);
    task.comments.push({
      body: dto.body,
      authorId: new Types.ObjectId(author.id),
      authorName: author.name,
      authorAvatarColor: author.avatarColor,
      authorAvatarUrl: author.avatarUrl,
      parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : undefined,
      reactions: [],
    });
    await task.save();
    return this.toPublicTask(task);
  }

  async removeComment(
    owner: string,
    taskId: string,
    commentId: string,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    const before = task.comments.length;
    task.comments = (task.comments as CommentDoc[]).filter(
      (item) => item._id.toString() !== commentId,
    );
    if (task.comments.length === before) {
      throw new NotFoundException('Comment not found');
    }
    await task.save();
    return this.toPublicTask(task);
  }

  /** Toggles an emoji on a comment — clicking the same one again removes it. */
  async toggleReaction(
    owner: string,
    taskId: string,
    commentId: string,
    dto: ReactionDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    const comment = (task.comments as CommentDoc[]).find(
      (item) => item._id.toString() === commentId,
    );
    if (!comment) throw new NotFoundException('Comment not found');

    const existing = comment.reactions ?? [];
    comment.reactions = existing.includes(dto.emoji)
      ? existing.filter((emoji) => emoji !== dto.emoji)
      : [...existing, dto.emoji];

    await task.save();
    return this.toPublicTask(task);
  }

  // --- Resources: links or documents attached to the task ---

  async addResource(
    owner: string,
    taskId: string,
    dto: CreateResourceDto,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    task.resources.push({ name: dto.name, url: dto.url });
    await task.save();
    return this.toPublicTask(task);
  }

  async removeResource(
    owner: string,
    taskId: string,
    resourceId: string,
  ): Promise<PublicTask> {
    const task = await this.getOwned(owner, taskId);
    const before = task.resources.length;
    task.resources = (task.resources as ResourceDoc[]).filter(
      (item) => item._id.toString() !== resourceId,
    );
    if (task.resources.length === before) {
      throw new NotFoundException('Resource not found');
    }
    await task.save();
    return this.toPublicTask(task);
  }

  /**
   * Loads a task the caller owns. Someone else's id is a 404 rather than a 403,
   * so ids can't be probed for existence.
   */
  private async getOwned(owner: string, id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({
      _id: this.toObjectId(id),
      owner: new Types.ObjectId(owner),
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  /** A malformed id can't match anything, so treat it as "not found". */
  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Task not found');
    }
    return new Types.ObjectId(id);
  }

  private toPublicTask(task: TaskDocument): PublicTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate?.toISOString(),
      labels: task.labels,
      projectId: task.projectId?.toString(),
      subtasks: (task.subtasks as SubtaskDoc[]).map((subtask) => ({
        id: subtask._id.toString(),
        title: subtask.title,
        priority: subtask.priority,
        dueDate: subtask.dueDate?.toISOString(),
        done: subtask.done,
      })),
      comments: (task.comments as CommentDoc[]).map((comment) => ({
        id: comment._id.toString(),
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        parentId: comment.parentId?.toString(),
        reactions: comment.reactions ?? [],
        author: {
          id: comment.authorId.toString(),
          name: comment.authorName,
          avatarColor: comment.authorAvatarColor,
          avatarUrl: comment.authorAvatarUrl,
        },
      })),
      resources: (task.resources as ResourceDoc[]).map((resource) => ({
        id: resource._id.toString(),
        name: resource.name,
        url: resource.url,
      })),
      createdAt: (task as TaskDocument & WithTimestamps).createdAt.toISOString(),
    };
  }
}
