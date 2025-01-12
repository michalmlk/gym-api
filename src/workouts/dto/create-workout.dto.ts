import {
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import { ExerciseMeta } from '../schemas/workout.schema';

export type WorkoutCategory =
  | 'strength'
  | 'endurance'
  | 'flexibility'
  | 'balance'
  | 'mobility';

@ValidatorConstraint({ name: 'IsValidWorkoutCategory', async: false })
class IsValidWorkoutCategory {
  validate(value: string[]): boolean {
    return value.every((val) =>
      ['strength', 'endurance', 'flexibility', 'balance', 'mobility'].includes(
        val,
      ),
    );
  }
}

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  creatorId: string;

  @IsArray()
  @Validate(IsValidWorkoutCategory)
  tags: WorkoutCategory[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsNotEmpty()
  exercisesMeta: ExerciseMeta[];
}
