import { Router } from "express";
import {
  GetCountry,
  GetStateByCountry,
} from "../controllers/CountryAndStateController";

const router = Router();

router.get("/country", GetCountry);

router.get(`/getStateByCountry/:countryCode`, GetStateByCountry);

export default router;
