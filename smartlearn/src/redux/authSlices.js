import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axiosInstances';
import Swal from 'sweetalert2';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { act } from 'react';

// Thunks
// Login --------------------------------------------------------------------------------------------------------------------


export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password, navigate }, { rejectWithValue }) => {
  try {

    const response = await axiosInstance.post('/token/', { email, password });
    const { access, refresh } = response.data;
    const decodedUser = jwtDecode(access);

    // Clear previous session data
    localStorage.clear();
    sessionStorage.clear();

    // Store tokens
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    // 🔥 Fetch user details separately after login
    const userResponse = await axiosInstance.get('/user-details/', {
      headers: { Authorization: `Bearer ${access}` },
    });

    const user = userResponse.data; // Full user details

    localStorage.setItem("user", JSON.stringify(user));
  
    if (user.is_superuser){
        navigate('/admin/adminhome')
    }
    else if(user.role === 'student'){
      navigate('/home')
    }
    else if (user.role === 'teacher' ){
      navigate('/tutorhome')
    }
    
    return { user, access, refresh };
   } catch (error) {
    if (error.response?.data?.detail === "Your account is pending approval. Please contact the administrator.") {
      Swal.fire({
        title: 'Account Pending Approval',
        text: 'Please contact the administrator for further assistance.',
        icon: 'warning',
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      Swal.fire({
        title: 'Login Failed',
        text:  'Invalid Username or Password',
        icon: 'error',
        toast: true,
        timer: 6000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      
    

}
return rejectWithValue(error.response?.data || 'Login failed');
}
});


export const viewAllTeachers = createAsyncThunk('auth/viewAllTeachers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/all_teachers/');
    return response.data; // Assuming the API returns a list of users
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});



export const registerUser = createAsyncThunk('auth/registerUser', async ({ userData, navigate }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/register/', userData);
    const { access, refresh } = response.data;


    navigate('/admin/addstudent' );
    return  response.data ;
  } catch (error) {
    Swal.fire({
      title: 'Registration failed',
      icon: 'error',
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});





//................................ admin......................................

export const adminNotification = createAsyncThunk("admin/adminNotificaiton",
  async(_, {rejectWithValue}) =>{
    try{
      const response = await axiosInstance.get('/adnotification/'); 
      return response.data;
    } catch(error){
      return rejectWithValue(error.response?.data || 'Failed to fetch notification');
    }
  });


export const pendingCourses = createAsyncThunk('admin/pendingCourses',
  async(_,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.get('/pendingcourses'); 
      return response.data;
    } catch(error){
      return rejectWithValue(error.response?.data || 'Failed to fetch notification');
    }
  }
);

export const updateApprove = createAsyncThunk('admin/updateApprove',
  async(cid,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.patch(`/update_approve/${cid}/`); 
      console.log("from authslice",response.data.courses)
      if (response?.data?.courses) {
        Swal.fire({
          title: 'Success',
          text: response.data.courses +' '+'Course is now publicly available!',
          icon: 'success',
          toast: true,
          timer: 6000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      return response.data;

    } catch(error){
      return rejectWithValue(error.response?.data || 'Failed to fetch notification');
    }
  }
);


export const clearAdminNotification = createAsyncThunk('admin/clearAdminNotification',
  async(cid,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.patch('/clear_admin_notification'); 
      return response.data;
    } catch(error){
      return rejectWithValue(error.response?.data || 'Failed to fetch notification');
    }
  }
);

export const addStudent = createAsyncThunk('auth/addStudent',
   async ({userData, navigate}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/register/', userData);
    const { token, isAdmin } = response.data;
    if (token && isAdmin) {
      navigate('/admin/viewstudent');
    }
    else{
      navigate('/');
    }
   
    Swal.fire({
      title: 'Registered successfully',
      icon: 'success',
      toast: true,
      timer: 2000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
   
    return response.data;
  } catch (error) {
    Swal.fire({
      title: 'Error while registering',
      icon: 'error',
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return rejectWithValue(error.response?.data || 'Registration  failed');
  }
});

// add teacher
export const addTeacher = createAsyncThunk('auth/addTeacher', async ({userData, navigate}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/register/', userData);
    navigate('/admin/viewteacher');
    Swal.fire({
      title: 'Teacher added successfully',
      icon: 'success',
      toast: true,
      timer: 2000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
   
    return response.data;
  } catch (error) {
    Swal.fire({
      title: 'Error adding Teacher',
      icon: 'error',
      toast: true,
      timer: 6000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return rejectWithValue(error.response?.data || 'Add Teacher failed');
  }
});

export const viewStudent = createAsyncThunk('auth/viewStudent', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/list_students');
    return response.data; // Assuming the API returns a list of users
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});

export const viewTeachers = createAsyncThunk('auth/viewTeachers', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/list_teachers');
    return response.data; // Assuming the API returns a list of users
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});

export const updateBlockStatus = createAsyncThunk( 'auth/updateBlockStatus',
  async ({ userId, blockStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/students/${userId}/`, {block_status : blockStatus,});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const teacherBlockStatus = createAsyncThunk( 'auth/teacherBlockStatus',
  async ({ userId, blockStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/teacher/${userId}/`, {block_status : blockStatus,});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// export const addCourse = createAsyncThunk('auth/addCourse', async (courseData, { rejectWithValue }) => {
//   try {
//     const response = await axiosInstance.post('/addcourse', courseData);
//     Swal.fire({
//       title: 'Course added successfully',
//       icon: 'success',
//       toast: true,
//       timer: 2000,
//       position: 'top-right',
//       timerProgressBar: true,
//       showConfirmButton: false,
//     });
//     return response.data;
//   } catch (error) {
//     Swal.fire({
//       title: 'Error adding course',
//       icon: 'error',
//       toast: true,
//       timer: 6000,
//       position: 'top-right',
//       timerProgressBar: true,
//       showConfirmButton: false,
//     });
//     return rejectWithValue(error.response?.data || 'Add course failed');
//   }
// });


// fetch teacher profile
export const fetchTeacherProfile = createAsyncThunk('auth/fetchTeacherProfile', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/teacher_profile/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch student');
  }
});
// Fetch a single student
export const fetchStudent = createAsyncThunk('auth/fetchStudent', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/students/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch student');
  }
});

// fetch a single teacher values
export const fetchTeacher = createAsyncThunk('teacher/fetchTeacher', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/teacher/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch Teacher');
  }
});

export const updateStudentData = createAsyncThunk( 'auth/updateStudentData',
  async ({ id, updatedData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/students/${id}/`, updatedData); // Adjust the API endpoint
      navigate('/admin/viewstudent');
      Swal.fire({
              title: 'Updated success',
              icon: 'success',
              toast: true,
              timer: 2000,
              position: 'top-right',
              timerProgressBar: true,
              showConfirmButton: false,
            });
      return response.data; // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update user');
    }
  });

  // update Teacher data
  export const updateTeacherData = createAsyncThunk( 'auth/updateTeacherData',
    async ({ id, updatedData, navigate }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(`/teacher/${id}/`, updatedData); // Adjust the API endpoint
        navigate('/admin/viewteacher');
        Swal.fire({
                title: 'Updated successfully',
                icon: 'success',
                toast: true,
                timer: 2000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
              });
        return response.data; // Return updated user data
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to update user');
      }
    });


//.................................... courrses ------------------------------------------------------------

export const addCategory = createAsyncThunk('auth/addCategory',
    async({catData, navigate}, { rejectWithValue }) =>{
      try {
        const response = await axiosInstance.post('/category/', catData);
        navigate('/admin/viewcategory');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Add Teacher failed');
      }
    });

export const viewCategory = createAsyncThunk('auth/category', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get('/category/');
    return response.data; // Assuming the API returns a list of users
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch users');
  }
});

export const fetchCategory = createAsyncThunk('category/fetchCategory', async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch category');
  }
});

export const updateCategoryData = createAsyncThunk( 'auth/updateCategoryData',
  async ({ id, catData, navigate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}/`, catData); // Adjust the API endpoint
      navigate('/admin/viewcategory');
      return response.data; // Return updated user data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update category');
    }
  });

  export const addCourses = createAsyncThunk('auth/addCourses',
    async({updatedCourseData,module, navigate}, { rejectWithValue }) =>{
      try {
        const formData = new FormData();
      
        // Append regular data
        formData.append('name', updatedCourseData.name);
        formData.append('description', updatedCourseData.description);
        formData.append('requirements', updatedCourseData.requirements);
        formData.append('category', updatedCourseData.category);
        formData.append('cover_text',updatedCourseData.cover_text)
        formData.append('teacher', updatedCourseData.teacher);
        formData.append('price',updatedCourseData.price);
        formData.append('offer_price',updatedCourseData.offer_price)
        
        // Append image (if any)
        if (updatedCourseData.image) {
          formData.append('images', updatedCourseData.image);
        }
      
        // Send the request with formData as the request body
        const response = await axiosInstance.post('/courses/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Ensure the correct content type
          },
        });
        if(updatedCourseData.role === 'teacher'){
          navigate('/tutordashboard');
        }
        
        else{
          navigate('/admin/viewcourses');
        }
        
     
        Swal.fire({
          title: 'Course added successfully',
          icon: 'success',
          toast: true,
          timer: 2000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Add Course failed');
      }
    });




    export const saveCourse = createAsyncThunk('auth/addCourses',
      async({updatedCourseData, navigate}, { rejectWithValue }) =>{
        try {
          const formData = new FormData();
        
          // Append regular data
          formData.append('name', updatedCourseData.name);
          formData.append('description', updatedCourseData.description);
          formData.append('requirements', updatedCourseData.requirements);
          formData.append('category', updatedCourseData.category);
          formData.append('cover_text',updatedCourseData.cover_text)
          formData.append('teacher', updatedCourseData.teacher);
          formData.append('price',updatedCourseData.price);
          formData.append('offer_price',updatedCourseData.offer_price)
          
          // Append image (if any)
          if (updatedCourseData.image) {
            formData.append('images', updatedCourseData.image);
          }
        
          // Send the request with formData as the request body
          const response = await axiosInstance.post('/courses/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Ensure the correct content type
            },
          });
         
          const courseID = response.data.id;
          if (courseID){
            navigate(`/add_module/${courseID}`);
          }
          
       
          Swal.fire({
            title: 'Course added successfully',
            icon: 'success',
            toast: true,
            timer: 2000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Add Course failed');
        }
      });


    export const publishCourse = createAsyncThunk('auth/publishCourse',
      async(courseId,{rejectWithValue})=>{
        try {
          const response = await axiosInstance.post(`/publishcourses/${courseId}`);
          
        Swal.fire({
          title: 'Your Course is waiting for Aproval from administrator',
          icon: 'success',
          toast: true,
          timer: 2000,
          position: 'top-right',
          timerProgressBar: true,
          showConfirmButton: false,
        }); 
          return response.data; // Assuming the API returns a list of users
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to fetch users');
        }
      }
    )

    export const viewCourses = createAsyncThunk('auth/viewCourses', async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get('/courses/');
        return response.data; // Assuming the API returns a list of users
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch users');
      }
    });


    export const fetchCourse = createAsyncThunk('course/fetchCourse', async (id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get(`/course/${id}/`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch course');
      }
    });

    export const fetchTutorCourse = createAsyncThunk('course/fetchtutorCourse', async (teacher_id, { rejectWithValue }) => {
      try {

        const response = await axiosInstance.get(`/tutorcourse/${teacher_id}/`);
        
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to fetch course');
      }
    });


    export const updateCourse = createAsyncThunk( 'auth/updateCourse',
      async ({ id, updatedCourseData, navigate }, { rejectWithValue }) => {
        const formData = new FormData();
      
        // Append regular data
        formData.append('name', updatedCourseData.name);
        formData.append('description', updatedCourseData.description);
        formData.append('requirements', updatedCourseData.requirements);
        formData.append('cover_text', updatedCourseData.cover_text);
        formData.append('category', updatedCourseData.category);
        formData.append('teacher', updatedCourseData.teacher);
        formData.append('price', updatedCourseData.price);
        formData.append('offer_price',updatedCourseData.offer_price);
        
        // Append image (if any)
        if (updatedCourseData.image) {
          formData.append('images', updatedCourseData.image);
        }
        
        try {
          const response = await axiosInstance.put(`/course/${id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Ensure the correct content type
            },
          }); // Adjust the API endpoint
         
          if (updatedCourseData.role === 'teacher') {
            navigate('/tutordashboard')
          }
          else{
            navigate('/admin/viewcourses');
          }
          return response.data; // Return updated user data
        } catch (error) {
          return rejectWithValue(error.response?.data || 'Failed to update category');
        }
      });
//....................................................Modules.............................


export const fetchModules = createAsyncThunk('modules/fetchModules', async (courseId) => {
  
  const response = await axiosInstance.get(`/module/${courseId}/`);
  return response.data;
});

export const addModule = createAsyncThunk('modules/addModule', async (moduleData) => {
  const formData = new FormData();
  formData.append('topic', moduleData.topic);
  formData.append('sub_topic', moduleData.sub_topic);
  formData.append('number', moduleData.number);
  formData.append('course', moduleData.course);

  // Append video file (if provided)
  if (moduleData.media instanceof File) {
    formData.append('media', moduleData.media); // Ensure 'media' matches Django's field name
  }
  const response = await axiosInstance.post('/modules/', formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
});

export const updateModule = createAsyncThunk('modules/updateModule', async (editedData,{ rejectWithValue }) => {
  
  
  const formData = new FormData();
  formData.append('topic', editedData.topic);
  formData.append('sub_topic', editedData.sub_topic);
  formData.append('number', editedData.number);
  formData.append('course', editedData.course);

  // Append video file (if provided)
  if (editedData.media instanceof File) {
    formData.append('media', editedData.media); // Ensure 'media' matches Django's field name
  }
  
  console.log("foemdataaaaa",formData,editedData)
  const response = await axiosInstance.put(`/module/${editedData.id}/`, formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
});
//..................................students............................
// fetch student profile

export const updateStudentProfile = createAsyncThunk('profile/updateStudentProfile',
  async(updatedData,{rejectWithValue})=>{
  console.log("id",updatedData.id)
    const response = await axiosInstance.put(`/uprofile/${updatedData.id}`,updatedData)
    return response.data
}
)

export const fetchStudentProfile = createAsyncThunk('profile/fetchStudentProfile', async (_,{ rejectWithValue }) => {
  const response = await axiosInstance.get('/profile/');
  return response.data;
});

export const fetchTutorProfile = createAsyncThunk('profile/fetchTutorProfile', async (_,{ rejectWithValue }) => {
  const response = await axiosInstance.get('/t_profile/');
  return response.data;
});

//......................................................Addto Cart and wishlist..........

export const AddToCart = createAsyncThunk('cart/AddToCart', async (cartData,{ rejectWithValue }) => {
  try {
  const response = await axiosInstance.post(`/add_cart/`, cartData);
  Swal.fire({
    title: response.data.message,
    icon: 'success',
    toast: true,
    timer: 2000,
    position: 'top-right',
    timerProgressBar: true,
    showConfirmButton: false,
  });
  return response.data;
  }catch(error){
    Swal.fire({
      title: error.response?.data?.error || 'Something went wrong!',
      icon: 'error',
      toast: true,
      timer: 2000,
      position: 'top-right',
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return rejectWithValue(error.response?.data);
  }
});


export const AddToWishlist = createAsyncThunk('wishlist/AddToWishlist', async (wishlistData,{ rejectWithValue }) => {
  try {
  const response = await axiosInstance.post(`/add_wishlist/`, wishlistData);
  Swal.fire({
    title: response.data.message,
    icon: 'success',
    toast: true,
    timer: 2000,
    position: 'top-right',
    timerProgressBar: true,
    showConfirmButton: false,
  });
  return response.data;
}catch(error){
  Swal.fire({
    title: error.response?.data?.error || 'Something went wrong!',
    icon: 'error',
    toast: true,
    timer: 2000,
    position: 'top-right',
    timerProgressBar: true,
    showConfirmButton: false,
  });
  return rejectWithValue(error.response?.data);
}
});
export const FetchWishlist = createAsyncThunk('wishlist/FetchWishlist', async (userID,{ rejectWithValue }) => {

  const response = await axiosInstance.get(`/fetch_wishlist/${userID}`);
  return response.data;
});

export const FetchCart = createAsyncThunk('cart/FetchCart', async (userID,{ rejectWithValue }) => {
  const response = await axiosInstance.get(`/fetch_cart/${userID}`);
  return response.data;
});

export const fetchCartCourses = createAsyncThunk("cart/fetchCartCourses",async (courseIds) => {
    const response = await axiosInstance.get(`/cartcourses/?ids=${courseIds.join(",")}`);
    return response.data; // Assuming response.data is an array of course details
  }
);
export const removeCartItem = createAsyncThunk("cart/removeCartItem",async ({ cart_item_id, user_id },{ rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete(`/fetch_cart/${user_id}`, {
      data: { cart_item_id }
    });
    if (response.data) {
      return response.data; // Assuming response.data contains the updated cart details
    } else {
      return rejectWithValue("Failed to fetch updated cart details.");
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "An error occurred while removing the cart item.");
  }
}
);

export const removeWishlistItem = createAsyncThunk("cart/removeWishlistItem",async ({ wishlist_item_id, user_id },{ rejectWithValue }) => {
  try {
    
    const response = await axiosInstance.delete(`/fetch_wishlist/${user_id}`, {
      data: { wishlist_item_id }
    });
    if (response.data) {
      return response.data; // Assuming response.data contains the updated cart details
    } else {
      return rejectWithValue("Failed to fetch updated cart details.");
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "An error occurred while removing the cart item.");
  }
}
);

//...................................Place Order...................................
export const placeOrder = createAsyncThunk( "order/placeOrder",async (billData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/place_order/`,billData);
      Swal.fire({
        title: "Success Fully Ordered the Course",
        icon: 'success',
        toast: true,
        timer: 2000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return response.data;
    }catch(error){
      Swal.fire({
        title: error.response?.data?.error || 'Something went wrong!',
        icon: 'error',
        toast: true,
        timer: 2000,
        position: 'top-right',
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return rejectWithValue(error.response?.data);
    }
    
  }
);
//................................. My learnings..........................
export const fetchLearningCourse = createAsyncThunk("learnings/fetchLearningCourse",async(_,{rejectWithValue})=>{
  const response = await axiosInstance.get(`/fetch_learnings/`);
  return response.data
});


export const fetchMyCourse = createAsyncThunk("learnings/fetchMyCourse",async(courseId,{rejectWithValue})=>{
  const responese = await axiosInstance.get(`/fetchmycourse/${courseId}`);
  return responese.data
});
//,......................................Comments..............................

export const updateComment = createAsyncThunk ("comments/updateComment",
  async({ commentId, updatedData },{rejectWithValue})=>{
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
    try{
        const response = await axiosInstance.put(`/handle_comment/${commentId}`,updatedData);
        return response.data
    } catch(error){
      return rejectWithValue(error.responese?.data|| error.message)
    }
  }
);

export const deleteComments = createAsyncThunk ("comments/deleteComments",
  async(commentId,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.delete(`/handle_comment/${commentId}`);
      return response.data
    }catch(error){
      return rejectWithValue(error.response?.data || error.message)
    }
  }
);

export const handleComments = createAsyncThunk("comments/handleComments",
  async( updatedData ,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.post(`/comment/`, updatedData); 
      return response.data;
    } catch (error) {
      // Use rejectWithValue to handle errors gracefully
      return rejectWithValue(error.response?.data || error.message);
    }
});

export const getComments = createAsyncThunk("comments/getComments",
  async( updatedData ,{rejectWithValue})=>{
    try {
      const response = await axiosInstance.get(`/comment/`,  {
        params: updatedData, // Pass as query params
      }); 
      return response.data;
    } catch (error) {
      // Use rejectWithValue to handle errors gracefully
      return rejectWithValue(error.response?.data || error.message);
    }
});

// ...........................Messages........................
export const fetchUserTutors = createAsyncThunk("tutors/fetchUserTutors", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/get_tutor/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchTutorsStudent = createAsyncThunk("tutors/fetchTutorsStudent", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(`/get_students/`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// ............................................. Messages...................................

export const changeIsReadStatus = createAsyncThunk("messsage/changeIsRead",async(room_id,{rejectWithValue})=>{
  try{
    const response = await axiosInstance.post(`/changeIsRead/${room_id}`);
   
    return response.data
  }catch(error){
    return rejectWithValue(error.response.data)
  }
})

export const recentMessages = createAsyncThunk("message/recentMessage", async(_,{rejectWithValue})=>{
  try{
    const response = await axiosInstance.get(`/recent_messages/`);
    return response.data
  } catch(error){
    return rejectWithValue(error.response.data);
  }
})

export const recentTMessages = createAsyncThunk("message/recentTMessage", async(_,{rejectWithValue})=>{
  try{
    const response = await axiosInstance.get(`/recent_tmessages/`);
    return response.data
  } catch(error){
    return rejectWithValue(error.response.data);
  }
})




export const fetchOnlineUsers = createAsyncThunk("message/fetchOnlineUsers",
  async (userId, { rejectWithValue }) => {
      try {
          const response = await axiosInstance.get(`/fetchmycourse/${userId}`);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response?.data || "Error fetching online users");
      }
  }
);
//.........................Notification........................................

export const handleNotification = createAsyncThunk("notification/handleNotification",
  async (uid,{rejectWithValue}) =>{
    try{
      const response = await axiosInstance.get(`/notification/${uid}`);
      return response.data
    } catch(error){
      return rejectWithValue(error.response?.data || "error")
    }
  }
)

export const updateNotification = createAsyncThunk("notification/updateNofitication",
  async (tutorId,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.put(`/notification/${tutorId}`);
      return response.data
    } catch(error){
      return rejectWithValue(error.response?.data || "error")
    }
  }
)
//.....................progress........................................


export const getProgress = createAsyncThunk("progress/getProgress",
  async(mid,{rejectWithValue}) =>{
    const response = await axiosInstance.get(`/handleProgress/${mid}`);
    return response.data
  }
)
export const postProgress = createAsyncThunk("progress/postProgress",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/handleProgress/${data.moduleId}`, data);
      return response.data; // Return data for the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const fetchProgress = createAsyncThunk("progress/fetchProgress",
  async (course_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/fetchProgress/${course_id}`);
      return response.data; // Return data for the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
//.........................feedback and rating......................................
export const handleFeedback = createAsyncThunk("feedback/handleFeedback",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/handleFeedback/${data.course_id}`,data);
      return response.data; // Return data for the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
export const getFeedback = createAsyncThunk("feedback/getFeedback",
  async (course_id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/handleFeedback/${course_id}`);
      return response.data; // Return data for the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const updateFeedback = createAsyncThunk("feedback/updateFeedback",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/handleFeedback/${data.feedbackId}`,data);
      return response.data; // Return data for the reducer
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getAllFeedback =  createAsyncThunk("feedback/getAllFeedback",
  async (course_id,{rejectWithValue}) =>{
    try{
      const response = await axiosInstance.get(`/all_feedback/${course_id}`)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const averageRating = createAsyncThunk("feedback/averageRating",
  async(course_id,{rejectWithValue}) =>{
    try{
      const response = await axiosInstance.get(`/average_rating/${course_id}`)
      return response.data
    } catch(error){
      return rejectWithValue(error.response?.data || "something went wrong")
    }
  }
)

//............................... Razorpay...............................
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/create-order/", { amount: amount * 100 }); // Amount in paise
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//......................Tutuor dashboard.........................
export const tutorDashboard = createAsyncThunk("report/tutorDashboard",
  async(_,{rejectWithValue}) =>{
    try{
      const response = await axiosInstance.get('tutor_dashboard/');
      return response.data
    }catch(error){
      return rejectWithValue(error.response.data)
    }
  }
)

//.........................admin_dashboard......................
export const adminDashboard = createAsyncThunk("report/adminDashboard",
  async(_,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.get('admin_dashboard/');
      return response.data
    }catch(error){
      return rejectWithValue(error.response.data)
    }
  }
)

//..........................................................LogOut.....................
      export const logoutUser = (navigate) => async (dispatch) => {
     
        try {
          const refreshToken = localStorage.getItem('refresh');
          if (refreshToken) {
            await axiosInstance.post('/logout/', { refresh: refreshToken });
            
          }
        } catch (error) {
          console.error("Logout API failed", error);
        } finally {
          dispatch(logout());
          navigate('/'); // Redirect to login after logout
        }
      };



// Initial State
const initialState = {



  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  access: localStorage.getItem("access") || null,
  refresh: localStorage.getItem("refresh") || null,
  isAuthenticated: !!localStorage.getItem("access"),
  error: null,
  userlist :null,
  loading: false,
  teachers:null,
  teacher:null,
  category: [], 
  course:[],
  tutorcourses: [],
  modules: [],
  teacherprofile:null,
  cart:[],
  cartCourseDetails:[],
  wishlist:null,
  learnings:null,
  mycourse:null,
  mymodule:null,
  profile:null,
  tprofile:null,
  comments:null,
  tutorlist:[],
  studentlist:[],
  recentMessage:[],
  recentTmessage:[],
  onlineUsers: [],
  notifications:[],
  progress:[],
  progressPercentage:[],
  feedback:null,
  allfeedback:null,
  average_rating : null,
  isAuthenticated: !!localStorage.getItem('access'),
  adminnotification : null,
  aprovalcourses : null,
  order : null,
  tutordashboardData : null,
  adminDashboardData : null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // 🔥 Clear old user data first
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      sessionStorage.clear();

      // ✅ Store new user data
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("access", action.payload.access);
      localStorage.setItem("refresh", action.payload.refresh);

      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      // state.user = null;
      // state.access = null;
      // state.refresh = null;

      // localStorage.removeItem("user");
      // localStorage.removeItem("access");
      // localStorage.removeItem("refresh");
    
      // sessionStorage.clear();
      // window.location.href = "/";


      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      sessionStorage.clear();
      window.location.href = "/";
    },

    loadUser: (state) => {
      // const token = localStorage.getItem('access');
      // if (token) {
      //   try {
      //     const user = jwtDecode(token);
      //     state.user = user;
      //     state.access = token;
      //     state.isAuthenticated = true;
      //   } catch (error) {
      //     console.error("Token decoding failed", error);
      //     state.user = null;
      //     state.access = null;
      //     state.isAuthenticated = false;
      //   }


      const token = localStorage.getItem("access");
      if (token) {
        try {
          const user = jwtDecode(token);
          state.user = user;
          state.access = token;
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Token decoding failed", error);
          state.user = null;
          state.access = null;
          state.isAuthenticated = false;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(adminDashboard.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
    .addCase(adminDashboard.fulfilled,(state,action)=>{
      state.loading = false;
      state.adminDashboardData = action.payload;
    })
    .addCase(adminDashboard.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(tutorDashboard.pending,(state)=>{
      state.loading = true;
      state.error = null;
    })
    .addCase(tutorDashboard.fulfilled,(state,action)=>{
      state.loading = false;
      state.tutordashboardData = action.payload;
    })
    .addCase(tutorDashboard.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(createOrder.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    })
    .addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(pendingCourses.fulfilled,(state,action)=>{
      state.loading = false;
      state.aprovalcourses = action.payload;
    })
    .addCase(adminNotification.fulfilled,(state,action)=>{
      state.loading = false;
      state.adminnotification = action.payload
    })
    .addCase(handleNotification.fulfilled,(state,action)=>{
      state.loading = false;
      state.notifications = action.payload
    })
    .addCase(averageRating.fulfilled,(state,action)=>{
      state.loading = false;
      state.average_rating = action.payload;
    })
    .addCase(averageRating.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(getAllFeedback.fulfilled,(state,action)=>{
      state.loading = false;
      state.allfeedback = action.payload;
    })
    .addCase(getFeedback.fulfilled,(state,action)=>{
      state.loading = false;
      state.feedback = action.payload;
    })
    .addCase(getFeedback.pending,(state,action)=>{
      state.loading = true;

    })
    .addCase(getFeedback.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })



    .addCase(fetchProgress.fulfilled,(state,action)=>{
      state.loading = false;
      state.progressPercentage = action.payload;
    })
    .addCase(fetchProgress.pending,(state,action)=>{
      state.loading = true;
      
    })
    .addCase(fetchProgress.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
   
   
    .addCase(getProgress.fulfilled,(state,action)=>{
      state.loading = false;
      state.progress = action.payload;
    })
    .addCase(getProgress.pending,(state,action)=>{
      state.loading = true;
     
    })
    .addCase(getProgress.rejected,(state,action)=>{
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchOnlineUsers.pending, (state) => {
      state.loading = true;
      })
      .addCase(fetchOnlineUsers.fulfilled, (state, action) => {
          state.loading = false;
          state.onlineUsers = action.payload;
      })
      .addCase(fetchOnlineUsers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
      })

    .addCase(recentTMessages.fulfilled,(state,action)=>{
      state.recentTmessage = action.payload;
      state.loading = false;
    })

    .addCase(recentMessages.fulfilled,(state,action)=>{
      state.recentMessage = action.payload;
      state.loading = false;
    })

    .addCase(fetchTutorsStudent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTutorsStudent.fulfilled, (state, action) => {
      state.studentlist = action.payload;
      state.loading = false;
    })
    .addCase(fetchTutorsStudent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(fetchUserTutors.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserTutors.fulfilled, (state, action) => {
      state.tutorlist = action.payload;
      state.loading = false;
    })
    .addCase(fetchUserTutors.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        // Optional: Handle student addition success in state if needed
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(addTeacher.pending, (state, action) => {
        // Optional: Handle Teacher addition success in state if needed
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        // Optional: Handle Teacher addition success in state if needed
      })
      .addCase(addTeacher.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(fetchTeacherProfile.fulfilled,(state,action)=>{
        state.teacherprofile = action.payload
        state.loading = false;
      })
      .addCase(viewAllTeachers.fulfilled, (state, action) => {
        state.teachers = action.payload; // Set users data
        state.loading = false; // Loading complete
        // Optional: Handle Teacher addition success in state if needed
      })

      .addCase(viewTeachers.fulfilled, (state, action) => {
        
        state.userlist = action.payload; // Set users data
        state.loading = false; // Loading complete
      })
    
      .addCase(viewStudent.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null;  // Clear previous errors
      })
    
      .addCase(viewStudent.fulfilled, (state, action) => {
        
        state.userlist = action.payload; // Set users data
        state.loading = false; // Loading complete
      })
      .addCase(viewStudent.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
        state.loading = false; // Loading complete
      })
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.student = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacher.fulfilled, (state, action) => {
        state.teacher = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeacher.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(updateTeacherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeacherData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user data
      })
      .addCase(updateTeacherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })
      
       // Update user profile
       .addCase(updateStudentData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudentData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Update user data
      })
      .addCase(updateStudentData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })
      .addCase( updateBlockStatus.pending,(state, action)=>{
        state.loading = true;
        state.error = action.payload;
      })

      .addCase(updateBlockStatus.fulfilled, (state, action) => {
        const { userId, blockStatus } = action.meta.arg; // Use meta.arg if payload doesn't return these
        const student = state.user.find((s) => s.user.id === userId); // Find the specific student
        if (student) {
          student.user.block_status = blockStatus; // Update block_status
        }
      })
      .addCase( updateBlockStatus.rejected,(state, action)=>{
        state.loading = true;
        state.error = action.payload || 'Failed to update block status';
      })


      .addCase( teacherBlockStatus.pending,(state, action)=>{
        state.loading = true;
        state.error = action.payload;
      })

      .addCase(teacherBlockStatus.fulfilled, (state, action) => {
        const { userId, blockStatus } = action.meta.arg; // Use meta.arg if payload doesn't return these
        const teacher = state.user.find((s) => s.user.id === userId); // Find the specific student
        if (teacher) {
          teacher.user.block_status = blockStatus; // Update block_status
        }
      })
      .addCase( teacherBlockStatus.rejected,(state, action)=>{
        state.loading = true;
        state.error = action.payload || 'Failed to update block status';
      })
// courses --------------------------------------------------------------------


      .addCase(addCategory.pending, (state, action) => {
        // Optional: Handle addition success in state if needed
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        // Optional: Handle addition success in state if needed
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(viewCategory.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null;  // Clear previous errors
      })
      .addCase(viewCategory.fulfilled, (state, action) => {
        
        state.category = action.payload; // Set users data
        state.loading = false; // Loading complete
      })
      .addCase(viewCategory.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
        state.loading = false; // Loading complete
      })


      .addCase(viewCourses.pending, (state) => {
        state.loading = true; // Start loading
        state.error = null;  // Clear previous errors
      })
      .addCase(viewCourses.fulfilled, (state, action) => {
        
        state.courses = action.payload; // Set users data
        state.loading = false; // Loading complete
      })
      .addCase(viewCourses.rejected, (state, action) => {
        state.error = action.payload; // Store the error message
        state.loading = false; // Loading complete
      })
      .addCase(fetchCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.category = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(updateCategoryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategoryData.fulfilled, (state, action) => {
        state.loading = false;
        state.category = action.payload; // Update category data
      })
      .addCase(updateCategoryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })


      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.coursedata = action.payload; // Update category data
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })
      .addCase(addCourses.pending, (state, action) => {
        // Optional: Handle addition success in state if needed
      })
      .addCase(addCourses.fulfilled, (state, action) => {
        // Optional: Handle addition success in state if needed
      })
      .addCase(addCourses.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.course = action.payload;
        state.loading = false;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

            // When the request is pending (loading state)
            .addCase(fetchTutorCourse.pending, (state) => {
              state.loading = true;
              state.error = null; // Reset error state when fetching starts
            })
            // When the request is fulfilled (successful data fetch)
            .addCase(fetchTutorCourse.fulfilled, (state, action) => {
              state.loading = false;
              state.tutorcourses = action.payload; // Store fetched courses in state
            })
            // When the request fails (error state)
            .addCase(fetchTutorCourse.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload || 'Failed to fetch courses'; // Store error message
            })

// .........................................Modules....................

          .addCase(fetchModules.fulfilled, (state, action) => {
            state.modules = action.payload;
          })
          .addCase(addModule.fulfilled, (state, action) => {
            state.modules.push(action.payload);
          })


          .addCase(updateModule.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateModule.fulfilled, (state, action) => {
            state.loading = false;
            const updatedModule = action.payload;
            const index = state.modules.findIndex((m) => m.id === updatedModule.id);
            if (index !== -1) {
              state.modules[index] = updatedModule;
            }
          })
          .addCase(updateModule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
  // ''''''''...................addToCart and wishlist..........................
  .addCase(AddToCart.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(AddToCart.fulfilled, (state, action) => {
    state.loading = false;
  })

  .addCase(AddToCart.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })


  .addCase(AddToWishlist.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(AddToWishlist.fulfilled, (state, action) => {
    state.loading = false;
  })

  .addCase(AddToWishlist.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })


  .addCase(FetchCart.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(FetchCart.fulfilled, (state, action) => {
    state.loading = false;
    state.cart = action.payload
  })

  .addCase(FetchCart.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })



  .addCase(FetchWishlist.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(FetchWishlist.fulfilled, (state, action) => {
    state.loading = false;
    state.wishlist = action.payload
  })

  .addCase(FetchWishlist.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
  })

  .addCase(fetchCartCourses.pending, (state) => {
    state.loading = true;
  })
  .addCase(fetchCartCourses.fulfilled, (state, action) => {
    state.loading = false;
    action.payload.forEach((course) => {
      state.cartCourseDetails[course.id] = course; // Store courses by ID
    });
  })
  .addCase(fetchCartCourses.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })
  
  .addCase(removeCartItem.pending, (state) => {
    state.loading = true;
  })
  .addCase(removeCartItem.fulfilled, (state, action) => {
    state.loading = false;
    state.cart = action.payload
  })
  .addCase(removeCartItem.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })

  .addCase(removeWishlistItem.pending, (state) => {
    state.loading = true;
  })
  .addCase(removeWishlistItem.fulfilled, (state, action) => {
    state.loading = false;
    state.wishlist = action.payload
  })
  .addCase(removeWishlistItem.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  })

  .addCase(placeOrder.pending, (state) => {
    state.loading = true; // Set loading to true while placing an order
    state.error = null;
  })
  .addCase(placeOrder.fulfilled, (state, action) => {
    state.loading = false;
    state.cart = []; // Clear the cart in the state upon successful order placement
    state.error = null;
  })
  .addCase(placeOrder.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload; // Capture the error message if the order fails
  })
  .addCase(fetchLearningCourse.rejected,(state,action)=>{
    state.loading = false;
    state.error = action.payload;
  })
  .addCase(fetchLearningCourse.fulfilled,(state,action)=>{
    state.loading = false;
    state.learnings = action.payload
    state.error = null;
  })
  .addCase(fetchLearningCourse.pending,(state,action)=>{
    state.loading =  true;
    state.error = null;
  })

.addCase(fetchMyCourse.rejected,(state,action)=>{
  state.loading = false;
  state.error = action.payload;
})

.addCase(fetchMyCourse.fulfilled,(state,action)=>{
  state.loading = false;
  state.mycourse = action.payload.course;
  state.mymodule = action.payload.modules;
})
.addCase(fetchStudentProfile.pending,(state,action)=>{
  state.loading=true
  state.error= null;
})

.addCase(fetchStudentProfile.rejected,(state,action)=>{
  state.error = action.payload;
  state.loading = false;
})

.addCase(fetchStudentProfile.fulfilled,(state,action)=>{
  state.profile = action.payload;
  state.loading = false;
})


.addCase(fetchTutorProfile.pending,(state,action)=>{
  state.loading=true
  state.error= null;
})

.addCase(fetchTutorProfile.rejected,(state,action)=>{
  state.error = action.payload;
  state.loading = false;
})

.addCase(fetchTutorProfile.fulfilled,(state,action)=>{
  state.tprofile = action.payload;
  state.loading = false;
})

//.................comments.......................
.addCase(handleComments.pending,(state,action)=>{
  state.loading = true;
  state.error = null;
})
.addCase(handleComments.fulfilled,(state,action)=>{
  state.loading = false;
})
.addCase(handleComments.rejected,(state,action)=>{
  state.error = action.payload;
  state.loading = false
})

.addCase(getComments.pending,(state,action)=>{
  state.loading = true;
  state.error = null;
})
.addCase(getComments.fulfilled,(state,action)=>{
  state.comments = action.payload;
  state.loading = false;
})
.addCase(getComments.rejected,(state,action)=>{
  state.error = action.payload;
  state.loading = false
})
  },

  
});

export const { logout,loadUser  } = authSlice.actions;
export default authSlice.reducer;