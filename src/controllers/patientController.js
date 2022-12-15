import patientService from '../services/patientService'

const postBookAppointment = async (req, res) => {
    try {
        const info = await patientService.postBookAppointment(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const postVerifyBookAppointment = async (req, res) => {
    try {
        const info = await patientService.postVerifyBookAppointment(req.body)
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
    postBookAppointment,
    postVerifyBookAppointment
}