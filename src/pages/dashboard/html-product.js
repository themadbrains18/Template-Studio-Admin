import { useEffect, useState } from "react"
import Layout from "../layout";
import { FormControl, InputLabel, MenuItem, Select, Box, TextField, Checkbox, Button } from "@mui/material";


export default function HtmlProduct() {
    let [paid, setPaid] = useState(false);

    let [masterCategory, setMasterCategory] = useState([]);
    let [masterSubCategory, setMasterSubCategory] = useState([]);
    let [masterSoftwareType, setMasterSoftwareType] = useState([]);
    let [masterIndustry, setMasterIndustry] = useState([]);
    let [masterProductType, setMasterProductType] = useState([]);

    useEffect(() => {
        getCategory();
        getIndustry();
        getProductType();
    }, []);

    const getCategory = async () => {
        try {
            await fetch("http://localhost:7777/api/category/all", {
                method: "GET"
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterCategory(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    
                })
        } catch (error) {

        }
    }

    const getIndustry = async () => {
        try {
            await fetch("http://localhost:7777/api/industry/all", {
                method: "GET"
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterIndustry(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    
                })
        } catch (error) {

        }
    }

    const getProductType = async()=>{
        try {
            await fetch("http://localhost:7777/api/producttype/all", {
                method: "GET"
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterProductType(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    
                })
        } catch (error) {

        }
    }

    const getSubcategory = async (e) => {
        try {
            await fetch(`http://localhost:7777/api/subcategory/all?id=${e.target.value}`, {
                method: "GET"
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterSubCategory(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    
                })
        } catch (error) {

        }
    }

    const getSoftwareType = async (e) => {
        try {
            await fetch(`http://localhost:7777/api/software/all?id=${e.target.value}`, {
                method: "GET"
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterSoftwareType(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    
                })
        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        fetch("http://localhost:7777/dashboard/upload", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(async result => {
                console.log(result);
                if (result.success) {
                    alert(result.message);
                } else {
                    if (result.message) {
                        alert(result.message);
                    } else {
                        
                    }
                }
            })
            .catch(err => {
                console.log(err)
                
            })
    }

    return (
        <>
            <form style={{ maxWidth: "500px", width: "100%", margin: " 0 0 0 100px" }} encType="multipart/form-data" onSubmit={handleSubmit}>
                <h1>HTML Product</h1>
                <FormControl fullWidth sx={{ mt: 5 }} >
                    <InputLabel id="categorySelect">Category</InputLabel>
                    <Select label="category" name="category" labelId="categorySelect" onChange={(e) => { getSubcategory(e); getSoftwareType(e) }}>
                        {masterCategory !== undefined && masterCategory.length > 0 && masterCategory.map((item) => {
                            return <MenuItem key={item?.id} value={item?.id}>{item?.category}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                    <h3>Template SubCategory</h3>
                    {masterSubCategory!==undefined && masterSubCategory.length>0 && masterSubCategory.map((item)=>{
                        return <><Checkbox name="subCategory" id={item?.subCategory} value={item?.id} />    <label htmlFor={item?.subCategory}>{item?.subCategory}</label></>
                        })}
                </Box>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="softwareTypeSelect">Software Type</InputLabel>
                    <Select label="Software Type" name="softwareType" labelId="softwareTypeSelect" >
                        {masterSoftwareType!==undefined && masterSoftwareType.length>0 && masterSoftwareType.map((item)=>{
                            return <MenuItem value={item?.id}>{item?.softwareType}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="productTypeSelect">Product Type</InputLabel>
                    <Select label="Product Type" name="productType" labelId="softwareTypeSelect" >
                        {masterProductType!==undefined && masterProductType.length>0 && masterProductType.map((item)=>{
                            return <MenuItem value={item?.type}>{item?.type}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                <Box sx={{ mt: 2 }}>
                    <h3>Indrusty</h3>
                    {masterIndustry!==undefined && masterIndustry.length>0 && masterIndustry.map((item)=>{
                        return <><Checkbox name="indrusty" id={item?.industry} value={item?.id} />    <label htmlFor={item?.industry}>{item?.industry}</label></>
                    })}
                </Box>

                <TextField fullWidth label="Name" variant="outlined" type="text" sx={{ mt: 2 }} name="name" />
                <TextField fullWidth label="Version" variant="outlined" type="text" sx={{ mt: 2 }} name="version" />

                <Box sx={{ mt: 2 }} >
                    <h2>Description</h2>
                    <textarea name="description" style={{ width: "100%", minHeight: "150px" }} />
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2>Credits</h2>
                    <Box sx={{ mt: 2 }} >
                        <h3>Fonts</h3>
                        <TextField fullWidth label="Font Used" variant="outlined" type="text" sx={{ mt: 2 }} name="fontName[0]" />
                        <TextField fullWidth label="Font Url" variant="outlined" type="text" sx={{ mt: 2 }} name="fontUrl[0]" />
                    </Box>
                    <Box sx={{ mt: 2 }} >
                        <h3>Images</h3>
                        <TextField fullWidth label="Images Used" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesWebsiteName[0]" />
                        <TextField fullWidth label="Images Url" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesUrl[0]" />
                    </Box>
                    <Box sx={{ mt: 2 }} >
                        <h3>Icons</h3>
                        <TextField fullWidth label="Icon Used" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsWebsiteName[0]" />
                        <TextField fullWidth label="Icon Url" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsUrl[0]" />
                    </Box>
                </Box>


                <TextField fullWidth label="variant" variant="outlined" type="text" sx={{ mt: 2 }} name="variant" />

                <Box sx={{ mt: 2 }}>Source File</Box>
                <input variant="outlined" type="file" name="sourceFile" />

                <Box sx={{ mt: 2 }}>Source File Password</Box>
                <TextField fullWidth variant="outlined" type="text" name="sourceFilePassword" />

                <Box sx={{ mt: 2 }}>Slider Images</Box>
                <input variant="outlined" type="file" multiple={true} name="sliderImages" />

                <Box sx={{ mt: 2 }}>Full page Images</Box>
                <input variant="outlined" type="file" multiple={true} name="fullPageImages" />

                <Box sx={{ mt: 2 }}>Full page Images</Box>
                <TextField fullWidth label="SEO Keywords" variant="outlined" type="text" sx={{ mt: 2 }} name="seoKeywords" />

                <Box sx={{ mt: 2 }} >
                    Paid
                    <Checkbox checked={paid} onChange={() => setPaid(!paid)} name="paid" />
                    {paid && <TextField fullWidth label="Price in Doller" variant="outlined" type="number" name="price" />}
                </Box>

                <Button variant="contained" size="large" sx={{ mt: 3 }} type="submit">Submit</Button>
            </form>
        </>
    )
}



HtmlProduct.getLayout = function getLayout(page) {
    return (<Layout variant="Dashboard">{page}</Layout>)
};