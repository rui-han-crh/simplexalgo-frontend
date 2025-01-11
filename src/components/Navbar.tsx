import { Box, Flex, Button, Text, Container } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { GiHamburgerMenu } from "react-icons/gi";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { useEffect, useRef } from "react";
import {
	DrawerBackdrop,
	DrawerRoot,
	DrawerTrigger,
} from "./ui/drawer"
import { useState } from "react";
import NavDrawer from "./NavDrawer";

type NavbarProps = {
	setNavbarHeight: (height: number) => void;
};

export default function Navbar({ setNavbarHeight } : NavbarProps) {
	const { colorMode, toggleColorMode } = useColorMode();
	const shadowColor = useColorModeValue("rgba(80, 80, 80, 0.3)", "rgba(160, 160, 160, 0.1)");
	const navBarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (navBarRef.current) {
			setNavbarHeight(navBarRef.current.offsetHeight);
		}
	}, [navBarRef.current]);

	const [open, setOpen] = useState(false)
	
	return (
		<Container width={"100%"} maxW={"100%"} p={0} position={"fixed"} zIndex={1} as={"header"} ref={navBarRef}>
				<Box 
					bg={useColorModeValue("white", "gray.800")}
					borderRadius={"5"} 
					boxShadow={`0 8px 6px ${shadowColor}`}
					px={4}
					py={2}
				>
					<Flex alignItems={"center"} justifyContent={"space-between"}>
						<Flex alignItems={"center"}>
							<DrawerRoot open={open} onOpenChange={(e) => setOpen(e.open)} placement={"start"} size={"xs"}>
								<DrawerBackdrop />
									<DrawerTrigger asChild>
										<Button size={"xs"} variant={"ghost"}>
											<GiHamburgerMenu/>
										</Button>
									</DrawerTrigger>
									
									<NavDrawer open={open} setOpen={setOpen} />
							</DrawerRoot>

							<Text padding={2} fontWeight={"bold"} fontSize={"xl"}>
								SimplexAlgo
							</Text>
						</Flex>

						<Flex alignItems={"center"} gap={3}>
							<Text>
								Change Theme
							</Text>
							
							<Button onClick={toggleColorMode} size={"sm"}>
								{colorMode === "light" ? <IoMoon /> : <LuSun />}
							</Button>
						</Flex>
					</Flex>
				</Box>
		</Container>
	);
}