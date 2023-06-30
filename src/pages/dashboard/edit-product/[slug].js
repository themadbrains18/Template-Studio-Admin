import { useEffect, useState } from "react"
import Layout from "../../layout";
import { useRouter } from "next/router";
import { FormControl, InputLabel, MenuItem, Select, Box, TextField, Checkbox, Button } from "@mui/material";
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('This field is required'),
    version: Yup.string().required('This field is required'),
    category: Yup.string().required('This field is required'),
    subCategory: Yup.lazy(val => (Array.isArray(val) ? Yup.array().min(1, 'Please select atleast 1 Technology Type').required().typeError('Please select atleast 1 Technology Type') : Yup.string().required('This field is required'))),
    variant: Yup.string().required('This field is required'),
    seoKeywords: Yup.string().required('This field is required'),
    // description: Yup.string().required('This field is required'),
    description: Yup.string().required("This Field is Required !!").min(80).max(5000),
    sourceFilePassword: Yup.string().required('This field is required'),
    price: Yup.number().optional(),
    fontName: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    fontUrl: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    imagesWebsiteName: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    imagesUrl: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    iconsWebsiteName: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    iconsUrl: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    technical: Yup.array().of(Yup.string().required('this field is required')).required('this field is required'),
    productType: Yup.string().optional(),
    industry: Yup.array().min(1, 'Please select atleast 1 Industry').required().typeError('Please select atleast 1 Industry'),

    sourceFile: Yup.mixed().required("This field is required"),

    sliderImages: Yup.mixed().required("This field is required"),

    fullPageImages: Yup.mixed().required("This field is required"),

});



export default function EditProduct({ content }) {
    let [paid, setPaid] = useState(false);
    let [mainProduct, setMainProduct] = useState({});
    let [masterCategory, setMasterCategory] = useState([]);
    let [masterSubCategory, setMasterSubCategory] = useState([]);
    let [masterSoftwareType, setMasterSoftwareType] = useState([]);
    let [masterIndustry, setMasterIndustry] = useState([]);
    let [templateType, setTemplateType] = useState(1);
    let [masterProductType, setMasterProductType] = useState([]);
    const router = useRouter();

    const [defaultSubCategory, setDefaultSubCategory] = useState([]);
    const [defaultDropdownSubCategory, setDefaultDropdownSubCategory] = useState(1);
    const [defaultSoftwareType, setDefaultSoftwareType] = useState(1);
    const [defaultProductType, setDefaultProductType] = useState('');
    const [defaultIndustry, setDefaultIndustry] = useState([]);
    const [sliderImages, setSliderImages] = useState([]);
    const [fullPageImages, setFullPageImages] = useState([]);
    const [tech, setTech] = useState([]);
    const [font, setFont] = useState([{ fontName: "", fontUrl: "" }])
    const [imag, setImag] = useState([{ imageName: "", imageUrl: "" }])
    const [icon, setIcon] = useState([{ iconName: "", iconUrl: "" }])


    const [dltFeild, setDltFeild] = useState(0);

    const [removedSlider, setRemoveSlider] = useState([]);
    const [removedFullPageImage, setRemovedFullPageImage] = useState([]);

    const { slug } = router.query

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, control, reset, setValue, formState: { errors }, clearErrors, handleSubmit } = useForm(formOptions);

    useEffect(() => {
        getCategory();
        getIndustry();
        getProductType();
        if (slug != undefined) {
            getProductDetailBySlug();
        }
    }, [slug]);


    const getProductDetailBySlug = async () => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}dashboard/detail/${slug}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'token': localToken
                }
            })
                .then(response => response.json())
                .then(async result => {
                    if (result.status === 200) {
                        setMainProduct(result.data);
                        setValue('name', result?.data?.name);
                        setValue('version', result?.data?.version);
                        setValue('category', result?.data?.templatecategories[0]?.category?.category);
                        setValue('variant', result?.data?.variant);
                        setValue('seoKeywords', result?.data?.seoKeywords);
                        setValue('description', result?.data?.description);
                        setValue('sourceFilePassword', result?.data?.file?.sourceFilePassword);

                        result?.data?.fonts.map((item, index) => {
                            setValue(`fontName[${index}]`, item.fontName);
                            setValue(`fontUrl[${index}]`, item.fontUrl)
                        })

                        result?.data?.images.map((item, index) => {
                            setValue(`imagesWebsiteName[${index}]`, item.imageName);
                            setValue(`imagesUrl[${index}]`, item.imageUrl)
                        })

                        result?.data?.icons.map((item, index) => {
                            setValue(`iconsWebsiteName[${index}]`, item.iconName);
                            setValue(`iconsUrl[${index}]`, item.iconUrl)
                        })

                        result?.data?.technical.map((item, index) => {
                            setValue(`technical[${index}]`, item);
                        })

                        result?.data?.templateindrusties.map((item, index)=>{
                            setValue(`industry[${index}]`, item);
                        })

                        if(result?.data?.templatecategories[0]?.categoryId === 2){
                            result?.data?.templatesubcategories.map((item, index)=>{
                                setValue(`subCategory[${index}]`, item);
                            })
                        }
                        else{
                            setValue(`subCategory`, result?.data?.templatesubcategories[0]?.subcategoryId);
                        }
                        

                        setFont(result?.data?.fonts);
                        setImag(result?.data?.images);

                        setIcon(result?.data?.icons);
                        setTech(result?.data?.technical);
                        setSliderImages(result?.data?.sliderimages);
                        setFullPageImages(result?.data?.fullimages)

                        setPaid(result?.data?.price !== null ? true : false);
                        setValue('price', result?.data?.price !== null ? result?.data?.price : 0);  

                        setTemplateType(parseInt(result?.data?.templatecategories[0]?.categoryId));

                        setDefaultProductType(result?.data?.productType);

                        await getSubcategory(parseInt(result?.data?.templatecategories[0]?.categoryId));
                        await getSoftwareType(parseInt(result?.data?.templatecategories[0]?.categoryId));

                        setDefaultSoftwareType(parseInt(result?.data?.templatesoftwaretypes[0]?.softwareTypeId));
                        setDefaultDropdownSubCategory(result?.data?.templatesubcategories[0]?.subcategoryId);
                        setDefaultSubCategory(result?.data?.templatesubcategories);
                        setDefaultIndustry(result?.data?.templateindrusties);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        } catch (error) {

        }
    }

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

                })
        } catch (error) {

        }
    }

    const getSubcategory = async (id) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}subcategory/getById?id=${id}`, {
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

                })
        } catch (error) {

        }
    }

    const getSoftwareType = async (id) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`${process.env.NEXT_PUBLIC_APIURL}software/getByCategoryId?id=${id}`, {
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

                })
        } catch (error) {

        }
    }

    //  for Icons edit the Icons Details icons
    let handleChange = (i, name, e) => {
        let newFormValues = [...icon];
        // newFormValues[i][e.target.name] = e.target.value;
        newFormValues[i][name] = e.target.value;
        setIcon(newFormValues);
    }

    let addFormFields = (id) => {
        setIcon([...icon, { iconName: "", iconUrl: "" }])
        setValue(`iconsWebsiteName[${id}]`, '');
        setValue(`iconsUrl[${id}]`, '');
    }

    let removeFormFields = (i) => {
        let iconsData = icon.filter((fruit, index) => index !== i);
        // setValue(`iconsWebsiteName[${i}]`, '');
        // setValue(`iconsUrl[${i}]`, '');
        iconsData.map((item, index) => {
            setValue(`iconsWebsiteName[${index}]`, item.iconName);
            setValue(`iconsUrl[${index}]`, item.iconUrl)
        })
        setIcon(iconsData)
    }

    //  for font edit the font inputs
    let handleChangeFont = (i, name, e) => {
        let newFormValues = [...font];
        newFormValues[i][name] = e.target.value;
        setFont(newFormValues);
    }

    let addFormFieldsFont = (id) => {
        setFont([...font, { fontName: "", fontUrl: "" }])
        setValue(`fontName[${id}]`, '');
        setValue(`fontUrl[${id}]`, '');
    }

    let removeFormFieldsFont = (i) => {
        let fontsData = font.filter((fruit, index) => index !== i);
        // setValue(`fontName[${i}]`, '');
        // setValue(`fontUrl[${i}]`, '');
        fontsData.map((item, index) => {
            setValue(`fontName[${index}]`, item.fontName);
            setValue(`fontUrl[${index}]`, item.fontUrl)
        })
        setFont(fontsData)
    }

    //  for Image edit the Images inputs
    let handleChangeImage = (i, name, e) => {
        let newFormValues = [...imag];
        newFormValues[i][name] = e.target.value;
        setImag(newFormValues);
    }

    let addFormFieldsImage = (id) => {
        setImag([...imag, { imageName: "", imageUrl: "" }])
        setValue(`imagesWebsiteName[${id}]`, '');
        setValue(`imagesUrl[${id}]`, '');
    }

    let removeFormFieldsImage = (i) => {
        let imagData = imag.filter((fruit, index) => index !== i);
        // setValue(`imagesWebsiteName[${i}]`, '');
        // setValue(`imagesUrl[${i}]`, '');
        imagData.map((item, index) => {
            setValue(`imagesWebsiteName[${index}]`, item.imageName);
            setValue(`imagesUrl[${index}]`, item.imageUrl)
        })
        setImag(imagData)
    }

    //  for Technology edit the Technology inputs
    let handleChangeTech = (i, name, e) => {
        let newFormValues = [...tech];
        newFormValues[i] = e.target.value;
        setTech(newFormValues);
    }

    let addFormFieldsTech = (id) => {
        setTech([...tech, ""])
        setValue(`technical[${id}]`, '');
    }

    let removeFormFieldsTech = (i) => {
        let technicalData = tech.filter((fruit, index) => index !== i);
        // setValue(`technical[${i}]`, '');
        technicalData.map((item, index) => {
            setValue(`technical[${index}]`, item);
        })
        setTech(technicalData)
    }

    const handleSubmits = (data) => {
        
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
        formData.append('softwareType[]', defaultSoftwareType);
        formData.append('sourceFilePassword', data.sourceFilePassword);
        formData.append('variant', data.variant);
        formData.append('productType', data.productType);

        
        defaultIndustry.forEach(item => {
            formData.append(`industry[]`, item.industryId);
        });

        font.forEach(item => {
            formData.append(`fontName[]`, item.fontName);
            formData.append(`fontUrl[]`, item.fontUrl);
        });

        icon.forEach(item => {
            formData.append(`iconsWebsiteName[]`, item.iconName);
            formData.append(`iconsUrl[]`, item.iconUrl);
        });

        imag.forEach(item => {
            formData.append(`imagesWebsiteName[]`, item.imageName);
            formData.append(`imagesUrl[]`, item.imageUrl);
        });
    
        tech.forEach(item => {
            formData.append(`technical[]`, item);
        });

        if(templateType === 2){
            defaultSubCategory.forEach(item=>{
                formData.append('subCategory[]', item.subCategoryId);
            })
        }
        else if(templateType === 1){
            formData.append('subCategory[]', defaultDropdownSubCategory);
        }
        

        formData.append('templateid', slug);
        formData.append('removedSlider', [removedSlider]);
        formData.append('removedFullPageImage', [removedFullPageImage]);
        const localToken = localStorage.getItem('token');
        formData.append('price', data.price);

        // return;
        fetch(`http://localhost:7777/dashboard/edit/${slug}`, {
            method: "POST",
            headers: { 'token': localToken },
            body: formData
        })
            .then(response => response.json())
            .then(async result => {
                // console.log(result);
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

    const onInvalid = (errors) => console.error(errors)

    return (
        <>
            <form style={{ maxWidth: "800px", width: "100%", paddingLeft: "15px", paddingRight: "15px"  }} encType="multipart/form-data" onSubmit={handleSubmit(handleSubmits, onInvalid)}>
                <h1>{mainProduct?.name}</h1>
                <FormControl fullWidth sx={{ mt: 5 }} >
                    <InputLabel id="categorySelect">Select Template Type</InputLabel>
                    <Select label="category" name="category" value={templateType} disabled InputLabelProps={{
                        shrink: true,
                    }} labelId="categorySelect" {...register('category')}>
                        {masterCategory !== undefined && masterCategory.length > 0 && masterCategory.map((item) => {
                            return <MenuItem key={item?.id} value={item?.id}>{item?.category}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                {templateType === 1 ? <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="subCategorySelect">Template SubCategory</InputLabel>
                    <Select label="Template SubCategory" {...register("subCategory")} name="subCategory" labelId="subCategorySelect" value={defaultDropdownSubCategory} onChange={(e) => { setDefaultDropdownSubCategory(e.target?.value) }}>
                        {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {
                            return <MenuItem value={item?.id}>{item?.subCategory}</MenuItem>
                        })}
                    </Select>
                </FormControl> : <Box sx={{ mt: 2 }}>
                    <h3>Technology Type</h3>
                    {masterSubCategory !== undefined && masterSubCategory.length > 0 && masterSubCategory.map((item) => {

                        let subcategory = defaultSubCategory.filter((e) => {
                            return e.subCategoryId === item?.id
                        })
                        let checked = subcategory.length > 0 ? true : false;

                        return <><Checkbox name="subCategory" id={item?.subCategory} value={item?.id} {...register("subCategory", { required:true})} checked={checked} onChange={(e) => {
                            if (e.target.checked === true) {
                                let obj = {
                                    "subcategory": { subCategory: e.target.id, categoryId: e.target.id },
                                    "subCategoryId": parseInt(e.target.value),
                                    "templateindrustyId": null
                                }
                                setDefaultSubCategory([...defaultSubCategory, obj])
                            }
                            else {

                                let dataSbcategory = defaultSubCategory.filter((a) => {
                                    return a.subCategoryId !== parseInt(e?.target?.value)
                                })
                                setDefaultSubCategory(dataSbcategory)
                            }

                        }} />    <label htmlFor={item?.subCategory}>{item?.subCategory}</label></>
                    })}
                    {errors.subCategory && <p style={{ color: 'red' }}>{errors.subCategory.message}</p>}
                </Box>}

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="softwareTypeSelect">{templateType === 1 ? 'Software Type' : 'Software Version'} </InputLabel>
                    <Select label="Software Type" {...register("softwareType")} name="softwareType" labelId="softwareTypeSelect" value={defaultSoftwareType} onChange={(e) => { setDefaultSoftwareType(e.target?.value) }}>
                        {masterSoftwareType !== undefined && masterSoftwareType.length > 0 && masterSoftwareType.map((item) => {
                            return <MenuItem value={item?.id}>{item?.softwareType}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                {templateType === 2 &&
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="productTypeSelect">Product Type</InputLabel>
                        <Select label="Product Type" {...register('productType')} name="productType" labelId="softwareTypeSelect" value={defaultProductType} onChange={(e) => { setDefaultProductType(e.target?.value) }}>
                            {masterProductType !== undefined && masterProductType.length > 0 && masterProductType.map((item) => {
                                return <MenuItem value={item?.type}>{item?.type}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                }

                <Box sx={{ mt: 2 }}>
                    <h3>Indrusty</h3>
                    {masterIndustry !== undefined && masterIndustry.length > 0 && masterIndustry.map((item) => {
                        let industry = defaultIndustry.filter((e) => {
                            return e.industryId === item?.id
                        })
                        let checked = industry.length > 0 ? true : false;
                        return <><Checkbox name="industry" id={item?.industry} {...register('industry')} value={item?.id} checked={checked} onChange={(e) => {
                            if (e.target.checked === true) {
                                let obj = {
                                    "industry": { industry: e.target.id },
                                    "industryId": parseInt(e.target.value),
                                    "templateindrustyId": null
                                }
                                setDefaultIndustry([...defaultIndustry, obj])
                            }
                            else {

                                let dataindus = defaultIndustry.filter((a) => {
                                    return a.industryId !== parseInt(e?.target?.value)
                                })
                                setDefaultIndustry(dataindus)
                            }

                        }} /><label htmlFor={item?.industry}>{item?.industry}</label></>
                    })}
                    {errors.industry && <p style={{ color: 'red' }}>{errors.industry.message}</p>}
                </Box>

                <TextField fullWidth label="Name" variant="outlined" type="text" sx={{ mt: 2 }} InputLabelProps={{
                    shrink: true,
                }} {...register('name')} name="name" />
                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}

                <TextField fullWidth label="Version" variant="outlined" type="text" sx={{ mt: 2 }} {...register('version')} InputLabelProps={{
                    shrink: true,
                }} name="version" />
                {errors.version && <p style={{ color: 'red' }}>{errors.version.message}</p>}

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginBottom: '16px' }}>Description</h2>
                    <textarea name="description" {...register('description')} InputLabelProps={{
                        shrink: true,
                    }} style={{ width: "100%", minHeight: "150px" }} />
                </Box>
                {errors.description && <p style={{ color: 'red' }}>{errors.description.message}</p>}

                <Box sx={{ mt: 2 }} >
                    <h3 style={{ marginBottom: '16px' }}>Fonts Used</h3>
                    {
                        font.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                    <Box style={{ display: 'flex', width: '100%' }} sx={{ gap: { xs: "10px", md: "20px"}, }}>
                                        <Box style={{ width: '100%' }}>
                                            <TextField fullWidth label="Font Name" variant="outlined" name={`fontName[${idx}]`} {...register(`fontName[${idx}]`, { onChange: (e) => { handleChangeFont(idx, 'fontName', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                            { errors?.fontName && <p style={{ color: 'red' }}>{errors?.fontName.message}</p>}
                                        </Box>
                                        <Box style={{ width: '100%' }}>
                                            <TextField fullWidth label="Paste Font URl here" variant="outlined" name={`fontUrl[{idx}]`} 
                                            {...register(`fontUrl[${idx}]`, {
                                                onChange: (e) => {
                                                    handleChangeFont(idx, 'fontUrl', e)
                                                }
                                            })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                            { errors?.fontUrl && <p style={{ color: 'red' }}>{errors?.fontUrl.message}</p>}
                                        </Box>
                                    </Box>
                                    {font.length > 1 &&
                                        <Box>
                                            <div className="btn-box">
                                                <button type="button" className="" onClick={() => {
                                                    removeFormFieldsFont(idx)
                                                }}>Remove </button>
                                            </div>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {font.length - 1 === idx && <button type="button" onClick={() => addFormFieldsFont(font.length)}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }

                    <h3 style={{ marginTop: '16px', marginBottom: '16px' }}>Images</h3>
                    {
                        imag.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                <Box style={{ display: 'flex', width: '100%' }} sx={{ gap: { xs: "10px", md: "20px"}, }}>
                                        <TextField fullWidth label="Image Name" variant="outlined" name={`imagesWebsiteName[${idx}]`}
                                            {...register(`imagesWebsiteName[${idx}]`, { onChange: (e) => { handleChangeImage(idx, 'imageName', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                            
                                        <TextField fullWidth label="Paste Image URl here" variant="outlined" name={`imagesUrl[${idx}]`}
                                            {...register(`imagesUrl[${idx}]`, { onChange: (e) => { handleChangeImage(idx, 'imageUrl', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                    </Box>
                                    {imag.length > 1 && <Box>
                                        <div className="btn-box">
                                            <button type="button" className="" onClick={() => {
                                                removeFormFieldsImage(idx)
                                            }}>Remove </button>
                                        </div>
                                    </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {imag.length - 1 === idx && <button type="button" onClick={() => addFormFieldsImage(imag.length)}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }

                    <h3 style={{ marginTop: '16px', marginBottom: '16px' }}>Icons</h3>
                    {
                        icon.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>

                                <Box style={{ display: 'flex', width: '100%' }} sx={{ gap: { xs: "10px", md: "20px"}, }}>
                                        <TextField fullWidth label="Icon Name" variant="outlined" name={`iconsWebsiteName[${idx}]`}
                                            {...register(`iconsWebsiteName[${idx}]`, { onChange: (e) => { handleChange(idx, 'iconName', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                        <TextField fullWidth label="Paste Icon URl here" variant="outlined" name={`iconsUrl[${idx}]`}
                                            {...register(`iconsUrl[${idx}]`, { onChange: (e) => { handleChange(idx, 'iconUrl', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                    </Box>

                                    {icon.length > 1 &&
                                        <Box>
                                            <Box className="btn-box">
                                                <button type="button" className="" onClick={() => {
                                                    removeFormFields(idx)
                                                }} >Remove </button>
                                            </Box>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {icon.length - 1 === idx && <button type="button" onClick={() => addFormFields(icon.length)}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginTop: '16px', marginBottom: '16px' }}>Technical Details</h2>
                    {
                        tech.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                    <Box style={{ display: 'flex', gap: '20px', width: '100%' }}>
                                        <TextField fullWidth label="Tech Name" variant="outlined" name={`technical[${idx}]`}
                                            {...register(`technical[${idx}]`, { onChange: (e) => { handleChangeTech(idx, 'technical', e) } })} InputLabelProps={{
                                                shrink: true,
                                            }} />
                                    </Box>
                                    {tech.length > 1 &&
                                        <Box>
                                            <div className="btn-box">
                                                <button type="button" className="" onClick={() => {
                                                    removeFormFieldsTech(idx)
                                                }}>Remove </button>
                                            </div>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {tech.length - 1 === idx && <button type="button" onClick={() => addFormFieldsTech(tech.length)}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }

                </Box>

                <h2 style={{ marginTop: '16px' }}>Product Variant</h2>
                <TextField fullWidth label="variant" variant="outlined" type="text" sx={{ mt: 2 }} InputLabelProps={{
                    shrink: true,
                }} {...register('variant')} name="variant" />
                {errors.variant && <p style={{ color: 'red' }}>{errors.variant.message}</p>}


                <Box sx={{ mt: 2 }}>Source File</Box>
                <input variant="outlined" type="file" {...register("sourceFile")} name="sourceFile" />
                {errors.sourceFile && <p style={{ color: 'red' }}>{errors.sourceFile.message}</p>}

                <Box sx={{ mt: 2 }}>Source File Password</Box>
                <TextField fullWidth variant="outlined" type="text" {...register('sourceFilePassword')} name="sourceFilePassword" InputLabelProps={{
                    shrink: true,
                }} />
                {errors.sourceFilePassword && <p style={{ color: 'red' }}>{errors.sourceFilePassword.message}</p>}

                <Box sx={{ mt: 2 }}>Slider Images</Box>
                <input variant="outlined" type="file" multiple={true} name="sliderImages" {...register("sliderImages")} />
                {errors.sliderImages && <p style={{ color: 'red' }}>{errors.sliderImages.message}</p>}
                <Box>
                    <ImageList sx={{ width: 500 }} cols={3} rowHeight={164}>
                        {sliderImages.map((item) => (
                            <ImageListItem key={item.filename}>
                                <img
                                    src={`http://localhost:7777/upload/${item.filename}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.filename}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    loading="lazy"
                                />
                                <ImageListItemBar
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about`}

                                        >
                                            <CancelIcon onClick={(e) => {
                                                setSliderImages(sliderImages.filter(e => e.id !== item.id));
                                                setRemoveSlider(oldArray => [...oldArray, item.id]);
                                            }
                                            } />
                                        </IconButton>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>

                <Box sx={{ mt: 2 }}>Full page Images</Box>
                <input variant="outlined" type="file" multiple={true} name="fullPageImages" {...register("fullPageImages")} />
                {errors.fullPageImages && <p style={{ color: 'red' }}>{errors.fullPageImages.message}</p>}
                <Box>
                    <ImageList sx={{ width: 500 }} cols={3} rowHeight={164}>
                        {fullPageImages.map((item) => (
                            <ImageListItem key={item.filename}>
                                <ImageListItemBar
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about`}
                                        >
                                            <CancelIcon onClick={(e) => {
                                                setFullPageImages(fullPageImages.filter(e => e.id !== item.id));
                                                setRemovedFullPageImage(oldArray => [...oldArray, item.id]);
                                            }
                                            } />
                                        </IconButton>
                                    }
                                />
                                <img
                                    src={`http://localhost:7777/upload/${item.filename}?w=164&h=164&fit=crop&auto=format`}
                                    srcSet={`${item.filename}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Box>

                <Box sx={{ mt: 2 }}>SEO Keywords</Box>
                <TextField fullWidth label="SEO Keywords" variant="outlined" type="text" InputLabelProps={{
                    shrink: true,
                }} sx={{ mt: 2 }} {...register('seoKeywords')} name="seoKeywords" />
                {errors.seoKeywords && <p style={{ color: 'red' }}>{errors.seoKeywords.message}</p>}

                <Box sx={{ mt: 2 }} >
                    Paid
                    <Checkbox checked={paid} onChange={() => setPaid(!paid)} name="paid" />
                    {paid && <TextField fullWidth label="Price in Doller" variant="outlined" type="number" {...register('price')} name="price" InputLabelProps={{
                        shrink: true,
                    }} />}


                </Box>

                <Button variant="contained" size="large" sx={{ mt: 3 }} type="submit">Submit</Button>
            </form>
        </>
    )
}

EditProduct.getLayout = function getLayout(page) {
    return (<Layout variant="Dashboard">{page}</Layout>)
};




