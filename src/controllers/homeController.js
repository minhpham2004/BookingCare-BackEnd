import db from '../models/index'
import CRUDService from '../services/CRUDService'

const getHomePage = async (req, res) => {
    try {
        const data = await db.User.findAll() // User from 'models/user.js'
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        })
    } catch (e) {
        console.log(e);
    }
}

const getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

const postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body)
    return res.redirect('/get-crud')
}

const displayGetCRUD = async (req, res) => {
    const data = await CRUDService.getAllUsers()
    return res.render('displayCRUD.ejs', { dataTable: data })
}

const getEditCRUD = async (req, res) => {
    const userId = req.query.id
    if (userId) {
        const userData = await CRUDService.getUserInfoById(userId)
        return res.render('editCRUD.ejs', {
            user: userData
        })
    } else {
        return res.send('User not found')
    }
}

const putCRUD = async (req, res) => {
    const data = req.body
    await CRUDService.updateUserData(data)
    return res.redirect('/get-crud')
}

const deleteCRUD = async (req, res) => {
    const id = req.query.id
    if (id) {
        await CRUDService.deleteUserById(id)
        return res.redirect('/get-crud')
    } else {
        return res.send('User not found')
    }
}

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
}