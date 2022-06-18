import { Controller, Post, Body, UseFilters, UseInterceptors, UsePipes, Get, Param } from '@nestjs/common';
import { ValidateMultipleObjectId } from 'src/commons/pipes/validation.pipe';
import { RoomDto } from './dto/room.dto';
import { NewRoomInterceptor } from './rooms.interceptor';
import { RoomService } from './rooms.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseInterceptors(NewRoomInterceptor)
  create(@Body() roomDto: RoomDto) {
    return this.roomService.create(roomDto);
  }

  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Get('/contacts/:id')
  findContacts(@Param('id') id: string) {
    return this.roomService.findContacts(id);
  }
}
