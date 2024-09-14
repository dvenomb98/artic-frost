const DELETE_COUNT = 1;
const BREAK_CASTLE_PIECES = {
  WHITE: ["K", "R"],
  BLACK: ["k", "r"],
};
const STRING_TO_COL_MAP: { [key: string]: number } = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };

export {
    DELETE_COUNT,
    BREAK_CASTLE_PIECES,
    STRING_TO_COL_MAP
}