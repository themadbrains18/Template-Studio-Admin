// ============================== //
// Typography
// ============================== //

import { pxToRem, responsiveFontSizes } from './utils/fontValues';
import palette from './palette';


const FONT_PRIMARY = "'Open Sans', sans-serif";
const FONT_SECONDARY = "'Inter', sans-serif"; 

// font-family: 'Inter', sans-serif;
// font-family: 'Open Sans', sans-serif;

const typography = {
    fontFamily: FONT_PRIMARY,
    h1:{
        fontWeight: 700,
        fontSize: pxToRem(38),
        color:palette.COMMON.lighter,
        ...responsiveFontSizes({ sm: 38, md: 48, lg: 55 }),
    },
    h4:{
        fontWeight: 700,
        fontSize: pxToRem(20),
        ...responsiveFontSizes({ sm: 20, md: 24, lg: 28 }),
        background: palette.GRADIENTS.mainGradient,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
    },
    h6:{
        fontWeight: 600,
        fontSize: pxToRem(18),
        ...responsiveFontSizes({ sm: 18, md: 18, lg: 20 }),
        background: palette.GRADIENTS.mainGradient,
        '-webkit-background-clip': 'text',
        '-webkit-text-fill-color': 'transparent',
    },
    p:{
        fontFamily: FONT_PRIMARY,
        color:palette.SECONDARY.light,
        fontWeight: 400,
        fontSize: pxToRem(14),  
        ...responsiveFontSizes({ sm: 14, md: 16, lg: 16 }),
    },
    paragraph1:{
        fontFamily: FONT_PRIMARY,
        color:palette.SECONDARY.main,
        fontWeight: 600,
        fontSize: pxToRem(14),  
        ...responsiveFontSizes({ sm: 14, md: 16, lg: 16 })
    }

}

export default typography;