import { Tableau } from "./Tableau";

export type SimplexData = {
  OptimalSolutions: {[key: number]: string}[];
  OptimalCost: string;
  DegenerateVariablesIdx: number[];
  NumSlack: number;
  NumArtificial: number;
  BasicSolution: string[];
  AlternativeOptimaTableaus: Tableau[];
}

export type TwoPhaseSimplexData = SimplexData & {
  PhaseOneTableaus: Tableau[];
  PhaseOneRepeatedTableauIdx: number;
  PhaseTwoTableaus: Tableau[];
  PhaseTwoRepeatedTableauIdx: number;
}

export type BigMSimplexData = SimplexData & {
  NonOptimalTableaus: Tableau[];
  OptimalTableaus: Tableau[];
  RepeatedTableauIdx: number;
  IsFeasible: boolean;
}