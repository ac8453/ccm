import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from '@mui/icons-material/Send';
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
import React from "react";

const rowsPerPage = 10;

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
  },
];

function ActionMenu(props) {
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
        onClick={(e) => handleClick(e)}
      >
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
          }}
        >
          <MenuItem onClick={() => handleClose}>
            <ListItemIcon>
              <SendIcon fontSize="small" />
            </ListItemIcon>
            Share
          </MenuItem>
          <MenuItem onClick={() => props.handleShowProducts(props.portfolio)}>
            <ListItemIcon>
              <ContentPasteSearchIcon fontSize="small" />
            </ListItemIcon>
            View Products
          </MenuItem>
          <MenuItem onClick={() => handleClose}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            Edit
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

export default function ScPortfolios(props) {
  const [page, setPage] = React.useState(0);
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.portfolios.length) : 0;
  return (<>
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.default" : "grey.50",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography id="userTitle" variant="h4" component="h1">
          Portfolios
        </Typography>
        <Button variant="contained" disabled>Create Portfolio</Button>
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
              {props.portfolios
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((portfolio) => (
                  <TableRow tabIndex={-1} key={portfolio.Id}>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ ml: 2 }}>
                          <Typography component="div" variant="inherit">
                            {portfolio.DisplayName}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            component="div"
                            variant="caption"
                          >
                            {portfolio.Id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{portfolio.Description}</TableCell>
                    <TableCell>{portfolio.ProviderName}</TableCell>
                    <TableCell>{portfolio.CreatedTime}</TableCell>
                    <TableCell align="right">
                      <ActionMenu
                        handleShowProducts={props.handleShowProducts}
                        portfolio={portfolio}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={props.portfolios.length}
          rowsPerPageOptions={[rowsPerPage]}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={() => handleChangePage}
        />
      </Paper>
    </Box>
  </>
  );
}