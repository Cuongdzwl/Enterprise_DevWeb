import express from 'express';
import controller from './controller';
import { authenticateToken } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/login', controller.login)
  .get('/user',authenticateToken, controller.profile)
  .put('/user',authenticateToken, controller.updateProfile)
  .get('/logout',authenticateToken, controller.logout)
  .post('/forgotPassword', controller.forgotPassword)
  .post('/verify', controller.verifyOTP);
