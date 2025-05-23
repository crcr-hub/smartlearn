import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "No.",
  "Date",
  "Student name",
  "Course",
  "Action",
];



const AreaTable = ({cardInfo}) => {
  return (
    <section className="content-area-table">
      <div className="data-table-info">
        <h4 className="data-table-title">Latest Orders</h4>
      </div>
      <div className="data-table-diagram">
        <table>
          <thead>
            <tr>
              {TABLE_HEADS?.map((th, index) => (
                <th key={index}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cardInfo?.latest_orders?.map((dataItem,index) => {
              return (
                <tr  key={dataItem.order_id}>
                 <td>{index+1}</td>
                  <td>{dataItem.date}</td>
                  <td>{dataItem.student_name}</td>
                  <td>{dataItem.course_name}</td>
                  
                 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AreaTable;
