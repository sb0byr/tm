import { Process } from "../models/Process";
import { FreeSpaceStrategy } from "../strategies/FreeSpaceStrategy";
import { KillAction } from "./KillAction";
import { Storage } from "../storage/Storage";

export class CheckSpaceAction {
    private storage: Storage;
    private process: Process;
    private freeSpaceStrategy: FreeSpaceStrategy;
    constructor(storage: Storage, freeSpaceStrategy: FreeSpaceStrategy, process: Process) {
        this.storage = storage;
        this.process = process;
        this.freeSpaceStrategy = freeSpaceStrategy;
    }

    run() {
        if (this.storage.hasSpace) {
            return;
        }
        const tasksToRemove = this.freeSpaceStrategy.tasksToRemove(this.process, this.storage.list);
        new KillAction(this.storage, tasksToRemove).run();
    }
}
