
import Auth from "./auth";
import Dashboard from "./dashboard";


export default function Layout({ variant = 'Dashboard', children }) {
  if (variant === 'Auth') {
    return <Auth> {children} </Auth>;
  }
  else if (variant === 'Dashboard') {
      return <Dashboard> {children} </Dashboard>;
  }
  else{
    return {children}
  }
}