import AbstractService from '../../Abstracts/AbstractService';
import TestService1 from './testService1';

export default class TestService2 extends AbstractService {
    private arg2: string;

    private arg3: TestService1;

    constructor(arg2: string, arg3: TestService1) {
        super();
        this.arg2 = arg2;
        this.arg3 = arg3;
    }

    public getArg2(): string {
        return this.arg2;
    }

    public getArg3(): TestService1 {
        return this.arg3;
    }
}
