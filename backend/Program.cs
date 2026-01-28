var builder = WebApplication.CreateBuilder(args);

//Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options => 
    options.AddPolicy("AllowAll", policy => 
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

//Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

// ROTAS DA API 

//Health check
app.MapGet("/", () => "CryptoBTG Professional API - Sistema Online");

app.MapGet("/api/health", () => Results.Json(new 
{ 
    status = "healthy", 
    timestamp = DateTime.UtcNow,
    service = "CryptoBTG Professional",
    version = "1.0.0",
    features = new[] { "AWS S3 Integration", "Real-time Market Data", "Trading System", "Portfolio Management" }
}));

//Market data
app.MapGet("/api/market/prices", () =>
{
    var prices = new[]
    {
        new { symbol = "BTCUSD", price = 45234.56m, change24h = 2.34m, volume = 28500000000m },
        new { symbol = "ETHUSD", price = 2534.67m, change24h = 1.56m, volume = 12500000000m },
        new { symbol = "BTGBRL", price = 254.89m, change24h = 2.78m, volume = 45000000m },
        new { symbol = "ADAUSD", price = 0.5234m, change24h = 1.23m, volume = 450000000m },
        new { symbol = "SOLUSD", price = 102.45m, change24h = 3.48m, volume = 2800000000m }
    };
    
    return Results.Json(new { success = true, data = prices });
});

//Trading orders
app.MapGet("/api/trading/orders", (HttpContext context) =>
{
    string clientId = context.Request.Query["clientId"].FirstOrDefault() ?? "btg-client-001";
    
    var orders = new[]
    {
        new { 
            id = "ORD-001", 
            symbol = "BTCUSD", 
            side = "buy", 
            type = "market", 
            quantity = 0.1m, 
            price = 45234.56m, 
            status = "filled",
            createdAt = DateTime.UtcNow.AddHours(-2),
            clientId = clientId
        },
        new { 
            id = "ORD-002", 
            symbol = "ETHUSD", 
            side = "sell", 
            type = "limit", 
            quantity = 2.5m, 
            price = 2534.67m, 
            status = "pending",
            createdAt = DateTime.UtcNow.AddMinutes(-30),
            clientId = clientId
        }
    };
    
    return Results.Json(new { success = true, data = orders });
});

//Create order
app.MapPost("/api/trading/orders", async (HttpContext context) =>
{
    try
    {
        var order = new
        {
            id = $"ORD-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
            symbol = "BTCUSD",
            side = "buy",
            type = "market",
            quantity = 0.1m,
            price = 45234.56m,
            status = "pending",
            createdAt = DateTime.UtcNow,
            clientId = "btg-client-001",
            s3Key = $"orders/btg-client-001/{Guid.NewGuid()}.json"
        };
        
        return Results.Json(new { success = true, data = order, message = "Ordem criada com sucesso" });
    }
    catch (Exception ex)
    {
        return Results.Json(new { success = false, message = ex.Message }, statusCode: 400);
    }
});

//Portfolio
app.MapGet("/api/portfolio", (HttpContext context) =>
{
    string clientId = context.Request.Query["clientId"].FirstOrDefault() ?? "btg-client-001";
    
    var portfolio = new
    {
        clientId = clientId,
        totalBalance = 1250000.00m,
        availableBalance = 750000.00m,
        investedBalance = 500000.00m,
        totalProfitLoss = 25000.00m,
        profitLossPercent = 5.0m,
        assets = new[]
        {
            new { symbol = "BTC", quantity = 2.5m, avgPrice = 40000m, currentPrice = 45234.56m, value = 113086.40m },
            new { symbol = "ETH", quantity = 15.0m, avgPrice = 2000m, currentPrice = 2534.67m, value = 38020.05m },
            new { symbol = "BTG", quantity = 1000.0m, avgPrice = 230m, currentPrice = 254.89m, value = 254890.00m }
        }
    };
    
    return Results.Json(new { success = true, data = portfolio });
});

//AWS S3 operations
app.MapGet("/api/s3/backups", () =>
{
    var backups = new[]
    {
        new { key = "backups/2024-01-25.json", size = "2.4 MB", lastModified = DateTime.UtcNow.AddDays(-1) },
        new { key = "backups/2024-01-24.json", size = "2.3 MB", lastModified = DateTime.UtcNow.AddDays(-2) },
        new { key = "backups/2024-01-23.json", size = "2.2 MB", lastModified = DateTime.UtcNow.AddDays(-3) }
    };
    
    return Results.Json(new { success = true, data = backups });
});

//Market history
app.MapGet("/api/market/history/{symbol}", (string symbol) =>
{
    var history = Enumerable.Range(0, 24).Select(i => new
    {
        time = DateTime.UtcNow.AddHours(-i).ToString("HH:00"),
        price = symbol switch
        {
            "BTCUSD" => 45234.56m + (new Random().Next(-1000, 1000) * 1.0m),
            "ETHUSD" => 2534.67m + (new Random().Next(-100, 100) * 1.0m),
            "BTGBRL" => 254.89m + (new Random().Next(-10, 10) * 1.0m),
            _ => 100m + (new Random().Next(-10, 10) * 1.0m)
        }
    }).Reverse().ToArray();
    
    return Results.Json(new { success = true, data = history, symbol = symbol });
});

app.MapGet("/api/market/indicators/{symbol}", (string symbol) =>
{
    var indicators = new
    {
        symbol = symbol,
        rsi = 58.7,
        macd = 125.4,
        movingAverage20 = 44500.00,
        movingAverage50 = 43000.00,
        movingAverage200 = 42000.00,
        recommendation = "NEUTRAL"
    };
    
    return Results.Json(new { success = true, data = indicators });
});

app.Run();

