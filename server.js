const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.static("public"));

const APP_TOKEN = "y5xJtFo7YVSjYLQS4cGi0R5lN";

/* ADD THIS BACK */
/**/

const datasets = [
    "pvqr-7yc4",
    "p7t3-5i9s",
    "kvfd-bves",
    "nc67-uf89",
    "f7b6-v6v3"
];

app.get("/tickets", async (req,res)=>{

    const plate = req.query.plate.toUpperCase();
    const state = req.query.state;

    try{

        const requests = datasets.map(dataset => {

            const url =
                `https://data.cityofnewyork.us/resource/${dataset}.json?$where=plate_id='${plate}' AND registration_state='${state}'&$limit=200&$$app_token=${APP_TOKEN}`;

            return fetch(url).then(r=>r.json());

        });

        const responses = await Promise.all(requests);

        const results = responses.flat();

        res.json(results);

    }catch(error){

        console.log(error);
        res.json([]);

    }

});

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});