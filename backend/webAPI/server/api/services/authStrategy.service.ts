import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { Strategy as Local } from 'passport-local';
import L from '../../common/logger';
import usersService from './users.service';
import passport from 'passport';

import bcrypt from 'bcrypt';

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

    return done(null, { id: user.id }); // Pass user ID to the request object
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
        const phoneRegex = /^\d{10,15}$/;
        if (phoneRegex.test(email)) {
            var users = await usersService.filter('Phone', email);
        } else {
            var users = await usersService.filter('Email', email);
        }
      const user = users[0];
      L.info(user);
      if (!user) {
        return done(null, false); // User not found
      }
      if (!user) {
        return done(null, false, { message: 'Invalid email.' });
      }
      const validPassword = bcrypt.compareSync(password, user.Password);
      if (!validPassword) {
        return done(null, false, { message: 'Invalid credentials.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);

// Export

passport.use(jwtStrategy);
passport.use(localStrategy);

export default passport;
