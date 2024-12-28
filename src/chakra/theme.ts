import { createSystem, defaultConfig } from "@chakra-ui/react"
import _default from "@emotion/react/_isolated-hnrs"

export const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      bg: {
        _light: "rgb(208, 208, 205)",
        _dark: "rgb(10, 10, 15)",
      },
    },
  }
})

export default system