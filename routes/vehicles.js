const express = require('express');

const router = express.Router();

const vehiclesController = require('../controllers/vehicles');

router.get('/', vehiclesController.getAll);

router.get('/:id', vehiclesController.getSingle);

router.post('/', vehiclesController.createVehicle);

router.put('/:id', vehiclesController.updateVehicle);

router.delete('/:id', vehiclesController.deleteVehicle);

module.exports = router;