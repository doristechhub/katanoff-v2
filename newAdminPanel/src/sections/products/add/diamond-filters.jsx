import React, { memo, useCallback } from 'react';

import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import {
  ALLOWED_DIA_CERTIFICATES,
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  ALLOWED_DIA_CUTS,
  ALLOWED_DIA_FLUORESCENCE,
  ALLOWED_DIA_POLISH,
  ALLOWED_DIA_SYMMETRIES,
  ALLOWED_DIA_TYPES,
  ALLOWED_SHAPES,
} from 'src/_helpers/constants';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// ----------------------------------------------------------------------

const DiamondFilters = memo(({ formik }) => {
  const { diamondShapeList } = useSelector(({ diamondShape }) => diamondShape);

  const { handleBlur, handleChange, values, errors, touched, setFieldValue } = formik;

  const handlePositivePriceChange = useCallback((e, handleChange) => {
    const value = e.target.value;
    if (value === '' || value >= 0) {
      handleChange(e);
    }
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} sm={6} md={6}>
          <Autocomplete
            multiple
            freeSolo
            name="diamondFilters.diamondShapeIds"
            options={diamondShapeList}
            value={values?.diamondFilters?.diamondShapeIds?.map(
              (value) => diamondShapeList.find((option) => option?.id === value) || {}
            )}
            getOptionLabel={(option) => option?.title || option}
            onChange={(e, newValue) => {
              const updatedValues = newValue.map((item) => item?.id || item);
              setFieldValue('diamondFilters.diamondShapeIds', updatedValues);
            }}
            renderOption={(props, option, index) => {
              const isChecked = values?.diamondFilters?.diamondShapeIds?.includes(option?.id);
              const handleDiaTypeChange = () => {
                const updatedDiaItems = isChecked
                  ? values?.diamondFilters?.diamondShapeIds?.filter((item) => item !== option?.id)
                  : [...values?.diamondFilters?.diamondShapeIds, option?.id];
                setFieldValue('diamondFilters.diamondShapeIds', updatedDiaItems);
              };

              return (
                <li
                  className="cursor-pointer"
                  key={`dia-shapes-${option?.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDiaTypeChange();
                  }}
                >
                  <Checkbox icon={icon} checked={isChecked} checkedIcon={checkedIcon} readOnly />
                  {option?.title}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Dia Shapes"
                placeholder="Dia Shapes"
                onBlur={handleBlur}
                error={
                  !!(
                    touched?.diamondFilters?.diamondShapeIds &&
                    errors?.diamondFilters?.diamondShapeIds
                  )
                }
                helperText={
                  touched?.diamondFilters?.diamondShapeIds &&
                  errors?.diamondFilters?.diamondShapeIds
                }
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue?.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  label={option?.title || option}
                  key={`dia-shapes-chip-${option?.id}`}
                />
              ))
            }
          />
        </Grid>
        <Grid xs={6} sm={6} md={3}>
          <TextField
            min={0}
            type="number"
            name="diamondFilters.caratWeightRange.min"
            onBlur={handleBlur}
            onChange={(e) => handlePositivePriceChange(e, handleChange)}
            label="Min Carat Wt"
            value={values?.diamondFilters?.caratWeightRange?.min}
            error={
              touched?.diamondFilters?.caratWeightRange?.min &&
              Boolean(errors?.diamondFilters?.caratWeightRange?.min)
            }
            helperText={
              touched?.diamondFilters?.caratWeightRange?.min &&
              errors?.diamondFilters?.caratWeightRange?.min
            }
            sx={{
              width: '100%',
            }}
          />
        </Grid>
        <Grid xs={6} sm={6} md={3}>
          <TextField
            min={0}
            type="number"
            name="diamondFilters.caratWeightRange.max"
            onBlur={handleBlur}
            onChange={(e) => handlePositivePriceChange(e, handleChange)}
            label="Max Carat Wt"
            value={values?.diamondFilters?.caratWeightRange?.max}
            error={
              touched?.diamondFilters?.caratWeightRange?.max &&
              Boolean(errors?.diamondFilters?.caratWeightRange?.max)
            }
            helperText={
              touched?.diamondFilters?.caratWeightRange?.max &&
              errors?.diamondFilters?.caratWeightRange?.max
            }
            sx={{
              width: '100%',
            }}
          />
        </Grid>
      </Grid>
    </>
  );
});

export default DiamondFilters;
