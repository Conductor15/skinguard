import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    
    const [isLoginView, setIsLoginView] = useState(mode === 'login');
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (mode === 'login') {
            setIsLoginView(true);
        } else {
            setIsLoginView(false);
        }
    }, [mode]);
  
    const handleToggle = () => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setIsLoginView(prev => !prev);
      }, 300);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    };
  
    return (
      <div className="register-container">
        <div className="register-box">
          
          {/* Sliding overlay*/}
          <div className={`sliding-overlay ${isLoginView ? 'login-view' : 'register-view'} ${isTransitioning ? 'transitioning' : ''}`}>
            
            {/* Welcome Register view */}
            <div className={`welcome-content register-welcome ${!isLoginView && !isTransitioning ? 'active' : ''}`}>
                <h2 className="welcome-title">Welcome!</h2>
                <p className="welcome-text">
                Already have an account?<br/>
                Please login to continue
                </p>
                <button onClick={handleToggle} className="welcome-button">
                    Log in
                </button>
            </div>
  
            {/* Welcome Login view */}
            <div className={`welcome-content login-welcome ${isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="welcome-title">Hello!</h2>
              <p className="welcome-text">
                Don't have an account?<br/>
                Sign up to get started
              </p>
              <button
                onClick={handleToggle}
                className="welcome-button"
              >
                Register
              </button>
            </div>
          </div>
  
          {/* Left - Form Register */}
          <div className="form-section left-section">
            <div className={`form-content register-form ${!isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="form-title">Register</h2>
              <div className="form-inputs">
                <input 
                  type="text" 
                  placeholder="User name"
                  className="form-input"
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="form-input"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="form-input"
                />
                <button className="form-button">
                  Register
                </button>
              </div>
            </div>
          </div>
  
          {/* Right - Form Log in */}
          <div className="form-section right-section">
            <div className={`form-content login-form ${isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="form-title">Log in</h2>
              <div className="form-inputs">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="form-input"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="form-input"
                />
                <button className="form-button">
                  Log in
                </button>
              </div>
              <p className="forgot-password">
                <a href="#" className="forgot-link">Forgot password ?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;