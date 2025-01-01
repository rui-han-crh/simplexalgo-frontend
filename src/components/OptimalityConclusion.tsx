import Latex from "react-latex-next"
import { formatFraction, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type OptimalityConclusionProps = {
  optimalSolution: string[]
  degeneracy: number[] | null
  optimalCost: string | null
  variables: string[]
  lastTableauReducedCosts: string[]
}

export const OptimalityConclusion = ({ optimalSolution, degeneracy, optimalCost, variables, lastTableauReducedCosts }: OptimalityConclusionProps) => {
  const initialVariables = variables.map(formatVariable).join(", ")
  const formattedOptimalSolution = optimalSolution?.map(formatFraction).join(", ")
  const degenerateVariables = degeneracy?.map(i => formatVariable(variables[i])).join(", ")
  const negativeReducedCostsVariables = lastTableauReducedCosts.map((v, i) => v[0] === "-" ? formatVariable(variables[i]) : "").filter(v => v !== "")

  return (
    <Box fontSize={"larger"}>
      <Latex>
      {
        optimalCost !== null
        ? `Thus, the optimal solution is $(${initialVariables}) = (${formattedOptimalSolution})$, 
           with cost $${formatFraction(optimalCost)}$.` 
        : negativeReducedCostsVariables.length === 0
          ? "The problem is infeasible."
          : `The solution is unbounded as $${negativeReducedCostsVariables.join(", ")}$ may be increased indefinitely.`
      }
      </Latex>
      <p></p>
      <Latex>
        {
          degeneracy && degeneracy.length > 0
          ? `The solution is degenerate as basic variable${degeneracy.length > 1 ? 's' : ''} 
             $${degenerateVariables}$ ${degeneracy.length > 1 ? 'are' : 'is'} 0. So the basis is not unique, 
             as any nonbasic variable may replace a basic degenerate variable.`
          : ""
        }
      </Latex>
    </Box>
  )
}
