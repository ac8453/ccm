import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { API } from 'aws-amplify';
import React, { useCallback, useEffect, useState } from "react";

const headCells = [
  {
    id: "name",
    label: "Name",
    width: '200'
  },
  {
    id: "desc",
    label: "Description",
  },
  {
    id: "provider",
    label: "Created By",
    width: '150'
  },
  {
    id: "date",
    label: "Created Date",
    width: '120'
  },
];

function ActionMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="action-button"
        aria-label="menu"
        aria-controls={open ? "action-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(e) => handleClick(e)}>
     
        <MoreVertIcon />
      </IconButton>
      {anchorEl ?
        <Menu
          id="action-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "action-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <MenuItem onClick={() => handleClose}>
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            Copy to Project
          </MenuItem>
          <MenuItem onClick={() => handleClose}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
        : <></>}
    </div>
  );
}

export default function ScProducts(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [products, setProducts] = useState([])
  const [showMore, setShowMore] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const fetchProducts = useCallback(async () => {
    const productsData = await API
      .post('ccmGTestApiLambda', '/products/list',
        {
          body: { "accountId": props.accountId, "externalId": props.externalId, "portfolio": props.portfolio.Id },
          headers: {
            "Content-Type": "application/json"
          }
        })
    setProducts(productsData.ProductViewDetails)
  }, [props.accountId, props.externalId, props.portfolio.Id])
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;
  return (<>
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.default" : "grey.50",
        p: 4,
      }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}>
     
        <Typography id="userTitle" variant="h4" component="h1">
          Products for {props.portfolio.DisplayName}
        </Typography>
        <Button>Go Back</Button>
        <Button onClick={() => setShowMore(!showMore)}>{showMore ? "Hide details" : "Show details"}</Button>
        <Button variant="contained">Add Product</Button>
      </Box>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="userTitle">

            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell key={headCell.id} align={headCell.align} width={headCell.width}>
                    {headCell.label}
                  </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow tabIndex={-1} key={product.ProductViewSummary.Id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <Box sx={{ ml: 2 }}>
                          <Typography component="div" variant="inherit">
                            {product.ProductViewSummary.Name}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            component="div"
                            variant="caption">
                            {product.ProductViewSummary.Id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {showMore ? <>{product.ProductViewSummary.ShortDescription} <br /><br /> {product.ProductViewSummary.SupportDescription}</> :
                        `${product.ProductViewSummary.ShortDescription.substring(0, 140)}`}
                      {product.ProductViewSummary.ShortDescription.length > 140 && <>... </>}
                    </TableCell>
                    <TableCell>{product.ProductViewSummary.Owner}</TableCell>
                    <TableCell>{product.CreatedTime.substring(0, product.CreatedTime.indexOf('T'))}</TableCell>
                    <TableCell align="right">
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}>
                  <TableCell colSpan={6}><Typography align='center'>No products</Typography></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={products.length}
          rowsPerPageOptions={[rowsPerPage]}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box></>
  );
}