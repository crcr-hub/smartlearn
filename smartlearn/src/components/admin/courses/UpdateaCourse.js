import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { addCourses, viewCategory, viewTeachers, getCourseDetails, updateCourse, fetchCourse, fetchCategory } from '../../../redux/authSlices'; // Assuming getCourseDetails and updateCourse are defined in your slice


function UpdateaCourse() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // Get course ID from URL params
  
    // States for course data
    const [courseData, setCourseData] = useState({
      category: "",
      teacher: "",
      name: "",
      description: "",
      requirements: "",
      image: "",
    });
  
    const { category, loading, error } = useSelector((state) => state.auth);
    const { user, loading: teacherLoading, error: teacherError } = useSelector((state) => state.auth);
    const { course, courseLoading, courseError } = useSelector((state) => state.auth); // Assuming course details are in state
  
    // States for cropping
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    // Fetch categories, teachers, and course details on mount
    useEffect(() => {
     console.log(course)
      dispatch(viewCategory());
      dispatch(viewTeachers());
    
      if (id) {
        dispatch(fetchCourse(id)); // Fetch the course data to edit
      }
    }, [dispatch, id]);
  
    useEffect(() => {
      console.log("hhhhhh",course)
      if (course && course.course) {
        const { name, description, category, teacher, images, requirements, price, offer_price } = course.course;
       
        setCourseData({
          name: name || "",
          description: description || "",
          category   : category || "",
          teacher : teacher || "",
          image : images || "",
          requirements : requirements || "",
          price : price || null,
          offer_price:offer_price || null,
        });
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
      const updatedCourseData = { ...courseData, image: croppedFile };
  
      // Use the updateCourse action instead of addCourses
      dispatch(updateCourse({ id,updatedCourseData, navigate }));
    };

  return (
<div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
      <div><h4 style={{ marginBottom: "50px" }}>Update Course</h4></div>
      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Category Selector */}
        {/* <div className="col-md-6">
          <label htmlFor="inputState" className="form-label">Select Category</label>
          <select
            id="inputState"
            className="form-select"
            name="category"
            value={courseData.category}
            onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
          >
           
           
              <option>Loading...</option>
         
              <option>Error loading categories</option>
        
          
                <option>
                
                </option>
           
          </select>
        </div> */}


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
        <div className="col-md-6">
          <label htmlFor="inputState" className="form-label">Select a Tutor</label>
          <select
            id="inputState"
            className="form-select"
            name="teacher"
            value={courseData.teacher}
            onChange={(e) => setCourseData({ ...courseData, teacher: e.target.value })}
          >
            <option value="">Choose...</option>
            {teacherLoading ? (
              <option>Loading...</option>
            ) : teacherError ? (
              <option>Error loading tutors</option>
            ) : (
              user.map((teacher) => (
                <option key={teacher.profile.id} value={teacher.profile.id}>
                  {teacher.profile.first_name} {teacher.profile.last_name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Other Fields */}
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name</label>
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
                    <img src={`http://localhost:8000${courseData.image}`} // Path to the image
                    alt={`Course ${courseData.name}`} // Alt text for the image
                    style={{ width: '50px', height: '50px' }} // Styling for the image
                        />
                ) : ("No Image" )}
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
          <button type="submit" className="btn btn-primary">Update Course</button>
        </div>
      </form>
    </div>
  )
}

export default UpdateaCourse
