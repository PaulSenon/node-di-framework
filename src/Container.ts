import IServiceConstructor from './Interfaces/IServiceConstructor';
import IService from './Interfaces/IService';
import { TServiceArgs } from './Types/CustomTypes';

// import ServiceConfig from './Interfaces/ServiceConfig';
// import ServiceInterface from './Interfaces/ServiceInterface';

// import { ServiceInterface, ServiceInterfaceConstructor } from './Interfaces/AbstractService';

// TODO ID evol mixed type props
// export type MixedType = string | number | Array<MixedType> | Map<string, MixedType>;

// type mixed = string | number | undefined;

// type ServiceArgsType = Record<string, any | ServiceInterface>;

interface ServiceConfig {
    clazz: IServiceConstructor;
    instance?: IService;
    args: TServiceArgs;
    lazy: boolean;
}

// function create<T>(Constructor: { new (...args: any[]): T }, args: Record<string, any>): T {
//     const instance = new Constructor();
//     Object.assign(instance, args);
//     console.log(instance);
//     return instance;
// }

export default class Container {
    private services: Record<string, ServiceConfig>;

    // TODO value to mixed type
    private properties: Record<string, any>;

    constructor() {
        this.services = {};
        this.properties = {};
    }

    public getServices(): Record<string, ServiceConfig> {
        return this.services;
    }

    public getProperties(): Record<string, any> {
        return this.properties;
    }

    public getProperty(name: string): any {
        if (!this.properties[name]) {
            throw new Error(`Contianer's [${name}] property is not defined`);
        }
        return this.properties[name];
    }

    public getService(name: string): IService | undefined {
        if (!this.services[name]) {
            throw new Error(`Contianer's [${name}] service is not defined`);
        }
        if (!this.services[name].instance) {
            if (this.services[name].lazy) {
                this.instanciateService(name);
            } else {
                throw new Error(`Contianer's [${name}] service is not yet instanciated`);
            }
        }
        return this.services[name].instance;
    }

    // TODO value mixed type
    public registerProperty(name: string, value: any): this {
        if (this.properties[name]) {
            console.warn(`Dumplicated property. Prop [${name}] will be override`);
        }
        this.properties[name] = value;
        return this;
    }

    public registerProperties(properties: Record<string, any>): this {
        this.properties = { ...this.properties, ...properties };
        return this;
    }

    public instanciateService(serviceName: string): this {
        if (!this.services[serviceName]) {
            throw new Error(`Contianer's [${serviceName}] service is not registered`);
        }
        const service = this.services[serviceName];
        if (service.instance) {
            throw new Error(`Contianer's [${serviceName}] service is already instanciated`);
        }

        const processedArgs = this.processArguments(service.args);

        // type Constructor = typeof config.Class;
        // const Constructor = service.clazz;
        // const args = Object.values(processedArgs);
        // const instance = new Constructor(...args);
        const instance = Object.create(service.clazz.prototype); // .prototype
        Object.assign(instance, processedArgs);

        instance.setContainer(this);
        this.services[serviceName].instance = instance;
        return this;
    }

    public registerService(serviceName: string, config: ServiceConfig): this {
        this.services[serviceName] = config;

        if (!config.lazy) {
            this.instanciateService(serviceName);
        }

        return this;
    }

    // TODO promisify
    private processArguments(args: TServiceArgs): TServiceArgs {
        // return new Promise((resolve, reject) => {
        const serviceRegex = /^@(.*)$/;
        const propertiesRegex = /^%(.*)%$/;
        const extractMatchGroup = (_m: string, g1: string): string => g1;

        const processArguments = args;

        (Object.keys(args) as string[]).map((key: string) => {
            const value = args[key];
            if (typeof value === 'string') {
                if (value.match(serviceRegex)) {
                    const res = value.replace(serviceRegex, extractMatchGroup);
                    if (res) {
                        if (!this.services[res].instance) {
                            this.instanciateService(res);
                        }
                        processArguments[key] = this.services[res].instance;
                        return true;
                    }
                }

                if (value.match(propertiesRegex)) {
                    const res = value.replace(propertiesRegex, extractMatchGroup);
                    if (res && this.properties[res]) {
                        processArguments[key] = this.properties[res];
                        return true;
                    }
                    throw new Error(
                        `Contianer's [${res}] property is required by a non lazy service but has bot yet been initialized. Please register your props before your services in general. But you can also try to make your service lazy.`,
                    );
                }
            }
            return false;
        });
        return processArguments;
        // });
    }
}
