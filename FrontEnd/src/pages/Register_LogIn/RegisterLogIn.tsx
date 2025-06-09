import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './RegisterLogIn.css';

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
      <div className="register_container">
        <div className="register_box">
          
          {/* Sliding overlay*/}
          <div className={`sliding_overlay ${isLoginView ? 'login_view' : 'register_view'} ${isTransitioning ? 'transitioning' : ''}`}>
            
            {/* Welcome Register view */}
            <div className={`welcome_content register_welcome ${!isLoginView && !isTransitioning ? 'active' : ''}`}>
                <h2 className="welcome_title">Welcome!</h2>
                <p className="welcome_text">
                Already have an account?<br/>
                Please login to continue
                </p>
                <button onClick={handleToggle} className="welcome_button">
                    Log in
                </button>
            </div>
  
            {/* Welcome Login view */}
            <div className={`welcome_content login_welcome ${isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="welcome_title">Hello!</h2>
              <p className="welcome_text">
                Don't have an account?<br/>
                Sign up to get started
              </p>
              <button
                onClick={handleToggle}
                className="welcome_button"
              >
                Register
              </button>
            </div>
          </div>
  
          {/* Left - Form Register */}
          <div className="form_section left_section">
            <div className={`form_content register_form ${!isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="form_title">Register</h2>
              <div className="form_inputs">
                <input 
                  type="text" 
                  placeholder="User name"
                  className="form_input"
                />
                <input 
                  type="email" 
                  placeholder="Email"
                  className="form_input"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="form_input"
                />
                <button className="form_button">
                  Register
                </button>
              </div>
            </div>
          </div>
  
          {/* Right - Form Log in */}
          <div className="form_section right_section">
            <div className={`form_content login_form ${isLoginView && !isTransitioning ? 'active' : ''}`}>
              <h2 className="form_title">Log in</h2>
              <div className="form_inputs">
                <input 
                  type="email" 
                  placeholder="Email"
                  className="form_input"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  className="form_input"
                />
                <button className="form_button">
                  Log in
                </button>
              </div>
              <p className="forgot_password">
                <a href="#" className="forgot_link">Forgot password ?</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;