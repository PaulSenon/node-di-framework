import ServiceInterface from './ServiceInterface';

export default interface ServiceConfig {
    class: ServiceInterface;
    args: Record<string, string>;
}
