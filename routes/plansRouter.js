const express = require('express');
const plansController = require("../controlles/plansController");


const router = express.Router({ mergeParams: true });

// router.get('/:cityName/generate', plansController.generatePlan );
router.get('/:cityName/generate', plansController.generatePlans );
router.get('/generate', plansController.generateRandomPlansAll );

router
  .route('/')
  .get(plansController.getAllPlans)
  .post(plansController.createPlan);
router
  .route('/:id')
  .get(plansController.getPlan)
  .patch(plansController.updatePlan)
  .delete(plansController.deletePlan);




module.exports = router;


