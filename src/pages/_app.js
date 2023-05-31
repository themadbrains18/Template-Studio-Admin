import '@/styles/globals.css';
import '@/styles/auth.css';
import  MuiTheme from "@/theme";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <MuiTheme>
      {getLayout(<Component {...pageProps} />)}
    </MuiTheme>
  );
}
