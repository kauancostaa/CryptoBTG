import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const Dashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [portfolioData, setPortfolioData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Dados para gráfico de pizza
  const allocationData = [
    { name: "BTC", value: 35, color: "#F7931A" },
    { name: "ETH", value: 25, color: "#627EEA" },
    { name: "BTG", value: 40, color: "#00A79D" },
  ];

  // Dados para gráfico de barras (performance)
  const performanceData = [
    { name: "Jan", btc: 40000, eth: 2200, btg: 50 },
    { name: "Fev", btc: 42000, eth: 2400, btg: 52 },
    { name: "Mar", btc: 41000, eth: 2300, btg: 51 },
    { name: "Abr", btc: 43000, eth: 2500, btg: 53 },
    { name: "Mai", btc: 44000, eth: 2400, btg: 54 },
    { name: "Jun", btc: 45234, eth: 2534, btg: 56.78 },
  ];

  useEffect(() => {
    // Dados mockados
    const mockMarketData = [
      { symbol: "BTCUSD", price: 45234.56, change: 2.34, volume: 28500000000 },
      { symbol: "ETHUSD", price: 2534.67, change: 1.56, volume: 12500000000 },
      { symbol: "BTGBRL", price: 56.78, change: 0.89, volume: 1200000000 },
    ];

    const mockPortfolioData = {
      totalValue: 1250000,
      todayChange: 5.2,
      totalPL: 250000,
      plPercentage: 8.0,
      assetsCount: 3,
      systemStatus: 100,
    };

    // Simular loading
    setTimeout(() => {
      setMarketData(mockMarketData);
      setPortfolioData(mockPortfolioData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh" 
      }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Carregando CryptoBTG Dashboard...
          </Typography>
          <LinearProgress sx={{ width: 300 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        CryptoBTG Professional
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Sistema de trading cripto do BTG Pactual • Última atualização: {new Date().toLocaleTimeString()}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Saldo Total
              </Typography>
              <Typography variant="h5">{formatCurrency(portfolioData.totalValue)}</Typography>
              <Typography variant="body2" color="success.main">
                +{portfolioData.todayChange}% hoje
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                P&L Total
              </Typography>
              <Typography variant="h5">{formatCurrency(portfolioData.totalPL)}</Typography>
              <Typography variant="body2" color="success.main">
                {portfolioData.plPercentage}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Ativos
              </Typography>
              <Typography variant="h5">{portfolioData.assetsCount}</Typography>
              <Typography variant="body2" color="textSecondary">
                Criptomoedas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Status Sistema
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" sx={{ mr: 1 }}>
                  {portfolioData.systemStatus}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={portfolioData.systemStatus} 
                  sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography color="textSecondary" variant="body2" gutterBottom>
                Alocação do Portfolio
              </Typography>
              <Box sx={{ height: 200, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Alocação"]} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <ShowChartIcon sx={{ mr: 1 }} /> Performance dos Ativos
            </Typography>
            <Box sx={{ height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Preço"]} />
                  <Legend />
                  <Bar dataKey="btc" name="Bitcoin (BTC)" fill="#F7931A" />
                  <Bar dataKey="eth" name="Ethereum (ETH)" fill="#627EEA" />
                  <Bar dataKey="btg" name="BTG Token" fill="#00A79D" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Preços do Mercado
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Ativo</strong></TableCell>
                    <TableCell><strong>Preço (USD)</strong></TableCell>
                    <TableCell><strong>Variação 24h</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketData.map((coin) => (
                    <TableRow key={coin.symbol} hover>
                      <TableCell>
                        <Typography variant="subtitle1"><strong>{coin.symbol}</strong></Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1">
                          {formatCurrency(coin.price)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {coin.change >= 0 ? (
                            <TrendingUpIcon color="success" fontSize="small" />
                          ) : (
                            <TrendingDownIcon color="error" fontSize="small" />
                          )}
                          <Typography variant="body1" color={coin.change >= 0 ? "success.main" : "error.main"}>
                            {coin.change >= 0 ? "+" : ""}{coin.change}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ordens Recentes
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>ORD-001</TableCell>
                    <TableCell>BTCUSD</TableCell>
                    <TableCell><Typography color="success.main">Compra</Typography></TableCell>
                    <TableCell>0.5</TableCell>
                    <TableCell>{formatCurrency(44000)}</TableCell>
                    <TableCell>{formatCurrency(22000)}</TableCell>
                    <TableCell><Typography color="success.main">Concluída</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ORD-002</TableCell>
                    <TableCell>ETHUSD</TableCell>
                    <TableCell><Typography color="error.main">Venda</Typography></TableCell>
                    <TableCell>10</TableCell>
                    <TableCell>{formatCurrency(2550)}</TableCell>
                    <TableCell>{formatCurrency(25500)}</TableCell>
                    <TableCell><Typography color="success.main">Concluída</Typography></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ORD-003</TableCell>
                    <TableCell>BTGBRL</TableCell>
                    <TableCell><Typography color="success.main">Compra</Typography></TableCell>
                    <TableCell>1000</TableCell>
                    <TableCell>{formatCurrency(55)}</TableCell>
                    <TableCell>{formatCurrency(55000)}</TableCell>
                    <TableCell><Typography color="warning.main">Pendente</Typography></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
