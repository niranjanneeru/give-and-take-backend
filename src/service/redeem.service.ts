import CreateRequestDto from "../dto/create.request.dto";
import RedeemRequest from "../entity/redeem.entity";
import HttpException from "../exception/http.exception";
import EmployeeService from "./employee.service";
import RedeemRepository from "../repository/redeem.repository";
import { StatusCodes } from "../utils/status.code.enum";
import PatchRedeemRequestDto from "../dto/patch-request.dto";

class RedeemService {
    constructor(
        private redeemRepository: RedeemRepository,
        private employeeService: EmployeeService
    ) {}

    async createRequest(redeemRequestDto: CreateRequestDto, userId: string) {
        const existingRequest: RedeemRequest =
            await this.redeemRepository.findRequestByEmployeeWithId(userId);
        if (existingRequest) {
            throw new HttpException(
                StatusCodes.FORBIDDEN,
                `Cannot initiate a redeem request when a pending request already exist`
            );
        }
        const redeemRequest = new RedeemRequest();
        redeemRequest.bounty = redeemRequestDto.bounty;
        redeemRequest.employee = await this.employeeService.getEmployeeByID(
            userId
        );
        return this.redeemRepository.createRequest(redeemRequest);
    }

    getAllRequests() {
        return this.redeemRepository.findAll();
    }

    async getRequestById(requestId: string) {
        const request = await this.redeemRepository.findRequestById(requestId);
        if (!request) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Request with id ${requestId} not found`
            );
        }
        return request;
    }

    patchRequest = async (
        id: string,
        patchRedeemRequestDto: PatchRedeemRequestDto,
        employeeId: string
    ): Promise<RedeemRequest | null> => {
        const redeeemRequest: RedeemRequest =
            await this.redeemRepository.findRequestById(id);
        if (!redeeemRequest)
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Redeem Request with id ${id} not found`
            );

        const keys = Object.getOwnPropertyNames(patchRedeemRequestDto);
        redeeemRequest.employee.redeemed_bounty += redeeemRequest.bounty;

        for (const key of keys) {
            // if (key === "approvedBy") redeeemRequest.approvedBy = employee;
            redeeemRequest[key] = patchRedeemRequestDto[key];
        }

        return this.redeemRepository.patchRequest(redeeemRequest);
    };

    async removeRequest(id: string) {
        const redeeemRequest = await this.redeemRepository.findRequestById(id);
        if (!redeeemRequest) {
            throw new HttpException(
                StatusCodes.NOT_FOUND,
                `Redeeem request with id ${id} not found`
            );
        }
        return this.redeemRepository.removeRequest(redeeemRequest);
    }
}

export default RedeemService;
