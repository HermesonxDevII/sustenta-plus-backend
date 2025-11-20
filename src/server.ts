import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sequelize from './config/database';
import './models';
import routes from './routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000; 

app.use(express.json());
app.use(cors());
app.use(helmet());

// Rotas da Aplicação
app.use('/api', routes);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados ou iniciar o servidor:', error);
        process.exit(1);
    }
}

startServer();