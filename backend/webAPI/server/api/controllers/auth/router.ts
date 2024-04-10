import express from 'express';
import controller from './controller';
import { authenticateToken } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/login', controller.login)
  .get('/user',authenticateToken, controller.profile)
  .patch('/user',authenticateToken, controller.updateProfile)
  .post('/password/change',authenticateToken, controller.changePassword)
  .get('/logout',authenticateToken, controller.logout)
  .post('/password/forgot', controller.forgotPassword)
  .post('/verify',authenticateToken, controller.verifyOTP)
  .post('/verify/phone',authenticateToken, controller.verifyPhone)
  .get('/otp',authenticateToken, controller.sendOTP)
  .post('/password/reset', controller.resetPassword);
