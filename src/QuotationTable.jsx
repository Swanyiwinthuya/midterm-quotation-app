import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  Paper,
  TableContainer,
  IconButton
} from "@mui/material";
import { MdClear } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";
import { CiShoppingCart } from "react-icons/ci";

function QuotationTable({ data, deleteByIndex, clearAll }) {
  if (!data || data.length === 0) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          border: "1px solid #ccc",
          borderRadius: 2,
          backgroundColor: "#fff",
          minHeight: "200px"
        }}
      >
        <Typography variant="h5">Quotation</Typography>
        <Typography color="text.secondary">
          <CiShoppingCart /> No items added
        </Typography>
      </Paper>
    );
  }

  const totalDiscount = data.reduce((acc, v) => acc + v.discount, 0);
  const total = data.reduce((acc, v) => acc + v.qty * v.ppu - v.discount, 0);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: "1px solid #ccc",
        borderRadius: 2,
        backgroundColor: "#fff"
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Quotation</Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={clearAll}
          startIcon={<MdClear />}
        >
          Clear
        </Button>
      </Box>

      <TableContainer sx={{ maxHeight: 300 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Price/Unit</TableCell>
              <TableCell align="center">Discount</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((v, i) => {
              const amount = v.qty * v.ppu - v.discount;
              return (
                <TableRow key={i}>
                  <TableCell>
                    <IconButton
                      onClick={() => deleteByIndex(i)}
                      size="small"
                      color="error"
                    >
                      <BsFillTrashFill size={16} />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">{v.qty}</TableCell>
                  <TableCell>{v.item}</TableCell>
                  <TableCell align="center">{v.ppu.toFixed(2)}</TableCell>
                  <TableCell align="center">{v.discount.toFixed(2)}</TableCell>
                  <TableCell align="right">{amount.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell align="center">
                <strong>{totalDiscount.toFixed(2)}</strong>
              </TableCell>
              <TableCell align="right">
                <strong>{total.toFixed(2)}</strong>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default QuotationTable;
