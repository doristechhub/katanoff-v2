import * as Yup from 'yup';
import { memo, useEffect } from 'react';
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

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { PRICE_CALCULATION_MODES } from 'src/_helpers/constants';

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
      price: Yup.number()
        .min(0, 'Price must be zero or positive')
        // .integer('Price must be an integer')
        .required('Price is required'),
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
  // Sort by index to maintain order as in combination array
  return Array.from(columnMap.entries())
    .sort((a, b) => a[1] - b[1])
    .map(([name]) => name);
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { combinations, crudProductLoading } = useSelector(({ product }) => product);

  // Handler to select input value on click
  const handleInputClick = (event) => {
    event.target.select();
  };

  // Handler to disable mouse wheel value change
  const handleWheel = (event) => {
    event.target.blur();
  };

  const onSubmit = async (values, { setStatus }) => {
    const payload = {
      saltSKU: fields?.saltSKU,
      sku: fields?.sku,
      discount: fields?.discount,
      roseGoldImageFiles: fields?.roseGoldImageFiles,
      roseGoldThumbnailImageFile: fields?.roseGoldThumbnailImageFile?.[0],
      roseGoldVideoFile: fields?.roseGoldVideoFile?.[0],
      yellowGoldImageFiles: fields?.yellowGoldImageFiles,
      yellowGoldThumbnailImageFile: fields?.yellowGoldThumbnailImageFile?.[0],
      yellowGoldVideoFile: fields?.yellowGoldVideoFile?.[0],
      whiteGoldImageFiles: fields?.whiteGoldImageFiles,
      whiteGoldThumbnailImageFile: fields?.whiteGoldThumbnailImageFile?.[0],
      whiteGoldVideoFile: fields?.whiteGoldVideoFile?.[0],
      variations: fields?.variations,
      categoryId: fields?.categoryId,
      productName: fields?.productName,
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
      subCategoryIds: fields?.subCategoryIds,
      specifications: fields?.specifications,
      shortDescription: fields?.shortDescription,
      variComboWithQuantity: values?.variComboWithQuantity,
      active: fields?.active,
      isDiamondFilter: fields?.isDiamondFilter,
      diamondFilters: fields?.diamondFilters,
      priceCalculationMode: fields?.priceCalculationMode,
      deletedRoseGoldImages: fields?.roseGoldUploadedDeletedImages?.map((item) => item?.image),
      deletedRoseGoldVideo: fields?.roseGoldDeleteUploadedVideo?.[0]?.video,
      deletedYellowGoldImages: fields?.yellowGoldUploadedDeletedImages?.map((item) => item?.image),
      deletedYellowGoldVideo: fields?.yellowGoldDeleteUploadedVideo?.[0]?.video,
      deletedWhiteGoldImages: fields?.whiteGoldUploadedDeletedImages?.map((item) => item?.image),
      deletedWhiteGoldVideo: fields?.whiteGoldDeleteUploadedVideo?.[0]?.video,
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

  // Get column headers
  const columns = getColumnList(values?.variComboWithQuantity);

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
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={`column-${index}`}>{column}</TableCell>
                ))}
                <TableCell key="column-9998">Price</TableCell>
                <TableCell key="column-9999">Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <FieldArray name="variComboWithQuantity">
                {() => (
                  <>
                    {values?.variComboWithQuantity?.length > 0 ? (
                      values.variComboWithQuantity.map((variCombiItem, index) => {
                        // Create a map of variationName to variationTypeName for this row
                        const variationMap = new Map(
                          variCombiItem.combination.map((combi) => [
                            combi.variationName,
                            combi.variationTypeName,
                          ])
                        );
                        return (
                          <TableRow key={`combination-${index}`}>
                            {columns.map((column, subIdx) => (
                              <TableCell key={`combiItem-${index}-${subIdx}`}>
                                {variationMap.get(column) || '-'}
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
                                  const value = Math.max(0, parseInt(e.target.value) || 0);
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
                                disabled={
                                  priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC
                                }
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
                                value={
                                  getIn(values, `variComboWithQuantity.${index}.quantity`) || 0
                                }
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
                      })
                    ) : (
                      <TableRow sx={{ color: 'error.main', px: 2, fontSize: 'small' }}>
                        <TableCell colSpan={columns.length + 2} style={{ width: '160px' }}>
                          Combination Details is required
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </FieldArray>
            </TableBody>
          </Table>
        </TableContainer>
      </StyledDialogContent>
      <StyledDialogActions>
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
      </StyledDialogActions>
    </Dialog>
  );
};

export default memo(CombinationDialog);
