import Container from '../Container';

export default abstract class AbstractService implements ServiceInterface {
    protected container: Container;
    // private prototype: any[];

    // new(...args: any[]): T {
    //     this.container = new Container();
    //     return new T(...args);
    // }

    constructor() {
        this.container = new Container();
    }

    public setContainer(container: Container): this {
        this.container = container;
        return this;
    }

    public getContainer(): Container {
        return this.container;
    }
}

export interface ServiceInterface {
    // new (...args: any[]): T;
    setContainer(container: Container): this;
    getContainer(): Container;
}
