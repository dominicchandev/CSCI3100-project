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
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const toast = useToast();
    const token = sessionStorage.getItem("verify_token");

    const handleSubmit = (e) => {
        setIsLoading(true)
        setErrMsg("")
        e.preventDefault();
        if (password1 === password2 && password1 != "") {
            //update the password for the user
            const formData = new FormData();
            formData.append("verify_token", token);
            formData.append("new_password", password1);
            const plainFormData = Object.fromEntries(formData.entries());
            fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/password", {
                method: "PUT",
                body: JSON.stringify(plainFormData),
                headers: {
                  "Content-Type": "application/json",
                },
            }).then((res) => {
                if (res.status === 200) {
                    toast({
                        title: "Success",
                        description: "Your password is changed.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    });
                    sessionStorage.removeItem("verify_token");
                    router.push("/login");
                }
            })
        } else {
            toast({
                title: "Error",
                description: "The passwords don't match. Please try again.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        setIsLoading(false)
    };

    return (
        <Flex bg="white">
            <Box w="50%" h='100%' pr="20px" pl="20px">
                <VStack>
                    <NavigationBar colorMode={colorMode}/>

                    <VStack pt = "100px" spacing ="10px" alignItems="left"
                    alignContent="left"
                    textAlign="left">
                    <Text lineHeight="1.3" fontWeight="bold" fontSize="32px" color="#40DDCF" >
                    Reset your password
                    </Text>
                    <Text
                    lineHeight="1.4"
                    fontWeight="bold"
                    fontSize="14px"
                    color="#A0AEC0"
                    maxWidth="100%"
                    textAlign="left"
                    >
                    Please set a new password for your account.
                    </Text>
                    <form onSubmit={handleSubmit}>
                        <FormControl>
                            <FormLabel htmlFor="password1"fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" >New password</FormLabel>
                            <Input
                                w = "300px"
                                placeholder='New password'
                                fontSize="12px"
                                type="password"
                                id="password1"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                            />
                        </FormControl>
                    <FormControl>
                    <FormLabel htmlFor="password2" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" >Confirm new password</FormLabel>
                    <Input
                        w = "300px"
                        placeholder='Confirm new password'
                        fontSize="12px"
                        type="password"
                        id="password2"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
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
                        width="202.5px"
                        height="19.5px"
                    >
                    <Box as="span" fontWeight="bold" color="#40DDCF">
                    <Link fontSize="sm" href="/login">Return to login</Link>
                    </Box>
                    </Text>
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
