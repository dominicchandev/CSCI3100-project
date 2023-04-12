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
    const { users } = props;
    return (
      <TableContainer>
        <Table variant="simple" layout="fixed" overflowWrap="anywhere">
        <TableCaption placement="top" textAlign="left" fontWeight="bold" fontSize="xl">Users</TableCaption>
          <UserTableHeadRow />
          <Tbody>
            {users.map((user) => (
              <UserTableRow
                key={`user-table-row-${user.id}`}
                user={user}
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
    const { user } = props;
    const { id, name, email } = user;
    return (
      <Tr w="full">
        <ColumnElem content={name} />
        <ColumnElem content={email} />
        <Td textAlign="center">
          <Checkbox value={`delete-user-${id}`}></Checkbox>
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
