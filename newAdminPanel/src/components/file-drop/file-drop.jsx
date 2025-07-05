import _ from 'lodash';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { forwardRef, useCallback } from 'react';

import { Box, FormHelperText, Link, Paper, Stack, Typography, alpha } from '@mui/material';

import { grey } from 'src/theme/palette';

import Iconify from '../iconify';
import filesFolder from '../../../public/assets/illustrations/files.svg';
import PdfViewer from '../pdf-viewer';

// ----------------------------------------------------------------------

const imageReg = /image\/(png|jpg|jpeg|webp)/;
const pdfOrimageReg = /application\/pdf|(image\/(png|jpg|jpeg|webp))/;
const pdfReg = /application\/pdf/;
const imageTypes = '.png, .jpg, .jpeg, .webp';
const videoReg = /video\/(mp4|webm|ogg)/;
const videoTypes = '.mp4, .webm, .ogg';
// const TENMB = 10485760;
const HUNDRED_MB = 104857600;
const FIVEMB = 5242880;

const getRegexByMediaType = (type) => {
  switch (type) {
    case 'pdf':
      return pdfReg;
    case 'pdf&image':
      return pdfOrimageReg;
    case 'video':
      return videoReg;
    case 'image':
      return imageReg;

    default:
      return imageReg;
  }
};

// ----------------------------------------------------------------------

/**
 *
 * @alias Media Types
 *
 * @description
 * USE MEDIATYPE "VIDEO" FOR VIDEO UPLOAD, FOR IMAGE YOU DON'T NEED TO ADD MEDIATYPE
 *
 */

// ----------------------------------------------------------------------

const FileDrop = forwardRef(
  ({ formik, mediaType, fileKey, previewKey, deleteKey, mediaLimit, loading, productId }, ref) => {
    const onDrop = useCallback(
      (acceptedFiles) => {
        let lengthPreview = formik.values?.[previewKey]?.length;

        if (
          acceptedFiles?.length + lengthPreview > mediaLimit ||
          acceptedFiles?.length > mediaLimit
        ) {
          toast.error(
            `Maximum ${mediaType === 'video' ? 'video' : 'image'} limit is ${mediaLimit}`
          );
          return;
        }

        if (acceptedFiles?.length) {
          let files = acceptedFiles?.slice(0, mediaLimit);
          files = _.clone(files);
          // Validate the selected images.
          for (const file of files) {
            // Validate the image pattern.
            if (!file.type.match(getRegexByMediaType(mediaType))) {
              toast.error(
                `Invalid File! (Only ${mediaType === 'video' ? 'MP4, WEBM, OGG' : 'PNG, JPG, JPEG, WEBP'} files are allowed!)`
              );
              return;
            }

            //FIX BUG HERE
            // Validate the image size.
            if (file.size > (mediaType === 'video' ? HUNDRED_MB : FIVEMB)) {
              // size in bytes
              toast.error(
                `Invalid Size! (Only ${mediaType === 'video' ? 100 : 5} MB are allowed!)`
              );
              return;
            }
          }

          const promises = [];
          for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            promises.push(
              new Promise((resolve) => {
                reader.onloadend = () => {
                  if (mediaType === 'pdf&image') {
                    resolve({
                      type: 'new',
                      mimeType: file.type,
                      image: reader.result,
                    });
                  } else {
                    resolve({
                      type: 'new',
                      image: reader.result,
                    });
                  }
                };
              })
            );
          }

          Promise.all(promises).then((base64) => {
            let imageFiles = _.clone(formik.values?.[fileKey]);
            let previewFiles = _.clone(formik.values?.[previewKey]);

            imageFiles = imageFiles?.length ? [...imageFiles, ...files] : files;
            previewFiles = previewFiles?.length ? [...previewFiles, ...base64] : base64;

            let slicedLimitWise = imageFiles?.slice(0, mediaLimit);
            let slicedLimitWisePreview = previewFiles?.slice(0, mediaLimit);

            const values = {
              ...formik.values,
              [fileKey]: slicedLimitWise,
              [previewKey]: slicedLimitWisePreview,
            };

            formik.setValues(values);
          });
        }
      },
      [formik, mediaLimit]
    );

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
      onDrop,
    });

    // const onRemove = useCallback(
    //   (item, index) => {
    //     let list = _.clone(formik.values?.[fileKey]);
    //     let previewList = _.clone(formik.values?.[previewKey]);
    //     if (index >= 0) {
    //       list?.splice(index, 1);
    //       previewList?.splice(index, 1);

    //       formik.setFieldValue(fileKey, list);
    //       formik.setFieldValue(previewKey, previewList);

    //       //--------------------------------------------------------------------
    //       if (item.type === 'new') {
    //         if (formik.values?.[fileKey]) {
    //           formik.values?.[fileKey]?.splice(index, 1);
    //           formik.setFieldValue([fileKey], [...formik.values?.[fileKey]]);
    //         }

    //         if (formik.values?.[previewKey]) {
    //           formik.values?.[previewKey]?.splice(index, 1);
    //           formik.setFieldValue([previewKey], [...formik.values?.[previewKey]]);
    //         }
    //       } else if (productId && item.type === 'old') {
    //         const deletedImage = formik.values?.[previewKey]?.splice(index, 1);
    //         formik.setFieldValue([previewKey], [...formik.values?.[previewKey]]);
    //         formik.setFieldValue([deleteKey], [...formik.values?.[deleteKey], ...deletedImage]);
    //       }
    //     }
    //   },
    //   [formik, productId]
    // );

    const onRemove = useCallback(
      (item, index) => {
        // Clone the arrays
        let list = _.clone(formik.values?.[fileKey] || []);
        let previewList = _.clone(formik.values?.[previewKey] || []);

        if (index >= 0) {
          // Capture the item to be deleted before removing it
          const deletedItem = previewList[index]; // This is correct

          // Remove the item at the specified index
          list?.splice(index, 1);
          previewList?.splice(index, 1);

          // Update Formik state
          formik.setFieldValue(fileKey, list);
          formik.setFieldValue(previewKey, previewList);

          // Handle deletion for existing items (type === 'old')
          if (item.type === 'old' && productId && deleteKey) {
            formik.setFieldValue(deleteKey, [...(formik.values?.[deleteKey] || []), deletedItem]);
          }
        }
      },
      [formik, fileKey, previewKey, deleteKey, productId]
    );

    const browseLink = (
      <Link
        color="inherit"
        variant="subtitle2"
        sx={{
          color: 'primary.main',
          textDecoration: 'underline',
        }}
      >
        browse
      </Link>
    );

    const renderErrors =
      formik.touched?.[previewKey] && formik.errors?.[previewKey] ? (
        <FormHelperText sx={{ color: 'error.main', p: 1 }}>
          {formik.errors[previewKey]}
        </FormHelperText>
      ) : null;

    return (
      <>
        <Stack sx={{ p: 0.4 }}>
          <Box
            {...getRootProps({ className: 'dropzone' })}
            sx={{ pointerEvents: loading ? 'none' : '' }}
          >
            <input
              type="file"
              disabled={loading}
              {...getInputProps()}
              name={fileKey}
              label={fileKey}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              accept={mediaType === 'video' ? videoTypes : imageTypes}
            />

            <Paper
              variant="outlined"
              sx={{
                py: 2.5,
                cursor: 'pointer',
                textAlign: 'center',
                borderStyle: 'dashed',
                borderColor: isDragActive
                  ? 'primary.light'
                  : formik.touched?.[previewKey] && formik.errors?.[previewKey]
                    ? 'error.main'
                    : '',
                backgroundColor: isDragActive
                  ? 'primary.light'
                  : formik.touched?.[previewKey] && formik.errors?.[previewKey]
                    ? '#FFF5F2'
                    : grey[100],
                ':hover': { opacity: 0.8, transition: 'all 0.5s ease' },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  width: '200px',
                  objectFit: 'contain',
                }}
                component="img"
                src={filesFolder}
                alt={'Files Folder Drop'}
              />

              <Typography
                variant="subtitle1"
                sx={{
                  px: 2,
                  mt: 2,
                  fontWeight: 700,
                  color:
                    formik.touched?.[previewKey] && formik.errors?.[previewKey]
                      ? 'error.main'
                      : 'text.primary',
                }}
              >
                Drop or Select File
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, mt: 1 }}>
                Drop files here or click {browseLink} thorough your machine
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', px: 2, fontWeight: 600 }}
              >
                (Max Limit: {mediaLimit})
              </Typography>
            </Paper>

            {renderErrors}
          </Box>
          <Stack
            sx={{
              py: formik.values?.[previewKey]?.length ? 1 : 0,
              gap: 0.8,
              flexWrap: 'wrap',
              flexDirection: 'row',
            }}
          >
            {formik.values?.[previewKey]?.map((x, i) =>
              x?.mimeType?.includes('pdf') ? (
                <Box sx={{ position: 'relative', width: '100%' }} key={`filedrop-${i}`}>
                  <PdfViewer pdf={x?.image} />
                  <Iconify
                    icon="ep:circle-close-filled"
                    sx={{
                      top: 1,
                      right: 1,
                      width: 25,
                      height: 25,
                      opacity: 0.5,
                      position: 'absolute',
                      color: 'text.secondary',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      ':hover': { opacity: 1, transition: 'all 0.2s ease' },
                    }}
                    onClick={() => {
                      if (!loading) onRemove(x, i);
                    }}
                  />
                </Box>
              ) : (
                <Stack
                  sx={{
                    p: 0,
                    gap: 0,
                    overflow: 'hidden',
                    borderRadius: '10px',
                    position: 'relative',
                    justifyContent: 'center',
                    border: `1px solid ${alpha(grey[600], 0.16)}`,
                    width: mediaType === 'video' ? '300px' : '85px',
                    height: mediaType === 'video' ? '160px' : '85px',
                  }}
                  key={`filedrop-${i}`}
                >
                  <Box
                    muted
                    src={x?.mimeType?.includes('video') ? x?.video : x?.image}
                    autoPlay={mediaType === 'video'}
                    component={mediaType === 'video' ? 'video' : 'img'}
                    loop={x?.mimeType?.includes('video') ? true : false}
                    sx={{
                      p: 0.2,
                      width: '100%',
                      height: '100%',
                      overflow: 'hidden',
                      borderRadius: '10px',
                      objectFit: mediaType === 'video' ? 'cover' : 'contain',
                    }}
                    alt={`Preview ${mediaType === 'video' ? 'video' : 'img'} ${i}`}
                  />
                  <Iconify
                    icon="ep:circle-close-filled"
                    sx={{
                      top: 1,
                      right: 1,
                      width: 25,
                      height: 25,
                      opacity: 0.5,
                      position: 'absolute',
                      color: 'text.secondary',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      ':hover': { opacity: 1, transition: 'all 0.2s ease' },
                    }}
                    onClick={() => {
                      if (!loading) onRemove(x, i);
                    }}
                  />
                </Stack>
              )
            )}
          </Stack>
        </Stack>
      </>
    );
  }
);

export default FileDrop;
