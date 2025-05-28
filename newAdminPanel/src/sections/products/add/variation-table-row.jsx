import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableContainer } from '@mui/material';

// ----------------------------------------------------------------------

export default function VariationTableRow({ row, srNo }) {
  const { variationName, variationTypes } = row;
  return (
    <TableRow>
      <TableCell>
        <Typography variant="subtitle2" noWrap>
          {srNo}
        </Typography>
      </TableCell>

      <TableCell>{variationName}</TableCell>

      <TableCell padding="none">
        {variationTypes?.map((cell, i) => (
          <TableContainer
            key={`variation-table-row-${i}`}
            sx={{ overflow: 'unset', display: 'flex', justifyContent: 'space-between' }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell width={'100%'}>
                    <Typography variant="subtitle2" noWrap>
                      {cell?.variationTypeName}{' '}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ))}
      </TableCell>
    </TableRow>
  );
}
