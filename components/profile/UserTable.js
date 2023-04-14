import {
    Checkbox,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useColorModeValue,
    useColorMode
  } from "@chakra-ui/react";
  
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
   * users: [user]
   *
   * @param {*} props
   * @returns
   */
  export function UserTable(props) {
    const users  = props.users;
    const onChange = props.onChange;
      const boxColor = useColorModeValue("whitePure", "darkAlpha")


    return (
      <TableContainer background={boxColor} borderRadius="15px" pt = "15px" pl = "15px">
        <Table variant="simple" layout="fixed" overflowWrap="anywhere">
        <TableCaption placement="top" textAlign="left" fontWeight="bold" fontSize="xl">Users</TableCaption>
          <UserTableHeadRow />
          <Tbody>
            {users.map((user) => (
              <UserTableRow
                key={`user-table-row-${user.id}`}
                user={user}
                onChange={onChange}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    );
  }
  
  function UserTableHeadRow() {
    return (
      <Thead>
        <Tr>
          <Th {...TH_STYLE}>NAME</Th>
          <Th {...TH_STYLE}>EMAIL</Th>
          <Th {...TH_STYLE}>DELETE USER</Th>
        </Tr>
      </Thead>
    );
  }
  
  /**
   *
   * user:
   *  id: int
   *  name: string
   *  email: string
   *
   * @param {*} props
   * @returns
   */
  export function UserTableRow(props) {
    const user = props.user;
    const { id, name, email } = user;
    const onChange = props.onChange;

    return (
      <Tr w="full">
        <ColumnElem content={name} />
        <ColumnElem content={email} />
        <Td alignContent="center">
          <Checkbox value={id} onChange={onChange} colorScheme = 'teal'></Checkbox>
        </Td>
      </Tr>
    );
    
    function ColumnElem(props) {
      const { content } = props;
      const { colorMode, toggleColorMode } = useColorMode();

      if (typeof content === "string")
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
