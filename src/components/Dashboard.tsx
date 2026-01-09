import React from 'react'
// import SidebarToggle from '../ui/SidebarToggle';
// import Sidebar from '../ui/Sidebar';
// import DarkModeToggle from '../ui/DarkModeToggle';
import { ToastContainer } from 'react-toastify';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box } from '@mui/material';



interface DashboardProps {
    children?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({children}) => {
const [tabValue, setTabValue] = React.useState(0);

  return (
    <>  
    <Box
    sx={{
        position: 'absolute',
        top: '0',
        left: '0',
        minHeight: '100dvh',
        width: '100vw',
        //background: `linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'red'
    }}
    >
    <Navbar setTabValue={setTabValue} value={tabValue}/>    
        {children}
    <Footer />
    </Box>
    <ToastContainer />
    </>
  )
}

export default Dashboard