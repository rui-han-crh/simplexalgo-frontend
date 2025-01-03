import { Link, Text } from "@chakra-ui/react";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function TwoPhasePage() {

  return (
    <>
      <Text fontSize={"2xl"} fontWeight={"bold"}>
        Home.
      </Text>

      <Text fontSize={"xl"} fontWeight={"bold"}>
        Website under construction, but the tableau calculators in the navigation menu work.
        <br />
        Source code hosted at{' '}
          <Link href="https://github.com/rui-han-crh/simplexalgo-frontend" target="_blank" rel="noopener noreferrer">
            https://github.com/rui-han-crh/simplexalgo-frontend
          </Link>
        .
    </Text>
    </>
  );
}