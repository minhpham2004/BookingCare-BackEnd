import db from '../models/index'

const createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.image || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.image,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save new clinic succeed'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.Clinic.findAll({})
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer.from(item.image, 'base64').toString('binary')
                    return item
                })
            }

            resolve({
                errCode: 0,
                errMessage: 'ok',
                data
            })

        } catch (e) {
            reject(e)
        }
    })
}

const getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })

                if (data) {
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId']    
                    })
                    
                    data.doctorClinic = doctorClinic
                } else {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    errMessage: 'ok',
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById
}