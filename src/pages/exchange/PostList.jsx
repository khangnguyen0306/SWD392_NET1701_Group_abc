import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal } from 'antd';
import { useDeletePostMutation, useGetAllPostQuery } from '../../services/postAPI';
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EditPostModal from './ModalEdit';

const { confirm } = Modal;

const PostList = () => {
    const { data: postData, isLoading: isLoadingPost, refetch: refetchPostData } = useGetAllPostQuery();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    useEffect(() => {
        refetchPostData();
    }, [refetchPostData]);

    const showDeleteConfirm = (postId) => {
        confirm({
            title: 'Are you sure you want to delete this post?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deletePost(postId).unwrap();
                    message.success('Post deleted successfully');
                    refetchPostData();
                } catch (error) {
                    console.log(error);
                    message.error('Failed to delete the post');
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleEdit = (post) => {
        setSelectedPost(post);
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditOk = () => {
        setIsEditModalVisible(false);
    };


    const handleReport = (postId) => {
        // Implement report functionality here
        message.info(`Report post ${postId}`);
    };

    const convertStatus = {
        true: <Badge color={"#33ff00"} text={"Đã được duyệt"} />,
        false: <Badge color={"#ffc125"} text={"Chưa được duyệt"} />
    };

    if (isLoadingPost) {
        return (
            <List
                itemLayout="vertical"
                size="large"
                dataSource={[...Array(10).keys()]}
                renderItem={() => (
                    <List.Item>
                        <Skeleton active />
                    </List.Item>
                )}
            />
        );
    }

    if (!postData || postData.length === 0) {
        return <div>No posts available</div>;
    }

    return (
        <>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={postData}
                renderItem={post => (
                    <List.Item key={post.id}>

                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar icon={<UserOutlined />} /> <p style={{ marginLeft: '1rem' }}>User</p>
                                </div>}
                            loading={isLoadingPost}
                            hoverable
                            extra={
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="edit" onClick={() => handleEdit(post.id)}>
                                                Edit
                                            </Menu.Item>
                                            <Menu.Item key="delete" onClick={() => showDeleteConfirm(post.id)}>
                                                Delete
                                            </Menu.Item>
                                            <Menu.Item key="report" onClick={() => handleReport(post.id)}>
                                                Report
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['click']}
                                >
                                    <Button type="text" icon={<EllipsisOutlined />} />
                                </Dropdown>
                            }
                        >
                            <Link to={`/postDetail/${post.id}`}>
                                <div dangerouslySetInnerHTML={{ __html: post.description }} style={{ marginLeft: '2rem', color: 'black' }} />
                                <p>{convertStatus[post.status]}</p>
                            </Link>
                        </Card>

                    </List.Item >
                )}
            />
            <EditPostModal
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                post={selectedPost}
                refetchPostData={refetchPostData}
            />
        </>
    );
};

export default PostList;
