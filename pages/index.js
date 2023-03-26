import { Flex, Spacer, Button, useColorMode } from '@chakra-ui/react'
import { SideBar } from '@/components/sidebar'

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex>
      <SideBar colorMode={colorMode}/>
      <Spacer/>
      <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
      </Button>
    </Flex>
  )
}
