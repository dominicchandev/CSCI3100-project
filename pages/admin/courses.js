import { 
    Flex, 
    Spacer, 
    Button, 
    useColorMode,
    useColorModeValue,
    Box, 
    HStack,
    VStack,
    Wrap,
    WrapItem,
    FormControl,
    FormLabel,
    Input,
    Divider,
    Select,
    Text,
    useDisclosure,
    useToast
    } from '@chakra-ui/react'
  import { SideBar } from '@/components/sidebar';
  import { useRouter } from "next/router";
  import { HiOutlinePlusCircle } from 'react-icons/hi'
  import { useRef, useState, useEffect } from "react";
  import { useAuth } from "@/utils/hooks/useAuth";
  import { CourseBox } from '@/components/CourseBox';
  import { AddCourseModal } from '@/components/AddCourseModal';
  import { AdminResultTable } from "@/components/AdminResultTable";

  export default function Home() {
    const { colorMode, toggleColorMode } = useColorMode();
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
    const router = useRouter();
    const toast = useToast();
    const cancelRef = useRef();
    const [getRoute, setGetRoute] = useState(true);
    const [lastPartOfRoute, setLastPartOfRoute] = useState("");
  
    const boxColor = useColorModeValue("whitePure", "darkAlpha")

    useEffect(() => {
      if (getRoute==true){
      const currentUrl = document.URL;
      const parts = currentUrl.split("/");
      const temp = parts.pop();
      setLastPartOfRoute(temp);
      setGetRoute(false);
      }
    }, [getRoute]);
    

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
      if (authStatus === "unauth"){
        router.push("/login")
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


    return (
      <HStack spacing={10} alignItems="flex-start">
          <SideBar colorMode={colorMode} isAdmin={role === "admin"} onPage={lastPartOfRoute}/>
          <VStack width="100%" pr="20px" pt="25px" spacing={10}>
          <CourseBox name={name} page="Courses"/>
          <Box maxWidth="100%" borderRadius="15px" bg={boxColor}>
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
                    <Flex justify="flex-end" pb="15px" pr="15px" maxW="100%">
                      <HStack maxWidth="100%" right="10px" bottom = "20px" mt="10px" mr="7px">
                        <Button fontSize="14px" type="reset" onClick={handleReset} color= {colorMode === 'light'? "black" : "white"} borderColor="teal" variant = "outline" >
                            Reset
                        </Button>
                        <Button onClick={onOpen2} leftIcon={<HiOutlinePlusCircle />} iconSize="xl" fontSize="14px" type="submit" color= {colorMode === 'light'? "black" : "white"}  borderColor="teal" variant = "outline" >
                            Add Course
                        </Button>
                        <AddCourseModal isOpen={isOpen2} onClose={onClose2}/>
                        <Button fontSize="14px" type="submit" onClick={handleShow} color= {colorMode === 'light'? "black" : "white"}  borderColor="teal" variant = "outline" isLoading={isLoading}>
                            Show All Courses
                        </Button>
                        <Button fontSize="14px" type="submit" bg='teal' color = "white" variant = "solid" onClick={handleSubmit} isLoading={isLoading}>
                            Search Course
                        </Button>
                      </HStack>
                    </Flex>
            </VStack>
          </Box>
          <AdminResultTable courses={courses} status={status}/>
          </VStack>
      </HStack>
    )
  }
