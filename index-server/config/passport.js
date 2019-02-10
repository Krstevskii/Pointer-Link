const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const request = require('request');
const { secretOrKey } = require('./keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        request.post({
            url: 'http://users-service:3001/getuserbyid',
            form: { userid: jwt_payload.id }
        }, (err, resp, body) => {
            if(resp.statusCode !== 400)
                return done(null, JSON.parse(body));
            return done(null, false);
        });
    }))
};