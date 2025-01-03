import { Box, Flex, Stack } from "@chakra-ui/react";
import SimplexTableau from "@/components/SimplexTableau";
import { TableauNavButton } from "@/components/TableauNavButton";
import { useRef, useEffect, useState } from "react";
import { useColorModeValue } from "@/components//ui/color-mode";
import { PaginationRoot, PaginationItems } from '@/components/ui/pagination';
import { Tableau } from "@/interfaces/Tableau";

type TableauDisplayProps = {
  initialVariables: string[]
  objectiveCoefficients: string[]
  numSlack: number
  numArtificial: number
  tableaus: Tableau[],
  isPhaseOne?: boolean
  isBigM?: boolean
};

function generateVariables(variables: string[], numSlack: number, numArtificial: number): string[] {
  const slackVariables = Array.from({ length: numSlack }, (_, i) => `s${i + 1}`);
  const artificialVariables = Array.from({ length: numArtificial }, (_, i) => `y${i + 1}`);
  return [...variables, ...slackVariables, ...artificialVariables];
}

export const TableauDisplay = (props: TableauDisplayProps) => {
  const [height, setHeight] = useState<number>(0);
  const [isOverflown, setIsOverflown] = useState<boolean>(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const flexRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flexRef.current) {
      setHeight(flexRef.current.offsetHeight);
    }
  }, [flexRef.current]);

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
  const tableau = props.tableaus[Math.max(0, Math.min(tableauIdx, props.tableaus.length - 1))];
  const numColumns = tableau.ReducedCosts.length;
  const shadowColor = useColorModeValue("rgba(28, 28, 28, 0.2)", "rgba(200, 200, 200, 0.2)");

  return (
    <Flex
      align="center"
      justify="space-between"
      bg="bg.muted"
      rounded={10}
      boxShadow={`1px 1px 6px ${shadowColor}`}
      ref={flexRef}
      maxWidth={"100%"}
    >
      <TableauNavButton
        direction="left"
        onClick={() => { if (tableauIdx > 0) setTableauIdx(tableauIdx - 1); }}
        height={height}
        disabled={tableauIdx === 0}
      />

      <Stack maxWidth={`calc(100% - ${120}px)`}>
        <Box ref={boxRef} overflowX="scroll" justifyContent={"center"} maxWidth={"100%"}>
          <SimplexTableau
            key={tableauIdx}
            variables={generateVariables(props.initialVariables, props.numSlack, props.numArtificial)}
            basisIdx={tableau.BasicVariablesIdx}
            cost={props.isPhaseOne 
              ? Array(numColumns - 1).fill("0")
              : [
                ...props.objectiveCoefficients,
                ...Array.from({ length: numColumns - 1 - props.initialVariables.length }, () => "0")
              ]
            }
            mCost={props.isBigM ? Array.from({ length: numColumns - 1 }, (_, i) => i >= props.initialVariables.length + props.numSlack ? "1" : "0") : []}
            reducedCost= {tableau.ReducedCosts}
            mReducedCost={tableau.MReducedCosts ?? []}
            matrix={tableau.Matrix}
            pivotRow={tableau.PivotRow}
            pivotColumn={tableau.PivotColumn}
            ratios={tableau.Ratios}
            hideBasicZeros={true}
            isOverflown={isOverflown}
          />
        </Box>
        <Flex boxOrient={"horizontal"} justifyContent={"center"} alignItems={"center"} my={2}>
          <PaginationRoot
            count={props.tableaus.length}
            pageSize={1}
            page={tableauIdx + 1}
            defaultPage={1}
            onPageChange={(page) => setTableauIdx(page.page - 1)}
          >
            <PaginationItems/>
          </PaginationRoot>
        </Flex>
      </Stack>

      <TableauNavButton
        direction="right"
        onClick={() => { if (tableauIdx < props.tableaus.length - 1) setTableauIdx(tableauIdx + 1); }}
        height={height}
        disabled={tableauIdx === props.tableaus.length - 1}
      />
    </Flex>
  );
};

export default TableauDisplay;