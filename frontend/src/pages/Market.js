import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

const Market = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Dados mockados - substituir por API real
    const mockData = [
      { 
        id: 1, 
        symbol: "BTCUSD", 
        name: "Bitcoin", 
        price: 45234.56, 
        change24h: 2.34, 
        volume: 28500000000,
        marketCap: 886000000000,
        high24h: 45500.00,
        low24h: 44800.00
      },
      { 
        id: 2, 
        symbol: "ETHUSD", 
        name: "Ethereum", 
        price: 2534.67, 
        change24h: 1.56, 
        volume: 12500000000,
        marketCap: 305000000000,
        high24h: 2550.00,
        low24h: 2500.00
      },
      { 
        id: 3, 
        symbol: "BTGBRL", 
        name: "BTG Pactual Token", 
        price: 56.78, 
        change24h: 0.89, 
        volume: 1200000000,
        marketCap: 5678000000,
        high24h: 57.20,
        low24h: 55.90
      },
      { 
        id: 4, 
        symbol: "SOLUSD", 
        name: "Solana", 
        price: 102.45, 
        change24h: 5.23, 
        volume: 3400000000,
        marketCap: 44200000000,
        high24h: 105.00,
        low24h: 98.50
      },
      { 
        id: 5, 
        symbol: "XRPUSD", 
        name: "Ripple", 
        price: 0.62, 
        change24h: -0.45, 
        volume: 2800000000,
        marketCap: 33600000000,
        high24h: 0.63,
        low24h: 0.61
      },
      { 
        id: 6, 
        symbol: "ADAUSD", 
        name: "Cardano", 
        price: 0.52, 
        change24h: 0.78, 
        volume: 650000000,
        marketCap: 18500000000,
        high24h: 0.53,
        low24h: 0.51
      },
    ];

    // Simular loading
    setTimeout(() => {
      setMarketData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredData = marketData.filter(
    (coin) =>
      coin.symbol.toLowerCase().includes(search.toLowerCase()) ||
      coin.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return "$" + (num / 1000000000).toFixed(2) + "B";
    }
    if (num >= 1000000) {
      return "$" + (num / 1000000).toFixed(2) + "M";
    }
    return "$" + num.toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Carregando dados do mercado...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
          Mercado Cripto
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Cotaes em tempo real e anlise de mercado
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar criptomoeda (ex: BTC, Ethereum)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Ativo</strong></TableCell>
                <TableCell><strong>Preo (USD)</strong></TableCell>
                <TableCell><strong>Variao 24h</strong></TableCell>
                <TableCell><strong>Volume 24h</strong></TableCell>
                <TableCell><strong>Market Cap</strong></TableCell>
                <TableCell><strong>Alta/Baixa 24h</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((coin) => (
                <TableRow key={coin.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ mr: 2 }}>
                        <Typography variant="subtitle1"><strong>{coin.symbol}</strong></Typography>
                        <Typography variant="caption" color="textSecondary">{coin.name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      <strong>${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={coin.change24h >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={`${coin.change24h >= 0 ? "+" : ""}${coin.change24h.toFixed(2)}%`}
                      color={coin.change24h >= 0 ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{formatNumber(coin.volume)}</TableCell>
                  <TableCell>{formatNumber(coin.marketCap)}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      ${coin.high24h.toLocaleString()} / ${coin.low24h.toLocaleString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 2, display: "block" }}>
          Mostrando {filteredData.length} de {marketData.length} ativos  Atualizado a cada 30s
        </Typography>
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
              Insights do Mercado
          </Typography>
          <Typography variant="body2" paragraph>
             Bitcoin domina 45% do mercado total
          </Typography>
          <Typography variant="body2" paragraph>
             Volume total 24h: $85.2B
          </Typography>
          <Typography variant="body2" paragraph>
             78% dos ativos em alta nas ltimas 24h
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
              Alertas de Mercado
          </Typography>
          <Typography variant="body2" paragraph>
             BTC ultrapassou resistncia em $45,000
          </Typography>
          <Typography variant="body2" paragraph>
             Volume ETH em alta de 15%
          </Typography>
          <Typography variant="body2">
             BTG Token com valorizao consistente
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Market;



