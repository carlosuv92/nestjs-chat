import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reaction, ReactionSchema } from './schema/reactions.schema';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Reaction.name,
        schema: ReactionSchema,
      },
    ]),
  ],
})
export class ReactionsModule {}
