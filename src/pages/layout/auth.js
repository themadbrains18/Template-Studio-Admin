import Link from "next/link";
import {Stack} from "@mui/material";



export default function Auth({children}){
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
            <div className="auth_page_wrap">
                {children}
            </div>
        </>
    );
}