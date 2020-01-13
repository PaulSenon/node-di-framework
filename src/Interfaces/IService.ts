import IContainer from './IContainer';

export default interface IService {
    setContainer(container: IContainer): this;
    getContainer(): IContainer | undefined;
}
