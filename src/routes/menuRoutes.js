const express = require('express');
const router = express.Router();
const { getItems, addItem, deleteItem, getItemByIndex, updateItem } = require('../controllers/menuController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage: storage });


router.get('/', getItems);
router.post('/addItem', upload.single('image'), addItem);
router.post('/deleteItem', deleteItem);
router.get('/getItemByIndex/:index', getItemByIndex);
router.post('/updateItem', upload.single('image'), updateItem);

module.exports = router;
