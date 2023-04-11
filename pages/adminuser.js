import { 
    Flex, 
    Spacer, 
    Button, 
    useColorMode,
    FormControl,
    FormLabel,
    Input,
    Box, 
    Breadcrumb, 
    BreadcrumbItem, 
    BreadcrumbLink, 
    HStack,
    VStack,
    Divider,
    Stack,
    Text,
    Link,
    Avatar,
    AvatarBadge,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Checkbox,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogCloseButton,
    AlertDialogOverlay
    } from '@chakra-ui/react'
  import { SideBar } from '@/components/adminsidebar'
  import { BsMoonStarsFill } from "react-icons/bs";
  import { HiUser, HiUserAdd, HiUserRemove } from "react-icons/hi";
  import { MdWbSunny } from 'react-icons/md';
  import { useRouter } from "next/router";
  import { useAuth } from "@/utils/hooks/useAuth";
  import { useRef, useState, useEffect } from "react";
  import React from "react";
  import { UserTable } from "@/components/profile/UserTable";

  
  export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const { token, authStatus, email, name } = useAuth();
    const cancelRef = React.useRef();
    const router = useRouter();
    
    const handleCreate = (e) => { 
      e.preventDefault();
    };

    const handleDelete = (e) => { 
      e.preventDefault();
    };

    const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
    };

    const [data, setData] = useState(null);

    useEffect(() => {
      if (authStatus === "auth") {
        console.log(`profile token: ${token}`);
        fetchData();
      }
    }, [authStatus])

    async function fetchData() {
      const response = await fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/all", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setData(data);
    }
    
    if (!data) {
      return <Text>Loading...</Text>;
    }

    // the 3 boxes in create users do not align, as well as the labels
    return (
      <Box>
        <HStack mt="10px" pt= "10px">
          <SideBar colorMode={colorMode}/>
          <Spacer/>
          <VStack>
            <Box
              position="absolute"
              ml = "10px"
              borderRadius="15px"
              height="100px"
              top = "20px"
              right = "0px"
              w="75%"
              background="#40DDCF"
              mr = "10px"
            >
              <HStack>
              <VStack align = "left" mt="10px" ml = "10px" pt= "10px">
                <Breadcrumb >
                <BreadcrumbItem color="White">
                <BreadcrumbLink href='' color="White" >{name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem color="White">
                <BreadcrumbLink href='' color="White" >Users</BreadcrumbLink>
                </BreadcrumbItem>
                </Breadcrumb>
                <Text
                align="left"
                color="White"
                fontWeight="bold">Users</Text>
              </VStack>
              <Spacer/>
              <HStack spacing = "20px" mr="10px" mt="10px">
                <Button onClick={toggleColorMode} leftIcon={colorMode === 'light'? <BsMoonStarsFill /> : <MdWbSunny />} size = "xs" colorScheme={colorMode === 'light'? 'whiteAlpha' : 'blackAlpha'} variant='ghost'>
                {colorMode === 'light' ? 'DARK' : 'LIGHT'} MODE
                </Button>
                <Button onClick={onOpen} leftIcon={<HiUser />} size = "xs" colorScheme={colorMode === 'light'? 'whiteAlpha' : 'blackAlpha'} variant='ghost'>
                LOGOUT
                </Button>
                <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
                >
                <AlertDialogOverlay />
                <AlertDialogContent>
                  <AlertDialogHeader>Logout</AlertDialogHeader>
                  <AlertDialogCloseButton />
                  <AlertDialogBody>
                  Are you sure to logout?
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleLogout} bg="cyanAlpha" color = "white" ml={3}>
                      Logout
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
              </HStack>
              </HStack>
            </Box>
            <Spacer/>
            <Box
            position="absolute"
            ml = "10px"
            borderRadius="15px"
            top = "120px"
            right = "10px"
            w="75%"
            background="#FFFFFF"
            mr = "10px"
            overflowWrap="anywhere"
            >
            <VStack>
            <Box
            overflowWrap="break-word"
            flexWrap="wrap"
            >
            <UserTable users={data} />
            </Box>
            <Spacer/>      
            </VStack>
            <Flex marginTop="10" justify="flex-end">
            <Button mr={4} mb={4} onClick={onOpen2} type="submit" leftIcon={<HiUserAdd />} color= "cyanAlpha" borderColor="cyanAlpha" variant = "outline">
                Create User
            </Button>
            <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={onClose2}
            isOpen={isOpen2}
            isCentered
            >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>Create User</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
              <Text>Fill in the name, email, and password to create a new user.</Text>
              <form onSubmit={handleCreate}>
                <FormControl>
                  <Flex alignItems="center" mt="30px">
                  <FormLabel htmlFor="name" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Name</FormLabel>
                  <Input
                      placeholder="New user's name"
                      fontSize="12px"
                      type="text"
                      id="name"
                  />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex alignItems="center" mt="20px">
                  <FormLabel htmlFor="email" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Email</FormLabel>
                  <Input
                      placeholder="New user's email"
                      fontSize="12px"
                      type="text"
                      id="email"
                  />
                  </Flex>
                </FormControl>
                <FormControl>
                  <Flex alignItems="center" mt="20px">
                  <FormLabel htmlFor="password" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Password</FormLabel>
                  <Input
                      placeholder="New user's password"
                      fontSize="12px"
                      type="text"
                      id="password"
                  />
                  </Flex>
                </FormControl>
              </form>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose2}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} bg="cyanAlpha" color = "white" ml={3}>
                  Create
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <Button mr={2} leftIcon={<HiUserRemove />} type="submit" bg='cyanAlpha' color = "white" variant = "solid">
                Delete User
            </Button>
            </Flex>
            </Box>
          </VStack>
        </HStack>
      </Box>
    )
  }
