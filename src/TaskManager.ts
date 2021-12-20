import { Priority, Process } from "./models/Process";
import { FreeSpaceStrategy } from './strategies/FreeSpaceStrategy';
import { Direction, SortBy, taskSort } from "./sort/Sort";
import { Storage } from "./storage/Storage";
import { KillAllAction, KillGroupAction, KillProcessAction } from "./actions/KillAction";
import { AddAction } from "./actions/AddAction";
import { ValidateAction } from "./actions/ValidateAction";
import { CheckSpaceAction } from "./actions/CheckSpaceAction";

export class TaskManager {
    private freeSpaceStrategy: FreeSpaceStrategy;
    private storage: Storage;

    constructor(strategy: FreeSpaceStrategy, storage: Storage) {
        this.freeSpaceStrategy = strategy;
        this.storage = storage;
    }

    add(process: Process): void {
        new ValidateAction(this.storage, process).run();
        new CheckSpaceAction(this.storage, this.freeSpaceStrategy, process).run();
        new AddAction(this.storage, process).run();
    }

    list(orderBy: SortBy = SortBy.CreatedAt): Process[] {
        return taskSort(this.storage.list, orderBy, Direction.Ascending)
            .map((t) => t.process);
    }

    kill(pid: number): void {
        new KillProcessAction(this.storage, pid).run();
    }

    killGroup(priority: Priority): void {
        new KillGroupAction(this.storage, priority).run();
    }

    killAll(): void {
        new KillAllAction(this.storage).run();
    }
};

