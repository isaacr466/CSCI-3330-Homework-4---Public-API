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

async function load() {
    // add as many more as needed
    let gameID = localStorage.getItem("game_id");
    let apiKey = localStorage.getItem("api_key");

    // **************** Write you code below ****************

    // Ask for the values because the starter code above resets localStorage.
    if (!gameID) {
        gameID = prompt("Enter a GameBrain game ID:", "442240");
    }

    if (!apiKey) {
        apiKey = prompt("Enter your GameBrain API key:");
    }

    if (!gameID || !apiKey) {
        console.log("Game ID or API key was not provided.");
        return;
    }

    try {
        // Fetch the selected game's details
        const response = await fetch(
            `https://api.gamebrain.co/v1/games/${gameID}?api-key=${encodeURIComponent(apiKey)}`
        );

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const game = await response.json();

        // Fetch news related to the selected game
        const newsResponse = await fetch(
            `https://api.gamebrain.co/v1/games/${gameID}/news?api-key=${encodeURIComponent(apiKey)}`
        );

        if (!newsResponse.ok) {
            throw new Error(`News API request failed: ${newsResponse.status}`);
        }

        const news = await newsResponse.json();

        // Search for games related to the selected game
        const similarResponse = await fetch(
            `https://api.gamebrain.co/v1/games?query=${encodeURIComponent(
                `games similar to ${game.name}`
            )}&api-key=${encodeURIComponent(apiKey)}`
        );

        if (!similarResponse.ok) {
            throw new Error(
                `Similar games request failed: ${similarResponse.status}`
            );
        }

        const similarData = await similarResponse.json();

        // Display up to four similar games
        const similarCards = document.querySelectorAll(".game-card");

        similarCards.forEach((card, index) => {
            const similarGame = similarData.results[index];

            if (similarGame) {
                card.querySelector("h3").textContent = similarGame.name;

                const meta = card.querySelectorAll(".game-card-meta span");

                meta[0].textContent = Math.trunc(similarGame.year);
                meta[1].textContent = formatPercentage(
                    similarGame.rating.mean
                );

                if (similarGame.screenshots?.length > 0) {
                    card.querySelector("img").src =
                        similarGame.screenshots[0];
                }
            }
        });

        // Display up to three news stories
        const newsCards = document.querySelectorAll(".news-card");

        newsCards.forEach((card, index) => {
            const article = news.news[index];

            if (article) {
                card.querySelector("h3").textContent = article.title;
                card.querySelector(".news-published").textContent =
                    formatYearFromStr(article.published);
                card.querySelector("img").src = article.image;
            }
        });

        // Display the main game's details
        document.querySelector("#game-name").textContent = game.name;
        document.querySelector(".game-image img").src = game.image;

        document.querySelector(".game-meta").textContent =
            `${game.developer} • ${formatYearFromStr(game.release_date)}`;

        document.querySelector(".game-genre").textContent = game.genre;
    } catch (error) {
        console.error("Could not load game details:", error);
    }
}

load();