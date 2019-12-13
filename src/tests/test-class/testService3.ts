import AbstractService from '../../Interfaces/AbstractService';

export default class TestService3 extends AbstractService {
    private arg1: string;

    private arg2: number;

    private arg3: any;

    constructor(arg1: string, arg2: number, arg3: any) {
        super();
        this.arg1 = arg1;
        this.arg2 = arg2;
        this.arg3 = arg3;
    }

    public getArg1(): string {
        return this.arg1;
    }

    public getArg2(): number {
        return this.arg2;
    }

    public getArg3(): any {
        return this.arg3;
    }
}
