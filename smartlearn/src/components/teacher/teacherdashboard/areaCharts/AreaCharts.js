import AreaBarChart from "./AreaBarChart"
import AreaProgressChart from "./AreaProgressChart"

const AreaCharts = ({cardInfo}) => {
  return (
    <section className="content-area-charts">
      <AreaBarChart cardInfo={cardInfo}/>
      <AreaProgressChart cardInfo={cardInfo}/>
    </section>
  )
}

export default AreaCharts
