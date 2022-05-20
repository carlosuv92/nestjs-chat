import { Controller, Post, Body, UseFilters, UseInterceptors } from '@nestjs/common';
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
}
