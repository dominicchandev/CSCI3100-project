import {
    Box,
    VStack,
    HStack,
    IconButton,
    Icon,
    Divider,
    Center
} from "@chakra-ui/react";
import { HamburgerIcon } from '@chakra-ui/icons'
import Image from "next/image";
import { SidebarButton } from "./sidebarbutton";
import { useEffect, useState } from "react";
import { HiUser, HiUserGroup } from "react-icons/hi"
import { GoBook } from "react-icons/go"
import { useRouter } from "next/router";

export function SideBar(props) {
    const [extend, setExtend] = useState(true);
    const [coursesBrowsingHighlight, setcoursesBrowsingHighlight] = useState(false);
    const [profileHighlight, setProfileHighlight] = useState(false);
    
    const isAdmin = props.isAdmin;
    const [coursesHighlight, setcoursesHighlight] = useState(false);
    const [usersHighlight, setUsersHighlight] = useState(false);

    const colorMode = props.colorMode;
    const onPage = props.onPage;
    const router = useRouter();
    

    useEffect(() => {
        if (onPage=="profile") {
            setProfileHighlight(true)
        }
        if (onPage=="coursesbrowsing") {
            setcoursesBrowsingHighlight(true)
        }
        if (onPage=="courses" && isAdmin) {
            setcoursesHighlight(true)
        } 
        if (onPage=="users") {
            setUsersHighlight(true)
        } 
    },[onPage])


    function menuOnClick() {
        setExtend(!extend)
    }

    function coursesBrowsingOnClick() {
        router.push("/coursesbrowsing")
    }

    function profileOnClick() {
        router.push("/profile")
    }

    function coursesOnClick() {
        router.push("/admin/courses")
    }

    function usersOnClick() {
        router.push("/admin/users")
    }

    return (
        <Box 
            pl="20px"
            mt={props.mt ?? undefined}
            height="100vh"
        >
            <HStack>
                    <Center height="80px">
                        <IconButton 
                            icon={<Icon as={HamburgerIcon} color="cyanAlpha"/>}
                            background="transparent"
                            onClick={menuOnClick}
                        />
                    </Center>
                <Image 
                    src='/images/logo.svg'
                    alt="CSCI3100 Logo"
                    width={132}
                    height={80}
                    hidden={!extend}
                />
            </HStack>
            <Divider pb="10px"/>
            <VStack mt="25px" spacing="15px">
                <SidebarButton 
                    text="Courses Browsing" 
                    icon={<GoBook color={coursesBrowsingHighlight ? "white" : "#40DDCF"} size={21}/>}
                    extend={extend} 
                    highlight={coursesBrowsingHighlight}
                    onClick={coursesBrowsingOnClick}
                    colorMode={colorMode}
                />
                <SidebarButton 
                    text="Profile" 
                    icon={<HiUser color={profileHighlight ? "white" : "#40DDCF"} size={21}/>} 
                    extend={extend} 
                    highlight={profileHighlight} 
                    onClick={profileOnClick}
                    colorMode={colorMode}
                />
                {isAdmin ? 
                    <>
                        <SidebarButton 
                            text="Courses" 
                            icon={<GoBook color={coursesHighlight ? "white" : "#40DDCF"} size={21}/>}
                            extend={extend} 
                            highlight={coursesHighlight}
                            onClick={coursesOnClick}
                            colorMode={colorMode}
                        />
                        <SidebarButton 
                            text="Users" 
                            icon={<HiUserGroup color={usersHighlight ? "white" : "#40DDCF"} size={21}/>} 
                            extend={extend} 
                            highlight={usersHighlight} 
                            onClick={usersOnClick}
                            colorMode={colorMode}
                        />
                    </>
                : <></>}
            </VStack>
        </Box>
    );
};