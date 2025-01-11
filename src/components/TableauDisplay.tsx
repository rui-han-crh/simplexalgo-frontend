import { Box, Button, createListCollection, Flex, Stack } from "@chakra-ui/react";
import SimplexTableau from "@/components/SimplexTableau";
import { TableauNavButton } from "@/components/TableauNavButton";
import { useRef, useEffect, useState } from "react";
import { useColorModeValue } from "@/components//ui/color-mode";
import { PaginationRoot, PaginationItems } from '@/components/ui/pagination';
import { Tableau } from "@/interfaces/Tableau";
import { MdOutlineNextPlan } from "react-icons/md";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui/menu";
import { create, all } from 'mathjs';
import { Badge } from "@chakra-ui/react";
import { HiOutlineBackspace } from "react-icons/hi2";
import { Tooltip } from "./ui/tooltip";

// configure the default type of numbers as Fractions
const config = {
  // Default type of number
  // Available options: 'number' (default), 'BigNumber', or 'Fraction'
  number: 'Fraction' as 'Fraction'
}

// create a mathjs instance with everything included
const math = create(all, config);

type Swap = {
  enteringVariable: string
  leavingVariable: string
  solutionIdx: number
}

type TableauWithSolutionIdx = {
  tableau: Tableau
  solutionIdx: number
}

type TableauDisplayProps = {
  initialVariables: string[]
  objectiveCoefficients: string[]
  numSlack: number
  numArtificial: number
  nonOptimalTableaus: Tableau[],
  optimalTableaus: Tableau[],
  adjacencyLists: number[][],
  isPhaseOne?: boolean
  isBigM?: boolean
};

function generateVariables(variables: string[], numSlack: number, numArtificial: number): string[] {
  const slackVariables = Array.from({ length: numSlack }, (_, i) => `s${i + 1}`);
  const artificialVariables = Array.from({ length: numArtificial }, (_, i) => `y${i + 1}`);
  return [...variables, ...slackVariables, ...artificialVariables];
}

function indexToVar(index : number, numInitialVariables: number): string {
  return index < numInitialVariables ? `x${index + 1}` : `s${index - numInitialVariables + 1}`;
}

function findBasisDifference(currentTableau: Tableau, alternativeOptimaTableaus: TableauWithSolutionIdx[] | null, numInitialVariables: number): Swap[] {
  if (alternativeOptimaTableaus === null) {
    return [];
  }

  const currentBasisIndices = currentTableau.BasicVariablesIdx;

  const setCurrent = new Set(currentBasisIndices);
  const result : Swap[] = [];

  for (const alternative of alternativeOptimaTableaus) {
    const basisIndices = alternative.tableau.BasicVariablesIdx;
    const setOther = new Set(basisIndices);
    const diffCurrent = currentBasisIndices.filter(x => !setOther.has(x));
    const diffOther = basisIndices.filter(x => !setCurrent.has(x));

    const diff = [...diffCurrent, ...diffOther];

    if (diff.length === 2) {
      result.push({
        enteringVariable: indexToVar(diff[1], numInitialVariables),
        leavingVariable: indexToVar(diff[0], numInitialVariables),
        solutionIdx: alternative.solutionIdx
      });
    }
  }

  return result;
}

function findRearrangement (prevBasisIndices: number[], currentBasisIndices: number[]): number[] {
  const rearrangement = new Array(currentBasisIndices.length).fill(-1);

  let outstandingIdx = -1;
  const notTaken = new Set(Array.from({ length: prevBasisIndices.length }, (_, i) => i));
  
  for (let i = 0; i < currentBasisIndices.length; i++) {
    const idx = prevBasisIndices.indexOf(currentBasisIndices[i]);
    if (idx !== -1) {
      rearrangement[i] = idx;
      notTaken.delete(idx);
    } else {
      outstandingIdx = i;
    }
  }

  rearrangement[outstandingIdx] = notTaken.values().next().value;
  return rearrangement;
}

export const TableauDisplay = (props: TableauDisplayProps) => {
  const [height, setHeight] = useState<number>(0);
  const [isOverflown, setIsOverflown] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [tableauList, setTableauList] = useState<TableauWithSolutionIdx[]>(
    [
      ...props.nonOptimalTableaus.map(t => ({ tableau: t, solutionIdx: -1 })),
      { tableau: props.optimalTableaus[0], solutionIdx: 0 }
    ]
  );

  // Sets the height for the left and right nav buttons
  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.offsetHeight);
    }
  }, [contentRef.current]);

  useEffect(() => {
    const checkOverflow = () => {
      if (boxRef.current) {
        setIsOverflown(boxRef.current.scrollWidth > boxRef.current.clientWidth);
      }
    };
  
    checkOverflow(); // Initial check
  
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [boxRef.current]);

  const [tableauIdx, setTableauIdx] = useState<number>(0);
  const tableauPrev = tableauList[Math.max(0, Math.min(tableauIdx - 1, tableauList.length - 1))];
  const tableauCurrent = tableauList[Math.max(0, Math.min(tableauIdx, tableauList.length - 1))];
  const tableauNext = tableauList[Math.max(0, Math.min(tableauIdx + 1, tableauList.length - 1))];

  const rearrangement = findRearrangement(tableauPrev.tableau.BasicVariablesIdx, tableauCurrent.tableau.BasicVariablesIdx)

  tableauCurrent.tableau.Matrix = rearrangement.map(i => tableauCurrent.tableau.Matrix[i])
  tableauCurrent.tableau.BasicVariablesIdx = rearrangement.map(i => tableauCurrent.tableau.BasicVariablesIdx[i])

  const [pivotRow, pivotColumn] = findPivotRowAndColumn(tableauCurrent.tableau.BasicVariablesIdx, tableauNext.tableau.BasicVariablesIdx);

  const numColumns = tableauCurrent.tableau.Matrix[0].length;
  const shadowColor = useColorModeValue("rgba(28, 28, 28, 0.2)", "rgba(200, 200, 200, 0.2)");

  const tableauLast = tableauList[tableauList.length - 1];
  const swaps = createListCollection({
    items: findBasisDifference(
      tableauLast.tableau,
      props.adjacencyLists[tableauLast.solutionIdx].map(i => ({ tableau: props.optimalTableaus[i], solutionIdx: i })),
      props.initialVariables.length
    )
  });

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="bg.muted"
      rounded={10}
      boxShadow={`1px 1px 6px ${shadowColor}`}
      maxWidth={"100%"}
    >
      <TableauNavButton
        direction="left"
        onClick={() => { if (tableauIdx > 0) setTableauIdx(tableauIdx - 1); }}
        height={height}
        disabled={tableauIdx === 0}
      />

      <Stack maxWidth={`calc(100% - ${120}px)`} ref={contentRef} paddingY={2}>
        <Flex boxOrient={"horizontal"} justifyContent={"center"} alignItems={"center"} minHeight={6}>
          { tableauCurrent.solutionIdx !== -1 &&
            <Badge variant="solid" colorPalette="green" size="md">
              Optimal Solution {tableauCurrent.solutionIdx + 1}
            </Badge> 
          }
        </Flex>
        <Box ref={boxRef} overflowX="scroll" justifyContent={"center"} maxWidth={"100%"}>
          <SimplexTableau
            key={tableauIdx}
            variables={generateVariables(props.initialVariables, props.numSlack, props.numArtificial)}
            basisIdx={tableauCurrent.tableau.BasicVariablesIdx}
            cost={props.isPhaseOne 
              ? Array(numColumns - 1).fill("0")
              : [
                ...props.objectiveCoefficients,
                ...Array.from({ length: numColumns - 1 - props.initialVariables.length }, () => "0")
              ]
            }
            mCost={props.isBigM ? Array.from({ length: numColumns - 1 }, (_, i) => i >= props.initialVariables.length + props.numSlack ? "1" : "0") : []}
            reducedCost= {tableauCurrent.tableau.ReducedCosts ?? props.optimalTableaus[0].ReducedCosts ?? []}
            mReducedCost={tableauCurrent.tableau.MReducedCosts ?? props.optimalTableaus[0].MReducedCosts ?? []}
            matrix={tableauCurrent.tableau.Matrix}
            pivotRow={pivotRow}
            pivotColumn={pivotColumn}
            ratios={tableauCurrent.tableau.Ratios ?? (pivotColumn !== undefined ? computeRatios(tableauCurrent.tableau.Matrix, pivotColumn) : [])}
            hideBasicZeros={true}
            isOverflown={isOverflown}
          />
        </Box>
        <Flex boxOrient={"horizontal"} justifyContent={"center"} alignItems={"center"}>
          <PaginationRoot
            count={tableauList.length}
            pageSize={1}
            page={tableauIdx + 1}
            defaultPage={1}
            onPageChange={(page) => setTableauIdx(page.page - 1)}
            size={"md"}
          >
            <PaginationItems/>
          </PaginationRoot>
          {tableauIdx === tableauList.length - 1 &&
            <MenuRoot onSelect={(details) => { 
                const idx = parseInt(details.value);
                setTableauList([...tableauList, { tableau: props.optimalTableaus[idx], solutionIdx: idx }]);
              }}>
              <MenuTrigger>
                  <Button variant="subtle" size="md" margin={0} padding={0}>
                    <MdOutlineNextPlan/>
                  </Button>
              </MenuTrigger>
              <MenuContent>
                {swaps.items.map(swap => (
                  <MenuItem key={swap.solutionIdx} value={swap.solutionIdx.toString()}>
                    {`${swap.leavingVariable} leaves, ${swap.enteringVariable} enters (Solution ${swap.solutionIdx + 1})`}
                  </MenuItem>
                ))}
              </MenuContent>
            </MenuRoot>
          }
          { tableauIdx < tableauList.length - 1 && tableauCurrent.solutionIdx !== -1 &&
            <Tooltip content="Remove all subsequent solutions" openDelay={200}>
              <Button variant="subtle" size="md" margin={0} padding={0} onClick={() => 
                { setTableauList([...tableauList.slice(0, tableauIdx + 1)]) }
              }>
                <HiOutlineBackspace color="red"/>
              </Button>
            </Tooltip>
          }
        </Flex>
      </Stack>

      <TableauNavButton
        direction="right"
        onClick={() => { if (tableauIdx < props.nonOptimalTableaus.length - 1) setTableauIdx(tableauIdx + 1); }}
        height={height}
        disabled={tableauIdx === props.nonOptimalTableaus.length - 1}
      />
    </Flex>
  );
};

export default TableauDisplay;

function findPivotRowAndColumn(currentBasisIndices: number[], nextBasisIndices: number[]): [number, number] {
  const currentSet = new Set(currentBasisIndices);
  const nextSet = new Set(nextBasisIndices);

  const diffCurrent = currentBasisIndices.map((x, i) => nextSet.has(x) ? -1 : i).filter(x => x !== -1);
  const diffNext = nextBasisIndices.filter(x => !currentSet.has(x));

  return [diffCurrent[0], diffNext[0]];
}

function computeRatios(matrix: string[][], pivotColumn: number): (string | null)[] {
  return matrix.map(row => {
    const num = math.fraction(row[row.length - 1]);
    const den = math.fraction(row[pivotColumn]);

    if (den.compare(0) <= 0) {
      return null;
    }

    return num.div(den).toString();
  });
}