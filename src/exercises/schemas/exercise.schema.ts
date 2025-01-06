import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExerciseDocument = HydratedDocument<Exercise>;

export type BodyPart =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'legs'
  | 'booty'
  | 'core';

@Schema()
export class Exercise {
  @Prop({ type: String, required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    enum: ['chest', 'back', 'shoulders', 'legs', 'booty', 'core'],
    type: [String],
  })
  bodyPart: BodyPart[];
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
