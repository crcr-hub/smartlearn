import React, { useEffect, useState } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourse, updateCourse, viewCategory } from '../../../redux/authSlices';
import { useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';

function TeacherUpdateCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
      const [image, setImage] = useState(null);
        const [croppedImage, setCroppedImage] = useState(null);
        const [crop, setCrop] = useState({ x: 0, y: 0 });
        const [zoom, setZoom] = useState(1);
        const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const { id } = useParams(); // Get course ID from URL params
    const { category, loading, error } = useSelector((state) => state.auth);
    const { user:teacher } = useSelector((state) => state.auth);
    const { course, courseLoading, courseError } = useSelector((state) => state.auth); // Assuming course details are in state
  
    // console.log("iiiiii",id,course,teacher,category)
    // States for course data
    const [courseData, setCourseData] = useState({
      category: "",
      category_title: "", // Add category title
      teacher:teacher?.profile_id,
      name: "",
      description: "",
      requirements: "",
      image: null,
      price:null,
      offer_price:null,
      cover_text:""
    });

useEffect(() => {
        dispatch(viewCategory());
        if (id) {
          dispatch(fetchCourse(id)); // Fetch the course data to edit
        }
      }, [dispatch, id]);



      useEffect(() => {
        if (course) {
         
          setCourseData((prev) => ({
            ...prev,
            category: course.course?.category || "",
            name: course.course?.name || "",
            description: course.course?.description || "",
            category_title: course.course?.category_title || "", 
            requirements: course.course?.requirements || "",
            image: course.course?.images || null, // Pre-load image if it exists
            price:course.course?.price || null,
            offer_price:course.course?.offer_price || null,
            cover_text:course.course?.cover_text || ""
          }));
          setImage(course.image); // Set image for cropping if exists
        }
      }, [course]);
    
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
                const croppedFile = await getCroppedImage();
                setCourseData({ ...courseData, image: croppedFile });
                const updatedCourseData = { ...courseData, image: croppedFile,role:'teacher' };
              
                console.log("Updated Course Data:", updatedCourseData);
                // Use the updateCourse action instead of addCourses
                dispatch(updateCourse({ id,updatedCourseData}));
                navigate('/mycourse')
                };
       
  return (
    <div className='container mt-4'>
            <div className='row'>
            <TeacherSideBar/>
            <section className='col-md-9'>
                <h5>Update Your Course</h5>
                <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
      <div><h4 style={{ marginBottom: "50px" }}>Update Course</h4></div>
      <form className="row g-3" onSubmit={handleSubmit} >
        {/* Category Selector */}
        <div className="col-md-6">
          <label htmlFor="inputState" className="form-label">Select Category</label>
          <select
            id="inputState"
            className="form-select"
            name="category"
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
          >
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

        {/* Teacher Selector */}
       

        {/* Other Fields */}
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name Of the Course</label>
          <input
            type="text"
            className="form-control"
            value={courseData.name}
            onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
            id="name"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
          ></textarea>
        </div>
        <div className="col-md-6">
          <label htmlFor="description" className="form-label">Cover Text</label>
          <textarea
            className="form-control"
            id="description"
            rows="3"
            value={courseData.cover_text}
            onChange={(e) => setCourseData({ ...courseData, cover_text: e.target.value })}
          ></textarea>
        </div>

        <div className="col-md-6">
          <label htmlFor="requirements" className="form-label">Requirements</label>
          <textarea
            className="form-control"
            id="requirements"
            rows="3"
            value={courseData.requirements}
            onChange={(e) => setCourseData({ ...courseData, requirements: e.target.value })}
          ></textarea>
        </div>


          <div className="col-md-6">
                <label htmlFor="description" className="form-label">Price</label>
                <input type='text' className="form-control" id="description" rows="3" value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}></input>
            </div>

            <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Offer Price</label>
                <input type='text' className="form-control" id="requirements" rows="3" value={courseData.offer_price}
                    onChange={(e) => setCourseData({ ...courseData, offer_price: e.target.value })}></input>
          </div>
       

        <div className="col-mb-6">
        {courseData.image ? (
                    <img src={`https://mysmartlearn.com/${courseData.image}`} // Path to the image
                    alt={`Course ${courseData.name}`} // Alt text for the image
                    style={{ width: '50px', height: '50px' }} // Styling for the image
                        />
                ) : ("No Image" )}
        </div>


        <div className="col-mb-6">
          <label htmlFor="formFileMultiple" className="form-label">Select Image</label>
          <input className="form-control" type="file" accept="images/*" onChange={handleFileChange}  />
       


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

        <div className="controls">
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            nChange={(e) => setZoom(e.target.value)}
          />
        </div>
        </div>
        {/* Submit Button */}
        <div className="col-10">
          <button type="submit" className="btn btn-primary">Update Course</button>
        </div>
      </form>
    </div>
            </section>

                </div>
                
            </div>
  )
}

export default TeacherUpdateCourse
