const base_url = process.env.BASE_URL || 'http://localhost:3001';
const validateFormData = (formData) => {
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
const prefixImages = (jsonData) => {
	if (Array.isArray(jsonData)) {
		return jsonData.map(item => {
			if (item.image && item.image.startsWith('uploads/')) {
			  return {
				...item,
				image: `${base_url}/${item.image}`
			  };
			} else {
			  return item;
			}
		  });
	} else if (typeof jsonData === 'object' && jsonData !== null) {
		// If jsonData is an object
		if (jsonData.image && jsonData.image.startsWith('uploads/')) {
		  return {
			...jsonData,
			image: `${base_url}/${jsonData.image}`
		  };
		} else {
		  return jsonData;
		}
	} else {
		// Handle other cases (e.g., jsonData is not an array or object)
		return jsonData;
	}

}
module.exports = {
    validateFormData,
    prefixImages,
};