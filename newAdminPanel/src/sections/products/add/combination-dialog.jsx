import * as Yup from 'yup';
import { memo, useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FieldArray, getIn, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import {
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import { helperFunctions } from 'src/_helpers';
import { createProduct, updateProduct } from 'src/actions';
import { Button, LoadingButton } from 'src/components/button';
import { TextField, TableCell, TableRow, Stack, Typography } from '@mui/material';
import { DIAMOND_SHAPE, GOLD_COLOR, PRICE_CALCULATION_MODES } from 'src/_helpers/constants';
import InfiniteScrollTable from 'src/components/Infinite-scroll-table/InfiniteScrollTable';

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  variComboWithQuantity: Yup.array().of(
    Yup.object().shape({
      combination: Yup.array().of(
        Yup.object().shape({
          variationId: Yup.string().required('Variation ID is required'),
          variationName: Yup.string().required('Variation name is required'),
          variationTypeId: Yup.string().required('Variation type ID is required'),
          variationTypeName: Yup.string().required('Variation type name is required'),
        })
      ),
      price: Yup.number().min(0, 'Price must be zero or positive').required('Price is required'),
      quantity: Yup.number()
        .min(0, 'Quantity must be zero or positive')
        .integer('Quantity must be an integer')
        .required('Quantity is required'),
    })
  ),
});

// Function to get unique variation names in consistent order
const getColumnList = (arrayOfCombinations) => {
  const columnMap = new Map();
  arrayOfCombinations?.forEach((item) => {
    item.combination?.forEach((variation, index) => {
      if (!columnMap.has(variation?.variationName)) {
        columnMap.set(variation?.variationName, index);
      }
    });
  });
  return Array.from(columnMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => ({ label: name, width: 'auto' }));
};

// ----------------------------------------------------------------------

const CombinationDialog = ({
  fields,
  productId,
  openDialog,
  onCloseDialog,
  combinationsDetail,
  priceCalculationMode,
}) => {
  const [hasZeroPrice, setHasZeroPrice] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { combinations, crudProductLoading } = useSelector(({ product }) => product);

  const handleInputClick = useCallback((event) => {
    if (event?.target?.value) {
      event.target.select();
    }
  }, []);

  const handleWheel = useCallback((event) => {
    if (event?.target?.value) {
      event.target.blur();
    }
  }, []);

  const extractFiles = (previewArray) => {
    if (!Array.isArray(previewArray)) return [];
    return previewArray
      .map((item) => item?.file || item) // FileDrop stores raw File in .file
      .filter(Boolean);
  };

  const extractSingleFile = (previewArray) => {
    return previewArray?.[0]?.file || previewArray?.[0] || null;
  };

  const onSubmit = async (values, { setStatus }) => {
    // Build mediaMapping with files + generate mediaSetId from variationTypeIds
    const mediaMappingPayload = fields?.mediaMapping?.map((mediaSet) => {
      const matchingCombinations =
        values?.variComboWithQuantity
          ?.filter((combo) => {
            const hasGold = combo.combination.some(
              (c) =>
                c.variationName === GOLD_COLOR.title && c.variationTypeName === mediaSet.goldColor
            );
            const hasDiamond = combo.combination.some(
              (c) =>
                c.variationName === DIAMOND_SHAPE.title &&
                c.variationTypeName === mediaSet.diamondShape.name
            );

            return hasGold && hasDiamond;
          })
          .map((combo) => ({ combination: combo.combination })) ?? [];

      // Extract actual File objects from FileDrop components
      const thumbnailImageFile = extractSingleFile(mediaSet.thumbnailImageFile);
      const imageFiles = extractFiles(mediaSet.imageFiles);
      const videoFile = extractSingleFile(mediaSet.videoFile);

      return {
        mediaSetId: mediaSet.mediaSetId,
        name: mediaSet.name,
        matchingCombinations,
        thumbnailImageFile,
        imageFiles,
        deletedImages: mediaSet.deletedImages?.map((item) => item?.image),
        videoFile,
        deleteUploadedVideo: mediaSet.deleteUploadedVideo[0]?.video,
      };
    });

    const payload = {
      saltSKU: fields?.saltSKU,
      sku: fields?.sku,
      discount: fields?.discount,
      variations: fields?.variations,
      categoryId: fields?.categoryId,
      productName: fields?.productName,
      productNamePrefix: fields?.productNamePrefix,
      description: fields?.description,
      collectionIds: fields?.collectionIds,
      settingStyleIds: fields?.settingStyleIds,
      productTypeIds: fields?.productTypeIds,
      gender: fields?.gender,
      netWeight: fields?.netWeight,
      grossWeight: fields?.grossWeight,
      centerDiamondWeight: fields?.centerDiamondWeight,
      totalCaratWeight: fields?.totalCaratWeight,
      sideDiamondWeight: fields?.sideDiamondWeight,
      Length: fields?.Length,
      width: fields?.width,
      lengthUnit: fields?.lengthUnit,
      widthUnit: fields?.widthUnit,
      subCategoryIds: fields?.subCategoryIds,
      specifications: fields?.specifications,
      shortDescription: fields?.shortDescription,
      variComboWithQuantity: values?.variComboWithQuantity,
      active: hasZeroPrice ? false : fields?.active,
      isDiamondFilter: fields?.isDiamondFilter,
      diamondFilters: fields?.diamondFilters,
      priceCalculationMode: fields?.priceCalculationMode,
      mediaMapping: mediaMappingPayload,
    };
    setStatus();

    let res;
    if (!productId) {
      res = await dispatch(createProduct(payload));
    } else {
      payload.productId = productId;
      res = await dispatch(updateProduct(payload));
    }
    if (res) {
      navigate('/product');
      onCloseDialog(false);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: combinations || [],
      validationSchema,
      onSubmit,
    });

  useEffect(() => {
    const finalCombinationDetail = productId
      ? helperFunctions.getCombiDetailWithPriceAndQty({
          arrayOfCombinations: combinationsDetail,
          oldCombinations: fields?.tempVariComboWithQuantity,
        })
      : combinationsDetail;
    setFieldValue('variComboWithQuantity', finalCombinationDetail);
  }, [productId, setFieldValue]);

  useEffect(() => {
    const zeroPrice = values?.variComboWithQuantity?.some((item) => item?.price <= 0) ?? true;
    setHasZeroPrice((prev) => {
      if (prev !== zeroPrice) {
        return zeroPrice;
      }
      return prev;
    });
  }, [values?.variComboWithQuantity]);

  const renderRow = useCallback(
    (item, index) => {
      const variationMap = new Map(
        item.combination.map((combi) => [combi.variationName, combi.variationTypeName])
      );
      return (
        <TableRow key={`combination-${index}`}>
          {getColumnList(values.variComboWithQuantity).map((column, subIdx) => (
            <TableCell key={`combiItem-${index}-${subIdx}`}>
              {variationMap.get(column.label) || '-'}
            </TableCell>
          ))}
          <TableCell style={{ width: '160px' }}>
            <TextField
              size="small"
              type="number"
              label="Price"
              min={0}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = Math.max(0, parseFloat(e.target.value) || 0);
                setFieldValue(`variComboWithQuantity.${index}.price`, value);
              }}
              onClick={handleInputClick}
              onWheel={handleWheel}
              name={`variComboWithQuantity.${index}.price`}
              value={getIn(values, `variComboWithQuantity.${index}.price`) || 0}
              error={
                !!(
                  getIn(errors, `variComboWithQuantity.${index}.price`) &&
                  getIn(touched, `variComboWithQuantity.${index}.price`)
                )
              }
              helperText={
                getIn(touched, `variComboWithQuantity.${index}.price`) &&
                getIn(errors, `variComboWithQuantity.${index}.price`)
                  ? getIn(errors, `variComboWithQuantity.${index}.price`)
                  : ''
              }
              disabled={priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC}
            />
          </TableCell>
          <TableCell style={{ width: '160px' }}>
            <TextField
              size="small"
              type="number"
              label="Quantity"
              min={0}
              onBlur={handleBlur}
              onChange={(e) => {
                const value = Math.max(0, parseInt(e.target.value) || 0);
                setFieldValue(`variComboWithQuantity.${index}.quantity`, value);
              }}
              onClick={handleInputClick}
              onWheel={handleWheel}
              id={`variComboWithQuantity.${index}.quantity`}
              name={`variComboWithQuantity.${index}.quantity`}
              value={getIn(values, `variComboWithQuantity.${index}.quantity`) || 0}
              error={
                !!(
                  getIn(errors, `variComboWithQuantity.${index}.quantity`) &&
                  getIn(touched, `variComboWithQuantity.${index}.quantity`)
                )
              }
              helperText={
                getIn(touched, `variComboWithQuantity.${index}.quantity`) &&
                getIn(errors, `variComboWithQuantity.${index}.quantity`)
                  ? getIn(errors, `variComboWithQuantity.${index}.quantity`)
                  : ''
              }
            />
          </TableCell>
        </TableRow>
      );
    },
    [
      values,
      errors,
      touched,
      handleBlur,
      setFieldValue,
      priceCalculationMode,
      handleInputClick,
      handleWheel,
    ]
  );

  const columns = useMemo(
    () => [
      ...getColumnList(values.variComboWithQuantity),
      { label: 'Price', width: '160px' },
      { label: 'Quantity', width: '160px' },
    ],
    [values.variComboWithQuantity]
  );

  return (
    <Dialog
      handleOpen={() => onCloseDialog(true)}
      open={openDialog}
      handleClose={() => onCloseDialog(false)}
      fullWidth
      maxWidth="md"
    >
      <StyledDialogTitle>Product Combinations</StyledDialogTitle>
      <StyledDialogContent>
        <FieldArray name="variComboWithQuantity">
          {() => (
            <InfiniteScrollTable
              dataSource={values.variComboWithQuantity}
              pageSize={10}
              columns={columns}
              renderRow={renderRow}
              getRowKey={(item, index) => `combination-${item.id || index}`}
              maxHeight={600}
              scrollableTarget="combination-dialog-table"
              showEndMessage={false}
            />
          )}
        </FieldArray>
      </StyledDialogContent>
      <StyledDialogActions>
        <Stack direction="column" gap={1} width="100%" justifyContent="start">
          {hasZeroPrice && (
            <Typography variant="body2" color="error.main" sx={{ fontSize: '0.9rem' }}>
              Activation is blocked due to one or more combinations having a zero price.
            </Typography>
          )}
          <Stack direction="row" justifyContent="end" sx={{ width: '100%' }} gap={1}>
            <Button
              variant="outlined"
              disabled={crudProductLoading}
              onClick={() => onCloseDialog(false)}
            >
              Cancel
            </Button>
            <LoadingButton loading={crudProductLoading} onClick={handleSubmit} variant="contained">
              Confirm
            </LoadingButton>
          </Stack>
        </Stack>
      </StyledDialogActions>
    </Dialog>
  );
};

export default memo(CombinationDialog);
