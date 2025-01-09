export type Tableau = {
  BasicVariablesIdx: number[];
  Matrix: string[][];
  Ratios: string[];
  ReducedCosts: string[] | null;
  MReducedCosts?: string[] | null;
}