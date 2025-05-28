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

// ----------------------------------------------------------------------

const validationSchema = Yup.object({
  variComboWithQuantity: Yup.array().of(
    Yup.object().shape({
      combination: Yup.array().of(
        Yup.object().shape({
          variationId: Yup.string().required('variationId is required'),
          variationName: Yup.string().required('variationName is required'),
          variationTypeId: Yup.string().required('variationTypeId is required'),
          variationTypeName: Yup.string().required('variationTypeName is required'),
        })
      ),
      price: Yup.number()
        .min(0, 'Price must be a zero or positive number')
        .integer('Price must be an integer')
        .required('Price is required'),
      quantity: Yup.number()
        .min(0, 'Quantity must be a zero or positive number')
        .integer('Quantity must be an integer')
        .required('Quantity is required'),
    })
  ),
});

export const generateCombinations = (arrayOfVariation) => {
  const variationNames = arrayOfVariation.map((item) =>
    item.variationTypes.map((type) => ({
      variationName: item.variationName,
      variationTypeName: type.variationTypeName,
      variationId: item.variationId,
      variationTypeId: type.variationTypeId,
    }))
  );

  const result = [];
  const temp = [];

  const combine = (arr, index) => {
    if (index === variationNames.length) {
      result.push({
        id: helperFunctions.getRandomValue(),
        combination: [...temp],
        price: 0,
        quantity: 0,
      });
      return;
    }

    for (let i = 0; i < arr[index].length; i++) {
      temp.push({
        id: helperFunctions.getRandomValue(),
        variationId: arr[index][i].variationId,
        variationName: arr[index][i].variationName,
        variationTypeId: arr[index][i].variationTypeId,
        variationTypeName: arr[index][i].variationTypeName,
      });
      combine(arr, index + 1);
      temp.pop();
    }
  };

  combine(variationNames, 0);
  return result;
};

const getCulumnList = (arrayOfCombinations) => {
  const columnList = [];
  arrayOfCombinations?.forEach((item) => {
    item.combination?.forEach((variation) => {
      if (!columnList.includes(variation?.variationName)) {
        columnList.push(variation?.variationName);
      }
    });
  });
  return columnList;
};

function sortArrays(arr1, arr2) {
  const sortFunc = (a, b) => {
    if (a.variationId < b.variationId) return -1;
    if (a.variationId > b.variationId) return 1;
    if (a.variationTypeId < b.variationTypeId) return -1;
    if (a.variationTypeId > b.variationTypeId) return 1;
    return 0;
  };

  arr1.sort(sortFunc);
  arr2.sort(sortFunc);
}

function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  sortArrays(arr1, arr2);

  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].variationId !== arr2[i].variationId ||
      arr1[i].variationTypeId !== arr2[i].variationTypeId
    ) {
      return false;
    }
  }

  return true;
}

// ----------------------------------------------------------------------

const CombinationDialog = ({
  fields,
  productId,
  openDialog,
  onCloseDialog,
  combinationsDetail,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { combinations, crudProductLoading } = useSelector(({ product }) => product);

  const onSubmit = async (values, { setStatus }) => {
    let payload = {
      saltSKU: fields?.saltSKU,
      sku: fields?.sku,
      discount: fields?.discount,
      videoFile: fields?.videoFile?.[0],
      imageFiles: fields?.imageFiles,
      thumbnailImageFile: fields?.thumbnailImageFile?.[0],
      variations: fields?.variations,
      categoryId: fields?.categoryId,
      productName: fields?.productName,
      description: fields?.description,
      collectionIds: fields?.collectionIds,
      settingStyleIds: fields?.settingStyleIds,
      productTypeIds: fields?.productTypeIds,
      netWeight: fields?.netWeight,
      subCategoryId: fields?.subCategoryId,
      specifications: fields?.specifications,
      shortDescription: fields?.shortDescription,
      variComboWithQuantity: values?.variComboWithQuantity,
      active: fields?.active,
      isDiamondFilter: fields?.isDiamondFilter,
      diamondFilters: fields?.diamondFilters,
    };
    setStatus();

    let res;
    if (!productId) {
      res = await dispatch(createProduct(payload));
    } else {
      payload.productId = productId;
      payload.deletedImages = fields?.uploadedDeletedImages?.map((item) => item?.image);
      payload.deletedVideo = fields?.deleteUploadedVideo?.[0]?.video;
      // payload.active = fields?.active;
      res = await dispatch(updateProduct(payload));
    }
    if (res) {
      navigate('/product');
      onCloseDialog(false);
    }
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } =
    useFormik({
      initialValues: combinations,
      validationSchema,
      onSubmit,
    });

  const getArrayWithoutIds = (arrayWithIds) => {
    const arrayWithoutIds = arrayWithIds?.map((obj) => {
      const { id, ...rest } = obj; // Using destructuring to exclude 'id'
      return rest; // Return the object without the 'id' field
    });
    return arrayWithoutIds;
  };

  const getCombiDetailWithQty = (arrayOfCombinations) => {
    const tempArray = arrayOfCombinations.map((mainItem) => {
      const array1 = getArrayWithoutIds(mainItem.combination);
      const findedCombination = fields?.tempVariComboWithQuantity?.find((tempMainCombiItem) => {
        const array2 = getArrayWithoutIds(tempMainCombiItem?.combination);
        return areArraysEqual(array1, array2);
      });
      return {
        ...mainItem,
        price: findedCombination?.price ? findedCombination?.price : 0,
        quantity: findedCombination?.quantity ? findedCombination?.quantity : 0,
      };
    });
    return tempArray;
  };

  useEffect(() => {
    const finalCombinationDetail = productId
      ? getCombiDetailWithQty(combinationsDetail)
      : combinationsDetail;

    setFieldValue('variComboWithQuantity', finalCombinationDetail);
  }, [combinationsDetail]);

  return (
    <>
      <Dialog
        handleOpen={() => onCloseDialog(true)}
        open={openDialog}
        handleClose={onCloseDialog}
        fullWidth
        maxWidth={'md'}
      >
        <StyledDialogTitle>Combinations</StyledDialogTitle>
        <StyledDialogContent>
          <CombinationTable
            values={values}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            handleChange={handleChange}
          />
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
    </>
  );
};

export default memo(CombinationDialog);

const CombinationTable = memo(({ values, errors, touched, handleBlur, handleChange }) => {
  return (
    <>
      <TableContainer sx={{ overflow: 'unset' }}>
        <Table>
          <TableHead>
            <TableRow>
              {getCulumnList(values?.variComboWithQuantity)?.map((column, index) => (
                <TableCell key={`column-${index}`}>{column}</TableCell>
              ))}
              <TableCell key={`column-9998`}>Price</TableCell>
              <TableCell key={`column-9999`}>Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <FieldArray name="variComboWithQuantity">
              {({ remove, push }) => (
                <>
                  {values?.variComboWithQuantity?.length > 0 ? (
                    values?.variComboWithQuantity?.map((variCombiItem, index) => {
                      return (
                        <TableRow key={`combination-${variCombiItem?.id}`}>
                          {/* combinaiton array */}
                          {variCombiItem?.combination?.map((combiItem) => (
                            <TableCell key={`combiItem-${combiItem?.id}`}>
                              {combiItem?.variationTypeName}
                            </TableCell>
                          ))}
                          <TableCell style={{ width: '160px' }}>
                            {/* price */}
                            <TextField
                              size="small"
                              type="number"
                              label="Price"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              id={`variComboWithQuantity.${index}.price`}
                              name={`variComboWithQuantity.${index}.price`}
                              value={getIn(values, `variComboWithQuantity.${index}.price`)}
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
                            />
                          </TableCell>
                          <TableCell style={{ width: '160px' }}>
                            {/* quantity */}
                            <TextField
                              size="small"
                              type="number"
                              label="Quantity"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              id={`variComboWithQuantity.${index}.quantity`}
                              name={`variComboWithQuantity.${index}.quantity`}
                              value={getIn(values, `variComboWithQuantity.${index}.quantity`)}
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
                      <TableCell style={{ width: '160px' }}>
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
    </>
  );
});
