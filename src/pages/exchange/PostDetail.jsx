import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetPostDetailQuery } from '../../services/postAPI';
import { Card, Skeleton, Badge, Avatar, Alert, Layout, Row, Col, Tag, Image, Button, Modal } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import ExchangeModal from './ExchangeModal';

const { Content } = Layout;

const PostDetail = () => {
    const { postId } = useParams();
    const { data: postDetail, isLoading, error, refetch } = useGetPostDetailQuery(postId);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isExchangeModalVisible, setIsExchangeModalVisible] = useState(false);


    useEffect(() => {
        refetchPostDetail();
    }, [postId]); 
    
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleThumbnailClick = (image) => {
        setSelectedImage(image);
        showModal();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleExchangeButtonClick = () => {
        setIsExchangeModalVisible(true);
    };

    const handleExchangeModalCancel = () => {
        setIsExchangeModalVisible(false);
    };

    const convertStatus = {
        true: <Badge color={"#33ff00"} text={"Đã được duyệt"} />,
        false: <Badge color={"#ffc125"} text={"Chưa được duyệt"} />
    };

    const refetchPostDetail = async () => {
        try {
            await refetch();
        } catch (error) {
            console.error('Error refetching post detail:', error);
        }
    };

    if (isLoading) {
        return (
            <Card style={{ width: '100%', marginTop: 16 }}>
                <Skeleton active />
            </Card>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description="There was an error loading the post details."
                type="error"
                showIcon
            />
        );
    }

    if (!postDetail) {
        return <div>No post details available</div>;
    }

    return (
        <>
            <CustomHeader />
            <Content style={{ minHeight: '100vh' }}>
                <Button
                    style={{ position: 'absolute', marginTop: '7rem', left: '2rem' }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <Row justify={'center'} style={{ padding: '20px', marginTop: '7rem' }}>
                    <Col md={10} span={24} className='product-image'>
                        <Image
                            src={postDetail?.imageUrl}
                            alt="Product Image"
                        />
                        <Row gutter={[8, 8]} className="thumbnail-row" style={{ marginTop: '1rem' }}>
                            {postDetail?.imageURL?.slice(0, 4).map((image, index) => (
                                <Col key={index} span={6}>
                                    <Image
                                        height={"130px"}
                                        width={"150px"}
                                        src={image}
                                        className="thumbnail"
                                        preview={false}
                                        onClick={() => handleThumbnailClick(image)}
                                    />
                                </Col>
                            ))}
                        </Row>
                        {postDetail?.imageURL?.length > 4 && (
                            <Button type="link" onClick={showModal} className='view-all-image-btn'>
                                View all images
                            </Button>
                        )}
                    </Col>
                    <Col md={6} span={24} style={{ marginLeft: '3rem' }}>
                        <div className='product-detail-description'>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {postDetail?.user?.imgUrl ? (
                                        <Avatar src={postDetail.user.imgUrl} size={'large'} />
                                    ) : (
                                        <Avatar icon={<UserOutlined />} />
                                    )}
                                    <p style={{ marginLeft: '1rem' }}>{postDetail?.user?.userName}</p>
                                </div>
                                <Button type='primary' onClick={handleExchangeButtonClick}>Exchange</Button>
                            </div>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', padding: '1rem' }}>{postDetail?.title}</p>
                            <div dangerouslySetInnerHTML={{ __html: postDetail?.description }} />
                        </div>
                    </Col>
                </Row>
            </Content>
            <CustomFooter />
            <Modal visible={isModalVisible} footer={null} onCancel={handleModalCancel}>
                <Image src={selectedImage} alt="Selected Image" style={{ width: '100%' }} />
            </Modal>
            <ExchangeModal
                isVisible={isExchangeModalVisible}
                onClose={() => {
                    handleExchangeModalCancel();
                    refetchPostDetail();
                }}
                postId={postId}
            />
        </>
    );
};

export default PostDetail;
