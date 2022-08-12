import React from "react";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function ActionMenu() {
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