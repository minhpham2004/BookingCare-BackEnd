import { query } from 'express';
import doctorService from '../services/doctorService'

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 10;
    try {
        const response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status.json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        const message = await doctorService.getAllDoctors()
        return res.status(200).json(message)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const postDoctorInfo = async (req, res) => {
    try {
        const response = await doctorService.saveDoctorDetailInfo(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getDetailDoctorById = async (req, res) => {
    try {
        const info = await doctorService.getDetailDoctorById(req.query.id)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const bulkCreateSchedule = async (req, res) => {
    try {
        const info = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getScheduleByDate = async (req, res) => {
    try {
        const info = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getExtraInfoDoctorById = async (req, res) => {
    try {
        const info = await doctorService.getExtraInfoDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getProfileDoctorById = async (req, res) => {
    try {
        const info = await doctorService.getProfileDoctorById(req.query.doctorId)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getListPatientForDoctor = async (req, res) => {
    try {
        const info = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date)
        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

const sendRemedy = async (req, res) => {
    try {
        const info = await doctorService.sendRemedy(req.body)
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
    getTopDoctorHome,
    getAllDoctors,
    postDoctorInfo,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy
}