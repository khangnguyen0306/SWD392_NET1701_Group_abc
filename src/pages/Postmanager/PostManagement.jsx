import React, { useState } from 'react';
import { useGetAllPendingPostsQuery, useCreatePostMutation, useEditPostMutation, useDeletePostMutation, useApprovePostMutation } from "../../services/postAPI";
import TablePost from './TablePost';
import { Button, Form, Layout, message } from 'antd';
import AddPostModal from './AddPostModal';
import EditPostModal from './EditPostModal';

const PostManagement = () => {
  const { data: postData, isLoading: isLoadingPostData, refetch: refetchPostData } = useGetAllPendingPostsQuery();
  const [form] = Form.useForm();
  const [postDataEdit, setPostDataEdit] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [addPost] = useCreatePostMutation();
  const [editPost] = useEditPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [approvePost] = useApprovePostMutation();

  // Show/Hide Modals
  const handleCancel = () => setIsModalVisible(false);
  const handleEditCancel = () => setIsEditModalVisible(false);

  const showModal = () => setIsModalVisible(true);

  const handleAddPost = async (post) => {
    try {
      const addedPost = await addPost(post).unwrap();
      refetchPostData();
      message.success("Add Post successfully!", 1.5);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Add post unsuccessful. Please try again.");
    }
  };

  const showEditModal = (post) => {
    setPostDataEdit(post);
    setIsEditModalVisible(true);
  };

  const handleEditPost = async (post) => {
    try {
      await editPost({ id: postDataEdit.id, body: post }).unwrap();
      refetchPostData();
      message.success("Post Edit successfully!", 1.5);
      setIsEditModalVisible(false);
    } catch (error) {
      message.error("Edit post unsuccessful. Please try again.");
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await approvePost(postId).unwrap();
      refetchPostData();
      message.success("Post approved successfully!", 1.5);
    } catch (error) {
      message.error("Approve post unsuccessful. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      refetchPostData();
      message.success("Post deleted successfully!", 1.5);
    } catch (error) {
      message.error("Delete post unsuccessful. Please try again.");
    }
  };

  const addModalParams = {
    handleCancel,
    handleOk: handleAddPost,
    visible: isModalVisible,
    form,
  };

  const editModalParams = {
    handleCancel: handleEditCancel,
    handleEdit: handleEditPost,
    visible: isEditModalVisible,
    postData: postDataEdit,
    form,
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'end', marginTop: '6.5rem' }}>
        <Button onClick={showModal}>Add Post</Button>
      </div>
      <TablePost
        postData={postData}
        onEdit={showEditModal}
        onApprove={handleApprovePost}
        onDelete={handleDeletePost}
      />
      <AddPostModal {...addModalParams} />
      <EditPostModal {...editModalParams} />
    </Layout>
  );
};

export default PostManagement;
