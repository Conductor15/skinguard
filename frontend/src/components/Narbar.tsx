import TechwiqLogo from '../assets/Techwiq.png'
import '../assets/styles.css'
const Narbar = () => {
  return (
    <div className='navbar'>
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
  )
}

export default Narbar
