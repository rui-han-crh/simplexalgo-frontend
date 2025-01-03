import { Tableau } from "./Tableau";

export type SimplexData = {
  OptimalSolution: string[];
  OptimalCost: string;
  Degeneracy: number[];
  NumSlack: number;
  NumArtificial: number;
}

export type TwoPhaseSimplexData = SimplexData & {
  FirstBFS: string[];
  PhaseOneTableaus: Tableau[];
  PhaseOneRepeatedTableauIdx: number;
  PhaseTwoTableaus: Tableau[];
  PhaseTwoRepeatedTableauIdx: number;
}

export type BigMSimplexData = SimplexData & {
  Tableaus: Tableau[];
  RepeatedTableauIdx: number;
}