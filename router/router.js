import express from "express";
import  {testApi} from  "../controllers/testingControllers.js"
import  {callAssistant}  from "../controllers/openAIThreadController.js"
import {addSubject, fetchSubjects} from "../controllers/subjectController.js"

const router = express.Router();

router.get('/testing', testApi);
router.get('/callAssistant', callAssistant);

// subjects
router.post('/addSubjects', addSubject);
router.get('/fetchSubjects', fetchSubjects);


export default router;