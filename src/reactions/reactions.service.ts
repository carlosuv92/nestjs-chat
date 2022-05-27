import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { Reaction } from './schema/reactions.schema';

@Injectable()
export class ReactionsService {
  constructor(@InjectModel('Reaction') private readonly reactionModel: Model<Reaction>) {}
  create(createReactionDto: CreateReactionDto) {
    return this.reactionModel.create(createReactionDto);
  }

  findAll() {
    return this.reactionModel.find();
  }

  findOne(id: number) {
    return this.reactionModel.findOne({ id });
  }

  update(id: number, updateReactionDto: UpdateReactionDto) {
    return `This action updates a #${id} reaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }
}
