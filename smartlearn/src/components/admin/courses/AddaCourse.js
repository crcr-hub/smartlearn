
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { addCourses, viewCategory, viewTeachers } from '../../../redux/authSlices';


function AddaCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState({
      category: "",
      teacher: "",
      name: "",
      description: "",
      requirements: "",
      image: "",
    });
  
    const { category, loading, error } = useSelector((state) => state.auth);
    const { user,  error: teacherError } = useSelector((state) => state.auth);
  
    // States for cropping
    const [image, setImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
    useEffect(() => {
      dispatch(viewCategory());
      dispatch(viewTeachers());
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
      const croppedFile = await getCroppedImage();
      setCourseData({ ...courseData, image: croppedFile });
      const updatedCourseData = { ...courseData, image: croppedFile };
      dispatch(addCourses({ updatedCourseData, navigate }));
    };
  return (
        <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
            <div><h4 style={{ marginBottom: "50px" }}>Add Course</h4></div>
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Category Selector */}
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

                {/* Teacher Selector */}
                <div className="col-md-6">
                <label htmlFor="inputState" className="form-label">Select a Tutor</label>
                <select id="inputState" className="form-select" name="teacher" value={courseData.teacher}
                    onChange={(e) => setCourseData({ ...courseData, teacher: e.target.value })}>
                    <option value="">Choose...</option>
                    {loading ? (
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
                <input type="text" className="form-control" value={courseData.name}
                    onChange={(e) => setCourseData({ ...courseData, name: e.target.value })} id="name" />
                </div>

                <div className="col-md-6">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" rows="3" value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}></textarea>
                </div>

                <div className="col-md-6">
                <label htmlFor="requirements" className="form-label">Requirements</label>
                <textarea className="form-control" id="requirements" rows="3" value={courseData.requirements}
                    onChange={(e) => setCourseData({ ...courseData, requirements: e.target.value })}></textarea>
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
                <button type="submit" className="btn btn-primary">Add Course</button>
                </div>
            </form>
            </div>
  )
}

export default AddaCourse
