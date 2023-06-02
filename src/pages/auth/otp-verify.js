import { TextField,Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../layout";

export default function OtpVerify() {
  const router = useRouter();
  const [formData,setFormData] = useState({
    otp : ""
  });

  const updateFormData = (e)=>{
    setFormData(prevalue=>{
      return {
        ...prevalue,
        [e.target.name] : e.target.value
      }
    })
  }
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      let otpApi = await fetch(`${process.env.NEXT_PUBLIC_APIURL}auth/verify`,{
        method : "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({ ...formData ,id :localStorage.getItem("userId") })
      });
      let result =  await otpApi.json();
      if(result.success){
        console.log(result);
        alert(result.message);
        router.push('login')
      }else{
        if(result.message){
          alert(result.message);
        }else{
          alert(`There is some Error Please Try Again later`);
        }
      }
    }
    catch(err){
      alert(`There is some Error Please Try Again later`);
    }
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
          alert(`There is some Error Please Try Again later`);
        }
      }
    }
    catch(err){
      alert(`There is some Error Please Try Again later`);
    }
  }


  return (
    <>
      <form style={{maxWidth: "500px",width: "100%"}} onSubmit={handleSubmit}>
        <h1 style={{ marginBottom : '20px'}}>
          Otp
        </h1>
          <TextField fullWidth label="Password" variant="outlined" type="text" sx={{ mb : 2}} value={formData.otp} name="otp" onChange={updateFormData}/>
          <Button variant="contained" sx={{mr:2}} onClick={resendOtp}>Resend Otp</Button>
          <Button variant="contained" type="submit">Send</Button>
      </form>
    </>
  )
}

OtpVerify.getLayout = function  getLayout(page){
    return (<Layout variant="Auth">{page}</Layout>)
};