// ============================== //
// Color Palettes
// ============================== //

const COMMON ={
    lighter:"#fff",
    light:"#110833",
    main:'#7854F7',
    darker: '#9E88B2',
};
const PRIMARY ={
    900: '#AD54F2',
    800: '#BA6EF4',
    700: '#C687F6',
    600: '#D2A1F8',
    500: '#DEBBFA',
    400: '#E8CFFB',
    300: '#EFDDFC',
    200: '#F5EAFD',
    100: '#FBF6FE',
    50 : '#FBF6FE'
};
const SECONDARY={
    light: '#9E88B2',
    main:'#7854F7',
};


const BGCOLOR={
    light:"#FFF6FF",
    main:"#FAFAFA",
    darker:"#0D0C0D"
};
const DIVIDERCOLOR={
    light:"#EFEEF1",
    main:"#F2EEFE",
    dark:"#CCE0A5"
};
const OTHERLINKS={
    main:"#1496F5",
};
const GRADIENTS ={
    mainGradient: `linear-gradient(128.7deg, ${COMMON.main},-287.43%, ${COMMON.light})`,
    
};

const palette ={
    COMMON,
    PRIMARY,
    SECONDARY,
    BGCOLOR,
    DIVIDERCOLOR,
    OTHERLINKS,
    GRADIENTS
}

export default  palette;