const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => { 
    //#swagger.tags=['Vehicles']
    try {
        const result = await mongodb.getDatabase().db().collection('vehicles').find();
        const vehicles = await result.toArray();

        if (vehicles.length === 0) {
            return res.status(204).send(); // No Content
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(vehicles);
    } catch (err) {
        console.error("Error finding vehicles information:", err);
        res.status(500).json({ message: "Server Error." });
    }
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    try {
        // Validar que el ID sea válido
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid vehicle ID." });
        }

        const vehicleId = new ObjectId(req.params.id);
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('vehicles')
            .find({ _id: vehicleId });

        result.toArray().then(vehicles => {
            if (vehicles.length === 0) {
                return res.status(204).send(); // No Content
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(vehicles[0]);
        }).catch(err => {
            console.error("Error during processing the results:", err);
            res.status(500).json({ message: "Error during processing the results." });
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ message: "Server Error." });
    }
};

const createVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    try {
        // Validate request body
        const { make, model, year, price, type, mileage, status } = req.body;

        if (!make || !model || !year || !price || !type) {
            return res.status(400).json({ message: "Missing required vehicle fields." });
        }

        const vehicle = { make, model, year, price, type, mileage, status };

        // Insert into database
        const response = await mongodb.getDatabase().db().collection('vehicles').insertOne(vehicle);

        if (response.acknowledged) {
            return res.status(201).json({ message: "Vehicle created successfully.", id: response.insertedId });
        }

        res.status(500).json({ message: "Error: vehicle has not been created." });
    } catch (err) {
        console.error("Error creating vehicle:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

const updateVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    try {
        // Validate ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid vehicle ID." });
        }

        const vehicleId = new ObjectId(req.params.id);

        // Validate request body
        const { make, model, year, price, type, mileage, status } = req.body;

        if (!make || !model || !year || !price || !type) {
            return res.status(400).json({ message: "Missing required vehicle fields." });
        }

        const vehicle = { make, model, year, price, type, mileage, status };

        // Attempt to update vehicle in the database
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('vehicles')
            .replaceOne({ _id: vehicleId }, vehicle);

        if (response.modifiedCount > 0) {
            return res.status(200).json({ message: "Vehicle updated successfully." });
        }

        res.status(404).json({ message: "Vehicle not found or no changes applied." });
    } catch (err) {
        console.error("Error updating vehicle:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

const deleteVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    try {
        // Validate ID
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid vehicle ID." });
        }

        const vehicleId = new ObjectId(req.params.id);

        // Attempt to delete the vehicle
        const response = await mongodb
            .getDatabase()
            .db()
            .collection('vehicles')
            .deleteOne({ _id: vehicleId });

        if (response.deletedCount > 0) {
            return res.status(200).json({ message: "Vehicle deleted successfully." });
        }

        res.status(404).json({ message: "Vehicle not found." });
    } catch (err) {
        console.error("Error deleting vehicle:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = {
    getAll,
    getSingle,
    createVehicle,
    updateVehicle,
    deleteVehicle
};