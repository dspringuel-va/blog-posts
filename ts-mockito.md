# Strongly typed Typescript mocks/stubs with `ts-mockito`

## Motivation
Coming personally from a Java world into Typescript was a fairly straigforward transition to me: strong types, classes, generics, etc. However, since Typescript is a typed superset of Javascript, it is still possible to go around types (using the `any` type) to achieve some goals and/or features.

One of those features are mocks/stubs (I'll get to terminology later to establish the definitions for this post). Recently, I've been working on Angular 2 projects and I came across that kind of tests (using Jasmine) for Angular service:

#### my-service.ts
```
@Injectable()
class MyService {
  constructor(http: Http) {

  }

  loadStuff(): Observable<Stuff> {
    return http.get(...).map(response => mapToStuff(response));
  }
}
```
#### my-service.spec.ts
```
describe('Load Stuff', () => {

  let testResponse: Observable<Response> = ...
  let httpServiceMock: any = {
    get: (url: string, options?: RequestOptionsArgs) => { return testResponse; }
  };

  spyOn(httpServiceMock, 'get').and.callThrough();
  let myService: MyService = new MyService(httpServiceMock);

  it('should load stuff', () => {
    myService.loadStuff();
    expect(httpServiceMock.get).toHaveBeenCalledWith(...);
  });
});
```

This is working fine. However, it isn't using the full power of Typescript, since it is declaring the mock this way: `let httpServiceMock: any`. To have a strongly type mock here, we would have to define every methods/properties in the `Http` class, which is not worth doing in this trivial case.

Moreover, if the mocked class (`Http` in the example) was to change a method's interface, the test would only fail at runtime (which isn't great). If the mock was typed, the test would fail at compile-time (which is a bit better).

### `ts-mockito`
This is where [`ts-mockito`](https://github.com/NagRock/ts-mockito) comes in!

From the GitHub [repo](https://github.com/NagRock/ts-mockito):

> Mocking library for TypeScript inspired by http://mockito.org/

[`Mockito`](https://github.com/mockito/mockito) is one of the most popular Mocking Framework for unit-tests in Java and certainly has powerful mocking/stubbing features. `ts-mockito` is heavily inspired by it and uses the same concepts.

### Quick Features Overview
* Strongly Typed
* Mocks on class and abstract classes (no mocks on interfaces, but we'll talk about a workaround later)
* Verify mecanism on mock behaviours
  * Flexible arguments comparison
  * Call count verification
  * Call order verification
* Stubs methods and/or properties
* Readable error messages

### Installation
`npm install -D ts-mockito`

## Terminology

Before going further, terminology definitions is necessary to have a clear understanding on the term used in this post. Martin Fowler's [blog post](https://martinfowler.com/articles/mocksArentStubs.html) about the subject will be used as the source of truth here. Fowler's himself is refering to Gerard Meszaros's ["xUnit Test Patterns"](https://books.google.ca/books?id=-izOiCEIABQC&lpg=PP1&dq=xunit%20test%20patterns&pg=PP1#v=onepage&q=xunit%20test%20patterns&f=false) book about unit-test code, and how to refactor it.

Typically, a unit test follow four phases (which are referenced in the terminology definition). Those are named
1. Setup: Prepare the necessary objects before performing the test
2. Exercice: Call the actual method/function under test
3. Verify: Verify the output and/or the behavior of what is under test
4. Teardown: Clean up the test properly

### Double
> Meszaros uses the term Test Double as the generic term for any kind of pretend object used in place of a real object for testing purposes.

### Mocks
> Objects pre-programmed with expectations which form a specification of the calls they are expected to receive

A mock shouldn't do anything other than recording its behavior in the exercise phase of the test and verify the recorded behavior against an expected behavior in the verify phase.

### Stub
> Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test.

Stubs are objects that easily provides values for a given method, without to actually execute the method implementation. Those objects are created and used in the setup phase.

### Fake
> Fake objects actually have working implementations, but usually take some shortcut which makes them not suitable for production

### Dummy
> Dummy objects are passed around but never actually used. Usually they are just used to fill parameter lists.


## Features and Examples

### Mocking

This is probably the main feature of the library. `ts-mockito` allows the user to create strongly typed mock and then verify the behavior on it later.

*Attention*: `ts-mockito` require to define a mock object, and then create an instance of that mock that will be used to records behavior. Ultimately, the verification is done on the mock.

#### Basic Example

Suppose
```
class MyClass {
  foo(n: number): Bar {
    return createBarFromNumber(n);
  }
}
```

Then
```
let myClassMock: MyClass = mock(MyClass);

let myClassMockInstance: MyClass = instance(myClassMock);
myClassMockInstance.foo(1);

verify(myClassMock.foo(1)).called(); // Success!

```

#### Call Count Verification
```
let myClassMock: MyClass = mock(MyClass);

let myClassMockInstance: MyClass = instance(myClassMock);
myClassMockInstance.foo(1);
myClassMockInstance.foo(1);
myClassMockInstance.foo(1);

verify(myClassMock.foo(1)).once(); // Failure!
verify(myClassMock.foo(1)).twice(); // Failure!
verify(myClassMock.foo(1)).thrice(); // Success!
verify(myClassMock.foo(1)).atLeast(2); // Success!
verify(myClassMock.foo(1)).atMost(2); // Failure!
verify(myClassMock.foo(1)).never(); // Failure!
```

