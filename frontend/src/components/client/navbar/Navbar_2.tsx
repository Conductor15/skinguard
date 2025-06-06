import './navbar.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Navbar_2 = () => {
    const navigate = useNavigate();

    const navigateTo = (path: string) => {
        navigate(path);
    };

    const [activeItem, setActiveItem] = useState<string>('home'); 

    const handleItemClick = (item: string) => {
        setActiveItem(item); 
        switch(item) {
            case 'home':
                navigateTo('/');
                break;
            case 'about-us':
                navigateTo('/about-us');
                break;
            case 'doctors-ai':
                navigateTo('/doctors-ai');
                break;
            case 'contact':
                navigateTo('/contact');
                break;
            default:
                break;
        }
    };

    return (
        <div className='navbar_2'>
            <div className='left_Navbar_2'>
                <span className={`left_Navbar_2_item ${activeItem === 'home' ? 'now' : ''}`} onClick={() => handleItemClick('home')}>Home</span>
                <span className={`left_Navbar_2_item ${activeItem === 'about-us' ? 'now' : ''}`} onClick={() => handleItemClick('about-us')}>About us</span>
                <span className={`left_Navbar_2_item ${activeItem === 'doctors-ai' ? 'now' : ''}`} onClick={() => handleItemClick('doctors-ai')}>Doctors AI</span>
                <span className={`left_Navbar_2_item ${activeItem === 'contact' ? 'now' : ''}`} onClick={() => handleItemClick('contact')}>Contact</span>
            </div>
            <div className='right_Navbar_2'>
                <button className='sign_up'>sign up</button>
                <button className='log_in'>log in</button>
            </div>
        </div>
    )
}

export default Navbar_2