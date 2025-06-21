import '../css/main_background.css'
import background from '../../../assets/pictures/Main_Backgroundd.jpg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Main_Background = () => {
    const navigate = useNavigate();

    return (
        <div className='main_Background'>
            <img
                src= {background}
                alt= "background"
                style={{
                    width: '100%',
                    height: '752px', 
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: 'top'
                }}
            />
    
            <div className='box_main_Background'>
                <span className='first_Letter_box_main_Background'>Caring for Life</span>
                <span className='second_Letter_box_main_Background'>Ultimate Protection for Your Skin</span>
                <button className={`button_box_main_Background`} onClick={() => navigate('/doctors-ai')}>Our Services</button>
                {/* <button className='button_box_main_Background'>Our Services</button> */}
            </div>
        </div>
    )
}

export default Main_Background