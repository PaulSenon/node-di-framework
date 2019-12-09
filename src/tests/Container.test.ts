import Container from '../Container';

describe('Dependency Injection Container Tests', () => {
    describe('Test Properties', () => {
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
            expect(sp);
        });
        it('Should set multiple properties from without collision', () => {
            const container = new Container();
        });
        it('Should set multiple properties with override', () => {
            const container = new Container();
        });
    });

    // describe('Test Properties', () => {
    //     it('Should ')
    // });
});
