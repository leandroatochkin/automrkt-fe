import React from 'react'
import { 
  Box, 
  Button, 
  Autocomplete,
  Typography,
  TextField
} from "@mui/material";
import type { RootState } from '../store/store';
import { useSelector } from "react-redux";
import { 
  DataGrid, 
  type GridRowsProp, 
  type GridColDef 
} from '@mui/x-data-grid';


const Main = () => {
const theme = useSelector((state: RootState) => state.theme);

const options = [
  { label: 'The Godfather', id: 1 },
  { label: 'Pulp Fiction', id: 2 },
];

const rows: GridRowsProp = [
  { id: 1, name: 'Data Grid', description: 'the Community version' },
  { id: 2, name: 'Data Grid Pro', description: 'the Pro version' },
  { id: 3, name: 'Data Grid Premium', description: 'the Premium version' },
];

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Product Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 300 },
];


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
        {/* <Box
        sx={{
            height: '8%',
            width: '100%',
            background: theme.colors.background,
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}
        >
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
          >
            New Campaign
          </Button>
        </Box> */}
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
                Campaigns
            </Typography>
            <Typography
            variant='subtitle2'
            color={theme.colors.textSecondary}
            gutterBottom
            >
                Manage and monitor your AI marketing automations
            </Typography>
            <Box
            sx={{
              display: 'flex',
              mt: 2,
            }}
            >
              <Autocomplete
                fullWidth
                disablePortal
                options={options}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Campaign" />}
                />
              <Button
              variant='outlined'
              >
               filter
              </Button>
            </Box>
             <DataGrid 
             rows={rows} 
             columns={columns} 
             sx={{
              mt: 2
             }}
             />
        </Box>
    </Box>
  )
}

export default Main