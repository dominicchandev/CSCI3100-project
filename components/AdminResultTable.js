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
    const { status } = props;
    const toast = useToast();
    const { token, authStatus} = useAuth();
    const [selectedCourses, setSelectedCourses] = useState(new Set())
    const [isRegistering, setIsRegistering] = useState(false)
  
  
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
          })
            // router.push("/");
        setIsRegistering(false);
      }
    }, [authStatus, isRegistering])
  
    
  
    if (courses.length===0){
      return(
        <></>
      );
    } else{
    return (
      <>    
        <TableContainer background="#FFFFFF" borderRadius="15px" pt = "15px" pl = "15px">
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
                      bg="cyanAlpha"
                      color="white"
                      variant="solid"
                      fontSize="sm"
                    >
                      Submit Registration
                    </Button>
                  </Td>
                </Tr>
            </Tbody>
          </Table>
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
          <Th {...TH_STYLE}>REGISTER COURSE</Th>
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
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfError, setPdfError] = useState('');
    const allowedFiles = ['application/pdf'];
    const handleChange = (e) => {
        let selectedFile = e.target.files[0];
		if (selectedFile && allowedFiles.includes(selectedFile.type)){
            let reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onloadend = (e) => {
                setPdfError('');
                setPdfFile(e.target.result);
            };

        } else {
            setPdfError('Not PDF. Pleases select a PDF.');
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
            fetch(pdfFile)
            .then(res => res.blob())
            .then(blob => {
                fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses/outline", {
                    method: "POST",
                    body: blob,
                    headers: {
                      "Content-Type": "multipart/form-data",
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
                });
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
            <Button onClick={handleUpload} value={id}>Upload</Button>
        </Td>
        <Td textAlign="center">
          <Checkbox value={id} onChange={onChange}></Checkbox>
        </Td>
      </Tr>
    );
  
    function ColumnElem(props) {
      const { content } = props;
    //   console.log("ERRR");
    //   console.log(content);
      if (typeof content === "string" || typeof content === "int" )
        return (
          <Td
            fontFamily="Helvetica"
            lineHeight="1.4"
            fontWeight="bold"
            fontSize="12px"
            color="#2D3748"
            whiteSpace="normal"
            wordBreak="break-word"
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
          color="#2D3748"
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
  