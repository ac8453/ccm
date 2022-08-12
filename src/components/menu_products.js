
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import ActionMenu from "./action_menu_products";
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
import AddProduct from "./addProduct";

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


const MenuProducts = () => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [products, setProducts] = useState([])
    const [showMore, setShowMore] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false)

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchAllProducts = useCallback(async () => {
        const initialState = await JSON.parse(window.localStorage.getItem('ccm-user-state'))
        try {
            const allProductsData = await API
                .post('ccmGTestApiLambda', '/products/all',
                    {
                        body: { "accountId": initialState.accountId, "externalId": initialState.externalId },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
            setProducts(allProductsData.ProductViewSummaries)
        }
        catch (err) {
            console.log('error fetching products:', err)
        }
    }, [])

    useEffect(() => {
        fetchAllProducts()
    }, [fetchAllProducts])

    const handleShowAddProduct = () => {
        setShowAddProduct(true)
    }
    const handleCloseAddProduct = () => {
        setShowAddProduct(false)
    }
    const handleToggleDetails = () => {
        setShowMore(!showMore)
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;
    return (
        <>
            {showAddProduct && <>
                <AddProduct showAddProduct={showAddProduct} handleCloseAddProduct={handleCloseAddProduct} />
            </>}
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
                        Available Resources
                    </Typography>
                    <Button onClick={handleToggleDetails}>{showMore ? "Hide details" : "Show details"}</Button>
                    <Button variant="contained" onClick={(e) => handleShowAddProduct(e)}>Add Product</Button>
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
                            <TableBody>{console.log("Fetched products from Service Catalog: ", products)}
                                {products.length > 0 ? <>
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
                                        ))}</> : <><TableRow
                                            style={{
                                                height: 53 * emptyRows,
                                            }}>
                                            <TableCell colSpan={6}><Typography align='center'>No products</Typography></TableCell>
                                        </TableRow></>}
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
                        onRowsPerPageChange={handleChangeRowsPerPage} />
                </Paper>
            </Box></>
    )
}

export default MenuProducts