import {
  useColorMode,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { SideBar } from "@/components/sidebar";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";
import { Schedule } from "@/components/schedule";
import { ProfileBox } from "@/components/profile/profileBox";
import { useRouter } from "next/router";

export default function SchedulePage() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { token, authStatus, courses, email, name , role, userId} = useAuth();
  const router = useRouter();
   
  useEffect(() => {
    if (authStatus === "unauth") {
      router.push("/login")
    }
  }, [authStatus])
  
  return (
    <>    
      <HStack spacing={10} alignItems="flex-start">
          <SideBar colorMode={colorMode} isAdmin={role === "admin"}/>
          <VStack width="100%" pr="20px" pt="25px" spacing={20}>
                <ProfileBox
                  email={email}
                  name={name}
                  schedule={true}
                />
                <Schedule courses={courses}/>
          </VStack>
      </HStack>
    </>
  );
}