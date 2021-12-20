import { DefaultFreeSpaceStrategy } from "./strategies/FreeSpaceStrategy";
import { Priority, Process } from "./models/Process";
import { taskSort, SortBy } from "./sort/Sort";
import { Storage } from "./storage/Storage";
import { TaskManager } from "./TaskManager";

describe("TaskManager", () => {
    it("throws an error if a process with the same PID already exists", () => {
        const taskManager = new TaskManager(new DefaultFreeSpaceStrategy(), new Storage(2));
        taskManager.add(new Process(1, Priority.High));
        expect(() => { taskManager.add(new Process(1, Priority.Low)) }).toThrowError(
            "Process with the provided ID (1) already exists"
        )
    });

    it("calls a `kill` method of a process when the process is killed", () => {
        const taskManager = new TaskManager(new DefaultFreeSpaceStrategy(), new Storage(2));
        const processMock = { pid: 1, priority: Priority.High, kill: jest.fn() };
        taskManager.add(processMock);
        taskManager.kill(1);
        expect(processMock.kill).toHaveBeenCalled();
    });

    it("kills all active processes with the provided priority", () => {
        const taskManager = new TaskManager(new DefaultFreeSpaceStrategy(), new Storage(10));
        taskManager.add(new Process(1, Priority.High));
        taskManager.add(new Process(2, Priority.Medium));
        taskManager.add(new Process(3, Priority.Medium));
        taskManager.add(new Process(4, Priority.Low));
        taskManager.killGroup(Priority.Medium);
        expect(taskManager.list(SortBy.Pid).length).toBe(2);
        expect(taskManager.list(SortBy.Pid).map((t) => t.pid)).toStrictEqual([1, 4]);
    });

    it("kills all active processes", () => {
        const taskManager = new TaskManager(new DefaultFreeSpaceStrategy(), new Storage(10));
        taskManager.add(new Process(1, Priority.High));
        taskManager.add(new Process(2, Priority.Medium));
        taskManager.add(new Process(3, Priority.Medium));
        taskManager.add(new Process(4, Priority.Low));
        taskManager.killAll();
        expect(taskManager.list(SortBy.Pid).length).toBe(0);
    });

    it("sorts by createdAt by default", () => {
        const storage = new Storage(10)
        storage.add({
            createdAt: new Date("2019-01-01T02:00:00.000Z"),
            process: new Process(1, Priority.Low)
        });
        storage.add({
            createdAt: new Date("2019-01-01T03:00:00.000Z"),
            process: new Process(2, Priority.Medium)
        });
        storage.add({
            createdAt: new Date("2019-01-01T01:00:00.000Z"),
            process: new Process(3, Priority.High)
        });

        const taskManager = new TaskManager(new DefaultFreeSpaceStrategy(), storage);
        expect(taskManager.list().length).toBe(3);
        expect(taskManager.list().map((t) => t.pid)).toStrictEqual([3, 1, 2]);
    });
});