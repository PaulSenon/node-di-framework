import AbstractService from '../../Interfaces/AbstractService';

export default class TestService1 extends AbstractService {
    private arg1: string;

    constructor(arg1: string) {
        super();
        this.arg1 = arg1;
    }

    public getArg1(): string {
        return this.arg1;
    }
}
