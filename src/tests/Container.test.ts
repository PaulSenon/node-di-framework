import AbstractService from '../Interfaces/AbstractService';
import Container from '../Container';
import TestService1 from './test-class/testService1';
import TestService2 from './test-class/testService2';
import TestService3 from './test-class/testService3';

describe('Dependency Injection Container Tests', () => {
    describe('Properties tests', () => {
        it('Should register a single property', () => {
            const container = new Container();
            const testProp = { name: 'prop-type-string', value: 'test' };

            container.registerProperty(testProp.name, testProp.value);
            expect(container.getProperties()).toEqual({
                [testProp.name]: testProp.value,
            });
        });

        it('Should register multiple properties with multiple calls', () => {
            const container = new Container();
            const testProps = [
                { name: 'prop-type-string', value: 'test' },
                { name: 'prop-type-string2', value: ['test1', 'test2'] },
            ];

            testProps.forEach(prop => {
                container.registerProperty(prop.name, prop.value);
                expect(container.getProperties()).toEqual(
                    expect.objectContaining({
                        [prop.name]: prop.value,
                    }),
                );
            });

            expect(Object.keys(container.getProperties()).length).toBe(testProps.length);
        });

        it('Should register multiple properties within one calls', () => {
            const container = new Container();
            const testProps = {
                prop_type_string: 'test',
                prop_type_string2: ['test1', 'test2'],
                prop_type_string3: {
                    test: 'test',
                },
            };

            container.registerProperties(testProps);
            expect(container.getProperties()).toEqual(testProps);
        });

        it('Should override altready registered property', () => {
            const container = new Container();
            const testProps = [
                { name: 'prop-type-string', value: 'test' },
                { name: 'prop-type-string', value: 'test-overide' },
            ];

            // TOD might change
            const spy = jest.spyOn(console, 'warn').mockImplementation();

            testProps.forEach(prop => {
                container.registerProperty(prop.name, prop.value);
                expect(container.getProperties()).toEqual(
                    expect.objectContaining({
                        [prop.name]: prop.value,
                    }),
                );
            });

            expect(Object.keys(container.getProperties()).length).toBe(1);
            expect(spy.mock.calls).toEqual([[expect.stringContaining('')]]);
        });

        it('Should register multiple different properties without collision', () => {
            const container = new Container();

            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            const additionalTestProps = {
                prop3: 'value3',
                prop4: 'value4',
            };
            container.registerProperties(additionalTestProps);

            expect(container.getProperties()).toEqual({ ...testProps, ...additionalTestProps });
            expect(Object.keys(container.getProperties()).length).toBe(4);
        });

        it('Should register multiple duplicated properties with override', () => {
            const container = new Container();

            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
                prop3: 'value3',
            };
            container.registerProperties(testProps);

            expect(container.getProperties()).toEqual(testProps);

            const additionalTestProps = {
                prop1: 'override1',
                prop3: 'override3',
                prop4: 'value4',
            };
            container.registerProperties(additionalTestProps);

            expect(container.getProperties()).toEqual({ ...testProps, ...additionalTestProps });
            expect(container.getProperty('prop1')).toBe(additionalTestProps.prop1);
            expect(container.getProperty('prop3')).toBe(additionalTestProps.prop3);
            expect(Object.keys(container.getProperties()).length).toBe(4);
        });
    });

    describe('Services tests', () => {
        it('Should register a valid service injecting raw values', () => {
            const container = new Container();

            const testArgs = {
                arg1: 'value1',
                arg2: 123.45,
                arg3: ['test', 123, { test: 'test' }],
            };

            container.registerService('test-service1', {
                clazz: TestService3,
                args: testArgs,
                lazy: false,
            });

            // lazy=false => expect service to be instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService3);

            const service = container.getService('test-service1') as TestService3;

            expect(service.getArg1()).toBe(testArgs.arg1);
            expect(service.getArg2()).toBe(testArgs.arg2);
            expect(service.getArg3()).toEqual(testArgs.arg3);
        });

        it('Should register a valid service args in wrong order', () => {
            const container = new Container();

            const testArgs = {
                arg3: ['test', 123, { test: 'test' }],
                unknown: 'useless',
                arg1: 'value1',
                arg2: 123.45,
            };

            container.registerService('test-service1', {
                clazz: TestService3,
                args: testArgs,
                lazy: false,
            });

            // lazy=false => expect service to be instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService3);

            const service = container.getService('test-service1') as TestService3;

            expect(service.getArg1()).toBe(testArgs.arg1);
            expect(service.getArg2()).toBe(testArgs.arg2);
            expect(service.getArg3()).toEqual(testArgs.arg3);
        });

        // it('Should NOT register a valid service injecting WRONG TYPE raw values', () => {
        // expect('this test').toBe('implemented one day'); // but how to check types ???
        // });

        it('Should register a service depending on some properties already registered properties', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: false,
            });

            // expect service to be instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService1);

            expect((container.getService('test-service1') as TestService1).getArg1()).toBe(testProps.prop1);
        });

        it('Should register a LAZY service depending on some properties already registered properties', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            // expect service to be instanciated on the fly
            expect((container.getService('test-service1') as TestService1).getArg1()).toBe(testProps.prop1);
        });

        it('Should NOT register a service depending on some invalid/not-yet-registered properties', () => {
            const container = new Container();

            const t = (): void => {
                container.registerService('test-service1', {
                    clazz: TestService1,
                    args: {
                        arg1: '%prop1%',
                    },
                    lazy: false,
                });
            };

            expect(() => t()).toThrowError();
        });

        it('Should register a LAZY service depending on some not yet registered properties', () => {
            const container = new Container();

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // // expect service to be instanciated
            // expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService1);

            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            expect(container.getService('test-service1')).toBeInstanceOf(TestService1);
            expect((container.getService('test-service1') as TestService1).getArg1()).toBe(testProps.prop1);
        });

        it('Should register a service depending on other properties & services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: false,
            });

            container.registerService('test-service2', {
                clazz: TestService2,
                args: {
                    arg2: '%prop2%',
                    arg3: '@test-service1',
                },
                lazy: false,
            });

            expect((container.getService('test-service2') as TestService2).getArg2()).toBe(testProps.prop2);
            expect((container.getService('test-service2') as TestService2).getArg3()).toBeInstanceOf(TestService1);
            expect((container.getService('test-service2') as TestService2).getArg3().getArg1()).toBe(testProps.prop1);
        });

        it('Should register a service depending on other properties & LAZY services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            container.registerService('test-service2', {
                clazz: TestService2,
                args: {
                    arg2: '%prop2%',
                    arg3: '@test-service1',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service2'].instance).toBeUndefined();
            // expect lazy dependency to not be instanciated because service 2 is still lazy
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            expect((container.getService('test-service2') as TestService2).getArg2()).toBe(testProps.prop2);
            expect((container.getService('test-service2') as TestService2).getArg3()).toBeInstanceOf(TestService1);
            expect((container.getService('test-service2') as TestService2).getArg3().getArg1()).toBe(testProps.prop1);
        });

        it('Should register a LAZY service depending on other properties & LAZY services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            container.registerService('test-service2', {
                clazz: TestService2,
                args: {
                    arg2: '%prop2%',
                    arg3: '@test-service1',
                },
                lazy: false,
            });

            // expect service to be instanciated
            expect(container.getServices()['test-service2'].instance).toBeInstanceOf(TestService2);
            // expect lazy dependency to be instanciated because it's required by something that has been instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService1);

            expect((container.getService('test-service2') as TestService2).getArg2()).toBe(testProps.prop2);
            expect((container.getService('test-service2') as TestService2).getArg3()).toBeInstanceOf(TestService1);
            expect((container.getService('test-service2') as TestService2).getArg3().getArg1()).toBe(testProps.prop1);
        });
    });
});
