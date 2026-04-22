# Deploy na Hostinger — Royal Crew Agency

## Variáveis de Ambiente (Environment Variables)

Configurar estas variáveis no painel da Hostinger em **Node.js → Environment Variables**:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `R2_ACCESS_KEY_ID` | `e36967551400898fac9d37f5ec92972b` |
| `R2_SECRET_ACCESS_KEY` | `998c12dee0ac02bb81019a3fffae3e26682d6dfb34f0d13e009db74b1da64b15` |
| `R2_ENDPOINT` | `https://023a0bad3f17632316cd10358db2201f.r2.cloudflarestorage.com` |
| `R2_BUCKET_NAME` | `royalcrew` |
| `R2_PUBLIC_URL` | `https://dados.royalcrewagency.com` |
| `DATABASE_URL` | *(string de ligação MySQL da Hostinger)* |
| `JWT_SECRET` | *(chave secreta aleatória, ex: 64 caracteres hex)* |

## Comandos de Build

```bash
# Instalar dependências
pnpm install

# Build do frontend
pnpm build

# Migrar base de dados
pnpm db:push

# Iniciar servidor
node dist/server/_core/index.js
```

## Porta

O servidor usa a variável `PORT` automaticamente. A Hostinger define esta variável — não é necessário configurar manualmente.

## Notas

- O upload de fotos vai para o Cloudflare R2 e fica acessível em `https://dados.royalcrewagency.com`
- A base de dados MySQL da Hostinger deve ser configurada antes de correr `pnpm db:push`
