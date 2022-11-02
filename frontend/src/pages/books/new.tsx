import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";
import MarkdownEditor from "../../components/inputs/MarkdownEditor";

const NewBook: NextPage = () => {
  const [description, setDescription] = useState("");
  return (
    <Grid container justifyContent="center">
      <Grid container columnSpacing={8} rowSpacing={4} md={8}>
        <Grid item xs={12}>
          <Typography variant="h4" pt={3}>
            Post a book
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Title" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Author Name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">USD</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <MarkdownEditor
            height={400}
            label="Description"
            value={description}
            onChange={setDescription as any}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewBook;
// {
//   id: string;
//   title: string;
//   description: string;
//   authorName: string;
//   price: number;
//   imageUrl: string;
//   sellerId: string;
//   createdAt: Date;
//   orderId?: string;
// }
