/* eslint-disable no-console */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as localStrategy } from "passport-local";
import bcryptjs from "bcryptjs"

passport.use(
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        async (email: string, password: string, done) => {
            try {
                const isUserExist = await User.findOne({email});

                if(!isUserExist){
                    return done(null, false, {message: "User does not exist"})
                }
                // if(!isUserExist){
                //     return done("User does not exist")
                // }

                const isGoogleAthenticated = await isUserExist.auths?.some(providerObjects => providerObjects.provider == "google")
                if(isGoogleAthenticated && !isUserExist.password){
                    return done( null, false, {message: "You have athenticated through google. So if you want to log in credentials, then at first login with google and set a password for your Gmail and then you can login with Gmail and password."})
                }
                // if(isGoogleAthenticated){
                //     return done( "You have athenticated through google. So if you want to log in credentials, then at first login with google and set a password for your Gmail and then you can login with Gmail and password.")
                // }

                const isPasswordMatched = await bcryptjs.compare(password as string , isUserExist.password as string)

                if(!isPasswordMatched){
                    return done(null, false, {message: "Password does not exist"})
                }

                return done(null , isUserExist)
            } catch (error) {
                done(error)
            }
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string
        }, async( accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=>{
            try {
                const email = profile.emails?.[0].value
                if(!email){
                    return done(null, false, {message:"No email found"})
                }
                let user = await User.findOne({email})

                if(!user){
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths:[
                            {
                                provider: "google",
                                providerId: profile.id
                            }
                        ]
                    })
                }
                return done(null, user)
            } catch (error) {
                console.log("Google strtegy error", error)
                return done(error)
            }
        }
    )
)

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async(id: string, done: any)=>{
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        console.log(error)
        done(error)
    }
})