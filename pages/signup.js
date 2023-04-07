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
  Flex,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useRef } from "react";
import { NavigationBar } from "@/components/navigationbar";

export default function SignUpPage() {
  const { colorMode } = useColorMode();
  const router = useRouter()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const toast = useToast();

  const handleSubmit = (e) => {
      setIsLoading(true)
      setErrMsg("")
      e.preventDefault();
      if (email === "" || password === "" || name ==="") {
          toast({
              title: "Error",
              description: "Name, email and password are required.",
              status: "error",
              duration: 9000,
              isClosable: true,
          });
      } else {
          // handle login
          let formData = new FormData();
          formData.append('name', name);
          formData.append('username', email);
          formData.append('password', password);
          fetch(
              process.env.NEXT_PUBLIC_SERVER + '/register',
              {
                  body: formData,
                  method: 'POST',
              }
          )
              .then((res) => {
                  if (res.status === 200) {
                      console.log("New user");
                      router.push("/")
                  }
                  else if (res.status === 401) {
                      setErrMsg("Invalid registration")
                      console.log("Invalid registration");
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
            <VStack>
                <VStack mt="10px" ml = "10px" mr="10px" pt= "10px" spacing="15px" bg = "#40DDCF" w = "100%" h = "350px" borderRadius="15px">
                <NavigationBar colorMode={colorMode}/>
                <Spacer/>
                <Text lineHeight="1.3" fontWeight="bold" fontSize="32px" color="White" textAlign="center">
                Welcome!
                </Text>
                <Text
                  lineHeight="1.4"
                  fontWeight="regular"
                  fontSize="14px"
                  color="White"
                  maxWidth="100%"
                  textAlign="center"
                  width="399px"
                  height="85px"
                >
                  The best course registration system to facilitate the process of
                  searching, registering and dropping courses. Start your academic term with
                  a wonderful course management experience with us:)
                </Text>

                <VStack pb="20px" pt="25px" spacing="10px" bg = "white" w = "370px" h = "460px" borderRadius="15px" mt = "15px">
                  <form onSubmit={handleSubmit}>
                    <Text
                    lineHeight="1.4"
                    fontWeight="bold"
                    fontSize="18px"
                    color="Gray.Gray-700"
                    width="100%"
                    height="25px"
                    textAlign="center"
                    mt="10px"
                    >
                    Register with
                    </Text>
                    <Spacer/>
                     <FormControl>
                        <FormLabel htmlFor="name"fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" mt = "30px">Name</FormLabel>
                              <Input
                                  placeholder='Your full name'
                                  fontSize="12px"
                                  type="text"
                                  id="name"
                                  w = "240px"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  mb = "10px"
                              />
                          </FormControl>

                          <FormControl>
                            <FormLabel htmlFor="username"fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" >Email</FormLabel>
                                <Input
                                    placeholder='Your email address'
                                    fontSize="12px"
                                    type="text"
                                    id="email"
                                    w="240px"
                                    mb = "10px"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                          </FormControl>
                      <FormControl>
                      <FormLabel htmlFor="password" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700" >Password</FormLabel>
                      <Input
                          placeholder='Your password'
                          fontSize="12px"
                          type="password"
                          id="password"
                          mb = "10px"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                      </FormControl>
                      </form>
                          <Text color="red" fontSize="sm">{errMsg}</Text>
                        <Button type="submit" bg="cyanAlpha" color= "white" onClick={handleSubmit} isLoading={isLoading} variant="solid" w = "240px" >
                        Sign Up
                        </Button>
                      <Text
                          fontFamily="Helvetica"
                          lineHeight="1.4"
                          fontWeight="regular"
                          fontSize="14px"
                          color="#A0AEC0"
                          width="237px"
                          height="20px"
                          textAlign="center"
                      >
                      <span>Already have an account? </span>
                      <Box as="span" fontWeight="bold" color="#40DDCF">
                      <Link fontSize="sm" href="/logintest">Sign In</Link>
                      </Box>
                      </Text>
                      </VStack>
                      </VStack>
                      </VStack>
      </Box>
  );
};
