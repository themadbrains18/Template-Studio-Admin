import { TextField,Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../layout";

export default function Login() {
  const router = useRouter();

  useEffect(()=>{
    const localToken = localStorage.getItem('token');
    if (localToken) {
      router.push("/dashboard")
    }
  },[])

  const [formData,setFormData] = useState({
    email: '',
    password: ''
  });

  const updateFormData = (e)=>{
    setFormData(prevalue=>{
      return {
        ...prevalue,
        [e.target.name] : e.target.value
      }
    });
  }

  let handleSubmit = (e)=>{
    e.preventDefault();
    fetch("http://localhost:7777/api/auth/login",{
      method : "POST",  
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(formData)
    })
    .then(response=>response.json())
    .then(async result=>{
      if(result.success){
        localStorage.setItem("token",result?.obj?.access_token)
        router.push("/dashboard");
      }else{
        if(result.message){
        }else{
              
        }
      }
    })
    .catch(err=>{
      console.log(err)
      
    })
  }




  return (
    <>
      <form style={{maxWidth: "500px",width: "100%"}} onSubmit={handleSubmit}>
        <h1 style={{ marginBottom : '20px'}}>
          Login
        </h1>
          <TextField fullWidth  label="Email" variant="outlined" type="email" value={formData.email} name="email" onInput={updateFormData}/>
          <TextField fullWidth  label="Password" variant="outlined" type="password" sx={{ my : 2}} value={formData.password} name="password" onInput={updateFormData}/>
          <Link variant="contained" href="forget-password" className="forget">
            Forget Password
          </Link>
          <Button variant="contained" type="submit">Login</Button>
      </form>
    </>
  )
}

Login.getLayout = function  getLayout(page){
    return (<Layout variant="Auth">{page}</Layout>)
};