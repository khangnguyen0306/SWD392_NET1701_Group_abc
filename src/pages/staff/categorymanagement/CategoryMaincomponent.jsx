import React from 'react'
import { useDeletePostStaffMutation, useDeleteReportStaffMutation, useGetAllPendingPostsQuery, useGetReportQuery } from '../../../services/postAPI'
import { message } from 'antd';
import TableCategories from './TableCategoty';
import { useGetAllCategoriesQuery } from '../../../services/productAPI';

const CategoriesMainComponent = () => {
    const { data: categoryData, isLoading, refetch: refetchDataCategory } = useGetAllCategoriesQuery();
    console.log(categoryData);
    const { refetch: refetchPostData } = useGetAllPendingPostsQuery();
    const [deletePost] = useDeletePostStaffMutation();
    const [deleteReport] = useDeleteReportStaffMutation();
    const handleDeletePost = async (postId, reportId) => {
        console.log(postId);
        try {
            await deletePost({ id: postId, newStatus: false }).unwrap();        ///chinh API 
            await deleteReport(reportId);
            refetchDataReport();
            refetchPostData();
            message.success("Post approved successfully!", 1.5);
        } catch (error) {
            message.error("Approve post unsuccessful. Please try again.");
        }
    };

    return (
        <div style={{ marginTop: '6.5rem', width: '100%' }}>
            <TableCategories
                categoryData={categoryData}
                onDelete={handleDeletePost}
                refetchDataCategory={refetchDataCategory}
            />
        </div>
    )
}

export default CategoriesMainComponent