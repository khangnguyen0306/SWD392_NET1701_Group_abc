import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Button, Form, Input, Radio, DatePicker, message, Avatar, Row, Col, Card } from 'antd';
import { ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import { useGetUserByIdQuery, useEditUserMutation } from '../../../services/userAPI';
import "./UserProfile.scss"
import { validationPatterns } from '../../utils/utils';
import { useGetUserProfileQuery } from '../../services/userAPI';
import { selectCurrentUser } from '../../slices/auth.slice';
import { useSelector } from 'react-redux';
// import UploadWidget from '../../../components/uploadWidget/uploadWidget';


const UserProfile = () => {
    // const { userId } = useParams();
    // const [editUser] = useEditUserMutation();
    // const { data: user, error, isLoading } = useGetUserProfileQuery(userId);  /// API login
    const user = useSelector(selectCurrentUser);
    console.log(user)
    const [form] = Form.useForm();
    const [updateUser, setUpdateUser] = useState(false);
    const [newAvatar, setNewAvatar] = useState([]);



    // {
    //     "userName": "admin",
    //     "email": "admin@gmail.com",
    //     "dob": "2002-05-31T00:00:00",
    //     "address": "186 le van viet",
    //     "phoneNumber": "0889339769",
    //     "roleId": 1
    // }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                // id: user.id,
                fullname: user?.userName,
                email: user?.email,
                DOB: user?.dob ? dayjs(user.dob) : null,
                gender: true,                                     // missing gender, mising avatar chua chinh uploadWidgets
                phoneNumber: user?.phoneNumber,
                address: user?.address
            });
        }

    }, [user, form]);

    const handleUpdate = () => {
        setUpdateUser(!updateUser);
    }

    // const setAvatar = (imageUrl) => {
    //     setNewAvatar(imageUrl);
    // };

        // const updateUserProfile = async (values) => {
        //     console.log(values)
        //     const result = await editUser({
        //         body: { ...values, avatar: newAvatar[0] || user.avatar },
        //         id: userId
        //     });
        //     if (result.data.status === 200) {
        //         message.success(result.data.message);
        //         setUpdateUser(false);
        //     }
        // };
    // const validateEmail = (rule, value, callback) => {
    //     if (!value) {
    //         callback('Please input your email!');
    //     } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
    //         callback('Please enter a valid email address!');
    //     } else {
    //         callback();
    //     }
    // };   
    // if (isLoading) {
    //     return <h1>Loading...</h1>;
    // }

    // if (error) {
    //     return <div>Error: {error.message}</div>;
    // }

    return (
        <Layout className='main-layout-userProfile-page'>
            {!updateUser ? (
                <Row gutter={[16, 16]}>
                    <Col span={17}>
                        <Card title={
                            <div className='profile-information-title'>
                                <p>My account</p>
                                <Button onClick={() => setUpdateUser(true)}>Update profile</Button>
                            </div>
                        }
                            style={{ height: '100%' }}>
                            <div className='profile-information-content'>
                                <h5 className='profile-information-content-subtitle'>USER INFOMATION</h5>
                                <div className='profile-information-content-type'>
                                    <Col span={12}>
                                        <div className='profile-information-content-input' >
                                            <label id='fullname'>Full name</label>
                                            <Input readOnly size='large' name='fullname' value={user?.userName} />
                                        </div>
                                        <div className='profile-information-content-input'>
                                            <label id='fullname'>Phone number</label>
                                            <Input readOnly size='large' value={user?.phoneNumber} />
                                        </div>
                                    </Col>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='fullname'>Email adress</label>
                                            <Input readOnly size='large' value={user?.email} />
                                        </div>
                                        <div className='profile-information-content-input'>
                                            <label id='fullname'>Day of birth</label>
                                            <Input value={dayjs(user?.dob).format("DD/MM/YYYY")} readOnly size='large' />
                                        </div>
                                    </Col>

                                </div>
                                <h5 className='profile-information-content-subtitle'>CONTACT INFOMATION</h5>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Col span={24} style={{ marginTop: '20px' }}>
                                        <div style={{ width: '100%' }} >
                                            <label id='fullname'>Address</label>
                                            <Input readOnly size='large' name='fullname' value={user?.address} />

                                        </div>
                                    </Col>

                                    {/* <Col span={24} >
                                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                                            <div className='profile-information-content-input' style={{ marginRight: '50px' }} >
                                                <label id='fullname'>Full name</label>
                                                <Input readOnly size='large' name='fullname' />
                                            </div>
                                            <div className='profile-information-content-input' >
                                                <label id='fullname'>Full name</label>
                                                <Input readOnly size='large' name='fullname' />
                                            </div>
                                        </div>
                                        <Link to={"/createPosts"}>
                                            <Button>Create a new post</Button>
                                        </Link> 
                                    </Col> */}
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={7}>
                        <Card style={{ height: '100%' }}>
                            <Col flex={1} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center' }} className='profile-card-user'>
                                    {user ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <img
                                                // src={newAvatar[0] || user?.avatar} height={"170px"} width={"170px"}
                                                src={"data:image/jpeg;base64,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" || user?.avatar} height={"170px"} width={"170px"}
                                                style={{ borderRadius: '50%', display: 'block' }}
                                            />
                                            <h3>{user?.userName}</h3>
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
            ) : (
                <Form
                    variant="outlined"
                    form={form}
                    name="updateProfile"
                // onFinish={updateUserProfile}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={17}>
                            <Card title={
                                <div className='profile-information-title'>
                                    <p>My account</p>
                                    <Button>Update profile</Button>
                                </div>
                            }
                                style={{ height: '100%' }}>
                                <div className='profile-information-content'>
                                    <h5 className='profile-information-content-subtitle'>USER INFOMATION</h5>
                                    <div className='profile-information-content-type'>
                                        <Col span={12}>
                                            <div className='profile-information-content-input' >
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
                                                    <Input type={Number} />
                                                </Form.Item>
                                            </div>

                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <label id='fullname'>Image</label>
                                                {/* <Form.Item >
                                                    <UploadWidget
                                                        uwConfig={{
                                                            cloudName: "dnnvrqoiu",
                                                            uploadPreset: "estate",
                                                            mutiple: false,
                                                            maxImageSize: 2000000,
                                                            folder: "avatars"
                                                        }}
                                                        setState={setAvatar}
                                                    />
                                                </Form.Item> */}

                                            </div>

                                        </Col>
                                        <Col span={12}>
                                            <div className='profile-information-content-input'>
                                                <label id='fullname'>Email adress</label>
                                                <Form.Item name="email"
                                                    rules={[
                                                        { required: true, message: 'Please input your email!' },
                                                        {
                                                            pattern: validationPatterns.email.pattern,
                                                            message: validationPatterns.email.message
                                                        }
                                                    ]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                            <div>
                                                <label id='fullname'>Day of birth</label>
                                                <Form.Item name="DOB"
                                                    rules={[
                                                        { required: true, message: "Please select user date of birth!" },
                                                        () => ({
                                                            validator(_, value) {
                                                                const selectedYear = value && value.year();
                                                                const currentYear = new Date().getFullYear();
                                                                if (selectedYear && currentYear && currentYear - selectedYear >= 18 && currentYear - selectedYear <= 100) {
                                                                    return Promise.resolve();
                                                                } else {
                                                                    form.resetFields(['DOB']);
                                                                    if ((currentYear - selectedYear < 18)) {
                                                                        message.error("must greater than 18 years old !!!")
                                                                    }
                                                                    return Promise.reject(new Error("Invalid date of birth!"));
                                                                }
                                                            },
                                                        }),
                                                    ]}>
                                                    <DatePicker />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }} >
                                                <label id='gender'>Gender</label>
                                                <Form.Item name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Radio.Group>
                                                        <Radio value={true}>Male</Radio>
                                                        <Radio value={false}>Female</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }} >
                                                <label id='address'>Address</label>
                                                <Form.Item name="address" rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>

                                            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                                <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                                                    Save
                                                </Button>
                                                <Button type="primary" onClick={() => setUpdateUser(false)}>

                                                    Cancel
                                                </Button>
                                            </Form.Item>
                                        </Col>

                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={7}>
                            <Card style={{ height: '100%' }}>
                                <Col flex={1} style={{ display: 'flex', justifyContent: 'center' }}>
                                    {user ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <img
                                                // src={newAvatar[0] || user?.avatar} height={"170px"} width={"170px"}
                                                src={"data:image/jpeg;base64,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" || user?.avatar} height={"170px"} width={"170px"}
                                                style={{ borderRadius: '50%', display: 'block' }}
                                            />
                                            <h3>{user?.fullname}</h3>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <Avatar size={64} icon={<UserOutlined />} />
                                            <h3>Fake Data</h3>
                                        </div>
                                    )}
                                </Col>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            )}
        </Layout>
    );
}

export default UserProfile;






