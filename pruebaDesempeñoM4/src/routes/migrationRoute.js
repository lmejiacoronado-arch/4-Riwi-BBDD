import runMigration from "../controller/migrationController.js";
import {Router} from "express";

const router = Router();

router.post('/run-migration',runMigration);

export default router;
