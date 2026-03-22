const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.static("public"));

const APP_TOKEN = "y5xJtFo7YVSjYLQS4cGi0R5lN";

const datasets = [
    "pvqr-7yc4",
    "p7t3-5i9s",
    "kvfd-bves",
    "nc67-uf89",
    "f7b6-v6v3"
];

app.get("/tickets", async (req, res) => {
    const plate = (req.query.plate || "").toUpperCase().trim();
    const state = (req.query.state || "NY").toUpperCase().trim();

    if (!plate) {
        return res.status(400).json({ error: "Missing plate" });
    }

    try {
        const requests = datasets.map(async (dataset) => {
            const url =
                `https://data.cityofnewyork.us/resource/${dataset}.json` +
                `?$where=plate='${plate}' AND state='${state}'` +
                `&$limit=200&$$app_token=${APP_TOKEN}`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Dataset ${dataset} failed with status ${response.status}:`, errorText);
                return [];
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error(`Dataset ${dataset} returned non-array data:`, data);
                return [];
            }

            return data;
        });

        const responses = await Promise.all(requests);
        const results = responses.flat();

        res.json(results);
    } catch (error) {
        console.error("Tickets route error:", error);
        res.status(500).json({ error: "Failed to fetch tickets" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});