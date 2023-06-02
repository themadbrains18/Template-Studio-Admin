import { useEffect, useState } from "react"
import Layout from "../layout";
import { useRouter } from "next/router";
import { FormControl, InputLabel, MenuItem, Select, Box, TextField, Checkbox, Button } from "@mui/material";
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const MAX_FILE_SIZE = 102400; //100KB

const validFileExtensions = { image: ['zip', 'jpg', 'png', 'jpeg'] };

function isValidFileType(fileName, fileType) {
    return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}


const schema = Yup.object().shape({
    category: Yup.string().required("This Field is Required !!"),
    subCategory: Yup.string().required("This Field is Required !!"),
    softwareType: Yup.string().required("This Field is Required !"),
    name: Yup.string().required("This Field is Required !!").min(2).max(32),
    version: Yup.string().required("This Field is Required !!"),
    description: Yup.string().required("This Field is Required !!").min(80).max(5000),
    variant: Yup.string().required("This Field is Required !!").min(3).max(100),
    sourceFilePassword: Yup.string().required("This Field is Required !!"),
    industry: Yup.array().min(1,'Please select atleast 1 Industry').required().typeError('Please select atleast 1 Industry'),
    
    technical: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required(" This field is required"),
        })
    ).required(),

    seoKeywords: Yup.string().required("This Field is Required !"),

    sourceFile: Yup.mixed().required("This field is required"),

    sliderImages: Yup.mixed().required("This field is required"),

    fullPageImages: Yup.mixed().required("This field is required"),

    font: Yup.array().of(
        Yup.object().shape({
            fontName: Yup.string().required("Font name is required"),
            fontUrl: Yup.string().required("Font url is required"),
        })
    ).required(),

    imagesNameUrl: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Image name is required"),
            imageUrl: Yup.string().required("Image url is required"),
        })
    ).required(),

    icons: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Icon name is required"),
            iconUrl: Yup.string().required("Icon url is required"),
        })
    ).required(),

});

export default function UploadProduct() {
    const { register, control, handleSubmit, setValue, formState: { errors }, reset, clearErrors } = useForm({
        mode: "onChange",
        defaultValues: {
            font: [{ fontName: "", fontUrl: "" }],
            imagesNameUrl: [{ name: "", imageUrl: "" }],
            icons: [{ name: "", iconUrl: "" }],
            technical: [{ name: "" }],
        },
        resolver: yupResolver(schema),
    });

    const { fields: fontfields, append: fontappend, remove: fontremove } = useFieldArray({
        control,
        name: "font"
    });

    const { fields: imagefields, append: imageappend, remove: imageremove } = useFieldArray({
        control,
        name: "imagesNameUrl"
    });

    const { fields: iconfields, append: iconappend, remove: iconremove } = useFieldArray({
        control,
        name: "icons"
    });

    const { fields: technicalfields, append: technicalappend, remove: technicalremove } = useFieldArray({
        control,
        name: "technical"
    });

    const router = useRouter();
    let [paid, setPaid] = useState(false);
    let [masterCategory, setMasterCategory] = useState([]);
    let [masterSubCategory, setMasterSubCategory] = useState([]);
    let [masterSoftwareType, setMasterSoftwareType] = useState([]);
    let [masterIndustry, setMasterIndustry] = useState([]);
    let [templateType, setTemplateType] = useState(1);
    let [masterProductType, setMasterProductType] = useState([]);
    let [selectIndustry, setSelectInd] = useState([])

    useEffect(() => {
        getCategory();
        getIndustry();
        getProductType();
    }, []);

    const getCategory = async () => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch("http://localhost:7777/api/category/all", {
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
            await fetch("http://localhost:7777/api/industry/all", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
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
            await fetch("http://localhost:7777/api/producttype/all", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
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
            await fetch(`http://localhost:7777/api/subcategory/getById?id=${e.target.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
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
            await fetch(`http://localhost:7777/api/software/getByCategoryId?id=${e.target.value}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
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

 

    const selectCategory = (e) => {
        setValue('category', e)
        clearErrors('category')

    }
    const selectSubCat = (e) => {
        setValue('subCat', e)
        clearErrors('subCat')
    }

    const chckBoxSelect = (item) => {
        let obj = selectIndustry?.filter((a) => a == item.id);

        let array = selectIndustry;
        if (obj.length > 0) {
            let newArray = selectIndustry.filter((e) => e != item.id);
            array = newArray;
            setSelectInd(array);
        } else {
            array.push(item.id);
            setSelectInd(array);
        }
        setValue("industry", selectIndustry);
        clearErrors('industry')
    };

    const onSubmitHandler = (data) => {
        // e.preventDefault();
        console.log(data);
        const formData = new FormData();

        [...data?.sourceFile].forEach(file => {
            formData.append('sourceFile', file);
        });

        [...data?.sliderImages].forEach(file => {
            formData.append('sliderImages', file);
        });

        [...data?.fullPageImages].forEach(file => {
            formData.append('fullPageImages', file);
        });

        formData.append('name', data.name);
        formData.append('version', data.version);
        formData.append('category', data.category);
        formData.append('description', data.description);
        formData.append('seoKeywords', data.seoKeywords);
        formData.append('softwareType', data.softwareType);
        formData.append('sourceFilePassword', data.sourceFilePassword);
        formData.append('subCategory', data.subCategory);
        formData.append('variant', data.variant);

        // formData.append('font',data.font);
        // formData.append('icons', data.icons);
        // formData.append('imagesNameUrl', data.imagesNameUrl);
        // formData.append('technical', data.technical);

        data?.font.forEach(item => {
            formData.append(`font[]`, JSON.stringify(item));
        });
        data?.icons.forEach(item => {
            formData.append(`icons[]`, JSON.stringify(item));
        });
        data?.imagesNameUrl.forEach(item => {
            formData.append(`images[]`, JSON.stringify(item));
        });
        data?.technical.forEach(item => {
            formData.append(`technical[]`, JSON.stringify(item));
        });

        formData.append('industry', data.industry);

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
            <form style={{ maxWidth: "800px", width: "100%" }} encType="multipart/form-data" onSubmit={handleSubmit(onSubmitHandler)}>
                <h1>Upload Product</h1>
                <FormControl fullWidth sx={{ mt: 5 }} >
                    <InputLabel id="categorySelect">Select Template Type</InputLabel>
                    <Select {...register("category")} label="category" name="category" labelId="categorySelect" onChange={(e) => { getSubcategory(e); getSoftwareType(e); setTemplateType(parseInt(e.target.value)); selectCategory(e.target.value) }}>
                        {masterCategory !== undefined && masterCategory.length > 0 && masterCategory.map((item) => {
                            return <MenuItem key={item?.id} value={item?.id}>{item?.category}</MenuItem>
                        })}
                    </Select>
                    {errors.category && <p>{errors.category.message}</p>}
                </FormControl>

                {templateType === 1 ? <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="subCategorySelect">Template SubCategory</InputLabel>
                    <Select {...register("subCategory")} onChange={(e) => selectSubCat(e.target.value)} label="Template SubCategory" name="subCategory" labelId="subCategorySelect" >
                        {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {
                            return <MenuItem value={item?.id} >{item?.subCategory}</MenuItem>
                        })}
                    </Select>
                    {errors.subCategory && <p>{errors.subCategory.message}</p>}
                </FormControl> : <Box sx={{ mt: 2 }}>
                    <h3>Technology Type</h3>
                    {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {
                        return <><Checkbox name="subCategory" id={item?.subCategory} value={item?.id} />    <label htmlFor={item?.subCategory}>{item?.subCategory}</label></>
                    })}
                </Box>}

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="softwareTypeSelect">{templateType === 1 ? 'Software Type' : 'Software Version'} </InputLabel>
                    <Select {...register("softwareType")} label="Software Type" name="softwareType" labelId="softwareTypeSelect" >
                        {masterSoftwareType !== undefined && masterSoftwareType.length > 0 && masterSoftwareType.map((item) => {
                            return <MenuItem value={item?.id}>{item?.softwareType}</MenuItem>
                        })}
                    </Select>
                    {errors.softwareType && <p>{errors.softwareType.message}</p>}
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
                        return <><Checkbox {...register('industry')} name="industry" id={item?.industry} value={item?.id} />    <label htmlFor={item?.industry}>{item?.industry}</label></>
                    })}
                    {errors.industry && <p>{errors.industry.message}</p>}
                </Box>

                <TextField {...register("name")} fullWidth label="Name" variant="outlined" type="text" sx={{ mt: 2 }} name="name" />
                {errors.name && <p>{errors.name.message}</p>}
                <TextField {...register("version")} fullWidth label="Version" variant="outlined" type="text" sx={{ mt: 2 }} name="version" />
                {errors.version && <p>{errors.version.message}</p>}

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginBottom: '16px' }}>Description</h2>
                    <textarea {...register("description")} name="description" style={{ width: "100%", minHeight: "150px" }} />
                    {errors.description && <p>{errors.description.message}</p>}
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h3 style={{ marginBottom: '16px' }}>Fonts Used</h3>
                    {/* <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField {...register(`font[0].fontName`, { required: true })} fullWidth label="Font Name" variant="outlined" type="text" name="fontName[0]" />
                        <TextField {...register(`font[0].fontUrl`, { required: true })} fullWidth label="Paste Font URl here" variant="outlined" type="text" name="fontUrl[0]" />

                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField {...register("font[1].fontName")} fullWidth label="Font Name" variant="outlined" type="text" sx={{ mt: 2 }} name="fontName[1]" />
                        <TextField {...register("font[1].fontUrl")} fullWidth label="Paste Font URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="fontUrl[1]" />
                    </Box> */}

                    {fontfields.map((field, index) => (
                        <div className="box" key={field.id}>
                            <Box style={{ display: 'flex', gap: '50px', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Font Name" variant="outlined" type="text" sx={{ mt: 2 }} name={`font.${index}.fontName`}
                                        placeholder="Enter Name"
                                        {...register(`font.${index}.fontName`)}
                                    />
                                    {errors?.font?.[index]?.fontName && <p>{errors?.font?.[index]?.fontName.message}</p>}

                                </Box>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Font Url" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Enter Url" name={`font.${index}.fontUrl`}
                                        {...register(`font.${index}.fontUrl`)}
                                    />
                                    {errors?.font?.[index]?.fontUrl && <p>{errors?.font?.[index]?.fontUrl.message}</p>}
                                </Box>
                                <Box>
                                    <div className="btn-box">
                                        {fontfields.length !== 1 && <button
                                            className="mr10"
                                            onClick={() => fontremove(index)}>Remove</button>}
                                    </div>
                                </Box>
                            </Box>
                            <Box style={{ textAlign: 'right' }}>
                                <div className="btn-box">
                                    {fontfields.length - 1 === index && <button onClick={() => fontappend({ fontName: '', fontUrl: '' })}>Add</button>}
                                </div>
                            </Box>


                        </div>
                    ))}
                    <h3 style={{ marginTop: '16px' }}>Images</h3>
                    {/* <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesWebsiteName[0]" />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesUrl[0]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesWebsiteName[1]" />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="imagesUrl[1]" />
                    </Box> */}

                    {imagefields.map((field, index) => (
                        <div className="box" key={field.id}>
                            <Box style={{ display: 'flex', gap: '50px', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Enter Name"
                                        {...register(`imagesNameUrl.${index}.name`)}
                                    />
                                    {errors?.imagesNameUrl?.[index]?.name && <p>{errors?.imagesNameUrl?.[index]?.name.message}</p>}

                                </Box>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Image Url" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Enter url"
                                        {...register(`imagesNameUrl.${index}.imageUrl`)}
                                    />
                                    {errors?.imagesNameUrl?.[index]?.imageUrl && <p>{errors?.imagesNameUrl?.[index]?.imageUrl.message}</p>}
                                </Box>
                                <Box>
                                    <div className="btn-box">
                                        {imagefields.length !== 1 && <button
                                            className="mr10"
                                            onClick={() => imageremove(index)}>Remove</button>}
                                    </div>
                                </Box>
                            </Box>
                            <Box style={{ textAlign: 'right' }}>
                                <div className="btn-box">
                                    {imagefields.length - 1 === index && <button onClick={() => imageappend({ name: '', imageUrl: '' })}>Add</button>}
                                </div>
                            </Box>
                        </div>
                    ))}

                    <h3 style={{ marginTop: '16px' }}>Icons</h3>
                    {/* <Box style={{ display: 'flex', gap: '50px' }} >

                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsWebsiteName[0]" />
                        <TextField fullWidth label="Paste Icon URL here" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsUrl[0]" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsWebsiteName[1]" />
                        <TextField fullWidth label="Paste Icon URl here" variant="outlined" type="text" sx={{ mt: 2 }} name="iconsUrl[1]" />
                    </Box> */}

                    {iconfields.map((field, index) => (
                        <div className="box" key={field.id}>
                            <Box style={{ display: 'flex', gap: '50px', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Enter Name"
                                        {...register(`icons.${index}.name`)}
                                    />
                                    {errors?.icons?.[index]?.name && <p>{errors?.icons?.[index]?.name.message}</p>}

                                </Box>
                                <Box style={{ width: '50%' }}>
                                    <TextField fullWidth label="Icon Url" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Enter Url"
                                        {...register(`icons.${index}.iconUrl`)}
                                    />
                                    {errors?.icons?.[index]?.iconUrl && <p>{errors?.icons?.[index]?.iconUrl.message}</p>}
                                </Box>
                                <Box>
                                    <div className="btn-box">
                                        {iconfields.length !== 1 && <button
                                            className="mr10"
                                            onClick={() => iconremove(index)}>Remove</button>}
                                    </div>
                                </Box>
                            </Box>
                            <Box style={{ textAlign: 'right' }}>
                                <div className="btn-box">
                                    {iconfields.length - 1 === index && <button onClick={() => iconappend({ name: '', iconUrl: '' })}>Add</button>}
                                </div>
                            </Box>
                        </div>
                    ))}
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginTop: '16px' }}>Technical Details</h2>
                    {/* <Box style={{ display: 'flex', gap: '50px' }} >
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
                    </Box> */}

                    {technicalfields.map((field, index) => (
                        <div className="box" key={field.id}>
                            <Box style={{ display: 'flex', gap: '50px', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box style={{ width: '100%' }}>
                                    <TextField fullWidth label="Technical Name" variant="outlined" type="text" sx={{ mt: 2 }}
                                        placeholder="Technical Name"
                                        {...register(`technical.${index}.name`)}
                                    />
                                    {errors?.technical?.[index] && <p>{errors?.technical?.[index]?.name?.message}</p>}

                                </Box>

                                <Box>
                                    <div className="btn-box">
                                        {technicalfields.length !== 1 && <button
                                            className="mr10"
                                            onClick={() => technicalremove(index)}>Remove</button>}
                                    </div>
                                </Box>
                            </Box>
                            <Box style={{ textAlign: 'right' }}>
                                <div className="btn-box">
                                    {technicalfields.length - 1 === index && <button onClick={() => technicalappend({ name: '' })}>Add</button>}
                                </div>
                            </Box>
                        </div>
                    ))}
                </Box>
                {errors.technical && <p>{errors.technical.message}</p>}

                <h2 style={{ marginTop: '16px' }}>Product Variant</h2>
                <TextField {...register("variant")} fullWidth label="variant" variant="outlined" type="text" sx={{ mt: 2 }} name="variant" />
                {errors.variant && <p>{errors.variant.message}</p>}

                <Box sx={{ mt: 2 }}>Source File</Box>
                <input variant="outlined" type="file" {...register("sourceFile")} name="sourceFile" />
                {errors.sourceFile && <p>{errors.sourceFile.message}</p>}

                <Box sx={{ mt: 2 }}>Source File Password</Box>
                <TextField {...register("sourceFilePassword")} fullWidth variant="outlined" type="text" name="sourceFilePassword" />
                {errors.sourceFilePassword && <p>{errors.sourceFilePassword.message}</p>}

                <Box sx={{ mt: 2 }}>Slider Images</Box>
                <input variant="outlined" type="file" multiple={true} name="sliderImages" {...register("sliderImages")} />

                <Box sx={{ mt: 2 }}>Full page Images</Box>
                <input variant="outlined" type="file" multiple={true} name="fullPageImages" {...register("fullPageImages")} />

                <Box sx={{ mt: 2 }}>SEO Keywords</Box>
                <TextField {...register("seoKeywords")} fullWidth label="SEO Keywords" variant="outlined" type="text" sx={{ mt: 2 }} name="seoKeywords" />
                {errors.seoKeywords && <p>{errors.seoKeywords.message}</p>}

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