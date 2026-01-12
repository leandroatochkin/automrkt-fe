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
        maxWidth: '100vw',
        width: '100vw',
        //background: `linear-gradient(90deg,rgba(131, 58, 180, 1) 0%, rgba(253, 29, 29, 1) 50%, rgba(252, 176, 69, 1) 100%)`,
        display: 'flex',
        flexDirection: 'column',
        //justifyContent: 'space-between',
        alignItems: 'center',
        background: `
            repeating-linear-gradient(
                -45deg,
                #ff7e5f,
                #ff7e5f 10px,
                #3f51b5 10px,
                #3f51b5 20px
                ),
                repeating-linear-gradient(
                45deg,
                #3f51b5,
                #3f51b5 10px,
                #ff7e5f 10px,
                #ff7e5f 20px
                ),
                repeating-linear-gradient(
                -30deg,
                #3f51b5,
                #3f51b5 10px,
                #ff7e5f 10px,
                #ff7e5f 20px
                ),
                repeating-linear-gradient(
                30deg,
                #ff7e5f,
                #ff7e5f 10px,
                #3f51b5 10px,
                #3f51b5 20px
                );
        `,
        
    }}
    >
    <Navbar setTabValue={setTabValue} value={tabValue}/>    
        <Box
        sx={{
            flex: '1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
        }}
        >
            {children}
        </Box>
    {/* <Footer /> */}
    </Box>
    <ToastContainer />
    </>
  )
}

export default Dashboard