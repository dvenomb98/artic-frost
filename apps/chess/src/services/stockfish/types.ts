type StockfishEvaluation = {
  evaluation: number;
  depth: number;
  updatedFen: string;
  bestMove: string;
};

type StockfishResponse = {
  type: "evaluation" | "position" | "bestmove";
  data: any;
};

export type {StockfishEvaluation, StockfishResponse};
