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
    subcategory: Yup.string().required('This field is required'),
    variant: Yup.string().required('This field is required'),
    seoKeywords: Yup.string().required('This field is required'),
    description: Yup.string().required('This field is required'),
    sourceFilePassword: Yup.string().required('This field is required'),
    price: Yup.number().required('This field is required'),
    fonts: Yup.array().required('this field is required'),
    fontUrl: Yup.array().required('this field is required'),
    imagesWebsiteName: Yup.array().required('this field is required'),
    imagesUrl: Yup.array().required('this field is required'),
    iconsWebsiteName: Yup.array().required('this field is required'),
    iconsUrl: Yup.array().required('this field is required'),
    technical: Yup.array().required('this field is required'),
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
    const [tech, setTech] = useState([{ name: "" }]);
    const [font, setFont] = useState([{ fontName: "", fontUrl: "" }])
    const [imag, setImag] = useState([{ imagesWebsiteName: "", imagesUrl: "" }])
    const [icon, setIcon] = useState([{ name: "", iconsUrl: "" }])


    const [dltFeild, setDltFeild] = useState(0);

    const [removedSlider, setRemoveSlider] = useState([]);
    const [removedFullPageImage, setRemovedFullPageImage] = useState([]);

    const { slug } = router.query

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, control, reset, setValue, formState } = useForm(formOptions);



    // const { fields: fontfields, append: fontappend, remove: fontremove } = useFieldArray({
    //     control,
    //     name: "font"
    // });

    // const { fields: imagefields, append: imageappend, remove: imageremove } = useFieldArray({
    //     control,
    //     name: "imagesNameUrl"
    // });

    // const { fields: iconfields, append: iconappend, remove: iconremove } = useFieldArray({
    //     control,
    //     name: "icons"
    // });

    // const { fields: technicalfields, append: technicalappend, remove: technicalremove } = useFieldArray({
    //     control,
    //     name: "technical"
    // });

    
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

                        setFont(result?.data?.fonts);
                        setImag(result?.data?.images);
                        setIcon(result?.data?.icons);
                        setTech(result?.data?.technical);
                        setSliderImages(result?.data?.sliderimages);
                        setFullPageImages(result?.data?.fullimages)

                        setPaid(result?.data?.price !== null ? true : false);
                        setValue('price', result?.data?.price !== null ? result?.data?.price : '');

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
    let handleChange = (i, e) => {
        let newFormValues = [...icon];
        newFormValues[i][e.target.name] = e.target.value;
        setIcon(newFormValues);
    }

    let addFormFields = () => {
        setIcon([...icon, { iconName: "", iconUrl: "" }])
    }

    let removeFormFields = (i) => {
        console.log(i, "index of icon");
        let newFormValues = [...icon];
        newFormValues.splice(i, 1);
        setIcon(newFormValues)
    }


    //  for font edit the font inputs
    let handleChangeFont = (i, e) => {
        let newFormValues = [...font];
        newFormValues[i][e.target.name] = e.target.value;
        setFont(newFormValues);
    }

    let addFormFieldsFont = () => {
        setFont([...font, { fontName: "", fontUrl: "" }])
    }

    let removeFormFieldsFont = (i) => {
        let newFormValues = [...font];
        newFormValues.splice(i, 1);
        setFont(newFormValues)
    }


    //  for Image edit the Images inputs
    let handleChangeImage = (i, e) => {
        let newFormValues = [...imag];
        newFormValues[i][e.target.name] = e.target.value;
        setImag(newFormValues);
    }

    let addFormFieldsImage = () => {
        setImag([...imag, { imagesWebsiteName: "", imagesUrl: "" }])
    }

    let removeFormFieldsImage = (i) => {
        let newFormValues = [...imag];
        newFormValues.splice(i, 1);
        setImag(newFormValues)
    }



    //  for Technology edit the Technology inputs
    let handleChangeTech = (i, e) => {
        let newFormValues = [...tech];
        newFormValues[i][e.target.name] = e.target.value;
        setTech(newFormValues);
    }

    let addFormFieldsTech = () => {
        setTech([...tech, { name: "" }])
    }

    let removeFormFieldsTech = (i) => {
        let newFormValues = [...tech];
        newFormValues.splice(i, 1);
        setTech(newFormValues)
    }




    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        formData.append('templateid', slug);
        formData.append('removedSlider', [removedSlider]);
        formData.append('removedFullPageImage', [removedFullPageImage]);
        const localToken = localStorage.getItem('token');

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

    return (
        <>
            <form style={{ maxWidth: "800px", width: "100%" }} encType="multipart/form-data" onSubmit={handleSubmit}>
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
                    <Select label="Template SubCategory" name="subCategory" labelId="subCategorySelect" value={defaultDropdownSubCategory} onChange={(e) => { setDefaultDropdownSubCategory(e.target?.value) }}>
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

                        return <><Checkbox name="subCategory" id={item?.subCategory} value={item?.id} checked={checked} />    <label htmlFor={item?.subCategory}>{item?.subCategory}</label></>
                    })}
                </Box>}

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="softwareTypeSelect">{templateType === 1 ? 'Software Type' : 'Software Version'} </InputLabel>
                    <Select label="Software Type" name="softwareType" labelId="softwareTypeSelect" value={defaultSoftwareType} onChange={(e) => { setDefaultSoftwareType(e.target?.value) }}>
                        {masterSoftwareType !== undefined && masterSoftwareType.length > 0 && masterSoftwareType.map((item) => {
                            return <MenuItem value={item?.id}>{item?.softwareType}</MenuItem>
                        })}
                    </Select>
                </FormControl>

                {templateType === 2 &&
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="productTypeSelect">Product Type</InputLabel>
                        <Select label="Product Type" name="productType" labelId="softwareTypeSelect" value={defaultProductType} >
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
                        return <><Checkbox name="indrusty" id={item?.industry} value={item?.id} checked={checked} /><label htmlFor={item?.industry}>{item?.industry}</label></>
                    })}
                </Box>

                <TextField fullWidth label="Name" variant="outlined" type="text" sx={{ mt: 2 }} InputLabelProps={{
                    shrink: true,
                }} {...register('name')} name="name" />
                <TextField fullWidth label="Version" variant="outlined" type="text" sx={{ mt: 2 }} {...register('version')} InputLabelProps={{
                    shrink: true,
                }} name="version" />

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginBottom: '16px' }}>Description</h2>
                    <textarea name="description" {...register('description')} InputLabelProps={{
                        shrink: true,
                    }} style={{ width: "100%", minHeight: "150px" }} />
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h3 style={{ marginBottom: '16px' }}>Fonts Used</h3>
                    {
                        font.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                    <Box style={{ display: 'flex', gap: '20px', marginBottom: '10px', width: '100%' }}>
                                        <TextField fullWidth label="Font Name" variant="outlined" name="name" value={elm?.fontName} onChange={e => handleChangeFont(idx, e)}  {...register(`fontName[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                        <TextField fullWidth label="Paste Font URl here" variant="outlined" name="fontUrl" value={elm?.fontUrl} onChange={e => handleChangeFont(idx, e)} {...register(`fontUrl[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                    </Box>
                                    {font.length > 1 &&
                                        <Box>
                                            <div className="btn-box">
                                                <button className="mr10" onClick={() => {
                                                    //    removeIconField(elm)
                                                    //    console.log(idx);
                                                    //     iconremove(idx)
                                                    removeFormFieldsFont(idx)
                                                }}>Remove </button>
                                            </div>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {font.length - 1 === idx && <button onClick={() => addFormFieldsFont()}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }


                    <h3 style={{ marginTop: '16px', marginBottom: '16px' }}>Images</h3>
                    {
                        imag.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                    <Box style={{ display: 'flex', gap: '20px', marginBottom: '10px', width: '100%' }}>
                                        <TextField fullWidth label="Image Name" variant="outlined" name="name" value={elm?.imagesWebsiteName} onChange={e => handleChangeImage(idx, e)} {...register(`imagesWebsiteName[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                        <TextField fullWidth label="Paste Image URl here" variant="outlined" name="iconsUrl" value={elm?.imagesUrl} onChange={e => handleChangeImage(idx, e)} {...register(`imagesUrl[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                    </Box>
                                    {imag.length > 1 && <Box>
                                        <div className="btn-box">
                                            <button className="mr10" onClick={() => {
                                                //    removeIconField(elm)
                                                //    console.log(idx);
                                                //     iconremove(idx)
                                                removeFormFieldsImage(idx)
                                            }}>Remove </button>
                                        </div>
                                    </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {imag.length - 1 === idx && <button onClick={() => addFormFieldsImage()}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }
                    {/*    {
                        imag.map((elm, idx) => {
                            return <Box style={{ display: 'flex', gap: '50px', marginBottom: '10px' }}>
                                <TextField fullWidth label="Font Name" variant="outlined" type="text" {...register(`imagesWebsiteName[${idx}]`)} name={`imagesWebsiteName${idx}`} InputLabelProps={{
                                    shrink: true,
                                }} />
                                <TextField fullWidth label="Paste Font URl here" variant="outlined" type="text"  {...register(`imagesUrl[${idx}]`)} name={`imagesUrl${idx}`} InputLabelProps={{
                                    shrink: true,
                                }} />
                            </Box>
                        })
                    } */}


                    <h3 style={{ marginTop: '16px', marginBottom: '16px' }}>Icons</h3>
                    {console.log(icon, "====icons data")}
                    {
                        icon.map((elm, idx) => {
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>

                                    <Box style={{ display: 'flex', gap: '20px', marginBottom: '10px', width: '100%' }}>
                                        <TextField fullWidth label="Icon Name" variant="outlined" name="name" value={elm?.iconName} onChange={e => handleChange(idx, e)}  {...register(`icons.${idx}.iconsWebsiteName`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                        <TextField fullWidth label="Paste Icon URl here" variant="outlined" name="iconsUrl" value={elm?.iconUrl} onChange={e => handleChange(idx, e)} {...register(`icons.iconsUrl[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                    </Box>

                                    {icon.length > 1 &&
                                        <Box>
                                            <div className="btn-box">
                                                <button className="mr10" onClick={() => {
                                                    //    removeIconField(elm)
                                                    //    console.log(idx);
                                                    //     iconremove(idx)
                                                    removeFormFields(idx)
                                                }}>Remove </button>
                                            </div>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {icon.length - 1 === idx && <button onClick={() => addFormFields()}>Add</button>}
                                    </div>
                                </Box>
                            </div>
                        })
                    }


                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginTop: '16px' }}>Technical Details</h2>
                    {/* {console.log(tech, "==tech")} */}

                    {
                        tech.map((elm, idx) => {
                            console.log(elm.name, "techelm")
                            return <div className="box" key={elm?.id}>
                                <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'space-between', alignItems: 'center' }} style={{ display: dltFeild === false ? 'none' : 'flex' }}>
                                    <Box style={{ display: 'flex', gap: '20px', marginBottom: '10px', width: '100%' }}>
                                        <TextField fullWidth label="Tech Name" variant="outlined" name="name" value={elm} onChange={e => handleChangeTech(idx, e)} {...register(`technical[${idx}]`)} InputLabelProps={{
                                            shrink: true,
                                        }} />
                                    </Box>
                                    {tech.length > 1 &&
                                        <Box>
                                            <div className="btn-box">
                                                <button className="mr10" onClick={() => {
                                                    //    removeIconField(elm)
                                                    //    console.log(idx);
                                                    //     iconremove(idx)
                                                    removeFormFieldsTech(idx)
                                                }}>Remove </button>
                                            </div>
                                        </Box>
                                    }

                                </Box>
                                <Box style={{ textAlign: 'right' }}>
                                    <div className="btn-box">
                                        {tech.length - 1 === idx && <button onClick={() => addFormFieldsTech()}>Add</button>}
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

                <Box sx={{ mt: 2 }}>Source File</Box>
                <input variant="outlined" type="file" name="sourceFile" />

                <Box sx={{ mt: 2 }}>Source File Password</Box>
                <TextField fullWidth variant="outlined" type="text" {...register('sourceFilePassword')} name="sourceFilePassword" InputLabelProps={{
                    shrink: true,
                }} />

                <Box sx={{ mt: 2 }}>Slider Images</Box>
                <input variant="outlined" type="file" multiple={true} name="sliderImages" />

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
                <input variant="outlined" type="file" multiple={true} name="fullPageImages" />

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