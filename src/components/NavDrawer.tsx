import {
  DrawerActionTrigger,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./ui/drawer"
import { Button, Flex, Stack } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHome } from "react-icons/fa";
import { MdBackupTable } from "react-icons/md";
import { TbCircleLetterM } from "react-icons/tb";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Link } from 'react-router-dom';


export default function NavDrawer({ setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const drawerFlexProps: { variant: "ghost"; justifyContent: string; fontSize: string; } = {
    variant: "ghost",
    justifyContent: "flex-start",
    fontSize: "lg"
  };

  const drawerButtonProps: { style: { marginRight: string; }; } = {
    style: { marginRight: "30px" },
  };

  return (
    <DrawerContent>
      <DrawerHeader px={5} py={3}>
        <Flex alignItems={"center"}>
          <DrawerActionTrigger asChild>
            <Button size={"xs"} variant={"ghost"} px={0}>
              <GiHamburgerMenu />
            </Button>
          </DrawerActionTrigger>
          <DrawerTitle padding={2} fontSize={"xl"} fontWeight={"bold"}>
            SimplexAlgo
          </DrawerTitle>
        </Flex>
      </DrawerHeader>
      <DrawerBody px={2} py={0}>
        <Flex flexDir={"column"} justifyContent={"stretch"} divideStyle={"solid"} divideX={"0px"} divideY={"2px"} divideColor={useColorModeValue("gray.300", "gray.600")}>
          <Stack padding={2}>
            <Link to="/" onClick={() => setOpen(false)}>
              <Button {...drawerFlexProps}>
                <FaHome {...drawerButtonProps} /> Home
              </Button>
            </Link>
          </Stack>

          <Stack padding={2}>
            <Link to="/two-phase" onClick={() => setOpen(false)}>
              <Button {...drawerFlexProps}>
                <MdBackupTable {...drawerButtonProps} /> Two Phase Method
              </Button>
            </Link>

            <Link to="/big-m" onClick={() => setOpen(false)}>
              <Button {...drawerFlexProps}>
                <TbCircleLetterM {...drawerButtonProps} /> Big-M Method
              </Button>
            </Link>
          </Stack>
        </Flex>
      </DrawerBody>
      <DrawerFooter />
    </DrawerContent>
  )
}