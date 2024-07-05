import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal, Col, Row, Image, Empty, Input } from 'antd';
import { useCreateReportMutation, useDeletePostMutation, useGetAllPostQuery } from '../../services/postAPI';
import { EditOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EditPostModal from './ModalEdit';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { format } from 'date-fns';
import ReportModal from './ReportModal';

const { confirm } = Modal;
const { Search } = Input;

const PostList = () => {
    const { data: postData, isLoading: isLoadingPost, refetch: refetchPostData } = useGetAllPostQuery();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
    const [report] = useCreateReportMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const user = useSelector(selectCurrentUser);
    const [postDataForReport, setPostDataForReport] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        refetchPostData();
    }, [refetchPostData]);

    const sortedPosts = postData ? [...postData].sort((a, b) => new Date(b.date) - new Date(a.date)) : [];

    const filteredPosts = sortedPosts.filter(post =>
        post.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const handleReport = (post) => {
        setPostDataForReport(post);
        showModal();
    };

    const onReport = async (post) => {
        try {
            await report({
                id: post.id,
                body: post.body
            });
            message.success('Report post successfully');
            handleClose();
        } catch (error) {
            message.error('Failed to report post');
        }
    };

    const truncateName = (name, maxChars) => {
        if (name.length > maxChars) {
            return name.slice(0, maxChars) + '...';
        }
        return name;
    };

    const convertStatus = {
        true: <Badge color={"#33ff00"} text={"Approved"} />,
        false: <Badge color={"#ff0000"} text={"Not approved"} />
    };

    if (isLoadingPost) {
        return <Skeleton active />;
    }

    if (!postData || postData.length === 0) {
        return <Empty description="No posts available" />;
    }

    return (
        <>
            <Search
                placeholder="Search posts by product name"
                enterButton
                onSearch={(value) => setSearchTerm(value)}
                style={{
                    marginTop: '1rem',
                    marginBottom: '2rem',
                    height: '50px',
                    fontSize: '18px',
                    padding: '10px 16px'
                }}
            />
            <List
                itemLayout="vertical"
                size="large"
                dataSource={filteredPosts}
                renderItem={post => (
                    <List.Item key={post.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card
                            hoverable
                            style={{ width: '60%', marginBottom: '2rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar src={post.user.imgUrl} size={'large'} icon={<UserOutlined />} style={{ marginRight: '1rem' }} />
                                    <div>
                                        <p style={{ fontWeight: 'bold', fontSize: '1rem', margin: '0' }}>{post.user.userName}</p>
                                        <p style={{ margin: '0' }}>
                                            Posted on {format(new Date(post.date), 'MMMM dd, yyyy')}
                                        </p>
                                        <p style={{ marginTop: '1rem' }}>
                                            {convertStatus[post.publicStatus]}
                                        </p>
                                    </div>
                                </div>
                                <Dropdown
                                    overlay={
                                        <Menu>
                                            {post?.user?.id === user?.id && (
                                                <>
                                                    <Menu.Item key="edit" onClick={() => handleEdit(post.id)}>
                                                        Edit
                                                    </Menu.Item>
                                                    <Menu.Item key="delete" onClick={() => showDeleteConfirm(post.id)}>
                                                        Delete
                                                    </Menu.Item>
                                                </>
                                            )}
                                            {post?.user?.id !== user?.id && (
                                                <Menu.Item key="report" onClick={() => handleReport(post)}>
                                                    Report
                                                </Menu.Item>
                                            )}
                                        </Menu>
                                    }
                                    trigger={['click']}
                                >
                                    <Button type='text' icon={<SettingOutlined />} size="large" />
                                </Dropdown>
                            </div>
                            <Link to={`/postDetail/${post.id}`}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <div style={{ color: 'black' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '1rem' }}>{post.title}</p>
                                            <div dangerouslySetInnerHTML={{ __html: truncateName(post.description, 90) }} />
                                            <Button type='link' style={{ padding: 0 }}>View all</Button>
                                        </div>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Image
                                            src={post?.imageUrl}
                                            alt="post image"
                                            style={{ maxWidth: '100%', height: 'auto' }}
                                            preview={false}
                                        />
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
