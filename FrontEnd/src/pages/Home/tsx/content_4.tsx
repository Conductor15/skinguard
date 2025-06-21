import '../css/content_4.css'
import { NavLink } from 'react-router-dom'
const Content_4 = () => {
    return (
        <div className='content_4'>
            <div className='content_4_left'>
                <span className='content_4_left_first'>AI-Powered Skin Analysis</span>
                <span className='content_4_left_second'>Unsure about your skin type? Wondering about hidden imperfections or which skincare products are right for you? Our advanced AI analyzes your skin and provides personalized insights to help you care for your skin the right way.</span>
                <NavLink to="/doctors-ai" className='content_3_right_third'>Learn More</NavLink>
            </div>
            <div className='content_4_right'>
                <img src="/src/assets/pictures/img_content_4.png" alt="" />
            </div>
        </div>
    )
}

export default Content_4