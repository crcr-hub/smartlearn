import React, { useEffect } from 'react'
import TeacherSideBar from '../TeacherSideBar'
import { useDispatch } from 'react-redux'
import { fetchTutorsStudent } from '../../../redux/authSlices'

function TecherMessage() {
    const dispatch = useDispatch()

    useEffect(()=>{
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
