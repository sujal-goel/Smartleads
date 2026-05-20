import app from './app';
import { connectDB } from './libs/db';
import config from './config/env';

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
  });
};

startServer();
