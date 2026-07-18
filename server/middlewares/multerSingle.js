import multer from 'multer';

export const uploadImage = (folder) =>{
    const storage = multer.diskStorage({
        destination: `./public/images/${folder}`,
        filename: (req, file, cb) => {
            cb(null, "Id-" + Date.now() + "-" + file.originalname);
        }
    })
    


    // any() acepta CUALQUIER campo de archivo, así que no rompe lo que los demás tengan.
    // Lo uso cuando subo en un mismo form 2 archivos diferentes (Por no usar el campo fields)
    // Ya que en ese caso se recogeria los datos en req.files, en lugar de req.file
    // const  upload = multer({storage}).single("img");
    //return upload;

    // Filtro para validar tipos de archivos
    const fileFilter = (req, file, cb) => {
        const allowedTypes = [
        // Imágenes
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'image/avif',
        'image/bmp',
        // Documentos
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            // Se asigna al error el nombre exacto del campo
            const error = new Error("Formato de archivo no permitido.");
            error.field = file.fieldname; 
            cb(error, false);
        }
    };

    const  upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 10 * 1024 * 1024 } // Límite 10MB
    }).any();

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err) {
                // Obtenemos el nombre del campo que causó el error (img) 
                // o si es un error general, enviamos 'file'
                const fieldName = err.field || 'file';
                    return res.status(400).json({ 
                        error: fieldName, // Ahora enviará 'img' (o el nombre que se asigne)
                        details: err.message 
                    });
                }
                next();
        });
    };

}