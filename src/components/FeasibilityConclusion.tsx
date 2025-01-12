import Latex from "react-latex-next"
import { formatFraction, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type FeasibilityConclusionProps = {
  isFeasible: boolean
  initialVariables: string[]
  numSlack: number
  numArtificial: number
  basicSolution: string[] | null
}

export const FeasibilityConclusion = ({ isFeasible, initialVariables, numArtificial, numSlack, basicSolution }: FeasibilityConclusionProps) => {
  const initialAndSlackVariablesTuple = `$\\begin{pmatrix}${[
    ...initialVariables,
    ...Array.from({ length: numSlack }, (_, i) => `s${i + 1}`)
  ].map(formatVariable).join("\\\\")}\\end{pmatrix}$`;

  const numInitial = initialVariables.length;
  const bfsInitialAndSlack = `$\\begin{pmatrix}${basicSolution?.slice(0, numInitial + numSlack).map(formatFraction).join("\\\\[0.3em]")}\\end{pmatrix}$`;

  if (isFeasible) {
    const artificialVariablesSymbols = Array.from({ length: numArtificial }, (_, i) => `y_${i + 1}`);
    const artificialVariablesSummation = artificialVariablesSymbols.join(" + ");
    return (
      <Box fontSize="lg">
        <Latex>
            {artificialVariablesSummation.length > 0
              ? `At the optimum, $${artificialVariablesSummation} = 0$.`
              : `There are no artificial variables.`
            }
          </Latex>
          <br/>
          <Latex>{`So the linear problem has a BFS ${initialAndSlackVariablesTuple} = ${bfsInitialAndSlack}.`}</Latex>
      </Box>
    )
  } else {
    const nonZeroArtificialsIdx = basicSolution?.slice(-numArtificial).map((v, i) => v !== "0" ? i : -1).filter(i => i !== -1) ?? [];
    const nonZeroArtificialVariables = nonZeroArtificialsIdx.map(i => `y_${i + 1}`);

    return (
      <Box fontSize="lg">
        <Latex>
          {`The problem is infeasible as artificial variable${nonZeroArtificialVariables?.length > 1 ? 's' : ''} $${nonZeroArtificialVariables.join(", ")}$
          ${nonZeroArtificialVariables.length > 1 ? 'are' : 'is'} non-zero in the final BFS.`}
        </Latex>
      </Box>
    )
  }
}
