import { Box, Stack } from "@chakra-ui/react"
import { FeasibilityConclusion } from "./FeasibilityConclusion";
import { OptimalityConclusion } from "./OptimalityConclusion";
import Latex from "react-latex-next";

export type ConclusionProps = {
  showFeasibility?: boolean;
  showOptimality?: boolean;
  initialVariables: string[];
  numSlack: number
  numArtificial: number;
  isFeasible?: boolean;
  basicSolution?: string[] | null;
  optimalSolution?: string[];
  optimalCost?: string | null;
  degenerateVariablesIdx?: number[] | null;
  lastTableauReducedCosts?: string[];
  repeatedTableauIdx?: number;
}

export const Conclusion = ({
  showFeasibility = true,
  showOptimality = true,
  initialVariables,
  numSlack,
  numArtificial,
  isFeasible = true,
  basicSolution = null,
  optimalSolution = [],
  optimalCost = null,
  degenerateVariablesIdx = null,
  lastTableauReducedCosts = [],
  repeatedTableauIdx = -1
}: ConclusionProps) => {
  if (repeatedTableauIdx !== -1) {
    return (
      <Box fontSize="lg">
        <Latex>
          {`Indefinite cycling was detected as Tableau ${repeatedTableauIdx + 1} was repeated.`}
        </Latex>
      </Box>
    )
  }

  return (
    <Stack gap={4}>
      { showFeasibility && 
        FeasibilityConclusion({
          isFeasible: isFeasible,
          initialVariables: initialVariables,
          numSlack: numSlack,
          numArtificial: numArtificial,
          basicSolution: basicSolution,
        })
      }
      { showOptimality && isFeasible &&
        OptimalityConclusion({
          initialVariables: initialVariables,
          numSlack: numSlack,
          optimalSolution: optimalSolution,
          degenerateVariablesIdx: degenerateVariablesIdx,
          optimalCost: optimalCost,
          lastTableauReducedCosts: lastTableauReducedCosts,
        })
      }
    </Stack>
  )
}