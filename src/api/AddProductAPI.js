
const BASE_URLS = import.meta.env.VITE_BASE_URL;

export const calculateTax = async (salePrice, igst, discount) => {
  const payload = {
    sale_price: Number(salePrice) || 0,  // Use correct field name
    igst: Number(igst) || 0,             // Ensure IGST is sent as "igst"
    discount: Number(discount) || 0,     // Ensure discount is sent as "discount"
};

  try {
      const response = await fetch(`${BASE_URLS}/Mathavan/calculation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      if (!response.ok) {
          throw new Error(`API error ${response.status}: ${await response.text()}`);
      }

      return await response.json();
  } catch (error) {
      console.error('❌ API call failed:', error);
      throw error;
  }
};

export const calculateOpeningStockValue = async (salePrice, openingStock) => {
  try {
    const response = await fetch(`${BASE_URLS}/Mathavan/stock/openningvalue/api/calculation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sale_price: salePrice,
        openning_stock: openingStock,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error in calculateOpeningStockValue:", error);
    return null;
  }
};

export const saveProductDetails = async (data) => {
  try {
    console.log("data from api",data);
    
    const response = await fetch(`${BASE_URLS}/Mathavan/product/all/details/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json(); // Returning API response
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
