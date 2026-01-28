#!/bin/bash
echo " Logando no Azure..."
az login

echo " Build da imagem..."
docker build -f docker/Dockerfile -t acrbtg.azurecr.io/cryptobtg:latest .

echo " Push para Azure Container Registry..."
az acr login --name acrbtg
docker push acrbtg.azurecr.io/cryptobtg:latest

echo "  Deploy no AKS..."
az aks get-credentials --resource-group rg-btg --name aks-btg

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/configmap.yaml

echo " Deploy concluído!"
echo " Obtenha o IP: kubectl get service cryptobtg-service"
