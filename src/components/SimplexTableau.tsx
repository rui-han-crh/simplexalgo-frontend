import { Table, For, Flex } from "@chakra-ui/react"
import { useColorModeValue } from "./ui/color-mode"
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useEffect, useRef, useState } from "react";
import { formatFraction, formatVariable } from "../util/format";

export type SimplexTableauProps = {
  variables: string[]
  basisIdx: number[]
  cost: string[]
  reducedCost: string[]
  matrix: string[][]
  pivotRow: number
  pivotColumn: number
  ratios: string[]
  hideBasicZeros?: boolean
  isOverflown?: boolean
}

export default function SimplexTableau({ variables, basisIdx, cost, reducedCost, matrix, pivotRow, pivotColumn, ratios, hideBasicZeros, isOverflown }: SimplexTableauProps) {
  const borderColor = useColorModeValue("black", "gray.700")

  const borderProps = {
    border: "1px solid",
    borderColor: borderColor,
  }

  const pivotHighlightColor = useColorModeValue("green.200", "green.800")
  const unboundedHighlightColor = useColorModeValue("red.300", "red.700")

  const lastColumnRef = useRef<HTMLTableCellElement>(null)
  const [lastColumnWidth, setLastColumnWidth] = useState(0)

  useEffect(() => {
    if (lastColumnRef.current) {
      setLastColumnWidth(lastColumnRef.current.offsetWidth)
    }
  }, [lastColumnRef.current])

  const allRatiosNull = ratios.every(r => r === null)

  return (
    <Flex direction="column" paddingLeft={isOverflown ? 0 : lastColumnWidth} paddingY={10}>
      <Table.Root size="sm" showColumnBorder>
        <Table.Header>
          <Table.Row bg="transparent">
            <Table.ColumnHeader fontWeight="bold" {...borderProps}>
              <Latex>
                {'$\\text{Basis}$'}
              </Latex>
            </Table.ColumnHeader>

            {variables.map((v, i) => (
              <Table.ColumnHeader key={v} {...borderProps} fontWeight="bold" bg={pivotColumn === i ? pivotHighlightColor : undefined}>
                <Latex>
                  ${formatVariable(v)}$
                </Latex>
              </Table.ColumnHeader>
            ))}

            <Table.ColumnHeader  {...borderProps} fontWeight="bold">
              <Latex>
                {'$\\text{Solution}$'}
              </Latex>
            </Table.ColumnHeader>

            <Table.ColumnHeader borderColor="transparent"/>

          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row bg="transparent">
              <Table.Cell {...borderProps} fontWeight="bold">
                <Latex>
                  $c$
                </Latex>
              </Table.Cell>

              {Array.from({ length: variables.length + 1}).map((_, i) => (
                <Table.Cell key={i} borderColor={borderColor}>
                  { i < cost.length && <Latex>${formatFraction(cost[i])}$</Latex>}
                </Table.Cell>
              ))}
              <Table.Cell borderColor="transparent"/>
          </Table.Row>

          <Table.Row bg="transparent">
              <Table.Cell  {...borderProps} fontWeight="bold">
                <Latex>
                  {'$\\bar{c}$'}
                </Latex>
              </Table.Cell>
              <For each={reducedCost}>
                {(c, i) => (
                  <Table.Cell borderColor={borderColor} key={i} bg={i < variables.length && c[0] === "-" ? unboundedHighlightColor : undefined}>
                    <Latex>${formatFraction(c)}$</Latex>
                  </Table.Cell>
                )}
              </For>

              <Table.Cell ref={lastColumnRef} borderColor={allRatiosNull ? "transparent" : borderColor}>
                <Latex>
                  {allRatiosNull ? "" : '$\\text{Ratio Test}$'}
                </Latex>
              </Table.Cell>
          </Table.Row>

          <For each={matrix}>
            {(row, i) => (
              <Table.Row key={i} bg="transparent">
                <Table.Cell  {...borderProps} fontWeight="bold" bg = {pivotRow === i ? pivotHighlightColor : undefined}>
                  <Latex>
                    ${formatVariable(variables[basisIdx[i]])}$
                  </Latex>
                </Table.Cell>
                <For each={row}>
                  {(cell, j) => (
                    <Table.Cell key={j} borderColor={borderColor} bg={pivotRow === i && pivotColumn === j ? pivotHighlightColor : undefined}>
                      {hideBasicZeros && basisIdx.includes(j) && cell === "0" ? "" : <Latex>${formatFraction(cell)}$</Latex>}
                    </Table.Cell>
                  )}
                </For>
                <Table.Cell borderColor="transparent" bg={pivotRow === i ? pivotHighlightColor : undefined}>
                  <Latex>
                    {
                      allRatiosNull
                      ? ""
                      : ratios[i] === null 
                        ? ""
                        : pivotRow === i
                          ? `$${formatFraction(ratios[i])}\\quad (${ratios[i] === "0" ? `\\textcolor{red}{\\text{Degenerate }}` : ""} ${formatVariable(variables[pivotColumn])} \\text{ entering})$`
                          : `$${formatFraction(ratios[i])}$`
                    }
                  </Latex>
                </Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
    </Flex>
  )
}