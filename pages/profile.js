import {
  Flex,
  Spacer,
  Button,
  useColorMode,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  HStack,
  VStack,
  Text,
  Link,
  Avatar,
  AvatarBadge,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogCloseButton,
  AlertDialogOverlay,
  useToast
} from "@chakra-ui/react";
import { SideBar } from "@/components/sidebar";
import { BsMoonStarsFill } from "react-icons/bs";
import { HiUser } from "react-icons/hi";
import { GoCalendar } from "react-icons/go";
import { MdSettings, MdWbSunny } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { CourseTable } from "@/components/profile/CourseTable";
import { useRouter } from "next/router";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { token, authStatus, courses, email, name } = useAuth();
  const cancelRef = React.useRef();
  const router = useRouter();
  const handleDrop = (e) => {
    e.preventDefault();
    toast({
      title: 'Course dropped.',
      description: "The courses are dropped",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  };

  const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
  };
  
  // console.log(`profile token: ${token}`);
  // console.log(`authStatus: ${authStatus}`);

  useEffect(() => {
    if (authStatus === "auth") {
      console.log(`profile token: ${token}`)
      console.log({courses});
    }
  }, [authStatus])

  return (
    <Box>
      <HStack mt="10px" pt="10px">
        <SideBar colorMode={colorMode} />
        <Spacer />
        <VStack>
          <Box
            position="absolute"
            ml="10px"
            borderRadius="15px"
            height="300px"
            top="20px"
            right="0px"
            w="75%"
            background="#40DDCF"
            mr="10px"
          >
            <HStack>
              <VStack align="left" mt="10px" ml="10px" pt="10px">
                <Breadcrumb>
                  <BreadcrumbItem color="White">
                    <BreadcrumbLink href="" color="White">
                      {name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem color="White">
                    <BreadcrumbLink href="" color="White">
                      profile
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
                <Text align="left" color="White" fontWeight="bold">
                  {" "}
                  Profile{" "}
                </Text>
              </VStack>
              <Spacer />
              <HStack spacing="20px" mr="10px" mt="10px">
                <Button onClick={toggleColorMode} leftIcon={colorMode === 'light'? <BsMoonStarsFill /> : <MdWbSunny />} size = "xs" colorScheme={colorMode === 'light'? 'whiteAlpha' : 'blackAlpha'} variant='ghost'>
                {colorMode === 'light' ? 'DARK' : 'LIGHT'} MODE
                </Button>
                <Button
                  onClick={onOpen}
                  leftIcon={<HiUser />}
                  size="xs"
                  colorScheme={colorMode === 'light'? 'whiteAlpha' : 'blackAlpha'}
                  variant="ghost"
                >
                  LOGOUT
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                  isOpen={isOpen}
                  isCentered
                >
                  <AlertDialogOverlay />
                  <AlertDialogContent>
                    <AlertDialogHeader>Logout</AlertDialogHeader>
                    <AlertDialogCloseButton />
                    <AlertDialogBody>Are you sure to logout?</AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                        <Button onClick={handleLogout} bg="cyanAlpha" color="white" ml={3}>
                          Logout
                        </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </HStack>
            </HStack>
          </Box>
          <Spacer />
          <Box
            alignSelf="center"
            position="absolute"
            borderRadius="15px"
            height="113px"
            top="255px"
            right="45px"
            w="70%"
            background="linear-gradient(137deg, #ffffffd1 0%, #ffffffcc 100%)"
            boxShadow="0px 2px 5.5px 0px rgba(0, 0, 0, 0.02)"
            backdropFilter="blur(21px)"
            borderColor="#FFFFFF"
            borderStartWidth="1.5px"
            borderEndWidth="1.5px"
            borderTopWidth="1.5px"
            borderBottomWidth="1.5px"
          >
            <HStack pt="20px" pb="20px" pl="20px">
              <Avatar size="lg" boxShadow="0px 2px 5px grey">
                <AvatarBadge
                  boxSize="1.25em"
                  bg="green.500"
                  boxShadow="0px 2px 5px grey"
                />
              </Avatar>
              <Box pl="10px">
                <Text
                  fontFamily="Helvetica"
                  lineHeight="1.4"
                  fontWeight="bold"
                  fontSize="18px"
                  color="Gray.Gray-700"
                  width="143.5px"
                  height="25px"
                >
                  {name}
                </Text>
                <Text
                  fontFamily="Helvetica"
                  lineHeight="1.4"
                  fontWeight="regular"
                  fontSize="14px"
                  color="Gray.Gray-500"
                  width="178px"
                  height="17px"
                >
                  {email}
                </Text>
              </Box>
              <Spacer />
              <Box pr="40px">
                <Link href="/changepw">
                  <Button
                    leftIcon={<MdSettings />}
                    size="xs"
                    colorScheme="teal"
                    variant="ghost"
                  >
                    RESET PASSWORD
                  </Button>
                </Link>
                <Link href="/logintest">
                  <Button
                    leftIcon={<GoCalendar />}
                    ml="10px"
                    size="xs"
                    colorScheme="teal"
                    variant="solid"
                    height="35px"
                    borderRadius="12px"
                  >
                    VIEW SCHEDULE
                  </Button>
                </Link>
              </Box>
            </HStack>
          </Box>
          <Box
            position="absolute"
            ml="10px"
            borderRadius="15px"
            height="300px"
            top="400px"
            right="10px"
            w="75%"
            background="#FFFFFF"
            mr="10px"
            overflowWrap="anywhere"
          >
            <VStack>
              <Box overflowWrap="break-word" flexWrap="wrap">
                <VStack>
                  <Box overflowWrap="break-word" flexWrap="wrap">
                    <CourseTable courses={courses} />
                  </Box>
                  <Spacer />
                </VStack>
                <Flex justify="flex-end" pb="10px">
                  <Button
                    onClick={handleDrop}
                    type="submit"
                    bg="cyanAlpha"
                    color="white"
                    variant="solid"
                  >
                    Confirm Drop Course
                  </Button>
                </Flex>
              </Box>
              <Spacer />
            </VStack>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}