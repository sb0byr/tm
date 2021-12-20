import { Task } from "../models/Task";

export class Storage {
    private tasks: Task[] = [];
    private capacity: number

    constructor(capacity: number) {
        this.capacity = capacity;
    }

    get list(): Task[] {
        return this.tasks;
    }

    get size(): number {
        return this.tasks.length;
    }

    get hasSpace(): boolean {
        return this.tasks.length < this.capacity;
    }

    add(task: Task): void {
        if (this.tasks.length < this.capacity) {
            this.tasks.push(task);
        } else {
            throw new Error(`Maximum number of processes (${this.capacity}) exceeded`);
        }
    }

    remove(tasksToRemove: number[]): void {
        this.tasks = [...this.tasks].filter(
            task => !tasksToRemove.includes(task.process.pid)
        );
    }
};

