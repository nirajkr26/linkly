import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import UserModel, { type IUser } from "../models/user.model";
import { findUserById } from "../dao/user.dao";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: `${BACKEND_URL}/api/auth/google/callback`
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) {
                    return done(new Error("No email found in Google profile"), false);
                }

                // Check if user exists by Google ID or email
                let user = await UserModel.findOne({
                    $or: [
                        { googleId: profile.id },
                        { email: email }
                    ]
                });

                if (!user) {
                    // Create new user
                    user = await UserModel.create({
                        name: profile.displayName,
                        email: email,
                        googleId: profile.id,
                        avatar: profile.photos?.[0]?.value,
                        provider: 'google'
                    });
                } else {
                    // Update existing user
                    user.googleId = profile.id;
                    user.avatar = profile.photos?.[0]?.value;
                    user.name = profile.displayName;
                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err as Error, false);
            }
        }
    )
);

// Passport serialization
passport.serializeUser((user: Express.User, done) => {
    done(null, (user as IUser).id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await findUserById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});