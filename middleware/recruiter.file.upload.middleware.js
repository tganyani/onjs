import multer from 'multer'


const fileStorage = multer.diskStorage({
    destination: (request,
        file,
        callback) => {
        const uploadFolder = './public'
        callback(null, uploadFolder)
    },
    filename: (req,
        file,
        callback) => {
        callback(null, `/recruiter/profile-images/${Date.now()}-${file.originalname}`)
    }
})

export const uploadRecruiterProfile = multer({
    storage: fileStorage
})