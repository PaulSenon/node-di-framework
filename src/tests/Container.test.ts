import AbstractService from '../Interfaces/AbstractService';
import Container from '../Container';
import TestService1 from './test-class/testService1';
import TestService2 from './test-class/testService2';

describe('Dependency Injection Container Tests', () => {
    describe('Properties tests', () => {
        it('Should register a valid property (from scratch)', () => {
            const container = new Container();
            const testProp = { name: 'prop-type-string', value: 'test' };

            container.registerProperty(testProp.name, testProp.value);
            expect(container.getProperties()).toEqual({
                [testProp.name]: testProp.value,
            });
        });

        it('Should register a new valid property (from scratch)', () => {
            const container = new Container();
            const testProps = [
                { name: 'prop-type-string', value: 'test' },
                { name: 'prop-type-string2', value: 'test2' },
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

        it('Should overide old property', () => {
            const container = new Container();
            const testProps = [
                { name: 'prop-type-string', value: 'test' },
                { name: 'prop-type-string', value: 'test-overide' },
            ];

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

        it('Should set multiple properties from scratch', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };

            container.registerProperties(testProps);
            expect(container.getProperties()).toEqual(testProps);
            expect(container.getProperty('prop1')).toBe(testProps.prop1);
            expect(container.getProperty('prop2')).toBe(testProps.prop2);
        });

        it('Should set multiple properties without collision', () => {
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

        it('Should set multiple properties with override', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);
            expect(container.getProperty('prop1')).toBe(testProps.prop1);
            const additionalTestProps = {
                prop1: 'value3',
                prop4: 'value4',
            };
            container.registerProperties(additionalTestProps);
            expect(container.getProperties()).toEqual({ ...testProps, ...additionalTestProps });
            expect(container.getProperty('prop1')).toBe(additionalTestProps.prop1);
            expect(Object.keys(container.getProperties()).length).toBe(3);
        });
    });

    describe('Services tests', () => {
        it('Should register a valid service injecting string', () => {
            const container = new Container();

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
                args: {
                    arg1: 'value1',
                },
                lazy: false,
            });

            // expect service to be instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService1);

            expect((container.getService('test-service1') as TestService1).getArg1()).toBe('value1');
        });
        it('Should register a valid service depending on some properties (righ order)', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
                args: {
                    arg1: '%prop1%',
                },
                lazy: false,
            });

            // expect service to be instanciated
            expect(container.getServices()['test-service1'].instance).toBeInstanceOf(TestService1);

            expect((container.getService('test-service1') as TestService1).getArg1()).toBe(testProps.prop1);
        });

        it('Should register a valid lazy loaded service depending on some properties (righ order)', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
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
        it('Should NOT register a valid service depending on some invalid/not-yet-registered properties', () => {
            const container = new Container();

            const t = (): void => {
                container.registerService('test-service1', {
                    clazz: TestService1.prototype,
                    args: {
                        arg1: '%prop1%',
                    },
                    lazy: false,
                });
            };

            expect(() => t()).toThrowError();
        });
        it('Should register a valid lazy service depending on some not yet registered properties (reverse order)', () => {
            const container = new Container();

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
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
        it('Should register a valid service depending on other properties & services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
                args: {
                    arg1: '%prop1%',
                },
                lazy: false,
            });

            container.registerService('test-service2', {
                clazz: TestService2.prototype,
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

        it('Should register a valid service depending on other properties & lazy services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            container.registerService('test-service2', {
                clazz: TestService2.prototype,
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
        it('Should register a valid lazy service depending on other properties & lazy services', () => {
            const container = new Container();
            const testProps = {
                prop1: 'value1',
                prop2: 'value2',
            };
            container.registerProperties(testProps);

            container.registerService('test-service1', {
                clazz: TestService1.prototype,
                args: {
                    arg1: '%prop1%',
                },
                lazy: true,
            });

            // expect service not instanciated
            expect(container.getServices()['test-service1'].instance).toBeUndefined();

            container.registerService('test-service2', {
                clazz: TestService2.prototype,
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
