import {
  Stack,
  Icon,
  Grid,
  GridItem,
  Input,
  Wrap,
  WrapItem,
  Form,
  FormControl,
  FormLabel,
  Select,
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
  Text,
  Link,
  useToast
 } from '@chakra-ui/react'
import { ReactIcon } from '@chakra-ui/icons'
import { GoBook, GoThreeBars } from 'react-icons/go'
import { SideBar } from '@/components/sidebar'
import { BsMoonStarsFill } from "react-icons/bs";
import { HiUser } from "react-icons/hi"
import { GoCalendar } from 'react-icons/go'
import { MdSettings } from 'react-icons/md'
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { ResultTable } from "@/components/ResultTable";
import { useRouter } from "next/router";


export default function Courses() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { token, authStatus, name } = useAuth();
  const [status, setStatus] = useState(false);
  const [courseid, setCourseID] = useState("");
  const [coursename, setCourseName] = useState("");
  const [dept, setDept] = useState("");
  const [date, setDate] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [courses, setCourses] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const toast = useToast();
  const searchParams = new URLSearchParams();
  const router = useRouter();

  const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
  };

  useEffect(() => {
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
            console.log(courses);
            });
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
    setIsLoading(false); 
  }, [authStatus, status])

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
    } else {
      setStatus(true);
  };
  }

  return (
    <Grid
    templateAreas={`"nav breadcrumb"
                  "nav search"
                  "nav result"`}
    gridTemplateRows={'130px 1fr 1fr'}
    gridTemplateColumns={'250px 1fr'}
    h='fill'
    gap='1'
  >
  <GridItem pl='2' area={'nav'}>
    <SideBar colorMode={colorMode}/>
  </GridItem>
  <GridItem pl='5px' mt = "10px" pr ="20px" background="#40DDCF" borderWidth='1px' borderRadius="15px" area={'breadcrumb'}>
      <HStack>
      <VStack align = "left" mt="10px" ml = "10px" pt= "10px">
        <Breadcrumb >
        <BreadcrumbItem color="White">
        <BreadcrumbLink href='' color="White" >{name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem color="White">
        <BreadcrumbLink href='' color="White" >Course Browsing</BreadcrumbLink>
        </BreadcrumbItem>
        </Breadcrumb>
        <Text
        align="left"
        color="White"
        fontWeight="bold"> Course Browsing </Text>
      </VStack>
      <Spacer/>
      <HStack spacing = "20px" mr="10px" mt="10px">
        <Button leftIcon={<BsMoonStarsFill />} size = "xs" colorScheme='whiteAlpha' variant='ghost'>
        DARK MODE
        </Button>
        <Link href="/testing">
        <Button leftIcon={<HiUser />} size = "xs" colorScheme='whiteAlpha' variant='ghost'>
        LOGOUT
        </Button>
        </Link>
      </HStack>
      </HStack>
  </GridItem>
  <GridItem pl='15px' pt = "10px" mt = '10px'  pr ="20px" background="#FFFFFF" borderRadius="15px" area={'search'}>
    <VStack alignItems="left">
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
              <FormLabel htmlFor="courseid"fontFamily="Helvetica" lineHeight="1.4" fontWeight="bold" fontSize="14px" color="Gray.Gray-700" width="95px" height="20px" >Course ID</FormLabel>
                <Input
                    mid
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
                <option value = 'Mon'> Monday </option>
                <option value = 'Tue'> Tuesday </option>
                <option value = 'Wed'> Wednesday </option>
                <option value = 'Thur'> Thursday </option>
                <option value = 'Fri'> Friday </option>
              </Select>
              <Select placeholder = "Select Start Time" id ="starttime" fontSize="12px" color="#808EA0" value={starttime} onChange={(e) => setStartTime(e.target.value)}>
                <option value = '0800'> 08:00am </option>
                <option value = '0830'> 08:30am </option>
                <option value = '0900'> 09:00am </option>
                <option value = '0930'> 09:30am </option>
                <option value = '1000'> 10:00am </option>
                <option value = '1030'> 10:30am </option>
                <option value = '1100'> 11:00am </option>
                <option value = '1130'> 11:30am </option>
                <option value = '1200'> 12:00nn </option>
                <option value = '1230'> 12:30pm </option>
                <option value = '1300'> 01:00pm </option>
                <option value = '1330'> 01:30pm </option>
                <option value = '1400'> 02:00pm </option>
                <option value = '1430'> 02:30pm </option>
                <option value = '1500'> 03:00pm </option>
                <option value = '1530'> 03:30pm </option>
                <option value = '1600'> 04:00pm </option>
                <option value = '1630'> 04:30pm </option>
                <option value = '1700'> 05:00pm </option>
                <option value = '1730'> 05:30pm </option>
                <option value = '1800'> 06:00pm </option>
              </Select>
              <Select placeholder = "Select End Time" id ="endtime" fontSize="12px" color="#808EA0" value={endtime} onChange={(e) => setEndTime(e.target.value)}>
                <option value = '0815'> 08:15am </option>
                <option value = '0845'> 08:45am </option>
                <option value = '0915'> 09:15am </option>
                <option value = '0945'> 09:45am </option>
                <option value = '1015'> 10:15am </option>
                <option value = '1045'> 10:45am </option>
                <option value = '1115'> 11:15am </option>
                <option value = '1145'> 11:45am </option>
                <option value = '1215'> 12:15pm </option>
                <option value = '1245'> 12:45pm </option>
                <option value = '1315'> 01:15pm </option>
                <option value = '1345'> 01:45pm </option>
                <option value = '1415'> 02:15pm </option>
                <option value = '1445'> 02:45pm </option>
                <option value = '1515'> 03:15pm </option>
                <option value = '1545'> 03:45pm </option>
                <option value = '1615'> 04:15pm </option>
                <option value = '1645'> 04:45pm </option>
                <option value = '1715'> 05:15pm </option>
                <option value = '1745'> 05:45pm </option>
                <option value = '1815'> 06:15pm </option>
              </Select>
              </HStack>
              </FormControl>
          </WrapItem>
        </Wrap>
        <HStack position="absolute" right = "10px" bottom = "20px">
          <Button type="submit" colorScheme="teal" variant = "outline" >
              Reset
          </Button>
          <Button type="submit" bg='cyanAlpha' color = "white" variant = "solid" onClick={handleSubmit} isLoading={isLoading}>
              Search Course
          </Button>
        </HStack>
      </VStack>
  </GridItem>
  <GridItem pl='2' area={'result'} borderRadius="15px" background="#FFFFFF" mr="10px" ml="10px" overflowWrap="anywhere">
      <VStack>
        <Box overflowWrap="break-word" flexWrap="wrap">
          <VStack>
            <Box overflowWrap="break-word" flexWrap="wrap">
              {/* <ResultTable courses={courses} /> */}
            </Box>
            <Spacer />
          </VStack>
        </Box>
        <Spacer />
      </VStack>
  </GridItem>
</Grid>
  )
}

