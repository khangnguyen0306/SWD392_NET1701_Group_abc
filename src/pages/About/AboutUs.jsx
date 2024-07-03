import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchangeAlt, faDollarSign, faLeaf } from '@fortawesome/free-solid-svg-icons';
import './AboutUs.css';
import CustomHeader from "../../components/Header/CustomHeader";
import CustomFooter from "../../components/Footer/CustomFooter";
import { useNavigate } from 'react-router-dom';
// Image imports
import about from '../../assets/about/about.png';
import about1 from '../../assets/about/about1.png';
import about2 from '../../assets/about/about2.png';
import exchangeImg from '../../assets/about/exchange.png'; // Add your exchange image here

const { Title, Paragraph } = Typography;

const images = [
  about,
  about1,
  about2,
];

const AboutUs = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // 5-second interval
    return () => clearInterval(interval);
  }, []);

  const handleJoinNowClick = () => {
    navigate('/exchange');
  };

  const currentImage = images[currentImageIndex];

  return (
    <div className="about-us-container">
      <CustomHeader />
      
      <Row justify="center">
        <Col span={16}>
          <Card hoverable className="image-card">
            <img alt="About Us" src={currentImage} className="about-image" />
            <div className="dots-container">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                ></span>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <div className="why-exchange-section">
        <Row justify="center">
          <Col span={20}>
            <Title level={1} className="why-title">Why Exchange?</Title>
            <Paragraph className="why-subtitle">
              Discover the Best Deals and Items
            </Paragraph>
            <Paragraph className="why-description">
              Exchange your unused items with other students to find what you need and save money. Great deals and a wide variety of items available for you.
            </Paragraph>
          </Col>
        </Row>

        <Row gutter={[16, 16]} justify="center" className="why-cards">
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <FontAwesomeIcon icon={faExchangeAlt} className="feature-icon" />
              <Title level={3} className="feature-title">Exchange Easily</Title>
              <Paragraph>Post your items and easily find what you need in return. Simple and efficient exchange process.</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <FontAwesomeIcon icon={faDollarSign} className="feature-icon" />
              <Title level={3} className="feature-title">Save Money</Title>
              <Paragraph>Get the items you need without spending more money. Exchange items you no longer use for something you want.</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <FontAwesomeIcon icon={faLeaf} className="feature-icon" />
              <Title level={3} className="feature-title">Sustainable Choices</Title>
              <Paragraph>Reduce waste and promote sustainability by exchanging items instead of buying new ones. Make eco-friendly choices.</Paragraph>
            </div>
          </Col>
        </Row>

        <Row justify="center">
          <button className="join-now-button" onClick={handleJoinNowClick}>
            JOIN NOW
          </button>
        </Row>
      </div>

      <div className="introduction-section">
        <Row justify="center" align="middle">
          <Col xs={24} md={12}>
            <Paragraph className="introduction-description">
              Exchange Web is your go-to platform for discovering and exchanging items within a thriving student community. Our mission is to help students <strong>connect</strong> and <strong>swap</strong> their unused items in a hassle-free and sustainable way.
            </Paragraph>
            <Paragraph className="introduction-description">
              Effortlessly post items you no longer need and find items you want, while saving money and reducing waste. Our user-friendly interface ensures a seamless experience, whether you're looking to trade <strong>textbooks, electronics, clothing</strong>, or other items.
            </Paragraph>
            <Paragraph className="introduction-description">
              By participating, you contribute to a more sustainable future, making eco-friendly choices that benefit both you and the environment. Join our community of like-minded individuals dedicated to sustainability and savvy exchanges.
            </Paragraph>
            <Paragraph className="introduction-description">
              Start exploring Exchange Web today and discover opportunities to <strong>exchange</strong> and <strong>save</strong>. Together, we can make a significant impact by promoting sustainable living.
            </Paragraph>
          </Col>
          <Col xs={24} md={12}>
            <img src={exchangeImg} alt="Exchange" className="exchange-image" />
          </Col>
        </Row>
      </div>

      <CustomFooter />
    </div>
  );
};

export default AboutUs;
