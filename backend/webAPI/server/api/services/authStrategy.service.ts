import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { Strategy as Local } from 'passport-local';
import L from '../../common/logger';
import usersService from './users.service';
import passport from 'passport';

import bcrypt from 'bcrypt';
import { UserDTO } from '../models/DTO/User.DTO';
import { User } from '../models/User';

// Config
const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

// Strategy
const jwtStrategy = new Jwt(jwtOptions, async (payload, done: any) => {
  try {
    const users = await usersService.filter('ID', payload.id);
    const user = users[0];

    if (!user) {
      return done(null, false); // User not found
    }
    return done(null, { user: new UserDTO().map(user) }); // Pass user ID to the request object
  } catch (error) {
    return done(error, false);
  }
});
// Strategy
const localStrategy = new Local(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      var users = await usersService.filter('Email', email);
      L.info(users);
      const user : User = users[0];
      if (!user) {
        return done(null, false, { message: 'Invalid email.' });
      }
      const validPassword = bcrypt.compareSync(password, user.Password);
      if (!validPassword) {
        return done(null, false, { message: 'Invalid credentials.' });
      }
      L.info(''+ user.RoleID);
      return done(null, user);
    } catch (err) {
      L.info('error: ' + err);
      return done(err);
    }
  }
);

// Export

passport.use(jwtStrategy);
passport.use(localStrategy);

export default passport;
