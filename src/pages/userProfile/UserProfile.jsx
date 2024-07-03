import React, { useEffect, useState } from 'react';
import { Layout, Button, Form, Input, Radio, DatePicker, message, Avatar, Row, Col, Card, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useEditProfileMutation, useGetUserProfileQuery } from '../../services/userAPI';
import { selectCurrentUser, setUser } from '../../slices/auth.slice';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
import "./UserProfile.scss";
import { validationPatterns } from '../../utils/utils';

const UserProfile = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const userId = user?.id;
    const { data: userData, refetch } = useGetUserProfileQuery(userId, { skip: !userId });
    const [editUser] = useEditProfileMutation();
    const [form] = Form.useForm();
    const [updateUser, setUpdateUser] = useState(false);
    const [newAvatar, setNewAvatar] = useState([]);
    const [folder] = useState(uuidv4());
    const fallbackImageUrl = "https://via.placeholder.com/170";

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData));
        }
    }, [userData, dispatch]);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                id: user.id,
                fullname: user.userName,
                email: user.email,
                DOB: user.dob ? dayjs(user.dob) : null,
                gender: user.gender,
                phoneNumber: user.phoneNumber,
                address: user.address,
                imgURL: user.imgUrl,
            });
        }
    }, [user, form]);

    const handleUpdate = () => {
        setUpdateUser(!updateUser);
    };

    const setAvatar = (imageUrl) => {
        setNewAvatar(imageUrl);
    };

    const updateUserProfile = async (values) => {
        console.log("Updating user profile with values:", values);
        try {
            const result = await editUser({
                body: {
                    dob: values.DOB ? values.DOB.toDate() : null,
                    address: values.address,
                    phoneNumber: values.phoneNumber,
                    gender: values.gender,
                    imgUrl: newAvatar[0] || values.imgURL,
                    userName: values.fullname,
                },
                id: user.id,
            });
            console.log("Update result:", result);
            if (result.data && result.data.message === "User updated successfully.") {
                message.success(result.data.message);
                await refetch();
                setUpdateUser(false);
            } else {
                message.error(result.error?.data?.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error("Update error:", error);
            message.error('Failed to update profile');
        }
    };

    useEffect(() => {
        if (!updateUser && user) {
            refetch();
        }
    }, [updateUser, refetch, user]);

    const imageUrl = newAvatar[0] || user?.imgUrl;

    console.log("newAvatar:", newAvatar);
    console.log("user.imgURL:", user?.imgUrl);

    return (
        <Layout className='main-layout-userProfile-page'>
            <Row gutter={[16, 16]}>
                <Col span={17}>
                    <Card title={
                        <div className='profile-information-title'>
                            <p>My account</p>
                            <Button onClick={() => setUpdateUser(true)}>Update profile</Button>
                        </div>
                    } style={{ height: '100%' }}>
                        {!updateUser ? (
                            <div className='profile-information-content'>
                                <h5 className='profile-information-content-subtitle'>USER INFORMATION</h5>
                                <div className='profile-information-content-type'>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='fullname'>Full name</label>
                                            <Input readOnly size='large' name='fullname' value={user?.userName || ''} />
                                        </div>
                                        <div className='profile-information-content-input'>
                                            <label id='Address'>Address</label>
                                            <Input readOnly size='large' name='Address' value={user?.address || ''} />
                                        </div>
                                        <div className='profile-information-content-input'>
                                            <label id='gender'>Gender</label>
                                            <Input readOnly size='large' name='gender' value={user?.gender || ''} />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='DOB'>Day of birth</label>
                                            <Input value={user?.dob ? dayjs(user.dob).format("DD/MM/YYYY") : ''} readOnly size='large' />
                                        </div>
                                    </Col>
                                </div>
                                <h5 className='profile-information-content-subtitle' style={{ marginTop: '1rem' }}>CONTACT INFORMATION</h5>
                                <div style={{ display: 'flex' }} className='profile-information-content-type'>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='phoneNumber'>Phone number</label>
                                            <Input readOnly size='large' value={user?.phoneNumber || ''} />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='email'>Email address</label>
                                            <Input readOnly size='large' value={user?.email || ''} />
                                        </div>
                                    </Col>
                                </div>
                            </div>
                        ) : (
                            <Form
                                form={form}
                                name="updateProfile"
                                onFinish={updateUserProfile}
                            >
                                <div className='profile-information-content'>
                                    <h5 className='profile-information-content-subtitle'>USER INFORMATION</h5>
                                    <div className='profile-information-content-type'>
                                        <Col span={12}>
                                            <div className='profile-information-content-input'>
                                                <label id='fullname'>Full name</label>
                                                <Form.Item name="fullname" rules={[
                                                    { required: true, message: 'Please input your full name!' },
                                                    {
                                                        pattern: validationPatterns.name.pattern,
                                                        message: validationPatterns.name.message
                                                    }
                                                ]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input'>
                                                <label id='phoneNumber'>Phone number</label>
                                                <Form.Item name="phoneNumber"
                                                    rules={[
                                                        { required: true, message: 'Please input your phone number!' },
                                                        {
                                                            pattern: validationPatterns.phoneNumber.pattern,
                                                            message: validationPatterns.phoneNumber.message
                                                        }
                                                    ]}>
                                                    <Input type='number' />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <Form.Item name="imgURL" label="Image">
                                                    <UploadWidget
                                                        uwConfig={{
                                                            multiple: true,
                                                            cloudName: "dnnvrqoiu",
                                                            uploadPreset: "estate",
                                                        }}
                                                        folder={`avatar/${folder}`}
                                                        setState={setAvatar}
                                                    />
                                                    <div style={{ marginTop: '10px' }}>
                                                        <Image
                                                            src={newAvatar[(newAvatar.length - 1)]}
                                                            width={200}
                                                            style={{ marginRight: '10px' }}
                                                            fallback={<Avatar size={200} icon={<UserOutlined />} />}
                                                            alt="Uploaded Image"
                                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
                                                        />
                                                    </div>
                                                </Form.Item>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className='profile-information-content-input'>
                                                <label id='email'>Email address</label>
                                                <Form.Item name="email">
                                                    <Input readOnly />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <label id='DOB'>Day of birth</label>
                                                <Form.Item
                                                    name="DOB"
                                                    rules={[
                                                        { required: true, message: "Please select your date of birth!" },
                                                        () => ({
                                                            validator(_, value) {
                                                                const selectedYear = value && value.year();
                                                                const currentYear = new Date().getFullYear();
                                                                if (selectedYear && currentYear && currentYear - selectedYear >= 18 && currentYear - selectedYear <= 100) {
                                                                    return Promise.resolve();
                                                                } else {
                                                                    form.resetFields(['DOB']);
                                                                    if ((currentYear - selectedYear < 18)) {
                                                                        message.error("Must be greater than 18 years old!");
                                                                    }
                                                                    return Promise.reject(new Error("Invalid date of birth!"));
                                                                }
                                                            },
                                                        }),
                                                    ]}>
                                                    <DatePicker />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <label id='gender'>Gender</label>
                                                <Form.Item name="gender" initialValue={user?.gender} rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Radio.Group>
                                                        <Radio value="Male">Male</Radio>
                                                        <Radio value="Female">Female</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <label id='address'>Address</label>
                                                <Form.Item name="address" rules={[{ required: true, message: 'Please input your address!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                                <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                                                    Save
                                                </Button>
                                                <Button type="default" onClick={() => setUpdateUser(false)}>
                                                    Cancel
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Card>
                </Col>
                <Col span={7}>
                    <Card style={{ height: '100%' }}>
                        <Col flex={1} style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }} className='profile-card-user'>
                                {user ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <Image
                                            src={imageUrl}
                                            height={170}
                                            width={170}
                                            style={{ borderRadius: '50%' }}
                                            fallback={<Avatar size={170} icon={<UserOutlined />} />}
                                            alt="Profile"
                                            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImageUrl; }}
                                        />
                                        <h3 style={{ marginTop: '1rem' }}>{user.userName}</h3>
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center' }}>
                                        <Avatar size={64} icon={<UserOutlined />} />
                                        <h3>Fake Data</h3>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
}

export default UserProfile;
