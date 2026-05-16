import React from 'react';
import { ArrowLeft, Send, Globe } from 'lucide-react'; 
import "./About.css"
import { Link, useNavigate } from "react-router-dom";

const AboutPage = () => {


const navigate=useNavigate();
  

  const sections = [
    { 
      title: "About Realstate Property Investment", 
      content: (
        <>
          <p>
            Realstate Property Investment is India’s largest online marketplace
            for all types of properties — from residential and commercial spaces
            to large buildings and even shares in factories. Headquartered in
            Mumbai, our platform offers attractive prices and reliable investment
            options across India.
          </p>
          <p>
            In less than three years, Realstate Property Investment has helped
            over 100,000 individuals own profitable properties at prices many
            times higher than their share value.
          </p>
        </>
      ),
      delay: 'delay-100'
    },
    { 
      title: "Our Mission", 
      content: (
        <p>
          To make buying and selling properties effortless by providing a secure,
          transparent, and nationwide property investment platform. We aim to
          empower investors to access legitimate, verified property opportunities
          through a simple and trusted system.
        </p>
      ),
      delay: 'delay-200'
    },
    { 
      title: "Our Vision", 
      content: (
        <>
          <p>
            To become India’s most trusted and comprehensive marketplace for real
            estate investments, uniting the unorganized market of non-performing
            and distressed assets under one digital roof.
          </p>
          <h2 className="card-subtitle">Core Values</h2>
          <p>
            Transparency, trust, growth, and customer-first approach drive
            everything we do — ensuring fair deals, verified listings, and secure
            transactions.
          </p>
        </>
      ),
      delay: 'delay-300'
    },
    { 
      title: "Our Network", 
      content: (
        <>
          
          <p>
            Our extensive property network spans cities across India, enabling you
            to choose properties by city or by auctioning banks. Whether you’re
            buying or selling, Realstate Property Investment ensures seamless,
            verified, and profitable transactions.
          </p>
          <img
            src="/logo.jpg"
            alt="Logo"
            className="network-img"
       
          />
        </>
      ),
      delay: 'delay-400'
    },
    { 
      title: "Founded", 
      content: (
        <>
          <p>Realstate Property Investment was founded in 2022.</p>
          <p className="mt-2">
            To buy or sell properties, please visit the Invest page.
            Thank you for trusting us!
          </p>
        </>
      ),
      delay: 'delay-500'
    },
  ];

  return (
    // Main Container: Uses full CSS styling for background and structure
    <div className="app-container">

     

      <div className="header2">
              <button className="back-btnR" onClick={() => navigate(-1)}>
                <ArrowLeft color="black" />
              </button>
              <h1 className="header-title">About Us</h1>
              <div className="spacer"></div>
            </div>

      {/* Content Area: Max width, centered, with responsive padding */}
      <div className="content-area">
        {sections.map((section, index) => (
          <div 
            key={index}
            className="info-card fade-in"
            style={{ 
              animationDelay: `${index * 150 + 200}ms`, // Staggered delay
            }}
          >
            <h2 className="card-title">
              {section.title}
            </h2>
            <div className="card-body">
              {section.content}
            </div>
          </div>
        ))}
      </div>
      
 
      
      

    </div>
  );
};



export default AboutPage;
