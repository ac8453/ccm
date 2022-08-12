import React from 'react';
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from 'react-router-dom';

function Footer(props) {
  const navigate = useNavigate();
  const categories = [
    { header: "Main", links: ["Home", "Products", "Pricing"], route: ['/', '/products', 'pricing'] },
    { header: "About", links: ["Project", "Contact"], route: ['/about', '/about'] },
    { header: "CCM", links: ["Customer Login"], route: ['/app'] },
  ];

  return (
    <Box component="footer">
      <Container maxWidth="lg">
      <Divider />

        <Grid container spacing={3} sx={{ py: 8 }}>
          <Grid item xs={12} md={6}>
            CCM
            <Typography color="text.secondary" sx={{ mt: 2 }} variant="body2">
              Cloud Capacity Manager
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </Grid>
          {categories.map((category) => (
            <Grid key={category.header} item xs={12} md={2}>
              <Stack spacing={1}>
                <Typography component="div" variant="h6" align='center'>
                  {category.header}
                </Typography>
                {category.links.map((link, index) => (
                  <Button
                    color="text.secondary"
                    key={link}
                    underline="none"
                    variant="body2"
                    onClick={() => navigate(category.route[index])}
                  >
                    {link}
                  </Button>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider />
        <Box
          sx={{
            textAlign: "center",
            py: 3,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            Cloud Capacity Manager &reg; {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;