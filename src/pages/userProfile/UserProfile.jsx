import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Button, Form, Input, Radio, DatePicker, message, Avatar, Row, Col, Card, Image } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, ManOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
// import { useGetUserByIdQuery, useEditUserMutation } from '../../../services/userAPI';
import "./UserProfile.scss"
import { validationPatterns } from '../../utils/utils';
import { useEditProfileMutation, useGetUserProfileQuery } from '../../services/userAPI';
import { selectCurrentUser } from '../../slices/auth.slice';
import { useSelector } from 'react-redux';
import ChangePassword from './ChangePassword';
import { v4 as uuidv4 } from 'uuid';
import UploadWidget from '../../components/uploadWidget/uploadWidget';
// import UploadWidget from '../../../components/uploadWidget/uploadWidget';


const UserProfile = () => {
    // const { userId } = useParams();
    const [editUser] = useEditProfileMutation();
    // const { data: user, error, isLoading } = useGetUserProfileQuery(userId);  /// API login
    const user = useSelector(selectCurrentUser);
    const [isUpdatePassword, setIsUpdatePassword] = useState(false);
    console.log(user)
    const [form] = Form.useForm();
    const [updateUser, setUpdateUser] = useState(false);
    const [newAvatar, setNewAvatar] = useState([]);
    const [folder] = useState(uuidv4());


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
                id: user.id,
                fullname: user?.userName,
                email: user?.email,
                DOB: user?.dob ? dayjs(user.dob) : null,
                gender: true,                                     // missing gender, mising avatar chua chinh uploadWidgets
                phoneNumber: user?.phoneNumber,
                address: user?.address,
                password: user?.password
            });
        }

    }, [user, form]);

    const handleUpdate = () => {
        setUpdateUser(!updateUser);
    }

    const setAvatar = (imageUrl) => {
        setNewAvatar(imageUrl);
    };

    const updateUserProfile = async (values) => {
        console.log(values)
        const result = await editUser({
            body: { ...values },
            id: user.id
        });
        if (result.data.status === 200) {
            message.success(result.data.message);
            setUpdateUser(false);
        }
    };
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
                                        <div className='profile-information-content-input' >
                                            <label id='Address'>Address</label>
                                            <Input readOnly size='large' name='Address' value={user?.address} />

                                        </div>

                                    </Col>
                                    <Col span={12}>
                                        <div className='profile-information-content-input'>
                                            <label id='fullname'>Day of birth</label>
                                            <Input value={dayjs(user?.dob).format("DD/MM/YYYY")} readOnly size='large' />
                                        </div>
                                    </Col>

                                </div>
                                <h5 className='profile-information-content-subtitle' style={{ marginTop: '1rem' }}>CONTACT INFOMATION</h5>
                                <div style={{ display: 'flex' }} className='profile-information-content-type'>
                                    <Col span={12}>
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
                                                src={newAvatar[0] || user?.imgUrl} height={"170px"} width={"170px"}

                                                style={{ borderRadius: '50%', display: 'block' }}
                                            />
                                            <h3 style={{ marginTop: '1rem' }}>{user?.userName}</h3>
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
                    onFinish={updateUserProfile}
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
                                                    <Input readOnly />
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

                                                <Form.Item name="urlImg" label="Image">
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

                                                            src={newAvatar[(Avatar.length - 1)]}
                                                            // alt={`Uploaded Image ${index + 1}`}
                                                            width={200}
                                                            style={{ marginRight: '10px' }}
                                                        />

                                                    </div>
                                                </Form.Item>

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
                                                    <Input readOnly />
                                                </Form.Item>
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }}>
                                                <label id='fullname'>Day of birth</label>
                                                <Form.Item
                                                    name="DOB"
                                                    rules={[
                                                        { required: true, message: "Please select user date of birth!" },
                                                        () => ({
                                                            validator(_, value) {

                                                                const selectedYear = value && value.year();
                                                                const currentYear = new Date().getFullYear();
                                                                if (selectedYear && currentYear && currentYear - selectedYear >= 18 && currentYear - selectedYear <= 100) {
                                                                    return Promise.resolve();
                                                                } else {
                                                                    form.resetFields(['dob']);
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
                                                {/* <label id='gender'>Gender</label> */}
                                                {/* <Form.Item name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Radio.Group>
                                                        <Radio value={true}>Male</Radio>
                                                        <Radio value={false}>Female</Radio>
                                                    </Radio.Group>
                                                </Form.Item> */}
                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }} >
                                                <label id='address'>Address</label>
                                                <Form.Item name="address" rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Input />
                                                </Form.Item>
                                            </div>
                                            {/* <div className='profile-information-content-input' style={{ marginTop: '1rem' }} >
                                                <label id='address'>New Password</label>
                                                <Form.Item
                                                    hasFeedback
                                                    name="password"
                                                    rules={[
                                                        {
                                                            // required: true,
                                                            pattern: validationPatterns.password.pattern,
                                                            message: validationPatterns.password.message

                                                        }
                                                    ]}
                                                >
                                                    <Input.Password placeholder="Password" className="form-input"
                                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                    />
                                                </Form.Item>

                                            </div>
                                            <div className='profile-information-content-input' style={{ marginTop: '1rem' }} >
                                                <label id='address'>Retype password</label>
                                                <Form.Item
                                                    name="retypePassword"
                                                    rules={[
                                                        // { required: true, message: 'Please re-type the password!' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || getFieldValue('password') === value) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('The passwords do not match!'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input.Password
                                                        placeholder="Re-type password"
                                                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                                    />
                                                </Form.Item>
                                            </div> */}
                                            {/* <ChangePassword
                                                form={form}
                                                isUpdatePassword={isUpdatePassword}
                                                setIsUpdatePassword={setIsUpdatePassword}
                                            /> */}

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
                                                src={newAvatar[0] || user?.imgUrl} height={"170px"} width={"170px"}

                                                style={{ borderRadius: '50%', display: 'block' }}
                                            />
                                            <h3 style={{ marginTop: '1rem' }}>{user?.userName}</h3>
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






