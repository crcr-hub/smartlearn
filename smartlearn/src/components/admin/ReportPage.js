// import React, { useEffect, useState } from 'react'
// import axiosInstance from '../../utils/axiosInstances';

// function ReportPage() {

//     const [reportType, setReportType] = useState("students"); // Default: Students
//     const [reportData, setReportData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [sortBy, setSortBy] = useState(""); // Sorting key
//     const [sortOrder, setSortOrder] = useState("asc"); // Default: Ascending order
  
//     useEffect(() => {
//         console.log("typessssss",reportType)
//       fetchReport();
//     }, [reportType]);
  
//     useEffect(() => {
//       if (reportData && sortBy) {
//         sortData(sortOrder); // Apply sorting when sortBy or sortOrder changes
//       }
//     }, [sortBy, sortOrder]);
  


  

//     const fetchReport = () => {
//       setLoading(true);
    
//       axiosInstance
//         .get(`/reports/${reportType}/`)
//         .then((response) => {
//           setReportData(response.data);
//           setLoading(false);
//         })
//         .catch((error) => {
//           console.error("Error fetching reports:", error);
//           setLoading(false);
//         });
//     };
  
//     const sortData = (order) => {
//         if (!sortBy || !reportData || !reportData[reportType]) return;
  
//       const sortedData = [...reportData[reportType]].sort((a, b) => {
//         if (sortBy.includes("date")) {
//           return order === "asc"
//             ? new Date(a[sortBy]) - new Date(b[sortBy])
//             : new Date(b[sortBy]) - new Date(a[sortBy]);
//         } else {
//           return order === "asc"
//             ? a[sortBy].localeCompare(b[sortBy])
//             : b[sortBy].localeCompare(a[sortBy]);
//         }
//       });
  
//       setReportData({ ...reportData, [reportType]: sortedData });
//     };
  
//     const handleSortByChange = (e) => {
//       setSortBy(e.target.value);
//       setSortOrder("asc"); // Reset to ascending when a new sorting key is selected
//     };
  

//   return (
//     <div>
//       <h2>Admin Reports</h2>

//       {/* Dropdown Selection */}
     

//       <div style={{display:"flex" ,marginBottom:"50px",marginTop:"50px"}}>

//       <select  value={reportType}onChange={(e) => {
//     console.log("Dropdown change detected:", e.target.value);
//     setReportType(e.target.value);}} class="form-select"
//        aria-label="Default select example"
//        style={{width:"200px"}}
//        >
//         <option value="students">Enrolled Students</option>
//         <option value="teachers">Teachers</option>
//         <option value="courses">Courses</option>
//         </select>

//         <label style={{marginLeft:"50px",marginTop:"5px"}}>Sort by: </label>
//         <select   value={sortBy} onChange={handleSortByChange} class="form-select"
//        aria-label="Default select example"
//        style={{width:"200px",marginLeft:"10px"}}
//        >
//         <option value="student_name">Student Name</option>
//           <option value="enrolled_date">Enrolled Date</option>
//           <option value="course_name">Course Name</option>
//         </select>

//         <button type="button" class="btn btn-outline-warning"
//         onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//         >    {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"} </button>
       

//             </div>
//       {/* Sorting Options */}
    

//       {loading && <p>Loading...</p>}

//       {/* Display Report Data */}
//       {reportData && (
//         <div>
//           {reportType === "students" && (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Student Name</th>
//                   <th>Course</th>
//                   <th>Enrolled Date</th>
//                   <th>Purchased Price</th>
//                   <th>Teacher</th>
//                 </tr>
//               </thead>
//               <tbody>
             
//                 {reportData.students.map((student, index) => (
//                   <tr key={index}>
//                     <td>{student.student_name}</td>
//                     <td>{student.course_name}</td>
//                     <td>{student.enrolled_date}</td>
//                     <td>₹{Number(student.offer_price).toLocaleString("en-IN")}</td>
//                     <td>{student.teacher}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {reportType === "teachers" && (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Teacher Name</th>
//                   <th>Registered Date</th>
//                   <th>Course Name</th>
//                   <th>Total Students</th>
//                   <th>Total Income</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.teachers.map((teacher, index) => (
//                   <tr key={index}>
//                     <td>{teacher.teacher_name}</td>
//                     <td>{teacher.registered_date}</td>
//                     <td>{teacher.course_name}</td>
//                     <td>{teacher.total_students}</td>
//                     <td>₹{Number(teacher.total_income).toLocaleString("en-IN")}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}

//           {reportType === "courses" && (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Course Name</th>
//                   <th>Teacher</th>
//                   <th>Total Students</th>
//                   <th>Total Income</th>
//                   <th>Modules Count</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {reportData.courses.map((course, index) => (
//                   <tr key={index}>
//                     <td>{course.course_name}</td>
//                     <td>{course.teacher}</td>
//                     <td>{course.total_students}</td>
//                     <td>₹{Number(course.total_income).toLocaleString("en-IN")}</td>
//                     <td>{course.modules_count}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
// );
// }

// export default ReportPage

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstances';
import jsPDF from "jspdf"; // No destructuring
import "jspdf-autotable";
import autoTable from "jspdf-autotable";


import * as XLSX from "xlsx";

function ReportPage() {
  const [reportType, setReportType] = useState('students'); // Default: Students
  const [reportData, setReportData] = useState({}); // Initialize as empty object
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  useEffect(() => {
    if (reportData[reportType] && sortBy) {
      sortData(sortOrder);
    }
  }, [sortBy, sortOrder]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/reports/${reportType}/`);
      
      // Extract nested array if necessary
      const data = response.data[reportType] || response.data || [];

      setReportData((prevData) => ({
        ...prevData,
        [reportType]: Array.isArray(data) ? data : [], // Ensure it's an array
      }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReportData((prevData) => ({
        ...prevData,
        [reportType]: [], // Fallback to empty array
      }));
    } finally {
      setLoading(false);
    }
  };

  const sortData = (order) => {
    if (!sortBy || !Array.isArray(reportData[reportType])) return;

    const sortedData = [...reportData[reportType]].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return order === 'asc' ? valueA - valueB : valueB - valueA;
      } else if (sortBy.includes('date')) {
        return order === 'asc'
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      } else {
        return order === 'asc'
          ? String(valueA).localeCompare(String(valueB))
          : String(valueB).localeCompare(String(valueA));
      }
    });

    setReportData((prevData) => ({
      ...prevData,
      [reportType]: sortedData,
    }));
  };

  // Define sorting options based on report type
  const getSortingOptions = () => {
    switch (reportType) {
      case 'students':
        return [
          { value: 'student_name', label: 'Student Name' },
          { value: 'enrolled_date', label: 'Enrolled Date' },
          { value: 'course_name', label: 'Course Name' },
        ];
      case 'teachers':
        return [
          { value: 'teacher_name', label: 'Teacher Name' },
          { value: 'course_count', label: 'Number of Courses' },
          { value: 'total_students', label: 'Total Students' },
        ];
      case 'courses':
        return [
          { value: 'course_name', label: 'Course Name' },
          { value: 'teacher', label: 'Teacher' },
          { value: 'total_students', label: 'Total Students' },
          { value: 'total_income', label: 'Total Income' },
          { value: 'modules_count', label: 'Modules Count' },
        ];
      default:
        return [];
    }
  };


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Report: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 20, 10);
  
    const headers = {
      students: ["Student Name", "Course", "Enrolled Date", "Purchased Price", "Teacher"],
      teachers: ["Teacher Name", "Number of Courses", "Total Students"],
      courses: ["Course Name", "Teacher", "Total Students", "Total Income", "Modules Count"],
    };
  
    const keyMapping = {
        students: ["student_name", "course_name", "enrolled_date", "offer_price", "teacher"],
        teachers: ["teacher_name", "course_count", "total_students"],
        courses: ["course_name", "teacher", "total_students", "total_income", "modules_count"],
      };
    
      const rows = reportData[reportType]?.map((item) =>
        keyMapping[reportType].map((key) => item[key] || "N/A") // Ensure valid keys
      );
  
    autoTable(doc,{
      head: [headers[reportType]],
      body: rows || [],
    });
  
    doc.save(`${reportType}_report.pdf`);
  };
  
  // Generate Excel
  const downloadExcel = () => {
    const headers = {
      students: ["Student Name", "Course", "Enrolled Date", "Purchased Price", "Teacher"],
      teachers: ["Teacher Name", "Number of Courses", "Total Students"],
      courses: ["Course Name", "Teacher", "Total Students", "Total Income", "Modules Count"],
    };
  
    const keyMapping = {
      students: ["student_name", "course_name", "enrolled_date", "offer_price", "teacher"],
      teachers: ["teacher_name", "course_count", "total_students"],
      courses: ["course_name", "teacher", "total_students", "total_income", "modules_count"],
    };
  
    // Map data using keyMapping instead of dynamically transforming headers
    const rows = reportData[reportType]?.map((item) =>
      keyMapping[reportType].map((key) => item[key] || "N/A") // Ensures correct keys are used
    );
  
    // Convert to worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers[reportType], ...rows]);
  
    // Create workbook and export
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_report.xlsx`);
  };
  

  

  return (
    <div>
      <h2>Admin Reports</h2>

      {/* Dropdown Selection */}
      <div style={{ display: 'flex', marginBottom: '50px', marginTop: '50px' }}>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="form-select"
          style={{ width: '200px' }}
        >
          <option value="students">Enrolled Students</option>
          <option value="teachers">Teachers</option>
          <option value="courses">Courses</option>
        </select>

        {/* Sorting Dropdown */}
        <label style={{ marginLeft: '50px', marginTop: '5px' }}>Sort by: </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-select"
          style={{ width: '200px', marginLeft: '10px' }}
        >
          <option value="">Select Sorting</option>
          {getSortingOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Sorting Order Button */}
        {sortBy && (
          <button
            type="button"
            className="btn btn-outline-warning"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
          </button>
        )}



      </div>

      <div style={{ marginBottom: "20px"  }}>
        <button onClick={downloadPDF} className="btn btn-danger" style={{ marginRight: "10px" }}>
          Download PDF
        </button>
        <button onClick={downloadExcel} className="btn btn-success">
          Download Excel
        </button>
      </div>
    
      {/* Loading Indicator */}
      {loading && <p>Loading...</p>}

      {/* Display Report Data */}
      {Array.isArray(reportData[reportType]) && reportData[reportType].length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              {reportType === 'students' && (
                <>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Enrolled Date</th>
                  <th>Purchased Price</th>
                  <th>Teacher</th>
                </>
              )}
              {reportType === 'teachers' && (
                <>
                  <th>Teacher Name</th>
                  <th>Number of Courses</th>
                  <th>Total Students</th>
                 
                </>
              )}
              {reportType === 'courses' && (
                <>
                  <th>Course Name</th>
                  <th>Teacher</th>
                  <th>Total Students</th>
                  <th>Total Income</th>
                  <th>Modules Count</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {reportData[reportType].map((item, index) => (
              <tr key={index}>
                {reportType === 'students' && (
                  <>
                    <td>{item.student_name}</td>
                    <td>{item.course_name}</td>
                    <td>{item.enrolled_date}</td>
                    <td>₹{Number(item.offer_price).toLocaleString('en-IN')}</td>
                    <td>{item.teacher}</td>
                  </>
                )}
                {reportType === 'teachers' && (
                  <>
                    <td>{item.teacher_name}</td>
                    <td>{item.course_count}</td>
                    <td>{item.total_students}</td>
                  </>
                )}
                {reportType === 'courses' && (
                  <>
                    <td>{item.course_name}</td>
                    <td>{item.teacher}</td>
                    <td>{item.total_students}</td>
                    <td>₹{Number(item.total_income).toLocaleString('en-IN')}</td>
                    <td>{item.modules_count}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
}

export default ReportPage;
