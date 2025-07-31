import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';
import { debounce } from 'lodash';

const InfiniteScrollTable = ({
  dataSource,
  pageSize = 10,
  columns = [],
  renderRow,
  getRowKey,
  maxHeight = 440,
  scrollableTarget = 'scrollable-table-container',
  showEndMessage = true,
}) => {
  const [displayedItems, setDisplayedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (dataSource.length > 0) {
      setDisplayedItems(dataSource.slice(0, pageSize));
      setCurrentPage(1);
      setHasMore(dataSource.length > pageSize);
      setError(null);
    } else {
      setDisplayedItems([]);
      setCurrentPage(0);
      setHasMore(false);
    }
  }, [dataSource, pageSize]);

  const fetchMoreData = useCallback(
    debounce(() => {
      if (isLoading || currentPage * pageSize >= dataSource.length) {
        setHasMore(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          const start = currentPage * pageSize;
          const newItems = dataSource.slice(start, start + pageSize);
          setDisplayedItems((prevItems) => [...prevItems, ...newItems]);
          setCurrentPage((prevPage) => prevPage + 1);
          setHasMore((currentPage + 1) * pageSize < dataSource.length);
          setIsLoading(false);
        } catch (err) {
          setError('Failed to load more data');
          setIsLoading(false);
        }
      }, 300); // Further reduced delay for faster UX
    }, 300),
    [currentPage, pageSize, dataSource]
  );

  // Force scroll bar when more data is available
  const tableBodyMinHeight = hasMore || isLoading ? maxHeight + 50 : 'auto'; // Add padding to ensure scroll

  return (
    <InfiniteScroll
      dataLength={displayedItems.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={null}
      endMessage={null}
      scrollableTarget={scrollableTarget}
    >
      <TableContainer
        id={scrollableTarget}
        sx={{
          maxHeight,
          overflowY: hasMore || isLoading ? 'scroll' : 'auto', // Force scroll bar when more data
        }}
      >
        <Box sx={{ minHeight: maxHeight, display: 'flex', flexDirection: 'column' }}>
          <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell key={`column-${index}`} sx={{ width: column.width || 'auto' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{ minHeight: tableBodyMinHeight }}>
              {displayedItems.length > 0 ? (
                displayedItems.map((item, index) => renderRow(item, index))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No items available
                  </TableCell>
                </TableRow>
              )}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center' }}>
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell colSpan={columns.length} style={{ textAlign: 'center', color: 'red' }}>
                    {error}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </InfiniteScroll>
  );
};

export default React.memo(InfiniteScrollTable);
