import ServiceConfig from './Interfaces/ServiceConfig';
import ServiceInterface from './Interfaces/ServiceInterface';

// TODO ID evol mixed type props
// export type MixedType = string | number | Array<MixedType> | Map<string, MixedType>;

export default class Container {
    private services: Record<string, ServiceInterface>;

    // TODO value to mixed type
    private properties: Record<string, string>;

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

    public getProperty(name: string): string {
        if (!this.properties[name]) {
            throw new Error(`Contianer's [${name}] property is not defined`);
        }
        return this.properties[name];
    }

    // TODO value mixed type
    public registerProperty(name: string, value: string): this {
        if (this.properties[name]) {
            console.warn(`Dumplicated property. Prop [${name}] will be override`);
        }

        this.properties[name] = value;
        return this;
    }

    public registerProperties(properties) {
        this.properties = { ...this.properties, ...properties };
        return this;
    }

    // public registerService(serviceName: string, config: ServiceConfig): Container {
    //     // TODO check service serviceName
    //     // TODO check config

    //     const processedArgs = this.processArguments(config.args);
    //     this.services[serviceName] = new config.class(...config.args);
    //     this.services[serviceName].setContainer(this);
    //     return this;
    // }

    // private processArguments(args: ServiceConfig): ServiceConfig {
    //     const serviceRegex = /^@(.*)$/;
    //     const propertiesRegex = /^%(.*)%$/;
    //     const extractMatchGroup = (_m: string, g1: string): string | undefined => g1 || undefined;
    //     Object.keys(args).map((key: string): string => {
    //         const value = args[key];

    //         if (value.match(serviceRegex)) {
    //             const res = value.replace(serviceRegex, '');
    //             if (res) return (args[key] = this.services[res]);
    //         }

    //         if (value.match(propertiesRegex)) {
    //             const res = value.replace(propertiesRegex, extractMatchGroup);
    //             if (res) return (args[key] = this.properties[res]);
    //         }
    //     });
    //     return args;
    // }
}
