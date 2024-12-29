import { useState } from 'react';
import Navbar from './components/Navbar';
import LinearProblemForm from './components/LinearProblemForm';
import { Box, Stack, Text } from '@chakra-ui/react';
import { TableauDisplay } from './components/TableauDisplay';
import { OptimalityConclusion } from './components/OptimalityConclusion';
import { FeasibilityConclusion } from './components/FeasibilityConclusion';

export const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const [objectCoefficients, setObjectCoefficients] = useState<string[]>([]);
  const [initialVariables, setVariables] = useState<string[]>([]);
  const [simplexData, setSimplexData] = useState<any>(null);
  const [navbarHeight, setNavbarHeight] = useState<number>(0);

  return (
    <div>
      <Navbar setNavbarHeight={setNavbarHeight} />
      <Stack paddingBottom={40} mx="auto" px={10} width={"60vw"} pt={`${navbarHeight}px`}>
        <LinearProblemForm
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
                initialVariables={initialVariables}
                objectiveCoefficients={objectCoefficients}
                numSlack={simplexData.NumSlack}
                tableaus={simplexData.PhaseOneTableaus}
              />
              </>
            }

            <FeasibilityConclusion
              isFeasible={simplexData.PhaseTwoTableaus !== null}
              initialAndSlackVariables={[
                ...initialVariables,
                ...Array.from({ length: simplexData.NumSlack }, (_, i) => `s${i + 1}`)
              ]}
              numArtificial={simplexData.NumArtificial}
              phaseOneBFS={simplexData.FirstBFS}
            />

            <Box mb={4} />

            {simplexData.PhaseTwoTableaus && 
              <>
                <Text fontSize="xl" fontWeight="bold">Phase Two</Text>
                <TableauDisplay
                  initialVariables={initialVariables}
                  objectiveCoefficients={objectCoefficients}
                  numSlack={simplexData.NumSlack}
                  tableaus={simplexData.PhaseTwoTableaus}
                />

              <OptimalityConclusion
                optimalSolution={simplexData.OptimalSolution}
                degeneracy={simplexData.Degeneracy}
                optimalCost={simplexData.OptimalCost}
                variables={initialVariables}
                lastTableauReducedCosts={simplexData.PhaseTwoTableaus[simplexData.PhaseTwoTableaus.length - 1].ReducedCost.slice(0, initialVariables.length)}
              />
              </>
            }
            </>
        }
      </Stack>
    </div>
  );
}

export default App;