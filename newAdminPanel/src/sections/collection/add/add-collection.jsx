import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Card, Container, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  createCollection,
  getSingleCollection,
  updateCollection,
} from 'src/actions/collectionActions';
import { setSelectedCollection, initCollection } from 'src/store/slices/collectionSlice';
import { Button, LoadingButton } from 'src/components/button';
import { FileDrop } from 'src/components/file-drop';

// Validation schema
const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
});

// Component
const AddCollectionPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get('collectionId');
  const { crudCollectionLoading, selectedCollection } = useSelector(({ collection }) => collection);

  const loadData = useCallback(async () => {
    if (collectionId) {
      await dispatch(getSingleCollection(collectionId));
    }
  }, [dispatch, collectionId]);

  useEffect(() => {
    if (collectionId) loadData();
    return () => {
      dispatch(setSelectedCollection(initCollection));
    };
  }, [dispatch, collectionId, loadData]);

  const onSubmit = useCallback(async (values, { resetForm }) => {
    const payload = {
      title: values?.title,
      desktopBannerFile: values?.desktopBannerFile?.[0] || null,
      mobileBannerFile: values?.mobileBannerFile?.[0] || null,
      deletedDesktopBannerImage: values?.desktopBannerUploadedDeletedImage?.[0]?.image || null,
      deletedMobileBannerImage: values?.mobileBannerUploadedDeletedImage?.[0]?.image || null,
    };

    if (values?.id) {
      payload.collectionId = values?.id;
    }

    const action = values?.id ? updateCollection : createCollection;
    const res = await dispatch(action(payload));
    if (res) {
      resetForm();
      navigate('/collection');
    }
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4">
          {collectionId ? 'Update Collection' : 'Create Collection'}
        </Typography>
      </Box>
      <Formik
        enableReinitialize
        onSubmit={onSubmit}
        initialValues={selectedCollection}
        validationSchema={validationSchema}
      >
        {(formik) => {
          const { values, touched, errors, handleBlur, handleChange, handleSubmit } = formik;

          return (
            <Form>
              <Card sx={{ p: 6 }}>
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      name="title"
                      label="Collection Title"
                      value={values?.title || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && !!errors.title}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Desktop Banner (1920x448)
                    </Typography>
                    <FileDrop
                      mediaLimit={1}
                      formik={formik}
                      productId={selectedCollection}
                      fileKey="desktopBannerFile"
                      previewKey="desktopBannerPreviewImage"
                      deleteKey="desktopBannerUploadedDeletedImage"
                      loading={crudCollectionLoading}
                    />
                  </Grid>
                  <Grid xs={12} sm={6} mt={3}>
                    <Typography variant="subtitle2" gutterBottom>
                      Mobile Banner (1500x738)
                    </Typography>
                    <FileDrop
                      mediaLimit={1}
                      formik={formik}
                      productId={selectedCollection}
                      fileKey="mobileBannerFile"
                      previewKey="mobileBannerPreviewImage"
                      deleteKey="mobileBannerUploadedDeletedImage"
                      loading={crudCollectionLoading}
                    />
                  </Grid>
                </Grid>
              </Card>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/collection')}
                  disabled={crudCollectionLoading}
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  onClick={handleSubmit}
                  loading={crudCollectionLoading}
                >
                  {collectionId ? 'Update' : 'Save'}
                </LoadingButton>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default AddCollectionPage;
