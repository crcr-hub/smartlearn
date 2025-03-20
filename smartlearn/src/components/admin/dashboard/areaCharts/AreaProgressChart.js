
  
  const AreaProgressChart = ({cardInfo}) => {
    const maxStudentCount = Math.max(...(cardInfo?.top_courses?.map(course => course.student_count) || [1]));
    console.log("Max Student Count:", maxStudentCount);
    return (
      <div className="progress-bar" >
        <div className="progress-bar-info">
          <h4 className="progress-bar-title">Most Purchased Courses</h4>
        </div>
        <div className="progress-bar-list">
          {cardInfo?.top_courses?.map((course, index) =>  {
             const widthPercentage = maxStudentCount > 0 ? (course.student_count / maxStudentCount) * 100 : 0;
            return (
              <div className="progress-bar-item" key={course.course_id}>
                <div className="bar-item-info">
                  <p className="bar-item-info-name">{course.course_name}</p>
                  <p className="bar-item-info-value">
                  {course.student_count}
                  </p>
                </div>
                <div className="bar-item-full">
                  <div
                    className="bar-item-filled"
                    style={{
                      width: `${widthPercentage}%`,
                      backgroundColor: "#4caf50",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default AreaProgressChart;
  