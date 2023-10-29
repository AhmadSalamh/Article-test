import { Outlet, createBrowserRouter } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar';
import Search from '../views/Search/Search';
import CustomizeArticles from '../views/CustomizeArticles/CustomizeArticles'

const Layout = () => {
    return (
        <div className='myApp'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Search />,
            },
            {
                path: '/customize-articles',
                element: <CustomizeArticles />,
            },
        ]
    },
])
export default router