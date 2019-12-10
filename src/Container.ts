// import ServiceConfig from './Interfaces/ServiceConfig';
// import ServiceInterface from './Interfaces/ServiceInterface';
import AbstractService, { ServiceInterface } from './Interfaces/AbstractService';

// TODO ID evol mixed type props
// export type MixedType = string | number | Array<MixedType> | Map<string, MixedType>;

type mixed = string | number | undefined;

type ServiceArgsType = Record<string, mixed | ServiceInterface>;

interface ServiceConfig {
    // new (): ServiceInterface<T>;
    clazz: ServiceInterface;
    instance?: ServiceInterface;
    args: ServiceArgsType;
    lazy: boolean;
}

function create<T>(Constructor: { new (...args: any[]): T }, args: Record<string, any>): T {
    const instance = new Constructor();
    Object.assign(instance, args);
    console.log(instance);
    return instance;
}

export default class Container {
    private services: Record<string, ServiceConfig>;

    // TODO value to mixed type
    private properties: Record<string, mixed>;

    constructor() {
        this.services = {};
        this.properties = {};
    }

    public getServices(): {} {
        return this.services;
    }

    public getProperties(): {} {
        return this.properties;
    }

    public getProperty(name: string): mixed {
        if (!this.properties[name]) {
            throw new Error(`Contianer's [${name}] property is not defined`);
        }
        return this.properties[name];
    }

    public getService(name: string): ServiceInterface | undefined {
        if (!this.services[name]) {
            throw new Error(`Contianer's [${name}] service is not defined`);
        }
        if (!this.services[name].instance) {
            throw new Error(`Contianer's [${name}] service is not yet instanciated`);
        }
        return this.services[name].instance;
    }

    // TODO value mixed type
    public registerProperty(name: string, value: string): this {
        if (this.properties[name]) {
            console.warn(`Dumplicated property. Prop [${name}] will be override`);
        }

        this.properties[name] = value;
        return this;
    }

    public registerProperties(properties: Record<string, string>): this {
        this.properties = { ...this.properties, ...properties };
        return this;
    }

    public registerService(serviceName: string, config: ServiceConfig): this {
        // TODO check service serviceName
        // TODO check config
        const processedArgs = this.processArguments(config.args);

        // type Constructor = typeof config.Class;
        const instance = Object.create(config.clazz); // .prototype
        Object.assign(instance, processedArgs);

        instance.setContainer(this);
        this.services[serviceName] = config;
        this.services[serviceName].instance = instance;
        return this;

        // // type Constructor<T> = new (...args: any[]) => T;
        // function makeInstance<T>(constructor: new (...args: any[]) => T): T {
        //     return new constructor();
        // }

        // // type Constructor = typeof config.Class;

        // // const test = new Constructor<config.class>(config.args);
        // Object.create(config.Class, ...config.args);
        // this.services[serviceName] = create<Constructor>(config.Class, config.args);
        // // this.services[serviceName] = makeInstance<[config.class]>(...processedArgs);
        // this.services[serviceName].setContainer(this);
        // return this;
    }

    // TODO promisify
    private processArguments(args: ServiceArgsType): ServiceArgsType {
        const serviceRegex = /^@(.*)$/;
        const propertiesRegex = /^%(.*)%$/;
        const extractMatchGroup = (_m: string, g1: string): string => g1;

        const processArguments = args;

        (Object.keys(args) as string[]).map((key: string) => {
            const value = args[key];
            if (typeof value === 'string') {
                if (value.match(serviceRegex)) {
                    const res = value.replace(serviceRegex, extractMatchGroup);
                    if (res && this.services[res].instance) {
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
                }
            }
            return false;
        });
        return processArguments;
    }
}
