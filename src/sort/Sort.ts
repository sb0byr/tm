import { Task } from '../models/Task'

export enum SortBy {
    CreatedAt = 'CreatedAt',
    Priority = 'Priority',
    Pid = 'Pid',
};

export enum Direction {
    Ascending = 'Ascending',
    Descending = 'Descending'
}

export type TaskSort = (tasks: Task[], sortBy: SortBy, direction: Direction) => Task[];

export const taskSort = (
    tasks: Task[],
    sortBy: SortBy,
    direction: Direction = Direction.Ascending
): Task[] => {
    const getProperty = (sortBy: SortBy, task: Task): Date | number => {
        switch (sortBy) {
            case SortBy.CreatedAt:
                return task.createdAt;
            case SortBy.Pid:
                return task.process.pid;
            case SortBy.Priority:
                return task.process.priority;
        }
    }
    const compare = (a: Task, b: Task) => {
        const propA = getProperty(sortBy, a);
        const propB = getProperty(sortBy, b);
        if (propA === propB) {
            return 0;
        }
        return (direction == Direction.Ascending)
            ? (propA > propB) ? 1 : -1
            : (propA > propB) ? -1 : 1;
    }
    return tasks.slice().sort(compare)
}
