# RevoBank API — Backend

This is the NestJS backend for RevoBank. Full project documentation is available in the [root README](../README.md).

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```

2. Create `.env` in this folder:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

3. Run database migration
   ```bash
   npx prisma migrate dev
   ```

   For production deployments, use:
   ```bash
   npx prisma migrate deploy
   ```

4. Start development server
   ```bash
   npm run start:dev
   ```

API runs at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/docs-v1`
