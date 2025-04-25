import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosInstances';

function Report() {

    const [reportType, setReportType] = useState("students"); // Default: Students
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  const fetchReport = () => {
    setLoading(true);
    axiosInstance.get(`/reports/${reportType}/`)
      .then(response => {
        setReportData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
      
  };
  return (
    <div>
      This is reports
    </div>
  )
}

export default Report
