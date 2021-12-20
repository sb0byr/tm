import { Priority, Process } from "../models/Process";
import { Storage } from "./Storage";

describe("Storage", () => {
    it("adds a new task", () => {
        const storage = new Storage(1);
        expect(storage.hasSpace).toBe(true);
        storage.add({ createdAt: new Date(), process: new Process(99, Priority.High) });
        expect(storage.size).toBe(1);
        expect(storage.list[0].process.pid).toBe(99)
        expect(storage.hasSpace).toBe(false);
    });

    it("removes an existing task", () => {
        const storage = new Storage(3);
        storage.add({ createdAt: new Date(), process: new Process(1, Priority.High) });
        storage.add({ createdAt: new Date(), process: new Process(2, Priority.High) });
        storage.add({ createdAt: new Date(), process: new Process(3, Priority.High) });
        expect(storage.hasSpace).toBe(false);
        storage.remove([2]);
        expect(storage.size).toBe(2);
        expect(storage.hasSpace).toBe(true);
        expect(storage.list.map((t) => t.process.pid)).toStrictEqual([1, 3]);
    });

    it("throws an error if maximum number of processes exceeded", () => {
        const storage = new Storage(2);
        storage.add({ createdAt: new Date(), process: new Process(1, Priority.High) });
        storage.add({ createdAt: new Date(), process: new Process(2, Priority.High) });
        expect(() => {
            storage.add({ createdAt: new Date(), process: new Process(3, Priority.High) });
        }).toThrowError("Maximum number of processes (2) exceeded")
    });
});