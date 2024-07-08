import React from 'react';
import ReportTable from './TableReport';
import { useDeletePostStaffMutation, useDeleteReportStaffMutation, useGetAllPendingPostsQuery, useGetReportQuery } from '../../../services/postAPI';
import { message } from 'antd';

const ReportMainComponent = () => {
    const { data: reportData, isLoading, refetch: refetchDataReport } = useGetReportQuery();
    const { refetch: refetchPostData } = useGetAllPendingPostsQuery();
    const [deletePost] = useDeletePostStaffMutation();
    const [deleteReport] = useDeleteReportStaffMutation();
    
    const handleDeletePost = async (postId, reportId) => {
        try {
            await deletePost({ id: postId, newStatus: false }).unwrap();
            await deleteReport(reportId).unwrap();
            refetchDataReport();
            refetchPostData();
            message.success("Post deleted successfully!", 1.5);
        } catch (error) {
            message.error("Delete post unsuccessful. Please try again.");
        }
    };

    return (
        <div style={{ marginTop: '6.5rem', width: '100%', height: '100vh' }}>
            <ReportTable
                reportData={reportData}
                onDelete={handleDeletePost}
                refetchReports={refetchDataReport}
                refetchPosts={refetchPostData}
            />
        </div>
    );
};

export default ReportMainComponent;
