import { Response, Router } from 'express';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';
import auth from '../Middleware/auth';

const AdminOperatorConroller = Router();

// * Create agent
AdminOperatorConroller.post(
  '/create-agent',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      // const agent = await createAgent(
      // 	req.body.firstName,
      // 	req.body.lastName,
      // 	req.body.email,
      // 	req.body.admin
      // );

      // if (req.body.registerAgent) {
      // 	const verificationCode = generateVerificationCode();
      // 	const updatedAgent = await updateVerificationToken(
      // 		agent.id,
      // 		verificationCode,
      // 		true,
      // 		0
      // 	);

      // 	await sendAgentVerificationCode(
      // 		updatedAgent.id,
      // 		updatedAgent.email,
      // 		updatedAgent.firstName,
      // 		updatedAgent.lastName,
      // 		verificationCode
      // 	);
      // }
      // ? no need to filterUser as password is by default null
      res.status(200).send({
        data: 'user',
        success: true,
        message: '',
      });
    } catch (err: any) {
      res.status(200).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);
