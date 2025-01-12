import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Workout } from './schemas/workout.schema';
import { Model } from 'mongoose';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(@InjectModel('Workout') private workoutModel: Model<Workout>) {}
  create(createWorkoutDto: CreateWorkoutDto) {
    return this.workoutModel.create(createWorkoutDto);
  }

  findAll() {
    return this.workoutModel.find();
  }

  findOne(id: string) {
    return this.workoutModel.findById(id);
  }

  update(id: string, updateWorkoutDto: UpdateWorkoutDto) {
    return this.workoutModel.findByIdAndUpdate(id.toString(), updateWorkoutDto);
  }

  delete(id: string) {
    return this.workoutModel.findByIdAndDelete(id);
  }
}
