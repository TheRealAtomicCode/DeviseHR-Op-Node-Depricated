import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// * controllers
import LogOperatorController from './Controllers/Log_Operator_Controller';
import OperatorsController from './Controllers/Operators_Controller';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

// * operator routers
app.use('/api/operator-logging', LogOperatorController);
app.use('/api/operators', OperatorsController);
app.use('/api/admin-operators', OperatorsController);

app.listen(PORT, () => {
  console.log(`Server up and running on port: ${PORT}`);
});
