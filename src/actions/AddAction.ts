import { Process } from "../models/Process";
import { Storage } from "../storage/Storage";

export class AddAction {
    private storage: Storage;
    private process: Process;
    constructor(storage: Storage, process: Process) {
        this.storage = storage;
        this.process = process;
    }

    run() {
        this.storage.add({ process: this.process, createdAt: new Date() });
    }
}
