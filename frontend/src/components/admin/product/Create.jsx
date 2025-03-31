import React, { useEffect, useMemo, useRef, useState } from 'react'
import Layout from '../../common/Layout'
import Sidebar from '../../common/Sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { adminToken, apiUrl } from '../../common/http'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import JoditEditor from 'jodit-react'


const Create = ({ placeholder }) => {

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [disable, setDisable] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [sizes, setSizes] = useState([])
    const [sizesChecked, setSizesChecked] = useState([])
    const [gallery, setGallery] = useState([])
    const [galleryImages, setGalleryImages] = useState([])
    const navigate = useNavigate();

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || ''
    }),
    [placeholder]
)
    const {
            register,
            handleSubmit,
            watch,
            setError,
            formState: { errors },
        } = useForm();

    const fetchzSizes = async () => {
        const res = await fetch(`${apiUrl}/sizes`,{
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${adminToken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
        setSizes(result.data)
        })
    }

    const saveProduct = async (data) => {
        const formData = { ...data, "description": content, "gallery": gallery}
        setDisable(true);
        console.log(data)
        const res = await fetch(`${apiUrl}/products`,{
            method: 'POST',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${adminToken()}`
            },
            body: JSON.stringify(formData)
        })
        .then(res => res.json())
        .then(result => {
            setDisable(false);
            if(result.status == 200){
                toast.success(result.message);
                navigate('/admin/products')
            } else {
                const formErrors = result.errors;
                Object.keys(formErrors).forEach((field) => {
                    setError(field, { message: formErrors[field][0] });
                })
            }
        })
    }

    const fetchCategories = async () => {
        const res = await fetch(`${apiUrl}/categories`,{
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${adminToken()}`
            },
            
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setCategories(result.data)
        })
    }

    const fetchBands = async () => {
        const res = await fetch(`${apiUrl}/brands`,{
            method: 'GET',
            headers: {
                'Content-type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${adminToken()}`
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            setBrands(result.data)
        })
    }

    const handleFile = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append("image",file);
        setDisable(true)

        const res = await fetch(`${apiUrl}/temp-images`,{
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${adminToken()}`
            },
            body: formData
        })
        .then(res => res.json())
        .then(result => {
            gallery.push(result.data.id); 
            setGallery(gallery)

            galleryImages.push(result.data.image_url)
            setGalleryImages(galleryImages)
            setDisable(false)
            e.target.value = ""
        })
    }

    const deleteImage = (image) => {
        const newGallery = galleryImages.filter(gallery => gallery != image)
        setGalleryImages(newGallery)
    }
    useEffect(() => {
        fetchCategories();
        fetchBands();
        fetchzSizes();
    }, [])
    
  return (
    <Layout>
        <div className="container">
            <div className="row">
                <div className="d-flex justify-content-between mt-5 pb-3">
                    <h4 className='h4 pb-0 mb-0'>Product / Create</h4>
                    <Link to="/admin/products" className='btn btn-primary'>back</Link>
                </div>
                <div className="col-md-3">
                    <Sidebar/>
                </div>
                <div className="col-md-9">
                    <form onSubmit={handleSubmit(saveProduct)}>
                        <div className='card shadow'>
                            <div className='card-body p-4'>
    	                        <div className="mb-3">
                                    <label htmlFor="" className='form-label'>
                                        Title
                                    </label>
                                    <input 
                                    {
                                        ...register('title',{
                                            required : 'The title field is required!!!'
                                        })
                                    }
                                    type="text" 
                                    className={`form-control ${errors.title && 'is-invalid'}`} 
                                    placeholder='Title'/>
                                    {
                                        errors.title && 
                                        <p className='invalid-feedback'>{errors.title?.message}</p>
                                    }
                                </div>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor="">Category</label>
                                            <select 
                                            {
                                                ...register('category',{
                                                    required : 'Plz select a Category!!!'
                                                })
                                            }
                                            className={`form-control ${errors.category && 'is-invalid'}`} 
                                            >
                                                <option value="">Select a Category</option>
                                                {
                                                    categories && categories.map((category) => {
                                                        return (
                                                            <option key={`category-${category.id}`} value={category.id}>{category.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            {
                                                errors.category && 
                                                <p className='invalid-feedback'>{errors.category?.message}</p>
                                            }   
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className='mb-3'>
                                            <label className='form-label' htmlFor="">Brand</label>
                                            <select 
                                            {
                                                ...register('brand')
                                            }
                                            className='form-control'
                                            >
                                                <option value="">Select a Brand</option>
                                                {
                                                    brands && brands.map((brand) => {
                                                        return (
                                                            <option key={`brand-${brand.id}`} value={brand.id}>{brand.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label htmlFor="" className='form-label'>
                                        Short Description
                                    </label>

                                    <textarea 
                                    {
                                        ...register('short_description')
                                    }
                                    className='form-control' placeholder='Short Description' rows={3}></textarea>
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="" className='form-label'>Description</label>
                                    <JoditEditor
                                        ref={editor}
                                        value={content}
                                        config={config}
                                        tabIndex={1} // tabIndex of textarea
                                        onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                    />
                                </div>
                                
                                <h3 className='py-3 border-bottom mb-3'>Pricing</h3>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Price</label>
                                            <input 
                                            {
                                                ...register('price',{
                                                    required : 'The Price field is required!!!'
                                                })
                                            }
                                            className={`form-control ${errors.price && 'is-invalid'}`}
                                            type="text" 
                                            placeholder='Price'/>
                                            {
                                                errors.price && 
                                                <p className='invalid-feedback'>{errors.price?.message}</p>
                                            }  
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Discounted Price</label>
                                            <input 
                                            {
                                                ...register('compare_price')
                                            }
                                            type="text" placeholder='Discounted Price' className='form-control'/>
                                        </div>
                                    </div>
                                </div>
                                <h3 className='py-3 border-bottom mb-3'>Inventory</h3>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>SKU</label>
                                            <input 
                                            {
                                                ...register('sku',{
                                                    required : 'The sku field is required!!!'
                                                })
                                            }
                                            className={`form-control ${errors.sku && 'is-invalid'}`}
                                            type="text" placeholder='Sku'/>
                                            {
                                                errors.sku && 
                                                <p className='invalid-feedback'>{errors.sku?.message}</p>
                                            }  
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Barcode</label>
                                            <input 
                                            {
                                                ...register('barcode')
                                            }
                                            type="text" placeholder='Barcode' className='form-control'/>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="" className='form-label'>Qty</label>
                                            <input 
                                            {
                                                ...register('qty')
                                            }
                                            type="text" placeholder='Qty' className='form-control'/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                        <label htmlFor="" className='form-label'>
                                            Status
                                        </label>
                                        <select 
                                        {
                                            ...register('status',{
                                                required : 'Plz select a status'
                                            })
                                        }
                                        className={`form-control ${errors.status && 'is-invalid'}`}
                                        >
                                            <option value="">Select a Status</option>
                                            <option value="1">Active</option>
                                            <option value="0">Block</option>
                                        </select>
                                        {
                                            errors.status && 
                                            <p className='invalid-feedback'>{errors.status?.message}</p>
                                        }
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="mb-3">
                                    <label htmlFor="" className='form-label'>
                                        Featured
                                    </label>
                                    <select 
                                    {
                                        ...register('is_featured',{
                                            required : 'The field is required'
                                        })
                                    }
                                    className={`form-control ${errors.is_featured && 'is-invalid'}`}
                                    >
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                    {
                                        errors.is_featured && 
                                        <p className='invalid-feedback'>{errors.is_featured?.message}</p>
                                    }
                                </div>
                                
                                <div className='mb-3'>
                                  <label htmlFor="" className='form-label'>
                                        Sizes
                                    </label>
                                  {
                                    sizes && sizes.map(size => {
                                      return (
                                        <div className="form-check-inline ps-2" key={`psize-${size.id}`}>
                                          <input 
                                          {
                                            ...register("sizes")
                                          }
                                          checked={sizesChecked.includes(size.id)}
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setSizesChecked([...sizesChecked,size.id])
                                            } else {
                                              setSizesChecked(sizesChecked.filter(sid => size.id != sid))
                                            }
                                          }}
                                          className='from-check-input' 
                                          type="checkbox" 
                                          value={size.id} 
                                          id={`size-${size.id}`} />
                                          <label className='form-check-label' htmlFor="{`size-${size.id}`}">
                                            {size.name}
                                          </label>
                                        </div>
                                      )
                                    })
                                  }
                                </div>

                                <h3 className='py-3 border-bottom mb-3'>Gallery</h3>
                                <div className="mb-3">
                                    <label htmlFor="" className='form-label'>Image</label>
                                    <input 
                                        onChange={handleFile}
                                        type="file"  
                                        className='form-control'
                                    />
                                </div>
                                <div className='mb-3'>
                                    <div className='row'>
                                        {
                                            galleryImages && galleryImages.map((image,index) => {
                                                return (
                                                    <div className='col-md-3' key={`image-${index}`}>
                                                        <div className='card shadow'>
                                                            <img src={image} alt="" className='w-100'/>
                                                        </div>
                                                        <button className='btn btn-danger mt-3 w-100' onClick={() => deleteImage(image)}>Delete</button>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button 
                        disabled={disable}
                        type='submit' className='btn btn-primary mt-3 mb-5'>Create</button>
                    </form>
                </div>
            </div>
        </div>
    </Layout>
  )
}

export default Create