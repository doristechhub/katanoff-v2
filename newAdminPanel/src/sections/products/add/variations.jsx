import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FieldArray, getIn } from 'formik';
import React, { memo, useCallback, useState } from 'react';

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import Iconify from 'src/components/iconify';
import { helperFunctions } from 'src/_helpers';
import { Button } from 'src/components/button';
import { error, primary } from 'src/theme/palette';

import VariantionTypes from './variations-types';
import VariationTableRow from './variation-table-row';
import VariationTableHead from './variation-table-head';
import { productInitDetails } from 'src/store/slices/productSlice';

// ----------------------------------------------------------------------

const Variations = memo(({ formik }) => {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const { handleBlur, values, errors, touched, setFieldValue } = formik;
  const { customizationTypesList, customizationSubTypesList } = useSelector(
    ({ product }) => product
  );

  const variationChangeHandler = useCallback(
    (variationId, index) => {
      setFieldValue(`variations.${index}.variationId`, variationId);
      const customizationTypeWiseCustomizationSubTypes = customizationSubTypesList.filter(
        (customization) => customization.customizationTypeId === variationId
      );
      setFieldValue(`variations.${index}.subTypes`, customizationTypeWiseCustomizationSubTypes);
      setFieldValue(
        `variations.${index}.variationTypes`,
        productInitDetails?.variations?.[0]?.variationTypes
      );
    },
    [customizationSubTypesList, values, productInitDetails]
  );

  const addVariationsHandler = useCallback(
    (push) => {
      let variationsAdded = values?.variations;
      if (variationsAdded?.length === customizationTypesList?.length) {
        return;
      }

      // Check if all of the fields in the field array are filled
      const checkVariationTypesFilled = (variationTypes) => {
        return variationTypes.filter((variType) => !variType.variationTypeId).length;
      };
      const areAllFieldsFilled = values?.variations.filter(
        (variItem) => !variItem.variationId || checkVariationTypesFilled(variItem.variationTypes)
      );
      // If all of the fields in the field array are filled, push a new value into the field array
      if (!areAllFieldsFilled?.length) {
        push(productInitDetails?.variations?.[0]);
      } else {
        toast.error('please fill all variations value');
      }
    },
    [customizationTypesList, values, productInitDetails]
  );

  return (
    <>
      <FieldArray name="variations">
        {({ remove, push }) => (
          <>
            {values?.variations?.length > 0 ? (
              values?.variations?.map((_, index) => (
                <Grid
                  key={index}
                  container
                  spacing={2}
                  sx={{
                    marginTop: '0 !important',
                  }}
                >
                  <Grid xs={12} sm={12} md={12}>
                    <TextField
                      select
                      size="small"
                      sx={{
                        width: '100%',
                      }}
                      onBlur={handleBlur}
                      label="Variation Name"
                      name={`variations.${index}.variationId`}
                      value={values?.variations[index].variationId}
                      onChange={(event) => {
                        variationChangeHandler(event.target.value, index);
                      }}
                      error={
                        !!(
                          getIn(errors, `variations.${index}.variationId`) &&
                          getIn(touched, `variations.${index}.variationId`)
                        )
                      }
                      helperText={
                        getIn(errors, `variations.${index}.variationId`) &&
                        getIn(touched, `variations.${index}.variationId`)
                          ? getIn(errors, `variations.${index}.variationId`)
                          : ''
                      }
                    >
                      {customizationTypesList?.length > 0 ? (
                        customizationTypesList?.map((item) => {
                          // Check if the item is not already selected in another variation
                          const isAlreadySelected = values?.variations?.some(
                            (vari) => vari.variationId === item.id
                          );
                          // Render the item only if it's not already selected
                          return (
                            <MenuItem key={item?.id} value={item?.id} disabled={isAlreadySelected}>
                              {item?.title}
                            </MenuItem>
                          );
                        })
                      ) : (
                        <MenuItem disabled>No Item</MenuItem>
                      )}
                    </TextField>
                  </Grid>
                  <VariantionTypes index={index} formik={formik} />
                  <Grid xs={12} sm={12} md={12}>
                    <Stack direction={'row'} justifyContent={'end'} alignItems={'center'} gap={2}>
                      <Button
                        size="small"
                        onClick={() => remove(index)}
                        disabled={values?.variations?.length === 1}
                        startIcon={
                          <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
                        }
                        sx={{
                          width: 'fit-content',
                          border: `none !important`,
                          color: `${error?.main} !important`,
                          backgroundColor: `transparent !important`,
                          ':disabled': {
                            opacity: 0.7,
                          },
                          ':hover': {
                            backgroundColor: `${error?.lighter} !important`,
                            border: `none !important`,
                            boxShadow: 'none !important',
                          },
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Typography variant="caption" sx={{ color: 'error.main' }}>
                Variation is required
              </Typography>
            )}
            <Stack
              sx={{ my: 1 }}
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Button
                sx={{
                  width: 'fit-content',
                  border: `none !important`,
                  color: `${primary?.main} !important`,
                  backgroundColor: `transparent !important`,
                  ':hover': {
                    border: `none !important`,
                    boxShadow: 'none !important',
                    backgroundColor: `${primary?.lighter} !important`,
                  },
                  ':disabled': {
                    opacity: 0.7,
                  },
                }}
                onClick={() => addVariationsHandler(push)}
                startIcon={<Iconify icon="lucide:circle-plus" />}
                disabled={values?.variations?.length === customizationTypesList?.length}
              >
                Add Variation
              </Button>
              <Button
                variant="contained"
                onClick={() => setOpenPreviewDialog(true)}
                disabled={!values?.variations?.[0]?.variationTypes?.[0]?.variationTypeId}
              >
                Preview
              </Button>
            </Stack>
          </>
        )}
      </FieldArray>

      {openPreviewDialog && (
        <Dialog
          fullWidth
          maxWidth={'md'}
          open={openPreviewDialog}
          handleOpen={() => setOpenPreviewDialog(true)}
          handleClose={() => setOpenPreviewDialog(false)}
        >
          <StyledDialogTitle>Preview Variations</StyledDialogTitle>
          <StyledDialogContent>
            <PreviewTable values={values} />
          </StyledDialogContent>
          <StyledDialogActions>
            <Button onClick={() => setOpenPreviewDialog(false)} variant="contained">
              Close
            </Button>
          </StyledDialogActions>
        </Dialog>
      )}
    </>
  );
});

export default Variations;

const PreviewTable = memo(({ values }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');

  const { customizationTypesList, customizationSubTypesList } = useSelector(
    ({ product }) => product
  );

  const handleSort = (_, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const customizations = {
    customizationType: customizationTypesList,
    customizationSubType: customizationSubTypesList,
  };
  const variationList = helperFunctions?.getVariationsArray(values.variations, customizations);

  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Table>
        <VariationTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleSort}
          headLabel={[
            { id: 'sr', label: 'Sr No.' },
            { id: 'variation', label: 'Variation Name' },
            { id: 'variationTypes', label: 'Variation Types' },
          ]}
        />
        <TableBody>
          {variationList?.map((row, i) => (
            <VariationTableRow key={i} srNo={Number(i + 1)} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
