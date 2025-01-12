import { Tableau } from "./Tableau";

export type SimplexData = {
  IsFeasible: boolean;
  OptimalSolutions: {[key: number]: string}[];
  OptimalCost: string;
  DegenerateVariablesIdx: number[];
  NumSlack: number;
  NumArtificial: number;
  BasicSolution: string[];
  OptimalTableaus: Tableau[];
  OptimaAdjacencyLists: number[][];
}

export type TwoPhaseSimplexData = SimplexData & {
  PhaseOneTableaus: Tableau[];
  PhaseOneRepeatedTableauIdx: number;
  PhaseTwoTableaus: Tableau[];
  PhaseTwoRepeatedTableauIdx: number;
}

export type BigMSimplexData = SimplexData & {
  NonOptimalTableaus: Tableau[];
  RepeatedTableauIdx: number;
}