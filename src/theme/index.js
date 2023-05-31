
import { ThemeProvider, createTheme } from '@mui/material/styles';

import palette from './palette';
import breakpoints from './breakpoints';
import typography from './typography';

const theme = createTheme({
    palette: palette,
    breakpoints: breakpoints,
    typography: typography
});


export default function MuiTheme({children}) {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
};

