import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// * controllers
import LogOperatorController from './Controllers/Log_Operator_Controller';
import OperatorsController from './Controllers/Operators_Controller';
import AdminOperatorConroller from './Controllers/Admin_Operator_Controllers';
import path from 'path';
import OperatorRegistrationController from './Controllers/Operator_Registration_Controller';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const viewsPath = path.join(__dirname, 'Views');

// * operator routers
app.use('/registration', OperatorRegistrationController);
app.use('/api/operator-logging', LogOperatorController);
app.use('/api/operators', OperatorsController);
app.use('/api/admin-operators', AdminOperatorConroller);
app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.listen(PORT, () => {
  console.log(`Server up and running on port: ${PORT}`);
});
