import { useDispatch, useSelector } from "react-redux";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../teacher/indexes";
import { tutorDashboard } from "../../../redux/authSlices";
import { useEffect } from "react";



const TeacherDashboardScreen = () => {
  const dispatch = useDispatch()
  const {tutordashboardData} = useSelector((state)=>state.auth)
  console.log(tutordashboardData)
  useEffect (()=>{
    dispatch(tutorDashboard())
  },[dispatch])
  return (
    <div className="content-area">
      <AreaTop cardInfo={tutordashboardData}/>
      <AreaCards  cardInfo={tutordashboardData} />
      <AreaCharts cardInfo={tutordashboardData}/>
      <AreaTable cardInfo={tutordashboardData} />
    </div>
  );
};

export default TeacherDashboardScreen;
