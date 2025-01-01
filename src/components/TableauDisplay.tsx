import { Flex, Stack } from "@chakra-ui/react";
import SimplexTableau from "@/components/SimplexTableau";
import { TableauNavButton } from "@/components/TableauNavButton";
import { useRef, useEffect, useState } from "react";
import { useColorModeValue } from "@/components//ui/color-mode";
import { PaginationRoot, PaginationItems } from '@/components/ui/pagination';

type TableauDisplayProps = {
  initialVariables: string[]
  objectiveCoefficients: string[]
  numSlack: number
  tableaus: any[]
};

function generateVariables(variables: string[], numSlack: number, numArtificial: number): string[] {
  const slackVariables = Array.from({ length: numSlack }, (_, i) => `s${i + 1}`);
  const artificialVariables = Array.from({ length: numArtificial }, (_, i) => `y${i + 1}`);
  return [...variables, ...slackVariables, ...artificialVariables];
}

export const TableauDisplay = ({ initialVariables: variables, objectiveCoefficients, numSlack, tableaus }: TableauDisplayProps) => {
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
  const tableau = tableaus[tableauIdx];
  const numColumns = tableau.ReducedCost.length;
  const shadowColor = useColorModeValue("rgba(28, 28, 28, 0.2)", "rgba(200, 200, 200, 0.2)");  

  return (
    <Flex 
      align="center"
      justify="space-between"
      bg="bg.muted"
      rounded={10}
      boxShadow={`1px 1px 6px ${shadowColor}`}
      ref={flexRef}
    >
      <TableauNavButton
        direction="left"
        onClick={() => { if (tableauIdx > 0) setTableauIdx(tableauIdx - 1); }}
        height={height}
        disabled={tableauIdx === 0}
      />

      <Stack overflowX="auto" flexDirection={"column"} justifyContent={"left"} ref={boxRef}>
        <SimplexTableau
          key={tableauIdx}
          variables={generateVariables(variables, numSlack, numColumns - 1 - variables.length - numSlack)}
          basisIdx={tableau.BasicVariablesIdx}
          cost={[
            ...objectiveCoefficients,
            ...Array.from({ length: numColumns - 1 - variables.length }, () => "0")
          ]}
          reducedCost={tableau.ReducedCost}
          matrix={tableau.Matrix}
          pivotRow={tableau.PivotRow}
          pivotColumn={tableau.PivotColumn}
          ratios={tableau.Ratios}
          hideBasicZeros={true}
          isOverflown={isOverflown}
        />
        <Flex boxOrient={"horizontal"} justifyContent={"center"} alignItems={"center"} my={2}>
          <PaginationRoot
            count={tableaus.length}
            pageSize={1}
            page={tableauIdx + 1}
            onPageChange={(page) => setTableauIdx(page.page - 1)}
          >
            <PaginationItems/>
          </PaginationRoot>
        </Flex>
      </Stack>

      <TableauNavButton
        direction="right"
        onClick={() => { if (tableauIdx < tableaus.length - 1) setTableauIdx(tableauIdx + 1); }}
        height={height}
        disabled={tableauIdx === tableaus.length - 1}
      />
    </Flex>
  );
};

export default TableauDisplay;