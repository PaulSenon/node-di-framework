import IService from './IService';

export default interface IServiceConstructor {
    new(...args: any): IService;
}
