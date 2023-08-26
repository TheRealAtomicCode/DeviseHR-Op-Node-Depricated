import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isAdmin } from '../../Middleware/authorization';
import { AuthenticatedOpRequestI } from '../../Types/OperatorRequestType';
import { isValidEmail } from '../../Helpers/stringValidation';

const companyRouter = Router();

// * Create company
companyRouter.post(
  '/create-company',
  auth,
  isAdmin,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      isValidEmail(req.body.email);
      isValidEmail(req.body.ownerEmail);
      const companyName = req.body.companyName.trim();
      const firstName = req.body.firstName.trim();
      const lastName = req.body.lastName.trim();
      const ownerFirstName = req.body.ownerFirstName.trim();
      const ownerLastName = req.body.ownerLastName.trim();

      // const companyWithAgent = await createCompany(
      // 	companyName,
      // 	firstName,
      // 	lastName,
      // 	req.body.email,
      // 	req.body.expirationDate,
      // 	ownerFirstName,
      // 	ownerLastName,
      // 	req.body.ownerEmail,
      // 	req.body.maxAmountOfEmployees
      // );

      //	res.status(200).send(companyWithAgent);
    } catch (err: any) {}
  }
);

export default companyRouter;
