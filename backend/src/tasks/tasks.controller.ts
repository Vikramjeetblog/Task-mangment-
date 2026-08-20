import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
import { TasksService } from './tasks.service';
import {
  CreateCommentDto,
  CreateResourceDto,
  CreateSubtaskDto,
  CreateTaskDto,
  UpdateSubtaskDto,
  UpdateTaskDto,
  ReactionDto,
} from './dto/task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(
    @CurrentUser() user: UserDocument,
    @Query('projectId') projectId?: string,
  ) {
    return this.tasksService.findAll(user.id, projectId);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.tasksService.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: UserDocument, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.tasksService.remove(user.id, id);
  }

  // --- Subtasks — nested under the task, so each call returns the task ---

  @Post(':id/subtasks')
  addSubtask(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: CreateSubtaskDto,
  ) {
    return this.tasksService.addSubtask(user.id, id, dto);
  }

  @Patch(':id/subtasks/:subtaskId')
  updateSubtask(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
    @Body() dto: UpdateSubtaskDto,
  ) {
    return this.tasksService.updateSubtask(user.id, id, subtaskId, dto);
  }

  @Delete(':id/subtasks/:subtaskId')
  removeSubtask(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Param('subtaskId') subtaskId: string,
  ) {
    return this.tasksService.removeSubtask(user.id, id, subtaskId);
  }

  // --- Comments ---

  @Post(':id/comments')
  addComment(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.tasksService.addComment(user, id, dto);
  }

  @Delete(':id/comments/:commentId')
  removeComment(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
  ) {
    return this.tasksService.removeComment(user.id, id, commentId);
  }

  /** Toggles an emoji — posting the same one again removes it. */
  @Post(':id/comments/:commentId/reactions')
  toggleReaction(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Body() dto: ReactionDto,
  ) {
    return this.tasksService.toggleReaction(user.id, id, commentId, dto);
  }

  // --- Resources: links or documents attached to the task ---

  @Post(':id/resources')
  addResource(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: CreateResourceDto,
  ) {
    return this.tasksService.addResource(user.id, id, dto);
  }

  @Delete(':id/resources/:resourceId')
  removeResource(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Param('resourceId') resourceId: string,
  ) {
    return this.tasksService.removeResource(user.id, id, resourceId);
  }
}
