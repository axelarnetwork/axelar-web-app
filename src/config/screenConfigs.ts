// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
const deviceWidth = {
  mobileBreakpoint: "400px",
  tabletBreakpoint: `1280px`,
  laptopBreakpoint: `1860px`,
  desktopBreakpoint: `1861px`,
}

const media = {
  mobile: `(max-width: ${deviceWidth.mobileBreakpoint})`,
  tablet: `(max-width: ${deviceWidth.tabletBreakpoint})`,
  laptop: `(max-width: ${deviceWidth.laptopBreakpoint})`,
  desktop: `(min-width: ${deviceWidth.desktopBreakpoint})`,
}
const css = {}

const screenConfig = { media, css }

export default screenConfig
