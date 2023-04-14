import { Button, Center, Text, HStack } from "@chakra-ui/react";

export function SidebarButton(props) {
    const icon = props.icon
    const text = props.text
    const extend = props.extend
    const highlight = props.highlight
    const onClick = props.onClick
    const colorMode = props.colorMode

    return (
        <Button 
            width={extend? "219px" : undefined}
            height="46px"
            borderRadius={12}
            backgroundColor={setBgColor(highlight, colorMode)}
            // textColor={setTextColor(highlight)}
            onClick={onClick}
            justifyContent="flex-start"
        >
            <HStack spacing="15px">
                <Center borderRadius="12" backgroundColor={setIconBg(highlight)} boxSize="30px">
                    {icon}
                </Center>
                {extend ? <Text ml="10px" variant="primary" color={setTextColor(highlight)}>{text}</Text> : <></>}
            </HStack>
        </Button>
    )
}

function setBgColor(hightlight, colorMode) {
    if (hightlight) {
        if (colorMode === 'light') {
            return "white"
        }
        return "#949494"
    }
    return "transparent"
}

function setIconBg(highlight, colorMode) {
    if (highlight) {
        if (colorMode === 'light') {
        return "#40DDCF"
        }
        return "darkBeta"
    }
    return "white"
}

function setTextColor(highlight) {
    if (highlight) {
        return "#2D3748"
    }
    return "#A0AEC0"
}