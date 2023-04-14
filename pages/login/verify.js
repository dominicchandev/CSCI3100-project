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
    useColorModeValue,
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
    const email = sessionStorage.getItem("email");
      const boxColor = useColorModeValue("whitePure", "#1a202c")


    const handleSubmit = (e) => {
        setIsLoading(true);
        setErrMsg("");
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
            const formData = new FormData();
            formData.append("email", email);
            formData.append("otp", code);
            const plainFormData = Object.fromEntries(formData.entries());
            fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/email/verification", {
                method: "POST",
                body: JSON.stringify(plainFormData),
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((result) => {
                        const token = result.verify_token;
                        sessionStorage.removeItem("email");
                        sessionStorage.setItem("verify_token", token);
                        router.push("/login/changepw");
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Code does not match.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            });
        }
        setIsLoading(false);
    };
    
    const handleClick = (e) => {
        setIsLoading(true);
        setErrMsg("");
        e.preventDefault();
        // resend the code from backend
        setIsLoading(false);
    }

    return (
        <Flex bg= {boxColor} height ="100vh">
            <Box w="50%" h='100vh' pr="20px" pl="20px">
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
            <Box w="50%">
                <CompanyIntro colorMode={colorMode}/>
            </Box>
        </Flex>
    );
};
