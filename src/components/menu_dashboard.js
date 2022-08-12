import GroupIcon from "@mui/icons-material/Group";
import SellIcon from "@mui/icons-material/Sell";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

const stats = [
  {
    name: "Visitors",
    value: "1 000",
    icon: <VisibilityIcon />,
  },
  {
    name: "Members",
    value: "100",
    icon: <GroupIcon />,
  },
  {
    name: "Orders",
    value: "250",
    icon: <ShoppingCartIcon />,
  },
  {
    name: "Income",
    value: "10 500",
    icon: <SellIcon />,
  },
];

export default function StatsWithAvatar() {
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "background.default" : "grey.50",
        p: 4,
      }}
    >
      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item key={stat.name} xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography color="text.secondary" component="div">
                    {stat.name}
                  </Typography>
                  <Typography variant="h5" component="div">
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}