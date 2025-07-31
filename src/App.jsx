import { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button
} from "@mui/material";
import QuotationTable from "./QuotationTable";

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 }
];

const LOCAL_KEY = "quotation_data";

function App() {
  const itemRef = useRef();
  const ppuRef = useRef();
  const qtyRef = useRef();
  const discountRef = useRef();

  const [dataItems, setDataItems] = useState([]);
  const [ppu, setPpu] = useState(products[0].price);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      setDataItems(JSON.parse(stored));
    } else {
      fetch("/data.json")
        .then((res) => res.json())
        .then((prefilled) => setDataItems(prefilled))
        .catch((err) => console.error("Failed to load data.json", err));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(dataItems));
  }, [dataItems]);

  const productChange = () => {
    let item = products.find((v) => itemRef.current.value === v.code);
    setPpu(item.price);
  };

  const addItem = () => {
    let selected = products.find((v) => itemRef.current.value === v.code);
    const newItem = {
      item: selected.name,
      ppu: Number(ppuRef.current.value),
      qty: Number(qtyRef.current.value),
      discount: Number(discountRef.current.value) || 0
    };

    const existingIndex = dataItems.findIndex(
      (v) => v.item === newItem.item && v.ppu === newItem.ppu
    );

    if (existingIndex !== -1) {
      let updatedItems = [...dataItems];
      updatedItems[existingIndex].qty += newItem.qty;
      updatedItems[existingIndex].discount += newItem.discount;
      setDataItems(updatedItems);
    } else {
      setDataItems([...dataItems, newItem]);
    }
  };

  const deleteByIndex = (index) => {
    const newData = [...dataItems];
    newData.splice(index, 1);
    setDataItems(newData);
  };

  const clearAll = () => setDataItems([]);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", my: "auto", px: 2, py: 4 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ textAlign: "center", fontFamily: "cursive" }}
      >
        Quotation App
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={10} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              backgroundColor: "#f9f9f9"
            }}
          >
            <TextField
              select
              label="Item"
              inputRef={itemRef}
              defaultValue={products[0].code}
              onChange={productChange}
              sx={{ mb: 1 }}
            >
              {products.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Price Per Unit"
              type="number"
              inputRef={ppuRef}
              value={ppu}
              onChange={(e) => setPpu(Number(e.target.value))}
              sx={{ mb: 1 }}
            />

            <TextField
              label="Quantity"
              type="number"
              inputRef={qtyRef}
              defaultValue={1}
              sx={{ mb: 1 }}
            />

            <TextField
              label="Discount"
              type="number"
              inputRef={discountRef}
              defaultValue={0}
              sx={{ mb: 1 }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={addItem}
              sx={{ fontWeight: "bold" }}
            >
              Add
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <QuotationTable
            data={dataItems}
            deleteByIndex={deleteByIndex}
            clearAll={clearAll}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
