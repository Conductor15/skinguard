import Navbar from '../../../components/client/navbar/Navbar'
import Navbar_2 from '../../../components/client/navbar/Navbar_2'
import Footer from '../../../components/client/footer/footer'

import Main_Background from './Main_Background'
import Content_1 from './content_1'
import Content_2 from './content_2'
import Content_3 from './content_3'
import Content_4 from './content_4'
import Contact from './contact'

const Home = () => {
    return (
        <>
            <Navbar/>
            <Navbar_2 />
            <Main_Background />
            <Content_1 />
            <Content_2 />
            <Content_3 />
            <Content_4 />
            <Contact />
            <Footer />
        </>
    )
}

export default Home