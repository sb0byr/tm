import { TaskManager } from "./TaskManager";
import {
    DefaultFreeSpaceStrategy,
    FifoFreeSpaceStrategy,
    FreeSpaceStrategy,
    PriorityFreeSpaceStrategy
} from "./strategies/FreeSpaceStrategy";
import { Storage } from "./storage/Storage";

export enum FreeSpaceStrategyType {
    Default,
    Fifo,
    Priority
}

export const createTaskManager = (freeSpaceStrategyType: FreeSpaceStrategyType, maxTaskNumber: number) => {
    const strategy = (): FreeSpaceStrategy => {
        switch (freeSpaceStrategyType) {
            case FreeSpaceStrategyType.Fifo:
                return new FifoFreeSpaceStrategy();
            case FreeSpaceStrategyType.Priority:
                return new PriorityFreeSpaceStrategy();
        }
        return new DefaultFreeSpaceStrategy();
    }
    const storage = new Storage(maxTaskNumber);
    return new TaskManager(strategy(), storage);
}