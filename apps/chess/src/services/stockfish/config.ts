interface EngineConfigValues {
    MAX_DEPTH: number
    NUMBER_OF_LINES: number
    MOVE_TIME: number
}

const ENGINE_CONFIG = Object.freeze({
    PLAY: {
        EASY: {
            MAX_DEPTH: 5,
            NUMBER_OF_LINES: 1,
            MOVE_TIME: 500 // 0.5 seconds per move
        },
        MEDIUM: {
            MAX_DEPTH: 10,
            NUMBER_OF_LINES: 2,
            MOVE_TIME: 1000 // 1 second per move
        },
        HARD: {
            MAX_DEPTH: 15,
            NUMBER_OF_LINES: 3,
            MOVE_TIME: 1500 // 1.5 seconds per move
        }
    },
    ANALYZE: {
        MAX_DEPTH: 20,
        NUMBER_OF_LINES: 5,
        MOVE_TIME: 1000 // Analyze for 1 second
    }
});

export { ENGINE_CONFIG, type EngineConfigValues}