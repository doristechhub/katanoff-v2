import { toast } from 'react-toastify';
import { FieldArray, getIn } from 'formik';
import React, { memo, useCallback, Fragment } from 'react';

import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2';
import { IconButton, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

import Iconify from 'src/components/iconify';
import { error, primary } from 'src/theme/palette';
import { productInitDetails } from 'src/store/slices/productSlice';

// ----------------------------------------------------------------------

const VariantionTypes = memo(({ index, formik, updateCombinations }) => {
  const { touched, errors, values, handleBlur, setFieldValue } = formik;

  const addVariationTypesHandler = useCallback(
    (push, variationTypes) => {
      const subTypes = values?.variations?.[index]?.subTypes;
      if (subTypes?.length === variationTypes?.length) return;

      const areAllFieldsFilled = variationTypes?.filter((type) => !type?.variationTypeId);
      if (areAllFieldsFilled.length) {
        toast.error('Please fill all variation type values');
        return;
      }

      const newVariationType = {
        ...productInitDetails?.variations?.[0]?.variationTypes[0],
        position: variationTypes.length + 1,
      };

      push(newVariationType);

      const updatedVariations = values.variations.map((vari, i) =>
        i === index
          ? {
              ...vari,
              variationTypes: [...vari.variationTypes, newVariationType],
            }
          : vari
      );

      updateCombinations(updatedVariations);
    },
    [productInitDetails, index, values, updateCombinations]
  );

  const handleVariationTypeChange = useCallback(
    (event, j) => {
      const newVariationTypeId = event.target.value;

      setFieldValue(`variations.${index}.variationTypes.${j}.variationTypeId`, newVariationTypeId);
      // Generate combinations with updated variations
      const updatedVariations = values.variations.map((vari, i) =>
        i === index
          ? {
              ...vari,
              variationTypes: vari.variationTypes.map((vt, k) =>
                k === j ? { ...vt, variationTypeId: newVariationTypeId } : vt
              ),
            }
          : vari
      );
      updateCombinations(updatedVariations);
    },
    [index, setFieldValue, updateCombinations, values.variations]
  );

  const removeVariationTypeHandler = useCallback(
    (j, remove) => {
      remove(j);
      const updatedVariations = values.variations.map((vari, i) =>
        i === index
          ? {
              ...vari,
              variationTypes: vari.variationTypes
                .filter((_, k) => k !== j)
                .map((vt, idx) => ({ ...vt, position: idx + 1 })),
            }
          : vari
      );
      updateCombinations(updatedVariations);
    },
    [index, updateCombinations, values.variations]
  );

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;

      const variationTypes = [...values.variations[index].variationTypes];
      const [movedItem] = variationTypes.splice(source.index, 1);
      variationTypes.splice(destination.index, 0, movedItem);

      const variationTypesWithPosition = variationTypes.map((item, i) => ({
        ...item,
        position: i + 1,
      }));

      const updatedVariations = values.variations.map((vari, i) =>
        i === index ? { ...vari, variationTypes: variationTypesWithPosition } : vari
      );

      setFieldValue(`variations.${index}.variationTypes`, variationTypesWithPosition);
      updateCombinations(updatedVariations);
    },
    [index, values.variations, setFieldValue, updateCombinations]
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
      {({ remove, push }) => {
        const normalizedVariationTypes = values?.variations?.[index]?.variationTypes?.map(
          (vt, idx) => ({
            ...vt,
            position: vt?.position ?? idx + 1,
          })
        );

        return normalizedVariationTypes?.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`variationTypes-droppable-${index}`} direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {normalizedVariationTypes.map((variType, j) => (
                    <Draggable
                      draggableId={`variationType-${index}-${j}`}
                      index={j}
                      key={`variationType-${index}-${j}`}
                    >
                      {(dragProvided) => (
                        <Fragment key={j}>
                          <Grid
                            container
                            spacing={2}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                          >
                            <Grid xs={10}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <div
                                  {...dragProvided.dragHandleProps}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <Iconify icon="ic:baseline-drag-indicator" />
                                </div>

                                <TextField
                                  select
                                  size="small"
                                  sx={{
                                    width: '100%',
                                    minWidth: {
                                      md: '300px',
                                    },
                                  }}
                                  label="Variation Type Name"
                                  onBlur={handleBlur}
                                  onChange={(e) => handleVariationTypeChange(e, j)}
                                  name={`variations.${index}.variationTypes.${j}.variationTypeId`}
                                  value={variType.variationTypeId || ''}
                                  error={
                                    !!getIn(
                                      errors,
                                      `variations.${index}.variationTypes.${j}.variationTypeId`
                                    ) &&
                                    !!getIn(
                                      touched,
                                      `variations.${index}.variationTypes.${j}.variationTypeId`
                                    )
                                  }
                                  helperText={
                                    getIn(
                                      errors,
                                      `variations.${index}.variationTypes.${j}.variationTypeId`
                                    ) &&
                                    getIn(
                                      touched,
                                      `variations.${index}.variationTypes.${j}.variationTypeId`
                                    )
                                      ? getIn(
                                          errors,
                                          `variations.${index}.variationTypes.${j}.variationTypeId`
                                        )
                                      : ''
                                  }
                                >
                                  {values?.variations?.[index]?.subTypes?.length ? (
                                    values?.variations?.[index]?.subTypes?.map((option) => {
                                      const isAlreadySelected = values?.variations?.[
                                        index
                                      ]?.variationTypes?.some(
                                        (vt) => vt?.variationTypeId === option?.id
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
                              </Stack>
                            </Grid>
                            <Grid xs={2}>
                              <Stack direction="row" alignItems="center" gap={1}>
                                {renderPlusBtn(j, push)}
                                <IconButton
                                  size="small"
                                  disabled={normalizedVariationTypes.length === 1}
                                  onClick={() => removeVariationTypeHandler(j, remove)}
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
                                </IconButton>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Fragment>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : null;
      }}
    </FieldArray>
  );
});

export default VariantionTypes;
