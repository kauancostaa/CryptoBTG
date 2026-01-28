import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PieChartIcon from "@mui/icons-material/PieChart";

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    asset: "BTCUSD",
    type: "buy",
    amount: 0,
    price: 0,
  });

  const assets = [
    { symbol: "BTCUSD", name: "Bitcoin", color: "#F7931A" },
    { symbol: "ETHUSD", name: "Ethereum", color: "#627EEA" },
    { symbol: "BTGBRL", name: "BTG Token", color: "#00A79D" },
    { symbol: "SOLUSD", name: "Solana", color: "#00FFA3" },
  ];

  useEffect(() => {
    // Dados mockados do portflio
    const mockPortfolio = {
      totalValue: 1250000,
      totalInvested: 1000000,
      profitLoss: 250000,
      profitLossPercentage: 25,
      assets: [
        { symbol: "BTCUSD", amount: 5.2, avgPrice: 40000, currentPrice: 45234.56, allocation: 35 },
        { symbol: "ETHUSD", amount: 40.5, avgPrice: 2200, currentPrice: 2534.67, allocation: 25 },
        { symbol: "BTGBRL", amount: 10000, avgPrice: 50, currentPrice: 56.78, allocation: 40 },
      ],
    };

    const mockTransactions = [
      { id: 1, date: "2024-01-25 10:30", asset: "BTCUSD", type: "buy", amount: 1.5, price: 44000, total: 66000 },
      { id: 2, date: "2024-01-24 14:20", asset: "ETHUSD", type: "buy", amount: 20, price: 2400, total: 48000 },
      { id: 3, date: "2024-01-23 09:15", asset: "BTGBRL", type: "buy", amount: 5000, price: 52, total: 260000 },
      { id: 4, date: "2024-01-22 16:45", asset: "BTCUSD", type: "sell", amount: 0.5, price: 45000, total: 22500 },
    ];

    setTimeout(() => {
      setPortfolio(mockPortfolio);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    const orderData = {
      id: `order_portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      asset: formData.asset,
      type: formData.type,
      side: formData.type,
      amount: formData.amount,
      price: formData.price,
      total: formData.amount * formData.price,
      timestamp: new Date().toISOString(),
      source: "portfolio_page",
    };

    try {
      // Importar dinamicamente
      const awsService = await import("../services/awsService");
      
      const result = await awsService.saveOrderToS3(orderData);
      
      if (result.success) {
        alert(` Ordem salva no AWS S3 com sucesso!\n\nID: ${orderData.id}\nBucket: ${result.bucket || "cryptobtg-orders"}\n${result.mock ? "\\n Modo simulao (AWS no configurado no .env)" : ""}`);
        
        // Adicionar ao histrico local
        const newTransaction = {
          id: orderData.id,
          date: new Date().toLocaleString(),
          asset: formData.asset,
          type: formData.type,
          amount: formData.amount,
          price: formData.price,
          total: formData.amount * formData.price,
          s3Saved: true,
          s3Location: result.location,
        };
        
        setTransactions([newTransaction, ...transactions]);
        
      } else {
        alert(` Erro ao salvar no S3:\n${result.error || "Erro desconhecido"}`);
      }
      
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro ao processar ordem:\n${error.message}`);
    }
    
    handleCloseDialog();
    setFormData({ asset: "BTCUSD", type: "buy", amount: 0, price: 0 });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Carregando portflio...</Typography>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4"> Meu Portflio</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
          Nova Ordem
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Valor Total</Typography>
              <Typography variant="h4">{formatCurrency(portfolio.totalValue)}</Typography>
              <Typography variant="body2" color="success.main">
                 {portfolio.profitLossPercentage}% no total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>P&L Total</Typography>
              <Typography variant="h4">{formatCurrency(portfolio.profitLoss)}</Typography>
              <Typography variant="body2" color={portfolio.profitLoss >= 0 ? "success.main" : "error.main"}>
                {portfolio.profitLoss >= 0 ? " Lucro" : " Prejuzo"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Investido</Typography>
              <Typography variant="h4">{formatCurrency(portfolio.totalInvested)}</Typography>
              <Typography variant="body2" color="textSecondary">Capital inicial</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Ativos</Typography>
              <Typography variant="h4">{portfolio.assets?.length || 0}</Typography>
              <Typography variant="body2" color="textSecondary">Criptomoedas</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
               Distribuio do Portflio
            </Typography>
            <Box sx={{ mt: 3 }}>
              {portfolio.assets?.map((asset, index) => (
                <Box key={asset.symbol} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body1">
                      <strong>{asset.symbol}</strong> - {asset.allocation}%
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(asset.amount * asset.currentPrice)}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={asset.allocation} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: "#f0f0f0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: assets.find(a => a.symbol === asset.symbol)?.color || "#000",
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" color="textSecondary">
                      {asset.amount} {asset.symbol.replace("USD", "").replace("BRL", "")}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Avg: {formatCurrency(asset.avgPrice)} | Now: {formatCurrency(asset.currentPrice)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
                Performance por Ativo
            </Typography>
            {portfolio.assets?.map((asset) => {
              const profitPerUnit = asset.currentPrice - asset.avgPrice;
              const profitPercentage = (profitPerUnit / asset.avgPrice) * 100;
              
              return (
                <Box key={asset.symbol} sx={{ mb: 2, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                  <Typography variant="subtitle1"><strong>{asset.symbol}</strong></Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                    <Chip
                      icon={profitPercentage >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={`${profitPercentage >= 0 ? "+" : ""}${profitPercentage.toFixed(2)}%`}
                      color={profitPercentage >= 0 ? "success" : "error"}
                      size="small"
                    />
                    <Typography variant="body2">
                      {formatCurrency(profitPerUnit * asset.amount)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
           Histrico de Transaes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Ativo</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Quantidade</TableCell>
                <TableCell>Preo</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status AWS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell><strong>{tx.asset}</strong></TableCell>
                  <TableCell>
                    <Chip 
                      label={tx.type === "buy" ? "Compra" : "Venda"} 
                      color={tx.type === "buy" ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{formatCurrency(tx.price)}</TableCell>
                  <TableCell><strong>{formatCurrency(tx.total)}</strong></TableCell>
                  <TableCell>
                    {tx.s3Saved ? (
                      <Chip label="Salvo no S3" color="success" size="small" />
                    ) : (
                      <Chip label="Local" color="default" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog para Nova Ordem */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Nova Ordem de Trading</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            {process.env.REACT_APP_AWS_ACCESS_KEY_ID 
              ? " AWS configurado - Ordem ser salva no S3"
              : " AWS no configurado - Usando modo simulao"}
          </Alert>
          <TextField
            select
            fullWidth
            label="Ativo"
            value={formData.asset}
            onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
            sx={{ mb: 2 }}
          >
            {assets.map((asset) => (
              <MenuItem key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Tipo de Ordem"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="buy">Compra</MenuItem>
            <MenuItem value="sell">Venda</MenuItem>
          </TextField>
          <TextField
            fullWidth
            type="number"
            label="Quantidade"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Preo por Unidade (USD)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {process.env.REACT_APP_AWS_ACCESS_KEY_ID ? "Salvar no AWS S3" : "Simular Ordem"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;



