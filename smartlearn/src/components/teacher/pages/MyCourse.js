import React, { useEffect } from 'react'
import { fetchTutorCourse } from '../../../redux/authSlices';
import { useDispatch, useSelector } from 'react-redux';
import TeacherSideBar from '../TeacherSideBar';
import { Link } from 'react-router-dom';

function MyCourse() {
    const dispatch = useDispatch();
    const { tutorcourses, loading, error } = useSelector((state) => state.auth);
    const {user:teacher} = useSelector((state)=>state.auth)
   
    useEffect(()=>{
     
      if (teacher?.profile_id) {
          dispatch(fetchTutorCourse(teacher.profile_id));
        } else {
          console.warn("Profile ID is missing");
        }
      
    },[dispatch, teacher?.profile_id])
  return (
    <div className='container mt-3'>
            <div className='row'>
        <TeacherSideBar/>
      <section className='col-md-12' style={{width:"70%"}}>
      <div className='card' style={{border:"none"}}>
                            <div className='card-body' >
                                <table className='table table-bordered'  >
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Category</th>
                                            <th>Description</th>
                                            <th style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Cover Text</th>
                                            <th>Created</th>
                                            <th style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Requirements</th>
                                            <th>Price</th>
                                            <th style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}> Offer Price</th>
                                            <th>Image</th>
                                            <th>Action</th>
                                            <th>Status</th>
                                        </tr>
                                        {tutorcourses.map((courses, index)=>(
                                            <tr key={index}>
                                                <td>{courses.name}</td>
                                                <td>{courses.category_title}</td>
                                                <td>{courses.description.length > 20 ? courses.description.substring(0,20)+"....": courses.description }</td>
                                                <td >{courses.cover_text && courses.cover_text.length > 20 ? courses.cover_text.substring(0,20)+".....": courses.cover_text}</td>
                                                <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{courses.date_created}</td>
                                                <td>{courses.requirements}</td>
                                                <td>{courses.price}</td>
                                                <td>{courses.offer_price}</td>
                                                <td>

                                            {courses.images ? (
                                                <img
                                                src={`http://localhost:8000${courses.images}`} // Path to the image
                                                    alt={`Course ${courses.name}`} // Alt text for the image
                                                    style={{ width: '50px', height: '50px' }} // Styling for the image
                                                />
                                                    ) : (
                                                        "No Image"
                                                    )}
                                            </td>
                                            <td>
          
            
              
                                                    <Link
                                                        to={`/teacherupdatecourse/${courses.id}`}
                                                        className="btn btn-warning btn-sm"
                                                    >
                                                        Update
                                                    </Link>
                                                
                                                    </td>

                                                          <td>
                                                            
                                                            {courses.visible_status === "private"?
                                                            "waiting for apporval": courses.visible_status ==="waiting"?
                                                            "pending":"public"
                                                            }
                                                            </td>                                                                          
                                            </tr>
                                        ))}
                                    </thead>
                                </table>
                            </div>
                        </div>
                        </section>
                    </div>
      
      </div>
      
   
  )
}

export default MyCourse
