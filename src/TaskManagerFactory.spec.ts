import { Priority, Process } from "./models/Process";
import { SortBy } from "./sort/Sort";
import { createTaskManager, FreeSpaceStrategyType } from "./TaskManagerFactory";

describe("TaskManagerFactory provides a proper strategy and capacity", () => {
    describe("Default free space strategy", () => {
        it("throws an error if maximum number of processes exceeded", () => {
            const taskManager = createTaskManager(FreeSpaceStrategyType.Default, 1);
            taskManager.add(new Process(1, Priority.Low));
            expect(() => { taskManager.add(new Process(2, Priority.High)) }).toThrowError(
                "Maximum number of processes (1) exceeded"
            )
        });
    });
    describe("Fifo free space strategy", () => {
        it("replace a previous process with a new one if maximum number of processes exceeded", () => {
            const taskManager = createTaskManager(FreeSpaceStrategyType.Fifo, 1);
            taskManager.add(new Process(1, Priority.High));
            expect(taskManager.list(SortBy.Pid).length).toBe(1);
            taskManager.add(new Process(2, Priority.High));
            expect(taskManager.list(SortBy.Pid).length).toBe(1);
            expect(taskManager.list(SortBy.Pid)[0].pid).toBe(2);
        });
    });
    describe("Priority free space strategy", () => {
        it("replace a previous process with a new one if maximum number of processes exceeded", () => {
            const taskManager = createTaskManager(FreeSpaceStrategyType.Priority, 1);
            taskManager.add(new Process(1, Priority.Low));
            expect(taskManager.list(SortBy.Pid).length).toBe(1);
            taskManager.add(new Process(2, Priority.High));
            expect(taskManager.list(SortBy.Pid).length).toBe(1);
            expect(taskManager.list(SortBy.Pid)[0].pid).toBe(2);
        });
        it("throws an error if an existing process has the same priority and maximum number of processes exceeded", () => {
            const taskManager = createTaskManager(FreeSpaceStrategyType.Priority, 1);
            taskManager.add(new Process(1, Priority.Medium));
            expect(taskManager.list(SortBy.Pid).length).toBe(1);
            expect(() => { taskManager.add(new Process(2, Priority.Low)) }).toThrowError(
                "Maximum number of processes (1) exceeded"
            )
        });
    });
});