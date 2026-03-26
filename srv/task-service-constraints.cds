using { TaskService } from './task-service';

annotate TaskService.Tasks with {
  title @mandatory
        @mandatory.message: 'Title is required';
};