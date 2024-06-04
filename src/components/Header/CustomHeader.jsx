import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Layout, Menu, Drawer, Grid, Avatar, Badge, Dropdown, notification } from "antd";
import "./CustomHeader.scss"; // Import SCSS file
import { MenuOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu";
import CartModal from "../../pages/product/cartModal";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalProducts } from "../../slices/product.slice"; // Import selector
import { logOut } from "../../slices/auth.slice";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = () => {
    const screens = useBreakpoint();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [cartVisible, setCartVisible] = useState(false); 
    const totalProducts = useSelector(selectTotalProducts); 
    const navigate = useNavigate();

    const toggleCartModal = () => {
        setCartVisible(!cartVisible);
    };
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logOut());
        notification.success({
            message: "Logout successfully",
            description: "See you again!",
        });
        navigate("/login")
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);


    const menu = (
        <Menu>
            <Menu.Item key="profile">
                <Link to="/user-profile">User Profile</Link>
            </Menu.Item>
            <Menu.Item key="history">
                <Link to="/user-transaction-history">Transaction History</Link>
            </Menu.Item>
            <Menu.Item key="logout">
                <Link onClick={handleLogout }>Log out</Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Header id="header" className={visible ? "show" : "hidden"} style={{ zIndex: '1' }}>
            <Link to={"/"}>
                <div className="header-logo">
                    <p><span style={{ color: 'black' }}>Exchange</span> <span >Web</span></p>
                </div>
            </Link>
            {screens.md ? (
                <>
                    <div >
                        <Menu mode="horizontal" defaultSelectedKeys={["1"]} style={{ width: 'fit-content', backgroundColor: 'none' }}>
                            <Menu.Item key="1">
                                <Link to="/">Home</Link>
                            </Menu.Item>
                            <SubMenu key="2" title="Pages">
                                <Menu.Item key="2-1">
                                    <Link to="/destination">Destination</Link>
                                </Menu.Item>
                                <Menu.Item key="2-2">
                                    <Link to="/about">About Us</Link>
                                </Menu.Item>
                            </SubMenu>
                            <Menu.Item key="3">
                                <Link to="/product">Product</Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/">Exchange Product</Link>
                            </Menu.Item>
                            <Menu.Item key="5">
                                <Link to="home">Tour Search</Link>
                            </Menu.Item>
                            <Menu.Item key="6">
                                <Link to="admin">Blog</Link>
                            </Menu.Item>
                        </Menu>

                    </div>
                    {/* //nun-function */}
                    <div className="icon-header">
                        <p className="cart-icon" onClick={toggleCartModal}>
                            <Badge count={totalProducts}>
                                <ShoppingCartOutlined style={{ fontSize: '30px' }} />
                            </Badge>
                        </p>
                        <Dropdown overlay={menu} trigger={['hover']}>
                            <Avatar style={{ marginRight: '1rem', display: 'block' }} size="large" icon={<UserOutlined />} />
                        </Dropdown>

                    </div>
                    {/* <div className="btn-login">
                        <Link to={"/login"}>
                            <Button type="primary" className="login-btn"><p>Login</p></Button>
                        </Link>
                    </div> */}
                </>
            ) : (
                <Button className="menu-btn" onClick={() => setDrawerVisible(true)} style={{ marginRight: '40px' }}>
                    <MenuOutlined />
                </Button>
            )}
            <Drawer
                title="Navigation"
                placement="right"
                closable={false}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                <Menu
                    mode="vertical"
                    defaultSelectedKeys={["1"]}
                    style={{ width: '100%' }}
                    onClick={() => setDrawerVisible(false)}
                >
                    <Menu.Item key="1">
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <SubMenu key="2" title="Pages">
                        <Menu.Item key="2-1">
                            <Link to="/destination">Destination</Link>
                        </Menu.Item>
                        <Menu.Item key="2-2">
                            <Link to="/about">About Us</Link>
                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="3">
                        <Link to="admin">Tour List</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/"> Room List </Link>
                    </Menu.Item>
                    <Menu.Item key="5">
                        <Link to="home">Tour Search</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link to="admin">Blog</Link>
                    </Menu.Item>
                </Menu>
            </Drawer>
            <CartModal
                visible={cartVisible}
                onClose={toggleCartModal}
            />
        </Header>
    );
};

export default CustomHeader;
