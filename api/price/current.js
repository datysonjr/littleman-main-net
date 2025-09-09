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
    const contractAddress = "0xefde5ddb743bd93e68a75e410e985980457b5e8837c7f4afa36ecc12bb91022b";
    
    // Try to fetch real data from CoinGecko SUI network
    try {
      const coinGeckoResponse = await fetch(
        `https://api.coingecko.com/api/v3/onchain/networks/sui-network/tokens/${contractAddress}`,
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (coinGeckoResponse.ok) {
        const data = await coinGeckoResponse.json();
        if (data && data.data && data.data.price_usd) {
          return res.json({
            price: parseFloat(data.data.price_usd),
            change24h: data.data.price_change_percentage_24h || 0,
            volume24h: data.data.volume_24h_usd || 0,
            marketCap: data.data.market_cap_usd || 0,
            lastUpdated: new Date().toISOString(),
            source: "CoinGecko"
          });
        }
      }
    } catch (apiError) {
      console.log("CoinGecko API not available for this token, trying alternative sources...");
    }

    // Try alternative: Check if it's listed on major exchanges via CoinGecko search
    try {
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
            const priceResponse = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${mnmToken.id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
            );
            
            if (priceResponse.ok) {
              const priceData = await priceResponse.json();
              const tokenData = priceData[mnmToken.id];
              
              return res.json({
                price: tokenData.usd,
                change24h: tokenData.usd_24h_change || 0,
                volume24h: tokenData.usd_24h_vol || 0,
                marketCap: tokenData.usd_market_cap || 0,
                lastUpdated: new Date().toISOString(),
                source: "CoinGecko",
                tokenId: mnmToken.id
              });
            }
          }
        }
      }
    } catch (searchError) {
      console.log("CoinGecko search failed:", searchError);
    }
    
    // If no real data available, return a message indicating this
    res.json({
      price: null,
      change24h: null,
      volume24h: null,
      marketCap: null,
      lastUpdated: new Date().toISOString(),
      error: "Token not yet listed on major price tracking services",
      message: "This token may be newly launched and not yet indexed by price APIs. Real price data will appear once listed on exchanges.",
      contractAddress: contractAddress
    });
    
  } catch (error) {
    console.error("Error fetching price data:", error);
    res.status(500).json({ error: "Failed to fetch price data" });
  }
}