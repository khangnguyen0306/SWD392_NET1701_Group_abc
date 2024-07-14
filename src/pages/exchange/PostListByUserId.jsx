import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal, Col, Row, Image, Tabs, Empty } from 'antd';
import { useDeletePostMutation, useGetAllPostByUserQuery, useGetAllPostQuery } from '../../services/postAPI';
import { EllipsisOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import EditPostModal from './ModalEdit';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const { TabPane } = Tabs;
const { confirm } = Modal;

const PostListByUser = () => {
    const { data: postData, isLoading: isLoadingPost, refetch: refetchPostData } = useGetAllPostByUserQuery();
    const { refetch } = useGetAllPostQuery();
    const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        refetchPostData();
        refetch();
    }, [refetch, refetchPostData]);

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
                    refetch();
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

    // Phân loại bài đăng đã được duyệt và chưa được duyệt
    const approvedPosts = postData?.filter(post => post.publicStatus === true)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const unapprovedPosts = postData?.filter(post => post.publicStatus === false && !post.isExchanged && !post.isReported)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const reportPosts = postData?.filter(post => post.publicStatus === false && !post.isExchanged && post.isReported)?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

    const truncateName = (name, maxChars) => {
        if (name.length > maxChars) {
            return name.slice(0, maxChars) + '...';
        }
        return name;
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

    // if (!postData || postData.length === 0) {
    //     return (
    //         <div><Empty description="No posts available" /></div>
    //     )
    // }

    return (
        <div style={{ paddingLeft: '240px' }}>
            <Tabs defaultActiveKey="1">
                {/* Tab Bài đăng đã được duyệt */}
                <TabPane tab={<span style={{ fontSize: '14px' }} >Approved</span>} key="1">
                    <List

                        itemLayout="vertical"
                        size="large"
                        dataSource={approvedPosts}
                        renderItem={post => (
                            <List.Item key={post.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
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
                                    loading={isLoadingPost}
                                    hoverable
                                    extra={
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
                                                    {/* <Menu.Item key="report" onClick={() => handleReport(post.id)}>
                                                        Báo cáo
                                                    </Menu.Item> */}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/postDetail/${post.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{post.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: truncateName(post.description, 90) }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#00FF00"} text={"Approved"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {post?.imageUrl ? (
                                                        <Image src={post?.imageUrl} style={{ maxWidth: '100%', height: '100%' }} preview={false} />
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Link>
                                </Card>
                            </List.Item>
                        )}
                    />
                </TabPane>

                {/* Tab Bài đăng chưa được duyệt */}
                <TabPane tab={<span style={{ fontSize: '14px' }}>Not Approved</span>} key="2">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={unapprovedPosts}
                        renderItem={post => (
                            <List.Item key={post.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
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
                                    loading={isLoadingPost}
                                    hoverable
                                    extra={
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
                                                    {/* <Menu.Item key="report" onClick={() => handleReport(post.id)}>
                                                        Báo cáo
                                                    </Menu.Item> */}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/postDetail/${post.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{post.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: post.description }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#ffc125"} text={"Not approved"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {post?.imageUrl ? (
                                                        <Image src={post?.imageUrl} style={{ maxWidth: '100%', height: '100%' }} preview={false} />
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Link>
                                </Card>
                            </List.Item>
                        )}
                    />
                </TabPane>
                <TabPane tab={<span style={{ fontSize: '14px' }}>Reported</span>} key="3">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={reportPosts}
                        renderItem={post => (
                            <List.Item key={post.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
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
                                    loading={isLoadingPost}
                                    hoverable
                                    extra={
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
                                                    {/* <Menu.Item key="report" onClick={() => handleReport(post.id)}>
                                                        Báo cáo
                                                    </Menu.Item> */}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/postDetail/${post.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{post.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: post.description }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#ff0000"} text={"Reported"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {post?.imageUrl ? (
                                                        <Image src={post?.imageUrl} alt='Hình ảnh bài đăng' style={{ maxWidth: '100%', height: '100%' }} preview={false} />
                                                    ) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Link>
                                </Card>
                            </List.Item>
                        )}
                    />
                </TabPane>

            </Tabs>

            <EditPostModal
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                post={selectedPost}
                refetchPostData={refetchPostData}
            />
        </div>
    );
};

export default PostListByUser;
