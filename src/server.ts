import fastify from "fastify";
import fs from "fs";
import { request } from "http";
import path from "path"
import { DriveParamsModule } from "./module/DriveParams";
import cors from "@fastify/cors"

const server = fastify({ logger: true });

server.register(cors, {
    origin: "*",
})

const pathDataCars = path.join(__dirname, "./data/cars.json");
const pathDataDrivers = path.join(__dirname, "./data/drivers.json");

// Leitura do arquvio Drivers.json
const rawdataDrivers = fs.readFileSync(pathDataDrivers, "utf-8");
const jsonFileDrivers = JSON.parse(rawdataDrivers);

//Leitura do arquvio Cars.json
const rawdataCars = fs.readFileSync(pathDataCars,"utf-8");
const jsonFileCars = JSON.parse(rawdataCars);

server.get("/teams", async (request, response) => {
    response.type("application/json").code(200);

    return jsonFileCars;
});


server.get("/drivers", async (request, response) => {
    response.type("application/json").code(200);

    return jsonFileDrivers;

});

server.get<{Params: DriveParamsModule}>("/drivers/:id", async (request, response) => {
    const id = parseInt(request.params.id);
    const driver = jsonFileDrivers.filter((d: DriveParamsModule) => parseInt(d.id) === id);

    if(!driver){
        response.type("application/json").code(404);
        return { message: "Driver not found"};
    }else {
        response.type("application/json").code(200);
        return{ driver };
    }
});

server.listen({port: 3333}, () => {
    console.log("Server init")
});