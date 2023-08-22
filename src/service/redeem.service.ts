import CreateRequestDto from "../dto/create.request.dto";
import RedeemRequest from "../entity/redeem.entity";
import HttpException from "../exception/http.exception";
import RedeemRepository from "../repository/redeem.repository";
import { StatusCodes } from "../utils/status.code.enum";

class RedeemService {
    constructor(
        private redeemRepository: RedeemRepository
    ) { }

    getAllRequests() {
        return this.redeemRepository.findAll();
    }

    async getRequestById(requestId: string) {
        const request = await this.redeemRepository.findRequestById(requestId);
        if (!request) {
            throw new HttpException(StatusCodes.NOT_FOUND, `Request with id ${requestId} not found`);
        }
        return request;
    }

    createRequests(requestDto:CreateRequestDto) : Promise<RedeemRequest>{
        const request = new RedeemRequest();
        request.bounty = requestDto.bounty;
        
        return this.redeemRepository.createRequests(request);
    }

}


export default RedeemService;