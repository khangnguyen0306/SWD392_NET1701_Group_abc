import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    useDeleteCommentMutation,
    useEditCommentMutation,
    useGetPostCommentQuery,
    useGetPostDetailQuery
} from '../../services/postAPI';
import {
    Card,
    Skeleton,
    Badge,
    Avatar,
    Image,
    Button,
    Modal,
    Menu,
    Dropdown,
    message,
    Layout,
    Row,
    Col
} from 'antd';
import {
    ArrowLeftOutlined,
    CaretDownOutlined,
    CaretUpOutlined,
    DeleteOutlined,
    DownOutlined,
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    SwapOutlined,
    UpOutlined,
    UserOutlined
} from '@ant-design/icons';
import ExchangeModal from './ExchangeModal';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../slices/auth.slice';
import { formatDistanceToNow } from 'date-fns';
import CommentForm from './Comment';
import ModalEditComment from './ModalEditComment';
import "./PostDetail.scss"
import EditPostModal from './ModalEdit';
import ProductDisplay from './DisplayProduct';
import ProductDetail from '../product/ProductDetail';
const { Content } = Layout;

const PostDetail = () => {
    const { postId } = useParams();
    const { data: postDetail, isLoading, error, refetch: refetchPostDetail } = useGetPostDetailQuery(postId);
    console.log(postDetail)
    const { data: commentData, isLoading: isLoadingCmt, refetch: refetchComments } = useGetPostCommentQuery(postId);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isExchangeModalVisible, setIsExchangeModalVisible] = useState(false);
    const user = useSelector(selectCurrentUser);
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
    }, [postId, refetchPostDetail, refetchComments]);

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
        setVisibleComments(prevVisibleComments => prevVisibleComments + 5);
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

    if (isLoading || isLoadingCmt || !ProductDetail) {
        return (
            <Card style={{ width: '100%', marginTop: 16 }}>
                <Skeleton active />
            </Card>
        )
    }

    return (
        <Content style={{ minHeight: '100vh' }}>
            <Button
                style={{ position: 'absolute', marginTop: '7rem', left: '2rem' }}
                onClick={() => navigate(-1)}
                type='primary'
                icon={<ArrowLeftOutlined />}
            >
                Back
            </Button>
            <Card>
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
                    <Col md={11} span={24} style={{ marginLeft: '3rem' }}>
                        <Card
                            className='custom-card'
                            title={
                                <div
                                    style={{
                                        alignItems: 'center',
                                        padding: '1rem 1rem',
                                        borderRadius: '4px 4px 0 0'
                                    }}
                                >
                                    <div >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} s>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {postDetail?.user?.imgUrl ? (
                                                    <Avatar src={postDetail.user.imgUrl} size={'large'} />
                                                ) : (
                                                    <Avatar icon={<UserOutlined />} />
                                                )}
                                                <hr />
                                                <p style={{marginLeft:'1rem'}}>{postDetail?.user?.userName}</p>
                                            </div>
                                            <div>
                                                {postDetail?.user.id !== user.id && user.roleId == 2 ? (
                                                    <Button
                                                        type='primary'
                                                        onClick={handleExchangeButtonClick}
                                                        icon={<SwapOutlined />}
                                                    >
                                                        Exchange
                                                    </Button>
                                                ) : null}
                                            </div>
                                            <div >
                                                <p >
                                                    {postDetail?.isReported ? (
                                                        <Badge color={"#ff0000"} text={"Reported"} />
                                                    ) : postDetail?.publicStatus ? (
                                                        <Badge color={"#33ff00"} text={"Approved"} />
                                                    ) : (
                                                        <Badge color={"#ff0000"} text={"Not approved"} />
                                                    )}
                                                </p>
                                            </div>
                                           
                                        </div>

                                    </div>
                                </div>
                            }
                        >
                            <div className='product-detail-description'>

                                <p style={{ fontSize: '2rem', fontWeight: 'bold', padding: '1rem' }}>{postDetail?.title}</p>
                                <div style={{ padding: '1rem' }}>
                                    {isDescriptionExpanded ? (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: postDetail?.description }} />
                                            <Button type="link" onClick={handleToggleDescription} style={{ marginTop: '1rem' }}>Collapse</Button>
                                        </>
                                    ) : (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: truncateName(postDetail?.description, 200) }} />
                                            {postDetail?.description.length > 200 && (
                                                <Button type="link" onClick={handleToggleDescription} style={{ marginTop: '1rem' }}>More</Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Card>
            {/* Product Card */}
            <Row justify="center" style={{ padding: '20px' }}>
                <Col xs={24} md={10} lg={10} xl={10} style={{ marginRight: '1rem' }}>
                    <Card
                        className='custom-card'
                        title="Product"
                        style={{ marginBottom: '20px' }}
                        bodyStyle={{ display: 'flex', alignItems: 'center' }}
                    >
                        <ProductDisplay
                            productId={postDetail?.product.id}
                        />
                    </Card>
                </Col>
                {/* comment */}
                <Col xs={24} md={10} lg={10} xl={10}>
                    <Card
                        className='custom-card-fixed'
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
                                    bodyStyle={{ display: 'flex', alignItems: 'center', alignItems: 'center' }}
                                >
                                    <Avatar
                                        src={comment.user?.imgUrl}
                                        alt={comment.user?.userName}
                                        size={40}


                                    />
                                    <div style={{ flex: 1, overflowWrap: 'break-word', marginLeft: '1rem', backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                        <div dangerouslySetInnerHTML={{ __html: isExpanded ? comment.content : truncateName(comment.content, 50) }} style={{ width: '350px' }} />
                                        {comment.content.length > 50 && (
                                            <Button type="text" style={{marginTop:'-0.7rem',marginLeft:'-0.5rem'}} onClick={() => toggleContent(comment.id)} icon={isExpanded ? <CaretUpOutlined /> : <CaretDownOutlined />}>
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
                                            <Button type="text" size='middle' onClick={e => e.preventDefault()} icon={<EllipsisOutlined />} />
                                        </Dropdown>
                                    ) : null}
                                </Card>
                            );
                        })}
                        {commentData?.length > visibleComments && (
                            <Button type="link" onClick={loadMoreComments} className='view-all-comments-btn'>
                                View more comments
                            </Button>
                        )}
                        <div className="comment-form-container">
                            <CommentForm refetch={refetchComments} postId={postId} />
                        </div>
                    </Card>

                </Col>
            </Row>
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

        </Content>
    );
};

export default PostDetail;
