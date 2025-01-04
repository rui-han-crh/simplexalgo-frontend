import Latex from "react-latex-next"
import { formatFraction, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type OptimalityConclusionProps = {
  initialVariables: string[]
  numSlack: number
  optimalSolution: string[]
  degenerateVariablesIdx: number[] | null
  optimalCost: string | null
  lastTableauReducedCosts: string[]
}

export const OptimalityConclusion = ({ initialVariables, numSlack, optimalSolution, degenerateVariablesIdx, optimalCost, lastTableauReducedCosts }: OptimalityConclusionProps) => {
  const initialVariablesTuple = initialVariables.map(formatVariable).join(", ")
  const formattedOptimalSolution = optimalSolution?.map(formatFraction).join(", ")
  const degenerateVariables = degenerateVariablesIdx?.map(i => formatVariable(initialVariables[i])).join(", ")
  const lastInitialAndSlackReducedCosts = lastTableauReducedCosts.slice(0, initialVariables.length + numSlack)
  const negativeReducedCostsVariables = lastInitialAndSlackReducedCosts.map((v, i) => v[0] === "-" ? formatVariable(initialVariables[i]) : "").filter(v => v !== "")

  return (
    <Box fontSize={"lg"}>
      <Latex>
      {
        optimalCost !== null
        ? `Thus, the optimal solution is $(${initialVariablesTuple}) = (${formattedOptimalSolution})$, 
          with cost $${formatFraction(optimalCost)}$.` 
        : negativeReducedCostsVariables.length === 0
          ? "The problem is infeasible."
          : `The solution is unbounded as $${negativeReducedCostsVariables.join(", ")}$ may be increased indefinitely.`
      }
      </Latex>
      <p></p>
      <Latex>
        {
          degenerateVariablesIdx && degenerateVariablesIdx.length > 0
          ? `The solution is degenerate as basic variable${degenerateVariablesIdx.length > 1 ? 's' : ''} 
            $${degenerateVariables}$ ${degenerateVariablesIdx.length > 1 ? 'are' : 'is'} 0. So the basis is not unique, 
            as any nonbasic variable may replace a basic degenerate variable.`
          : ""
        }
      </Latex>
    </Box>
  )
}
