import React, { useEffect } from 'react';
import { Card, Rate, Spin, Alert, Avatar, Row, Col, Empty } from 'antd';
import { MailOutlined, PhoneOutlined, HomeOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import './UserProfileForOther.scss';
import { useParams } from 'react-router-dom';
import { useGetUserProfileForOtherQuery } from '../../services/userAPI';


const UserProfileForOther = () => {
    const { userId } = useParams();
    const { data: user, isLoading, isError, refetch } = useGetUserProfileForOtherQuery(userId);
    console.log(user)
    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return <Spin tip="Loading..." />;
    }

    if (isError) {
        return <Alert message="Error" description="Failed to load user data." type="error" />;
    }

    if (!user) {
        return <Empty />;
    }

    return (
        <div className="user-profile" style={{ marginTop: '7rem' }}>
            <div className="profile-header">
                <Avatar size={100} src={user.imgUrl} className="profile-avatar" />
                <div className="profile-info">
                    <h2>{user.userName}</h2>
                    <p><MailOutlined /> {user.email}</p>
                    <p><PhoneOutlined /> {user.phoneNumber}</p>
                    <p><HomeOutlined /> {user.address}</p>
                    <p>{user.gender === 'Male' ? <ManOutlined /> : <WomanOutlined />} {user.gender}</p>
                    <Rate disabled defaultValue={5} />
                    <p>Rating Count: {(user.ratingCount == 0 || user.ratingCount == null) ? "There are no reviews yet" : user.ratingCount}</p>
                </div>
            </div>
            <div className="profile-content">
                <Card title="Additional Information" className="additional-info-card">
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <p>Date of Birth: {new Date(user.dob).toLocaleDateString()}</p>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    );
};

export default UserProfileForOther;
