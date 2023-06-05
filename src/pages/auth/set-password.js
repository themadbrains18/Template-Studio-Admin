import { TextField,Button } from "@mui/material";
import Layout from "../layout";
import { useRouter } from 'next/router';
import { useState } from "react";

export default function Signup() {
  const router = useRouter();

  let [formData, setFormData] = useState({
    otp : "",
    password : ""
  });

  const updateFormData = (e)=>{
    setFormData(prevalue=>{
      return {
        ...prevalue,
        [e.target.name] : e.target.value
      }
    })
  }

  let handleSubmit = (e)=>{
    e.preventDefault();
    fetch(`${process.env.NEXT_PUBLIC_APIURL}auth/setpassword`,{
      method : "POST",  
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ ...formData ,id :localStorage.getItem("userId") })
    })
    .then(response=>response.json())
    .then(async result=>{
      console.log(result);
      if(result.success){
        console.log(result);
        router.push('login');
      }else{
        if(result.message){
          alert(result.message);
        }else{
              
        }
      }
    })
    .catch(err=>{
      console.log(err)
      
    })
  }
  const resendOtp = async ()=>{
    try{
      let otpApi = await fetch("http://localhost:7777/auth/resend-otp",{
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({id :localStorage.getItem("userId")})
      });
      let result =  await otpApi.json();
      if(result.success){
        console.log(result);
        alert(result.message);
      }else{
        if(result.message){
          alert(result.message);
        }else{
          ;
        }
      }
    }
    catch(err){
      ;
    }
  }
  return (
    <>
      <form style={{maxWidth: "500px",width: "100%"}} onSubmit={handleSubmit}>
          <h1>Set Password</h1>
          <TextField fullWidth label="Otp" variant="outlined" type="text" sx={{ mt : 1}} value={formData.otp} name="otp" onChange={updateFormData}/>
          <TextField fullWidth label="Password" variant="outlined" type="text" sx={{ mt : 1,mb: 2}} value={formData.password} name="password" onInput={updateFormData}/>
          <Button variant="contained" size="large" sx={{mr:2}} onClick={resendOtp}>Resend Otp</Button>
          <Button variant="contained" size="large" type="submit">Set Password</Button>
      </form>
    </>
  )
}

Signup.getLayout = function  getLayout(page){ 
    return (<Layout variant="Auth">{page}</Layout>)
};