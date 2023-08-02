
# Quick start

For a quick project building, there is an installation script that initiate a pre-configured project structure: [here](https://bitbucket.org/euronews-sdd/ennodifw-installer/src/master/)  

Otherwise you can just install manually this repository as a node dependency and configure everything.

# Services Doc

* Loggers:

    * ✅ [AbstractLogger](/doc/services/loggers/AbstractLoggerService.doc.md)
    * ✅ [ConsoleLogger](/doc/services/loggers/ConsoleLoggerService.doc.md)
    * ✅ [HistoryLogger](/doc/services/loggers/HistoryLoggerService.doc.md)
    
* Providers:

    * ✅ [StaticKernelProvider](/doc/services/providers/StaticKernelProvider.doc.md)
    * ✅ [StaticLoggerProvider](/doc/services/providers/StaticLoggerProvider.doc.md)

* Services:

    * ✅ [Cache](/doc/services/CacheService.doc.md)
    * ✅ [DaletApiProxy](/doc/services/DaletApiProxyService.doc.md)
    * ✅ [DevConsole](/doc/services/DevConsoleService.doc.md)
    * ✅ [History](/doc/services/HistoryService.doc.md)
    * ✅ [KeyValue](/doc/services/KeyValueService.doc.md)
    * ✅ [Logger](/doc/services/LoggerService.doc.md)
    * ✅ [RestApi](/doc/services/RestApiService.doc.md)

# Available

This module gives you access to 

* `const { Kernel } = require('ennodifw');`

    > **Kernel** is the main class that allow to instantiate an App

* `const { Service } = require('ennodifw');`

    > **Service** is the *abstract* class to extend when you want to implement services that can be used by the Kernel to instantiate your App

* `const { KernelProvider } = require('ennodifw');`

    > **KernelProvider** is the a **static** class that can be required from anywhere to have access to the current Kernel instance (`const Kernel = KernelProvider.get();`)

    > Doc [here](TODO)

* `const { StaticLogger } = require('ennodifw');`

    > **StaticLogger** is the a **static** class that can be required from anywhere to log anything without having ref to `Logger` service instance (`StaticLogger.warn('source', 'warning message', { foo: 'bar' })`)

    > Doc [here](TODO)

* `const { CacheService, HistoryService, KeyValueService, DaletApiProxyService, LoggerService, RestApiService, ConsoleLoggerService, HistoryLoggerService, AbstractLoggerService } = require('ennodifw').services;`

    > the common services method you can use directly or that you can extend in your App

    > Doc available via the links in previous section

# References

Here is the documentation on `Kernel`, and `Service`, the main core class.

* See `Kernel` documentation if you need to build your app based on ennodifw

* See `Service` documentation if you need to create custom services

## Kernel

* **`new Kernel({ cacheFolder, tempFolder, servicesFolders, stopOnInitFailure=true, config })`**: 
    
    * `cacheFolder`: *String* (_**Required**_)

        > Must be an **absolute path** to your App cache folder

    * `tempFolder`: *String* (_Optional_)

        > Must be an **absolute path** to your App temp folder. Falls back on OS temp folder.

    * `servicesFolders`: *Array[String]* (_Optional_)

        > Contains the list of folders containing Services class files of your project

        > **Note**: You do not need to add path to this module common service classes

    * `stopOnInitFailure`: *Boolean* (_default = `true`_)

        > set to false if you want the app to boot anyway even if a service initialization fails.

    * `config`: *Object* (_**Required**_)

        > Contains App configuration object (see Configuration part for more infos)

    #### Example:

```JavaScript
        const path = require('path');
        const { Kernel } = require('ennodifw');

        // instantiate App
        const App = new Kernel({
            cacheFolder: path.join(__dirname, './.cache'),
            tempFolder: undefined,
            servicesFolders: [
                path.join(__dirname, './src/services'),
                path.join(__dirname, './src/services/providers'),
            ],
            config: {
                properties: {}, // App properties
                services: {},   // App services instances config
            },
        });

        // start App
        App.init()  // is promise returning App ref
```

* **`async init()`**: Kernel instance
    
    > To start the Kernel instance (will use configuration to load service instances)

* **`async terminate(forceExit = false)`**: 
    
    > To gracefully terminate the App (try to gracefully stop (join())) each service instance and timeout after 5 seconds for each service)

    * `forceExit`: *Boolean* (_Optional_)

        > To force `process.exit(0)` at the end (you should not need it if you properly terminated every service)

* **`getService(serviceName, Class)`**: *Service instance*
    
    * `serviceName`: *String* (_**Required**_)

        > The registered name of the service instance to retrieve from App servicesBag

    * `Class`: *Class* (_Optional_)

        > Use it if you want to type-check the returned service instance

* **`getProperty(propertyPath)`**: *Mixed*

    > alias: **`getProp(propertyPath)`**
    
    * `propertyPath`: *String* (_**Required**_)

        > The string path to retrieve a property from the App propertiesBag.  
        String format = `'path.to.the.prop'` with '`.`'  
        So you must avoid using '`.`' in your properties keys.

* **`getCacheDir(dirName)`**: *String* (absolute folder path)
    
    > This method is used to retrieve a folder path in an App managed cache folder. You don't have to be concerned about accessing this resources, as soon as a cache folder is configured for your App, it will never fail, and create requested subFolders if don't exist.  

    > **Note**: Clear and delete cache folder with `clearCache()` method.

    > **Note**: Cache folders may persist between App executions, but you must not rely on it and handle cases where your resources are missing.

    * `dirName`: *String* (_Optional_)

        > The subFolder name to get(/create) 

        > If not defined, will return the App cache base folder

* **`getTempDir(dirName)`**: *String* (absolute folder path)
    
    > This method is used to retrieve a folder path in an App managed temp folder. You don't have to be concerned about accessing this resources, it will never fail, and create requested subFolders if don't exist.  

    > **Note**: Clear and delete cache folder with `clearTemp()` method.

    > **Note**: Temp folders do NOT persist between App executions.

    * `dirName`: *String* (_Optional_)

        > The subFolder name to get(/create) 

        > If not defined, will return the App temp base folder

* **`clearCache()`**: 
    
    > This method is used to clear the App cache folder content and delete the folder itself. 

    > **Note**: The App doesn't have to be initialized (`init()`) in order to work. 

* **`clearTemp()`**: 
    
    > This method is used to clear the App temp folder content and delete the folder itself. 

    > **Note**: The App doesn't have to be initialized (`init()`) in order to work.

    > **Note**: In case you didn't mentioned any tempFolder in the Kernel config, the App will create a temp folder with a unique name in the OS temp folder. The generated folder name is not persisting between App execution so in this specific case you cannot delete a past temp folder by re-instantiating the App and running this method. You must do that within the same execution, or delete it manually (but the OS should do that for you I guess) .

* **`getState()`**: Object
    
    > This method is used to get a Kernel instance state object

    #### Example:

```JavaScript
    {
        env: 'dev',
        services: {
            areLoaded: true,
            areLinked: true,
            areInitialized: true,
        },

        // the linking/initializing state by service instance:
        servicesHealth: {}, 

        // the Kernel config
        config: {}
    }
```

----

## KernelProvider

**Static** class that allow you to get the current Kernel instance reference from anywhere.

* **`get()`**: Kernel instance
    
    > This method is used to get the current Kernel instance

    > **Note**: The App must have been initialized (`init()`) in order to work.  
    But usually you'll use it in non Service classes that are used by your services instances. If services are instantiated it means Kernel is up, so don't worry.

----

## Service (abstract)

***Abstract*** class that allow you to define services that can be used through the App.

* **`new YourService(params)`**: 

    * `params`: *Object* (_Optional_)

        > Contains `params` from service configuration 

        > **/!\ Note /!\\**: This parameter cannot be used for **static** services. See `_init()` for more infos.
    
* **`async _linkDependencies(dependencies)`**: 

    > **Abstract Template Method** used to set dependencies references. 

    > You never call this method but you have to implement it when you extend the Service class

    * `dependencies`: *Object* (_Optional_)

        > containing multiple `dependencyName: serviceInstance`

        > **Note**: You have to typeCheck the given instance yourself.

* **`async _preInit(params)`**: 

    > **Optional Template Method** used to write your own service pre-initialization. You'll put here all the code that need to be async. but need to be executed before linking dependencies

    > It is executed before dependencies are linked so you can't use them here. See _init() instead . 

    > You never call this method but you can implement it when you extend the Service class

    * `params`: *Object* (_Optional_)

        > Contains `params` from service configuration 

        > **/!\ Note /!\\**: This parameter is only defined for **static** service. Otherwise it is given to the constructor directly

* **`async _init(params)`**: 

    > **Abstract Template Method** used to write your own service initialization. You'll put here all the code that need to be async.

    > It is executed after dependencies are linked so you can safely use dependencies instances here . 

    > You never call this method but you have to implement it when you extend the Service class

    * `params`: *Object* (_Optional_)

        > Contains `params` from service configuration 

        > **/!\ Note /!\\**: This parameter is only defined for **static** service. Otherwise it is given to the constructor directly

* **`getName()`**: String

    > Used to get service name ase defined in kernel configuration

* **`isStatic()`**: Boolean

    > Used to know if a service is static

* **`this.Kernel`**: Kernel instance

    > private property to get the Kernel ref

* **`_getState()`**: Object
    
    > **Abstract Template Method** used send custom state infos in your service implementation

    > You never call this method, you implement it. If you want to retrieve state use `getState()` instead.

* **`getState()`**: Object
    
    > This method is used to get a Service instance state object.

* **`async _join()`**: Void
    
    > **Optional Template Method** used terminate your service cleanly (close any connection, timeout, intervals...)

    > You never call this method, you implement it. If you want terminate a service manually, please use `join()`.

* **`async join()`**: void
    
    > This method is used to cleanly terminate a service instance. Requires `_join()` to be defined

    #### Example:

```JavaScript
    {
        type: 'Service', // because it it a service instance
        className: 'YourServiceClass', // the name of you service implementation
        service: {
            name: 'my-service-instance',
            status:{
                initialized: true,
                linked: true,
            },
        },
        state: {}, // object returned by your _getState() implementation
    }
```
----

# Kernel Configuration

The Kernel configuration is a Json object containing the two required sub objects :

* `properties`: containing all the key-values and nested objects you want. No restrictions

* `services`: containing the services instance configuration the Kernel use to boot. It must respect the following standards for each sub entry:

    * Each first level key must be your service instance name. It must be a unique string.

    * **`class`**: containing either your **service class file name** or directly the **Class** you want to instantiate

    * **`params`**: the object given to your service class constructor (or _init() method in case of static service)

        > you can pass simple `key:values`

        > you can pass special preprocessed values `key: App => {}` that let you use the App instance and it is executed automatically when configuration is parsed by the Kernel. So you have access to **properties** but **services** will not yet be defined.

    * **`dependencies`**: the object containing your service dependencies to inject. keys are free, values must be the name of an other service from your config.
    
    * **`static`**: boolean (false by default) that let you define a service as static. It is used when you want to create a service accessible directly from a require() of its class. You must export an instance instead of the Class when you do that.

### Example :

```JavaScript
module.exports = {
    properties: {
        common: {
            foo2: 'bar2',
        },
    },
    services: {
        'example-service': {
            class: 'MyServiceClass',
            params: {
                foo: 'bar',
                foo2: App => App.getProp('common.foo2'),
            },
        },
        'example-static': {
            static: true,
            class: 'MyStaticServiceClass',
            params: {
                foo3: 'bar3',
            },
            dependencies: {
                exampleService: 'example-service',
            },
        },
    },
}
```
