import React, { memo, useCallback } from 'react';
import {
  Autocomplete,
  Checkbox,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ClearIcon from '@mui/icons-material/Clear';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

// Carat weight options from 1.5 to 7 in increments of 0.5
const CARAT_WEIGHT_OPTIONS = Array.from({ length: 12 }, (_, i) => 1.5 + i * 0.5).map((value) => ({
  value: value,
  title: `${value} ct`,
}));

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
            value={
              values?.diamondFilters?.diamondShapeIds?.map((value) => {
                return diamondShapeList.find((option) => option?.id === value) || value;
              }) || []
            }
            getOptionLabel={(option) => option?.title || option}
            onChange={(e, newValue) => {
              const updatedValues = newValue.map((item) =>
                typeof item === 'string' ? item : item?.id
              );
              setFieldValue('diamondFilters.diamondShapeIds', updatedValues);
            }}
            renderOption={(props, option, { selected }) => {
              const isChecked =
                selected || values?.diamondFilters?.diamondShapeIds?.includes(option?.id);
              const handleDiaTypeChange = () => {
                const updatedDiaItems = isChecked
                  ? values?.diamondFilters?.diamondShapeIds?.filter((item) => item !== option?.id)
                  : [...(values?.diamondFilters?.diamondShapeIds || []), option?.id];
                setFieldValue('diamondFilters.diamondShapeIds', updatedDiaItems);
              };

              return (
                <li
                  className="cursor-pointer"
                  key={`dia-shapes-${option?.id || option}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDiaTypeChange();
                  }}
                >
                  <Checkbox icon={icon} checked={isChecked} checkedIcon={checkedIcon} readOnly />
                  {option?.title || option}
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
                  label={typeof option === 'string' ? option : option?.title || option}
                  key={`dia-shapes-chip-${option?.id || option}-${index}`}
                />
              ))
            }
          />
        </Grid>
        <Grid xs={6} sm={6} md={3}>
          <TextField
            select
            sx={{ width: '100%' }}
            label="Min Carat Wt"
            name="diamondFilters.caratWeightRange.min"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values?.diamondFilters?.caratWeightRange?.min || ''}
            error={
              touched?.diamondFilters?.caratWeightRange?.min &&
              Boolean(errors?.diamondFilters?.caratWeightRange?.min)
            }
            helperText={
              touched?.diamondFilters?.caratWeightRange?.min &&
              errors?.diamondFilters?.caratWeightRange?.min
            }
            InputProps={{
              endAdornment: values?.diamondFilters?.caratWeightRange?.min && (
                <InputAdornment position="end" sx={{ marginRight: '24px' }}>
                  <IconButton
                    aria-label="clear min carat weight"
                    onClick={() =>
                      handleChange({
                        target: { name: 'diamondFilters.caratWeightRange.min', value: '' },
                      })
                    }
                    edge="end"
                  >
                    <ClearIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            {CARAT_WEIGHT_OPTIONS?.length > 0 ? (
              CARAT_WEIGHT_OPTIONS.map((option) => (
                <MenuItem key={`min-carat-${option.value}`} value={option.value}>
                  {option.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Item</MenuItem>
            )}
          </TextField>
        </Grid>
        <Grid xs={6} sm={6} md={3}>
          <TextField
            select
            sx={{ width: '100%' }}
            label="Max Carat Wt"
            name="diamondFilters.caratWeightRange.max"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values?.diamondFilters?.caratWeightRange?.max || ''}
            error={
              touched?.diamondFilters?.caratWeightRange?.max &&
              Boolean(errors?.diamondFilters?.caratWeightRange?.max)
            }
            helperText={
              touched?.diamondFilters?.caratWeightRange?.max &&
              errors?.diamondFilters?.caratWeightRange?.max
            }
            InputProps={{
              endAdornment: values?.diamondFilters?.caratWeightRange?.max && (
                <InputAdornment position="end" sx={{ marginRight: '24px' }}>
                  <IconButton
                    aria-label="clear max carat weight"
                    onClick={() =>
                      handleChange({
                        target: { name: 'diamondFilters.caratWeightRange.max', value: '' },
                      })
                    }
                    edge="end"
                  >
                    <ClearIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          >
            {CARAT_WEIGHT_OPTIONS?.length > 0 ? (
              CARAT_WEIGHT_OPTIONS.map((option) => (
                <MenuItem key={`max-carat-${option.value}`} value={option.value}>
                  {option.title}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No Item</MenuItem>
            )}
          </TextField>
        </Grid>
      </Grid>
    </>
  );
});

export default DiamondFilters;
