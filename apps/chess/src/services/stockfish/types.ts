type StockfishEvaluation = {
  evaluation: number;
  depth: number;
  updatedFen: string;
  bestMove: string;
};

type StockfishResponse = {
  type: "evaluation" | "position" | "bestmove";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any TODO
  data: any
};

export type {StockfishEvaluation, StockfishResponse};
