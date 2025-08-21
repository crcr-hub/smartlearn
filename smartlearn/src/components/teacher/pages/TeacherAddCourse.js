import React, { useEffect, useState } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { addCourses, saveCourse, viewCategory } from '../../../redux/authSlices';
import Cropper from 'react-easy-crop';

function TeacherAddCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user:teacher } = useSelector((state) => state.auth);
    const teacherProfileId = teacher?.profile_id;
    const [errors, setErrors] = useState({});
    const [courseData, setCourseData] = useState({
      category: "",
      teacher: teacherProfileId,
      name: "",
      description: "",
      requirements: "",
      image: null,
      price:null,
      offer_price:null,
      cover_text:""
    });
  
    const { category, loading, error } = useSelector((state) => state.auth);
    const validateForm = () => {
      let newErrors = {};
    
      if (!courseData.category) newErrors.category = "Category is required";
      if (!courseData.name) newErrors.name = "Course title is required";
      if (!courseData.description) newErrors.description = "Description is required";
      if (!courseData.cover_text) newErrors.cover_text = "Cover text is required";
      if (!courseData.requirements) newErrors.requirements = "Requirements are required";
      if (!courseData.price) newErrors.price = "Price is required";
      if (!courseData.offer_price) newErrors.offer_price = "Offer price is required";
     
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // Returns true if no errors
    };
    
  
    // States for cropping
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    useEffect(() => {
      dispatch(viewCategory());
    }, [dispatch]);
  
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    };
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const getCroppedImage = async () => {
      if (image && croppedAreaPixels) {
        const canvas = document.createElement('canvas');
        const img = new Image();
        img.src = image;
  
        return new Promise((resolve) => {
          img.onload = () => {
            const ctx = canvas.getContext('2d');
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            ctx.drawImage(
              img,
              croppedAreaPixels.x,
              croppedAreaPixels.y,
              croppedAreaPixels.width,
              croppedAreaPixels.height,
              0,
              0,
              croppedAreaPixels.width,
              croppedAreaPixels.height
            );
            canvas.toBlob((blob) => {
              const croppedFile = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
              resolve(croppedFile);
            }, 'image/jpeg');
          };
        });
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const croppedFile = await getCroppedImage();
      setCourseData({ ...courseData, image: croppedFile });
      const updatedCourseData = { ...courseData, image: croppedFile,role:'teacher' };
      const result = await dispatch(addCourses({ updatedCourseData, navigate }));
      if (addCourses.fulfilled.match(result)) {
        navigate('/mycourse');
      }
    };

    const handleAddModule = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      const croppedFile = await getCroppedImage();
      setCourseData({ ...courseData, image: croppedFile });
      const updatedCourseData = { ...courseData, image: croppedFile,role:'teacher' };
      dispatch(saveCourse({ updatedCourseData, navigate }));
    };



  return (
    <div className='container mt-4'>
            <div className='row'>
                <TeacherSideBar/>


                <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
            <div><h4 style={{ marginBottom: "50px" }}>Add Course</h4></div>
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Category Selector */}
                <span style={{color:"red"}}>Please note: 10% of the profit from each course sale will be retained by the admin.</span>
                <div className="col-md-6">
              
                <label htmlFor="inputState" className="form-label">Select Category</label>
                <select id="inputState" className="form-select" name="category" value={courseData.category}
                    onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}>
                    <option value="">Choose...</option>
                    {loading ? (
                    <option>Loading...</option>
                    ) : error ? (
                    <option>Error loading categories</option>
                    ) : (
                    category.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                        {cat.title}
                        </option>
                    ))
                    )}
                </select>
                </div>

               

                {/* Other Fields    navigate(`/add_module/${courseID.id}`);   */}
                <div className="col-md-6">
               
                <label htmlFor="name" className="form-label">Course Title</label>
                <input type="text" className="form-control" value={courseData.name}
                    onChange={(e) => setCourseData({ ...courseData, name: e.target.value })} id="name" />
                    {errors.name && <small className="text-danger">{errors.name}</small>}
                </div>

                <div className="col-md-6">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" rows="3" value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}></textarea>
                    {errors.description && <small className="text-danger">{errors.description}</small>}
                </div>

                <div className="col-md-6">
                <label htmlFor="description" className="form-label">Cover Text</label>
                <textarea className="form-control" id="description" rows="3" value={courseData.cover_text}
                    onChange={(e) => setCourseData({ ...courseData, cover_text: e.target.value })}></textarea>
                </div>

                <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Requirements</label>
                <textarea className="form-control" id="requirements" rows="3" value={courseData.requirements}
                    onChange={(e) => setCourseData({ ...courseData, requirements: e.target.value })}></textarea>
                     {errors.requirements && <small className="text-danger">{errors.requirements}</small>}
                </div>

                <div className="col-md-6">
                <label htmlFor="description" className="form-label">Price</label>
                <input type='text' className="form-control" id="description" rows="3" value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}></input>
                     {errors.price && <small className="text-danger">{errors.price}</small>}
                </div>

                <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Offer Price</label>
                <input type='text' className="form-control" id="requirements" rows="3" value={courseData.offer_price}
                    onChange={(e) => setCourseData({ ...courseData, offer_price: e.target.value })}></input>
                     {errors.offer_price && <small className="text-danger">{errors.offer_price}</small>}
                </div>

                {/* Image Upload */}
                <div className="col-mb-6">
                <label htmlFor="formFileMultiple" className="form-label">Select Image</label>
                <input className="form-control" type="file" accept="images/*" onChange={handleFileChange} />
               
                </div>

                {/* Image Cropping */}
                {image && (
                <div style={{ position: 'relative', height: 300, width: '100%' }}>
                    <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    />
                </div>
                )}

                {/* Zoom Slider */}
                <div className="controls">
                <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(e.target.value)}
                />
                </div>

                {/* Submit Button */}
                <div className="col-10">
                <button onClick={handleAddModule} style={{marginRight:"10px"}} className="btn btn-primary">Add Module</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
                </div>
            </form>
            </div>
                
                </div>
    </div>
  )
}

export default TeacherAddCourse
