import { Process } from './Process'

export type Task = {
    readonly process: Process
    readonly createdAt: Date
};
