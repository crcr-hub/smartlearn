import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"

const AreaCharts = ({cardInfo}) => {
  return (
    <section className="content-area-charts" style={{width:"110%"}}>
      <div style={{marginLeft:"10px",width:"110%"}}>
      <AreaBarChart cardInfo={cardInfo}/>
      </div>
    <div style={{marginLeft:"-10px",marginTop:"10px"}}>
      <AreaProgressChart cardInfo={cardInfo}/>
      </div>
    </section>
  )
}

export default AreaCharts
