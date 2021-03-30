import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(isAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        // password confirmation tem que ter o valor igual o password
        .valid(Joi.ref('password'))
        // depos de confirmar ele e so requirido se a opcao de cima for vdd
        .when('password', {
          is: Joi.exist(),
          then: Joi.required,
        }),
    },
  }),
  profileController.update,
);

export default profileRouter;
