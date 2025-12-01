import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './config/database';
import './models';
import routes from './routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use('/api', routes);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados ou iniciar o servidor:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
