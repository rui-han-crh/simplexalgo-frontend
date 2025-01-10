import Latex from "react-latex-next"
import { formatFraction, formatVariable } from "@/util/format"
import { Box } from "@chakra-ui/react"

type OptimalityConclusionProps = {
  initialVariables: string[]
  numSlack: number
  optimalSolutions: { [key: number]: string }[]
  degenerateVariablesIdx: number[]
  optimalCost: string | null
  lastTableauReducedCosts: string[]
}

export const OptimalityConclusion = ({ initialVariables, numSlack, optimalSolutions, degenerateVariablesIdx, optimalCost, lastTableauReducedCosts }: OptimalityConclusionProps) => {
  return (
    <Box fontSize={"lg"}>
      { makeOptimalityLatex(initialVariables, optimalSolutions, optimalCost, lastTableauReducedCosts, numSlack) }
      <br />
      { degenerateVariablesIdx.length > 0 && makeDegeneracyLatex(degenerateVariablesIdx, initialVariables) }
    </Box>
  )
}

function formatSolutionVector(solution: { [key: number]: string }, length: number): string {
  return `\\begin{pmatrix}${Array.from({ length }, (_, i) => formatFraction(solution[i] || "0")).join("\\\\")}\\end{pmatrix}`;
}

function makeOptimalityLatex(initialVariables: string[], optimalSolutions: { [key: number]: string}[], optimalCost: string | null, finalReducedCosts: string[], numSlack: number) {
  if (optimalCost !== null) {
    const initialVariablesVector = `$\\begin{pmatrix}${initialVariables.map(formatVariable).join("\\\\")}\\end{pmatrix}$`

    const optimalSolutionsVector = 
      optimalSolutions.length > 1 
      ? `$\\text{conv}\\bigg\\{${optimalSolutions.map(m => formatSolutionVector(m, initialVariables.length)).join(", ")}\\bigg\\}$`
      : `$${formatSolutionVector(optimalSolutions[0], initialVariables.length)}$`

    return (
      <Latex>
        {`Thus, the optimal solution is ${initialVariablesVector} = ${optimalSolutionsVector}, with cost ${formatFraction(optimalCost)}.`}
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

function makeDegeneracyLatex(degenerateVariablesIdx: number[], initialVariables: string[]) {
  const degenerateVariables = degenerateVariablesIdx.map(i => formatVariable(initialVariables[i])).join(", ")

  return (
    <Latex>
      {`The solution is degenerate as basic variable${degenerateVariablesIdx.length > 1 ? 's' : ''} 
      $${degenerateVariables}$ ${degenerateVariablesIdx.length > 1 ? 'are' : 'is'} 0. So the basis is not unique, 
      as any nonbasic variable may replace a basic degenerate variable.`}
    </Latex>
  )
}