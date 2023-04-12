import {
    Box,
    Text,
    Center,
    Table, Thead, Tr, Th, Tbody
} from "@chakra-ui/react";
import { useEffect } from "react";


export function Schedule(props) {
   const courses = props.courses;
   const startTime = new Date(0, 0, 0, 8, 0, 0, 0);

   
   function getRowTime(rowNumber) {
       const rowTime = new Date(startTime.getTime() + (rowNumber * 30 * 60 * 1000));
       const hours = rowTime.getHours().toString().padStart(2, '0');
       const minutes = rowTime.getMinutes().toString().padStart(2, '0');
       return `${hours}:${minutes}`;
    };
    
    function getRowNumber(rowTime) {
        const timeParts = rowTime.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const rowDate = new Date(0, 0, 0, hours, minutes, 0, 0);
        const rowNumber = (rowDate.getTime() - startTime.getTime()) / (30 * 60 * 1000);
        return Math.floor(rowNumber);
    };

    function handleCourse(course) {
        const courseId = course['id'];
        console.log(courseId)
        const schedule = course['schedule']
        for (let day in schedule) {
            const locations = schedule[day];
            for (let location in locations) {
                const classTime = locations[location];
                const startTime = classTime[0];
                const endTime = classTime[1];

                const startRowNum = getRowNumber(startTime);
                const endRowNum = getRowNumber(endTime)
                for (let i = startRowNum; i <= endRowNum; i++) {
                    const thElement = document.getElementById(`${day}${getRowTime(i)}`);
                    if (thElement) {
                        thElement.style.backgroundColor = "#40DDCF";
                        thElement.innerHTML = `<Center><Text>${courseId}<br />${location}</Text></Center>`;
                    }
                }
            }
        }
    }


    useEffect(() => {
        if (courses) {
            courses.map((course) => handleCourse(course))
        }
    }, [courses])

   return (
    <Box sx={{ borderCollapse: "collapse" }} width="100%">
        <Table>
        <Thead>
            <Tr>
            <Th></Th>
            <Th>Monday</Th>
            <Th>Tuesday</Th>
            <Th>Wednesday</Th>
            <Th>Thursday</Th>
            <Th>Friday</Th>
            </Tr>
        </Thead>
        <Tbody>
            {[...Array(24)].map((_, i) => (
            <Tr key={i}>
                <Th>{getRowTime(i)}</Th>
                <Th id={`Monday${getRowTime(i)}`} sx={{ border: "1px solid" }}></Th>
                <Th id={`Tuesday${getRowTime(i)}`} sx={{ border: "1px solid" }}></Th>
                <Th id={`Wednesday${getRowTime(i)}`} sx={{ border: "1px solid" }}></Th>
                <Th id={`Thursday${getRowTime(i)}`} sx={{ border: "1px solid" }}></Th>
                <Th id={`Friday${getRowTime(i)}`} sx={{ border: "1px solid" }}></Th>
            </Tr>
            ))}
        </Tbody>
        </Table>
  </Box>
   )
};