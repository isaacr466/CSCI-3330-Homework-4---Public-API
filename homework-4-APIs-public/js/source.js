// *********************************************************************
// Homework 4 Public APIs
// *********************************************************************

function formatYearFromStr(dateString) {
  return dateString.split('-')[0];
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

localStorage.setItem("game_id", "");
localStorage.setItem("api_key", "");



async function load(){
    
    // add as many more as needed
    let gameID = localStorage.getItem("game_id");
    let apiKey = localStorage.getItem("api_key");
    
    // **************** Write you code below **************** 

    // Ask for the values because the starter code above resets localStorage.
    if (!gameID) {
        gameID = prompt("Enter the Elden Ring game ID:", "442240");
    }

    if (!apiKey) {
        apiKey = prompt("Enter your GameBrain API key:");
    }

    if (!gameID || !apiKey) {
        console.log("Game ID or API key was not provided.");
        return;
    }

    try {
        const response = await fetch(
            `https://api.gamebrain.co/v1/games/${gameID}?api-key=${encodeURIComponent(apiKey)}`
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const game = await response.json();

        console.log("GameBrain game details:", game);
    } catch (error) {
        console.error("Could not load game details:", error);
    }
}
load();


   