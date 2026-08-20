import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { Priority } from '../common/task-fields';

// Shape sent to the frontend — internal fields (_id, owner, __v) stay server-side.
export interface PublicProject {
  id: string;
  name: string;
  priority: Priority;
  dueDate?: string;
  lead?: string;
  createdAt: string;
}

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async findAll(owner: string): Promise<PublicProject[]> {
    const projects = await this.projectModel
      .find({ owner: new Types.ObjectId(owner) })
      .sort({ createdAt: 1 });
    return projects.map((project) => this.toPublicProject(project));
  }

  async findOne(owner: string, id: string): Promise<PublicProject> {
    return this.toPublicProject(await this.getOwned(owner, id));
  }

  async create(owner: string, dto: CreateProjectDto): Promise<PublicProject> {
    const project = await this.projectModel.create({
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      owner: new Types.ObjectId(owner),
    });
    return this.toPublicProject(project);
  }

  async update(
    owner: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<PublicProject> {
    const project = await this.getOwned(owner, id);

    if (dto.name !== undefined) project.name = dto.name;
    if (dto.priority !== undefined) project.priority = dto.priority;
    if (dto.lead !== undefined) project.lead = dto.lead;
    if (dto.dueDate !== undefined) project.dueDate = new Date(dto.dueDate);

    await project.save();
    return this.toPublicProject(project);
  }

  async remove(owner: string, id: string): Promise<void> {
    const result = await this.projectModel.deleteOne({
      _id: this.toObjectId(id),
      owner: new Types.ObjectId(owner),
    });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Project not found');
    }
  }

  /**
   * Loads a project the caller owns. Someone else's id is a 404 rather than a
   * 403, so ids can't be probed for existence.
   */
  private async getOwned(owner: string, id: string): Promise<ProjectDocument> {
    const project = await this.projectModel.findOne({
      _id: this.toObjectId(id),
      owner: new Types.ObjectId(owner),
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  /** A malformed id can't match anything, so treat it as "not found". */
  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Project not found');
    }
    return new Types.ObjectId(id);
  }

  private toPublicProject(project: ProjectDocument): PublicProject {
    return {
      id: project.id,
      name: project.name,
      priority: project.priority,
      dueDate: project.dueDate?.toISOString(),
      lead: project.lead,
      createdAt: (project as ProjectDocument & { createdAt: Date }).createdAt.toISOString(),
    };
  }
}
