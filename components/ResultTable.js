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
  whiteSpace:"normal",
  wordBreak:"break-word"
};


/**
 *
 * courses: [course]
 *
 * @param {*} props
 * @returns
 */

export function ResultTable(props) {
  const { courses } = props;
  const { title } = props;
  const { isLoading } = props;
  const { status } = props;
  const toast = useToast();
  const { token, authStatus} = useAuth();
  const [selectedCourses, setSelectedCourses] = useState(new Set())
  const [isRegistering, setIsRegistering] = useState(false)

  console.log("HI");
  

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
                // console.log("HI");
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
              console.log("HI");
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
      <Table variant="simple" layout="fixed" overflowWrap="anywhere">
        <ResultTableHeadRow />
        <Tbody>
        {courses.map((course) => (
            <ResultTableRow
              key={`course-table-row-${course.id}`}
              course={course}
              onChange={handleCheckboxChange}
            />
          ))}
        </Tbody>
        <Flex justify="flex-end" pb="10px">
                  <Button
                    onClick={() => setIsRegistering(true)}
                    type="submit"
                    bg="cyanAlpha"
                    color="white"
                    variant="solid"
                  >
                    Submit Registration
                  </Button>
                </Flex>
      </Table>
    </TableContainer>
  );
}
}



function ResultTableHeadRow() {
  return (
    <Thead>
      <Tr>
        <Th {...TH_STYLE}>COURSE ID</Th>
        <Th {...TH_STYLE}>COURSE NAME</Th>
        <Th {...TH_STYLE}>INSTRUCTOR</Th>
        <Th {...TH_STYLE}>DEPARTMENT</Th>
        <Th {...TH_STYLE}>TIME</Th>
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
export function ResultTableRow(props) {
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

  const handleOnClick = (e) => {
    console.log(outline)
    if (outline == "Not available yet") {
      toast({
        title: "Error",
        description: `Course outline of ${id} is not available yet`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      window.open({outline}, "_blank")
  };
  }

  return (
    <Tr w="full">
      <ColumnElem content={id} />
      <ColumnElem content={name} />
      <ColumnElem content={instructor} />
      <ColumnElem content={department} />
      <ColumnElem content={times} />
      <ColumnElem content={locations} />
      <ColumnElem content={String(available_seats)} />
      <ColumnElem content={String(capacity)} />
      <Td textAlign="center">
        <Button value={`outline-${id}`} onClick={handleOnClick} variant="outline" fontSize="10px" color="#40DDCF">VIEW</Button>
      </Td>
      <Td textAlign="center">
        <Checkbox value={id} onChange={onChange}></Checkbox>
      </Td>
    </Tr>
  );

  function ColumnElem(props) {
    const { content } = props;
    console.log("ERRR");
    console.log(content);
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
