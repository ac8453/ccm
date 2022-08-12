import CloudIcon from "@mui/icons-material/CloudOutlined";
import CodeIcon from "@mui/icons-material/Code";
import GppGoodIcon from "@mui/icons-material/GppGoodOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { blue } from "@mui/material/colors";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";

const features = [
  {
    title: "Development",
    description: "Increase your development teams agility by using our user-friendly cloud capacity manager",
    icon: <CodeIcon fontSize="large" />,
  },
  {
    title: "Cost-efficiency",
    description: "Cheap service thanks to serverless infrastructure",
    icon: <CloudIcon fontSize="large" />,
  },
  {
    title: "Security",
    description: "All your sensitive data is encrypted in transit and at rest.",
    icon: <GppGoodIcon fontSize="large" />,
  },
];

export default function Products() {
  return (
    <Box component="section" sx={{ bgcolor: blue[800] }}>
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Card sx={{ py: 6 }}>
          <CardContent>
            <Typography
              align="center"
              component="h2"
              sx={{ mb: 6 }}
              variant="h4"
            >
              Key Features
            </Typography>
            <Grid container spacing={3}>
              {features.map((feature) => (
                <Grid key={feature.title} item xs={12} md={4}>
                  <Card
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "background.default"
                          : "grey.100",
                    }}
                    variant="outlined"
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {feature.icon}
                      <Typography component="div" sx={{ mt: 2 }} variant="h6">
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}