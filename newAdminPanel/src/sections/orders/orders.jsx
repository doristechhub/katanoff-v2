import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { Card } from '@mui/material';
import Container from '@mui/material/Container';
import { TabContext, TabPanel } from '@mui/lab';

import Refund from './refund';
import OrderList from './orderlist';
import { usePathname } from 'src/routes/hooks';
import { Tab, TabList } from 'src/components/tabs/tabs';

const Orders = () => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');

  const handleChange = useCallback((e, val) => {
    setValue(val);
    if (val === '1') navigate('/orders/list');
    else if (val === '2') navigate('/orders/refund');
  }, []);

  useEffect(() => {
    if (pathname === '/orders/list') {
      setValue('1');
    } else if (pathname === '/orders/refund') {
      setValue('2');
    } else {
      setValue('1');
    }
  }, [pathname]);

  return (
    <Container maxWidth="xl">
      <Card>
        <TabContext value={value}>
          <TabList
            aria-label="Orders"
            scrollButtons="auto"
            variant="scrollable"
            sx={{ px: 2, py: 1 }}
            onChange={handleChange}
            allowScrollButtonsMobile
          >
            <Tab label="OrderList" value="1" />
            <Tab label="Refund" value="2" />
          </TabList>
          <TabPanel value="1" sx={{ p: 0 }}>
            {pathname === '/orders/list' || pathname === '/orders' ? <OrderList /> : null}
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            {pathname === '/orders/refund' ? <Refund /> : null}
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default Orders;
