import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Dialog from '../../../components/dialog';
import { Button, LoadingButton } from '../../../components/button';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from '../../../components/dialog/styles';
import {
  productInitDetails,
  setIsDuplicateProduct,
  setSelectedProduct,
} from 'src/store/slices/productSlice';
import { helperFunctions } from 'src/_helpers';

const validationSchema = Yup.object({
  productName: Yup.string()
    .required('Product name is required')
    .max(60, 'Product name should not exceed 60 characters.')
    .matches(
      /^[a-zA-Z0-9\s]*$/,
      'Product name can only contain letters (a-z, A-Z), numbers (0-9), and spaces.'
    ),
  sku: Yup.string().required('Sku is required'),
});

const fieldKeys = [
  'description',
  'discount',
  'categoryId',
  'subCategoryId',
  'productTypeIds',
  'gender',
  'collectionIds',
  'settingStyleIds',
  'shortDescription',
  'variations',
  'specifications',
];

const fieldLabels = {
  description: 'Product Description',
  discount: 'Discount Percentage',
  categoryId: 'Category',
  productTypeIds: 'Product Type',
  subCategoryId: 'SubCategory',
  gender: 'Gender',
  collectionIds: 'Collection',
  settingStyleIds: 'Setting Style',
  shortDescription: 'Short Description',
  variations: 'Variations',
  specifications: 'Specifications',
};

const DuplicateProductDialog = ({ open, setOpen, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct } = useSelector(({ product }) => product);

  const [selectedFields, setSelectedFields] = useState(
    fieldKeys.reduce(
      (acc, field) => ({
        ...acc,
        [field]: selectedProduct[field] !== undefined,
      }),
      {}
    )
  );

  const handleCheckboxChange = useCallback(
    (event) => {
      const { name, checked } = event.target;

      setSelectedFields((prev) => {
        const updatedFields = { ...prev };

        if (name === 'categoryId') {
          updatedFields['categoryId'] = checked;

          if (!checked) {
            updatedFields['subCategoryId'] = false;
            updatedFields['productTypeIds'] = false;
          }
        }

        if (name === 'subCategoryId') {
          if (selectedFields.categoryId) {
            updatedFields['subCategoryId'] = checked;

            if (!checked) {
              updatedFields['productTypeIds'] = false;
            }
          } else {
            updatedFields['subCategoryId'] = false;
          }
        }

        if (name === 'productTypeIds') {
          if (selectedFields.categoryId && selectedFields.subCategoryId) {
            updatedFields['productTypeIds'] = checked;
          } else {
            updatedFields['productTypeIds'] = false;
          }
        } else {
          updatedFields[name] = checked;
        }

        return updatedFields;
      });
    },
    [selectedFields]
  );

  const onSubmit = useCallback(
    async (val) => {
      const payload = {
        ...productInitDetails,
        productName: val?.productName,
        sku: val?.sku,
        saltSKU: val?.saltSKU,
        active: true,
      };
      fieldKeys.forEach((field) => {
        if (selectedFields[field]) {
          payload[field] = selectedProduct[field];
        }
      });
      dispatch(setSelectedProduct(payload));
      dispatch(setIsDuplicateProduct(true));
      navigate(`/product/add`);
      setOpen(false);
    },
    [selectedFields, selectedProduct]
  );
  const randomNumber = useMemo(() => helperFunctions.getRandomNumberLimitedDigits(), []);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      productName: selectedProduct.productName + ' copy',
      sku: selectedProduct.sku + '-copy',
      saltSKU: `UJ-${selectedProduct.sku}-copy-${randomNumber}`,
    },
  });

  const skuChangeHandler = useCallback(
    (val) => {
      const lastDigits = randomNumber;
      setFieldValue('sku', val);
      const saltSKU = val ? `UJ-${val}-${lastDigits}` : '';
      setFieldValue('saltSKU', saltSKU);
    },
    [randomNumber]
  );

  return (
    <Dialog open={open} handleOpen={() => setOpen(true)} handleClose={() => setOpen(false)}>
      <StyledDialogTitle>Duplicate Product</StyledDialogTitle>
      <StyledDialogContent>
        <TextField
          sx={{
            my: 2,
            width: '100%',
          }}
          name="productName"
          onBlur={handleBlur}
          label="Product Name"
          onChange={handleChange}
          value={values.productName}
          error={!!(touched.productName && errors.productName)}
          helperText={touched.productName && errors.productName ? errors.productName : ''}
        />
        <TextField
          sx={{
            my: 2,
            width: '100%',
          }}
          name="sku"
          onBlur={handleBlur}
          label="SKU"
          onChange={(e) => skuChangeHandler(e.target.value)}
          value={values.sku}
          error={!!(touched.sku && errors.sku)}
          helperText={touched.sku && errors.sku ? errors.sku : ''}
        />
        {values.sku ? (
          <Typography color="textSecondary" sx={{ fontSize: '0.875rem', marginBottom: '5px' }}>
            <strong>salt SKU :</strong> {values.saltSKU}
          </Typography>
        ) : null}
        <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '16px' }}>
          Select Category to enable Subcategory, and select both Category and Subcategory to enable
          Product Type.
        </p>

        {fieldKeys
          .filter((field) => selectedProduct[field] !== undefined) // Only show checkboxes for fields present in selectedProduct
          .map((field) => (
            <FormControlLabel
              key={field}
              label={fieldLabels[field]}
              control={
                <Checkbox
                  name={field}
                  checked={selectedFields[field]}
                  onChange={handleCheckboxChange}
                  disabled={
                    (field === 'subCategoryId' && !selectedFields.categoryId) ||
                    (field === 'productTypeIds' &&
                      !(selectedFields.categoryId && selectedFields.subCategoryId))
                  }
                />
              }
            />
          ))}
      </StyledDialogContent>
      <StyledDialogActions>
        <Button variant="outlined" disabled={loading} onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <LoadingButton variant="contained" onClick={handleSubmit} loading={loading}>
          Duplicate
        </LoadingButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default memo(DuplicateProductDialog);
