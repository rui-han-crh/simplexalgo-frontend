import { useState } from 'react';
import LinearProblemForm from '@/components/LinearProblemForm';
import { Box, Text } from '@chakra-ui/react';
import { TableauDisplay } from '@/components/TableauDisplay';
import { BigMSimplexData } from '@/interfaces/SimplexData';
import { Conclusion } from '@/components/Conclusion';

export const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function BigMPage() {
  const [objectCoefficients, setObjectCoefficients] = useState<string[]>([]);
  const [initialVariables, setVariables] = useState<string[]>([]);
  const [simplexData, setSimplexData] = useState<BigMSimplexData>();

  return (
    <>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Big-M Method
      </Text>

      <LinearProblemForm
        postUrlEndpoint='/bigm'
        setVariables={setVariables}
        setObjectCoefficients={setObjectCoefficients}
        setSimplexData={setSimplexData}
      />
      <Box mb={2} />
      {simplexData && simplexData.NonOptimalTableaus &&
        <>
          <TableauDisplay
            key={JSON.stringify(simplexData.NonOptimalTableaus)}
            initialVariables={initialVariables}
            objectiveCoefficients={objectCoefficients}
            numSlack={simplexData.NumSlack}
            numArtificial={simplexData.NumArtificial}
            nonOptimalTableaus={simplexData.NonOptimalTableaus}
            optimalTableaus={simplexData.OptimalTableaus}
            adjacencyLists={simplexData.OptimaAdjacencyLists}
            isBigM={true}
          />

          <Conclusion
            isFeasible={simplexData.IsFeasible}
            initialVariables={initialVariables}
            numSlack={simplexData.NumSlack}
            numArtificial={simplexData.NumArtificial}
            basicSolution={simplexData.BasicSolution}
            optimalSolutions={removeDuplicateSolutions(simplexData.OptimalSolutions)}
            optimalCost={simplexData.OptimalCost}
            degenerateVariablesIdx={simplexData.DegenerateVariablesIdx}
            finalReducedCosts={simplexData.OptimalTableaus[0].ReducedCosts!!}
            repeatedTableauIdx={simplexData.RepeatedTableauIdx}
          />
        </>
      }
    </>
  );
}

function removeDuplicateSolutions(optimalSolutions: {[key: number]: string}[]) {
  const seen = new Set();
  return optimalSolutions.filter(sol => {
    const key = JSON.stringify(Object.entries(sol).filter(([_, val]) => val !== "0"));
    return seen.has(key) ? false : seen.add(key);
  });
}
