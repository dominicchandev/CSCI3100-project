import {
  Flex,
  Spacer,
  Button,
  useColorMode,
  Box,
  HStack,
  VStack,
  useToast
} from "@chakra-ui/react";
import { SideBar } from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { CourseTable } from "@/components/profile/CourseTable";
import { useRouter } from "next/router";
import { ProfileBox } from "@/components/profile/profileBox";


export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { token, authStatus, courses, email, name, role, refreshAuthData } = useAuth();
  const [selectedCourses, setSelectedCourses] = useState(new Set())
  const [isDropping, setIsDroping] = useState(false)
  const toast = useToast();
  const router = useRouter();
  const [getRoute, setGetRoute] = useState(true)
  const [lastPartOfRoute, setLastPartOfRoute] = useState("");
  const [dropped, setDropped] = useState(false)

 
  useEffect(() => {
    if (getRoute==true){
    const currentUrl = document.URL;
    setLastPartOfRoute(document.URL.substring(currentUrl.lastIndexOf("/") + 1));
    console.log(lastPartOfRoute);
    console.log(getRoute);
    setGetRoute(false);
    }
  }, [getRoute]);


  return (
      <HStack spacing={10} alignItems="flex-start">
        <SideBar colorMode={colorMode} isAdmin={role === "admin"} onPage={lastPartOfRoute}/>
        <VStack width="100%" pr="20px" pt="25px" spacing={20}>
              <ProfileBox
                email={email}
                name={name}
              />
              <CourseTable 
                courses={courses} 
                title = "Registered Course(s)"
              />
        </VStack>
      </HStack>

  );
}