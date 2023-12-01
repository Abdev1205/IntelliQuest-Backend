import express from "express";
import  {testApi} from  "../controllers/testingControllers.js"
import  {callAssistant}  from "../controllers/openAIThreadController.js"

const router = express.Router();

// Route for testing the API
router.get('/testing', testApi);
router.get('/callAssistant', callAssistant);

export default router;