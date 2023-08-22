import { Repository } from "typeorm";
import RedeemRequest from "../entity/redeem.entity";

class RedeemRepository{

    constructor(
        private repository: Repository<RedeemRequest>
    ){}

    
}

export default RedeemRepository;