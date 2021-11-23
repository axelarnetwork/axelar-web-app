// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
const deviceWidth = {
	mobileBreakpoint: '400px',
	tabletBreakpoint: `1280px`
}

const media = {
	mobile: `(max-width: ${deviceWidth.mobileBreakpoint})`,
	tablet: `(max-width: ${deviceWidth.tabletBreakpoint})`,
	laptop: `(min-width: ${deviceWidth.tabletBreakpoint + 1})`
}
const css = {}

const screenConfig = {media, css};

export default screenConfig;
