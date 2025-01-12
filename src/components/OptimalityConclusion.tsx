import Latex from "react-latex-next"
import { formatFraction, formatSolutionVector, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type OptimalityConclusionProps = {
  initialVariables: string[]
  numSlack: number
  optimalSolutions: { [key: number]: string }[]
  optimalCost: string | null
  lastTableauReducedCosts: string[]
}

export const OptimalityConclusion = ({ initialVariables, numSlack, optimalSolutions, optimalCost, lastTableauReducedCosts }: OptimalityConclusionProps) => {
  return (
    <Box fontSize={"lg"}>
      { makeOptimalityLatex(initialVariables, optimalSolutions, optimalCost, lastTableauReducedCosts, numSlack) }
    </Box>
  )
}

function makeOptimalityLatex(initialVariables: string[], optimalSolutions: { [key: number]: string}[], optimalCost: string | null, finalReducedCosts: string[], numSlack: number) {
  if (optimalCost !== null) {
    const initialVariablesVector = `$\\begin{pmatrix}${initialVariables.map(formatVariable).join("\\\\[0.3em]")}\\end{pmatrix}$`

    const optimalSolutionsVector = 
      optimalSolutions.length > 1 
      ? `$\\text{conv}\\bigg\\{${optimalSolutions.map(m => formatSolutionVector(m, initialVariables.length)).join(", ")}\\bigg\\}$`
      : `$${formatSolutionVector(optimalSolutions[0], initialVariables.length)}$`

    return (
      <Latex>
        {`Thus, the optimal solution is ${initialVariablesVector} = ${optimalSolutionsVector}, with cost $${formatFraction(optimalCost)}$.`}
      </Latex>
    )
  } else {
    const negativeReducedCostsVariables = finalReducedCosts
      .slice(0, initialVariables.length + numSlack)
      .filter(v => v[0] === "-")
      .map((_, i) => formatVariable(initialVariables[i]))

    return (
      <Latex>
        {`The solution is unbounded as ${negativeReducedCostsVariables.join(", ")} may be increased indefinitely.`}
      </Latex>
    )
  }
}