import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"

const AreaCharts = ({cardInfo}) => {
  return (
    <section className="content-area-charts">
      <AreaBarChart cardInfo={cardInfo}/>
      <div style={{marginLeft:"-200px"}}>
      <AreaProgressChart cardInfo={cardInfo}/>
      </div>
     
    </section>
  )
}

export default AreaCharts
