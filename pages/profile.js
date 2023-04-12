import {
  Flex,
  Spacer,
  Button,
  useColorMode,
  Box,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { SideBar } from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { CourseTable } from "@/components/profile/CourseTable";
import { useRouter } from "next/router";
import { ProfileBox } from "@/components/profile/profileBox";

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { token, authStatus, courses, email, name } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState(new Set())
  const [isDropping, setIsDroping] = useState(false)
  const router = useRouter();

  const handleCheckboxChange = (e) => {
    e.preventDefault();
    if (e.target.checked) {
      setSelectedCourses(prev => new Set(prev.add(e.target.value)))
    }
    else {
      setSelectedCourses(prev => new Set([...prev].filter(x => x !== e.target.value)))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    toast({
      title: 'Course dropped.',
      description: "The courses are dropped",
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
    // TODO: fetch the drop course api
  };

  const handleLogout = (e) => { 
      e.preventDefault();
      localStorage.removeItem("accessToken");
      router.push("/login");
  };
  
  useEffect(() => {
    if (authStatus === "auth" && isDropping === true) {
      //TODO: call handleDrop
      // The selected courses are stored in the selectedCourses useState
      // You may write sth like 
      // fetch()
      // .then((res) => res.json())
      // ...
      // .finally(setIsDropping(false))
      setIsDroping(false)
    }
  }, [authStatus, isDropping])

  // You may console log the courses by:
  // useEffect(() => {
  //   console.log(selectedCourses)
  // }, [selectedCourses])

  return (
      <HStack spacing={10} alignItems="flex-start">
        <SideBar colorMode={colorMode} mt="20px"/>
        <VStack width="100%" pr="20px" pt="25px" spacing={20}>
              <ProfileBox
                email={email}
                name={name}
              />
              <Box
                borderRadius="15px"
                width="100%"
                background="#FFFFFF"
                overflowWrap="anywhere"
              >
                <VStack>
                  <Box overflowWrap="break-word" flexWrap="wrap">
                    <VStack>
                      <Box overflowWrap="break-word" flexWrap="wrap">
                        <CourseTable 
                          courses={courses} 
                          onChange={handleCheckboxChange}
                        />
                      </Box>
                      <Spacer />
                    </VStack>
                    <Flex justify="flex-end">
                      <Button
                        onClick={() => setIsDroping(true)}
                        type="submit"
                        bg="cyanAlpha"
                        color="white"
                        variant="solid"
                        isLoading={isDropping}
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

  );
}