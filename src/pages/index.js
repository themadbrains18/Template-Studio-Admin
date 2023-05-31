import { Open_Sans } from '@next/font/google'
import Link from "next/link";
import { Stack } from "@mui/material";

const openSansFont = Open_Sans({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Stack direction="row" spacing={2} className='header'>
        <Link href="/auth/login">
          Login
        </Link>
        <Link href="/auth/signup">
          signup
        </Link>
      </Stack>
      <h1 className={`auth_page_wrap ${openSansFont.className}`}>
        Welcome Template Studio
      </h1>
    </>
  )
}
