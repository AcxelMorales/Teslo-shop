import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';

import { fileFilter } from './helpers/fileFilter';
import { fileNamer } from './helpers/fileNamer';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter,
    limits: {
      fileSize: 1000000
    },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    return file;
  }

}
