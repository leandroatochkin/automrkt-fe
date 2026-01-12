import React from 'react'
import { 
    Box,
    Button,
    Tabs,
    Tab
 } from '@mui/material'
 import {styled} from '@mui/material'
 import type { RootState } from '../store/store'
 import { useSelector } from 'react-redux'
 import { useLocation, useNavigate } from 'react-router-dom'

interface  NavbarProps {
    setTabValue: (value: number) => void
    value: number
}

const Navbar: React.FC<NavbarProps> = ({ setTabValue, value }) => {
const theme = useSelector((state: RootState) => state.theme);
const location = useLocation();
const navigate = useNavigate();

const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabValue(value)
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}





  return (
    <Box
        sx={{
            height: '8vh',
            width: '100%',
            background: theme.colors.background,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'fixed',
            zIndex: 999,
            top: 0,
            left: 0
        }}
        >
          <Box>
            logo container
          </Box>
          {
            location.pathname === '/' 

            ?

            (
                <>
                <Box>
                    logo container
                </Box>
                <Button
                    variant='contained'
                    color='primary'
                    sx={{
                    mr: 2,
                    p: '0.6rem'
                    }}
                    onClick={()=>navigate('/campaign')}
                >
                    New Campaign
                </Button>
                </>
            )

            :

            (
               <Tabs 
                value={value} 
                onChange={handleTabChange}
                role='navigation'
                textColor='inherit'
                indicatorColor='secondary' 
                >
                    <Tab                         
                        label='Dashboard' 
                        {...a11yProps(0)}
                        component="a"
                        sx={{
                            fontWeight: 'bold'
                        }}
                        />
                    <Tab 
                        label='Campaigns' 
                        {...a11yProps(1)} 
                        component="a" 
                        sx={{
                            fontWeight: 'bold'
                        }}
                        />
                </Tabs>
            )
          }
    </Box>      
  )
}

export default Navbar