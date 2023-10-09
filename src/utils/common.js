export function setToken(token){
    localStorage.setItem('mtoken', token);  
}

export function getToken(){
    return localStorage.getItem("mtoken")
}

export function removeToken(){
    localStorage.removeItem("mtoken")
}

export function setLUsers(users){
    const Users = JSON.stringify(users)
    localStorage.setItem("musers", Users)
}

export function getLUsers(){
    return localStorage.getItem("musers")
}

export function removeLUsers(){
    localStorage.removeItem("musers");
}

export function updateLUsers(values){
    const {email, name, phone} = values
    const existingUsers = JSON.parse(localStorage.getItem("musers")) || [];

    const userIndex = existingUsers.findIndex((user) => user.email === values.email);

        existingUsers[userIndex] = {
            ...existingUsers[userIndex],
            ...values,
        };

        localStorage.setItem("musers", JSON.stringify(existingUsers));

    return localStorage.getItem("musers")
}