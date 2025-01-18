import { Injectable } from '@nestjs/common';
import { CreateExerciseDto } from './dto';
import { UpdateExerciseDto } from './dto';
import { Exercise } from './schemas/exercise.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel('Exercise')
    private exerciseModel: Model<Exercise>,
  ) {}

  create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const createdExercise = new this.exerciseModel(createExerciseDto);
    return createdExercise.save();
  }

  findAll() {
    return this.exerciseModel.find();
  }

  findOne(id: string) {
    return this.exerciseModel.findById(id);
  }

  update(id: string, updateExerciseDto: UpdateExerciseDto) {
    return this.exerciseModel.findByIdAndUpdate(id, updateExerciseDto);
  }

  delete(id: string) {
    return this.exerciseModel.findByIdAndDelete(id);
  }
}
