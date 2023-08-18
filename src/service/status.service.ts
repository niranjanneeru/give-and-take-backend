import StatusRepository from "../repository/status.repository";


class StatusService {

    constructor(
        private repository: StatusRepository
    ) { }
    getStatus() {
        return this.repository.getAllStatus();
    }
}

export default StatusService;