import IService from './IService';

export default interface IServiceConfig {
    class: IService;
    args: Record<string, string>;
}
