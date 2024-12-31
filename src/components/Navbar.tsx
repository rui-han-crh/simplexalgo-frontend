import { Box, Flex, Button, Text, Container } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useColorMode, useColorModeValue } from "./ui/color-mode";
import { useEffect, useRef } from "react";

type NavbarProps = {
	setNavbarHeight: (height: number) => void;
};

export default function Navbar({ setNavbarHeight } : NavbarProps) {
	const { colorMode, toggleColorMode } = useColorMode();
	const shadowColor = useColorModeValue("rgba(80, 80, 80, 0.3)", "rgba(160, 160, 160, 0.15)");
	const navBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (navBarRef.current) {
			setNavbarHeight(navBarRef.current.offsetHeight);
			console.log(navBarRef.current.offsetHeight);
		}
	}, [navBarRef.current]);
	
	return (
		<Container width={"100%"} maxW={"100%"} p={0} position={"fixed"} zIndex={1} as={"header"} ref={navBarRef}>
			<Box 
				bg={useColorModeValue("gray.400", "gray.700")} 
				borderRadius={"5"} 
				boxShadow={`0 8px 6px ${shadowColor}`}
				px={4}
			>
				<Flex py={4} alignItems={"center"} justifyContent={"space-between"}>
					<Flex>
						<Text fontSize={"2xl"} fontWeight={500}>
							SimplexAlgo
						</Text>
					</Flex>

					<Flex alignItems={"center"} gap={3}>
						<Text fontSize={"lg"} fontWeight={500}>
							Change Theme
						</Text>
						{/* Toggle Color Mode */}
						<Button onClick={toggleColorMode}>
							{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
						</Button>
					</Flex>
				</Flex>
			</Box>
		</Container>
	);
}