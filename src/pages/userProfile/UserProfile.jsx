import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout, Button, Form, Input, Radio, DatePicker, message, Avatar, Row, Col, Card, Image, Skeleton, Rate } from 'antd';
import { EditOutlined, EyeInvisibleOutlined, EyeTwoTone, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import "./UserProfile.scss"
import { validationPatterns } from '../../utils/utils';
import { useEditProfileMutation, useGetUserProfileForOtherQuery } from '../../services/userAPI';
import { selectCurrentUser } from '../../slices/auth.slice';
import { useSelector } from 'react-redux';
import ChangePassword from './ChangePassword';
import { v4 as uuidv4 } from 'uuid';
import UploadWidget from '../../components/uploadWidget/uploadWidget';

const UserProfile = () => {
    const [editUser] = useEditProfileMutation();
    const user = useSelector(selectCurrentUser);
    const { data, isLoading, refetch } = useGetUserProfileForOtherQuery(user?.id)
    console.log(data)
    const [isUpdatePassword, setIsUpdatePassword] = useState(false);
    const [form] = Form.useForm();
    const [updateUser, setUpdateUser] = useState(false);
    const [newAvatar, setNewAvatar] = useState([]);
    const [folder] = useState(uuidv4());



    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                id: data.id,
                userName: data?.userName,
                email: data?.email,
                DOB: data?.dob ? dayjs(data.dob) : null,
                gender: data?.gender,
                phoneNumber: data?.phoneNumber,
                address: data?.address,
                password: data?.password,
                imgUrl: data?.imgUrl
            });

        }
    }, [data, form]);

    const handleUpdate = () => {
        setUpdateUser(!updateUser);
    }

    const setAvatar = (imageUrl) => {
        setNewAvatar(imageUrl);
        form.setFieldsValue({ imgUrl: imageUrl[0] });
    };

    const updateUserProfile = async (values) => {
        try {
            await editUser({
                body: {
                    ...values,
                    imgUrl: newAvatar.length > 0 ? newAvatar[0] : user.imgUrl,
                },
                id: user.id,
            });
            refetch();
            message.success("Updated user profile successfully");

            setUpdateUser(false);
        } catch (error) {
            message.error("Failed to update user profile");
        }
    };
    if (isLoading) {
        return <Skeleton active />
    }

    return (
        <Layout className='main-layout-userProfile-page'>
            {!updateUser ? (
                <Row gutter={[16, 16]}>
                    <Col span={17}>
                        <Card title={
                            <div className='profile-information-title'>
                                <p>My account</p>
                                <Button onClick={() => setUpdateUser(true)} icon={<EditOutlined />} type='primary'>Update profile</Button>
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
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={7}>
                        <Card style={{ height: '100%' }}>
                            <Col flex={1} style={{ display: 'flex', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center' }} className='profile-card-user'>
                                    {data ? (
                                        <>
                                            <div style={{ textAlign: 'center' }}>
                                                <img
                                                    src={newAvatar[0] || data?.imgUrl} height={"170px"} width={"170px"}
                                                    style={{ borderRadius: '50%', display: 'block', boxShadow: "0 8px 12px rgba(0, 0, 0, 0.6)" }}
                                                />
                                                <h3 style={{ margin: '1rem 0 ' }}>{data?.userName}</h3>
                                                <Rate disabled defaultValue={data?.ratingCount} />
                                            </div>

                                        </>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <Avatar size={64} icon={<UserOutlined />} />
                                            <h3>Fake Data</h3>
                                        </div>
                                    )}
                                </div>

                            </Col>
                            <div style={{ textAlign: 'start',marginTop:'1rem'}}>
                                <ChangePassword
                                    form={form}
                                    isUpdatePassword={isUpdatePassword}
                                    setIsUpdatePassword={setIsUpdatePassword}
                                />
                            </div>
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
                                    <Button icon={<EditOutlined />} type='primary'>Update profile</Button>
                                </div>
                            }
                                style={{ height: '100%' }}>
                                <div className='profile-information-content'>
                                    <h5 className='profile-information-content-subtitle'>USER INFOMATION</h5>
                                    <div className='profile-information-content-type'>
                                        <Col span={12}>
                                            <div className='profile-information-content-input' >
                                                <label id='fullname'>Full name</label>
                                                <Form.Item name="userName" rules={[
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
                                                <Form.Item name="imgUrl" label="Image">
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
                                                            width={200}
                                                            style={{ marginRight: '10px' }}
                                                        />
                                                    </div>
                                                </Form.Item>
                                            </div>

                                        </Col>
                                        <Col span={12}>
                                            <div className='profile-information-content-input'>
                                                <label id='fullname'>Email address</label>
                                                <Form.Item name="email"
                                                    rules={[
                                                        { required: true, message: 'Please input your email!' },
                                                        {
                                                            pattern: validationPatterns.email.pattern,
                                                            message: validationPatterns.email.message
                                                        }
                                                    ]}>
                                                    <Input readOnly style={{ paddingBottom: '10px' }} />
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
                                                                        message.error("must be greater than 18 years old!!!")
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
                                                <Form.Item name="gender" rules={[{ required: true, message: 'Please select your gender!' }]}>
                                                    <Radio.Group>
                                                        <Radio value={"Male"}>Male</Radio>
                                                        <Radio value={"Female"}>Female</Radio>
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
                                                <Button type="primary" danger onClick={() => setUpdateUser(false)}>
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
                                    {data ? (
                                        <>
                                            <div style={{ textAlign: 'center' }}>
                                                <img
                                                    src={newAvatar[0] || data?.imgUrl} height={"170px"} width={"170px"}
                                                    style={{ borderRadius: '50%', display: 'block', boxShadow: "0 8px 12px rgba(0, 0, 0, 0.6)" }}
                                                />
                                                <h3 style={{ margin: '1rem 0' }}>{data?.userName}</h3>
                                                <Rate disabled defaultValue={data?.ratingCount} />

                                            </div>
                                        </>
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
