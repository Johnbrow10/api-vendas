# Pré Requisitos

## Comandos para baixar os caontainer na sua maquina

### banco de dados para cache redis
docker run --name redis -p 6379:6379 -d -t redis:alpine

### para rodar aimgaem cliente do redis e poder visualizar o cache
docker run --name redis-client -v redisinsight:/db -p 8001:8001 -d -t redislabs/redisinsight:latest
### para acessar interface web dos dados de cache
localhost:8001 ou qual url colocaste no .env
