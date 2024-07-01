import React from 'react'
import ReportTable from './TableReport'
import { useDeletePostStaffMutation, useDeleteReportStaffMutation, useGetAllPendingPostsQuery, useGetReportQuery } from '../../../services/postAPI'
import { message } from 'antd';

const reportMainComponent = () => {
    const { data: reportData, isLoading, refetch: refetchDataReport } = useGetReportQuery();
    const { refetch: refetchPostData } = useGetAllPendingPostsQuery();
    const [deletePost] = useDeletePostStaffMutation();
    const [deleteReport] = useDeleteReportStaffMutation();
    const handleDeletePost = async (postId, reportId) => {
        console.log(postId);
        try {
            await deletePost({ id: postId, newStatus: false }).unwrap();      
            await deleteReport(reportId);
            refetchDataReport();
            refetchPostData();
            message.success("Post approved successfully!", 1.5);
        } catch (error) {
            message.error("Approve post unsuccessful. Please try again.");
        }
    };

    return (
        <div style={{ marginTop: '6.5rem', width: '100%',height:'100vh' }}>
            <ReportTable
                reportData={reportData}
                onDelete={handleDeletePost}
            />
        </div>
    )
}

export default reportMainComponent