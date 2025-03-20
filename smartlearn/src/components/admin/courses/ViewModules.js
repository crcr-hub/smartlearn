import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { addModule, fetchCourse, fetchModules, updateModule } from '../../../redux/authSlices';
import { useDispatch, useSelector } from 'react-redux';

function ViewModules() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { modules } = useSelector((state) => state.auth);
    const { course, courseLoading, courseError } = useSelector((state) => state.auth); 
    // const sortedModules = [...modules].sort((a, b) => a.number - b.number);
    const sortedModules = React.useMemo(
        () => [...modules].sort((a, b) => a.number - b.number),
        [modules]
      );

    const [newModule, setNewModule] = useState({
      topic: "",
      sub_topic: "",
      number: null,
      media: "",
    });

              const [editingRow, setEditingRow] = useState(null); // Tracks the row being edited
              const [editData, setEditData] = useState({}); // Stores the data being edited
    
              const handleEditClick = (module) => {
                setEditingRow(module.id); // Set the current row in edit mode
                setEditData(module); // Prepopulate inputs with the existing data
              };

              const handleSaveClick = () => {
                console.log("edited........", editData);
              
                // Optimistically update the Redux store
                const updatedModules = modules.map((module) =>
                  module.id === editData.id ? editData : module
                );
                dispatch({ type: "auth/updateModules", payload: updatedModules });
              
                // Dispatch the actual API call
                dispatch(updateModule(editData)).then(() => {
                  console.log("Module updated successfully");
                });
              
                setEditingRow(null); // Exit edit mode
              };


            //   const handleSaveClick = () => {
            //     console.log("edited........",editData)
            //     dispatch(updateModule(editData)); // Call a function to update the module
            //     setEditingRow(null); // Exit edit mode
            //   };
     useEffect(() => {
                dispatch(fetchModules(id));
                dispatch(fetchCourse(id));
              }, [dispatch, id]);




              
               console.log("modules",modules,course)

               const [loading, setLoading] = useState(false);

               const handleAddModule = () => {
                 if (newModule.topic && newModule.sub_topic && newModule.number && newModule.media) {
                   setLoading(true);
                   dispatch(addModule({ ...newModule, course: id })).then(() => {
                     setLoading(false);
                     setNewModule({ topic: "", sub_topic: "", number: "", media: "" }); // Clear inputs
                   });
                 } else {
                   alert("Please Fill all the Fields");
                 }
               };

                    //     const handleAddModule = () => {
                    //       if (newModule.topic && newModule.sub_topic && newModule.number && newModule.media) {
                    //         dispatch(addModule({ ...newModule, course: id }));
                    //         setNewModule({ topic: "", sub_topic: "", number: "", media: "" }); // Clear inputs
                    //       }
                    //       else{
                    //         alert("Please Fill all the Fields ");
                    //       }
                    // };
  return (
    <div>




              {courseLoading ? (
                <h3>Loading course data...</h3>
              ) : (
                <h3>Modules for Course: {course?.course?.name}</h3>
              )}
            <table className="table">
  <thead>
    <tr>
      <th>Module Number</th>
      <th>Topic</th>
      <th>Subtopic</th>
      <th>Media URL</th>
      <th>Action</th> {/* Action column for buttons */}
    </tr>
  </thead>
  <tbody>
    {/* Existing modules
    {modules.map((module, index) => (
      <tr key={module.id}>
        <td>{module.number}</td>
        <td>{module.topic}</td>
        <td>{module.sub_topic}</td>
        <td>{module.media}</td>
        <td>
          <button className="btn btn-secondary" >Update</button>
        </td>
      </tr>
    ))} */}
    


        {/* Existing modules */}
        {sortedModules.map((module) => (
          <tr key={module.id}>
            {editingRow === module.id ? (
              <>
                {/* Editable inputs for the row being edited */}
                <td>
                  <input
                    type="text"
                    value={editData.number}
                    onChange={(e) => setEditData({ ...editData, number: e.target.value })}
                  />
                </td>
                <td>
                <textarea  className="form-control"
                    value={editData.topic}
                    onChange={(e) => setEditData({ ...editData, topic: e.target.value })}
                  />
                </td>
                <td>
                  <textarea  className="form-control"
                    value={editData.sub_topic}
                    onChange={(e) => setEditData({ ...editData, sub_topic: e.target.value })}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={editData.media}
                    onChange={(e) => setEditData({ ...editData, media: e.target.value })}
                  />
                </td>
                <td>
                  <button className="btn btn-success" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingRow(null)} // Cancel editing
                  >
                    Cancel
                  </button>
                </td>
              </>
            ) : (
              <>
                {/* Plain text for rows not being edited */}
                <td>{module.number}</td>
                <td>{module.topic}</td>
                <td>{module.sub_topic}</td>
                <td>{module.media}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleEditClick(module)}
                  >
                    Update
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}








    {/* Row for adding new module */}
    <tr>
      <td>
        <input
          type="text"
          placeholder="Module Number"
          value={newModule.number}
          onChange={(e) => setNewModule({ ...newModule, number: e.target.value })}
        />
      </td>
      <td>
      <textarea
            className="form-control"
            id="description"
            rows="3"
            placeholder='Topic'
          value={newModule.topic}
          onChange={(e) => setNewModule({ ...newModule, topic: e.target.value })}
        />
      </td>
      <td>
      <textarea
            className="form-control"
            id="description"
            rows="3"
           
          placeholder="Subtopic"
          value={newModule.sub_topic}
          onChange={(e) => setNewModule({ ...newModule, sub_topic: e.target.value })}
        />
      </td>
      <td>
        <input
          type="text"
          placeholder="Media URL"
          value={newModule.media}
          onChange={(e) => setNewModule({ ...newModule, media: e.target.value })}
        />
      </td>
      <td>
      <button
  className="btn btn-primary"
  onClick={handleAddModule}
  disabled={loading}
>
  {loading ? "Adding..." : "Add Next"}
</button>
        <button className="btn btn-success" onClick={handleAddModule}>Save</button>
       
      </td>
    </tr>
  </tbody>
</table>
           
          
          
      
    </div>
  )
}

export default ViewModules
