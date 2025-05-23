import AreaTableAction from "./AreaTableAction";
import "./AreaTable.scss";

const TABLE_HEADS = [
  "Order ID",
  "Date",
  "Student name",
  "Course",
  "Action",
];



const AreaTable = ({cardInfo}) => {
  return (
    <section className="content-area-table" style={{width:"110%"}}>
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
            {cardInfo?.latest_orders?.map((dataItem) => {
             
              return (
                <tr key={dataItem.order_id}>
                  <td>{dataItem.order_id}</td>
                  <td>{dataItem.date}</td>
                  <td>{dataItem.student_name}</td>
                  <td>{dataItem.course_name}</td>
                  
                  {/* <td>${dataItem.amount.toFixed(2)}</td> */}
                  <td className="dt-cell-action">
                    <AreaTableAction />
                  </td>
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
