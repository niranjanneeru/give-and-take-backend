export default class ResponseBody {
    public meta: object
    constructor(
        public data: object,
        public errors: object,
        public message: string,
    ) { }

    set_meta(records: number, total: number = 0, ...args){
        if(total === 0){
            total = records;
        }
        this.meta = {
            'length' : records,
            'took' : this.get_ns_time(),
            'total' : total,
        }
        args.forEach( arg => {
            const key = Object.keys(arg)[0];
            this.meta[key] = arg[key];
        })
    }

    get_ns_time(){
        return Math.round(performance.measure('start to end', 'start').duration);
    }

}