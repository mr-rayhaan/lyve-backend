const { validateFormData, prefixImages } = require('../functions');
const fs_promises = require('fs').promises;
const fs = require('fs');
const dataFilePath = 'data/items.json';
const path = require('path');
// Implement the functions for each route
const getItemsController = async (req, res) => {
  try {
	  // Read data from the JSON file
	  const data = await fs_promises.readFile(dataFilePath, 'utf-8');
	  
	  // Parse the JSON data
	  const jsonData = JSON.parse(data);

        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // default to page 1 if not specified
        const limit = parseInt(req.query.limit) || 5; // default to 10 items per page
    
        // Calculate start and end index for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        // Get the current page of items
        const paginatedData = jsonData.slice(startIndex, endIndex);
  
		// Prefix the image URLs with the base URL only if they start with 'uploads/'
		const dataWithPrefixedImage = prefixImages(paginatedData)
	      // Send the paginated JSON data as the response
        res.json({
          totalItems: jsonData.length,
          totalPages: Math.ceil(jsonData.length / limit),
          currentPage: page,
          data: dataWithPrefixedImage
        });
	} catch (error) {
	  console.error('Error reading JSON file:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
}

const addItemController = (req, res) => {
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
    image: filePath,
    customization: newCustomizations,
};

const existingData = JSON.parse(fs.readFileSync(dataFilePath));
existingData.push(newItem);
fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));

res.status(200).json({ message: 'Data received and saved successfully' });
}


const deleteItemController = async (req, res) => {
  const index = req.body.index
	
	const menuItems = JSON.parse(await fs_promises.readFile(dataFilePath, 'utf-8'));

	if (index < 0 || index >= menuItems.length) {
	  return res.status(404).json({ message: 'Item not found' });
	}
	const deletedItem = menuItems[index];
	// Remove the item at the specified index
	menuItems.splice(index, 1);
	  // If the item has a local image path, delete the image file
	if (deletedItem.image && deletedItem.image.startsWith('uploads/')) {
		const imagePath = path.join(__dirname, '../../', deletedItem.image);
		await fs_promises.unlink(imagePath);
	}

	// Write the updated object back to the JSON file
	await fs_promises.writeFile(dataFilePath, JSON.stringify(menuItems, null, 2), 'utf-8');
  
	res.json({ message: 'Item deleted successfully', menuItems });
}

const getItemByIndexController = async (req, res) => {
  try {
	  const index = parseInt(req.params.index);
  
	  // Read the JSON data from the file
	  const jsonData = await fs_promises.readFile(dataFilePath, 'utf-8');
  
	  // Parse the JSON data into an object
	  const menuItems = JSON.parse(jsonData);
  
	  // Check if the index is valid
	  if (index < 0 || index >= menuItems.length) {
		return res.status(404).json({ message: 'Item not found' });
	  }
  
	  // Prefix the image URLs with the base URL only if they start with 'uploads/'
	const selectedItem = prefixImages(menuItems[index])
  
	  res.json({ message: 'Item retrieved successfully', selectedItem });
	} catch (error) {
	  console.error('Error retrieving item:', error);
	  res.status(500).json({ message: 'Internal server error' });
	}
}

const updateItemController = async (req, res) => {
  
	const formData = req.body;
  const index = Number(formData.index)
  const file = req.file;

	const existingData = JSON.parse(fs.readFileSync(dataFilePath));
  //Check if the index is valid
  if (index < 0 || index >= existingData.length) {
    return res.status(404).json({ message: 'Item not found' });
  }
	const newCustomizations = [];
  let customizationIndex = 0;

  // Iterate over customizations and variants dynamically
  while (formData[`customization_name_en_${customizationIndex}`] !== undefined) {
      const newCustomization = {
          name: {
              en: formData[`customization_name_en_${customizationIndex}`] || existingData[index].customization[customizationIndex].name.en,
              ar: formData[`customization_name_ar_${customizationIndex}`] || existingData[index].customization[customizationIndex].name.ar,
          },
          variants: [],
      };

      let variantIndex = 0;

      while (formData[`variant_name_en_${customizationIndex}_${variantIndex}`] !== undefined) {
          const newVariant = {
              name: {
                  en: formData[`variant_name_en_${customizationIndex}_${variantIndex}`] || existingData[index].customization[customizationIndex].variants[variantIndex].name.en,
                  ar: formData[`variant_name_ar_${customizationIndex}_${variantIndex}`] || existingData[index].customization[customizationIndex].variants[variantIndex].name.ar,
              },
              price: parseFloat(formData[`variant_price_${customizationIndex}_${variantIndex}`])  || existingData[index].customization[customizationIndex].variants[variantIndex].price,
          };

          newCustomization.variants.push(newVariant);
          variantIndex++;
      }

      newCustomizations.push(newCustomization);
      customizationIndex++;
  }
	let filePath = '';
	if (file) {
    //Store the image file on server
		filePath = `uploads/${file.filename}`;
		fs.renameSync(file.path, filePath);
    //Delete the previous image if it exists
    if (existingData[index].image && existingData[index].image.startsWith('uploads/')) {

      const imagePath = path.join(__dirname, '..', existingData[index].image);
      await fs_promises.unlink(imagePath);
    }
	}
  
	const newItem = {
        name: {
            en: formData.name_en || existingData[index].name.en,
            ar: formData.name_ar|| existingData[index].name.ar,
        },
        description: {
            en: formData.description_en || existingData[index].description.en,
            ar: formData.description_ar || existingData[index].description.en,
        },
        price: parseFloat(formData.price) || existingData[index].price,
        image: filePath === '' ? existingData[index].image : filePath,
        customization: newCustomizations,
    };

	existingData[index] = {...newItem}
	fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
	return res.json({ message: 'Item updated' }); 
}

module.exports = {
  getItems: getItemsController,
  addItem: addItemController,
  deleteItem: deleteItemController,
  getItemByIndex: getItemByIndexController,
  updateItem: updateItemController,
};