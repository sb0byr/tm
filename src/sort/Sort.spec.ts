import { Priority, Process } from "../models/Process";
import { Direction, taskSort, SortBy } from "./Sort";

describe("taskSort", () => {
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

    it.each`
    orderBy             | direction               | expectedOrder
    ${SortBy.Pid}       | ${Direction.Ascending}  | ${[1, 2, 3]}
    ${SortBy.Priority}  | ${Direction.Ascending}  | ${[3, 1, 2]}
    ${SortBy.CreatedAt} | ${Direction.Ascending}  | ${[1, 3, 2]}
    ${SortBy.Pid}       | ${Direction.Descending} | ${[3, 2, 1]}
    ${SortBy.Priority}  | ${Direction.Descending} | ${[2, 1, 3]}
    ${SortBy.CreatedAt} | ${Direction.Descending} | ${[2, 3, 1]}
    `('orderBy: $orderBy, direction: $Direction[$direction] returns PIDs sorted: $expectedOrder',
        ({ orderBy, direction, expectedOrder }): void => {
            const pids = taskSort(tasks, orderBy, direction)
                .map((task) => task.process.pid)
            expect(pids).toStrictEqual(expectedOrder);
        })

    it("using ascending by default", () => {
        const pids = taskSort(tasks, SortBy.Pid)
            .map((task) => task.process.pid)
        expect(pids).toStrictEqual([1, 2, 3]);
    });
});