
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  Param,
  ParseIntPipe,
  BadRequestException,
  UseGuards,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/Decorators/roles.decorator';
import { RoleType } from '../common/role.entity';

@Controller('projects/:projectId/files')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',                              // ← where files go
      filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
      },
    }),
  }),
)
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles(RoleType.CLIENT, RoleType.FREELANCER)
  async upload(
    @Req() req,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    // req.user is your User entity thanks to JwtStrategy.validate()
    return this.filesService.create(
      req.user.id,
      projectId,
      file,
    );
  }


  @Get()
  @Roles(RoleType.CLIENT, RoleType.FREELANCER)
  async findAll(
    @Req() req,
    @Param('projectId', ParseIntPipe) projectId: number,
  ) {
    // optional: re-check that req.user.id is allowed on this project
    return this.filesService.findAll(projectId);
  }
}
