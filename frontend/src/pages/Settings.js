// src/pages/Settings.js
import React from "react";
import { Box, Typography, Paper, Grid, Switch, FormControlLabel, TextField, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import LanguageIcon from "@mui/icons-material/Language";

const Settings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <NotificationsIcon sx={{ mr: 1 }} /> Notificações
            </Typography>
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Notificações por email"
              sx={{ display: "block", mb: 2 }}
            />
            
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Alertas de mercado"
              sx={{ display: "block", mb: 2 }}
            />
            
            <FormControlLabel
              control={<Switch />}
              label="Notificações de ordens"
              sx={{ display: "block", mb: 2 }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <SecurityIcon sx={{ mr: 1 }} /> Segurança
            </Typography>
            
            <TextField
              fullWidth
              label="Autenticação de dois fatores"
              defaultValue="Ativada"
              margin="normal"
              disabled
            />
            
            <TextField
              fullWidth
              label="Último login"
              defaultValue="Hoje, 14:30"
              margin="normal"
              disabled
            />
            
            <Button variant="outlined" sx={{ mt: 2 }}>
              Gerenciar dispositivos
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <LanguageIcon sx={{ mr: 1 }} /> Preferências
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Moeda padrão"
                  defaultValue="USD"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fuso horário"
                  defaultValue="America/Sao_Paulo"
                  margin="normal"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" sx={{ mr: 2 }}>
                Salvar Alterações
              </Button>
              <Button variant="outlined">
                Cancelar
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
