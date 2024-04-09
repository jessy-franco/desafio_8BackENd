import UsersDao from '../daos/userDao.js';
import UserDTO from '../dtos/UserDTO.js';

class UserRepository {
    constructor() {
        this.usersDao = new UsersDao();
    }
    async createUser(userData) {
        return await this.usersDao.insert(userData.first_name, userData.last_name, userData.age, userData.email, userData.password);
    }

    async getUserByEmail(email) {
        const user = await this.usersDao.getUserByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    async getUserByCredentials(email, password) {
        const user = await this.usersDao.getUserByCreds(email, password);
        return user ? new UserDTO(user) : null;
    }

}

export default UserRepository;
