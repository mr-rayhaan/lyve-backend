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
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, '[]');
    }

    const formData = req.body;
    const file = req.file;

    if (!validateFormData(formData)) {
        return res.status(400).json({ error: 'Invalid form data' });
    }

    const filePath = `uploads/${file.filename}`;
    fs.renameSync(file.path, filePath);

    const newCustomizations = [];
    let customizationIndex = 0;

    // Iterate over customizations and variants dynamically
    while (formData[`customization_name_en_${customizationIndex}`] !== undefined) {
        const newCustomization = {
            name: {
                en: formData[`customization_name_en_${customizationIndex}`],
                ar: formData[`customization_name_ar_${customizationIndex}`],
            },
            variants: [],
        };

        let variantIndex = 0;

        while (formData[`variant_name_en_${customizationIndex}_${variantIndex}`] !== undefined) {
            const newVariant = {
                name: {
                    en: formData[`variant_name_en_${customizationIndex}_${variantIndex}`],
                    ar: formData[`variant_name_ar_${customizationIndex}_${variantIndex}`],
                },
                price: parseFloat(formData[`variant_price_${customizationIndex}_${variantIndex}`]),
            };

            newCustomization.variants.push(newVariant);
            variantIndex++;
        }

        newCustomizations.push(newCustomization);
        customizationIndex++;
    }

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
        image: `http://localhost:3001/${filePath}`,
        customization: newCustomizations,
    };

    const existingData = JSON.parse(fs.readFileSync(dataFilePath));
    existingData.push(newItem);
    fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

    res.status(200).json({ message: 'Data received and saved successfully' });
});

app.post('/api/deleteItem', (req, res) => {
	console.log(req.body)
	return;
	const index = req.body;
	if (index < 0 || index >= menuItems.length) {
	  return res.status(404).json({ message: 'Item not found' });
	}
  
	// Remove the item at the specified index
	menuItems.splice(index, 1);
  
	res.json({ message: 'Item deleted successfully', menuItems });
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