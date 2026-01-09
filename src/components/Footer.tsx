import React from 'react'
import { 
    Box,
    Typography
} from '@mui/material'
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';


const Footer = () => {
const theme = useSelector((state: RootState) => state.theme);

  return (
    <Box
    sx={{
        width: '100%',
        height: '30%',
        background: theme.colors.background,
        borderTop: `1px solid ${theme.colors.border}`
    }}
    >
sarasrtas
    </Box>
  )
}

export default Footer