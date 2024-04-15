import Users from "./models/userSchema.js"
import { createHash, isValidPassword } from "../utils/utils.js"

/* generamos consultas sobre los datos del usuario */
class UsersDao {
    static async getUserByEmail(email) {
        return await Users.findOne({ email })
    }
    
    static async getUserByCreds(email, password) {
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

    static async insert(first_name, last_name, age, email, password) {
        password = createHash(password); // Utilizar createHash de utils.js
        return await new Users({ first_name, last_name, age, email, password }).save();
    }

    static async insertGithub(userObj) {
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
            throw error;
        }
    } 


    static async getUserByID(id) {
        return await Users.findOne({ _id: id }, { first_name: 1, last_name: 1, age: 1, email: 1, password: 1 }).lean();
    };
}

export default UsersDao;


