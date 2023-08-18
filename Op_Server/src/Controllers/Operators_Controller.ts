import { Router, Response } from 'express';
import { AuthenticatedOpRequestI } from '../Types/OperatorRequestType';
import auth from '../Middleware/auth';
import { prisma } from '../DB/prismaConfig';

const OperatorsController = Router();

// * me
OperatorsController.get(
  '/me',
  auth,
  async (req: AuthenticatedOpRequestI, res: Response) => {
    try {
      const opId = Number(req.decodedUser?.id);
      const user = await prisma.operators.findUnique({
        where: { id: opId },
      });
      res.status(200).send({
        data: user,
        success: true,
        message: '',
      });
    } catch (err: any) {
      res.status(400).send({
        data: null,
        success: false,
        message: err.message,
      });
    }
  }
);

export default OperatorsController;
