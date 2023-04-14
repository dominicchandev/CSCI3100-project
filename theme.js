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
    whitePure: "#FFFFFF",
    darkPure: "#000000",
    darkAlpha: "#011628",
    darkBeta: "#13b1a3",
    cyanAlpha: "#40DDCF",
    buttoncolour: "#151928",
    greyLight: "#2D3748",
    greyDark: "#8791a1",
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
