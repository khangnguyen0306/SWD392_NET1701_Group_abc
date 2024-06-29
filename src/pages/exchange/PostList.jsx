import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal, Col, Row, Image, Empty } from 'antd';
import { useCreateReportMutation, useDeletePostMutation, useGetAllPostQuery } from '../../services/postAPI';
import { EditOutlined, EllipsisOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EditPostModal from './ModalEdit';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { format } from 'date-fns';
import ReportModal from './ReportModal';

const { confirm } = Modal;

const PostList = () => {
    const { data: postData, isLoading: isLoadingPost, refetch: refetchPostData } = useGetAllPostQuery();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
    const [report] = useCreateReportMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const user = useSelector(selectCurrentUser);
    const [postDataForReport, setPostDataForReport] = useState('');

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

    //Edit Modal
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

    //Report modal


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };
    const handleReport = (post) => {
        setPostDataForReport(post);
        showModal();
        console.log(post)
    };

    const onReport = async (post) => {
        try {
            try {
                await report({
                    id: post.id,
                    body: post.body
                });
                message.success('Report post successfully');
                // refetchProductData();
                handleClose();
            } catch {
                message.error('Failed to Report post');
            }
        } catch (error) {
            message.error('Failed to Report post');
        }
    }

    const convertStatus = {
        true: <Badge color={"#33ff00"} text={"Approved"} />,
        false: <Badge color={"#ffc125"} text={"Not approved"} />
    };

    if (isLoadingPost) {
        return <Skeleton active />;
    }

    if (!postData || postData.length === 0) {
        return <Empty description="No posts available" />;
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
                                                        Edit
                                                    </Menu.Item>
                                                    <Menu.Item key="delete" onClick={() => showDeleteConfirm(post.id)}>
                                                        Delete
                                                    </Menu.Item>
                                                </>
                                            )}
                                            <Menu.Item key="report" onClick={() => handleReport(post)}>
                                                Report
                                            </Menu.Item>
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
                                        <div style={{ marginLeft: '2rem', color: 'black', paddingBottom: '3rem' }}>
                                            <p style={{ fontSize: '14px', color: 'GrayText', marginLeft: '-20px', marginBottom: '30px' }}>Posted on {format(new Date(post.date), 'MMMM dd, yyyy HH:mm')}</p>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{post.title}</p>
                                            <div dangerouslySetInnerHTML={{ __html: post.description }} />
                                        </div>
                                        <p style={{ marginTop: '2rem', position: 'absolute', bottom: '0', left: '20px' }}>{convertStatus[post.publicStatus]}</p>
                                    </Col>
                                    <Col xs={24} md={6}>
                                        <div style={{ textAlign: 'center' }}>
                                            <Image src={post?.imageUrl} alt='post image' style={{ maxWidth: '100%', height: '100%' }} preview={false} />
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
            <ReportModal
                visible={isModalVisible}
                onClose={handleClose}
                postData={postDataForReport}
                onReport={onReport}
            />
        </>
    );
};

export default PostList;
