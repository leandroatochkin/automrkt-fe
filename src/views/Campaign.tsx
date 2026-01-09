import React from 'react'
import { 
    Box, 
    Typography,
    TextField,
    Button
} from '@mui/material'
import type { RootState } from '../store/store'
import { useSelector } from 'react-redux'
import type { Campaign } from '../api/campaignApi'


const Campaign: React.FC<Campaign> = (props: Campaign) => {
const theme = useSelector((state: RootState) => state.theme)

  return (
    <Box
    sx={{
        width: '100%',
        background: theme.colors.backgroundSecondary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
    }}
    >
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '30px',
            flexGrow: 1,          // 1. This tells the box to take up all available middle space
            width: '90%',         // 2. Ensures it doesn't hit the screen edges
            maxWidth: '1800px',   // 3. Keeps it readable on wide screens
            overflow: 'hidden',   // 4. Prevents the red box itself from spilling out
            boxSizing: 'border-box' // 5. Ensures padding is included in the width/height
          }}
        >
            <Typography
            variant='h2'
            color={theme.colors.text}
            fontWeight='bolder'
            >
                {/* {
                    props.isNew ? 'New Campaign' : `Campaign: ${props.data.product_name}`
                } */}
                New Campaign    
            </Typography>
            <Typography
            variant='subtitle2'
            color={theme.colors.textSecondary}
            gutterBottom
            >
                Create of modify campaigns
            </Typography>
           <TextField
            rows={8}
            placeholder='Type your idea to start generating AI content...'
           />
           <Button
           variant='contained'
           >
                Generate
           </Button>
        </Box>
    </Box>
  )
}

export default Campaign