import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal, Col, Row, Image } from 'antd';
import { useDeletePostMutation, useGetAllPostQuery } from '../../services/postAPI';
import { EditOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EditPostModal from './ModalEdit';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const { confirm } = Modal;

const PostList = () => {
    const { data: postData, isLoading: isLoadingPost, refetch: refetchPostData } = useGetAllPostQuery();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        refetchPostData();
    }, [refetchPostData]);

    // Ensure sorting creates a new array if needed
    const sortedPosts = postData ? [...postData].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

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
        return <Skeleton active />;
    }

    if (!postData || postData.length === 0) {
        return <div>No posts available</div>;
    }

    return (
        <>
            <List
                itemLayout="vertical"
                size="large"
                dataSource={sortedPosts}
                renderItem={post => (
                    <List.Item key={post.id}>
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {post.user.imgUrl ? (
                                        <Avatar src={post.user.imgUrl} size={'large'} />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                    <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{post.user.userName}</p>
                                    
                                </div>
                            }
                            hoverable
                            extra={
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {post?.user?.id === user?.id && (
                                                <>
                                                    <Menu.Item key="edit" onClick={() => handleEdit(post.id)} prefix={<EditOutlined />}>
                                                        Chỉnh sửa 
                                                    </Menu.Item>
                                                    <Menu.Item key="delete" onClick={() => showDeleteConfirm(post.id)}>
                                                        Xóa
                                                    </Menu.Item>
                                                </>
                                            )}
                                            {/* <Menu.Item key="report" onClick={() => handleReport(post.id)}>
                                                Báo cáo
                                            </Menu.Item> */}
                                        </Menu>
                                    }
                                    trigger={['click']}
                                >
                                    <Button type="text" icon={<EllipsisOutlined />} size="small" />
                                </Dropdown>
                            }
                        >
                            <Link to={`/postDetail/${post.id}`}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={15}>
                                        <div style={{ marginLeft: '2rem', color: 'black' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{post.title}</p>
                                            <div dangerouslySetInnerHTML={{ __html: post.description }} />
                                            <p style={{ marginTop: '1rem',position:'absolute',bottom:'0' }}>{convertStatus[post.publicStatus]}</p>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Image src={post?.imageUrl} alt='Hình ảnh bài đăng' style={{ maxWidth: '100%', height: '100%' }} preview={false} />
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                        </Card>
                    </List.Item>
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
