import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="footer-section">
      <div className="footer-section">
        <div className="footer-left">
          <img src="/Images/logo.png" alt="Living Lines Logo" className="footer-logo" />
          <p className="footer-description">
            Living Lines Emporio is a venture of ‘Living Lines Group’, a synonym for high-end sanitary wares, bathroom fittings, tiles & allied building materials. Living Group had its inception in the year 1998 at Vizag in Andhra Pradesh, India.
          </p>
        </div>
        <div className="footer-right">
          <h2 className="footer-heading">Get The Latest Updates</h2>
          <div className="footer-subscribea">
            <input placeholder="Enter your Email..." className="inputa" name="text" type="text" />
            <button className="Btna"></button>
          </div>
        </div>

        <div className="showroom-section">
            <h2 className="showroom-title">Our Showrooms</h2>
            <div className="showroom-table">
                <div className="showroom-column">
                    <h3>Visakhapatnam</h3>
                    <p><i className="fas fa-envelope mail-icon" /> info@livinglines.in</p>
                    <p><i className="fas fa-phone phone-icon" /> 08912514792</p>
                </div>
                <div className="showroom-column">
                    <h3>Madhurawada</h3>
                    <p><i className="fas fa-envelope mail-icon" /> info@livinglines.in</p>
                    <p><i className="fas fa-phone phone-icon" /> +91 9849111487</p>
                </div>
                <div className="showroom-column">
                    <h3>Vijayanagaram</h3>
                    <p><i className="fas fa-envelope mail-icon" /> info@livinglines.in</p>
                    <p><i className="fas fa-phone phone-icon" /> +91 7997995219</p>
                </div>
            </div>
        </div>
        <div className="extra-links-section">
          <div className="extra-column">
            <h2 className="extra-title">Navigate</h2>
            <div className="navigate-table">
              <p>Home</p>
              <p>Bathroom</p>
              <p>Wellness</p>
              <p>Blog</p>
              <p>Kitchen</p>
              <p>Showroom 360</p>
              <p>Events</p>
              <p>Surface</p>
              <p>Contact</p>
            </div>
          </div>

          <div className="extra-column">
            <h2 className="extra-title">Need Help?</h2>
            <div className="simple-links">
              <p>Customer Service</p>
              <p>Privacy Policy</p>
              <p>Terms</p>
            </div>
          </div>

          <div className="extra-column">
            <h2 className="extra-title">Social Media</h2>
            <div className="simple-links">
              <p><i className="fab fa-instagram social-icon" /> Instagram</p>
              <p><i className="fab fa-linkedin social-icon" /> LinkedIn</p>
              <p><i className="fab fa-twitter social-icon" /> Twitter</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
