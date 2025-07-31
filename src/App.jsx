import { useState, useRef, useEffect } from "react";
import {
  Box, Grid, Button, TextField, MenuItem, Paper, Typography
} from "@mui/material";
import QuotationTable from "./QuotationTable";

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 },
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
        .then((prefilled) => {
          setDataItems(prefilled);
        })
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
      discount: Number(discountRef.current.value) || 0,
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
    <Box sx={{ maxWidth: 1280, mx: "auto", p: 3 }}>
      <Typography variant="h3" gutterBottom>Quotation App</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, backgroundColor: "#f4f4f4" }}>
            <TextField
              select
              fullWidth
              label="Item"
              inputRef={itemRef}
              defaultValue={products[0].code}
              onChange={productChange}
              sx={{ mb: 2 }}
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
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Quantity"
              type="number"
              inputRef={qtyRef}
              defaultValue={1}
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Discount"
              type="number"
              inputRef={discountRef}
              defaultValue={0}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button variant="contained" fullWidth onClick={addItem}>
              Add to Quotation
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <QuotationTable data={dataItems} deleteByIndex={deleteByIndex} clearAll={clearAll} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
