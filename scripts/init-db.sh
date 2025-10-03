#!/bin/sh

echo "🚀 Iniciando configuração do banco de dados..."

# Aguardar o banco de dados estar pronto
echo "⏳ Aguardando banco de dados estar disponível..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "⏳ Banco ainda não está pronto, aguardando 2 segundos..."
  sleep 2
done

echo "✅ Banco de dados conectado com sucesso!"

# Executar prisma db push para sincronizar schema
echo "🔄 Sincronizando schema do banco de dados..."
npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
    echo "✅ Schema sincronizado com sucesso!"
else
    echo "❌ Erro ao sincronizar schema!"
    exit 1
fi

# Executar seed para popular dados iniciais
echo "🌱 Executando seed do banco de dados..."
npx prisma db seed

if [ $? -eq 0 ]; then
    echo "✅ Seed executado com sucesso!"
else
    echo "⚠️  Aviso: Seed pode ter falhado (dados já podem existir)"
fi

echo "🎉 Configuração do banco concluída! Iniciando aplicação..."

# Iniciar a aplicação
exec npm run dev