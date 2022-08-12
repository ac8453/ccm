import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React from "react";

const pricings = [
  {
    price: "Free",
    title: "START",
    features: ["1 Month Free Access", "1 AWS Admin Account", "No End Users"],
    best: false,
  },
  {
    price: "$9.99",
    title: "PRO",
    features: ["Monthly subscription", "1 AWS Admin Account", "10 End Users"],
    best: true,
  },
  {
    price: "$99",
    title: "ENTERPRISE",
    features: ["Monthly subcription", "1 AWS Admin Account", "100 End Users"],
    best: false,
  }
];

export default function ThreeColumnCardsFeatures() {
  return (
    <Box component="section">
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: "center", mb: 10 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Pricing
          </Typography>
          <Typography color="text.secondary" component="div">
            Cloud Capacity Management is currently in alpha stage. Enjoy free testing. Subcriptions are currently disabled and prices may change.
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {pricings.map((pricing) => (
            <Grid key={pricing.title} item xs={12} md={4}>
              <Card
                sx={{
                  borderColor: pricing.best ? "primary.main" : undefined,
                  position: "relative",
                }}
                variant="outlined"
              >
                <CardContent>
                  {pricing.best && (
                    <Typography
                      sx={{
                        px: 1,
                        lineHeight: 2,
                        borderBottomLeftRadius: 4,
                        position: "absolute",
                        right: 0,
                        top: 0,
                        bgcolor: "primary.main",
                        color: "background.default",
                      }}
                      variant="caption"
                    >
                      Best value
                    </Typography>
                  )}
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                    sx={{ letterSpacing: "1.5px", mb: 1 }}
                  >
                    {pricing.title}
                  </Typography>
                  <Typography sx={{ mb: 4 }} variant="h4">
                    {pricing.price}
                  </Typography>
                  <Stack direction="column" spacing={2} sx={{ mb: 4 }}>
                    {pricing.features.map((feature) => (
                      <Box
                        key={feature}
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        {feature}
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    variant={pricing.best ? "contained" : "outlined"}
                    
                  >
                    Buy Now
                  </Button>
                  <Typography
                    component="div"
                    variant="caption"
                    sx={{ mt: 1, color: "text.secondary" }}
                  >
                    * VAT Included
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}