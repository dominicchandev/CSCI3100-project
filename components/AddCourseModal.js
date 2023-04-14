import { 
    Flex, 
    Button, 
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogCloseButton,
    AlertDialogOverlay,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    useToast
    } from '@chakra-ui/react'
  import { useEffect, useRef, useState } from "react";
  import { useAuth } from '@/utils/hooks/useAuth';


  export function AddCourseModal(props) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;

    const [isLoading, setIsLoading] = useState(false);
    const [newCourseid, setNewCourseid] = useState("");
    const [newCoursename, setNewCoursename] = useState("");
    const [newDay, setNewDay] = useState("");
    const [newStarttime, setNewStarttime] = useState("");
    const [newEndtime, setNewEndtime] = useState("");
    const [newPlace, setNewPlace] = useState("");
    const [newDay2, setNewDay2] = useState("");
    const [newStarttime2, setNewStarttime2] = useState("");
    const [newEndtime2, setNewEndtime2] = useState("");
    const [newPlace2, setNewPlace2] = useState("");
    const [newDept, setNewDept] = useState("");
    const [newInstructor, setNewInstructor] = useState("");
    const [newCapacity, setNewCapacity] = useState(0);
    const { token } = useAuth()
    const toast = useToast();
    const cancelRef = useRef();

    function getNewSchedule() {
        const newSchedule = new Object();
        const class_time = new Object();
        class_time[newPlace] = [newStarttime, newEndtime];
        newSchedule[newDay] = class_time;

        if (newDay2 !== "" && newDay !== newDay2) {
            const class_time2 = new Object();
            class_time2[newPlace2] = [newStarttime2, newEndtime2];
            newSchedule[newDay2] = class_time2;
        }

        if (newDay === newDay2) {
            const class_time2 = new Object();
            class_time2[newPlace2] = [newStarttime2, newEndtime2];
            newSchedule[newDay] = class_time2;
        }
        
        return newSchedule
    }

    function convertData() {
        const newSchedule = getNewSchedule()
        const data = {
            "id": newCourseid,
            "name": newCoursename,
            "start_date": "2023-01-09",
            "end_date": "2023-04-20",
            "department": newDept,
            "instructor": newInstructor,
            "capacity": newCapacity,
            "available_seats": newCapacity,
            "schedule": newSchedule,
        }

        return data
    }

    useEffect(() => {
        if(isLoading) {
            const data = convertData()
            console.log(JSON.stringify(data))
            fetch(process.env.NEXT_PUBLIC_SERVER + "api/courses", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if(res.status === 200) {
                    res.json();
                    toast({
                        title: "Success",
                        description: `Course ${newCourseid} has been created successfully.`,
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    setNewCourseid("");
                    setNewCoursename("");
                    setNewDay("");
                    setNewStarttime("");
                    setNewEndtime("");
                    setNewPlace("");
                    setNewDay2("");
                    setNewStarttime2("");
                    setNewEndtime2("");
                    setNewPlace2("");
                    setNewDept("");
                    setNewInstructor("");
                    setNewCapacity(0);
                }
                else if (res.status === 400){
                    toast({
                        title: "Failed",
                        description: `Course ${newCourseid} already exists`,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
                else {
                    toast({
                        title: "Failed",
                        description: `Failed to create Course ${newCourseid}`,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                }
            })
            .catch((err) => {
                toast({
                    title: "Error",
                    description: `Failed to create Course ${newCourseid} deal to ${err}`,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            })
            .finally(() => {
                
                setIsLoading(false)
            })
            // setIsLoading(false)
        }
    }, [isLoading])
    return (
        <AlertDialog
        motionPreset='slideInBottom'
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        >
        <AlertDialogOverlay />
        <AlertDialogContent>
        <AlertDialogHeader>Add Course</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>
        <Text>Fill in the new course information to add a new course.</Text>
        <form>
            <FormControl isRequired>
            <Flex alignItems="center" mt="30px">
            <FormLabel htmlFor="newCourseid" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Course ID</FormLabel>
            <Input
                placeholder="New Course ID"
                fontSize="12px"
                type="text"
                id="newCourseid"
                value={newCourseid}
                onChange={(e) => setNewCourseid(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newCoursename" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Course Name</FormLabel>
            <Input
                placeholder="New course name"
                fontSize="12px"
                type="text"
                id="newCoursename"
                value={newCoursename}
                onChange={(e) => setNewCoursename(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newDept" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Department</FormLabel>
            <Input
                placeholder="New course department"
                fontSize="12px"
                type="text"
                id="newDept"
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newTime" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Time</FormLabel>
            <Select placeholder = "Select option" id="newDay" fontSize="12px" color="#808EA0" value={newDay} onChange={(e) => setNewDay(e.target.value)}>
                <option value = 'Monday'> Monday </option>
                <option value = 'Tuesday'> Tuesday </option>
                <option value = 'Wednesday'> Wednesday </option>
                <option value = 'Thursday'> Thursday </option>
                <option value = 'Friday'> Friday </option>
            </Select>
            <Select placeholder = "Select Start Time" id ="newStarttime" fontSize="12px" color="#808EA0" value={newStarttime} onChange={(e) => setNewStarttime(e.target.value)}>
                <option value = '08:00'> 08:00am </option>
                <option value = '08:30'> 08:30am </option>
                <option value = '09:00'> 09:00am </option>
                <option value = '09:30'> 09:30am </option>
                <option value = '10:00'> 10:00am </option>
                <option value = '10:30'> 10:30am </option>
                <option value = '11:00'> 11:00am </option>
                <option value = '11:30'> 11:30am </option>
                <option value = '12:00'> 12:00nn </option>
                <option value = '12:30'> 12:30pm </option>
                <option value = '13:00'> 01:00pm </option>
                <option value = '13:30'> 01:30pm </option>
                <option value = '14:00'> 02:00pm </option>
                <option value = '14:30'> 02:30pm </option>
                <option value = '15:00'> 03:00pm </option>
                <option value = '15:30'> 03:30pm </option>
                <option value = '16:00'> 04:00pm </option>
                <option value = '16:30'> 04:30pm </option>
                <option value = '17:00'> 05:00pm </option>
                <option value = '17:30'> 05:30pm </option>
                <option value = '18:00'> 06:00pm </option>
            </Select>
            <Select placeholder = "Select End Time" id ="newEndtime" fontSize="12px" color="#808EA0" value={newEndtime} onChange={(e) => setNewEndtime(e.target.value)}>
                <option value = '08:15'> 08:15am </option>
                <option value = '08:45'> 08:45am </option>
                <option value = '09:15'> 09:15am </option>
                <option value = '09:45'> 09:45am </option>
                <option value = '10:15'> 10:15am </option>
                <option value = '10:45'> 10:45am </option>
                <option value = '11:15'> 11:15am </option>
                <option value = '11:45'> 11:45am </option>
                <option value = '12:15'> 12:15pm </option>
                <option value = '12:45'> 12:45pm </option>
                <option value = '13:15'> 01:15pm </option>
                <option value = '13:45'> 01:45pm </option>
                <option value = '14:15'> 02:15pm </option>
                <option value = '14:45'> 02:45pm </option>
                <option value = '15:15'> 03:15pm </option>
                <option value = '15:45'> 03:45pm </option>
                <option value = '16:15'> 04:15pm </option>
                <option value = '16:45'> 04:45pm </option>
                <option value = '17:15'> 05:15pm </option>
                <option value = '17:45'> 05:45pm </option>
                <option value = '18:15'> 06:15pm </option>
            </Select>
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newPlace" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Place</FormLabel>
            <Input
                placeholder="New course place"
                fontSize="12px"
                type="text"
                id="newPlace"
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newTime2" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Time2</FormLabel>
            <Select placeholder = "Select option" id="newDay2" fontSize="12px" color="#808EA0" value={newDay2} onChange={(e) => setNewDay2(e.target.value)}>
                <option value = 'Monday'> Monday </option>
                <option value = 'Tuesday'> Tuesday </option>
                <option value = 'Wednesday'> Wednesday </option>
                <option value = 'Thursday'> Thursday </option>
                <option value = 'Friday'> Friday </option>
            </Select>
            <Select placeholder = "Select Start Time" id ="newStarttime2" fontSize="12px" color="#808EA0" value={newStarttime2} onChange={(e) => setNewStarttime2(e.target.value)}>
                <option value = '08:00'> 08:00am </option>
                <option value = '08:30'> 08:30am </option>
                <option value = '09:00'> 09:00am </option>
                <option value = '09:30'> 09:30am </option>
                <option value = '10:00'> 10:00am </option>
                <option value = '10:30'> 10:30am </option>
                <option value = '11:00'> 11:00am </option>
                <option value = '11:30'> 11:30am </option>
                <option value = '12:00'> 12:00nn </option>
                <option value = '12:30'> 12:30pm </option>
                <option value = '13:00'> 01:00pm </option>
                <option value = '13:30'> 01:30pm </option>
                <option value = '14:00'> 02:00pm </option>
                <option value = '14:30'> 02:30pm </option>
                <option value = '15:00'> 03:00pm </option>
                <option value = '15:30'> 03:30pm </option>
                <option value = '16:00'> 04:00pm </option>
                <option value = '16:30'> 04:30pm </option>
                <option value = '17:00'> 05:00pm </option>
                <option value = '17:30'> 05:30pm </option>
                <option value = '18:00'> 06:00pm </option>
            </Select>
            <Select placeholder = "Select End Time" id ="newEndtime2" fontSize="12px" color="#808EA0" value={newEndtime2} onChange={(e) => setNewEndtime2(e.target.value)}>
                <option value = '08:15'> 08:15am </option>
                <option value = '08:45'> 08:45am </option>
                <option value = '09:15'> 09:15am </option>
                <option value = '09:45'> 09:45am </option>
                <option value = '10:15'> 10:15am </option>
                <option value = '10:45'> 10:45am </option>
                <option value = '11:15'> 11:15am </option>
                <option value = '11:45'> 11:45am </option>
                <option value = '12:15'> 12:15pm </option>
                <option value = '12:45'> 12:45pm </option>
                <option value = '13:15'> 01:15pm </option>
                <option value = '13:45'> 01:45pm </option>
                <option value = '14:15'> 02:15pm </option>
                <option value = '14:45'> 02:45pm </option>
                <option value = '15:15'> 03:15pm </option>
                <option value = '15:45'> 03:45pm </option>
                <option value = '16:15'> 04:15pm </option>
                <option value = '16:45'> 04:45pm </option>
                <option value = '17:15'> 05:15pm </option>
                <option value = '17:45'> 05:45pm </option>
                <option value = '18:15'> 06:15pm </option>
            </Select>
            </Flex>
            </FormControl>
            <FormControl>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newPlace2" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Place2</FormLabel>
            <Input
                placeholder="New course place"
                fontSize="12px"
                type="text"
                id="newPlace2"
                value={newPlace2}
                onChange={(e) => setNewPlace2(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newInstructor" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Instructor</FormLabel>
            <Input
                placeholder="New course instructor"
                fontSize="12px"
                type="text"
                id="newInstructor"
                value={newInstructor}
                onChange={(e) => setNewInstructor(e.target.value)}
            />
            </Flex>
            </FormControl>
            <FormControl isRequired>
            <Flex alignItems="center" mt="20px">
            <FormLabel htmlFor="newCapacity" fontFamily="Helvetica" lineHeight="1.4" fontSize="14px" color="Gray.Gray-700">Capacity</FormLabel>
            <NumberInput min={1} value={newCapacity} onChange={(value) => setNewCapacity(value)}>
                <NumberInputField />
                <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            </Flex>
            </FormControl>
        </form>
        </AlertDialogBody>
        <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
            Cancel
            </Button>
            <Button isLoading={isLoading} bg="cyanAlpha" color = "white" ml={3} onClick={() => {setIsLoading(true)}}>
            Add
            </Button>
        </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    )
}