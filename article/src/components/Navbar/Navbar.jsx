import { Link } from 'react-router-dom'
import './Navbar.scss'
const Navbar = () => {
  return (
    <div className='navbar d-flex justify-content-between '>
      <Link to="/">Article</Link>
      <div className='d-flex gap-5'>
        <Link to="/">Home</Link>
        <Link to='/customize-articles'>Customize Articles</Link>
      </div>
    </div>
  )
}

export default Navbar