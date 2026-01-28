


###  DOCKER
- `docker/Dockerfile` - Build multi-estágio
- `docker/nginx.conf` - Configuração do servidor

###  KUBERNETES
- `k8s/deployment.yaml` - Deployment + Service

### CI/CD
- `.github/workflows/deploy.yml` - GitHub Actions

###  SCRIPTS
- `cicd/deploy-local.sh` - Testar localmente


### 1. TESTE LOCAL COM DOCKER:
```bash
# Build da imagem
docker build -f docker/Dockerfile -t cryptobtg .

# Executar
docker run -p 8080:80 cryptobtg

# Acesse: http://localhost:8080
2. DEPLOY NO KUBERNETES:
bash
# Aplicar configurações
kubectl apply -f k8s/deployment.yaml

# Verificar
kubectl get pods
kubectl get services
3. CI/CD AUTOMÁTICO:
Push para GitHub → Build automático

Pipeline no .github/workflows/deploy.yml

📁 ESTRUTURA:
text
frontend/
├── src/                    
├── docker/                 # Configurações Docker
├── k8s/                    # Kubernetes manifests
├── .github/workflows/      # CI/CD
└── cicd/                   # Scripts

