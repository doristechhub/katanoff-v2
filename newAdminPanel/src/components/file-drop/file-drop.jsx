import _ from 'lodash';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { forwardRef, useCallback } from 'react';

import { Box, FormHelperText, Link, Paper, Stack, Typography, alpha } from '@mui/material';

import { grey } from 'src/theme/palette';

import Iconify from '../iconify';
import filesFolder from '../../../public/assets/illustrations/files.svg';
import PdfViewer from '../pdf-viewer';
import fileSettings from 'src/_utils/fileSettings';

// ----------------------------------------------------------------------

const imageReg = /image\/(png|jpg|jpeg|webp)/;
const pdfOrimageReg = /application\/pdf|(image\/(png|jpg|jpeg|webp))/;
const pdfReg = /application\/pdf/;
const videoReg = /video\/(mp4|webm|ogg)/;
const imageTypes = '.png, .jpg, .jpeg, .webp';
const videoTypes = '.mp4, .webm, .ogg';

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

const getAcceptObject = (mediaType) => {
  switch (mediaType) {
    case 'video':
      return { 'video/*': ['.mp4', '.webm', '.ogg'] };

    case 'pdf':
      return { 'application/pdf': ['.pdf'] };

    case 'pdf&image':
      return {
        'application/pdf': ['.pdf'],
        'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      };

    case 'image':
    default:
      return { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] };
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
  (
    {
      formik,
      mediaType,
      fileKey,
      previewKey,
      deleteKey,
      mediaLimit,
      loading,
      productId,
      // Style Props
      filesFolderSx,
    },
    ref
  ) => {
    // Safely read/write nested Formik values (supports mediaMapping[0].imageFiles)
    const getValue = (path) => _.get(formik.values, path);
    const getError = (path) => _.get(formik.errors, path);
    const getTouched = (path) => _.get(formik.touched, path);
    const setValue = (path, value) => formik.setFieldValue(path, value);

    const onDrop = useCallback(
      (acceptedFiles) => {
        const currentFiles = getValue(fileKey) || [];
        const currentPreviews = getValue(previewKey) || [];

        if (
          acceptedFiles.length + currentPreviews.length > mediaLimit ||
          acceptedFiles.length > mediaLimit
        ) {
          toast.error(`Maximum ${mediaLimit} ${mediaType === 'video' ? 'video' : 'image'} allowed`);
          return;
        }

        // Validate type & size
        for (const file of acceptedFiles) {
          if (!file.type.match(getRegexByMediaType(mediaType))) {
            toast.error(
              `Only ${mediaType === 'video' ? 'MP4, WEBM, OGG' : 'PNG, JPG, JPEG, WEBP'} files allowed!`
            );
            return;
          }
          const maxSize =
            mediaType === 'video'
              ? fileSettings?.VIDEO_ALLOW_FILE_SIZE
              : fileSettings?.IMAGE_ALLOW_FILE_SIZE;

          if (file.size > maxSize) {
            toast.error(`File too large! Max ${mediaType === 'video' ? '10MB' : '2MB'} allowed`);
            return;
          }
        }

        // Convert to base64
        const promises = acceptedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  type: 'new',
                  image: reader.result,
                  ...(mediaType === 'pdf&image' && { mimeType: file.type }),
                });
              };
              reader.readAsDataURL(file);
            })
        );

        Promise.all(promises).then((newPreviews) => {
          const updatedFiles = [...currentFiles, ...acceptedFiles].slice(0, mediaLimit);
          const updatedPreviews = [...currentPreviews, ...newPreviews].slice(0, mediaLimit);

          setValue(fileKey, updatedFiles);
          setValue(previewKey, updatedPreviews);
        });
      },
      [fileKey, previewKey, mediaLimit, mediaType, formik]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: getAcceptObject(mediaType),
      multiple: mediaLimit > 1,
      disabled: loading,
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
        const files = getValue(fileKey) || [];
        const previews = getValue(previewKey) || [];
        const deleted = getValue(deleteKey) || [];

        const removedPreview = previews[index];

        const newFiles = files.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        setValue(fileKey, newFiles);
        setValue(previewKey, newPreviews);

        // If it's an existing uploaded file (type: 'old'), mark for deletion
        if (removedPreview?.type === 'old' && productId && deleteKey) {
          setValue(deleteKey, [...deleted, removedPreview]);
        }
      },
      [fileKey, previewKey, deleteKey, productId, formik]
    );

    const previews = getValue(previewKey) || [];

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
      getTouched(previewKey) && getError(previewKey) ? (
        <FormHelperText sx={{ color: 'error.main', p: 1 }}>{getError(previewKey)}</FormHelperText>
      ) : null;

    return (
      <Stack sx={{ p: 0.4 }}>
        <Box {...getRootProps()} sx={{ pointerEvents: loading ? 'none' : 'auto' }}>
          <input
            {...getInputProps()}
            disabled={loading}
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
                : getTouched(previewKey) && getError(previewKey)
                  ? 'error.main'
                  : '',
              backgroundColor: isDragActive
                ? 'primary.light'
                : getTouched(previewKey) && getError(previewKey)
                  ? '#FFF5F2'
                  : grey[100],
              ':hover': { opacity: 0.8, transition: 'all 0.5s ease' },
            }}
          >
            <Box
              component="img"
              src={filesFolder}
              sx={{ p: 1, width: '200px', objectFit: 'contain', ...filesFolderSx }}
              alt={'Files Folder Drop'}
            />
            <Typography
              variant="subtitle1"
              sx={{
                px: 2,
                mt: 2,
                fontWeight: 700,
                color:
                  getTouched(previewKey) && getError(previewKey) ? 'error.main' : 'text.primary',
              }}
            >
              Drop or Select File
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', px: 2, mt: 1 }}>
              Drop files here or click {browseLink} your machine
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', px: 2, fontWeight: 600 }}>
              (Max Limit: {mediaLimit})
            </Typography>
          </Paper>
        </Box>

        {renderErrors}

        <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
          {previews.map((item, i) => (
            <Box key={i} sx={{ position: 'relative' }}>
              {item.mimeType?.includes('pdf') ? (
                <PdfViewer pdf={item.image} />
              ) : (
                <Box
                  component={mediaType === 'video' ? 'video' : 'img'}
                  src={item?.mimeType?.includes('video') ? item?.video : item?.image}
                  autoPlay={mediaType === 'video'}
                  controls={mediaType === 'video'}
                  loop={mediaType === 'video'}
                  muted={mediaType === 'video'}
                  sx={{
                    p: 0.2,
                    width: mediaType === 'video' ? '300px' : '85px',
                    height: mediaType === 'video' ? '160px' : '85px',
                    border: `1px solid ${alpha(grey[600], 0.16)}`,
                    overflow: 'hidden',
                    borderRadius: '10px',
                    objectFit: mediaType === 'video' ? 'cover' : 'contain',
                  }}
                  alt={`Preview ${mediaType === 'video' ? 'video' : 'img'} ${i}`}
                />
              )}

              <Iconify
                icon="ep:circle-close-filled"
                onClick={() => !loading && onRemove(item, i)}
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
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    );
  }
);

export default FileDrop;
