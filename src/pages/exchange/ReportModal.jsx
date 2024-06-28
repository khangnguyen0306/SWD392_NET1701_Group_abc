import React, { useState } from 'react';
import { Modal, Button, Card } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Meta } = Card;

const ReportModal = ({ visible, onClose, postData }) => {
    const [description, setDescription] = useState(postData?.description);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDescriptionChange = (value) => {
        setDescription(value);
    };

    const handleOk = () => {
        console.log(description);
        onClose();
    };

    const truncateText = (text, wordLimit) => {
        const words = text?.split(' ');
        if (words?.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return text;
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };
    const handleCollapse = () => {
        setIsExpanded(false);
    };

    const truncatedDescription = truncateText(postData.description, 50);

    return (
        <Modal
            title="Report"
            open={visible}
            onOk={handleOk}
            onCancel={onClose}
        >
            <Card
                cover={<img alt="example" src={postData.imageUrl} />}
                style={{ marginBottom: 16 }}
            >
                <Meta
                    title={postData.title}
                    description={
                        <>
                              <p dangerouslySetInnerHTML={{ __html: isExpanded ? postData.description : truncatedDescription }}></p>
                            {isExpanded && <Button type="link" onClick={handleCollapse}>Collapse</Button>}
                            {!isExpanded && <Button type="link" onClick={handleExpand}>More</Button>}
                        </>
                    }
                />
            </Card>
            <ReactQuill value={description} onChange={handleDescriptionChange} />
        </Modal>
    );
};

export default ReportModal;
