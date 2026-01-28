// src/pages/Profile.js
import React from "react";
import { Box, Typography, Paper, Avatar, Grid, Card, CardContent, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import SecurityIcon from "@mui/icons-material/Security";

const Profile = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.main",
                mx: "auto",
                mb: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom>
              João Silva
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Trader Sênior
            </Typography>
            <Typography variant="body2" color="textSecondary">
              BTG Pactual Crypto
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações da Conta
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle2">Email</Typography>
                    </Box>
                    <Typography>joao.silva@btgpactual.com</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle2">Telefone</Typography>
                    </Box>
                    <Typography>+55 (11) 99999-9999</Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <SecurityIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle2">Nível de Acesso</Typography>
                    </Box>
                    <Typography>Trader Sênior</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button variant="contained">
                Editar Perfil
              </Button>
              <Button variant="outlined">
                Alterar Senha
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
