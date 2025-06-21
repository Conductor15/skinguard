import '../css/content_3.css'
import { NavLink } from 'react-router-dom'

const Content_3 = () => {
    return (
        <div className='content_3'>
            <div className='content_3_left'>
                <img src="/src/assets/pictures/AI_content_3.png" alt="" />
            </div>
            <div className='content_3_right'>
                <span className='content_3_right_first'>AI-Powered Diagnosis Through Images & Chat</span>
                <span className='content_3_right_second'>With just a few simple steps, you can share your skin concerns with our AI-powered system. Our advanced AI analyzes your uploaded images and provides instant insights. You can also chat with our AI assistant anytime, 24/7. Whether it's late at night or during a busy workday, SkinGuard AI is always ready to assist you—anytime, anywhere.</span>
                <NavLink to="/doctors-ai" className='content_3_right_third'>Learn More</NavLink>
            </div>
        </div>
    )
}

export default Content_3