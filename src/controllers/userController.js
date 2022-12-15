import userService from '../services/userService'

const handleLogin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing required params'
        })
    }

    const userData = await userService.handleUserLogin(email, password)

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.data ? userData.data : {}
    })
}

const handleGetAllUsers = async (req, res) => {
    const id = req.query.id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required params',
            users: []
        })
    }

    const users = await userService.getAllUsers(id)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}

const handleCreateNewUser = async (req, res) => {
    const message = await userService.createNewUser(req.body)

    return res.status(200).json(message)
}

const handleEditUser = async (req, res) => {
    const data = req.body
    const message = await userService.updateUserData(data)
    return res.status(200).json(message)
}

const handleDeleteUser = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required params"
        })
    }

    const message = await userService.deleteUser(id)
    return res.status(200).json(message)
}

const getAllCode = async (req, res) => {
    try {
        const data = await userService.getAllCodeService(req.query.type)
        return res.status(200).json(data)
    } catch (e) {
        console.log('Get all code error', e)
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode
}