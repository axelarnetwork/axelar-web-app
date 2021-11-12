// https://gist.github.com/gokulkrishh/242e68d1ee94ad05f488
const deviceWidth = {
	mobileBreakpoint: '575px'
}

const media = {
	mobile: `(max-width: ${deviceWidth.mobileBreakpoint})`,
	nonMobile: `(min-width: ${deviceWidth.mobileBreakpoint})`
}
const css = {}

const screenConfig = {media, css};

export default screenConfig;
