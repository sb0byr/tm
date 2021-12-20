import { Process } from "../models/Process";
import { Search } from "../storage/Search";
import { Storage } from "../storage/Storage";

export class ValidateAction {
    private storage: Storage;
    private process: Process;

    constructor(storage: Storage, process: Process) {
        this.storage = storage;
        this.process = process;
    }

    run() {
        const tasks = new Search().taskByPid(this.storage.list, this.process.pid);
        if (tasks.length) {
            throw new Error(`Process with the provided ID (${this.process.pid}) already exists`);
        }
    }
}
