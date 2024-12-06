const express = require('express');

const router = express.Router();

const vehiclesController = require('../controllers/vehicles');

const { isAuthenticated } = require("../middleware/authenticate")

router.get('/', vehiclesController.getAll);
router.get('/:id', vehiclesController.getSingle);
router.post('/', isAuthenticated, vehiclesController.createVehicle);
router.put('/:id', isAuthenticated, vehiclesController.updateVehicle);
router.delete('/:id', isAuthenticated, vehiclesController.deleteVehicle);

module.exports = router;