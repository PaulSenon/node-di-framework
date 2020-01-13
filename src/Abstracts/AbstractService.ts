import IContainer from '../Interfaces/IContainer';
import IService from '../Interfaces/IService';

export default abstract class AbstractService implements IService {
    protected container: IContainer | undefined;

    public setContainer(container: IContainer): this {
        this.container = container;
        return this;
    }

    public getContainer(): IContainer | undefined {
        return this.container;
    }
}
