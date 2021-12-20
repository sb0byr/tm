export enum Priority {
    Low,
    Medium,
    High,
};

export class Process {
    readonly pid: number;
    readonly priority: Priority;

    constructor(pid: number, priority: Priority) {
        this.pid = pid;
        this.priority = priority;
    }

    kill(): void {
        // Killed
    }
};
