import {
    Checkbox,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    Button,
    useToast,
    Link,
    Spacer,
    Flex,
    useColorModeValue,
    useColorMode,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import { useAuth } from "@/utils/hooks/useAuth";
  
  
  // CONSTS (don't repeat yourself!)
  const TH_STYLE = {
    fontFamily: "Helvetica",
    lineHeight: "1.5",
    fontWeight: "bold",
    fontSize: "10px",
    color: "#A0AEC0",
    whiteSpace:"nowrap",
    wordBreak:"break-word",
  };
  
  
  /**
   *
   * courses: [course]
   *
   * @param {*} props
   * @returns
   */
  
  export function AdminResultTable(props) {
    const { courses } = props;
    const { title } = props;
    const { isLoading } = props;
    // const { status } = props;
    const toast = useToast();
    const { token, authStatus} = useAuth();
    const [selectedCourses, setSelectedCourses] = useState(new Set())
    const [isRegistering, setIsRegistering] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false);
  
    const boxColor = useColorModeValue("whitePure", "darkAlpha")

  
    const handleCheckboxChange = (e) => {
    e.preventDefault();
    if (e.target.checked) {
      setSelectedCourses(prev => new Set(prev.add(e.target.value)))
    }
    else {
      setSelectedCourses(prev => new Set([...prev].filter(x => x !== e.target.value)))
    }
    }
  
    useEffect(() => {
      if (authStatus === "auth" && isDeleting === true) {
        var dataArray = Array.from(selectedCourses);
        dataArray.forEach(async (element) => {
          await fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/" + element, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            },
          }).then((res) => {
            if (res.status === 200) {
              toast({
                title: 'Course ' + element + ' deleted.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
            }
            else {
              toast({
                title: 'Failed to delete Course ' + element,
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
            }
          }).finally(() => {
            setIsDeleting(false);
          })
        })
      }
    }, [authStatus, isDeleting])

    useEffect(() => {
      if (authStatus === "auth" && isRegistering === true) {
        var data = Array.from(selectedCourses);
        fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/registerCourse", {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          if (res.status === 200) {
            res.json().then((result) => {
            console.log(result);
            const { successful, failed } = result;
            if (result.successful!=undefined && result.failed == undefined){
              console.log(result.successful);
              successful.map((courses) => (
                toast({
                title: "Success",
                description: `Course ${courses} has been registered successfully.`,
                status: "success",
                duration: 9000,
                isClosable: true,
              })
              ))
            }
            if (result.successful==undefined && result.failed != undefined){
                 console.log(result.failed);
                // console.log(Object.keys(failed));
                {Object.keys(failed).map((errorType) => {
                  const failedCourses = failed[errorType];
                  // console.log(errorType);
                  // console.log(failedCourses);
                  if (failedCourses.length !== 0){
                    {failedCourses.map((courseCode) => (
                    toast({
                      title: "Error",
                      description: `Course ${courseCode} cannot be added. Reason: ${errorType}`,
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    })
                    ))};
                    }else{}
                  })
                  }
                }
            if (result.successful!=undefined && result.failed != undefined){
              {Object.keys(failed).map((errorType) => {
                const failedCourses = failed[errorType];
                console.log(errorType);
                console.log(failedCourses);
                if (failedCourses.length === 0){
                  {failedCourses.map((courseCode) => (
                  toast({
                    title: "Failed",
                    description: `Course ${courseCode} cannot be added. Reason: ${errorType}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  })
                  ))};
                  };
                })
                }
            successful.map((courses) => (
              toast({
              title: "Success",
              description: `Course ${courses} has been registered successfully.`,
              status: "success",
              duration: 9000,
              isClosable: true,
            })
            ))
          }
            }
            )}
        }).finally(() => {
          setIsRegistering(false);
        })
      }
    }, [authStatus, isRegistering])
  
    
  
    if (courses.length===0){
      return(
        <></>
      );
    } else{
    return (
      <>    
        <TableContainer background={boxColor} borderRadius="15px" pt = "15px" pl = "15px">
          <Text
            fontFamily="Helvetica"
            lineHeight="1.4"
            fontWeight="bold"
            fontSize="18px"
            color="Gray.Gray-700"
            width="181px"
            height="25px"
          >{title}</Text>
          <Spacer/>
          <Table variant="simple">
            <AdminResultTableHeadRow />
            <Tbody>
            {courses.map((course) => (
                <AdminResultTableRow
                  key={`course-table-row-${course.id}`}
                  course={course}
                  onChange={handleCheckboxChange}
                />
              ))}
  
                <Tr w="full">
                {[...Array(9)].map((_, i) => (
                  <Td key={i}></Td>
                ))}
                  <Td>
                    <Button
                      onClick={() => setIsRegistering(true)}
                      type="submit"
                      bg="teal"
                      color="white"
                      variant="solid"
                      fontSize="sm"
                      isLoading={isRegistering}
                    >
                      Submit Registration
                    </Button>
                  </Td>
                </Tr>

                <Tr w="full">
                {[...Array(9)].map((_, i) => (
                  <Td key={i}></Td>
                ))}
                  <Td>
                    <Button
                      onClick={() => setIsDeleting(true)}
                      fontSize="14px"
                      type="submit"
                      bg="teal"
                      color="white"
                      variant="solid"
                      isLoading={isDeleting}
                    >
                      Confirm Delete Course
                    </Button>
                  </Td>
                </Tr>

            </Tbody>
          </Table>
          {/* <Flex justify="flex-end" pb="15px" pt = "15px" pr = "15px">
        <Button
          onClick={() => setIsRegistering(true)}
          type="submit"
          bg="teal"
          color="white"
          variant="solid"
          fontSize="sm"
          isLoading={isRegistering}
        >
          Submit Registration
        </Button>
        </Flex> */}
        </TableContainer>
      </>
    );
  }
  }
  
  
  
  function AdminResultTableHeadRow() {
    return (
      <Thead>
        <Tr>
          <Th {...TH_STYLE}>COURSE ID</Th>
          <Th {...TH_STYLE}>COURSE NAME</Th>
          <Th {...TH_STYLE}>INSTRUCTOR</Th>
          <Th {...TH_STYLE}>DEPARTMENT</Th>
          <Th {...TH_STYLE} style={{ minWidth: "100px" }}>TIME</Th>
          <Th {...TH_STYLE}>LOCATION</Th>
          <Th {...TH_STYLE}>CAPACITY</Th>
          <Th {...TH_STYLE}>ENROLLED</Th>
          <Th {...TH_STYLE}>COURSE OUTLINE</Th>
          <Th {...TH_STYLE}>REGISTER/ DELETE COURSE</Th>
        </Tr>
      </Thead>
    );
  }
  
  /**
   *
   * course:
   *  id: string
   *  name: string
   *  instructor: string
   *  department: string
   *  schedule: {"Monday": {"Shaw College LT": ["11:30", "12:15"]}, "Tuesday": {"Lee Shau Kee Building LT5": ["08:30", "10:15"]}}
   *
   * @param {*} props
   * @returns
   */
  export function AdminResultTableRow(props) {
    const { course } = props;
    const onChange = props.onChange;  
    const { id, name, instructor, department, schedule, available_seats, capacity, outline } = course;
    const formattedSchedule = convertSchedule(schedule);
    const times = formattedSchedule.map((schedule) => {
      return schedule.time;
    });
    const locations = formattedSchedule.map((schedule) => {
      return schedule.location;
    });
    const toast = useToast();
    const { token, authStatus} = useAuth();
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const allowedFiles = ['application/pdf'];
    const handleChange = (e) => {
        if (e.target.files) {
            let selectedFile = e.target.files[0];
		    if (selectedFile && allowedFiles.includes(selectedFile.type)){
                setPdfFile(selectedFile);
            } else {
                setPdfError('Not PDF. Pleases select a PDF.');
            }
        }
	};

    const handleUpload = (e) => {
        if (pdfError != ''){
            toast({
                title: "Error",
                description: pdfError,
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } else if (!pdfFile){
            toast({
                title: "Error",
                description: "No file is selected",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }else{
            let formData = new FormData();
            formData.append("course_outline", pdfFile, pdfFile.name);
            setIsUploading(true);
            fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/outline", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }).then((res) => {
                if (res.status === 200) {
                    toast({
                        title: "Success",
                        description: "Course outline has been uploaded successfully.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "Unable to upload course outline.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    });
                }
            }).finally(() => {
              setIsUploading(false);
            });
        }
    };
  
    return (
      <Tr w="full">
        <ColumnElem content={id} />
        <ColumnElem content={name} />
        <ColumnElem content={instructor} />
        <ColumnElem content={department} />
        <ColumnElem content={times}/>
        <ColumnElem content={locations} />
        <ColumnElem content={String(available_seats)} />
        <ColumnElem content={String(capacity)} />
        <Td textAlign="center">
            <input type="file" className="form-control"
            onChange={handleChange}></input>
            <Button colorScheme = 'teal' onClick={handleUpload} value={id} isLoading={isUploading}>Upload</Button>
        </Td>
        <Td textAlign="center">
          <Checkbox value={id} onChange={onChange} colorScheme = 'teal' ></Checkbox>
        </Td>
      </Tr>
    );
  
    function ColumnElem(props) {
      const { content } = props;
      const { colorMode, toggleColorMode } = useColorMode();

      if (typeof content === "string" || typeof content === "int" )
        return (
          <Td
            fontFamily="Helvetica"
            lineHeight="1.4"
            fontWeight="bold"
            fontSize="12px"
            whiteSpace="normal"
            wordBreak="break-word"
            color= {colorMode === 'light'? "greyLight" : "greyDark"}

          >
            {content}
          </Td>
        );
      
      // Assume content is of type array of string:
      return (
        <Td
          fontFamily="Helvetica"
          lineHeight="1.4"
          fontWeight="bold"
          fontSize="12px"
          color= {colorMode === 'light'? "greyLight" : "greyDark"}
          whiteSpace="normal"
          wordBreak="break-word"
        >
          <VStack align="flex-start">
            {content.map((text) => (
              <Text key={text}>{text}</Text>
            ))}
          </VStack>
        </Td>
      );
    }
  }
  
  /*
  Sample output:
  [
      {
          "time": "Mo 11:30AM - 12:15PM",
          "location": "Shaw College LT"
      },
      {
          "time": "Tu 8:30AM - 10:15AM",
          "location": "Lee Shau Kee Building LT5"
      }
  ]
  */
  function convertSchedule(schedule) {
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
    return Object.keys(schedule).reduce((result, day) => {
      const daySchedule = schedule[day];
  
      Object.keys(daySchedule).forEach((location) => {
        const [start, end] = daySchedule[location];
        const startHour = parseInt(start.split(":")[0]);
        const startMinute = parseInt(start.split(":")[1]);
        const endHour = parseInt(end.split(":")[0]);
        const endMinute = parseInt(end.split(":")[1]);
  
        const formattedStart = `${
          daysOfWeek.indexOf(day) !== -1
            ? daysOfWeek[daysOfWeek.indexOf(day)] + " "
            : ""
        }${startHour % 12 || 12}:${startMinute.toString().padStart(2, "0")}${
          startHour >= 12 ? "PM" : "AM"
        }`;
        const formattedEnd = `${endHour % 12 || 12}:${endMinute
          .toString()
          .padStart(2, "0")}${endHour >= 12 ? "PM" : "AM"}`;
  
        result.push({
          time: `${day.slice(0, 2)} ${formattedStart} - ${formattedEnd}`,
          location,
        });
      });
  
      return result;
    }, []);
  }
  