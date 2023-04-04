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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useRef } from "react";

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const toast = useToast();

    const handleSubmit = (e) => {
        setIsLoading(true)
        setErrMsg("")
        e.preventDefault();
        if (email === "" || password === "") {
            toast({
                title: "Error",
                description: "email and password are required.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else {
            // handle login
            let formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);
            fetch(
                process.env.NEXT_PUBLIC_SERVER + 'login',
                {
                    body: formData,
                    method: 'POST',
                }
            )
                .then((res) => {
                    if (res.status === 200) {
                        console.log("Valid user");
                        router.push("/")
                    }
                    else if (res.status === 401) {
                        setErrMsg("Invalid email or password")
                        console.log("Invalid email or password");
                    }
                    else {
                        console.log(res.json())
                    }
                }
                )
                .catch((err) => console.log("Error: ", err))
        }
        setIsLoading(false)
    };

    return (
        <Box>
            <Modal
                size="lg"
                isOpen={true}
                closeOnOverlayClick={false}
                scrollBehavior="inside"
                onClose={() => { return; }}
                isCentered
                isClosable={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Login</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <FormControl>
                                    <FormLabel htmlFor="username">Email</FormLabel>
                                    <Input
                                        type="text"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password">Password</FormLabel>
                                    <Input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>
                            </Stack>
                        </form>
                        <Text color="red" fontSize="sm">{errMsg}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Link fontSize="sm" href="/register">Register here</Link>
                        <Spacer />
                        <Button type="submit" variantColor="teal" onClick={handleSubmit} isLoading={isLoading}>
                            Login
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
};
