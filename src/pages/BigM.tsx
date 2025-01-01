import { useState } from 'react';
import LinearProblemForm from '@/components/LinearProblemForm';
import { Box, Text } from '@chakra-ui/react';
import { TableauDisplay } from '@/components/TableauDisplay';
import { OptimalityConclusion } from '@/components/OptimalityConclusion';
import { FeasibilityConclusion } from '@/components/FeasibilityConclusion';
import { BigMSimplexData } from '@/interfaces/simplexData';

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
      {simplexData &&
          <>
          {simplexData.Tableaus &&
            <> 
              <Box my={2} />
              <TableauDisplay
                initialVariables={initialVariables}
                objectiveCoefficients={objectCoefficients}
                numSlack={simplexData.NumSlack}
                numArtificial={simplexData.NumArtificial}
                tableaus={simplexData.Tableaus}
                isBigM={true}
              />
            </>
          }

          <Box mb={4} />
          </>
      }
    </>
  );
}