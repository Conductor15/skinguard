import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RegisterLogIn.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setNavbarActiveItem } from '../../stores/UiStore';

const API_URL = 'http://localhost:8000';

const Register: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Tự động chuyển view theo query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLoginView(false);
    if (mode === 'login') setIsLoginView(true);
  }, [location.search]);

  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLoginView(prev => !prev);
    }, 300);
    setTimeout(() => {
      setIsTransitioning(false);
      setRegisterMessage('');
      setLoginMessage('');
    }, 600);
  };

  const handleRegisterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const generatePatientId = () => {
    return 'PAT' + Math.floor(100000 + Math.random() * 900000);
  };

  const getDefaultBirthDay = () => {
    return '2000-01-01';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterMessage('');
    try {
      const patientData = {
        fullName: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        birthDay: getDefaultBirthDay(),
        patient_id: generatePatientId()
      };
      await axios.post(`${API_URL}/patient`, patientData);
      setRegisterMessage('Đăng ký thành công! Vui lòng đăng nhập.');
      setRegisterForm({ name: '', email: '', password: '' });
      setTimeout(() => handleToggle(), 1200);
    } catch (err: any) {
      setRegisterMessage(
        err?.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
      );
    } finally {
      setRegisterLoading(false);
    }
  };

  // Login submit: kiểm tra cả patient và doctor
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage('');
    try {
      // 1. Kiểm tra Patient
      const patientRes = await axios.get(`${API_URL}/patient`);
      const patients = patientRes.data;
      const foundPatient = patients.find(
        (p: any) =>
          p.email === loginForm.email &&
          p.password === loginForm.password
      );
      if (foundPatient) {
        setLoginMessage('Đăng nhập thành công!');
        localStorage.setItem('user', JSON.stringify(foundPatient));
        setTimeout(() => {
          dispatch(setNavbarActiveItem('home')); // <--- Thêm dòng này
          navigate('/');
        }, 500);
        return;
      }

      // 2. Kiểm tra Doctor (giả sử API là /doctor, trả về danh sách doctor)
      const doctorRes = await axios.get(`${API_URL}/doctor`);
      const doctors = doctorRes.data;
      const foundDoctor = doctors.find(
        (d: any) =>
          d.email === loginForm.email &&
          d.password === loginForm.password
      );
      if (foundDoctor) {
        setLoginMessage('Đăng nhập thành công (Doctor)!');
        localStorage.setItem('user', JSON.stringify({ ...foundDoctor, role: 'doctor' }));
        setTimeout(() => {
          dispatch(setNavbarActiveItem('home')); // <--- Thêm dòng này
          navigate('/dashboard');
        }, 500);
        return;
      }

      setLoginMessage('Sai tài khoản hoặc mật khẩu!');
    } catch (err: any) {
      setLoginMessage('Lỗi khi kết nối tới server.');
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="register_container">
      <div className="register_box">
        <div className={`sliding_overlay ${isLoginView ? 'login_view' : 'register_view'} ${isTransitioning ? 'transitioning' : ''}`}>
          <div className={`welcome_content register_welcome ${!isLoginView && !isTransitioning ? 'active' : ''}`}>
            <h2 className="welcome_title">Welcome!</h2>
            <p className="welcome_text">
              Already have an account?<br />
              Please login to continue
            </p>
            <button onClick={handleToggle} className="welcome_button">
              Log in
            </button>
          </div>
          <div className={`welcome_content login_welcome ${isLoginView && !isTransitioning ? 'active' : ''}`}>
            <h2 className="welcome_title">Hello!</h2>
            <p className="welcome_text">
              Don't have an account?<br />
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
        <div className="form_section left_section">
          <form
            className={`form_content register_form ${!isLoginView && !isTransitioning ? 'active' : ''}`}
            onSubmit={handleRegister}
            autoComplete="off"
          >
            <h2 className="form_title">Register</h2>
            <div className="form_inputs">
              <input
                type="text"
                name="name"
                placeholder="User name"
                className="form_input"
                value={registerForm.name}
                onChange={handleRegisterInput}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form_input"
                value={registerForm.email}
                onChange={handleRegisterInput}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form_input"
                value={registerForm.password}
                onChange={handleRegisterInput}
                required
              />
              <button className="form_button" type="submit" disabled={registerLoading}>
                {registerLoading ? 'Registering...' : 'Register'}
              </button>
              {registerMessage && (
                <div className="form_message" style={{ color: registerMessage.includes('thành công') ? 'green' : 'red' }}>
                  {registerMessage}
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="form_section right_section">
          <form
            className={`form_content login_form ${isLoginView && !isTransitioning ? 'active' : ''}`}
            onSubmit={handleLogin}
            autoComplete="off"
          >
            <h2 className="form_title">Log in</h2>
            <div className="form_inputs">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form_input"
                value={loginForm.email}
                onChange={handleLoginInput}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form_input"
                value={loginForm.password}
                onChange={handleLoginInput}
                required
              />
              <button className="form_button" type="submit" disabled={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Log in'}
              </button>
              {loginMessage && (
                <div className="form_message" style={{ color: loginMessage.includes('thành công') ? 'green' : 'red' }}>
                  {loginMessage}
                </div>
              )}
            </div>
            <p className="forgot_password">
              <a href="#" className="forgot_link">Forgot password?</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;