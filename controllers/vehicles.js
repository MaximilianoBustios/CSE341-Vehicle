const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['Vehicles']
    const result = await mongodb.getDatabase().db().collection('vehicles').find();
    result.toArray().then(vehicles => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(vehicles);
    });
};

const getSingle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    const vehicleId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('vehicles').find({ _id: vehicleId });
    result.toArray().then(vehicles => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(vehicles[0]);
    });
};

const createVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    const vehicle = {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price,
        type: req.body.type,
        mileage: req.body.mileage,
        status: req.body.status
    };
    const response = await mongodb.getDatabase().db().collection('vehicles').insertOne(vehicle);
    if (response.acknowledged > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while creating the vehicle.');
    }
};

const updateVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    const vehicleId = new ObjectId(req.params.id);
    const vehicle = {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        price: req.body.price,
        type: req.body.type,
        mileage: req.body.mileage,
        status: req.body.status
    };
    const response = await mongodb.getDatabase().db().collection('vehicles').replaceOne({ _id: vehicleId }, vehicle);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while updating the vehicle.');
    };
};

const deleteVehicle = async (req, res) => {
    //#swagger.tags=['Vehicles']
    const vehicleId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection('vehicles').deleteOne({ _id: vehicleId });
    if (response.deletedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Some error occurred while deleting the vehicle.');
    };
}


module.exports = {
    getAll,
    getSingle,
    createVehicle,
    updateVehicle,
    deleteVehicle
};