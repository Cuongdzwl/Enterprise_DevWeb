import { ExtractJwt, Strategy as Jwt } from 'passport-jwt';
import { Strategy as Google } from 'passport-google-oauth2';
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
  secretOrKey: process.env.JWT_SECRET || 'de',
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
const localStrategy = new Local(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      var users = await usersService.filter('Email', email);
      L.info(users);
      const user: User = users[0];
      if (!user) {
        return done(null, false, { message: 'Invalid email.' });
      }
      const validPassword = bcrypt.compareSync(password, user.Password);
      if (!validPassword) {
        return done(null, false, { message: 'Invalid credentials.' });
      }
      L.info('' + user.RoleID);
      return done(null, user);
    } catch (err) {
      L.info('error: ' + err);
      return done(err);
    }
  }
);

const googleStrategy = new Google(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: 'api/v1/auth/google/callback',
    passReqToCallback: true, // Pass the entire request to callback
  },
  async (req : Request, accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      L.info(req)
      L.info(accessToken)
      L.info(refreshToken)
      L.info(profile)

      const existingUser = await usersService.filter('GoogleID',profile.id);
      const user = existingUser[0]
      if (user) {
        return done(null, user); // User already exists
      }
      // Handle bind email to existing account

      done(null, user); 
    } catch (error) {
      console.error(error);
      done(error, null);
    }
  }
);
if(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET){
  passport.use(googleStrategy);
}

// Export

passport.use(jwtStrategy);
passport.use(localStrategy);

export default passport;
