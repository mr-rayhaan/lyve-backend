import express from 'express';
import { json } from 'body-parser';
import menuRoutes from './src/routes/menuRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use('/api/menu', menuRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
