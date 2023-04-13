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
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogCloseButton,
    AlertDialogOverlay,
    useToast
    } from '@chakra-ui/react'
  import { SideBar } from '@/components/sidebar'
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
    const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
    const { token, authStatus, email, name, role } = useAuth();
    const [newname, setNewName] = useState("");
    const [newemail, setNewEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [data, setData] = useState([]);
    const cancelRef = React.useRef();
    const router = useRouter();
    const toast = useToast();
    console.log(role);
    
    const handleCreate = (e) => { 
      e.preventDefault();
      setIsLoading(true);
      setErrMsg("");
      if (newemail === "" || password === "" || newname === "") {
        setErrMsg("Name, email and password are required.");
        setIsLoading(false);
        return;
        };
    const formData = new FormData();
    formData.append("name", newname);
    formData.append("email", newemail);
    formData.append("password", password);

    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);
    console.log(newname);
    fetch(process.env.NEXT_PUBLIC_SERVER + 'api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formDataJsonString
    })
    .then((res) => {
        if (res.status === 200) {
            console.log("New user");
            onClose2();
            toast({
              title: "Success",
              description: `New user ${newname} created`,
              status: "success",
              duration: 9000,
              isClosable: true,
          });
        } else if (res.status === 400) {
            setErrMsg("Email already registered")
            console.log("Email already registered");
        } else {
            console.log(res.json())
        }
    })
    .catch((err) => console.log("Error: ", err))
    .finally(() => setIsLoading(false));
    };

    const handleDelete = (e) => { 
      e.preventDefault();
      setIsLoading(false);
    };

    const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
    };

    useEffect(() => {
      if (authStatus === "auth") {
        console.log(`profile token: ${token}`);
        fetchData();
      }
      if (authStatus === "auth" && role!=="admin"){
        router.push("/unauthorized")
      }
    }, [isLoading, authStatus])

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

    return (
        <HStack mt="10px" pt= "10px" alignItems="flex-start">
          <SideBar colorMode={colorMode} isAdmin={role === "admin"}/>
          <VStack width="100%" pr="20px">
            <Box
              borderRadius="15px"
              height="100px"
              w="100%"
              background="#40DDCF"
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
            <Box
            borderRadius="15px"
            w="100%"
            background="#FFFFFF"
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
              <form>
                <FormControl isRequired>
                  <Flex alignItems="center" mt="30px">
                  <FormLabel htmlFor="name" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Name</FormLabel>
                  <Input
                      placeholder="New user's name"
                      fontSize="12px"
                      type="text"
                      id="name"
                      value={newname}
                      onChange={(e) => setNewName(e.target.value)}
                  />
                  </Flex>
                </FormControl>
                <FormControl isRequired>
                  <Flex alignItems="center" mt="20px">
                  <FormLabel htmlFor="email" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Email</FormLabel>
                  <Input
                      placeholder="New user's email"
                      fontSize="12px"
                      type="text"
                      id="email"
                      value={newemail}
                      onChange={(e) => setNewEmail(e.target.value)}
                  />
                  </Flex>
                </FormControl>
                <Text color="red" fontSize="sm">
                            {errMsg}
                        </Text>
                <FormControl isRequired>
                  <Flex alignItems="center" mt="20px">
                  <FormLabel htmlFor="password" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Password</FormLabel>
                  <Input
                      placeholder="New user's password"
                      fontSize="12px"
                      type="text"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  </Flex>
                </FormControl>
              </form>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose2}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} isLoading={isLoading} bg="cyanAlpha" color = "white" ml={3}>
                  Create
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
            <Button onClick={onOpen3} mr={2} leftIcon={<HiUserRemove />} type="submit" bg='cyanAlpha' color = "white" variant = "solid">
                Delete User
            </Button>
            <AlertDialog
              motionPreset='slideInBottom'
              leastDestructiveRef={cancelRef}
              onClose={onClose3}
              isOpen={isOpen3}
              isCentered
              >
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader>Delete User</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                Are you sure to delete the selected users?
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose3}>
                    Cancel
                  </Button>
                  <Button onClick={handleDelete} isLoading={isLoading} bg="cyanAlpha" color = "white" ml={3}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </Flex>
            </Box>
          </VStack>
        </HStack>
    )
  }
