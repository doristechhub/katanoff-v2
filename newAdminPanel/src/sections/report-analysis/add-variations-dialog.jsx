import * as Yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { MenuItem, TextField } from '@mui/material';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import { Button } from 'src/components/button';
import { initVariationvalue, setSelectedVariation } from 'src/store/slices/reportAndAnalysisSlice';

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  variationId: Yup.string().required('Variation is required'),
  variationTypeId: Yup.string().required('variation type is required'),
});

// ----------------------------------------------------------------------

const AddVariationsDialog = ({ openAddVariationDialog, setOpenAddVariationDialog }) => {
  const dispatch = useDispatch();
  const [variationWiseVariationTypeList, setVariationWiseVariationTypeList] = useState([]);

  let { selectedVariation } = useSelector(({ reportAndAnalysis }) => reportAndAnalysis);
  const { customizationTypeList, customizationSubTypeList } = useSelector(
    ({ customization }) => customization
  );

  const onSubmit = useCallback(
    (val, { resetForm }) => {
      let list = [...selectedVariation];

      const variationName = customizationTypeList?.find(
        (item) => item.id === val.variationId
      )?.title;
      const variationTypeName = customizationSubTypeList?.find(
        (item) => item.id === val.variationTypeId
      )?.title;
      const payload = {
        variationId: val.variationId,
        variationName: variationName,
        variationTypeId: val.variationTypeId,
        variationTypeName: variationTypeName,
      };
      list.push(payload);
      dispatch(setSelectedVariation(list));
      resetForm();
      setOpenAddVariationDialog(false);
    },
    [selectedVariation]
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    ...other
  } = useFormik({
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    initialValues: initVariationvalue,
  });

  return (
    <>
      {openAddVariationDialog && (
        <Dialog
          fullWidth
          maxWidth={'xs'}
          open={openAddVariationDialog}
          handleOpen={() => setOpenAddVariationDialog(true)}
          handleClose={() => setOpenAddVariationDialog(false)}
        >
          <StyledDialogTitle>Add Variation</StyledDialogTitle>
          <StyledDialogContent>
            <TextField
              select
              sx={{
                mt: 1,
                width: '100%',
              }}
              onBlur={handleBlur}
              name={`variationId`}
              label="Variation Name"
              onChange={(e) => {
                handleChange(e);
                const val = e.target.value;
                setFieldValue('variationTypeId', '');
                const filterdData = customizationSubTypeList?.filter(
                  (item) => item.customizationTypeId === val
                );
                setVariationWiseVariationTypeList(filterdData);
              }}
              value={values?.variationId}
              error={!!(touched.variationId && errors.variationId)}
              helperText={touched.variationId && errors.variationId ? errors.variationId : ''}
            >
              {customizationTypeList?.length > 0 ? (
                customizationTypeList?.map((item) => {
                  return (
                    <MenuItem key={`customize-${item?.id}`} value={item?.id}>
                      {item?.title}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>No Item</MenuItem>
              )}
            </TextField>
            <TextField
              select
              sx={{
                mt: 2,
                width: '100%',
              }}
              onBlur={handleBlur}
              onChange={(e) => {
                const hasInclude = selectedVariation?.find(
                  (x) => x?.variationTypeId === e.target.value
                );
                if (hasInclude) {
                  toast.error('Variation already exists!');
                  return;
                }
                handleChange(e);
              }}
              name={`variationTypeId`}
              label="Variation Type Name"
              value={values?.variationTypeId}
              error={!!(touched.variationTypeId && errors.variationTypeId)}
              helperText={
                touched.variationTypeId && errors.variationTypeId ? errors.variationTypeId : ''
              }
            >
              {variationWiseVariationTypeList?.length > 0 ? (
                variationWiseVariationTypeList?.map((item) => {
                  return (
                    <MenuItem
                      key={`variation-${item?.customizationTypeId}-${item?.id}`}
                      value={item?.id}
                    >
                      {item?.title}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>No Item</MenuItem>
              )}
            </TextField>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button variant="outlined" onClick={() => setOpenAddVariationDialog(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Add
            </Button>
          </StyledDialogActions>
        </Dialog>
      )}
    </>
  );
};

export default memo(AddVariationsDialog);
