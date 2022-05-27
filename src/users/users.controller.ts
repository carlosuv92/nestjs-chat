import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailValidationPipe, UserIdValidationPipe } from './pipes/user-validation.pipe';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Types } from 'mongoose';
import { ValidateObjectId } from 'src/commons/pipes/validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(EmailValidationPipe, UserIdValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
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
