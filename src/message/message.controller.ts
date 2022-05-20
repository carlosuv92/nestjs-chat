import { Controller, Post, Body, Get, Param, UsePipes } from '@nestjs/common';
import { UserValidationPipe } from 'src/users/pipes/user-validation.pipe';
import { MessageDto } from './dto/new-message.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send')
  @UsePipes(UserValidationPipe)
  newMessage(@Body() messageDto: MessageDto) {
    return this.messageService.newMessage(messageDto);
  }

  @Get('all/:id')
  getAllMessages(@Param('id') id: Number) {
    return this.messageService.getAllMessages(+id);
  }
}
