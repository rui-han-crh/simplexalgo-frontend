export default interface SimplexData {
  OptimalSolution: string[];
  OptimalCost: string;
  Degeneracy: number[];
  FirstBFS: string[];
  NumSlack: number;
  NumArtificial: number;
  PhaseOneTableaus: Tableau[];
  PhaseTwoTableaus: Tableau[];
}

interface Tableau {
  BasicVariablesIdx: number[];
  Matrix: string[][];
  PivotRow: number;
  PivotColumn: number;
  Ratios: string[];
  ReducedCost: string[];
}