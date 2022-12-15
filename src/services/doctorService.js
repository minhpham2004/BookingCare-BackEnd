import db from "../models/index"
require('dotenv').config()
import _ from 'lodash'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

const getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'positionData' },
                    { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'genderData' }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

const checkRequiredFields = (inputData) => {
    const arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'specialtyId']

    let isValid = true
    let element = []

    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false;
            element = arr[i]
            break;
        }
    }

    return { isValid, element }
}

const saveDoctorDetailInfo = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkObj = checkRequiredFields(inputData)
            if (!checkObj.isValid) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter ${checkObj.element}`
                })
            } else {
                //upsert to Markdown table
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                    })
                } else if (inputData.action === 'EDIT') {
                    const doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctorMarkdown) {
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.description = inputData.description

                        await doctorMarkdown.save()
                    }
                }

                //upsert to Doctor_infor table
                const doctorInfo = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                })

                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId
                    doctorInfo.priceId = inputData.selectedPrice
                    doctorInfo.paymentId = inputData.selectedPayment
                    doctorInfo.provinceId = inputData.selectedProvince
                    doctorInfo.addressClinic = inputData.addressClinic
                    doctorInfo.nameClinic = inputData.nameClinic
                    doctorInfo.specialtyId = inputData.specialtyId
                    doctorInfo.note = inputData.note

                    await doctorInfo.save()
                } else {
                    //create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        specialtyId: inputData.specialtyId,
                        note: inputData.note
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save doctor information succeed!'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required params"
                })
            } else {
                const data = await db.User.findOne({
                    where: {
                        id: id,
                        roleId: 'R2'
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'], as: 'markdownData' },
                        { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'positionData' },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            as: 'doctorInfoData',
                            include: [
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'priceTypeData' },
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'paymentTypeData' },
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'provinceTypeData' }
                            ]
                        }
                    ],
                    raw: true,
                    nest: true
                })
                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Doctor not found'
                    })
                }
                resolve({
                    errCode: 0,
                    data: data
                })
                if (data && data.image) {
                    data.image = new Buffer.from(data.image, 'base64').toString('binary')
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}

const bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let schedule = data.arrSchedule
            if (!schedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })

                    //get existed booking schedule
                    let existing = await db.Schedule.findAll({
                        where: { doctorId: data.doctorId, date: data.formattedDate },
                        attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                    })

                    //check difference
                    const toCreate = _.differenceWith(schedule, existing, (a, b) => {
                        return a.timeType == b.timeType && a.date == b.date
                    })

                    //only accept booking if the schedule is different from the previous bookings from database
                    if (toCreate && toCreate.length > 0) {
                        await db.Schedule.bulkCreate(toCreate)
                        resolve({
                            errCode: 0,
                            errMessage: 'Bulk create schedule ok'
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'This doctor time has been booked'
                        })
                    }
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                const dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'timeTypeData' },
                        { model: db.User, attributes: ['firstName', 'lastName'], as: 'doctorNameData' }
                    ],
                    raw: true,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getExtraInfoDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                const data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    attributes: {
                        exclude: ['id', 'doctorId']
                    },
                    include: [
                        { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'priceTypeData' },
                        { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'paymentTypeData' },
                        { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'provinceTypeData' }
                    ],
                    raw: true,
                    nest: true
                })

                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Doctor not found'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required params'
                })
            } else {
                const data = await db.User.findOne({
                    where: { id: doctorId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'], as: 'markdownData' },
                        { model: db.Allcode, attributes: ['valueVi', 'valueEn'], as: 'positionData' },
                        {
                            model: db.Doctor_Infor,
                            attributes: { exclude: ['id', 'doctorId'] },
                            as: 'doctorInfoData',
                            include: [
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'priceTypeData' },
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'paymentTypeData' },
                                { model: db.Allcode, attributes: ['valueEn', 'valueVi'], as: 'provinceTypeData' }
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Doctor not found'
                    })
                } else {
                    if (data && data.image) {
                        data.image = new Buffer.from(data.image, 'base64').toString('binary')
                    }
                    resolve({
                        errCode: 0,
                        data: data
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    saveDoctorDetailInfo,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById
}