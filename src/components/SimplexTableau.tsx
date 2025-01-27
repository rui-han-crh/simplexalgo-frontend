import { Table, For, Flex } from "@chakra-ui/react"
import { Tooltip } from "@/components/ui/tooltip"
import { useColorModeValue } from "@/components/ui/color-mode";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { useEffect, useRef, useState } from "react";
import { formatFraction, formatVariable } from "@/util/format";
import { TbArrowsCross } from "react-icons/tb";

export type SimplexTableauProps = {
  variables: string[]
  basisIdx: number[]
  cost: string[]
  mCost: string[]
  reducedCost: string[]
  mReducedCost: string[]
  matrix: string[][]
  pivotRow: number
  pivotColumn: number
  ratios: (string | null)[]
  hideBasicZeros?: boolean
  isOverflown?: boolean
}

function formatWithBigM(numFrac: string, m: string | undefined) {
  if (m === undefined) {
    return formatFraction(numFrac)
  }

  const numFracStr = formatFraction(numFrac)
  if (m === "0") {
    return numFracStr
  }

  const mFracStr = formatFraction(m)

  if (mFracStr === "1") {
    return `${numFracStr === "0" ? "" : `${numFracStr}+`}M`
  } else if (mFracStr === "-1") {
    return `${numFracStr === "0" ? "" : numFracStr}-M`
  } else if (mFracStr[0] === "-") {
    return `${numFracStr === "0" ? "" : numFracStr}${mFracStr}M`
  } else {
    return `${numFracStr === "0" ? "" : `${numFracStr}+`}${mFracStr}M`
  }
}

function isCostNegative(cost: string, mCost: string | undefined) {
  if (mCost === undefined || mCost === "0") {
    return cost[0] === "-"
  }

  return mCost[0] === "-"
}

export default function SimplexTableau({ variables, basisIdx, cost, mCost, reducedCost, mReducedCost, matrix, pivotRow, pivotColumn, ratios, hideBasicZeros, isOverflown }: SimplexTableauProps) {
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
    <Flex direction="column" paddingLeft={isOverflown ? 0 : lastColumnWidth}>
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
                  { i < cost.length && <Latex>${formatWithBigM(cost[i], mCost?.[i])}$</Latex>}
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
                  <Table.Cell borderColor={borderColor} whiteSpace={"nowrap"} key={i} bg={i < variables.length && isCostNegative(c, mReducedCost?.[i]) ? unboundedHighlightColor : undefined}>
                    <Latex>
                      {`$${formatWithBigM(c, mReducedCost?.[i])}$`}
                    </Latex>
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
                    <Table.Cell 
                      {...borderProps}
                      style={{ whiteSpace: 'nowrap'}}
                      key={j}
                      bg={pivotRow === i && pivotColumn === j ? pivotHighlightColor : undefined}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
                        <Latex>
                          {hideBasicZeros && basisIdx.includes(j) && cell === "0" ? "" : `$${formatFraction(cell)}$`}
                        </Latex>
                        { j === variables.length && cell === "0" &&
                          <Tooltip
                            contentProps={{ textWrap: 'wrap' }}
                            content="This variable is degenerate. It can be replaced by any nonbasic variable without changing the optimal cost." 
                            openDelay={500}
                          >
                            <TbArrowsCross style={{ marginLeft: '1em' }} color="orange" />
                          </Tooltip>
                        }
                      </span>
                    </Table.Cell>
                  )}
                </For>
                <Table.Cell borderColor="transparent" bg={pivotRow === i ? pivotHighlightColor : undefined}>
                  <Latex>
                    {
                      allRatiosNull || ratios[i] === null 
                        ? ""
                        : `$${formatFraction(ratios[i])}${pivotRow === i ? `\\quad (${formatVariable(variables[pivotColumn])} \\text{ entering})` : ""}$`
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