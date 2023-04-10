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
  import { HiUser, HiUserAdd, HiUserRemove } from "react-icons/hi"
  import React from "react";

  
  export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    
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
                <BreadcrumbLink href='' color="White" >Testing</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem color="White">
                <BreadcrumbLink href='' color="White" >Users</BreadcrumbLink>
                </BreadcrumbItem>
                </Breadcrumb>
                <Text
                align="left"
                color="White"
                fontWeight="bold"> Users </Text>
              </VStack>
              <Spacer/>
              <HStack spacing = "20px" mr="10px" mt="10px">
                <Button leftIcon={<BsMoonStarsFill />} size = "xs" colorScheme='whiteAlpha' variant='ghost'>
                DARK MODE
                </Button>
                <Button onClick={onOpen} leftIcon={<HiUser />} size = "xs" colorScheme='whiteAlpha' variant='ghost'>
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
                    <Link href="/login">
                    <Button bg="cyanAlpha" color = "white" ml={3}>
                      Logout
                    </Button>
                    </Link>
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
            height="300px"
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
            <TableContainer>
                <Table variant='simple' layout="fixed" overflowWrap="anywhere" >
                <TableCaption placement="top" textAlign="left" fontWeight="bold" fontSize="xl">Users</TableCaption>
                <Thead>
                    <Tr>
                    <Th fontFamily="Helvetica" lineHeight="1.5" fontWeight="bold" fontSize="10px" color="#A0AEC0">NAME</Th>
                    <Th fontFamily="Helvetica" lineHeight="1.5" fontWeight="bold" fontSize="10px" color="#A0AEC0">EMAIL</Th>
                    <Th fontFamily="Helvetica" lineHeight="1.5" fontWeight="bold" fontSize="10px" color="#A0AEC0" textAlign ="center">DELETE USER</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin</Td>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin@gmail.com</Td>
                    <Td textAlign ="center"><Checkbox value='drop'></Checkbox></Td>
                    </Tr>
                    <Tr>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin</Td>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin@gmail.com</Td>
                    <Td textAlign ="center"><Checkbox value='drop'></Checkbox></Td>
                    </Tr>
                </Tbody>
                <Tfoot>
                    <Tr>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin</Td>
                    <Td fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="12px" color="#2D3748">Admin@gmail.com</Td>
                    <Td textAlign ="center"><Checkbox value='drop'></Checkbox></Td>
                    </Tr>
                </Tfoot>
                </Table>
            </TableContainer>
            </Box>
            <Spacer/>      
            </VStack>
            <Flex marginTop="10" justify="flex-end">
            <Button mr={4} type="submit" leftIcon={<HiUserAdd />} color= "cyanAlpha" borderColor="cyanAlpha" variant = "outline">
                Create User
            </Button>
            <Button leftIcon={<HiUserRemove />} type="submit" bg='cyanAlpha' color = "white" variant = "solid">
                Delete User
            </Button>
            </Flex>
            </Box>
          </VStack>
        </HStack>
      </Box>
    )
  }
