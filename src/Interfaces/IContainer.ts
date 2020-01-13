import { TServiceArgs } from '../Types/CustomTypes';
import ServiceConfig from './ServiceConfig';
import IService from './IService';

export default interface IContainer {
    getServices(): Record<string, ServiceConfig>;
    getProperties(): Record<string, any>;
    getProperty(name: string): any;
    getService(name: string): IService | undefined;
    registerProperty(name: string, value: any): this;
    registerProperties(properties: Record<string, any>): this;
    instanciateService(serviceName: string): this;
    registerService(serviceName: string, config: ServiceConfig): this;
    processArguments(args: TServiceArgs): TServiceArgs;
}
