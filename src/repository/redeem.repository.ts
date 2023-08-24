import { Repository } from "typeorm";
import RedeemRequest from "../entity/redeem.entity";
import { when } from "jest-when";

class RedeemRepository {
    constructor(private repository: Repository<RedeemRequest>) { }

    createRequest(redeemRequest: RedeemRequest): Promise<RedeemRequest> {
        return this.repository.save(redeemRequest);
    }

    findAll(): Promise<RedeemRequest[]> {
        return this.repository.find({
            relations: {
                employee: true,
                approvedBy: true,
            },
            where: {
                isApproved: false
            }
        });
    }

    findAllWithHistory(): Promise<RedeemRequest[]> {
        return this.repository.find({
            relations: {
                employee: true,
                approvedBy: true,
            },
            withDeleted: true,
        });
    }

    findRequestByEmployeeWithId(id) {
        return this.repository.findOne({
            relations: {
                employee: true,
            },
            where: {
                employee: {
                    id: id,
                },
            },
        });
    }

    findRequestById(id) {
        return this.repository.findOne({
            where: {
                id,
            },
            relations: {
                employee: true,
                approvedBy: true,
            },
        });
    }

    patchRequest(redeeemRequest: RedeemRequest): Promise<RedeemRequest> {
        return this.repository.save(redeeemRequest);
    }

    removeRequest(
        redeeemRequest: RedeemRequest
    ): RedeemRequest | PromiseLike<RedeemRequest> {
        return this.repository.softRemove(redeeemRequest);
    }
}

export default RedeemRepository;
