import React from 'react'
import ReportTable from './TableReport'
import { useGetReportQuery } from '../../../services/postAPI'

const reportMainComponent = () => {
    const { data: reportData, isLoading } = useGetReportQuery();
    console.log(reportData)
    return (
        <div style={{ marginTop: '6.5rem', width: '100%' }}>
            <ReportTable reportData={reportData} />
        </div>
    )
}

export default reportMainComponent