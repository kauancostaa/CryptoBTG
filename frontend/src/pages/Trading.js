import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import PlaceOrderIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const  Trading = () => {
  const [orderType, setOrderType] = useState("market");
  const [asset, setAsset] = useState("BTCUSD");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState(0.1);
  const [price, setPrice] = useState(45234.56);
  const [limitPrice, setLimitPrice] = useState(45000);
  const [stopPrice, setStopPrice] = useState(44000);
  const [leverage, setLeverage] = useState(1);

  const [openOrders, setOpenOrders] = useState([
    { id: 1, asset: "BTCUSD", side: "buy", type: "limit", amount: 0.5, price: 44000, filled: 0.2, status: "partial" },
    { id: 2, asset: "ETHUSD", side: "sell", type: "stop", amount: 10, price: 2600, filled: 0, status: "open" },
  ]);

  const [orderHistory, setOrderHistory] = useState([
    { id: 101, asset: "BTCUSD", side: "buy", type: "market", amount: 0.2, price: 44800, filled: 0.2, date: "2024-01-25 09:30", status: "filled" },
    { id: 102, asset: "ETHUSD", side: "sell", type: "limit", amount: 5, price: 2550, filled: 5, date: "2024-01-24 14:20", status: "filled" },
    { id: 103, asset: "BTGBRL", side: "buy", type: "market", amount: 1000, price: 55.5, filled: 1000, date: "2024-01-23 11:15", status: "filled" },
  ]);

  const assets = [
    { symbol: "BTCUSD", name: "Bitcoin", price: 45234.56, change: 2.34 },
    { symbol: "ETHUSD", name: "Ethereum", price: 2534.67, change: 1.56 },
    { symbol: "BTGBRL", name: "BTG Token", price: 56.78, change: 0.89 },
    { symbol: "SOLUSD", name: "Solana", price: 102.45, change: 5.23 },
  ];

  const selectedAsset = assets.find(a => a.symbol === asset);

  const handleSubmitOrder = async () => {
    const orderData = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      asset,
      side,
      type: orderType,
      amount,
      price: orderType === "market" ? selectedAsset.price : price,
      limitPrice: orderType === "limit" ? limitPrice : undefined,
      stopPrice: orderType === "stop" ? stopPrice : undefined,
      leverage,
      total: calculateTotal(),
      timestamp: new Date().toISOString(),
      status: "pending",
      userId: "user_001", // Substitua pelo ID real do usurio
    };

    try {
      // Importar dinamicamente para evitar problemas de carregamento
      const awsService = await import("../services/awsService");
      
      // Salvar no AWS S3
      const result = await awsService.saveOrderToS3(orderData);
      
      if (result.success) {
        alert(` Ordem ${side === "buy" ? "de COMPRA" : "de VENDA"} salva no AWS S3!\n\nDetalhes:
 Ativo: ${asset}
 Tipo: ${orderType}
 Quantidade: ${amount}
 Preo: ${orderType === "market" ? selectedAsset.price : price}
 Total: ${calculateTotal().toLocaleString()}
 Bucket: ${result.bucket || "cryptobtg-orders"}
${result.mock ? "\\n Modo simulao (AWS no configurado)" : ""}`);
      } else {
        alert(` Erro ao salvar no AWS S3:\n${result.error || "Erro desconhecido"}`);
      }
      
      // Adiciona ao histrico local apenas se salvo com sucesso
      if (result.success) {
        const newOrder = {
          id: orderData.id,
          asset,
          side,
          type: orderType,
          amount,
          price: orderType === "market" ? selectedAsset.price : price,
          filled: 0,
          date: new Date().toLocaleString(),
          status: "pending",
          s3Location: result.location,
        };
        
        setOrderHistory([newOrder, ...orderHistory]);
        
        // Se for ordem de mercado, marca como parcialmente preenchida
        if (orderType === "market") {
          setOpenOrders([...openOrders, { ...newOrder, filled: amount, status: "filled" }]);
        } else {
          setOpenOrders([...openOrders, newOrder]);
        }
      }
      
    } catch (error) {
      console.error("Erro ao processar ordem:", error);
      alert(` Erro ao processar ordem:\n${error.message}`);
    }
    
    // Reset form
    setAmount(0.1);
    setPrice(selectedAsset.price);
  };

  const calculateTotal = () => {
    const orderPrice = orderType === "market" ? selectedAsset.price : price;
    return amount * orderPrice * leverage;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
          Trading
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Execute ordens de compra e venda em tempo real
      </Typography>

      <Grid container spacing={3}>
        {/* Painel de  Trading */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Nova Ordem
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ToggleButtonGroup
                  value={orderType}
                  exclusive
                  onChange={(e, newType) => newType && setOrderType(newType)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="market">Mercado</ToggleButton>
                  <ToggleButton value="limit">Limitada</ToggleButton>
                  <ToggleButton value="stop">Stop</ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Ativo</InputLabel>
                  <Select value={asset} label="Ativo" onChange={(e) => setAsset(e.target.value)}>
                    {assets.map((a) => (
                      <MenuItem key={a.symbol} value={a.symbol}>
                        {a.symbol} - {formatCurrency(a.price)} ({a.change >= 0 ? "+" : ""}{a.change}%)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <ToggleButtonGroup
                  value={side}
                  exclusive
                  onChange={(e, newSide) => newSide && setSide(newSide)}
                  fullWidth
                >
                  <ToggleButton value="buy" color="success">
                    COMPRAR
                  </ToggleButton>
                  <ToggleButton value="sell" color="error">
                    VENDER
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantidade"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  InputProps={{
                    endAdornment: <Typography variant="caption">{asset.replace("USD", "").replace("BRL", "")}</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                {orderType === "market" ? (
                  <TextField
                    fullWidth
                    label="Preo de Mercado"
                    value={formatCurrency(selectedAsset.price)}
                    disabled
                  />
                ) : (
                  <TextField
                    fullWidth
                    type="number"
                    label={orderType === "limit" ? "Preo Limitado" : "Preo Stop"}
                    value={orderType === "limit" ? limitPrice : stopPrice}
                    onChange={(e) => orderType === "limit" ? setLimitPrice(parseFloat(e.target.value)) : setStopPrice(parseFloat(e.target.value))}
                  />
                )}
              </Grid>

              {orderType === "limit" && (
                <Grid item xs={12}>
                  <Typography gutterBottom>Preo Limitado: {formatCurrency(limitPrice)}</Typography>
                  <Slider
                    value={limitPrice}
                    min={selectedAsset.price * 0.9}
                    max={selectedAsset.price * 1.1}
                    step={100}
                    onChange={(e, newValue) => setLimitPrice(newValue)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => formatCurrency(value)}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography gutterBottom>Alavancagem: {leverage}x</Typography>
                <Slider
                  value={leverage}
                  min={1}
                  max={10}
                  step={1}
                  onChange={(e, newValue) => setLeverage(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}x`}
                />
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Resumo da Ordem
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography>Total da Ordem:</Typography>
                    <Typography variant="h6">{formatCurrency(calculateTotal())}</Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {amount} {asset.replace("USD", "").replace("BRL", "")}  {formatCurrency(orderType === "market" ? selectedAsset.price : price)}  {leverage}x
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<PlaceOrderIcon />}
                  onClick={handleSubmitOrder}
                  color={side === "buy" ? "success" : "error"}
                  sx={{ py: 1.5 }}
                >
                  {side === "buy" ? "COMPRAR" : "VENDER"} {asset} {orderType === "market" ? " MERCADO" : orderType.toUpperCase()}
                </Button>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <strong>Integrao AWS S3:</strong> As ordens sero salvas no bucket S3 configurado aps implementao completa.
            </Alert>
          </Paper>

          {/*  Ordens Abertas */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Ordens Abertas
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Lado</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preo</TableCell>
                    <TableCell>Preenchido</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {openOrders.map((order) => (
                    <TableRow key={order.id} hover>
                      <TableCell><strong>{order.asset}</strong></TableCell>
                      <TableCell>
                        <Chip 
                          label={order.side === "buy" ? "Compra" : "Venda"} 
                          color={order.side === "buy" ? "success" : "error"} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{order.type}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>{formatCurrency(order.price)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box sx={{ width: "100%", mr: 1 }}>
                            <Slider 
                              value={order.filled / order.amount * 100} 
                              size="small" 
                              disabled 
                              sx={{ py: 0 }}
                            />
                          </Box>
                          <Typography variant="caption">{(order.filled / order.amount * 100).toFixed(1)}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status === "partial" ? "Parcial" : "Aberta"} 
                          color={order.status === "partial" ? "warning" : "info"} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Painel de Informaes */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                <AccountBalanceIcon sx={{ mr: 1 }} /> Saldo Disponvel
              </Typography>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(125000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Disponvel para  Trading
              </Typography>
            </CardContent>
          </Card>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
               Informaes do Ativo
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5">{selectedAsset.symbol}</Typography>
              <Typography variant="body1">{selectedAsset.name}</Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Preo Atual</Typography>
                <Typography variant="h6">{formatCurrency(selectedAsset.price)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">Variao 24h</Typography>
                <Typography variant="h6" color={selectedAsset.change >= 0 ? "success.main" : "error.main"}>
                  {selectedAsset.change >= 0 ? "+" : ""}{selectedAsset.change}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
              <HistoryIcon sx={{ mr: 1 }} /> Histrico Recente
            </Typography>
            <Box sx={{ maxHeight: 300, overflow: "auto" }}>
              {orderHistory.slice(0, 5).map((order) => (
                <Box key={order.id} sx={{ p: 1.5, borderBottom: "1px solid #f0f0f0" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2">
                      <strong>{order.asset}</strong>  {order.type}
                    </Typography>
                    <Chip 
                      label={order.side} 
                      color={order.side === "buy" ? "success" : "error"} 
                      size="small" 
                    />
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {order.date}  {order.amount} @ {formatCurrency(order.price)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default  Trading;




