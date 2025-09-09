export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const days = parseInt(req.query.days) || 7;
    const contractAddress = "0xefde5ddb743bd93e68a75e410e985980457b5e8837c7f4afa36ecc12bb91022b";
    
    // Try to fetch real historical data
    try {
      // First try CoinGecko search to find the token
      const searchResponse = await fetch(
        `https://api.coingecko.com/api/v3/search?query=MNM+sui`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (searchResponse.ok) {
        const searchData = await searchResponse.json();
        if (searchData.coins && searchData.coins.length > 0) {
          const mnmToken = searchData.coins.find((coin) => 
            coin.symbol.toLowerCase() === 'mnm' || coin.name.toLowerCase().includes('little man')
          );
          
          if (mnmToken) {
            const historyResponse = await fetch(
              `https://api.coingecko.com/api/v3/coins/${mnmToken.id}/market_chart?vs_currency=usd&days=${days}`
            );
            
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              const priceHistory = historyData.prices.map((item, index) => ({
                timestamp: new Date(item[0]).toISOString(),
                price: item[1],
                volume: historyData.total_volumes[index] ? historyData.total_volumes[index][1] : 0
              }));
              
              return res.json(priceHistory);
            }
          }
        }
      }
    } catch (apiError) {
      console.log("Unable to fetch real historical data for this token");
    }
    
    // If no real data available, return empty array with message
    res.json({
      error: "Historical data not available",
      message: "This token is not yet listed on price tracking services. Historical data will be available once the token is indexed by major exchanges.",
      contractAddress: contractAddress,
      data: []
    });
    
  } catch (error) {
    console.error("Error fetching price history:", error);
    res.status(500).json({ error: "Failed to fetch price history" });
  }
}