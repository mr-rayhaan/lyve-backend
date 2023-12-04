const express = require('express')
const app = express()
const port = 3001
const fs_promises = require('fs').promises;
const fs = require('fs');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const dataFilePath = 'data/items.json';
const multer = require('multer');

app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage: storage });
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

app.get('/api/', async (req, res) => {
	try {
	  // Read data from the JSON file
	  const data = await fs_promises.readFile(dataFilePath, 'utf-8');
	  
	  // Parse the JSON data
	  const jsonData = JSON.parse(data);
  
	  // Send the JSON data as the response
	  res.json(jsonData);
	} catch (error) {
	  console.error('Error reading JSON file:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
});
app.post('/api/addItem', upload.single('image'), (req, res) => {
	// Create the data file if it doesn't exist
	if (!fs.existsSync(dataFilePath)) {
		fs.writeFileSync(dataFilePath, '[]');
	}
	const formData = req.body;
	const file = req.file;

    // Validate the form data
    if (!validateFormData(formData)) {
        return res.status(400).json({ error: 'Invalid form data' });
    }

	// Move the uploaded file to a permanent location (you might want to handle errors more gracefully)
	const filePath = `uploads/${file.filename}`;
	fs.renameSync(file.path, filePath);

	const newItem = {
		name: {
		  en: formData.name_en,
		  ar: formData.name_ar,
		},
		description: {
		  en: formData.description_en,
		  ar: formData.description_ar,
		},
		price: parseFloat(formData.price),
		image: "http://localhost:3001/" + filePath,
		customization: [
		  {
			name: {
			  en: formData.customization_name_en,
			  ar: formData.customization_name_ar,
			},
			variants: [
			  {
				name: {
				  en: formData.variant_name_en,
				  ar: formData.variant_name_ar,
				},
				price: parseFloat(formData.variant_price),
			  },
			],
		  },
		],
	  };
    // Read existing data from the file
    const existingData = JSON.parse(fs.readFileSync(dataFilePath));

    // Append the new data with the image URL
    // const newData = {
    //     ...formData,
    //     image: "http://localhost:3001/" +filePath,
    // };

    existingData.push(newItem);

    // Write the updated data back to the file
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: 'Data received and saved successfully' });
});

const validateFormData = (formData) => {
    // Add your validation logic here
    const {
        name_en,
        name_ar,
        description,
        price,
        customization_name_en,
        customization_name_ar,
        variant_name_en,
        variant_name_ar,
        variant_price,
    } = formData;

    if (
        name_en === '' ||
        name_ar === ''||
        description === ''||
        customization_name_en === ''||
        customization_name_ar === ''||
        variant_name_en === ''||
        variant_name_ar === ''
    ) {
        return false;
    }

    return true;
};


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})