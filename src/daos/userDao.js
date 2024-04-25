import Users from "./models/userSchema.js"
import { createHash, isValidPassword } from "../utils/utils.js"
import CustomError from "../middlewares/customError.js"
import EErrors from "../middlewares/enums.js";
import {
    generateUserErrorInfo,
} from "../middlewares/errorUsers.js";



/* generamos consultas sobre los datos del usuario */
class UsersDao {
    async getUserByEmail(email) {
        return await Users.findOne({ email })
    }
    
    async getUserByCreds(email, password) {
        let user = await Users.findOne({ email }, { _id: 1, first_name: 1, last_name: 1, age: 1, email: 1, password: 1 }).lean();

        if (user) {
            let correctPwd = isValidPassword(user, password); // Utilizar isValidPassword de utils.js
            if (correctPwd) {
                delete user.password;
                return user;
            }
        }

        return null;
    }

    async insert(first_name, last_name, age, email, password) {
        password = createHash(password); // Utilizar createHash de utils.js
        return await new Users({ first_name, last_name, age, email, password }).save();
    }

    async insertGithub(userObj) {
        const { first_name, last_name, age, email, password } = userObj;
        const newUserFields = {
            first_name: first_name || "",
            last_name: last_name || "",
            age: age || "",
            email: email || "",
            password: password || ""
        };
        try {
            const newUser = new Users(newUserFields);
            return await newUser.save();
        } catch (error) {
            console.error("Error al insertar usuario:", error);
            CustomError.createError({
                name: "Error de registro",
                cause: generateUserErrorInfo({ first_name, last_name, age, email }),
                message: "Error al insertar usuario",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
    } 


    async getUserByID(id) {
        return await Users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1, password: 1 }).lean();
    };
}

export default UsersDao;


