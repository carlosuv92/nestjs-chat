import { Controller, Post, Body, Get, Param, UsePipes, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { ValidateObjectId } from 'src/commons/pipes/validation.pipe';
import { FilesService } from 'src/files/files.service';
import { renameImage } from 'src/files/helpers/files.helper';
import { IdMessageDto, MessageDto, ReactionMessageDto, SeenDto, UpdateMessageDto } from './dto/messages.dto';
import { SendMessageInterceptor } from './messages.interceptor';
import { MessageService } from './messages.service';

@Controller('/message')
export class MessageController {
  constructor(private readonly messageService: MessageService, private readonly filesService: FilesService) {}

  @Post('/send')
  @UseInterceptors(SendMessageInterceptor)
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      storage: diskStorage({
        destination: './files/',
        filename: renameImage,
      }),
    }),
  )
  async newMessage(@Body() messageDto: MessageDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      const message = this.messageService.newMessage(messageDto);
      const { _id, room_id } = await message;
      if (files) {
        await this.filesService.saveMessageFiles(files, _id);
      }
      return { _id, room_id };
    } catch (error) {
      throw error;
    }
  }

  @Post('/edit')
  updateMessage(@Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.updateMessage(updateMessageDto);
  }

  @Get(':id')
  @UsePipes(ValidateObjectId)
  getAllMessages(@Param('id') id: Types.ObjectId) {
    return this.messageService.getAllMessages(id);
  }

  @Post('/make-seen')
  seenMessage(@Body() seenDto: SeenDto) {
    return this.messageService.seenMessage(seenDto);
  }

  @Post('/forward')
  @UsePipes(ValidateObjectId)
  async forwardMessage(@Body() messageDto: MessageDto) {
    const message = await this.messageService.newMessage(messageDto);
    return message;
  }

  @Post('/delete')
  deleteMessage(@Body() idMessageDto: IdMessageDto) {
    return this.messageService.deleteMessage(idMessageDto);
  }

  @Post('/message-reaction')
  reactionMessage(@Body() reactionMessageDto: ReactionMessageDto) {
    return this.messageService.reactionMessage(reactionMessageDto);
  }
}
