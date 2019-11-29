import ServiceConfig from './Interfaces/ServiceConfig';
import ServiceInterface from './Interfaces/ServiceInterface';

export default class Container {
    private services: Record<string, ServiceInterface>;

    private properties: Record<string, string | number>;

    constructor() {
        this.services = {};
        this.properties = {};
    }

    public registerService(serviceName: string, config: ServiceConfig): Container {
        // TODO check service serviceName
        // TODO check config

        const processedArgs = this.processArguments(config.args);
        this.services[serviceName] = new config.class(...config.args);
        this.services[serviceName].setContainer(this);
        return this;
    }

    private processArguments(args: ServiceConfig): ServiceConfig {
        const serviceRegex = /^@(.*)$/;
        const propertiesRegex = /^%(.*)%$/;
        const extractMatchGroup = (_m: string, g1: string): string | undefined => g1 || undefined;
        Object.keys(args).map((key: string): string => {
            const value = args[key];

            if (value.match(serviceRegex)) {
                const res = value.replace(serviceRegex, '');
                if (res) return (args[key] = this.services[res]);
            }

            if (value.match(propertiesRegex)) {
                const res = value.replace(propertiesRegex, extractMatchGroup);
                if (res) return (args[key] = this.properties[res]);
            }
        });
        return args;
    }
}
