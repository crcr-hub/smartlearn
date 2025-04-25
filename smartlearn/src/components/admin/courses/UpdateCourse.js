import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourse, fetchTeacher, updateCourse, viewCategory, viewTeachers } from '../../../redux/authSlices';

function UpdateCourse() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [courseData,setCourseData] = useState({
        name:"",
        description:"",
        category:"",
        teacher:"",
        courses:"",
        images:"",

    })


    const {course,loading,error} = useSelector((state)=>state.auth);
    const {user:teachers, loading:teacherLoading, error:teacherError} = useSelector((state)=>state.auth)
    const {category,loading:categoryLoading,error:categoryError} = useSelector((state)=>state.auth)
   

    useEffect(() => {
        if (course) {
            const { name, description, category,teacher,images,requirements } = course.course;
            setCourseData({
                name: name || "",
                description: description || "",
                category   : category || "",
                teacher : teacher || "",
                images : images || "",
                requirements : requirements || "",
            });
        }
        }, [course]);
    

    useEffect(()=>{
        dispatch(fetchCourse(id))
    },[dispatch,id])

    useEffect(()=>{
        dispatch(viewTeachers)
    },[dispatch])


    useEffect(()=>{
        dispatch(viewCategory)
    },[dispatch])

    const handleSubmit = (e)=>{
        e.preventDefault();
        dispatch(updateCourse({id,courseData,navigate}))
    }



  return (
    <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
    <div>
    <h4 style={{ marginBottom: "50px" }}>Update Course</h4>
    </div>
    {course? (
    <form className="row g-3" onSubmit={handleSubmit}>
        {/* onSubmit={handleSubmit} */}
        <div className="mb-3">
        <label for="inputCity" className="form-label">
            Title
        </label>
        <input
            type="text"
            className="form-control"
            value={courseData.name}
            onChange={(e) =>setCourseData({ ...courseData, name: e.target.value }) }id="inputCity"
        />
        </div>



        <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={courseData.description}
                onChange={(e) => setCourseData({...courseData,description:e.target.value})}></textarea>
        </div>
        <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Requirements</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={courseData.requirements}
                onChange={(e) => setCourseData({...courseData,requirements:e.target.value})}></textarea>
        </div>



    

        <div className="col-md-6">
        <label for="inputState" className="form-label">
            Teacher
        </label>
        <select
            id="inputState"
            className="form-select"
            name="gender"
            onChange={(e) =>
            setCourseData({ ...courseData, teacher: e.target.value })
            }>
         <option value={courseData.teacher}>
                {teachers.find((teacher) => teacher.profile.id === courseData.teacher)
                ? `${teachers.find((teacher) => teacher.profile.id === courseData.teacher).profile.first_name} ${
                    teachers.find((teacher) => teacher.profile.id === courseData.teacher).profile.last_name
                    }`
            :"Choose Teacher"}
        </option>
       
        {teachers
    .filter((teacher) => teacher.profile.id !== courseData.teacher) // Exclude current teacher from other options
    .map((teacher) => (
      <option key={teacher.id} value={teacher.profile.id}>
        {teacher.profile.first_name} {teacher.profile.last_name}
      </option>
    ))}

         
        </select>
        </div>

        <div className="col-md-6">
        <label for="inputState" className="form-label">
            Teacher
        </label>
        <select
            id="inputState"
            className="form-select"
            name="gender" value={courseData.category || ""}
            onChange={(e) =>
            setCourseData({ ...courseData, category: e.target.value }) 
            }>
                {/* {!courseData.category && <option value="">Choose category</option>} */}
                {Array.isArray(category) && category.length > 0 ? (
                    category.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.id === courseData.category ? cat.title : cat.title} {/* Display category name */}
                    </option>
                    ))
                ) : (
                    <option value="" disabled>
                    No categories available
                    </option>
                )}
             

                {/* Map through categories */}
                {Array.isArray(category) && category.length > 0 ? (
                    category.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                        {cat.name}
                    </option>
                    ))
                ) : (
                    <option value="" disabled>
                    No categories available
                    </option>
                )}
                        
        </select>
        </div>

    

    

        <div className="col-10">
        <button type="submit" className="btn btn-primary">
            Update
        </button>
        </div>
    </form>
    ) : (
    <p>Fetching student data...</p>
    )}
</div>
  )
}

export default UpdateCourse
