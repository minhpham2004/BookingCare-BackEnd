import db from '../models/index'
import bcrypt from 'bcryptjs'

const handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userData = {}
            const isExist = await checkUserEmail(email)

            if (isExist) {
                //user already exists --> compare password
                const user = await db.User.findOne({
                    attributes: { exclude: ['id', 'address', 'createdAt', "updatedAt", "gender", "image", "positionId", "phonenumber"] },
                    where: { email: email },
                    raw: true
                })

                if (user) {
                    const check = await bcrypt.compareSync(password, user.password);
                    userData.errMessage = check
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = 'ok'
                        delete user['password']
                        userData.data = user
                    } else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }

                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User not found'
                }

            } else {
                userData.errCode = 1;
                userData.errMessage = 'Your email does not exist in the system. Please try another email!'
            }

            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

const checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { email: userEmail }
            })

            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: { exclude: ["password"] },
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: { exclude: ["password"] },
                })
            }

            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

const createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const isExist = await checkUserEmail(data.email)

            if (isExist) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email has already been used. Please try another one!'
                })
            } else {
                const hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar
                })

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: { id: userId }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "User is not exist"
                })
            }
            await db.User.destroy({
                where: { id: userId }
            })
            resolve({
                errCode: 0,
                errMessage: "User is deleted"
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required params"
                })
            }

            const user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.gender = data.gender,
                user.positionId = data.positionId
                user.roleId = data.roleId
                user.image = data.avatar
                
                await user.save()
                resolve({
                    errCode: 0,
                    errMessage: 'Update user succeed!'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = {}
            if(!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            }
            const allcode = await db.Allcode.findAll({
                where: { type: typeInput }
            })                              
            response.errCode = 0
            response.data = allcode
            resolve(response)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService
}