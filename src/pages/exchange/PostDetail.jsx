import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetPostDetailQuery } from '../../services/postAPI';
import { Card, Skeleton, Badge, Avatar, Alert, Layout, Row, Col, Tag, Image, Button, Modal } from 'antd';
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import CustomHeader from '../../components/Header/CustomHeader';
import CustomFooter from '../../components/Footer/CustomFooter';
import ExchangeModal from './ExchangeModal';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';

const { Content } = Layout;

const PostDetail = () => {
    const { postId } = useParams();
    const { data: postDetail, isLoading, error, refetch } = useGetPostDetailQuery(postId);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isExchangeModalVisible, setIsExchangeModalVisible] = useState(false);
    const user = useSelector(selectCurrentUser);

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
                    type='primary'
                    icon={<ArrowLeftOutlined />}
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
                                        style={{
                                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                                            marginRight: '10px',
                                            cursor: 'pointer'
                                        }}
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
                                    <hr />
                                    <div style={{display:'flex'}}>
                                        <p style={{ marginLeft: '1rem' }}>{postDetail?.user?.userName}</p>
                                        <p style={{ marginLeft: '11rem' }}>{convertStatus[postDetail?.publicStatus]}</p>
                                    </div>
                                </div>
                                {postDetail.user.id != user.id ? (
                                    <Button type='primary' onClick={handleExchangeButtonClick}>Exchange</Button>
                                ) : (
                                    null
                                )}
                            </div>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', padding: '1rem' }}>{postDetail?.title}</p>
                            <div dangerouslySetInnerHTML={{ __html: postDetail?.description }} />
                        </div>
                    </Col>
                </Row>
                {/* Product Card */}
                <Row justify="center" style={{ padding: '20px' }}>
                    <Col xs={24} md={20} lg={18} xl={16}>
                        <Card
                            title="Product"
                            style={{ width: '100%', marginBottom: '20px' }}
                            bodyStyle={{ display: 'flex', alignItems: 'center' }} // Center align content inside the card body
                        >
                            <Image
                                src={postDetail.product.urlImg}
                                alt={postDetail.product.name}
                                width={300}
                                preview={false} // Disable preview on click
                                style={{ marginRight: '20px' }} // Add margin to the right of the image
                            />
                            <div style={{ marginLeft: '3rem' }}>
                                <h2>{postDetail.product.name}</h2>
                                <Link to={`/productDetailForAll/${postDetail.product.id}`}>
                                    <Button type="primary">View Product Details</Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <CustomFooter />
            <Modal open={isModalVisible} footer={null} onCancel={handleModalCancel}>
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
