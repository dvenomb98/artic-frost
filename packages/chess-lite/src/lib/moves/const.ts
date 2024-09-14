const directionsStraight = [
    { incRow: 1, incCol: 0 }, // up
    { incRow: 0, incCol: -1 }, // right
    { incRow: -1, incCol: 0 }, // down
    { incRow: 0, incCol: 1 }, // left
  ];
  
  const directionsDiagonal = [
    { incRow: 1, incCol: -1 }, // diag.left up
    { incRow: -1, incCol: -1 }, // diag.left down
    { incRow: 1, incCol: 1 }, // diag.right up
    { incRow: -1, incCol: 1 }, // diag.right down
  ];
  
  const knightDirections = [
    { incRow: 2, incCol: -1 }, // up-left
    { incRow: 2, incCol: 1 }, // up-right
    { incRow: 1, incCol: -2 }, // left-up
    { incRow: 1, incCol: 2 }, // left-down
    { incRow: -2, incCol: 1 }, // down-right
    { incRow: -2, incCol: -1 }, // down-left
    { incRow: -1, incCol: -2 }, // right-up
    { incRow: -1, incCol: 2 }, // right-down
  ];


export { directionsStraight, directionsDiagonal, knightDirections };