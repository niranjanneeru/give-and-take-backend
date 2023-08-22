import RedeemController from "../controller/redeem.controller";
import dataSource from "../db/postgres.db";
import RedeemRequest from "../entity/redeem.entity";
import RedeemRepository from "../repository/redeem.repository";
import RedeemService from "../service/redeem.service";

const redeemRepository = new RedeemRepository(dataSource.getRepository(RedeemRequest));
const redeemService = new RedeemService(redeemRepository);
const redeemController = new RedeemController(redeemService);
const redeemRoute = redeemController.router;

export default redeemRoute;