import specialtyService from '../services/specialtyService'

const createSpecialty = async (req, res) => {
    try {
        const info = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getAllSpecialty = async (req, res) => {
    try {
        const info = await specialtyService.getAllSpecialty()
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getDetailSpecialtyById = async (req, res) => {
    try {
        const info = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}