import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDeleteCommentMutation, useEditCommentMutation, useGetPostCommentQuery, useGetPostDetailQuery } from '../../services/postAPI';
import { Card, Skeleton, Badge, Avatar, Alert, Layout, Row, Col, Image, Button, Modal, Menu, Dropdown, message } from 'antd';
import { ArrowLeftOutlined, CaretDownOutlined, CaretUpOutlined, DeleteOutlined, DownOutlined, EditOutlined, EllipsisOutlined, UpOutlined, UserOutlined } from '@ant-design/icons';
import ExchangeModal from './ExchangeModal';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { formatDistanceToNow } from 'date-fns';
import CommentForm from './Comment';
import ModalEditComment from './ModalEditComment';
import ReactQuill from 'react-quill';

const { Content } = Layout;

const PostDetail = () => {
    const { postId } = useParams();
    const { data: postDetail, isLoading, error, refetch: refetchPostDetail } = useGetPostDetailQuery(postId);
    const { data: commentData, isLoading: isLoadingCmt, refetch: refetchComments } = useGetPostCommentQuery(postId);
    console.log(commentData)
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isExchangeModalVisible, setIsExchangeModalVisible] = useState(false);
    const user = useSelector(selectCurrentUser);
    console.log(user)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [visibleComments, setVisibleComments] = useState(5);
    const [visibleEditComments, setVisibleEditComments] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [currentCommentId, setCurrentCategoryId] = useState(null);
    const [deleteComment] = useDeleteCommentMutation();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useEffect(() => {
        refetchPostDetail();
        refetchComments();
    }, [postId]);

    const openModalEditComment = (id) => {
        setCurrentCategoryId(id);
        setVisibleEditComments(true);

    }
    const closeModalEditComment = () => {
        setVisibleEditComments(false);
    }


    const toggleContent = (commentId) => {
        setExpandedComments(prevState => ({
            ...prevState,
            [commentId]: !prevState[commentId]
        }));
    };

    const loadMoreComments = () => {
        setVisibleComments(prevVisibleComments => prevVisibleComments + commentData.length) - 5;
    };

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
        refetchPostDetail();
    };

    const handleToggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };
    const handleDeleteComment = (id) => {
        console.log(id)
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this comment?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    setConfirmLoading(true);
                    await deleteComment(id);
                    refetchComments();
                    message.success('Comment deleted successfully!');
                } catch (error) {
                    message.error('Error deleting comment');
                } finally {
                    setConfirmLoading(false);
                }
            },
        });
    };


    const truncateName = (name, maxChars) => {
        if (name?.length > maxChars) {
            return name.slice(0, maxChars) + '...';
        }
        return name;
    };


    if (isLoading && isLoadingCmt) {
        return (
            <Card style={{ width: '100%', marginTop: 16 }}>
                <Skeleton active />
            </Card>
        );
    }


    if (!postDetail) {
        return <div>No post details available</div>;
    }

    return (
        <>
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
                                    <div style={{ display: 'flex' }}>
                                        <p style={{ marginLeft: '1rem' }}>{postDetail?.user?.userName}</p>
                                        <p style={{ marginLeft: '2rem' }}>{postDetail?.publicStatus ? (
                                            <Badge color={"#33ff00"} text={"Approved"} />
                                        ) : (
                                            <Badge color={"#ffc125"} text={"Not approved"} />
                                        )}</p>
                                    </div>
                                </div>
                                {postDetail.user.id !== user.id ? (
                                    <Button type='primary' onClick={handleExchangeButtonClick} style={{ marginRight: '-7rem' }}>Exchange</Button>
                                ) : null}
                            </div>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', padding: '1rem' }}>{postDetail?.title}</p>
                            <div style={{ padding: '1rem' }}>
                                {isDescriptionExpanded ? (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: postDetail.description }} />
                                        <Button type="primary" icon={<UpOutlined />} onClick={handleToggleDescription} style={{ marginTop: '1rem' }}>Collapse</Button>
                                    </>
                                ) : (
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: truncateName(postDetail.description, 200) }} />
                                        {postDetail.description.length > 200 && (
                                            <Button type="primary" icon={<DownOutlined />} onClick={handleToggleDescription} style={{ marginTop: '1rem' }}>More</Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
                {/* Product Card */}
                <Row justify="center" style={{ padding: '20px' }}>
                    <Col xs={24} md={10} lg={10} xl={10} style={{ marginRight: '1rem' }}>
                        <Card
                            title="Product"
                            style={{ marginBottom: '20px' }}
                            bodyStyle={{ display: 'flex', alignItems: 'center' }} // Center align content inside the card body
                        >
                            <Image
                                src={postDetail.product.urlImg}
                                alt={postDetail.product.name}
                                width={150}
                                height={150}
                                preview={false}
                                style={{ marginRight: '20px' }}
                            />
                            <div style={{ marginLeft: '3rem' }}>
                                <h2>{postDetail.product.name}</h2>
                                <Link to={`/productDetailForAll/${postDetail.product.id}`}>
                                    <Button type="primary" style={{ marginTop: '1rem' }}>View Product Details</Button>
                                </Link>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} md={10} lg={10} xl={10}>
                        <Card
                            title="Comment"
                            style={{ marginBottom: '20px', maxHeight: '400px', overflowY: 'auto' }}
                        >
                            {commentData?.slice(0, visibleComments).map(comment => {
                                const commentDate = comment.date ? new Date(comment.date) : null;
                                const isExpanded = expandedComments[comment.id];
                                return (
                                    <Card
                                        key={comment.id}
                                        hoverable
                                        style={{ marginBottom: '20px', width: '100%', height: 'fit-content' }}
                                        bodyStyle={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <Image
                                            src={comment.user?.imgUrl}
                                            alt={comment.user?.userName}
                                            width={30}
                                            height={30}
                                            preview={false}
                                            style={{ marginRight: '20px' }}
                                        />
                                        <div style={{ flex: 1, overflowWrap: 'break-word', marginLeft: '1rem' }}>
                                            <div dangerouslySetInnerHTML={{ __html: isExpanded ? comment.content : truncateName(comment.content, 50) }} style={{ width: '400px' }} />
                                            {comment.content.length > 50 && (
                                                <Button type="link" onClick={() => toggleContent(comment.id)} icon={isExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />}>
                                                    {isExpanded ? 'Collapse' : 'Read more'}
                                                </Button>
                                            )}
                                            {commentDate && (
                                                <p style={{ color: 'gray', fontSize: '0.9rem' }}>
                                                    {formatDistanceToNow(commentDate, { addSuffix: true })}
                                                </p>
                                            )}
                                        </div>
                                        {user?.id === comment.user.id ? (
                                            <Dropdown
                                                overlay={
                                                    <Menu>
                                                        <Menu.Item key="edit" icon={<EditOutlined />} onClick={(() => openModalEditComment(comment.id))} >
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={(() => handleDeleteComment(comment.id))} >
                                                            Delete
                                                        </Menu.Item>
                                                    </Menu>
                                                }
                                                trigger={['click']}
                                            >
                                                <Button type="link" size='middle' onClick={e => e.preventDefault()} icon={<EllipsisOutlined />} />
                                            </Dropdown>
                                        ):null}
                                    </Card>
                                );
                            })}
                            {commentData?.length > visibleComments && (
                                <Button type="link" onClick={loadMoreComments} className='view-all-comments-btn'>
                                    View more comments
                                </Button>
                            )}
                        </Card>
                        <CommentForm refetch={refetchComments} postId={postId} />
                    </Col>
                </Row>
            </Content>
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
            <ModalEditComment
                commentId={currentCommentId}
                visible={visibleEditComments}
                onCancel={closeModalEditComment}
                refetch={refetchComments}
            />
        </>
    );
};

export default PostDetail;
