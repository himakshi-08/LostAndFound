const fs = require('fs');
const https = require('https');

const code = `%%{init: {'theme': 'dark', 'themeVariables': { 'primaryColor': '#1e293b', 'primaryTextColor': '#f8fafc', 'primaryBorderColor': '#3b82f6', 'lineColor': '#818cf8', 'secondaryColor': '#0f172a', 'tertiaryColor': '#0f172a'}}}%%
flowchart TD
    A([User Authentication]) --> B{User Action}
    
    B -->|Loses Item| C[Submit Lost Report]
    B -->|Finds Item| D[Submit Found Report]
    
    D --> E[Set Custom Security Question]
    
    C --> F{{"⚡ AI Matching Engine ⚡"}}
    D --> F
    
    F -->|Analyzes Text & Location| G{Confidence Score > 10%?}
    
    G -->|Yes| H[Match Displayed to Loser]
    G -->|No| I[Keep Scanning in Background]
    
    H --> J[Loser Clicks 'Claim Item']
    J --> K[Loser Answers Finder's Question]
    
    K --> L{Fuzzy Logic Verification}
    
    L -->|Answer Incorrect| M[Claim Status: Pending / Rejected]
    L -->|Answer Correct| N([Item Status: Recovered! ✓])
    
    N --> O([Finder Awarded Reputation Points])
`;

const options = {
    hostname: 'kroki.io',
    port: 443,
    path: '/mermaid/png',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': Buffer.byteLength(code)
    }
};

const req = https.request(options, (res) => {
    if (res.statusCode !== 200) {
        console.error('Failed to download image: HTTP ' + res.statusCode);
        return;
    }
    const file = fs.createWriteStream('final_flowchart.png');
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('Downloaded to final_flowchart.png');
    });
});

req.on('error', (e) => {
    console.error('Error: ' + e.message);
});

req.write(code);
req.end();
