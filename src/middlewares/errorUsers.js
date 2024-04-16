const generateUserErrorInfo =(user)=>{
    return `Una o mas propiedades estan incompletas o no son validas.
    La lista de propiedades requeridas son:
    *first_name : formato string. recibido ${user.first_name}
    *last_name : formato string. recibido ${user.last_name}
    *email : formato string. recibido ${user.email}`
}
const generateUserErrorLogin =(user)=>{
    return `Una o mas propiedades estan incompletas o no son validas.
    La lista de propiedades requeridas son:
    *email : formato string. recibido ${user.email}
    *password : formato string. recibido ${user.password}`
}
const generateUserErrorEmail=(user)=>{
    return `Una o mas propiedades estan incompletas o no son validas.
    La lista de propiedades requeridas son:
    *email : formato string. recibido ${user.email}`}

const generateUserErrorPassword=(user)=>{
    return `Una o mas propiedades estan incompletas o no son validas.
    La lista de propiedades requeridas son:
    *password : formato string. recibido ${user.password}`}


    export {
        generateUserErrorInfo,
        generateUserErrorLogin,
        generateUserErrorEmail,
        generateUserErrorPassword
    };