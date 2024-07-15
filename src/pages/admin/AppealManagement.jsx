import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Dropdown, List, Menu, Skeleton, message, Modal, Col, Row, Image, Tabs, Empty } from 'antd';
// import { useDeleteAppealMutation, useGetAllAppealsByUserQuery, useGetAllAppealsQuery } from '../../services/appealAPI';
import { EllipsisOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const { TabPane } = Tabs;
const { confirm } = Modal;

const AppealManager = () => {
    const { data: appealData, isLoading: isLoadingAppeal, refetch: refetchAppealData } = useGetAllAppealsByUserQuery();
    const { refetch } = useGetAllAppealsQuery();
    const [deleteAppeal, { isLoading: isDeleting }] = useDeleteAppealMutation();
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedAppeal, setSelectedAppeal] = useState(null);
    const user = useSelector(selectCurrentUser);

    useEffect(() => {
        refetchAppealData();
        refetch();
    }, [refetch, refetchAppealData]);

    const showDeleteConfirm = (appealId) => {
        confirm({
            title: 'Are you sure you want to delete this appeal?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteAppeal(appealId).unwrap();
                    message.success('Appeal deleted successfully');
                    refetchAppealData();
                    refetch();
                } catch (error) {
                    console.log(error);
                    message.error('Failed to delete the appeal');
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleEdit = (appeal) => {
        setSelectedAppeal(appeal);
        setIsEditModalVisible(true);
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
    };

    const handleEditOk = () => {
        setIsEditModalVisible(false);
    };

    // Phân loại appeal đã được duyệt và chưa được duyệt
    const approvedAppeals = appealData?.filter(appeal => appeal.status === 'approved')?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const pendingAppeals = appealData?.filter(appeal => appeal.status === 'pending')?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const rejectedAppeals = appealData?.filter(appeal => appeal.status === 'rejected')?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

    if (isLoadingAppeal) {
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

    return (
        <div style={{ paddingLeft: '240px' }}>
            <Tabs defaultActiveKey="1">
                {/* Tab Approved Appeals */}
                <TabPane tab={<span style={{ fontSize: '14px' }} >Approved</span>} key="1">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={approvedAppeals}
                        renderItem={appeal => (
                            <List.Item key={appeal.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {appeal.user.imgUrl ? (
                                                <Avatar src={appeal.user.imgUrl} size={'large'} />
                                            ) : (
                                                <Avatar icon={<UserOutlined />} />
                                            )}
                                            <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{appeal.user.userName}</p>
                                        </div>
                                    }
                                    loading={isLoadingAppeal}
                                    hoverable
                                    extra={
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    {appeal?.user?.id === user?.id && (
                                                        <>
                                                            <Menu.Item key="edit" onClick={() => handleEdit(appeal.id)}>
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item key="delete" onClick={() => showDeleteConfirm(appeal.id)}>
                                                                Delete
                                                            </Menu.Item>
                                                        </>
                                                    )}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/appealDetail/${appeal.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{appeal.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: appeal.description }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#00FF00"} text={"Approved"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {appeal?.imageUrl ? (
                                                        <Image src={appeal?.imageUrl} style={{ maxWidth: '100%', height: '100%' }} preview={false} />
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

                {/* Tab Pending Appeals */}
                <TabPane tab={<span style={{ fontSize: '14px' }}>Pending</span>} key="2">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={pendingAppeals}
                        renderItem={appeal => (
                            <List.Item key={appeal.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {appeal.user.imgUrl ? (
                                                <Avatar src={appeal.user.imgUrl} size={'large'} />
                                            ) : (
                                                <Avatar icon={<UserOutlined />} />
                                            )}
                                            <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{appeal.user.userName}</p>
                                        </div>
                                    }
                                    loading={isLoadingAppeal}
                                    hoverable
                                    extra={
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    {appeal?.user?.id === user?.id && (
                                                        <>
                                                            <Menu.Item key="edit" onClick={() => handleEdit(appeal.id)}>
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item key="delete" onClick={() => showDeleteConfirm(appeal.id)}>
                                                                Delete
                                                            </Menu.Item>
                                                        </>
                                                    )}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/appealDetail/${appeal.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{appeal.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: appeal.description }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#ffc125"} text={"Pending"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {appeal?.imageUrl ? (
                                                        <Image src={appeal?.imageUrl} style={{ maxWidth: '100%', height: '100%' }} preview={false} />
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

                {/* Tab Rejected Appeals */}
                <TabPane tab={<span style={{ fontSize: '14px' }}>Rejected</span>} key="3">
                    <List
                        itemLayout="vertical"
                        size="large"
                        dataSource={rejectedAppeals}
                        renderItem={appeal => (
                            <List.Item key={appeal.id}>
                                <Card
                                    style={{ marginLeft: '-200px', position: 'relative' }}
                                    title={
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {appeal.user.imgUrl ? (
                                                <Avatar src={appeal.user.imgUrl} size={'large'} />
                                            ) : (
                                                <Avatar icon={<UserOutlined />} />
                                            )}
                                            <p style={{ marginLeft: '1rem', fontSize: '14px' }}>{appeal.user.userName}</p>
                                        </div>
                                    }
                                    loading={isLoadingAppeal}
                                    hoverable
                                    extra={
                                        <Dropdown
                                            overlay={
                                                <Menu>
                                                    {appeal?.user?.id === user?.id && (
                                                        <>
                                                            <Menu.Item key="edit" onClick={() => handleEdit(appeal.id)}>
                                                                Edit
                                                            </Menu.Item>
                                                            <Menu.Item key="delete" onClick={() => showDeleteConfirm(appeal.id)}>
                                                                Delete
                                                            </Menu.Item>
                                                        </>
                                                    )}
                                                </Menu>
                                            }
                                            trigger={['click']}
                                        >
                                            <Button type="text" icon={<SettingOutlined />} size="small" />
                                        </Dropdown>
                                    }
                                >
                                    <Link to={`/appealDetail/${appeal.id}`}>
                                        <Row gutter={[16, 16]}>
                                            <Col xs={24} md={15}>
                                                <div style={{ marginLeft: '2rem', color: 'black', marginBottom: '2rem' }}>
                                                    <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{appeal.title}</p>
                                                    <div dangerouslySetInnerHTML={{ __html: appeal.description }} />
                                                    <p style={{ marginTop: '1rem', position: 'absolute', bottom: '-20px', left: '10px' }} >
                                                        <Badge color={"#ff0000"} text={"Rejected"} />
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <div style={{ textAlign: 'center' }}>
                                                    {appeal?.imageUrl ? (
                                                        <Image src={appeal?.imageUrl} alt='Hình ảnh bài đăng' style={{ maxWidth: '100%', height: '100%' }} preview={false} />
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

            <EditAppealModal
                visible={isEditModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                appeal={selectedAppeal}
                refetchAppealData={refetchAppealData}
            />
        </div>
    );
};

export default AppealManager;
