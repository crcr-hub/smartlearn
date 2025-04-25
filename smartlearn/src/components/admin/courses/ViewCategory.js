import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,Link } from "react-router-dom";
import {  viewCategory } from "../../../redux/authSlices";

function ViewCategory() {
    const dispatch = useDispatch()
    const {  category:categories, loading, error } = useSelector((state) => state.auth);
    
    useEffect (()=>{
         dispatch (viewCategory());},[dispatch])
        const [blockStatus,setBlockstatus] = useState();

    const categoryArray = Array.isArray(categories) ? categories : [];
  
  

    
  return (
    <div>
      <table class="table">
        <thead class="table-dark">...</thead>
        <tbody>...</tbody>
      </table>
      <h3>Categories</h3>

      <table class="table">
        <thead class="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Visibility</th>
            <th scope="col">Action</th>
            
          </tr>
        </thead>
        <tbody class="table-group-divider">
          {categoryArray.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.title}</td>
              <td>{category.description}</td>
              <td>{category.visible_status}</td>
              
              <td>
                {/* <Link To={`/student/${student.user.id}`}  className="btn btn-warning btn-sm">Update</Link> */}
                <Link
                  to={`/admin/category/${category.id}`}
                  className="btn btn-warning btn-sm"
                >
                  Update
                </Link>
                {/* <button onClick={()=>(dispatch(fetchCategory({ id: category.id, navigate })))} className="btn btn-danger btn-sm">
                            Update
                        </button> */}
{/* 
                <button
                  onClick={() => {
                    console.log("Student:", student); // Debug the full student object
                    console.log("Block Status:", student.user.block_status);
                    handleBlockUnblock(
                      student.user.id,
                      student.user.block_status
                    );
                  }}
                  className="btn btn-danger btn-sm"
                >
                  {student.user.block_status ? "Unblock" : "Block"}
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewCategory;
