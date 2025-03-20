import React, { useEffect } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTutorsStudent } from '../../../redux/authSlices'

function TecherMessage() {
    const dispatch = useDispatch()
    const {studentlist} = useSelector((state)=>state.auth)
    console.log(studentlist)
    useEffect(()=>{
        console.log("working")
        dispatch(fetchTutorsStudent())
    },[dispatch])
  return (
    <div className='container mt-4'>
    <div className='row'>
    <TeacherSideBar/>
    <section className='col-md-9'>
        Hellooo
      </section>
    </div>
    </div>
  )
}

export default TecherMessage
