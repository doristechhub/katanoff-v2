import { memo, useEffect, useState, useMemo, useRef } from 'react';
import { FieldArray, getIn } from 'formik';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { helperFunctions } from 'src/_helpers';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const GroupBySection = ({ formik }) => {
  const { customizationTypesList, customizationSubTypesList } = useSelector(
    ({ product }) => product
  );

  const { values, handleBlur, setFieldValue, errors, touched } = formik;

  const customizations = {
    customizationType: customizationTypesList,
    customizationSubType: customizationSubTypesList,
  };

  const [expandedGroups, setExpandedGroups] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const isGroupByInitialized = useRef(false);

  const variationList = useMemo(
    () => helperFunctions?.getVariationsArray(values.variations, customizations) || [],
    [values.variations, customizations]
  );

  useEffect(() => {
    if (variationList.length === 0) {
      setGroupBy('');
      isGroupByInitialized.current = false;
      return;
    }

    const isCurrentGroupByValid = variationList.some(
      (variation) => variation.variationName === groupBy
    );

    if (!isGroupByInitialized.current || !isCurrentGroupByValid) {
      const newGroupBy = variationList[0]?.variationName || '';
      setGroupBy(newGroupBy);
      isGroupByInitialized.current = true;
    }
  }, [variationList, groupBy]);

  const groupedData = useMemo(() => {
    if (!groupBy || !values?.tempVariComboWithQuantity) {
      return {};
    }

    const result = values.tempVariComboWithQuantity.reduce((acc, item) => {
      const groupValue = item.combination?.find(
        (combi) => combi.variationName === groupBy
      )?.variationTypeName;

      if (!groupValue) {
        return acc;
      }

      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }
      acc[groupValue].push(item);
      return acc;
    }, {});

    return result;
  }, [groupBy, values?.tempVariComboWithQuantity]);

  // Calculate price range and check if prices are different for a group
  const getGroupPriceInfo = (groupItems) => {
    const prices = groupItems.map((item) => parseFloat(item.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasDifferentPrices = minPrice !== maxPrice;
    return { minPrice, maxPrice, hasDifferentPrices };
  };

  // Calculate quantity range and check if quantities are different for a group
  const getGroupQuantityInfo = (groupItems) => {
    const quantities = groupItems.map((item) => parseInt(item.quantity) || 0);
    const minQuantity = Math.min(...quantities);
    const maxQuantity = Math.max(...quantities);
    const hasDifferentQuantities = minQuantity !== maxQuantity;
    return { minQuantity, maxQuantity, hasDifferentQuantities };
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const handleGroupHeaderChange = (groupKey, field, value) => {
    const groupItems = groupedData[groupKey];
    if (!groupItems) {
      return;
    }

    groupItems.forEach((item) => {
      const subIndex = values.tempVariComboWithQuantity.findIndex((i) => i === item);
      if (subIndex !== -1) {
        setFieldValue(`tempVariComboWithQuantity.${subIndex}.${field}`, value);
      }
    });
  };

  // Handler to select input value on click
  const handleInputClick = (event) => {
    event.target.select();
  };

  // Handler to disable mouse wheel value change
  const handleWheel = (event) => {
    event.target.blur();
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Group By</InputLabel>
          <Select
            value={groupBy}
            label="Group By"
            onChange={(e) => {
              const newGroupBy = e.target.value;
              setGroupBy(newGroupBy);
              setExpandedGroups({});
              isGroupByInitialized.current = true;
            }}
          >
            {variationList.length > 0 ? (
              variationList.map((variation) => (
                <MenuItem key={variation.variationId} value={variation.variationName}>
                  {variation.variationName}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No variations available
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>

      <TableContainer sx={{ overflow: 'unset' }}>
        <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '50%' }}>Variants</TableCell>
              <TableCell sx={{ width: '30%' }}>Price</TableCell>
              <TableCell sx={{ width: '20%' }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData && Object.keys(groupedData).length > 0 ? (
              Object.keys(groupedData).map((groupKey, groupIndex) => {
                const groupItems = groupedData[groupKey];
                const mainVariantIndex = values.tempVariComboWithQuantity.findIndex(
                  (item) => item === groupItems[0]
                );
                const { minPrice, maxPrice, hasDifferentPrices } = getGroupPriceInfo(groupItems);
                const { minQuantity, maxQuantity, hasDifferentQuantities } =
                  getGroupQuantityInfo(groupItems);

                return (
                  <FieldArray key={groupKey} name="tempVariComboWithQuantity">
                    {() => (
                      <>
                        {/* Group Header */}
                        <TableRow>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {groupKey}
                                <br />
                                {groupItems.length > 1 && (
                                  <Typography sx={{ fontSize: '14px', color: 'gray' }}>
                                    {' '}
                                    {groupItems.length} variants
                                    <IconButton
                                      onClick={() => toggleGroup(groupKey)}
                                      sx={{ p: 0, color: 'gray' }}
                                    >
                                      {expandedGroups[groupKey] ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>
                                  </Typography>
                                )}
                              </Typography>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={`Applied to all ${groupItems.length} variants`}
                              placement="top"
                            >
                              <TextField
                                size="small"
                                type="text"
                                label="Price"
                                onBlur={handleBlur}
                                onClick={handleInputClick}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const newPrice = Math.max(0, parseFloat(e.target.value) || 0);
                                  handleGroupHeaderChange(groupKey, 'price', newPrice);
                                }}
                                value={
                                  hasDifferentPrices
                                    ? `${minPrice} - ${maxPrice}`
                                    : mainVariantIndex !== -1
                                      ? getIn(
                                          values,
                                          `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                        ) || '0'
                                      : ''
                                }
                                error={
                                  mainVariantIndex !== -1 &&
                                  !!(
                                    getIn(
                                      errors,
                                      `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                    ) &&
                                    getIn(
                                      touched,
                                      `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                    )
                                  )
                                }
                                helperText={
                                  mainVariantIndex !== -1 &&
                                  getIn(
                                    touched,
                                    `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                  ) &&
                                  getIn(
                                    errors,
                                    `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                  )
                                    ? getIn(
                                        errors,
                                        `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                      )
                                    : ''
                                }
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip
                              title={`Applied to all ${groupItems.length} variants`}
                              placement="top"
                            >
                              <TextField
                                size="small"
                                type="text"
                                label="Quantity"
                                onBlur={handleBlur}
                                onClick={handleInputClick}
                                onWheel={handleWheel}
                                onChange={(e) => {
                                  const newQuantity = Math.max(0, parseInt(e.target.value) || 0);
                                  handleGroupHeaderChange(groupKey, 'quantity', newQuantity);
                                }}
                                value={
                                  hasDifferentQuantities
                                    ? `${minQuantity} - ${maxQuantity}`
                                    : mainVariantIndex !== -1
                                      ? getIn(
                                          values,
                                          `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                        ) || '0'
                                      : ''
                                }
                                error={
                                  mainVariantIndex !== -1 &&
                                  !!(
                                    getIn(
                                      errors,
                                      `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                    ) &&
                                    getIn(
                                      touched,
                                      `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                    )
                                  )
                                }
                                helperText={
                                  mainVariantIndex !== -1 &&
                                  getIn(
                                    touched,
                                    `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                  ) &&
                                  getIn(
                                    errors,
                                    `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                  )
                                    ? getIn(
                                        errors,
                                        `tempVariComboWithQuantity.${mainVariantIndex}.quantity`
                                      )
                                    : ''
                                }
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>

                        {/* Variants under each group, shown only if expanded */}
                        {expandedGroups[groupKey] &&
                          groupItems.map((variCombiItem, index) => {
                            const otherSubVariant =
                              variCombiItem.combination
                                ?.filter((combi) => combi.variationName !== groupBy)
                                ?.map((x) => x?.variationTypeName)
                                ?.join(' / ') || '-';

                            const globalIndex = values.tempVariComboWithQuantity.findIndex(
                              (item) => item === variCombiItem
                            );

                            return (
                              <TableRow
                                key={`temp-combination-${variCombiItem?.id || globalIndex}`}
                              >
                                <TableCell>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      paddingLeft: '20px',
                                    }}
                                  >
                                    <span>{otherSubVariant}</span>
                                  </div>
                                </TableCell>
                                <TableCell style={{ width: '160px' }}>
                                  <TextField
                                    size="small"
                                    type="number"
                                    label="Price"
                                    min={0}
                                    onBlur={handleBlur}
                                    onClick={handleInputClick}
                                    onWheel={handleWheel}
                                    onChange={(e) => {
                                      const newPrice = Math.max(0, parseFloat(e.target.value) || 0);
                                      setFieldValue(
                                        `tempVariComboWithQuantity.${globalIndex}.price`,
                                        newPrice
                                      );
                                    }}
                                    name={`tempVariComboWithQuantity.${globalIndex}.price`}
                                    value={
                                      globalIndex !== -1
                                        ? getIn(
                                            values,
                                            `tempVariComboWithQuantity.${globalIndex}.price`
                                          ) || '0'
                                        : ''
                                    }
                                    error={
                                      globalIndex !== -1 &&
                                      !!(
                                        getIn(
                                          errors,
                                          `tempVariComboWithQuantity.${globalIndex}.price`
                                        ) &&
                                        getIn(
                                          touched,
                                          `tempVariComboWithQuantity.${globalIndex}.price`
                                        )
                                      )
                                    }
                                    helperText={
                                      globalIndex !== -1 &&
                                      getIn(
                                        touched,
                                        `tempVariComboWithQuantity.${globalIndex}.price`
                                      ) &&
                                      getIn(
                                        errors,
                                        `tempVariComboWithQuantity.${globalIndex}.price`
                                      )
                                        ? getIn(
                                            errors,
                                            `tempVariComboWithQuantity.${globalIndex}.price`
                                          )
                                        : ''
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
                                    onClick={handleInputClick}
                                    onWheel={handleWheel}
                                    onChange={(e) => {
                                      const newQuantity = Math.max(
                                        0,
                                        parseInt(e.target.value) || 0
                                      );
                                      setFieldValue(
                                        `tempVariComboWithQuantity.${globalIndex}.quantity`,
                                        newQuantity
                                      );
                                    }}
                                    id={`tempVariComboWithQuantity.${globalIndex}.quantity`}
                                    name={`tempVariComboWithQuantity.${globalIndex}.quantity`}
                                    value={
                                      globalIndex !== -1
                                        ? getIn(
                                            values,
                                            `tempVariComboWithQuantity.${globalIndex}.quantity`
                                          ) || '0'
                                        : ''
                                    }
                                    error={
                                      globalIndex !== -1 &&
                                      !!(
                                        getIn(
                                          errors,
                                          `tempVariComboWithQuantity.${globalIndex}.quantity`
                                        ) &&
                                        getIn(
                                          touched,
                                          `tempVariComboWithQuantity.${globalIndex}.quantity`
                                        )
                                      )
                                    }
                                    helperText={
                                      globalIndex !== -1 &&
                                      getIn(
                                        touched,
                                        `tempVariComboWithQuantity.${globalIndex}.quantity`
                                      ) &&
                                      getIn(
                                        errors,
                                        `tempVariComboWithQuantity.${globalIndex}.quantity`
                                      )
                                        ? getIn(
                                            errors,
                                            `tempVariComboWithQuantity.${globalIndex}.quantity`
                                          )
                                        : ''
                                    }
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </>
                    )}
                  </FieldArray>
                );
              })
            ) : (
              <TableRow sx={{ color: 'error.main', px: 2, fontSize: 'small' }}>
                <TableCell colSpan={3}>
                  {groupBy
                    ? 'No combinations available for selected group'
                    : 'No variations available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default memo(GroupBySection);
