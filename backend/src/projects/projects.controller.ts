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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@CurrentUser() user: UserDocument) {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.projectsService.findOne(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: UserDocument, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: UserDocument,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: UserDocument, @Param('id') id: string) {
    return this.projectsService.remove(user.id, id);
  }
}
