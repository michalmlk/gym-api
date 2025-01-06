import {
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ValidatorConstraint,
} from 'class-validator';
import { BodyPart } from '../schemas/exercise.schema';

@ValidatorConstraint({ name: 'IsBodyPartUnionMember', async: false })
class IsBodyPartUnionMember {
  validate(value: string): boolean {
    return ['chest', 'back', 'shoulders', 'legs', 'booty', 'core'].includes(
      value,
    );
  }
}

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  @Validate(IsBodyPartUnionMember)
  bodyPart: BodyPart;
}
