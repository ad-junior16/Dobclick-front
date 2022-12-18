import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: '#0b8ad9',
    },
    secondary: {
      main: '#053259',
    },

  },
});


const Providers: React.FC = ({ children }) => {

  return (
    <AuthProvider>
      <ThemeProvider theme={theme} >
        {children}
      </ThemeProvider>
    </AuthProvider>

  );

}


export default Providers;