import { toast } from 'react-toastify';
import { FieldArray, getIn } from 'formik';
import React, { memo, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import { IconButton, TextField } from '@mui/material';

import Iconify from 'src/components/iconify';
import { error, primary } from 'src/theme/palette';
import { productInitDetails } from 'src/store/slices/productSlice';

// ----------------------------------------------------------------------

const VariantionTypes = memo(({ index, formik }) => {
  const { touched, errors, values, handleBlur, handleChange } = formik;

  const addVariationTypesHandler = useCallback(
    (push, variationTypes) => {
      let subTypes = values?.variations?.[index]?.subTypes;
      if (subTypes?.length === values?.variations?.[index]?.variationTypes?.length) {
        return;
      }

      let types = productInitDetails?.variations?.[0]?.variationTypes;

      // Check if all of the fields in the field array are filled
      const areAllFieldsFilled = variationTypes?.filter((type) => !type?.variationTypeId);

      // If all of the fields in the field array are filled, push a new value into the field array
      if (!areAllFieldsFilled.length) {
        push(types?.[0]);
      } else {
        toast.error('please fill all variationsTypes value');
      }
    },
    [productInitDetails, index, values]
  );

  const renderPlusBtn = (i, push) =>
    values?.variations?.[index]?.variationTypes?.length === i + 1 ? (
      <IconButton
        size="small"
        sx={{
          padding: '5px !important',
          minWidth: '30px !important',
          border: `none !important`,
          color: `${primary?.main} !important`,
          ':hover': {
            backgroundColor: `${primary?.lighter} !important`,
            border: `none !important`,
            boxShadow: 'none !important',
          },
          ':disabled': {
            opacity: 0.7,
          },
        }}
        disabled={
          values?.variations?.[index]?.subTypes?.length ===
          values?.variations?.[index]?.variationTypes?.length
        }
        onClick={() => addVariationTypesHandler(push, values?.variations?.[index]?.variationTypes)}
      >
        <Iconify icon="lucide:circle-plus" />
      </IconButton>
    ) : null;

  return (
    <FieldArray name={`variations[${index}].variationTypes`}>
      {({ remove, push }) =>
        values?.variations[index]?.variationTypes?.length > 0
          ? values?.variations[index]?.variationTypes?.map((variType, j) => (
              <React.Fragment key={index + j}>
                <Grid xs={10}>
                  <TextField
                    select
                    size="small"
                    sx={{
                      width: '100%',
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    label="Variation Type Name"
                    name={`variations.${index}.variationTypes.${j}.variationTypeId`}
                    value={values?.variations?.[index]?.variationTypes?.[j]?.variationTypeId}
                    error={
                      !!(
                        getIn(errors, `variations.${index}.variationTypes.${j}.variationTypeId`) &&
                        getIn(touched, `variations.${index}.variationTypes.${j}.variationTypeId`)
                      )
                    }
                    helperText={
                      !!(
                        getIn(errors, `variations.${index}.variationTypes.${j}.variationTypeId`) &&
                        getIn(touched, `variations.${index}.variationTypes.${j}.variationTypeId`)
                      )
                        ? getIn(errors, `variations.${index}.variationTypes.${j}.variationTypeId`)
                        : ''
                    }
                  >
                    {values?.variations?.[index]?.subTypes?.length ? (
                      values?.variations?.[index]?.subTypes?.map((option) => {
                        const isAlreadySelected = values?.variations?.[index]?.variationTypes?.some(
                          (variType) => variType.variationTypeId === option.id
                        );
                        return (
                          <MenuItem
                            key={option?.id}
                            value={option?.id}
                            disabled={isAlreadySelected}
                          >
                            {option?.title}
                          </MenuItem>
                        );
                      })
                    ) : (
                      <MenuItem disabled>No Item</MenuItem>
                    )}
                  </TextField>
                </Grid>
                <Grid xs={2}>
                  <Stack direction={'row'} alignItems={'center'} gap={2}>
                    <Stack direction={'row'}>
                      {renderPlusBtn(j, push)}
                      <IconButton
                        size="small"
                        sx={{
                          padding: '5px !important',
                          minWidth: '30px !important',
                          border: `none !important`,
                          color: `${error?.main} !important`,
                          ':hover': {
                            backgroundColor: `${error?.lighter} !important`,
                            border: `none !important`,
                            boxShadow: 'none !important',
                          },
                          ':disabled': {
                            opacity: 0.7,
                          },
                        }}
                        disabled={values.variations[index].variationTypes.length === 1}
                        onClick={() => {
                          remove(j);
                        }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Grid>
              </React.Fragment>
            ))
          : null
      }
    </FieldArray>
  );
});

export default VariantionTypes;
