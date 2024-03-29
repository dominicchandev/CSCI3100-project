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
import { useState } from "react";
import { CompanyIntro } from '@/components/companyintro'
import { NavigationBar } from "@/components/navigationbar";

export default function LoginPage() {
    const { colorMode } = useColorMode();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const toast = useToast();
    const boxColor = useColorModeValue("whitePure", "#1a202c")

    const handleSubmit = (e) => {
        setIsLoading(true);
        setErrMsg("");
        e.preventDefault();
        if (email === "") {
            toast({
                title: "Error",
                description: "Please enter your email.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            // send a verification code in the backend
            // pass on the email to verify
            const formData = new FormData();
            formData.append("email", email);
            const plainFormData = Object.fromEntries(formData.entries());
            fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/email", {
                method: "POST",
                body: JSON.stringify(plainFormData),
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.status === 200) {
                    localStorage.setItem("email", email);
                    router.push("/login/verify");
                } else {
                    toast({
                        title: "Error",
                        description: "Email not registered.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            });
        }
        setIsLoading(false);
    };

    return (
        <Flex bg={boxColor} height ="100vh">
            <Box w="50%" h='100vh' pr="20px" pl="20px">
                <VStack>
                    <NavigationBar colorMode={colorMode}/>

                    <VStack pt = "100px" spacing ="10px" alignItems="left"
                    alignContent="left"
                    textAlign="left">
                    <Text lineHeight="1.3" fontWeight="bold" fontSize="32px" color="#40DDCF" >
                    Forgotten your password?
                    </Text>
                    <Text
                    lineHeight="1.4"
                    fontWeight="bold"
                    fontSize="14px"
                    color="#A0AEC0"
                    maxWidth="100%"
                    textAlign="left"
                    >
                    {"Don't worry, we'll send you a message to help reset your password."}
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel htmlFor="username"fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" width="35.5px" height="19.5px" >Email</FormLabel>
                            <Input
                                placeholder='Your email address'
                                fontSize="12px"
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                    </form>
                        <Text color="red" fontSize="sm">{errMsg}</Text>
                    <Spacer />
                    <Button type="submit" bg='cyanAlpha' color = "white" variant = "solid" onClick={handleSubmit} isLoading={isLoading}>
                        CONTINUE
                    </Button>
                    </VStack>
                    </VStack>
            </Box>
            <Spacer/>
            <Box w="50%" h='100vh'>
                <CompanyIntro colorMode={colorMode}/>
            </Box>
        </Flex>
    );
};
