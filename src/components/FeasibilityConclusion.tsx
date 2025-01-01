import Latex from "react-latex-next"
import { formatFraction, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type FeasibilityConclusionProps = {
  isFeasible: boolean
  numArtificial: number
  initialAndSlackVariables: string[]
  phaseOneBFS: string[] | null
}

export const FeasibilityConclusion = ({ isFeasible, numArtificial, initialAndSlackVariables, phaseOneBFS }: FeasibilityConclusionProps) => {
  const artificialVariables = Array.from({ length: numArtificial }, (_, i) => `y_${i + 1}`).join(" + ");
  const filteredSolution = phaseOneBFS?.slice(0, initialAndSlackVariables.length).map(formatFraction).join(", ");
  const nonZeroArtificialsIdx = phaseOneBFS?.slice(-numArtificial).map((v, i) => v !== "0" ? i : -1).filter(i => i !== -1) ?? [];

  return (
    <Box fontSize={"lg"}>
      {isFeasible
      ? <>
          <Latex>
            {artificialVariables.length > 0
              ? `At the optimum, $${artificialVariables} = 0$.`
              : `There are no artificial variables.`
            }
          </Latex>
          <p></p>
          <Latex>{`So the original problem has a BFS $(${initialAndSlackVariables.map(formatVariable).join(", ")}) = (${filteredSolution})$.`}</Latex>
        </>
      : <Latex>
          {`Artificial variable${nonZeroArtificialsIdx.length > 1 ? 's' : ''} 
          $${nonZeroArtificialsIdx.map(i => `y_${i + 1}`).join(", ")}$
          ${nonZeroArtificialsIdx.length > 1 ? 'are' : 'is'} non-zero in the final BFS.
          So the original problem is infeasible.`}
        </Latex>
      }
    </Box>
  );
}
