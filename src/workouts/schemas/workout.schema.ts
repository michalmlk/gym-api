import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { WorkoutCategory } from '../dto/create-workout.dto';

export type WorkoutDocument = HydratedDocument<Workout>;

export interface ExerciseMeta {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  isOwnBodyWeight?: boolean;
}

@Schema()
export class Workout {
  @Prop({ type: String, required: true })
  creatorId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  descriptions: string;

  @Prop({
    type: [
      {
        exerciseId: { type: String, required: true },
        sets: {
          type: Number,
          required: true,
          min: [1, 'Sets must be at least 1'],
        },
        reps: {
          type: Number,
          required: true,
          min: [1, 'Sets must be at least 1'],
        },
        weight: { type: Number },
        isOwnBodyWeight: { type: Boolean },
      },
    ],
    required: true,
    validate: {
      validator: (value: ExerciseMeta[]) => value.length > 0,
      message: 'Plan must contain at least one exercise',
    },
  })
  @Prop({
    type: [Object],
    required: true,
    validate: {
      validator: (value: WorkoutCategory[]) =>
        value.every((val) =>
          [
            'strength',
            'endurance',
            'flexibility',
            'balance',
            'mobility',
          ].includes(val),
        ),
      message: 'Invalid workout category',
    },
  })
  exercisesMeta: ExerciseMeta[];

  @Prop({
    enum: ['strength', 'endurance', 'flexibility', 'balance', 'mobility'],
    type: [String],
  })
  tags: WorkoutCategory[];
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);
