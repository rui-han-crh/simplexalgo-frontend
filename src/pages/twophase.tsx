import { useState } from 'react';
import LinearProblemForm from '@/components/LinearProblemForm';
import { Box, Text } from '@chakra-ui/react';
import { TableauDisplay } from '@/components/TableauDisplay';
import { TwoPhaseSimplexData } from '@/interfaces/SimplexData';
import { Conclusion } from '@/components/Conclusion';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function TwoPhasePage() {
  const [objectCoefficients, setObjectCoefficients] = useState<string[]>([]);
  const [initialVariables, setVariables] = useState<string[]>([]);
  const [simplexData, setSimplexData] = useState<TwoPhaseSimplexData>();

  return (
    <>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Two-Phase Method
      </Text>

      <LinearProblemForm
        postUrlEndpoint='/twophase'
        setVariables={setVariables}
        setObjectCoefficients={setObjectCoefficients}
        setSimplexData={setSimplexData}
      />
      {simplexData &&
          <>
            {simplexData.PhaseOneTableaus &&
              <> 
                <Text fontSize="xl" fontWeight="bold">Phase One</Text>
                <TableauDisplay
                  key={JSON.stringify(simplexData)}
                  initialVariables={initialVariables}
                  objectiveCoefficients={objectCoefficients}
                  numSlack={simplexData.NumSlack}
                  numArtificial={simplexData.NumArtificial}
                  tableaus={simplexData.PhaseOneTableaus}
                  isPhaseOne={true}
                />
              </>
            }

            <Conclusion
              showFeasibility={true}
              showOptimality={false}
              isFeasible={simplexData.PhaseTwoTableaus !== null}
              initialVariables={initialVariables}
              numSlack={simplexData.NumSlack}
              numArtificial={simplexData.NumArtificial}
              basicSolution={simplexData.BasicSolution}
              repeatedTableauIdx={simplexData.PhaseOneRepeatedTableauIdx}
            />

            <Box mb={4} />

            {simplexData.PhaseTwoTableaus && 
              <>
                <Text fontSize="xl" fontWeight="bold">Phase Two</Text>
                <TableauDisplay
                  key={JSON.stringify(simplexData)}
                  initialVariables={initialVariables}
                  objectiveCoefficients={objectCoefficients}
                  numSlack={simplexData.NumSlack}
                  numArtificial={0}
                  tableaus={simplexData.PhaseTwoTableaus}
                />

                <Conclusion
                  showFeasibility={false}
                  showOptimality={true}
                  initialVariables={initialVariables}
                  numSlack={simplexData.NumSlack}
                  numArtificial={0}
                  optimalSolutions={simplexData.OptimalSolutions}
                  optimalCost={simplexData.OptimalCost}
                  degenerateVariablesIdx={simplexData.DegenerateVariablesIdx}
                  lastTableauReducedCosts={simplexData.PhaseTwoTableaus[simplexData.PhaseTwoTableaus.length - 1]?.ReducedCosts?.slice(0, initialVariables.length)}
                  repeatedTableauIdx={simplexData.PhaseTwoRepeatedTableauIdx}
                />
              </>
            }
          </>
      }
    </>
  );
}