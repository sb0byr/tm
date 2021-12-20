import { Priority } from "../models/Process";
import { Task } from "../models/Task";

export class Search {
    taskByPid(tasks: Task[], pid: number): Task[] {
        return tasks.filter(
            task => task.process.pid == pid
        );
    }
    taskByPriority(tasks: Task[], priority: Priority): Task[] {
        return tasks.filter(
            task => task.process.priority == priority
        );
    }
}