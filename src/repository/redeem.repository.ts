import { Repository } from "typeorm";
import RedeemRequest from "../entity/redeem.entity";
import { when } from "jest-when";

class RedeemRepository {

    constructor(
        private repository: Repository<RedeemRequest>
    ) { }

    findAll(): Promise<RedeemRequest[]> {
        return this.repository.find({
            relations: {
                employee: true,
                approvedBy: true
            }
        });
    }

    findRequestById(id) {
        return this.repository.findOne({
            where: {
                id
            },
            relations: {
                employee: true,
                approvedBy: true
            }
        })
    }

    createRequests(request: RedeemRequest): Promise<RedeemRequest> {
        return this.repository.save(request);
    }


}

export default RedeemRepository;