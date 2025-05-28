import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { Card } from '@mui/material';
import Container from '@mui/material/Container';
import { TabContext, TabPanel } from '@mui/lab';

import Category from './category/category';
import { usePathname } from 'src/routes/hooks';
import SubCategory from './sub-category/sub-category';
import ProductType from './product-type/product-type';
import { Tab, TabList } from 'src/components/tabs/tabs';

const Menu = () => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const [value, setValue] = useState('1');

  const handleChange = useCallback((event, val) => {
    setValue(val);
    if (val === '1') navigate('/menu/category');
    else if (val === '2') navigate('/menu/subcategory');
    else if (val === '3') navigate('/menu/productType');
  }, []);

  useEffect(() => {
    if (pathname === '/menu/category') {
      setValue('1');
    } else if (pathname === '/menu/subcategory') {
      setValue('2');
    } else if (pathname === '/menu/productType') {
      setValue('3');
    }
  }, [pathname]);

  return (
    <Container>
      <Card>
        <TabContext value={value}>
          <TabList
            aria-label="Menu"
            scrollButtons="auto"
            variant="scrollable"
            sx={{ px: 2, py: 1 }}
            onChange={handleChange}
            allowScrollButtonsMobile
          >
            <Tab label="Category" value="1" />
            <Tab label="SubCategory" value="2" />
            <Tab label="Product Type" value="3" />
          </TabList>
          <TabPanel value="1" sx={{ p: 0 }}>
            <Category />
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <SubCategory />
          </TabPanel>
          <TabPanel value="3" sx={{ p: 0 }}>
            <ProductType />
          </TabPanel>
        </TabContext>
      </Card>
    </Container>
  );
};

export default Menu;
