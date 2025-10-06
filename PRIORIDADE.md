# 🚀 Prioridade - Comandos Docker para Prodify

## 📋 Comandos Essenciais Docker

### 🏭 **PRODUÇÃO**
```bash
# Parar aplicação e remover volumes (SEMPRE FAZER PRIMEIRO)
docker-compose down -v

# Subir aplicação e banco de dados em produção
docker-compose up --build

# Subir em background (detached mode)
docker-compose up --build -d
```

### 🛠️ **DESENVOLVIMENTO**
```bash
# Parar aplicação e remover volumes
docker-compose -f docker-compose.dev.yml down -v

# Subir aplicação em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Subir em background para desenvolvimento
docker-compose -f docker-compose.dev.yml up --build -d
```

### 🔄 **COMANDOS DE RESTART**

#### **PRODUÇÃO:**
```bash
# Restart completo (recomendado)
docker-compose down -v && docker-compose up --build

# Restart apenas os containers (sem rebuild)
docker-compose restart

# Restart container específico
docker-compose restart app
docker-compose restart db
docker-compose restart pgadmin

# Parar todos os containers
docker-compose stop

# Iniciar containers parados
docker-compose start
```

#### **DESENVOLVIMENTO:**
```bash
# Restart completo em modo desenvolvimento (recomendado)
docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up --build

# Restart apenas os containers de desenvolvimento (sem rebuild)
docker-compose -f docker-compose.dev.yml restart

# Restart container específico em desenvolvimento
docker-compose -f docker-compose.dev.yml restart app
docker-compose -f docker-compose.dev.yml restart db
docker-compose -f docker-compose.dev.yml restart pgadmin

# Parar todos os containers de desenvolvimento
docker-compose -f docker-compose.dev.yml stop

# Iniciar containers parados em desenvolvimento
docker-compose -f docker-compose.dev.yml start
```

### 🗄️ **COMANDOS DE BANCO DE DADOS**
```bash
# Aplicar migrações do Prisma (dentro do container)
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate deploy

# Gerar cliente Prisma
docker-compose -f docker-compose.dev.yml exec app npx prisma generate

# Resetar banco de dados
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate reset

# Inserir usuário de teste
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d super_productive -f /docker-entrypoint-initdb.d/insert_user.sql
```

### 📊 **VERIFICAÇÃO DE STATUS**
```bash
# Ver containers rodando
docker ps

# Ver logs da aplicação
docker-compose -f docker-compose.dev.yml logs app

# Ver logs do banco
docker-compose -f docker-compose.dev.yml logs db

# Ver logs em tempo real
docker-compose -f docker-compose.dev.yml logs -f app
```

### 🧹 **LIMPEZA DO SISTEMA**
```bash
# Remover containers, redes e volumes
docker-compose -f docker-compose.dev.yml down -v

# Limpar imagens não utilizadas
docker image prune -f

# Limpeza completa do Docker
docker system prune -a --volumes
```

## 🎯 **SEQUÊNCIA RECOMENDADA PARA SUBIR A APLICAÇÃO**

### 1️⃣ **Primeira Execução:**
```bash
cd super_productive-desh
docker-compose down -v
docker-compose up --build
```

### 2️⃣ **Após Mudanças no Código:**

#### **PRODUÇÃO:**
```bash
docker-compose down -v
docker-compose up --build
```

#### **DESENVOLVIMENTO:**
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build
```

### 3️⃣ **Restart Rápido (sem mudanças):**

#### **PRODUÇÃO:**
```bash
docker-compose restart
```

#### **DESENVOLVIMENTO:**
```bash
docker-compose -f docker-compose.dev.yml restart
```

## 🌐 **URLs de Acesso**
- **Aplicação:** http://localhost:8001
- **PostgreSQL:** localhost:8010
- **PgAdmin:** http://localhost:8020

## 📝 **Credenciais do Banco**
- **Database:** super_productive
- **User:** postgres
- **Password:** password
- **Port:** 8010

## ⚠️ **REGRAS IMPORTANTES**
1. **SEMPRE** usar `docker-compose down -v` antes de subir novamente
2. **NUNCA** usar `npm run dev` - sempre usar Docker
3. **SEMPRE** verificar se não há containers rodando antes de subir
4. **SEMPRE** usar `--build` para garantir que as mudanças sejam aplicadas
5. **TESTAR** localmente antes de subir no Docker (se necessário)

## 🔧 **Troubleshooting**
```bash
# Se der erro de porta ocupada
docker-compose down -v
docker ps -a
docker rm $(docker ps -aq)

# Se der erro de build
docker-compose down -v
docker system prune -f
docker-compose up --build

# Se o banco não conectar
docker-compose logs db
docker-compose restart db
```

---
**Última atualização:** $(date)
**Ambiente:** Docker + PostgreSQL + Next.js
**Portas:** App(8001), DB(8010), PgAdmin(8020)