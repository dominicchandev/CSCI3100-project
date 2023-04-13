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
  
  export function CourseBox(props) {
    const name = props.name;
    const page = props.page;

    const getlink = () => {
        if (page === "Courses Browsing") {
            return "/coursesbrowsing";
        }
        else {
            return "/admin/courses";
        }
    }

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
                height="130px"
                width="100%"
                background="#40DDCF"
            >
                <HStack pr = "10px">
                    <VStack align="left" mt="10px" ml="10px" pt="10px">
                    <Breadcrumb>
                        <BreadcrumbItem color="White">
                        <BreadcrumbLink href="/profile" color="White">
                            {name}
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem color="White">
                        <BreadcrumbLink href={getlink} color="White">
                            {page}
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                    <Text align="left" color="White" fontWeight="bold">
                        {" "}
                        {page}{" "}
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

        </>
    );
  }