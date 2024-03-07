import GitHubStrategy from "passport-github2"
import UsersDao from "../daos/userDao.js"
import passport from "passport"
import { createHash, isValidPassword } from "../utils/utils.js"
import local from "passport-local"


const LocalStrategy = local.Strategy;


const initializePassport = () => {
    /* sesion con passport-Local */

    passport.use("register", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                let user = await UsersDao.getUserByEmail(username);
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                };
                let result = await UsersDao.insert(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al obtener usuario: " + error);
            }
        }
    ));
    

    /* funciones de serializacion y deserializacion */
    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    
    passport.deserializeUser(async function(id, done) {
        try {
            const user = await UsersDao.getUserByID(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
    
    

    passport.use("login", new LocalStrategy({usernameField:"email"},async(username, password, done)=>{
        try{
            const user = await UsersDao.getUserByEmail(username)
            if(!user){
                console.log ("el usuario no existe")
                return done (null, false)
            }
            if(!isValidPassword(user, password)) return done (null, false);
            return done (null, user)
        }
        catch(error){
            return done(error)
        }
    }))

    /* sesion con github */
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.8aacf63cf9714cdc",
        clientSecret: "10ef18ba5a7ed9a47c31afe4e5cda5f3036eac56",
        callbackUrl: "http://localhost:3000/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let email = profile._json.email;
            if (!email) {
                // Si el email es null, no se puede realizar una búsqueda por email
                return done(null, false);
            }

            let user = await UsersDao.getUserByEmail(profile._json.email);/* no registra newUser...porque? */
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: "",
                    email: profile._json.email,
                    password: ""
                }
                let result = await UsersDao.insertGithub(newUser);
                done(null, result);
            }
            else {
                /* si el usuario ya existe */
                done(null, user);
            }
        } catch (error) {
            return done(error)
        }



    }))
}
export default initializePassport;