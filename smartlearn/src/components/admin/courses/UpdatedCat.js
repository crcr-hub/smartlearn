
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategory, updateCategoryData } from "../../../redux/authSlices";

function UpdatedCat() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { category } = useSelector((state) => state.auth);

    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    // if (!student) return <p>No student data available</p>;


    const [catData, setCatData] = useState({
        title: "",
        description: "",
        visible_status: "",
    });

    // Handle category data updates when the category changes
    useEffect(() => {
        if (category?.category) {
            const { title, description, visible_status } = category.category;
            setCatData({
                title: title || "",
                description: description || "",
                visible_status: visible_status || "",
            });
        }
    }, [category]);


        useEffect(() => {
            dispatch(fetchCategory(id));
        }, [dispatch, id]);

        const handleSubmit = (e) => {
            e.preventDefault();
            dispatch(updateCategoryData({ id, catData, navigate }));
        };


  return (
                    <div style={{ width: "800px", marginTop: "50px", marginLeft: "100px" }}>
                    <div>
                    <h4 style={{ marginBottom: "50px" }}>Update Category</h4>
                    </div>
                    {category? (
                    <form className="row g-3" onSubmit={handleSubmit}>
                        {/* onSubmit={handleSubmit} */}
                        <div className="mb-3">
                        <label for="inputCity" className="form-label">
                            Title
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={catData.title}
                            onChange={(e) =>setCatData({ ...catData, title: e.target.value }) }id="inputCity"
                        />
                        </div>



                        <div class="mb-3">
                                <label for="exampleFormControlTextarea1" class="form-label">Description</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={catData.description}
                                onChange={(e) => setCatData({...catData,description:e.target.value})}></textarea>
                        </div>



                    

                        <div className="col-md-6">
                        <label for="inputState" className="form-label">
                            Visibility Status
                        </label>
                        <select
                            id="inputState"
                            className="form-select"
                            name="gender"
                            onChange={(e) =>
                            setCatData({ ...catData, visible_status: e.target.value })
                            }
                        >
                            <option selected>
                            {catData.gender === "public" ? "public" : "private"}
                            </option>
                            <option>public</option>
                            <option>private</option>
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

export default UpdatedCat
