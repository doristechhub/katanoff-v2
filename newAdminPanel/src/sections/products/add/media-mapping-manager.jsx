import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  Stack,
  Typography,
  Grid,
  IconButton,
  Box,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { FileDrop } from 'src/components/file-drop';
import { DIAMOND_SHAPE, GOLD_COLOR, helperFunctions } from 'src/_helpers';

const SimpleMediaCard = ({ mediaSet, index, formik, productId, loading, onDelete }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: smDown ? 1 : 1.5,
          bgcolor: 'background.paper',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setOpen((s) => !s)}
      >
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <Typography variant={smDown ? 'subtitle2' : 'subtitle1'}>
            {mediaSet?.goldColor}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {`(${mediaSet.name})`}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          {/* <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onDelete(mediaSet.mediaSetId);
            }}
            size="small"
            color="error"
            sx={{
              padding: '5px !important',
              color: `${error.main} !important`,
              ':hover': {
                backgroundColor: `${error.lighter} !important`,
                boxShadow: 'none !important',
              },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton> */}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((s) => !s);
            }}
          >
            {open ? (
              <ExpandMoreIcon fontSize={smDown ? 'small' : 'medium'} />
            ) : (
              <ChevronRightIcon fontSize={smDown ? 'small' : 'medium'} />
            )}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open}>
        <Box sx={{ p: 1.5, flex: 1 }}>
          {/* Fixed Grid: make top container */}
          <Grid container spacing={0.8}>
            <Grid item xs={12} sm={6} lg={4}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                {mediaSet?.goldColor} Thumbnail
              </Typography>
              <Box sx={{ width: '100%' }}>
                <FileDrop
                  mediaLimit={1}
                  formik={formik}
                  productId={productId}
                  fileKey={`mediaMapping[${index}].thumbnailImageFile`}
                  previewKey={`mediaMapping[${index}].previewThumbnailImage`}
                  deleteKey={`mediaMapping[${index}].deletedThumbnailImage`}
                  loading={loading}
                  filesFolderSx={{ width: '150px' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                {mediaSet?.goldColor} Images
              </Typography>
              <Box sx={{ width: '100%' }}>
                <FileDrop
                  mediaLimit={8}
                  formik={formik}
                  productId={productId}
                  fileKey={`mediaMapping[${index}].imageFiles`}
                  previewKey={`mediaMapping[${index}].previewImages`}
                  deleteKey={`mediaMapping[${index}].deletedImages`}
                  loading={loading}
                  filesFolderSx={{ width: '150px' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} lg={4}>
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                {mediaSet?.goldColor} Video
              </Typography>
              <Box sx={{ width: '100%' }}>
                <FileDrop
                  mediaLimit={1}
                  mediaType="video"
                  formik={formik}
                  productId={productId}
                  fileKey={`mediaMapping[${index}].videoFile`}
                  previewKey={`mediaMapping[${index}].previewVideo`}
                  deleteKey={`mediaMapping[${index}].deleteUploadedVideo`}
                  loading={loading}
                  filesFolderSx={{ width: '150px' }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Card>
  );
};

const MediaMappingManager = ({ formik, productId, loading }) => {
  const { values, setFieldValue } = formik;
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [expandedShapes, setExpandedShapes] = useState({}); // { shape: true/false }

  const { goldColors, allDiamondShapes } = useMemo(() => {
    const goldSet = new Map(); // store {name → id}
    const shapeSet = new Map(); // store {name → id}

    values?.tempVariComboWithQuantity?.forEach((combo) => {
      combo.combination.forEach((c) => {
        // Gold Colors
        if (c.variationName === GOLD_COLOR.title && c.variationTypeName) {
          goldSet.set(c.variationTypeName, c.variationTypeId);
        }

        // Diamond Shapes
        if (c.variationName === DIAMOND_SHAPE.title && c.variationTypeName) {
          shapeSet.set(c.variationTypeName, c.variationTypeId);
        }
      });
    });

    // Convert Map → Sorted Array of objects
    const goldColors = Array.from(goldSet, ([name, id]) => ({ name, id })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const allDiamondShapes = Array.from(shapeSet, ([name, id]) => ({ name, id })).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return { goldColors, allDiamondShapes };
  }, [values.tempVariComboWithQuantity]);

  useEffect(() => {
    if (
      !values?.tempVariComboWithQuantity?.length ||
      goldColors?.length === 0 ||
      allDiamondShapes?.length === 0
    ) {
      setFieldValue('mediaMapping', []);
      return;
    }

    const validMediaSetIds = new Set();

    const newMediaMapping = allDiamondShapes?.flatMap((shape) =>
      goldColors.map((color) => {
        const generatedMediaSetId = helperFunctions.generateMediaSetId([
          { variationTypeId: shape.id },
          { variationTypeId: color.id },
        ]);

        validMediaSetIds.add(generatedMediaSetId);

        const existing = values?.mediaMapping.find((m) => m.mediaSetId === generatedMediaSetId);

        if (existing) return existing;

        return {
          mediaSetId: generatedMediaSetId,
          name: `${shape.name} + ${color.name}`,
          diamondShape: { id: shape.id, name: shape.name },
          goldColor: color.name,
          thumbnailImageFile: [],
          previewThumbnailImage: [],
          deletedThumbnailImage: [],
          imageFiles: [],
          previewImages: [],
          deletedImages: [],
          videoFile: [],
          previewVideo: [],
          deleteUploadedVideo: [],
        };
      })
    );

    // Remove any stale entries not in valid set
    const filtered = newMediaMapping.filter((m) => validMediaSetIds.has(m.mediaSetId));

    if (JSON.stringify(filtered) !== JSON.stringify(values?.mediaMapping)) {
      setFieldValue('mediaMapping', filtered);
    }
  }, [allDiamondShapes, goldColors, values?.tempVariComboWithQuantity, values?.mediaMapping]);

  const handleDeleteSet = (mediaSetId) => {
    setFieldValue(
      'mediaMapping',
      values.mediaMapping.filter((m) => m.mediaSetId !== mediaSetId)
    );
  };

  const groupedByShape = useMemo(() => {
    const groups = {};
    values?.mediaMapping?.forEach((set) => {
      const shape = set.diamondShape.name || 'Unknown';
      if (!groups[shape]) groups[shape] = [];
      groups[shape].push(set);
    });
    return groups;
  }, [values?.mediaMapping]);

  if (goldColors.length === 0 || allDiamondShapes.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
        <Typography color="text.secondary">
          No Gold Color or Diamond Shape variations found.
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Box>
        <Box
          sx={{
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              flex: 1,
              width: '100%',
              textAlign: smDown ? 'left' : 'initial',
              mb: smDown ? 1 : 0,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {`Media Mapping (Gold Color + Diamond Shape)`}
          </Typography>
        </Box>

        {values.mediaMapping.length ? (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Progress: {allDiamondShapes?.length} shapes added
          </Typography>
        ) : null}
      </Box>

      {/* Diamond Shape Groups — simple Accordions */}
      {Object.entries(groupedByShape).map(([shape, sets]) => (
        // unique key on wrapper stack
        <Stack spacing={2} key={shape}>
          <Accordion
            square
            disableGutters
            expanded={!!expandedShapes[shape]}
            onChange={() => setExpandedShapes((p) => ({ ...p, [shape]: !p[shape] }))}
            sx={{
              borderRadius: 2,
              // visual smoothing on small screens
              '&.Mui-expanded': { boxShadow: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                px: 2,
                bgcolor: 'grey.200',
                borderRadius: '8px',
                '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1 },
                py: 0,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                <Typography variant={smDown ? 'subtitle1' : 'h6'}>{shape}</Typography>
              </Stack>

              {/* <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteShape(shape);
                }}
                size={smDown ? 'small' : 'small'}
                color="error"
                sx={{
                  padding: '5px !important',
                  color: `${error.main} !important`,
                  ':hover': {
                    backgroundColor: `${error.lighter} !important`,
                    boxShadow: 'none !important',
                  },
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton> */}
            </AccordionSummary>

            <AccordionDetails sx={{ px: smDown ? 1.25 : 2, pb: 2 }}>
              <Grid container spacing={1}>
                {sets.map((mediaSet) => {
                  const index = values?.mediaMapping?.findIndex(
                    (m) => m.mediaSetId === mediaSet.mediaSetId
                  );
                  return (
                    <Grid item xs={12} key={mediaSet.mediaSetId}>
                      <Grid item xs={12}>
                        <SimpleMediaCard
                          mediaSet={mediaSet}
                          index={index}
                          formik={formik}
                          productId={productId}
                          loading={loading}
                          onDelete={handleDeleteSet}
                        />
                      </Grid>
                      <Grid item xs={12} p={0}>
                        <Stack>
                          {mediaSet.previewThumbnailImage?.length === 0 &&
                            mediaSet.previewImages.length === 0 && (
                              <Typography
                                variant="caption"
                                sx={{ mt: 1, color: 'error.main', fontWeight: 600 }}
                              >
                                "{mediaSet.name}" images are required
                              </Typography>
                            )}
                        </Stack>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Stack>
      ))}
    </Stack>
  );
};

export default MediaMappingManager;
