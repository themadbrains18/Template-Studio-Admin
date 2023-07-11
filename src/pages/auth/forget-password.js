import { TextField,Button } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../layout";

export default function Login() {
  const router = useRouter();

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
    fetch(`${process.env.NEXT_PUBLIC_APIURL}auth/forgetpassword`,{
      method : "POST",  
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(formData)
    })
    .then(response=>response.json())
    .then(async result=>{
      if(result.success){
        alert(result.message);
        localStorage.setItem('userId', result.userId);
        router.push("set-password")
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
      <form style={{maxWidth: "500px",width: "100%", paddingLeft:"15px", paddingRight:"15px"}} onSubmit={handleSubmit}>
        <h1 style={{ marginBottom : '20px'}}>
          Forget Password
        </h1>
          <TextField fullWidth  label="Email" variant="outlined" type="email" value={formData.email} name="email" onInput={updateFormData}/>
          <Button variant="contained" type="submit" sx={{ mt : 2}}>Login</Button>
      </form>
    </>
  )
}

Login.getLayout = function  getLayout(page){
    return (<Layout variant="Auth">{page}</Layout>)
};