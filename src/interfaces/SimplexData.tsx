import { Tableau } from "./Tableau";

export type SimplexData = {
  OptimalSolutions: {[key: number]: string}[];
  OptimalCost: string;
  DegenerateVariablesIdx: number[];
  NumSlack: number;
  NumArtificial: number;
  BasicSolution: string[];
}

export type TwoPhaseSimplexData = SimplexData & {
  PhaseOneTableaus: Tableau[];
  PhaseOneRepeatedTableauIdx: number;
  PhaseTwoTableaus: Tableau[];
  PhaseTwoRepeatedTableauIdx: number;
}

export type BigMSimplexData = SimplexData & {
  Tableaus: Tableau[];
  RepeatedTableauIdx: number;
  IsFeasible: boolean;
}