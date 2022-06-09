import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Observable, of } from 'rxjs';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class NewRoomInterceptor implements NestInterceptor {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    let { participants } = req.body;
    participants = [...new Set(participants)];
    const isAllObjectId = participants.every(id => Types.ObjectId.isValid(id));
    if (!isAllObjectId) throw new BadRequestException('At least one participant is invalid');
    if (participants.length < 2) throw new BadRequestException('At least 2 participants are required');
    const users = await this.isUserExists(participants);
    if (users.length !== participants.length) throw new BadRequestException('Invalid user id');
    req.body.participants = participants;
    return next.handle();
  }

  private isUserExists(ids: Types.ObjectId[]) {
    return this.userModel.find({ _id: { $in: ids } }).exec();
  }
}
