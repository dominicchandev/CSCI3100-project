import {
    Box,
    VStack,
    Text,
} from "@chakra-ui/react";
import Image from "next/image";

export default function Unauthorized() {
    return (
        <Box>
        <VStack mt="10px" ml = "10px" mr="10px" pt= "10px" spacing="15px" bg = "#40DDCF" w = "100%" h = "350px" borderRadius="15px">
        <Image 
                    src='/images/white_logo.gif'
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
            OPPS!
            </Text>

        <Text fontFamily="Helvetica"
            lineHeight="1.3"
            fontWeight="normal"
            fontSize="20px"
            color="White"
            textAlign="center">
            Unfortunately, you have reached an unauthorized page.
            </Text>
        </VStack>
      </Box>
    );
};