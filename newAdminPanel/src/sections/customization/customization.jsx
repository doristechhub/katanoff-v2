import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { Card } from '@mui/material';
import Container from '@mui/material/Container';
import { TabContext, TabPanel } from '@mui/lab';

import { usePathname } from 'src/routes/hooks';
import { Tab, TabList } from 'src/components/tabs/tabs';

import CustomizationType from './customization-type';
import CustomizationSubType from './customization-subtype';

const Customization = () => {
  const pathname = usePathname();
  const navigate = useNavigate();

  const [value, setValue] = useState('1');

  const handleChange = useCallback((e, val) => {
    setValue(val);
    if (val === '1') navigate('/customization/type');
    else if (val === '2') navigate('/customization/subtype');
  }, []);

  useEffect(() => {
    if (pathname === '/customization/type') {
      setValue('1');
    } else if (pathname === '/customization/subtype') {
      setValue('2');
    }
  }, [pathname]);

  return (
    <Container>
      <Card>
        <TabContext value={value}>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 2, py: 1 }}
            onChange={handleChange}
            aria-label="Customization"
            allowScrollButtonsMobile
          >
            <Tab label="Customization Type" value="1" />
            <Tab label="Customization SubType" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ p: 0 }}>
            <CustomizationType />
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <CustomizationSubType />
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default Customization;
