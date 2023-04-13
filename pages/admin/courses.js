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
    Wrap,
    WrapItem,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Select,
    Stack,
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
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast
    } from '@chakra-ui/react'
  import { SideBar } from '@/components/sidebar';
  import { useRouter } from "next/router";
  import { BsMoonStarsFill } from "react-icons/bs";
  import { HiUser } from "react-icons/hi"
  import { MdSettings, MdWbSunny } from 'react-icons/md'
  import { HiOutlinePlusCircle } from 'react-icons/hi'
  import { useRef, useState, useEffect } from "react";
  import { useAuth } from "@/utils/hooks/useAuth";
  import { ResultTable } from "@/components/ResultTable";

  export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    const { token, authStatus, email, name, role } = useAuth();
    const [status, setStatus] = useState(false);
    const [courseid, setCourseID] = useState("");
    const [coursename, setCourseName] = useState("");
    const [dept, setDept] = useState("");
    const [date, setDate] = useState("");
    const [starttime, setStartTime] = useState("");
    const [endtime, setEndTime] = useState("");
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState(new Set())
    const [isDeleting, setIsDeleting] = useState(false)
    const [errMsg, setErrMsg] = useState("");
    const [newCourseid, setNewCourseid] = useState("");
    const [newCoursename, setNewCoursename] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newStarttime, setNewStarttime] = useState("");
    const [newEndtime, setNewEndtime] = useState("");
    const [newPlace, setNewPlace] = useState("");
    const [newDate2, setNewDate2] = useState("");
    const [newStarttime2, setNewStarttime2] = useState("");
    const [newEndtime2, setNewEndtime2] = useState("");
    const [newPlace2, setNewPlace2] = useState("");
    const [newDept, setNewDept] = useState("");
    const [newInstructor, setNewInstructor] = useState("");
    const [newCapacity, setNewCapacity] = useState("");
    const router = useRouter();
    const toast = useToast();
    const cancelRef = useRef();

    const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
    };

    function handleReset(){
        setCourseID("");
        setCourseName("");
        setDept("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setCourses([]);
        setStatus(false);
    };

    const handleSubmit = (e) => {
        setIsLoading(true);
        setErrMsg("");
        e.preventDefault();
        if (courseid === "" && coursename === "" && dept ==="" &&  date ==="" && starttime==="" && endtime==="") {
          toast({
            title: "Error",
            description: "Please search by at least one criteria.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else if((date!="" && (starttime=="" || endtime=="")) || (starttime!="" && (date=="" || endtime=="")) || (endtime!="" && (date=="" || starttime==""))) {
          toast({
            title: "Error",
            description: "To search by time, please input all three day, start time and end time.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
        else {
          setStatus(true);
        };
        setIsLoading(false);
    };

    async function handleShow(){
        const response = await fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/all", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();
        setCourses(data);
    };

    const handleCheckboxChange = (e) => {
      e.preventDefault();
      if (e.target.checked) {
        setSelectedCourses(prev => new Set(prev.add(e.target.value)))
      }
      else {
        setSelectedCourses(prev => new Set([...prev].filter(x => x !== e.target.value)))
      }
    }

    useEffect(() => {
        if (authStatus === "auth" && isDeleting === true) {
          var dataArray = Array.from(selectedCourses);
          dataArray.forEach(async (element) => {
            await fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/" + element, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              },
            }).then((res) => {
              if (res.status === 200) {
                toast({
                  title: 'Course ' + element + ' deleted.',
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                });
              }
            })
          });
          setIsDeleting(false);
          setStatus(true);
        }
        if (authStatus === "auth" && role!="admin") {
          router.push("/unauthorized")
        }
        if (authStatus === "auth" && status==true) {
          // run api
          console.log(`access token: ${token}`)
          const formData = new FormData();
          formData.append("course_id", courseid);
          formData.append("name", coursename);
          formData.append("department", dept);
          formData.append("day", date);
          formData.append("start_time", starttime);
          formData.append("end_time", endtime);
          const searchParams = new URLSearchParams();
          for (const [key, value] of formData.entries()) {
            if (value !== '') {
              searchParams.append(key, value);
            }
          }
          const queryString = searchParams.toString();
          console.log(queryString);
    
          fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/search?" + queryString, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (res.status === 200) {
                console.log("Searched");
                res.json().then((result) => {
                console.log(result);
                setCourses(result);
                console.log(`1: ${courses}`);
                });
                console.log(`2: ${courses}`);
                // router.push("/");
              } else if (res.status === 422) {
                setErrMsg("Invalid search");
                console.log("Invalid search");
                toast({
                  title: "Error",
                  description: {errMsg},
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              } else {
                console.log(res.json());
              }
            })
            .catch((err) => console.log("Error: ", err));
        }
        setStatus(false);
        setIsLoading(false); 
    }, [authStatus, status, isDeleting])

    // if (authStatus === "loading") {
    //     return <Text>Loading...</Text>;
    // }

    return (
        <Box>
        <HStack mt="10px" pt= "10px">
          <SideBar colorMode={colorMode} isAdmin={role === "admin"}/>
          <Spacer/>
          <VStack>
            <Box
              position="absolute"
              ml = "10px"
              borderRadius="15px"
              height="100px"
              top = "20px"
              right = "0px"
              w="80%"
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
                <BreadcrumbLink href='' color="White" >Courses</BreadcrumbLink>
                </BreadcrumbItem>
                </Breadcrumb>
                <Text
                align="left"
                color="White"
                fontWeight="bold">Courses</Text>
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
            w="80%"
            background="#FFFFFF"
            mr = "10px"
            overflowWrap="anywhere"
            >
            <VStack>
            <Box
            overflowWrap="break-word"
            flexWrap="wrap"
            >
            <VStack mt="20px" ml="10px" alignItems="left">
                <Text
                    textAlign={["left"]}
                    align = "left"
                    lineHeight="1.4"
                    fontWeight="bold"
                    fontSize="18px"
                    color="Gray.Gray-700"
                    width="141px"
                    height="25px"
                    >
                    Search Courses
                    </Text>
                    <Divider/>
                    <Wrap align='center' justify='full'>
                        <WrapItem>
                        <FormControl> 
                        <HStack>
                        <FormLabel htmlFor="courseid" fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="14px" color="Gray.Gray-700" width="95px" height="20px" >Course ID</FormLabel>
                            <Input
                                w = "300px"
                                placeholder='Text here'
                                fontSize="12px"
                                type="text"
                                id="courseid"
                                value={courseid}
                                onChange={(e) => setCourseID(e.target.value)}
                            />
                            </HStack>
                        </FormControl>
                        </WrapItem>

                        <WrapItem>
                        <FormControl>
                        <HStack>
                        <FormLabel htmlFor="dept" fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="14px" color="Gray.Gray-700" width="95px" height="20px" flexDirection= "row-reverse" >Department</FormLabel>
                        <Input
                            w = "300px"
                            placeholder='Text here'
                            fontSize="12px"
                            type="text"
                            id="dept"
                            value={dept}
                            onChange={(e) => setDept(e.target.value)}
                        />
                        </HStack>
                        </FormControl>
                        </WrapItem>
                        <WrapItem>
                        <FormControl>
                        <HStack>
                        <FormLabel htmlFor="coursename" fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="14px" color="Gray.Gray-700" width="95px" height="20px"  >Course Name</FormLabel>
                        <Input
                            w = "300px"
                            placeholder='Text here'
                            fontSize="12px"
                            type="text"
                            id="coursename"
                            value={coursename}
                            onChange={(e) => setCourseName(e.target.value)}
                        />
                        </HStack>
                        </FormControl>
                        </WrapItem>
                        <WrapItem>
                        <FormControl>
                        <HStack>
                        <FormLabel htmlFor="Date" fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="14px" color="Gray.Gray-700" width="95px" height="20px">Time</FormLabel>
                        <Select placeholder = "Select option" id="date" fontSize="12px" color="#808EA0" value={date} onChange={(e) => setDate(e.target.value)}>
                            <option value = 'Monday'> Monday </option>
                            <option value = 'Tuesday'> Tuesday </option>
                            <option value = 'Wednesday'> Wednesday </option>
                            <option value = 'Thursday'> Thursday </option>
                            <option value = 'Friday'> Friday </option>
                        </Select>
                        <Select placeholder = "Select Start Time" id ="starttime" fontSize="12px" color="#808EA0" value={starttime} onChange={(e) => setStartTime(e.target.value)}>
                            <option value = '08:00'> 08:00am </option>
                            <option value = '08:30'> 08:30am </option>
                            <option value = '09:00'> 09:00am </option>
                            <option value = '09:30'> 09:30am </option>
                            <option value = '10:00'> 10:00am </option>
                            <option value = '10:30'> 10:30am </option>
                            <option value = '11:00'> 11:00am </option>
                            <option value = '11:30'> 11:30am </option>
                            <option value = '12:00'> 12:00nn </option>
                            <option value = '12:30'> 12:30pm </option>
                            <option value = '13:00'> 01:00pm </option>
                            <option value = '13:30'> 01:30pm </option>
                            <option value = '14:00'> 02:00pm </option>
                            <option value = '14:30'> 02:30pm </option>
                            <option value = '15:00'> 03:00pm </option>
                            <option value = '15:30'> 03:30pm </option>
                            <option value = '16:00'> 04:00pm </option>
                            <option value = '16:30'> 04:30pm </option>
                            <option value = '17:00'> 05:00pm </option>
                            <option value = '17:30'> 05:30pm </option>
                            <option value = '18:00'> 06:00pm </option>
                        </Select>
                        <Select placeholder = "Select End Time" id ="endtime" fontSize="12px" color="#808EA0" value={endtime} onChange={(e) => setEndTime(e.target.value)}>
                            <option value = '08:15'> 08:15am </option>
                            <option value = '08:45'> 08:45am </option>
                            <option value = '09:15'> 09:15am </option>
                            <option value = '09:45'> 09:45am </option>
                            <option value = '10:15'> 10:15am </option>
                            <option value = '10:45'> 10:45am </option>
                            <option value = '11:15'> 11:15am </option>
                            <option value = '11:45'> 11:45am </option>
                            <option value = '12:15'> 12:15pm </option>
                            <option value = '12:45'> 12:45pm </option>
                            <option value = '13:15'> 01:15pm </option>
                            <option value = '13:45'> 01:45pm </option>
                            <option value = '14:15'> 02:15pm </option>
                            <option value = '14:45'> 02:45pm </option>
                            <option value = '15:15'> 03:15pm </option>
                            <option value = '15:45'> 03:45pm </option>
                            <option value = '16:15'> 04:15pm </option>
                            <option value = '16:45'> 04:45pm </option>
                            <option value = '17:15'> 05:15pm </option>
                            <option value = '17:45'> 05:45pm </option>
                            <option value = '18:15'> 06:15pm </option>
                        </Select>
                        </HStack>
                        </FormControl>
                    </WrapItem>
                    </Wrap>
                    <Flex justify="flex-end" pb="8px">
                    <HStack right = "10px" bottom = "20px" mt="10px" mr="7px">
                    <Button fontSize="14px" type="reset" onClick={handleReset} color= "black" borderColor="cyanAlpha" variant = "outline" >
                        Reset
                    </Button>
                    <Button onClick={onOpen2} leftIcon={<HiOutlinePlusCircle />} iconSize="xl" fontSize="14px" type="submit" color= "black" borderColor="cyanAlpha" variant = "outline" >
                        Add Course
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
                      <AlertDialogHeader>Add Course</AlertDialogHeader>
                      <AlertDialogCloseButton />
                      <AlertDialogBody>
                      <Text>Fill in the new course information to add a new course.</Text>
                      <form>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="30px">
                          <FormLabel htmlFor="newCourseid" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Course ID</FormLabel>
                          <Input
                              placeholder="New Course ID"
                              fontSize="12px"
                              type="text"
                              id="newCourseid"
                              value={newCourseid}
                              onChange={(e) => setNewCourseid(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newCoursename" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Course Name</FormLabel>
                          <Input
                              placeholder="New course name"
                              fontSize="12px"
                              type="text"
                              id="newCoursename"
                              value={newCoursename}
                              onChange={(e) => setNewCoursename(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newDept" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Department</FormLabel>
                          <Input
                              placeholder="New course department"
                              fontSize="12px"
                              type="text"
                              id="newDept"
                              value={newDept}
                              onChange={(e) => setNewDept(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl isRequired>
                        <Flex alignItems="center" mt="20px">
                        <FormLabel htmlFor="newTime" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Time</FormLabel>
                        <Select placeholder = "Select option" id="newDate" fontSize="12px" color="#808EA0" value={newDate} onChange={(e) => setNewDate(e.target.value)}>
                            <option value = 'Monday'> Monday </option>
                            <option value = 'Tuesday'> Tuesday </option>
                            <option value = 'Wednesday'> Wednesday </option>
                            <option value = 'Thursday'> Thursday </option>
                            <option value = 'Friday'> Friday </option>
                        </Select>
                        <Select placeholder = "Select Start Time" id ="newStarttime" fontSize="12px" color="#808EA0" value={newStarttime} onChange={(e) => setNewStarttime(e.target.value)}>
                            <option value = '08:00'> 08:00am </option>
                            <option value = '08:30'> 08:30am </option>
                            <option value = '09:00'> 09:00am </option>
                            <option value = '09:30'> 09:30am </option>
                            <option value = '10:00'> 10:00am </option>
                            <option value = '10:30'> 10:30am </option>
                            <option value = '11:00'> 11:00am </option>
                            <option value = '11:30'> 11:30am </option>
                            <option value = '12:00'> 12:00nn </option>
                            <option value = '12:30'> 12:30pm </option>
                            <option value = '13:00'> 01:00pm </option>
                            <option value = '13:30'> 01:30pm </option>
                            <option value = '14:00'> 02:00pm </option>
                            <option value = '14:30'> 02:30pm </option>
                            <option value = '15:00'> 03:00pm </option>
                            <option value = '15:30'> 03:30pm </option>
                            <option value = '16:00'> 04:00pm </option>
                            <option value = '16:30'> 04:30pm </option>
                            <option value = '17:00'> 05:00pm </option>
                            <option value = '17:30'> 05:30pm </option>
                            <option value = '18:00'> 06:00pm </option>
                        </Select>
                        <Select placeholder = "Select End Time" id ="newEndtime" fontSize="12px" color="#808EA0" value={newEndtime} onChange={(e) => setNewEndtime(e.target.value)}>
                            <option value = '08:15'> 08:15am </option>
                            <option value = '08:45'> 08:45am </option>
                            <option value = '09:15'> 09:15am </option>
                            <option value = '09:45'> 09:45am </option>
                            <option value = '10:15'> 10:15am </option>
                            <option value = '10:45'> 10:45am </option>
                            <option value = '11:15'> 11:15am </option>
                            <option value = '11:45'> 11:45am </option>
                            <option value = '12:15'> 12:15pm </option>
                            <option value = '12:45'> 12:45pm </option>
                            <option value = '13:15'> 01:15pm </option>
                            <option value = '13:45'> 01:45pm </option>
                            <option value = '14:15'> 02:15pm </option>
                            <option value = '14:45'> 02:45pm </option>
                            <option value = '15:15'> 03:15pm </option>
                            <option value = '15:45'> 03:45pm </option>
                            <option value = '16:15'> 04:15pm </option>
                            <option value = '16:45'> 04:45pm </option>
                            <option value = '17:15'> 05:15pm </option>
                            <option value = '17:45'> 05:45pm </option>
                            <option value = '18:15'> 06:15pm </option>
                        </Select>
                        </Flex>
                        </FormControl>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newPlace" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Place</FormLabel>
                          <Input
                              placeholder="New course place"
                              fontSize="12px"
                              type="text"
                              id="newPlace"
                              value={newPlace}
                              onChange={(e) => setNewPlace(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl>
                        <Flex alignItems="center" mt="20px">
                        <FormLabel htmlFor="newTime2" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Time2</FormLabel>
                        <Select placeholder = "Select option" id="newDate2" fontSize="12px" color="#808EA0" value={newDate2} onChange={(e) => setNewDate2(e.target.value)}>
                            <option value = 'Monday'> Monday </option>
                            <option value = 'Tuesday'> Tuesday </option>
                            <option value = 'Wednesday'> Wednesday </option>
                            <option value = 'Thursday'> Thursday </option>
                            <option value = 'Friday'> Friday </option>
                        </Select>
                        <Select placeholder = "Select Start Time" id ="newStarttime2" fontSize="12px" color="#808EA0" value={newStarttime2} onChange={(e) => setNewStarttime2(e.target.value)}>
                            <option value = '08:00'> 08:00am </option>
                            <option value = '08:30'> 08:30am </option>
                            <option value = '09:00'> 09:00am </option>
                            <option value = '09:30'> 09:30am </option>
                            <option value = '10:00'> 10:00am </option>
                            <option value = '10:30'> 10:30am </option>
                            <option value = '11:00'> 11:00am </option>
                            <option value = '11:30'> 11:30am </option>
                            <option value = '12:00'> 12:00nn </option>
                            <option value = '12:30'> 12:30pm </option>
                            <option value = '13:00'> 01:00pm </option>
                            <option value = '13:30'> 01:30pm </option>
                            <option value = '14:00'> 02:00pm </option>
                            <option value = '14:30'> 02:30pm </option>
                            <option value = '15:00'> 03:00pm </option>
                            <option value = '15:30'> 03:30pm </option>
                            <option value = '16:00'> 04:00pm </option>
                            <option value = '16:30'> 04:30pm </option>
                            <option value = '17:00'> 05:00pm </option>
                            <option value = '17:30'> 05:30pm </option>
                            <option value = '18:00'> 06:00pm </option>
                        </Select>
                        <Select placeholder = "Select End Time" id ="newEndtime2" fontSize="12px" color="#808EA0" value={newEndtime2} onChange={(e) => setNewEndtime2(e.target.value)}>
                            <option value = '08:15'> 08:15am </option>
                            <option value = '08:45'> 08:45am </option>
                            <option value = '09:15'> 09:15am </option>
                            <option value = '09:45'> 09:45am </option>
                            <option value = '10:15'> 10:15am </option>
                            <option value = '10:45'> 10:45am </option>
                            <option value = '11:15'> 11:15am </option>
                            <option value = '11:45'> 11:45am </option>
                            <option value = '12:15'> 12:15pm </option>
                            <option value = '12:45'> 12:45pm </option>
                            <option value = '13:15'> 01:15pm </option>
                            <option value = '13:45'> 01:45pm </option>
                            <option value = '14:15'> 02:15pm </option>
                            <option value = '14:45'> 02:45pm </option>
                            <option value = '15:15'> 03:15pm </option>
                            <option value = '15:45'> 03:45pm </option>
                            <option value = '16:15'> 04:15pm </option>
                            <option value = '16:45'> 04:45pm </option>
                            <option value = '17:15'> 05:15pm </option>
                            <option value = '17:45'> 05:45pm </option>
                            <option value = '18:15'> 06:15pm </option>
                        </Select>
                        </Flex>
                        </FormControl>
                        <FormControl>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newPlace2" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Place2</FormLabel>
                          <Input
                              placeholder="New course place"
                              fontSize="12px"
                              type="text"
                              id="newPlace2"
                              value={newPlace2}
                              onChange={(e) => setNewPlace2(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newInstructor" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Instructor</FormLabel>
                          <Input
                              placeholder="New course instructor"
                              fontSize="12px"
                              type="text"
                              id="newInstructor"
                              value={newInstructor}
                              onChange={(e) => setNewInstructor(e.target.value)}
                          />
                          </Flex>
                        </FormControl>
                        <FormControl isRequired>
                          <Flex alignItems="center" mt="20px">
                          <FormLabel htmlFor="newCapacity" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Capacity</FormLabel>
                          <NumberInput min={1} value={newCapacity} onChange={(e) => setNewCapacity(e.value)}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          </Flex>
                        </FormControl>
                      </form>
                      </AlertDialogBody>
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose2}>
                          Cancel
                        </Button>
                        <Button isLoading={isLoading} bg="cyanAlpha" color = "white" ml={3}>
                          Add
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                    <Button fontSize="14px" type="submit" onClick={handleShow} color= "black" borderColor="cyanAlpha" variant = "outline" isLoading={isLoading}>
                        Show All Courses
                    </Button>
                    <Button fontSize="14px" type="submit" bg='cyanAlpha' color = "white" variant = "solid" onClick={handleSubmit} isLoading={isLoading}>
                        Search Course
                    </Button>
                    </HStack>
                    </Flex>
                </VStack>
            </Box>
            <Spacer/>
            </VStack>
            </Box>
            <Box
            position="absolute"
            borderRadius="15px"
            top = "350px"
            right = "10px"
            w="80%"
            background="#FFFFFF"
            ml = "10px"
            mr = "10px"
            overflowWrap="anywhere"
            >
            <VStack>
            <Box overflowWrap="break-word" flexWrap="wrap">
            <VStack>
                <Box overflowWrap="break-word" flexWrap="wrap">
                <ResultTable courses={courses} status={status} onChange={handleCheckboxChange}/>
                </Box>
                <Spacer />
            </VStack>
            </Box>
            <Spacer />
            <Flex justify="flex-end" pb="10px">
                  <Button
                    onClick={() => setIsDeleting(true)}
                    fontSize="14px"
                    type="submit"
                    bg="cyanAlpha"
                    color="white"
                    variant="solid"
                    isLoading={isDeleting}
                  >
                    Confirm Delete Course
                  </Button>
            </Flex>
            </VStack>
            </Box>
        </VStack>
        </HStack>
      </Box>
    )
  }
