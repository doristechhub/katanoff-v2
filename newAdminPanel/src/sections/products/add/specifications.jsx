import { memo } from 'react';
import { FieldArray, getIn } from 'formik';

import Grid from '@mui/material/Unstable_Grid2';
import { Button, Stack, TextField } from '@mui/material';

import Iconify from 'src/components/iconify';
import { error, primary } from 'src/theme/palette';

// ----------------------------------------------------------------------

const addSpecificationHandler = (push, specifications) => {
  const areAllFieldsFilled = specifications?.every((spec) => spec?.title || spec?.description);

  if (areAllFieldsFilled) {
    push({ title: '', description: '' });
  }
};

const Specifications = memo(({ formik }) => {
  const { handleBlur, values, errors, touched, handleChange } = formik;

  return (
    <FieldArray name="specifications">
      {({ remove, push }) => (
        <Grid
          container
          sx={{
            px: 1.5,
            py: 1,
            marginTop: '0 !important',
          }}
        >
          <Grid xs={12} sm={12} md={12}>
            {values?.specifications?.length > 0 &&
              values?.specifications?.map((specItem, index) => (
                <Stack sx={{ mt: 1 }} key={`specification-${index}`}>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    label="Title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    name={`specifications.${index}.title`}
                    value={values?.specifications?.[index]?.title}
                    error={
                      !!(
                        getIn(errors, `specifications.${index}.title`) &&
                        getIn(touched, `specifications.${index}.title`)
                      )
                    }
                    helperText={
                      getIn(errors, `specifications.${index}.title`) &&
                      getIn(touched, `specifications.${index}.title`)
                        ? getIn(errors, `specifications.${index}.title`)
                        : ''
                    }
                  />
                  <TextField
                    sx={{
                      mt: 2,
                      width: '100%',
                    }}
                    rows={4}
                    multiline
                    label="Description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={specItem?.description}
                    name={`specifications.${index}.description`}
                    error={
                      !!(
                        getIn(errors, `specifications.${index}.description`) &&
                        getIn(touched, `specifications.${index}.description`)
                      )
                    }
                    helperText={
                      getIn(errors, `specifications.${index}.description`) &&
                      getIn(touched, `specifications.${index}.description`)
                        ? getIn(errors, `specifications.${index}.description`)
                        : ''
                    }
                  />
                  <Stack
                    sx={{ mt: 1 }}
                    direction={'row'}
                    alignItems={'center'}
                    justifyContent={'end'}
                  >
                    <Button
                      size="small"
                      onClick={() => remove(index)}
                      startIcon={
                        <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
                      }
                      sx={{
                        width: 'fit-content',
                        border: `none !important`,
                        color: `${error?.main} !important`,
                        ':disabled': {
                          opacity: 0.7,
                        },
                        ':hover': {
                          border: `none !important`,
                          boxShadow: 'none !important',
                          backgroundColor: `${error?.lighter} !important`,
                        },
                      }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Stack>
              ))}
            <Grid xs={12} sm={12} md={12}>
              <Button
                sx={{
                  width: 'fit-content',
                  border: `none !important`,
                  color: `${primary?.main} !important`,
                  ':hover': {
                    border: `none !important`,
                    boxShadow: 'none !important',
                    backgroundColor: `${primary?.lighter} !important`,
                  },
                }}
                startIcon={<Iconify icon="lucide:circle-plus" />}
                onClick={() => addSpecificationHandler(push, values?.specifications)}
              >
                Add Specification
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </FieldArray>
  );
});

export default Specifications;
