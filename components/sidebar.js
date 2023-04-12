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
import { useState } from "react";
import { HiUser } from "react-icons/hi"
import { GoBook } from "react-icons/go"


export function SideBar(props) {
    const [extend, setExtend] = useState(true)
    const [coursesHighlight, setCoursesHighlight] = useState(false)
    const [profileHighlight, setProfileHighlight] = useState(false)
    const colorMode = props.colorMode


    function menuOnClick() {
        setExtend(!extend)
    }

    function coursesOnClick() {
        setCoursesHighlight(true)
        setProfileHighlight(false)
    }

    function profileOnClick() {
        setCoursesHighlight(false)
        setProfileHighlight(true)
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
                    icon={<GoBook color={coursesHighlight ? "white" : "#40DDCF"} size={21}/>}
                    extend={extend} 
                    highlight={coursesHighlight}
                    onClick={coursesOnClick}
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
            </VStack>
        </Box>
    );
};