import { Controller, Post, Body, UseFilters, UseInterceptors, UsePipes, Get } from '@nestjs/common';
import { ValidateMultipleObjectId } from 'src/commons/pipes/validation.pipe';
import { RoomDto } from './dto/room.dto';
import { NewRoomInterceptor } from './room.interceptor';
import { RoomService } from './room.service';

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
}
