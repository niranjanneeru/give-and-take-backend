import { Status } from "../utils/status.enum";

class StatusRepository {
    getAllStatus() {
        return Object.keys(Status);
    }
}

export default StatusRepository;