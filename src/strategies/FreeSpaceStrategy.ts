
import { Process } from '../models/Process';
import { Task } from '../models/Task'
import { Direction, SortBy, taskSort } from '../sort/Sort'

export interface FreeSpaceStrategy {
    tasksToRemove(process: Process, tasks: Task[]): Task[];
}


export class DefaultFreeSpaceStrategy implements FreeSpaceStrategy {
    tasksToRemove(newProcess: Process, tasks: Task[]): Task[] {
        return [];
    }
}

export class FifoFreeSpaceStrategy implements FreeSpaceStrategy {
    tasksToRemove(newProcess: Process, tasks: Task[]): Task[] {
        if (tasks.length === 0) {
            return [];
        }
        return [taskSort(tasks, SortBy.CreatedAt, Direction.Ascending)[0]];
    }
}

export class PriorityFreeSpaceStrategy implements FreeSpaceStrategy {
    tasksToRemove(newProcess: Process, tasks: Task[]): Task[] {
        if (tasks.length === 0) {
            return [];
        }
        const sorted = taskSort(
            taskSort(tasks, SortBy.CreatedAt, Direction.Ascending),
            SortBy.Priority, Direction.Descending);
        return sorted[0].process.priority < newProcess.priority ? [sorted[0]] : [];
    }
}
