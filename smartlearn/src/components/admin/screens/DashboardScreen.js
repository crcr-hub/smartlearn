import { useDispatch, useSelector } from "react-redux";
import { AreaCards, AreaCharts, AreaTable, AreaTop } from "../../../components/admin";
import AdminNavbar from "../AdminNavbar";
import { useEffect } from "react";
import { adminDashboard, tutorDashboard } from "../../../redux/authSlices";


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
      {/* <AreaTable cardInfo={adminDashboardData}/> */}
    </div>
  );
};

export default Dashboard;
