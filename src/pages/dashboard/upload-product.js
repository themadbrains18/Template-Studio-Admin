import { useEffect, useState } from "react"
import Layout from "../layout";
import { useRouter } from "next/router";
import { FormControl, InputLabel, MenuItem, Select, Box, TextField, Checkbox, Button } from "@mui/material";


export default function UploadProduct() {
    const router = useRouter();
    let [paid, setPaid] = useState(false);
    let [masterCategory, setMasterCategory] = useState([]);
    let [masterSubCategory, setMasterSubCategory] = useState([]);
    let [masterSoftwareType, setMasterSoftwareType] = useState([]);
    let [masterIndustry, setMasterIndustry] = useState([]);
    let [templateType, setTemplateType] = useState(1);
    let [masterProductType, setMasterProductType] = useState([]);

    useEffect(() => {
        getCategory();
        getIndustry();
        getProductType();
    }, []);

    const getCategory = async () => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}category/all`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
                }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterCategory(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

    const getIndustry = async () => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}industry/all`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token' : localToken
                  }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterIndustry(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

    const getProductType = async () => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}producttype/all`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token' : localToken
                  }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterProductType(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

    const getSubcategory = async (e) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}subcategory/getById?id=${e.target.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token' : localToken
                  }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterSubCategory(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

    const getSoftwareType = async (e) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}software/getByCategoryId?id=${e.target.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token' : localToken
                  }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMasterSoftwareType(result.data)
                    }
                })
                .catch(err => {
                    console.log(err)
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const localToken = localStorage.getItem('token');
        fetch("http://localhost:7777/dashboard/upload", {
            method: "POST",
            headers: { 'token': localToken },
            body: formData
        })
            .then(response => response.json())
            .then(async result => {
                console.log(result);
                if (result.success) {
                    alert(result.message);
                    router.push("/dashboard");
                } else {
                    if (result.message) {
                        alert(result.message);
                    } else {
                        alert(`There is some Error Please Try Again later`)
                    }
                }
            })
            .catch(err => {
                console.log(err)
                alert(`There is some Error Please Try Again later`)
            })
    }


    return (
        <>
            <form style={{ maxWidth: "800px", width: "100%" }} encType="multipart/form-data" onSubmit={handleSubmit}>
                <h1>Upload Product</h1>
                <FormControl fullWidth sx={{ mt: 5 }} >
                    <InputLabel id="categorySelect">Select Template Type</InputLabel>
                    <Select label="category" name="category" labelId="categorySelect" onChange={(e) => { getSubcategory(e); getSoftwareType(e); setTemplateType(parseInt(e.target.value)) }}>
                        {masterCategory !== undefined && masterCategory.length > 0 && masterCategory.map((item) => {
                            return <MenuItem key={item?.id} value={item?.id}>{item?.category}</MenuItem>
                        })}
                    </Select>
                </FormControl>
                {templateType === 1 ? <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="subCategorySelect">Template SubCategory</InputLabel>
                    <Select label="Template SubCategory" name="subCategory" labelId="subCategorySelect" >
                        {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {
                            return <MenuItem value={item?.id}>{item?.subCategory}</MenuItem>
                        })}
                    </Select>
                </FormControl> : <Box sx={{ mt: 2 }}>
                    <h3>Technology Type</h3>
                    {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {
                        return <><Checkbox name="subCategory" id={item?.subCategory} value={item?.id} />    <label htmlFor={item?.subCategory}>{item?.subCategory}</label></>
                    })}
                </Box>}

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="softwareTypeSelect">{templateType === 1 ? 'Software Type' : 'Software Version'} </InputLabel>
                    <Select label="Software Type" name="softwareType" labelId="softwareTypeSelect" >
                        {masterSoftwareType !== undefined && masterSoftwareType.length > 0 && masterSoftwareType.map((item) => {
                            return <MenuItem value={item?.id}>{item?.softwareType}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                {templateType === 2 &&
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="productTypeSelect">Product Type</InputLabel>
                        <Select label="Product Type" name="productType" labelId="softwareTypeSelect" >
                            {masterProductType !== undefined && masterProductType.length > 0 && masterProductType.map((item) => {
                                return <MenuItem value={item?.type}>{item?.type}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                }

                <Box sx={{ mt: 2 }}>
                    <h3>Indrusty</h3>
                    {masterIndustry !== undefined && masterIndustry.length > 0 && masterIndustry.map((item) => {
                        return <><Checkbox name="indrusty" id={item?.industry} value={item?.id} />    <label htmlFor={item?.industry}>{item?.industry}</label></>
                    })}
                </Box>

                <TextField fullWidth label="Name" variant="outlined" type="text" sx={{ mt: 2 }} name="name" />
                <TextField fullWidth label="Version" variant="outlined" type="text" sx={{ mt: 2 }} name="version" />

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginBottom: '16px' }}>Description</h2>
                    <textarea name="description" style={{ width: "100%", minHeight: "150px" }} />
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h3 style={{ marginBottom: '16px' }}>Fonts Used</h3>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Font Name" variant="outlined" type="text" name="fontName[0]" />
                        <TextField fullWidth label="Paste Font URl here" variant="outlined" type="text" name="fontUrl[0]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Font Name" variant="outlined" type="text" sx={{ mt: 2 }} name="fontName[1]" />
                        <TextField fullWidth label="Paste Font URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="fontUrl[1]" />
                    </Box>

                    <h3 style={{ marginTop: '16px' }}>Images</h3>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesWebsiteName[0]" />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesUrl[0]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesWebsiteName[1]" />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesUrl[1]" />
                    </Box>
                    <h3 style={{ marginTop: '16px' }}>Icons</h3>
                    <Box style={{ display: 'flex', gap: '50px' }} >

                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsWebsiteName[0]" />
                        <TextField fullWidth label="Paste Icon URL here" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsUrl[0]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsWebsiteName[1]" />
                        <TextField fullWidth label="Paste Icon URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsUrl[1]" />
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginTop: '16px' }}>Technical Details</h2>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item1" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[0]" />
                        <TextField fullWidth label="item2" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[1]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item3" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[2]" />
                        <TextField fullWidth label="item4" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[3]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item5" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[4]" />
                        <TextField fullWidth label="item6" variant="outlined" type="text" sx={{ mt: 2 }} name="technical[5]" />
                    </Box>
                </Box>

                <h2 style={{ marginTop: '16px' }}>Product Variant</h2>
                <TextField fullWidth label="variant" variant="outlined" type="text" sx={{ mt: 2 }} name="variant" />

                <Box sx={{ mt: 2 }}>Source File</Box>
                <input variant="outlined" type="file" name="sourceFile" />

                <Box sx={{ mt: 2 }}>Source File Password</Box>
                <TextField fullWidth variant="outlined" type="text" name="sourceFilePassword" />

                <Box sx={{ mt: 2 }}>Slider Images</Box>
                <input variant="outlined" type="file" multiple={true} name="sliderImages" />

                <Box sx={{ mt: 2 }}>Full page Images</Box>
                <input variant="outlined" type="file" multiple={true} name="fullPageImages" />

                <Box sx={{ mt: 2 }}>SEO Keywords</Box>
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



UploadProduct.getLayout = function getLayout(page) {
    return (<Layout variant="Dashboard">{page}</Layout>)
};