import {
    Flex,
    Spacer,
    Button,
    useColorMode,
    Box,
    Center,
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
  } from "@chakra-ui/react";
  import { BsMoonStarsFill } from "react-icons/bs";
  import { HiUser } from "react-icons/hi";
  import { GoCalendar } from "react-icons/go";
  import { MdSettings, MdWbSunny } from "react-icons/md";
  import { useRef } from "react";
  import { useRouter } from "next/router";
  
  export function ProfileBox(props) {
    const email = props.email;
    const name = props.name;
    const schedule = props.schedule;

    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const router = useRouter();
     
    const handleLogout = (e) => { 
        e.preventDefault();
        localStorage.removeItem("accessToken");
        router.push("/login");
    };
  
    return (
        <>
        
            <Box
                borderRadius="15px"
                height="300px"
                width="100%"
                background="#40DDCF"
            >
                <HStack>
                    <VStack align="left" mt="10px" ml="10px" pt="10px">
                    <Breadcrumb>
                        <BreadcrumbItem color="White">
                        <BreadcrumbLink href="/profile" color="White">
                            {name}
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem color="White">
                        <BreadcrumbLink href="/profile" color="White">
                            profile
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        {schedule ? 
                            <BreadcrumbItem color="White">
                                <BreadcrumbLink href="/profile/schedule" color="White">schedule</BreadcrumbLink>
                            </BreadcrumbItem>
                            : <></>
                        }
                    </Breadcrumb>
                    <Text align="left" color="White" fontWeight="bold">
                        {" "}
                        {schedule ? "Schedule" : "Profile"}{" "}
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

                <Center alignItems="flex-end" mt="150px">
                    <Box
                        borderRadius="15px"
                        height="113px"
                        w="90%"
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
                            <Link href="/login/resetpw">
                                <Button
                                leftIcon={<MdSettings />}
                                size="xs"
                                colorScheme="teal"
                                variant="ghost"
                                onClick={() => localStorage.removeItem("accessToken")}
                                >
                                RESET PASSWORD
                                </Button>
                            </Link>
                            <Link href="/profile/schedule">
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
                </Center>
            </Box>

        </>
    );
  }