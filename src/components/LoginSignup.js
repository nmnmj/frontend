import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import * as React from 'react';
import RegisterationForm from './RegisterationForm';
import LoginForm from './Login';


export default function LoginSign() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Sign Up" value="1" />
            <Tab label="Sign In" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
            <RegisterationForm />
        </TabPanel>
        <TabPanel value="2">
            <LoginForm />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
