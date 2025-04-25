import { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ThemeContext } from "../../../../context/ThemeContext";
import {FaArrowUpLong} from "react-icons/fa6";
import { LIGHT_THEME } from "../../../../constants/ThemeConstants";
import "./AreaCharts.scss";



const AreaBarChart = ({cardInfo}) => {




  const defaultMonths = [
    { month: "Jan", students: 0, revenue: 0 },
    { month: "Feb", students: 0, revenue: 0 },
    { month: "Mar", students: 0, revenue: 0 },
    { month: "Apr", students: 0, revenue: 0 },
    { month: "May", students: 0, revenue: 0 },
    { month: "Jun", students: 0, revenue: 0 },
    { month: "Jul", students: 0, revenue: 0 },
    { month: "Aug", students: 0, revenue: 0 },
    { month: "Sep", students: 0, revenue: 0 },
    { month: "Oct", students: 0, revenue: 0 },
    { month: "Nov", students: 0, revenue: 0 },
    { month: "Dec", students: 0, revenue: 0 },
  ];

  const apiData = cardInfo?.monthly_revenue_students?.map((entry) => ({
    month: entry.month, // "Jan", "Feb", etc.
    students: entry.students || 0,
    revenue: entry.revenue || 0,
  })) || [];
 

    const data = defaultMonths.map((defaultMonth) => {
      const existingData = apiData.find((d) => d.month === defaultMonth.month);
      return existingData ? existingData : defaultMonth;
    });





  const { theme } = useContext(ThemeContext);

  const CustomXAxisTick = ({ x, y, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10} // Adjust vertical positioning
        textAnchor="middle"
        fontSize={12}
        fill={theme === "light" ? "#676767" : "#f3f3f3"}
      >
        {payload.value}
      </text>
    </g>
  );
  

  const formatTooltipValue = (value, name) => {
    if (name === "revenue") return `₹${value}`;
    return `${value}`; 
  };
  
  const formatYAxisLabel = (value) => `₹${value}`; 
  const formatYAxisLabel1 = (value) => `${value}`; 

  const formatLegendValue = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bar-chart" style={{ width: "90%" }}>
      <div className="bar-chart-info">
        <h5 className="bar-chart-title">Total Revenue</h5>
        <div className="chart-info-data">
          <div className="info-data-value">{`₹${cardInfo?.total_revenue || "0.00"}`}</div>
          <div className="info-data-text">
            <FaArrowUpLong />
            <p>5% than last month.</p>
          </div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={200}
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }} // Increase bottom margin for better spacing
            barGap={2} // Adjust gap between bars
            barCategoryGap="10%" // Ensures bars don't overlap
           
          >
            {/* <XAxis
              padding={{ left: 10 }}
              dataKey="month"
              tickSize={0}
              tick={<CustomXAxisTick />}
              axisLine={{ stroke: "#ccc" }}
            /> */}


            <XAxis
              dataKey="month"
              tickLine={false} // Hide the small tick lines to avoid clutter
              axisLine={{ stroke: "#ccc" }} // Ensure the axis line is visible
              interval={0} // Ensures every month is displayed (prevents skipping)
              //angle={-25} // Rotates the text slightly for better readability
              textAnchor="end" // Aligns the text properly when rotated
            />

            <YAxis
              padding={{ bottom: 10, top: 10 }}
               yAxisId="left"
              tickFormatter={formatYAxisLabel}
              tickCount={6}
              axisLine={false}
              tickSize={0}
              tick={{
                fill: `${theme === LIGHT_THEME ? "#676767" : "#f3f3f3"}`,
              }}
              domain={[0, 'dataMax']}
            />

          <YAxis
           padding={{ bottom: 10, top: 10 }}
            yAxisId="right"
            orientation="right"
            tickFormatter={formatYAxisLabel1}
            tickCount={6}
            axisLine={false}
            tickSize={0}
            tick={{ fill: theme === LIGHT_THEME ? "#676767" : "#f3f3f3" }}
            domain={[0, 'dataMax']}
          />
            <Tooltip
              formatter={formatTooltipValue}
              cursor={{ fill: "transparent" }}
            />
            
            <Legend
              iconType="circle"
              iconSize={10}
              verticalAlign="top"
              align="right"
              formatter={formatLegendValue}
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="#475be8"
              barSize={20} // Smaller bars give more space for labels
              radius={[4, 4, 0, 0]} // Ensure top corners are rounded
            />

            <Bar
             yAxisId="right"
              dataKey="students"
              fill="#e3e7fc"
              activeBar={false}
              isAnimationActive={false}
              barSize={24}
              radius={[4, 4, 4, 4]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AreaBarChart;
