import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards, ValidationPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailValidationPipe, UserIdValidationPipe } from './pipes/user-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { ValidateObjectId } from 'src/commons/pipes/validation.pipe';
import { FilesService } from 'src/files/files.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { renameAvatar, filterOnlyImage } from 'src/files/helpers/files.helper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files/',
        filename: renameAvatar,
      }),
      fileFilter: filterOnlyImage,
    }),
  )
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body(EmailValidationPipe, UserIdValidationPipe) createUserDto: CreateUserDto, @UploadedFile() file: Express.Multer.File) {
    // const { _id } = await this.usersService.create(createUserDto);
    const avatar = this.filesService.saveAvatar(file, '_id');
    // this.usersService.updateAvatar(+_id, avatar);
    return true;
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidateObjectId)
  findOne(@Param('id') id: Types.ObjectId) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
