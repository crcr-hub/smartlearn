import React, { useEffect } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { changeIsReadStatus, recentMessages, recentTMessages, updateNotification } from '../../../redux/authSlices'

function TutotRecentMessage() {
    const { recentMessage } = useSelector((state) => state.auth);
     const {user:profile} = useSelector((state)=>state.auth)
     
     const navigate = useNavigate()

    const dispatch = useDispatch()

    useEffect (()=>{
        dispatch(recentMessages())
    },[dispatch])

        const changeIsRead = (room_id) => {
           
            dispatch(changeIsReadStatus(room_id)); //  This calls itself recursively, causing infinite loop
            dispatch(recentMessages());
        };

    const handleSendButton =(sid,studentName) => {
        // Navigate to the chat page with the tutor's ID and name as route parameters
         dispatch(updateNotification(sid));
        navigate(`/teacherchat/${sid}`, { state: { studentName } });
    }
  return (
    <div className='container mt-4'>
    <div className='row'>
        <TeacherSideBar/>
            <section className='col-md-9'>
            <div>
                   
                   {recentMessage?.recent_messages?.length > 0 ? (
                       recentMessage.recent_messages.map((msg,index)=>{
                           const sproid = msg.sender_profile.profile_id;
                           const rproid = msg.recipient_profile.profile_id;
                           const pid = profile.profile_id;
                           const profileid = sproid !== pid ? msg.sender_profile.profile_id: msg.recipient_profile.profile_id;
                           const studentName = sproid !== pid ? msg.sender_profile.first_name : msg.recipient_profile.first_name;
                           const studentId = sproid !== pid ? msg.sender_profile.id : msg.recipient_profile.id;
                           const reciever = msg.recipient_profile.profile_id === pid?<span style={{ color: "red", fontSize: "14px" }}>🔴</span>:null
                           return(
                               <div onClick={() =>{ 
                                handleSendButton(profileid,studentName,studentId)
                                changeIsRead(msg.room_id);
                               } } 
                               style={{display:"flex",marginBottom:"5px", cursor:"pointer",
                                border: "1px solid black", padding: "10px", 
                                borderRadius: "5px",width:"400px"}}>

<div style={{ display: "flex", alignItems: "center" }}>
                               <svg style={{marginTop:"5px",marginRight:"10px"}}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-rolodex" viewBox="0 0 16 16">
                                   <path d="M8 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                   <path d="M1 1a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h.5a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5.5.5 0 0 1 1 0 .5.5 0 0 0 .5.5h.5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6.707L6 1.293A1 1 0 0 0 5.293 1zm0 1h4.293L6 2.707A1 1 0 0 0 6.707 3H15v10h-.085a1.5 1.5 0 0 0-2.4-.63C11.885 11.223 10.554 10 8 10c-2.555 0-3.886 1.224-4.514 2.37a1.5 1.5 0 0 0-2.4.63H1z"/>
                                   </svg>
                               {
                                   sproid !== pid ?(
                                       <p>{msg.sender_profile.first_name}
                                       <span style={{marginLeft:"5px"}}>{msg.sender_profile.last_name}</span>
                                      
                                       </p>
                                   ):(
                                       <p>{msg.recipient_profile.first_name}
                                        <span style={{marginLeft:"5px"}}>{msg.recipient_profile.last_name}</span>
                                        
                                       </p>
                                   ) }
                                   </div>
                                   {!msg.is_read && (
                                      <span>  {reciever}</span>
                                    )}
                                   </div>
                           )
                       })
                   ):(
                       <p>No Messages</p>
                   )}
                   </div>
            </section>
      
    </div>
    </div>
  )
}

export default TutotRecentMessage
