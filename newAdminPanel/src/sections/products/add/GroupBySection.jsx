import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { FieldArray, getIn } from 'formik';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Stack,
  TableHead,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { helperFunctions } from 'src/_helpers';
import { PRICE_CALCULATION_MODES } from 'src/_helpers/constants';
import Switch from 'src/components/switch';
import InfiniteScrollTable from 'src/components/Infinite-scroll-table/InfiniteScrollTable';

const GroupBySection = ({ formik, groupTableHeight = 200 }) => {
  const { customizationTypesList, customizationSubTypesList } = useSelector(
    ({ product }) => product
  );
  const { priceMultiplier } = useSelector(({ settings }) => settings);

  const { values, handleBlur, setFieldValue, errors, touched } = formik;
  const [expandedGroups, setExpandedGroups] = useState({});
  const [groupBy, setGroupBy] = useState('');
  const isGroupByInitialized = useMemo(() => ({ current: false }), []);

  const customizations = useMemo(
    () => ({
      customizationType: customizationTypesList,
      customizationSubType: customizationSubTypesList,
    }),
    [customizationTypesList, customizationSubTypesList]
  );

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

  const getGroupPriceInfo = useCallback((groupItems) => {
    if (!groupItems || groupItems.length === 0) {
      return { minPrice: 0, maxPrice: 0, hasDifferentPrices: false };
    }
    const prices = groupItems.map((item) => parseFloat(item.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasDifferentPrices = minPrice !== maxPrice;
    return { minPrice, maxPrice, hasDifferentPrices };
  }, []);

  const getGroupQuantityInfo = useCallback((groupItems) => {
    if (!groupItems || groupItems.length === 0) {
      return { minQuantity: 0, maxQuantity: 0, hasDifferentQuantities: false };
    }
    const quantities = groupItems.map((item) => parseInt(item.quantity) || 0);
    const minQuantity = Math.min(...quantities);
    const maxQuantity = Math.max(...quantities);
    const hasDifferentQuantities = minQuantity !== maxQuantity;
    return { minQuantity, maxQuantity, hasDifferentQuantities };
  }, []);

  const toggleGroup = useCallback((groupKey) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  }, []);

  const handleGroupHeaderChange = useCallback(
    (groupKey, field, value) => {
      const groupItems = groupedData[groupKey];
      if (!groupItems || groupItems.length === 0) {
        console.warn(`No group items found for groupKey: ${groupKey}`);
        return;
      }

      // Batch updates for all items in the group for the specified field (price or quantity)
      groupItems.forEach((item) => {
        const subIndex = values.tempVariComboWithQuantity.findIndex((i) => i === item);
        if (subIndex !== -1) {
          setFieldValue(`tempVariComboWithQuantity.${subIndex}.${field}`, value);
        } else {
          console.warn(`No matching item found in tempVariComboWithQuantity for id: ${item.id}`);
        }
      });
    },
    [groupedData, values.tempVariComboWithQuantity, setFieldValue]
  );

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

  const handleCalculatePriceModeChange = useCallback(
    ({ values, setFieldValue }) => {
      const newMode =
        values.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC
          ? PRICE_CALCULATION_MODES.MANUAL
          : PRICE_CALCULATION_MODES.AUTOMATIC;
      setFieldValue('priceCalculationMode', newMode);
      if (newMode === PRICE_CALCULATION_MODES.AUTOMATIC) {
        const updatedCombinations = helperFunctions.calculateAutomaticPrices({
          combinations: values.tempVariComboWithQuantity,
          customizationSubTypesList,
          grossWeight: values.grossWeight,
          totalCaratWeight: values.totalCaratWeight,
          priceMultiplier,
        });
        setFieldValue('tempVariComboWithQuantity', updatedCombinations);
      }
    },
    [customizationSubTypesList, priceMultiplier]
  );

  const renderGroupItem = useCallback(
    (variCombiItem, index) => {
      const otherSubVariant =
        variCombiItem.combination
          ?.filter((combi) => combi.variationName !== groupBy)
          ?.map((x) => x?.variationTypeName)
          ?.join(' / ') || '-';
      const globalIndex = values.tempVariComboWithQuantity.findIndex(
        (item) => item === variCombiItem
      );

      return (
        <TableRow key={`temp-combination-${variCombiItem?.id || index}`}>
          <TableCell>
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px' }}>
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
                setFieldValue(`tempVariComboWithQuantity.${globalIndex}.price`, newPrice);
              }}
              name={`tempVariComboWithQuantity.${globalIndex}.price`}
              value={
                globalIndex !== -1
                  ? getIn(values, `tempVariComboWithQuantity.${globalIndex}.price`) || '0'
                  : ''
              }
              error={
                globalIndex !== -1 &&
                !!(
                  getIn(errors, `tempVariComboWithQuantity.${globalIndex}.price`) &&
                  getIn(touched, `tempVariComboWithQuantity.${globalIndex}.price`)
                )
              }
              helperText={
                globalIndex !== -1 &&
                getIn(touched, `tempVariComboWithQuantity.${globalIndex}.price`) &&
                getIn(errors, `tempVariComboWithQuantity.${globalIndex}.price`)
                  ? getIn(errors, `tempVariComboWithQuantity.${globalIndex}.price`)
                  : ''
              }
              disabled={values?.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC}
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
                const newQuantity = Math.max(0, parseInt(e.target.value) || 0);
                setFieldValue(`tempVariComboWithQuantity.${globalIndex}.quantity`, newQuantity);
              }}
              id={`temp-combination-${variCombiItem?.id || index}`}
              name={`tempVariComboWithQuantity.${globalIndex}.quantity`}
              value={
                globalIndex !== -1
                  ? getIn(values, `tempVariComboWithQuantity.${globalIndex}.quantity`) || '0'
                  : ''
              }
              error={
                globalIndex !== -1 &&
                !!(
                  getIn(errors, `tempVariComboWithQuantity.${globalIndex}.quantity`) &&
                  getIn(touched, `tempVariComboWithQuantity.${globalIndex}.quantity`)
                )
              }
              helperText={
                globalIndex !== -1 &&
                getIn(touched, `tempVariComboWithQuantity.${globalIndex}.quantity`) &&
                getIn(errors, `tempVariComboWithQuantity.${globalIndex}.quantity`)
                  ? getIn(errors, `tempVariComboWithQuantity.${globalIndex}.quantity`)
                  : ''
              }
            />
          </TableCell>
        </TableRow>
      );
    },
    [values, errors, touched, handleBlur, handleInputClick, handleWheel, setFieldValue, groupBy]
  );

  const columns = useMemo(
    () => [
      { label: 'Variants', width: '50%' },
      { label: 'Price', width: '30%' },
      { label: 'Quantity', width: '20%' },
    ],
    []
  );

  const renderTable = () => (
    <Box
      sx={{
        mb: 2,
        overflowY: 'auto',
      }}
    >
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell key={`column-${index}`} style={{ width: column.width }}>
                <Typography variant="subtitle2">{column.label}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(groupedData).length > 0 ? (
            <FieldArray name="tempVariComboWithQuantity">
              {() =>
                Object.keys(groupedData).map((groupKey, groupIndex) => {
                  const groupItems = groupedData[groupKey] || [];
                  const mainVariantIndex =
                    groupItems.length > 0
                      ? values.tempVariComboWithQuantity.findIndex((item) => item === groupItems[0])
                      : -1;
                  const { minPrice, maxPrice, hasDifferentPrices } = getGroupPriceInfo(groupItems);
                  const { minQuantity, maxQuantity, hasDifferentQuantities } =
                    getGroupQuantityInfo(groupItems);

                  return (
                    <React.Fragment key={`group-${groupKey}`}>
                      <TableRow>
                        <TableCell>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                              {groupKey}
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
                                getIn(errors, `tempVariComboWithQuantity.${mainVariantIndex}.price`)
                                  ? getIn(
                                      errors,
                                      `tempVariComboWithQuantity.${mainVariantIndex}.price`
                                    )
                                  : ''
                              }
                              disabled={
                                values?.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC
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
                      {expandedGroups[groupKey] && (
                        <TableRow>
                          <TableCell colSpan={3} sx={{ padding: 0 }}>
                            <InfiniteScrollTable
                              dataSource={groupItems}
                              pageSize={10}
                              renderRow={renderGroupItem}
                              getRowKey={(item, index) => `item-${item?.id || index}`}
                              maxHeight={groupTableHeight}
                              scrollableTarget={`scrollable-group-${groupKey}`}
                              showEndMessage={false}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
              }
            </FieldArray>
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
    </Box>
  );

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          my: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
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
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                name="priceCalculationMode"
                sx={{ mx: 1 }}
                checked={values.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC}
                onBlur={handleBlur}
                onChange={() => handleCalculatePriceModeChange({ values, setFieldValue })}
              />
            }
            label={
              values?.priceCalculationMode === PRICE_CALCULATION_MODES.AUTOMATIC
                ? 'Automatic Pricing'
                : 'Manual Pricing'
            }
          />
        </FormGroup>
      </Box>
      <Stack spacing={2}>{renderTable()}</Stack>
    </Stack>
  );
};

export default memo(GroupBySection);
