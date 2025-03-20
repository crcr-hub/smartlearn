import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCategory } from '../../../redux/authSlices';

function AddCategory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

        const [catData,setCatData] = useState({
            title:"",
            description:"",
            visible_status :"",

        })
 
        const handleSubmit = (e) =>{
            e.preventDefault();
            dispatch(addCategory({catData,navigate}))
        } 

  return (
                <div style={{width:"800px",marginTop:"50px",marginLeft:"100px"}}>
                    <div><h4 style={{marginBottom:"50px"}}>Add Category</h4></div>
                    <form className="row g-3" onSubmit={handleSubmit}>

                    <div className="mb-3">
                    <label for="inputCity" className="form-label">Title of the Cateogry</label>
                    <input type="text" className="form-control" 
                    onChange={(e)=>setCatData({...catData, title:e.target.value})} id="inputCity"/>
                    </div>
                   
                    <div class="mb-3">
                    <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" 
                     onChange={(e) => setCatData({...catData,description:e.target.value})}></textarea>
                    </div>

                    <div className="col-md-6">
                    <label for="inputState" className="form-label">Visible Status</label>
                    <select id="inputState" className="form-select" name="gender" value={catData.visible_status} 
                    onChange={(e) => setCatData({...catData,visible_status:e.target.value})}>
                        <option selected>Choose...</option>
                        <option>private</option>
                        <option>public</option>
                    </select>
                    </div>

                    

                    <div className="col-10">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>
                </div>
  )
}

export default AddCategory
