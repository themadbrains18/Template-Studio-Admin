import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button, Stack } from "@mui/material";

export default function Dashboard({ children }) {
  const router = useRouter();
  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      router.push("/")
    }
    else {
      fetch("http://localhost:7777/dashboard", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'token': localToken
        }
      })
        .then(response => response.json())
        .then(async result => {
          if (!result.success) {
            if (result.message) {
              alert(result.message);
            } else {
              alert(`There is some Error Please Try Again later`)
            }
            router.push("/auth/login");
          }
        })
        .catch(err => {
          console.log(err)
          alert(`There is some Error Please Try Again later`)
          router.push("/auth/login");
        });
    }
  }, [])

  return (
    <>
      <Stack direction="row" spacing={2} className='header'>
        <Button onClick={()=>{localStorage.removeItem('token'); router.push("/auth/login");}}>
          Logout
        </Button>
      </Stack>
      <Stack direction="row" spacing={0} style={{ display: 'block' }}>
        <div className="auth_page_wrap">
          {children}
        </div>
      </Stack>

    </>
  );
}