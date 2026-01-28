
const AWS_CONFIG = {
  region: "sa-east-1", // Altere para sua regio
  credentials: {
    accessKeyId: "", // Substitua com sua Access Key
    secretAccessKey: "", // Substitua com sua Secret Key
  },
};

// Bucket S3 para armazenar as ordens
const S3_BUCKET = ""; // Altere para o nome do seu bucket

// Verificar se AWS SDK est disponvel
let AWS;
try {
  AWS = require("aws-sdk");
} catch (error) {
  console.warn("AWS SDK no instalado. Execute: npm install aws-sdk");
  AWS = null;
}

// Inicializar o cliente S3
let s3 = null;
if (AWS) {
  AWS.config.update(AWS_CONFIG);
  s3 = new AWS.S3();
}

/**
 * Salva uma ordem no S3
 * @param {Object} orderData - Dados da ordem
 * @param {string} orderData.id - ID da ordem
 * @param {string} orderData.asset - Ativo (ex: BTCUSD)
 * @param {string} orderData.side - Lado (buy/sell)
 * @param {string} orderData.type - Tipo (market/limit/stop)
 * @param {number} orderData.amount - Quantidade
 * @param {number} orderData.price - Preo
 * @param {string} orderData.userId - ID do usurio (opcional)
 * @returns {Promise<Object>} Resultado da operao
 */
export const saveOrderToS3 = async (orderData) => {
  if (!s3) {
    console.error("S3 no inicializado. Verifique as credenciais AWS.");
    return { success: false, error: "AWS no configurado" };
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const key = `orders/${timestamp}_${orderData.id}.json`;
    
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
      Body: JSON.stringify(orderData, null, 2),
      ContentType: "application/json",
    };

    const result = await s3.upload(params).promise();
    
    console.log("Ordem salva no S3:", result.Location);
    return { 
      success: true, 
      location: result.Location,
      key: key,
      orderId: orderData.id 
    };
    
  } catch (error) {
    console.error("Erro ao salvar no S3:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Lista ordens do S3
 * @param {string} prefix - Prefixo para filtrar (ex: 'orders/')
 * @returns {Promise<Array>} Lista de ordens
 */
export const listOrdersFromS3 = async (prefix = "orders/") => {
  if (!s3) {
    console.error("S3 no inicializado.");
    return [];
  }

  try {
    const params = {
      Bucket: S3_BUCKET,
      Prefix: prefix,
    };

    const data = await s3.listObjectsV2(params).promise();
    
    const orders = [];
    for (const item of data.Contents || []) {
      if (item.Key.endsWith(".json")) {
        const orderData = await getOrderFromS3(item.Key);
        if (orderData) {
          orders.push(orderData);
        }
      }
    }
    
    return orders;
  } catch (error) {
    console.error("Erro ao listar do S3:", error);
    return [];
  }
};

/**
 * Obtm uma ordem especfica do S3
 * @param {string} key - Chave do objeto S3
 * @returns {Promise<Object|null>} Dados da ordem
 */
export const getOrderFromS3 = async (key) => {
  if (!s3) {
    return null;
  }

  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
    };

    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString());
  } catch (error) {
    console.error("Erro ao obter do S3:", error);
    return null;
  }
};

/**
 * Simulao para desenvolvimento (usar quando AWS no estiver configurado)
 */
export const mockSaveOrder = async (orderData) => {
  console.log("[MOCK] Ordem simulada salva:", orderData);
  
  // Simular atraso de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    message: "Ordem simulada (AWS no configurado)",
    orderId: orderData.id,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Configurao helper para AWS
 */
export const configureAWS = (config) => {
  if (!AWS) {
    console.warn("AWS SDK no disponvel");
    return false;
  }
  
  AWS.config.update(config);
  s3 = new AWS.S3();
  return true;
};

// Exportar funes principais
const awsService = {
  saveOrderToS3,
  listOrdersFromS3,
  getOrderFromS3,
  mockSaveOrder,
  configureAWS,
};

export default awsService;


