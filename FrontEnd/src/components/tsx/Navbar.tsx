import TechwiqLogo from '../../assets/pictures/Techwiq.png'
import '../css/navbar.css'
const Navbar = () => {
  return (
    <div className='navbar'>
        <div className='left_Navbar'>
          <img src={TechwiqLogo} alt="Techwiq Logo" width={36} height={60}/>
          <div className='name_Logo'>
            <span className='skin_Logo'>
              SKIN
            </span>
            <span className='guard_Logo'>
              GUARD
            </span>
          </div>
        </div>
        
        <div className='right_Navbar'>
          <span className='first_Letter_right_Navbar'>We unveil what the skin conceals—early</span>
          <span className='second_Letter_right_Navbar'>diagnosis through the lens of technology</span>
        </div>
    </div>
  )
}

export default Navbar
