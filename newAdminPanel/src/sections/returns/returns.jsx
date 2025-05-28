import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { Card } from '@mui/material';
import Container from '@mui/material/Container';
import { TabContext, TabPanel } from '@mui/lab';

import ReturnList from './returns-list';
import ReturnRefund from './return-refund';
import { usePathname } from 'src/routes/hooks';
import { Tab, TabList } from 'src/components/tabs/tabs';

const Returns = () => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');

  const handleChange = useCallback((e, val) => {
    setValue(val);
    if (val === '1') navigate('/returns/list');
    else if (val === '2') navigate('/returns/refund');
  }, []);

  useEffect(() => {
    if (pathname === '/returns/list') {
      setValue('1');
    } else if (pathname === '/returns/refund') {
      setValue('2');
    }
  }, [pathname]);

  return (
    <Container>
      <Card>
        <TabContext value={value}>
          <TabList
            aria-label="Returns"
            scrollButtons="auto"
            variant="scrollable"
            sx={{ px: 2, py: 1 }}
            onChange={handleChange}
            allowScrollButtonsMobile
          >
            <Tab label="Return List" value="1" />
            <Tab label="Refund" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ p: 0 }}>
            {pathname === '/returns/list' || pathname === '/returns' ? <ReturnList /> : null}
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            {pathname === '/returns/refund' ? <ReturnRefund /> : null}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default Returns;
