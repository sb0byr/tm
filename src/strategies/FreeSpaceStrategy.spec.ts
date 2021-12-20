import { Priority, Process } from "../models/Process";
import { DefaultFreeSpaceStrategy, FifoFreeSpaceStrategy, PriorityFreeSpaceStrategy } from "./FreeSpaceStrategy";

describe("strategies", () => {
    describe("DefaultFreeSpaceStrategy", () => {
        it("does not remove any task", () => {
            const tasks = [
                {
                    createdAt: new Date("2019-01-01T06:00:00.000Z"),
                    process: new Process(2, Priority.High)
                },
                {
                    createdAt: new Date("2019-01-01T04:00:00.000Z"),
                    process: new Process(3, Priority.Low)
                },
                {
                    createdAt: new Date("2019-01-01T01:00:00.000Z"),
                    process: new Process(1, Priority.Medium)
                },
            ]
            const strategy = new DefaultFreeSpaceStrategy();
            const tasksToRemove = strategy.tasksToRemove(new Process(3, Priority.High), tasks)
            expect(tasksToRemove.length).toBe(0)
        })
    });

    describe("FifoFreeSpaceStrategy", () => {
        it("handles an empty task list gracefully", () => {
            const strategy = new FifoFreeSpaceStrategy();
            const tasksToRemove = strategy.tasksToRemove(new Process(4, Priority.Medium), [])
            expect(tasksToRemove.length).toBe(0);
        })
        it.each`
        oldTaskPriority    | oldestTaskPriority | newTaskPriority
        ${Priority.High}   | ${Priority.High}   | ${Priority.High} 
        ${Priority.High}   | ${Priority.Medium} | ${Priority.Medium}
        ${Priority.High}   | ${Priority.Low}    | ${Priority.Low}
        ${Priority.Medium} | ${Priority.High}   | ${Priority.High}
        ${Priority.Medium} | ${Priority.Medium} | ${Priority.Medium}
        ${Priority.Medium} | ${Priority.Low}    | ${Priority.Low}
        ${Priority.Low}    | ${Priority.High}   | ${Priority.High}
        ${Priority.Low}    | ${Priority.Medium} | ${Priority.Medium}
        ${Priority.Low}    | ${Priority.Low}    | ${Priority.Low}
        `('removes the oldest task, priority is not counted',
            ({ oldTaskPriority, oldestTaskPriority, newTaskPriority }): void => {
                const tasks = [
                    {
                        createdAt: new Date("2019-01-01T06:00:00.000Z"),
                        process: new Process(1, oldTaskPriority)
                    },
                    {
                        createdAt: new Date("2019-01-01T04:00:00.000Z"),
                        process: new Process(2, oldestTaskPriority)
                    },
                ]
                const strategy = new FifoFreeSpaceStrategy();
                const tasksToRemove = strategy.tasksToRemove(new Process(3, newTaskPriority), tasks)
                expect(tasksToRemove.length).toBe(1);
                expect(tasksToRemove[0].process.pid).toStrictEqual(2);
            })
    });

    describe("PriorityFreeSpaceStrategy", () => {
        it("handles an empty task list gracefully", () => {
            const strategy = new PriorityFreeSpaceStrategy();
            const tasksToRemove = strategy.tasksToRemove(new Process(4, Priority.Medium), [])
            expect(tasksToRemove.length).toBe(0);
        })
        it.each`
        existingTaskPriority | newTaskPriority
        ${Priority.Medium}   | ${Priority.High}
        ${Priority.Low}      | ${Priority.High}
        ${Priority.Low}      | ${Priority.Medium}
        `('removes an existing task with a lower priority',
            ({ existingTaskPriority, newTaskPriority }): void => {
                const tasks = [
                    {
                        createdAt: new Date("2019-01-01T08:00:00.000Z"),
                        process: new Process(2, existingTaskPriority)
                    },
                ]
                const strategy = new PriorityFreeSpaceStrategy();
                const tasksToRemove = strategy.tasksToRemove(new Process(3, newTaskPriority), tasks)
                expect(tasksToRemove.length).toBe(1);
                expect(tasksToRemove[0].process.pid).toStrictEqual(2);
            })
        it.each`
        existingTaskPriority | newTaskPriority
        ${Priority.Medium}   | ${Priority.Low}
        ${Priority.High}     | ${Priority.Low}
        ${Priority.High}     | ${Priority.Medium}
        ${Priority.High}     | ${Priority.High}
        ${Priority.Medium}   | ${Priority.Medium}
        ${Priority.Low}      | ${Priority.Low}
        `('does not remove a task with higher or the same priority',
            ({ existingTaskPriority, newTaskPriority }): void => {
                const tasks = [
                    {
                        createdAt: new Date("2019-01-01T08:00:00.000Z"),
                        process: new Process(2, existingTaskPriority)
                    },
                ]
                const strategy = new PriorityFreeSpaceStrategy();
                const tasksToRemove = strategy.tasksToRemove(new Process(3, newTaskPriority), tasks)
                expect(tasksToRemove.length).toBe(0);
            })
        it("removes the oldest task in case there are several with the same lower priority", () => {
            const tasks = [
                {
                    createdAt: new Date("2019-01-01T06:00:00.000Z"),
                    process: new Process(2, Priority.Low)
                },
                {
                    createdAt: new Date("2019-01-01T04:00:00.000Z"),
                    process: new Process(3, Priority.Low)
                },
            ]

            const strategy = new PriorityFreeSpaceStrategy();
            const tasksToRemove = strategy.tasksToRemove(new Process(4, Priority.Medium), tasks)
            expect(tasksToRemove.length).toBe(1);
            expect(tasksToRemove[0].process.pid).toStrictEqual(3);
        })
    });
});