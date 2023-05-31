import { useEffect, useState } from "react"
import Layout from "../../layout";
import { useRouter } from "next/router";
import { FormControl, InputLabel, MenuItem, Select, Box, TextField, Checkbox, Button } from "@mui/material";
import { useForm } from 'react-hook-form';
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
    price: Yup.string().required('This field is required'),
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
    const [defaultProductType, setDefaultProductType] = useState(1);
    const [defaultIndustry, setDefaultIndustry] = useState([]);
    const [sliderImages, setSliderImages] = useState([]);
    const [fullPageImages, setFullPageImages] = useState([]);

    const [removedSlider, setRemoveSlider] = useState([]);
    const [removedFullPageImage, setRemovedFullPageImage] = useState([]);

    const { slug } = router.query

    const formOptions = { resolver: yupResolver(validationSchema) };

    const { register, reset, setValue, formState } = useForm(formOptions);

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
            await fetch(`http://localhost:7777/api/dashboard/detail/${slug}`, {
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

                        setSliderImages(result?.data?.sliderimages);
                        setFullPageImages(result?.data?.fullimages)

                        setPaid(result?.data?.price !== null ? true : false);
                        setValue('price', result?.data?.price !== null ? result?.data?.price : '');

                        setTemplateType(parseInt(result?.data?.templatecategories[0]?.categoryId));

                        setDefaultProductType(result?.data?.producttype);

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
                    alert(`There is some Error Please Try Again later`)
                })
        } catch (error) {

        }
    }

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

    const getSubcategory = async (id) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`http://localhost:7777/api/subcategory/getById?id=${id}`, {
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

    const getSoftwareType = async (id) => {
        try {
            const localToken = localStorage.getItem('token');
            await fetch(`http://localhost:7777/api/software/getByCategoryId?id=${id}`, {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('templateid', slug);
        formData.append('removedSlider', [removedSlider]);
        formData.append('removedFullPageImage',[removedFullPageImage]);
        const localToken = localStorage.getItem('token');

        // return;
        fetch(`http://localhost:7777/dashboard/edit/${slug}`, {
            method: "POST",
            headers: { 'token': localToken },
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
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Font Name" variant="outlined" type="text" {...register('fontName[0]')} name="fontName[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Font URl here" variant="outlined" type="text" {...register('fontUrl[0]')} name="fontUrl[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Font Name" variant="outlined" type="text" sx={{ mt: 2 }} {...register('fontName[1]')} name="fontName[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Font URl here" variant="outlined" type="text" {...register('fontUrl[1]')} sx={{ mt: 2 }} name="fontUrl[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>

                    <h3 style={{ marginTop: '16px' }}>Images</h3>
                    <Box style={{ display: 'flex', gap: '50px' }}>
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} {...register('imagesWebsiteName[0]')} name="imagesWebsiteName[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} {...register('imagesUrl[0]')} name="imagesUrl[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Image Name" variant="outlined" type="text" sx={{ mt: 2 }} {...register('imagesWebsiteName[1]')} name="imagesWebsiteName[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Image URl here" variant="outlined" type="text" sx={{ mt: 2 }} {...register('imagesUrl[1]')} name="imagesUrl[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <h3 style={{ marginTop: '16px' }}>Icons</h3>
                    <Box style={{ display: 'flex', gap: '50px' }} >

                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} {...register('iconsWebsiteName[0]')} name="iconsWebsiteName[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Icon URL here" variant="outlined" type="text" sx={{ mt: 2 }} {...register('iconsUrl[0]')} name="iconsUrl[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="Icon Name" variant="outlined" type="text" sx={{ mt: 2 }} {...register('iconsWebsiteName[0]')} name="iconsWebsiteName[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="Paste Icon URl here" variant="outlined" type="text" sx={{ mt: 2 }} {...register('iconsUrl[1]')} name="iconsUrl[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }} >
                    <h2 style={{ marginTop: '16px' }}>Technical Details</h2>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item1" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[0]')} name="technical[0]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="item2" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[1]')} name="technical[1]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item3" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[2]')} name="technical[2]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="item4" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[3]')} name="technical[3]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
                    <Box style={{ display: 'flex', gap: '50px' }} >
                        <TextField fullWidth label="item5" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[4]')} name="technical[4]" InputLabelProps={{
                            shrink: true,
                        }} />
                        <TextField fullWidth label="item6" variant="outlined" type="text" sx={{ mt: 2 }} {...register('technical[5]')} name="technical[5]" InputLabelProps={{
                            shrink: true,
                        }} />
                    </Box>
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
                                            }/>
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
                                            }/>
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