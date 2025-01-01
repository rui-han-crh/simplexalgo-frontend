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
  PhaseTwoTableaus: Tableau[];
}

export type BigMSimplexData = SimplexData & {
  Tableaus: Tableau[];
}