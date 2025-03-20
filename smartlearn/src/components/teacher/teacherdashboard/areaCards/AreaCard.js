import React from 'react'
import PropTypes from 'prop-types';
import {
    PieChart,Pie, Cell, Tooltip
} from "recharts";

const AreaCard = ({ colors, percentFillValue, cardInfo }) => {
  // const totalHours = 24; // A full day
  // const completedHours = Math.round((percentFillValue / 100) * totalHours);
  // const remainingHours = totalHours - completedHours;

  let totalUnits;
  let completedUnits;
  let remainingUnits;
  let unitLabel;
  const today = new Date();
  const currentHour = today.getHours();
  const currentDay = today.getDay(); // Sunday = 0, Monday = 1, ...
  const currentDate = today.getDate();
  const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  if (cardInfo.title.includes("Today")) {
    // Daily Data (Hours)
    totalUnits = 24;
    completedUnits = currentHour;
    remainingUnits = totalUnits - completedUnits;
    unitLabel = "Hours";
  } else if (cardInfo.title.includes("Week")) {
    // Weekly Data (Days)
    totalUnits = 7;
    completedUnits = currentDay; // Current day of the week (0-6)
    remainingUnits = totalUnits - completedUnits;
    unitLabel = "Days";
  } else if (cardInfo.title.includes("Month")) {
    // Monthly Data (Days)
    totalUnits = totalDaysInMonth;
    completedUnits = currentDate;
    remainingUnits = totalUnits - completedUnits;
    unitLabel = "Days";
  }

  const data = [
    { name: `Remaining ${unitLabel}`, value: remainingUnits },
    { name: `Completed ${unitLabel}`, value: completedUnits },
  ];

  const renderTooltipContent = (value, name) => {
    return `${value} ${unitLabel} (${Math.round((value / totalUnits) * 100)}%)`;
  };
  
    return (
      <div className="area-card">
        <div className="area-card-info">
          <h5 className="info-title">{cardInfo.title}</h5>
          <div className="info-value">{cardInfo.value}</div>
          <p className="info-text">{cardInfo.text}</p>
        </div>
        <div className="area-card-chart">
          <PieChart width={100} height={100}>
            <Pie
              data={data}
              cx={50}
              cy={45}
              innerRadius={20}
              fill="#e4e8ef"
              paddingAngle={0}
              dataKey="value"
              startAngle={-270}
              endAngle={150}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={renderTooltipContent} />
          </PieChart>
        </div>
      </div>
    );
  };
  
  export default AreaCard;
  
  AreaCard.propTypes = {
    colors: PropTypes.array.isRequired,
    percentFillValue: PropTypes.number.isRequired,
    cardInfo: PropTypes.object.isRequired,
  };
  