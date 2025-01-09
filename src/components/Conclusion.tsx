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
  optimalSolutions?: { [key: number]: string }[];
  optimalCost?: string | null;
  degenerateVariablesIdx?: number[];
  finalReducedCosts?: string[];
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
  optimalSolutions = [],
  optimalCost = null,
  degenerateVariablesIdx = [],
  finalReducedCosts = [],
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
    <Stack gap={4} key={JSON.stringify({ isFeasible, optimalSolutions })}>
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
          optimalSolutions: optimalSolutions,
          degenerateVariablesIdx: degenerateVariablesIdx,
          optimalCost: optimalCost,
          lastTableauReducedCosts: finalReducedCosts,
        })
      }
    </Stack>
  )
}