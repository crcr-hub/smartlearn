import { useDispatch, useSelector } from "react-redux";
import { AreaCards, AreaCharts,  AreaTop } from "../../../components/admin";
import { useEffect } from "react";
import { adminDashboard } from "../../../redux/authSlices";


const Dashboard = () => {
  const dispatch = useDispatch()
  const {adminDashboardData} = useSelector((state)=>state.auth)
  console.log(adminDashboardData)
  useEffect(()=>{
    dispatch(adminDashboard())
  },[dispatch])

  return (
    <div className="content-area">
      <AreaTop cardInfo={adminDashboardData} />
      <AreaCards cardInfo={adminDashboardData}/>
      <AreaCharts cardInfo={adminDashboardData}/>
     
    </div>
  );
};

export default Dashboard;
