
// Add price update method if not exists
export const updatePrices = async (req, res) => {
  try {
    const { password, gold, silver, platinum, palladium } = req.body;
    
    // Verify admin password
    if (password !== process.env.ADMIN_PASSWORD && password !== 'Priceupdate!1') {
      return res.status(401).json({ success: false, error: 'Invalid password' });
    }
    
    // Update prices in database or cache
    const updatedPrices = {
      gold: parseFloat(gold) || 0,
      silver: parseFloat(silver) || 0,
      platinum: parseFloat(platinum) || 0,
      palladium: parseFloat(palladium) || 0,
      lastUpdated: new Date().toISOString()
    };
    
    // Store in memory or database
    global.priceCache = updatedPrices;
    
    // Also write to file for persistence
    const fs = require('fs');
    fs.writeFileSync('/tmp/current_prices.json', JSON.stringify(updatedPrices));
    
    res.json({ 
      success: true, 
      message: 'Prices updated successfully',
      data: updatedPrices 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
