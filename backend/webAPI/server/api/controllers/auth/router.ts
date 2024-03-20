import express from 'express';
import controller from './controller';
export default express
  .Router()
  .post('/login', controller.login)
  .get('/user', controller.user)
  .get('/logout', controller.logout)
  .post('/forgotPassword', controller.forgotPassword)
  .post('/verify', controller.verifyOTP);
