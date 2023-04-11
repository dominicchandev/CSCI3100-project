import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    Link,
    Spacer,
    useToast,
    HStack,
    Flex,
    useColorMode,
    VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { CompanyIntro } from '@/components/companyintro'
import { NavigationBar } from "@/components/navigationbar";

export default function LoginPage() {
    const { colorMode } = useColorMode();
    const router = useRouter()
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const toast = useToast();
    const { email } = router.query;

    const handleSubmit = (e) => {
        setIsLoading(true)
        setErrMsg("")
        e.preventDefault();
        if (code === "") {
            toast({
                title: "Error",
                description: "Please enter your code.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            // check if the code matches
            router.push("/changepw")
        }
        setIsLoading(false)
    };
    
    const handleClick = (e) => {
        setIsLoading(true)
        setErrMsg("")
        e.preventDefault();
        // resend the code from backend
        setIsLoading(false)
    }

    return (
        <Flex>
                <Box w="50%" h='100%' bg='white'>
                    <VStack>
                        <NavigationBar colorMode={colorMode}/>

                        <VStack pt = "100px" spacing ="10px" alignItems="left"
                        alignContent="left"
                        textAlign="left">
                        <Text lineHeight="1.3" fontWeight="bold" fontSize="32px" color="#40DDCF" >
                        Let us know it's you
                        </Text>
                        <Text
                        lineHeight="1.4"
                        fontWeight="bold"
                        fontSize="14px"
                        color="#A0AEC0"
                        maxWidth="100%"
                        textAlign="left"
                        >
                        To secure your account, enter the code we just sent to {email}
                        </Text>
                        <form onSubmit={handleSubmit}>
                            <FormControl>
                                <FormLabel htmlFor="code"fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" width="35.5px" height="19.5px" >Code</FormLabel>
                                <Input
                                    w = "300px"
                                    placeholder='Enter Code'
                                    fontSize="12px"
                                    type="text"
                                    id="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </FormControl>
                        </form>
                            <Text color="red" fontSize="sm">{errMsg}</Text>
                        <Spacer />
                        <Button type="submit" bg='cyanAlpha' color = "white" variant = "solid" onClick={handleSubmit} isLoading={isLoading}>
                            CONTINUE
                        </Button>
                        <Text
                            fontFamily="Helvetica"
                            lineHeight="1.4"
                            fontWeight="regular"
                            fontSize="14px"
                            color="Gray.Gray-400"
                            width="220.5px"
                            height="19.5px"
                        >
                        <span>Didn't get the code? </span>
                        <Box as="span" fontWeight="bold" color="#40DDCF">
                        <Link fontSize="sm" onClick={handleClick}>Resend Code</Link>
                        </Box>
                        </Text>
                        </VStack>
                        </VStack>
                        </Box>
                        <Spacer/>
                <CompanyIntro colorMode={colorMode}/>
            </Flex>
    );
};
