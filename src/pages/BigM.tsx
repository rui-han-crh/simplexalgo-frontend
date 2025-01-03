import { useState } from 'react';
import LinearProblemForm from '@/components/LinearProblemForm';
import { Box, Text } from '@chakra-ui/react';
import { TableauDisplay } from '@/components/TableauDisplay';
import { BigMSimplexData } from '@/interfaces/SimplexData';

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
      {simplexData &&
          <>
          {simplexData.Tableaus &&
            <TableauDisplay
              key={JSON.stringify(simplexData)}
              initialVariables={initialVariables}
              objectiveCoefficients={objectCoefficients}
              numSlack={simplexData.NumSlack}
              numArtificial={simplexData.NumArtificial}
              tableaus={simplexData.Tableaus}
              isBigM={true}
            />
          }
        </>
      }
    </>
  );
}