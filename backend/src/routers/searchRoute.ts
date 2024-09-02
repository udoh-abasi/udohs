import { Router } from "express";
import Search from "../controllers/searchController";

const router = Router();

router.get("/search", Search);

export default router;
