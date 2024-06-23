import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Thay đổi từ Link sang NavLink
import { Button, Layout, Menu, Drawer, Grid, Avatar, Badge, Dropdown, notification } from "antd";
import "./CustomHeader.scss"; // Import SCSS file
import { MenuOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import SubMenu from "antd/es/menu/SubMenu";
import CartModal from "../../pages/product/cartModal";
import { useDispatch, useSelector } from "react-redux";
import { selectTotalProducts } from "../../slices/product.slice"; // Import selector
import { logOut, selectCurrentUser } from "../../slices/auth.slice";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = () => {
    const screens = useBreakpoint();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [cartVisible, setCartVisible] = useState(false); 
    const totalProducts = useSelector(selectTotalProducts); 
    const user = useSelector(selectCurrentUser);
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
                <NavLink to="/user-profile" activeClassName="active">User Profile</NavLink> {/* Thay đổi từ Link sang NavLink */}
            </Menu.Item>
            <Menu.Item key="history">
                <NavLink to="/user-transaction-history" activeClassName="active">Transaction History</NavLink> {/* Thay đổi từ Link sang NavLink */}
            </Menu.Item>
            <Menu.Item key="logout">
                <Link onClick={handleLogout}>Log out</Link>
            </Menu.Item>
        </Menu>
    );

    const renderMenuItems = () => {
        if (user?.roleId === 1) {
            return (
                <>
                    <Menu.Item key="dashboard">
                        <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="manage-products">
                        <NavLink to="/manage-products" activeClassName="active">Manage Products</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="manage-posts">
                        <NavLink to="/manage-posts" activeClassName="active">Manage Posts</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                </>
            );
        } else if (user?.roleId === 3) {
            return (
                <>
                    <Menu.Item key="post-management">
                        <NavLink to="/postmanager" activeClassName="active">Post Management</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="manage-products">
                        <NavLink to="/manage-products" activeClassName="active">Manage Products</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="manage-posts">
                        <NavLink to="/manage-posts" activeClassName="active">Manage Report</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                </>
            );
        } else {
            return (
                <>
                    <Menu.Item key="1">
                        <NavLink exact to="/" activeClassName="active">Home</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="2">
                        <NavLink to="/product" activeClassName="active"> Buy Product</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="3">
                        <NavLink to="/exchange" activeClassName="active">Exchange Product</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="4">
                        <NavLink to="/about" activeClassName="active">About us</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="5">
                        <NavLink to="/activity" activeClassName="active">Activity</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                    <Menu.Item key="6">
                        <NavLink to="admin" activeClassName="active">Blog</NavLink> {/* Thay đổi từ Link sang NavLink */}
                    </Menu.Item>
                </>
            );
        }
    };

    return (
        <Header id="header" className={visible ? "show" : "hidden"} style={{ zIndex: '1' }}>
            <NavLink to={"/"}>
                <div className="header-logo">
                    <p><span style={{ color: 'black' }}>Exchange</span> <span >Web</span></p>
                </div>
            </NavLink>
            {screens.md ? (
                <>
                    <div>
                        <Menu mode="horizontal" defaultSelectedKeys={["1"]} style={{ width: 'fit-content', backgroundColor: 'none' }}>
                            {renderMenuItems()}
                        </Menu>
                    </div>
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
                    {renderMenuItems()}
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
