import { TextField,Button } from "@mui/material";
import Layout from "../layout";
import { useRouter } from 'next/router';
import { useState } from "react";

export default function Signup() {
  const router = useRouter();

  let [formData, setFormData] = useState({
    name : "",
    email : "",
    password : "",
    confirmPassword : "",
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
    fetch(`${process.env.NEXT_PUBLIC_APIURL}auth/signup`,{
      method : "POST",  
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(formData)
    })
    .then(response=>response.json())
    .then(async result=>{
      console.log(result);
      if(result.success){
        localStorage.setItem('userId', result.userId);
        alert(result.message);
        router.push('otp-verify');
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
  return (
    <>
      <form style={{maxWidth: "500px",width: "100%"}} onSubmit={handleSubmit}>
          <h1>Signup</h1>
          <TextField fullWidth label="Name" variant="outlined" type="text" sx={{ mt : 3}} value={formData.name} name="name" onInput={updateFormData}/>
          <TextField fullWidth label="Email" variant="outlined" type="email" sx={{ mt : 1}} value={formData.email} name="email" onInput={updateFormData}/>
          <TextField fullWidth label="Password" variant="outlined" type="text" sx={{ mt : 1}} value={formData.password} name="password" onInput={updateFormData}/>
          <TextField fullWidth label="Confirm Password" variant="outlined" type="text" sx={{ mt : 1}} value={formData.confirmPassword} name="confirmPassword" onInput={updateFormData}/>
          <Button variant="contained" size="large" sx={{mt:3}} type="submit">Signup</Button>
      </form>
    </>
  )
}

Signup.getLayout = function  getLayout(page){ 
    return (<Layout variant="Auth">{page}</Layout>)
};