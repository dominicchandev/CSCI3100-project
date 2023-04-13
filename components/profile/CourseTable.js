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
  Spacer,
  Button,
  Flex,
  useToast
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
};

/**
 *
 * courses: [course]
 *
 * @param {*} props
 * @returns
 */
export function CourseTable(props) {
  const courses = props.courses;
  const onChange = props.onChange;
  const title = props.title;
  const [isDropping, setIsDropping] = useState(false)
  const { token, authStatus, refreshAuthData} = useAuth();
  const [selectedCourses, setSelectedCourses] = useState(new Set())
  const [dropped, setDropped] = useState(false);
  const toast = useToast();


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
    if (authStatus === "auth" && isDropping === true) {
      var data = Array.from(selectedCourses);
      fetch(process.env.NEXT_PUBLIC_SERVER + "api/users/dropCourse", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          toast({
            title: 'Course dropped.',
            description: "The courses are dropped",
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      }).finally(() => {
      setIsDropping(false);
      setDropped(true);
      }
      )
    }
  }, [authStatus, isDropping])

  useEffect(() => {
    if (authStatus === "auth" && dropped ==true) {
      refreshAuthData();
      setDropped(false);
    }
  }, [dropped, authStatus])


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
          <CourseTableHeadRow />
          <Tbody>
            {courses.map((course) => (
              <CourseTableRow
                key={`course-table-row-${course.id}`}
                course={course}
                onChange={handleCheckboxChange}
              />
            ))}
          </Tbody>
        </Table>
        <Flex justify="flex-end" pb="15px" pt = "15px" pr = "15px">
            <Button
              onClick={() => setIsDropping(true)}
              fontSize="sm"
              type="submit"
              bg="cyanAlpha"
              color="white"
              variant="solid"
              // isLoading={isLoading}
            >
              Confirm Drop Course(s)
            </Button>
          </Flex>
      </TableContainer>
    </>
  );
}
}

function CourseTableHeadRow() {
  return (
    <Thead>
      <Tr>
        <Th {...TH_STYLE}>COURSE ID</Th>
        <Th {...TH_STYLE}>COURSE NAME</Th>
        <Th {...TH_STYLE}>INSTRUCTOR</Th>
        <Th {...TH_STYLE}>DEPARTMENT</Th>
        <Th {...TH_STYLE} style={{minWidth: "100px"}}>TIME</Th>
        <Th {...TH_STYLE}>LOCATION</Th>
        <Th {...TH_STYLE}>DROP COURSE</Th>
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
export function CourseTableRow(props) {
  const course = props.course;
  const onChange = props.onChange;
  const { id, name, instructor, department, schedule } = course;
  const formattedSchedule = convertSchedule(schedule);
  const times = formattedSchedule.map((schedule) => {
    return schedule.time;
  });
  const locations = formattedSchedule.map((schedule) => {
    return schedule.location;
  });
  return (
    <Tr w="full">
      <ColumnElem content={id} />
      <ColumnElem content={name} />
      <ColumnElem content={instructor} />
      <ColumnElem content={department} />
      <ColumnElem content={times} />
      <ColumnElem content={locations} />
      <Td textAlign="center">
        <Checkbox 
          value={id}
          onChange={onChange}
        />
      </Td>
    </Tr>
  );

  function ColumnElem(props) {
    const { content } = props;
    if (typeof content === "string")
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
