import {
    Box,
    VStack,
    Button,
    HStack,
    Spacer,
    Link,
    IconButton,
    Icon,
    Divider,
    Center
} from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";
import { HiUserAdd } from "react-icons/hi"
import { AiFillUnlock } from 'react-icons/ai'
import { BsMoonStarsFill } from 'react-icons/bs'
import { Stack, Text, Menu } from '@chakra-ui/react'

export function NavigationBar(props) {
    const [darkmodeHighlight, setDarkmodeHighlight] = useState(false)
    const [signinHighlight, setSigninHighlight] = useState(false)
    const colorMode = props.colorMode

    function darkmodeOnClick() {
        setDarkmodeHighlight(true)
        setSigninHighlight(false)
    }

    function signinOnClick() {
        setDarkmodeHighlight(false)
        setSigninHighlight(true)
    }

    return (
    <Box>
        <Box 
            w="600px"
            rounded="15px"
            pl="10px" 
            boxShadow="0px 7px 23px 0px"
            bg="white" 
            opacity="80%"
            borderColor="white"
            borderWidth="1.5px"
            backdropFilter="blur(21px)"
        >
            <Stack justify = "center" align ="center" spacing = "0px" overflow = "hidden">
            <HStack spacing = "20px">
                <Image 
                    src='/images/logo.svg'
                    alt="CSCI3100 Logo"
                    width={118}
                    height={71}
                />
                <Spacer/>
                <Button leftIcon={<BsMoonStarsFill />} size = "xs" colorScheme='#2D3748' variant='ghost'>
                DARK MODE
                </Button>
                <Link href="/login">
                <Button leftIcon={<AiFillUnlock />} size = "xs" colorScheme='#2D3748' variant='ghost'>
                SIGN IN
                </Button>
                </Link>
                <Spacer/>
                <Link href="/login/signup">
                <Button leftIcon={<HiUserAdd />} size = "xs" bg='buttoncolour' color = "white" variant='solid' borderRadius='xl' px="20px" >
                SIGN UP
                </Button>
                </Link>
            </HStack>
            </Stack>
        </Box>
    </Box>
    );
};