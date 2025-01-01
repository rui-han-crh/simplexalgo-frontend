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
      <DrawerHeader px={5} py={2}>
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
            <Button {...drawerFlexProps} onClick={() => setOpen(false)}>
              <FaHome {...drawerButtonProps} /> Home
            </Button>
          </Stack>

          <Stack padding={2}>
            <Button {...drawerFlexProps} onClick={() => setOpen(false)}>
              <MdBackupTable {...drawerButtonProps} /> Two Phase Method
            </Button>

            <Button {...drawerFlexProps} onClick={() => setOpen(false)}>
              <TbCircleLetterM {...drawerButtonProps} /> Big M Method
            </Button>
          </Stack>
        </Flex>
      </DrawerBody>
      <DrawerFooter />
    </DrawerContent>
  )
}