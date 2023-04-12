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
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { CompanyIntro } from "@/components/companyintro";
import { NavigationBar } from "@/components/navigationbar";
import { useAuth } from "@/utils/hooks/useAuth";

export default function LoginPage() {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const toast = useToast();

  const { authStatus } = useAuth();

  // useEffect(() => {
  //   if (authStatus === "auth") router.push("/");
  // }, [authStatus, router]);

  const handleSubmit = (e) => {
    setIsLoading(true);
    setErrMsg("");
    e.preventDefault();
    if (email === "" || password === "") {
      toast({
        title: "Error",
        description: "Email and password are required.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      // handle login
      let formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      fetch(process.env.NEXT_PUBLIC_SERVER + "login", {
        body: formData,
        method: "POST",
      })
        .then((res) => {
          if (res.status === 200) {
            res.json().then((result) => {
              console.log(result);
              const token = result.access_token;
              // TODO: change to session logic, localStorage is bad practice!
              localStorage.setItem("accessToken", token);
              router.push("/profile");
            });
          } else if (res.status === 401) {
            setErrMsg("Invalid email or password");
            console.log("Invalid email or password");
          } else {
            console.log(res.json());
          }
        })
        .catch((err) => console.log("Error: ", err));
    }
    setIsLoading(false);
  };
  if (authStatus=="auth"){
    router.push("/profile");
  } else{
    
  return (
    <Flex bg = "white" height ="100vh">
      <Box w="50%" h="100%" bg="white">
        <VStack>
          <NavigationBar colorMode={colorMode} />

          <VStack
            pt="100px"
            spacing="10px"
            alignItems="left"
            alignContent="left"
            textAlign="left"
          >
            <Text
              lineHeight="1.3"
              fontWeight="bold"
              fontSize="32px"
              color="#40DDCF"
            >
              Welcome Back
            </Text>
            <Text
              lineHeight="1.4"
              fontWeight="bold"
              fontSize="14px"
              color="#A0AEC0"
              maxWidth="100%"
              textAlign="left"
            >
              Enter your email and password to sign in
            </Text>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel
                  htmlFor="username"
                  fontFamily="Helvetica"
                  lineHeight="1.4"
                  fontSize="14px"
                  color="Gray.Gray-700"
                  width="35.5px"
                  height="19.5px"
                >
                  Email
                </FormLabel>
                <Input
                  w="300px"
                  placeholder="Your email address"
                  fontSize="12px"
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel
                  htmlFor="password"
                  fontFamily="Helvetica"
                  lineHeight="1.4"
                  fontSize="14px"
                  color="Gray.Gray-700"
                >
                  Password
                </FormLabel>
                <Input
                  w="300px"
                  placeholder="Your password"
                  fontSize="12px"
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </form>
            <Text color="red" fontSize="sm">
              {errMsg}
            </Text>
            <Text
              fontFamily="Helvetica"
              lineHeight="1.4"
              fontWeight="regular"
              fontSize="14px"
              color="Gray.Gray-400"
              width="237px"
              height="20px"
            >
              <span>Forgot password? </span>
              <Box as="span" fontWeight="bold" color="#40DDCF">
                <Link fontSize="sm" href="/resetpw">
                  Reset Password
                </Link>
              </Box>
            </Text>
            <Spacer />
            <Button
              type="submit"
              bg="cyanAlpha"
              color="white"
              variant="solid"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Sign in
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
              <span>{"Don't have an account?"} </span>
              <Box as="span" fontWeight="bold" color="#40DDCF">
                <Link fontSize="sm" href="/register">
                  Sign up
                </Link>
              </Box>
            </Text>
          </VStack>
        </VStack>
      </Box>
      <Spacer />
      <CompanyIntro colorMode={colorMode} />
    </Flex>
  );
}
}
