import { Priority } from "../models/Process";
import { Task } from "../models/Task";
import { Search } from "../storage/Search";
import { Storage } from "../storage/Storage";

export class KillAction {
    private storage: Storage;
    private tasksToKill: Task[];
    constructor(storage: Storage, tasksToKill: Task[]) {
        this.storage = storage;
        this.tasksToKill = tasksToKill;
    }

    run() {
        this.storage.remove(this.tasksToKill.map((t) => t.process.pid));
        this.tasksToKill.forEach((task: Task) => {
            task.process.kill();
        });
    }
}

export class KillAllAction extends KillAction {
    constructor(storage: Storage) {
        super(storage, storage.list)
    }
}

export class KillGroupAction extends KillAction {
    constructor(storage: Storage, priority: Priority) {
        const tasks = new Search().taskByPriority(storage.list, priority)
        super(storage, tasks)
    }
}

export class KillProcessAction extends KillAction {
    constructor(storage: Storage, pid: number) {
        const tasks = new Search().taskByPid(storage.list, pid)
        super(storage, tasks)
    }
}
