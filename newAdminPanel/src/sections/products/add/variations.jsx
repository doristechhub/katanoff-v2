import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FieldArray, getIn } from 'formik';
import React, { memo, useCallback, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';

import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import { alpha, TextField, Box } from '@mui/material';
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
import { PRICE_CALCULATION_MODES } from 'src/_helpers/constants';

// ----------------------------------------------------------------------
const VariationAccordionItem = memo(
  ({
    isExpanded,
    onToggle,
    hasError,
    variation,
    index,
    dragProvider,
    snapshot,
    formik,
    customizationTypesList,
    remove,
    onVariationChange,
    onRemove,
    updateCombinations,
  }) => {
    return (
      <Box
        ref={dragProvider.innerRef}
        {...dragProvider.draggableProps}
        sx={{
          mb: 2,
          borderRadius: 1,
          borderColor: 'divider',
          bgcolor: snapshot.isDragging
            ? (theme) => alpha(theme.palette.primary.main, 0.08)
            : 'background.paper',
        }}
      >
        {/* ===== HEADER ===== */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={onToggle}
          sx={{
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            bgcolor: hasError ? 'error.lighter' : 'grey.200',
            borderRadius: 1,
            border: hasError ? '1px solid' : 'none',
            borderColor: hasError ? 'error.main' : 'transparent',
            userSelect: 'none',
          }}
        >
          <Box
            {...dragProvider.dragHandleProps}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Iconify icon="ic:baseline-drag-indicator" />
          </Box>

          <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
            {customizationTypesList.find((x) => x.id === variation.variationId)?.title ||
              `Variation Name`}
          </Typography>

          <Iconify
            icon="eva:arrow-ios-downward-fill"
            sx={{
              transition: 'transform 0.2s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </Stack>
        {hasError && !isExpanded && (
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
            Select a variation name, then choose one or more variation types.
          </Typography>
        )}
        {/* ===== BODY ===== */}
        {isExpanded && (
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  label="Variation Name"
                  value={variation.variationId}
                  onChange={(e) => onVariationChange(e.target.value, index)}
                  onBlur={formik.handleBlur}
                  name={`variations.${index}.variationId`}
                  error={Boolean(
                    getIn(formik.errors, `variations.${index}.variationId`) &&
                      getIn(formik.touched, `variations.${index}.variationId`)
                  )}
                  helperText={
                    getIn(formik.errors, `variations.${index}.variationId`) &&
                    getIn(formik.touched, `variations.${index}.variationId`)
                      ? getIn(formik.errors, `variations.${index}.variationId`)
                      : ''
                  }
                >
                  {customizationTypesList.map((item) => {
                    const isAlreadySelected = formik.values.variations.some(
                      (v, i) => v.variationId === item.id && i !== index
                    );

                    return (
                      <MenuItem key={item.id} value={item.id} disabled={isAlreadySelected}>
                        {item.title}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>

              <Grid xs={12}>
                <VariantionTypes
                  index={index}
                  formik={formik}
                  updateCombinations={updateCombinations}
                />
              </Grid>

              <Grid xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    size="small"
                    onClick={() => onRemove(index, remove)}
                    disabled={formik.values.variations.length === 1}
                    startIcon={
                      <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
                    }
                    sx={{
                      color: 'error.main',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: error.lighter,
                      },
                    }}
                  >
                    Remove
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    );
  }
);

const Variations = memo(({ formik }) => {
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const { handleBlur, values, errors, touched, setFieldValue } = formik;
  const { customizationTypesList, customizationSubTypesList } = useSelector(
    ({ product }) => product
  );
  const { priceMultiplier } = useSelector(({ settings }) => settings);

  // Generates and updates product variation combinations
  const updateCombinations = useCallback(
    (updatedVariations) => {
      // Generate combinations based on variations and customizations
      const combinations = helperFunctions?.getCombinationDetail({
        variations: updatedVariations,
        customizations: {
          customizationType: customizationTypesList,
          customizationSubType: customizationSubTypesList,
        },
      });

      // Merge combinations with existing price and quantity data
      let updatedCombinations = helperFunctions?.getCombiDetailWithPriceAndQty({
        arrayOfCombinations: combinations,
        oldCombinations: values?.tempVariComboWithQuantity,
      });

      // Apply automatic price calculations if enabled
      if (values?.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC) {
        updatedCombinations = helperFunctions?.calculateAutomaticPrices({
          combinations: updatedCombinations,
          customizationSubTypesList,
          grossWeight: values.grossWeight,
          totalCaratWeight: values.totalCaratWeight,
          priceMultiplier,
        });
      }

      // Update Formik state with the new combinations
      setFieldValue('tempVariComboWithQuantity', updatedCombinations);
    },
    [
      customizationTypesList,
      customizationSubTypesList,
      setFieldValue,
      values?.tempVariComboWithQuantity,
      values?.grossWeight,
      values?.totalCaratWeight,
      priceMultiplier,
      values?.priceCalculationMode,
    ]
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
      // Generate combinations after variation change
      const updatedVariations = values.variations.map((vari, i) =>
        i === index
          ? {
              ...vari,
              variationId,
              subTypes: customizationTypeWiseCustomizationSubTypes,
              variationTypes: productInitDetails?.variations?.[0]?.variationTypes,
            }
          : vari
      );
      updateCombinations(updatedVariations);
    },
    [customizationSubTypesList, setFieldValue, updateCombinations, values?.variations]
  );

  const addVariationsHandler = useCallback(
    (push) => {
      let variationsAdded = values?.variations;
      setExpandedIndex(values.variations.length);
      if (variationsAdded?.length === customizationTypesList?.length) {
        return;
      }

      const checkVariationTypesFilled = (variationTypes) => {
        return variationTypes.filter((variType) => !variType.variationTypeId).length;
      };
      const areAllFieldsFilled = values?.variations.filter(
        (variItem) => !variItem.variationId || checkVariationTypesFilled(variItem.variationTypes)
      );

      if (!areAllFieldsFilled?.length) {
        const newVariation = {
          ...productInitDetails?.variations?.[0],
          position: values?.variations?.length + 1, // Assign next position
        };
        push(newVariation);
        // Generate combinations after adding variation
        updateCombinations([...values.variations, newVariation]);
      } else {
        toast.error('Please fill all variations value');
      }
    },
    [customizationTypesList, values, productInitDetails, updateCombinations]
  );

  const hasVariationError = useCallback(
    (index) => {
      const variationErrors = getIn(errors, `variations.${index}`);
      const variationTouched = getIn(touched, `variations.${index}`);

      if (!variationErrors || !variationTouched) return false;

      // Variation name error
      if (variationErrors.variationId && variationTouched.variationId) {
        return true;
      }

      // Any variation type error
      if (variationErrors.variationTypes && variationErrors.variationTypes.length) {
        return variationErrors.variationTypes.some(
          (vtErr, i) =>
            vtErr?.variationTypeId &&
            getIn(touched, `variations.${index}.variationTypes.${i}.variationTypeId`)
        );
      }

      return false;
    },
    [errors, touched]
  );

  const removeVariationHandler = useCallback(
    (index, remove) => {
      remove(index);
      // Generate combinations after removing variation
      const newVariations = values?.variations
        ?.filter((_, i) => i !== index)
        .map((vari, i) => ({
          ...vari,
          position: i + 1, // Reassign positions
        }));
      setFieldValue('variations', newVariations);
      updateCombinations(newVariations);
    },
    [values?.variations, setFieldValue, updateCombinations]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { destination, source } = event;
      if (!destination) return;

      const updatedVariations = [...values.variations];
      const [movedVariation] = updatedVariations.splice(source.index, 1);
      updatedVariations.splice(destination.index, 0, movedVariation);

      // Update positions
      const variationsWithPositions = updatedVariations.map((vari, i) => ({
        ...vari,
        position: i + 1,
      }));

      setFieldValue('variations', variationsWithPositions);
      updateCombinations(variationsWithPositions);
    },
    [values?.variations, setFieldValue, updateCombinations]
  );

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="variations-droppable">
          {(provider) => (
            <div
              ref={provider.innerRef}
              {...provider.droppableProps}
              style={{ position: 'relative', minHeight: '100px', overflow: 'visible' }}
            >
              <FieldArray name="variations">
                {({ remove, push }) => (
                  <>
                    {values?.variations?.length > 0 ? (
                      values?.variations?.map((variation, index) => (
                        <Draggable
                          key={`variation-${variation.variationId || index}`}
                          draggableId={`variation-${variation.variationId || index}`}
                          index={index}
                        >
                          {(dragProvider, snapshot) => (
                            <VariationAccordionItem
                              hasError={hasVariationError(index)}
                              isExpanded={expandedIndex === index}
                              onToggle={() =>
                                setExpandedIndex(expandedIndex === index ? null : index)
                              }
                              variation={variation}
                              index={index}
                              dragProvider={dragProvider}
                              snapshot={snapshot}
                              formik={formik}
                              customizationTypesList={customizationTypesList}
                              remove={remove}
                              onVariationChange={variationChangeHandler}
                              onRemove={removeVariationHandler}
                              updateCombinations={updateCombinations}
                            />
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ color: 'error.main' }}>
                        Variation is required
                      </Typography>
                    )}
                    {provider.placeholder}
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
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
