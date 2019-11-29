class Service {
    constructor() {
        this.setContainer = this.setContainer.bind(this);
    }

    setContainer(container) {
        this.container = container;
    }
}

class MessageFormaterService extends Service {
    constructor({ messageSeparator = '-' }) {
        this.messageSeparator = messageSeparator;

        this.format = this.format.bind(this);
    }

    format(messages) {
        return messages.join(this.messageSeparator);
    }
}

class TestClass extends Service {
    constructor({ messageService, data }) {
        super();
        this.messageService = messageService;
        this.data = data;

        // binding
        this.testFunction = this.testFunction.bind(this);
    }

    testFunction(value) {
        console.log(this.messageService.format(['testService', value, this.data, '456']));
    }
}

class Container {
    constructor() {
        this.services = {};
        this.properties = {};

        this.registerService = this.registerService.bind(this);
        this.getService = this.getService.bind(this);
        this.processArguments = this.processArguments.bind(this);
        this.registerProperties = this.registerProperties.bind(this);
        this.getProperty = this.getProperty.bind(this);
    }

    processArguments(args) {
        const serviceRegex = /^@(.*)$/;
        const propertiesRegex = /^%(.*)%$/;
        const extractMatchGroup = (match, g1, offset, string) => {
            console.log(match);
            return g1 || undefined;
        };
        Object.keys(args).map(key => {
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

    registerService(serviceName, config) {
        // check service serviceName
        // check config

        config.args = this.processArguments(config.args);
        this.services[serviceName] = new config.class(...config.args);
        this.services[serviceName].setContainer(this);
        return this;
    }

    getService(serviceName) {
        return this.services[serviceName];
    }

    registerProperties(properties) {
        this.properties = { ...this.properties, ...properties };
        return this;
    }

    getProperty(propertyName) {
        return this.properties[propertyName];
    }
}

const ctx = {};

ctx.container = new Container();

ctx.container.registerProperties({
    'test-prop': 'bonjour',
    separator: '=',
});

ctx.container.registerService('message-service', {
    class: MessageFormaterService,
    args: {
        messageSeparator: '%separator%',
    },
});

ctx.container.registerService('test-service', {
    class: TestClass,
    args: {
        messageService: '@message-service',
        data: '%test-prop%',
    },
});

ctx.container.getService('test-service').testFunction('123');
