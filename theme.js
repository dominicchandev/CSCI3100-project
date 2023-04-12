import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import { TextStyle as Text } from "./styles/TextStyles";

const styles = {
    global: (props) => ({
        body: {
            bg: mode("#f9f9f9", "gray.800")(props),
        }
    })
};

const colors = {
    cyanAlpha: "#40DDCF",
    buttoncolour: "#151928",
    text: {
        dark: "#000",
        light: "#fff"
    }
};

const components = {
    Text,
}

const theme = extendTheme({
    styles,
    colors,
    components,
});

export default theme;
