import {
    Box,
    VStack,
    Text,
    IconButton,
    Icon,
    Divider,
    Center,
    Spacer,
    Flex
} from "@chakra-ui/react";
import Image from "next/image";


export function CompanyIntro() {

    return (
        <Box 
            w="50%" 
            h="600px"
            position="sticky" 
            right="0px" 
            top="0" 
            pl="10px" 
            pt="10px"
            borderBottomLeftRadius ="15px"
            bg = "#40DDCF"
        >
            <VStack mt="130px" spacing="15px">

                <Image 
                    src='/images/logo_white.png'
                    alt="CSCI3100 Logo"
                    width={300}
                    height={25}
                />    
            <Text fontFamily="Helvetica"
            lineHeight="1.3"
            fontWeight="bold"
            fontSize="32px"
            color="White"
            textAlign="center">
            Welcome!
            </Text>
            <Text fontFamily="Helvetica"
            lineHeight="1.4"
            fontWeight="regular"
            fontSize="14px"
            color="White"
            width="399px"
            height="85px"
            maxWidth="100%"
            textAlign="center">
            The best course registration system to facilitate the process of searching, registering and dropping courses. Start your academic term with a wonderful course management experience with us:)
            </Text>
            </VStack>
            </Box>
    );
};