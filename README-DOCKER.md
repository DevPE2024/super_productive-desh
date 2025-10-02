# Docker Setup - Super Productive

Este projeto possui duas configurações Docker: uma para **desenvolvimento** com hot reload e outra para **produção**.

## 🚀 Comandos Rápidos

### Desenvolvimento (com Hot Reload)
```bash
# Subir aplicação em modo desenvolvimento
npm run docker:dev

# Parar aplicação de desenvolvimento
npm run docker:dev:down

# Parar e limpar volumes (reset completo)
npm run docker:dev:clean
```

### Produção
```bash
# Subir aplicação em modo produção
npm run docker:prod

# Parar aplicação de produção
npm run docker:prod:down

# Parar e limpar volumes (reset completo)
npm run docker:prod:clean
```

## 📁 Arquivos de Configuração

- **`Dockerfile`** - Configuração para produção
- **`Dockerfile.dev`** - Configuração para desenvolvimento
- **`docker-compose.yml`** - Orquestração para produção
- **`docker-compose.dev.yml`** - Orquestração para desenvolvimento

## 🔧 Diferenças entre Desenvolvimento e Produção

### Desenvolvimento (`docker-compose.dev.yml`)
- ✅ **Hot Reload** - Mudanças no código são refletidas automaticamente
- ✅ **Volumes montados** - Código local sincronizado com container
- ✅ **NODE_ENV=development**
- ✅ **Não faz build** - Usa `npm run dev`
- 🔄 **Containers nomeados com sufixo `-dev`**

### Produção (`docker-compose.yml`)
- 🏗️ **Build otimizado** - Aplicação compilada para produção
- 🚀 **NODE_ENV=production**
- 📦 **Imagem final menor**
- ⚡ **Performance otimizada**

## 🗄️ Banco de Dados

Ambos os ambientes incluem:
- **PostgreSQL 15** na porta `8010`
- **pgAdmin** na porta `8020`
- **Credenciais:**
  - Database: `super_productive`
  - User: `postgres`
  - Password: `password`

## 🔄 Workflow Recomendado

1. **Durante desenvolvimento:**
   ```bash
   npm run docker:dev
   ```

2. **Para testar produção:**
   ```bash
   npm run docker:dev:down
   npm run docker:prod
   ```

3. **Para reset completo:**
   ```bash
   npm run docker:dev:clean  # ou docker:prod:clean
   ```

## 🐛 Troubleshooting

- **Porta ocupada:** Verifique se não há outros serviços rodando nas portas 8001, 8010, 8020
- **Problemas de cache:** Use os comandos `clean` para limpar volumes
- **Mudanças não aparecem:** Certifique-se de estar usando o ambiente de desenvolvimento