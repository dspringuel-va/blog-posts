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

## `ts-mockito`
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

*Attention*: `ts-mockito` require to define a mock object, and then create an instance of that mock that will be used to record behavior. Ultimately, the verification is done on the mock.

#### Basic Example

Suppose
```
class MyClass {
  foo(n: number): string {
    return createStringFromNumber(n);
  }
}
```

Then,
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

#### Argument Specification
```
let myClassMock: MyClass = mock(MyClass);

let myClassMockInstance: MyClass = instance(myClassMock);
myClassMockInstance.foo(4);

verify(myClassMock.foo(anything())).called(); // Success!
verify(myClassMock.foo(anyNumber())).called(); // Success!
verify(myClassMock.foo(between(2, 6))).called(); // Success!
```

#### Call Order Verification
```
let myClassMock: MyClass = mock(MyClass);
let myOtherClassMock: MyClass = mock(MyClass);

let myClassMockInstance: MyClass = instance(myClassMock);
let myOtherClassMockInstance: MyClass = instance(myClassMock);
myClassMockInstance.foo(4);
myOtherClassMockInstance.foo(5);

verify(myClassMock.foo(anything())).calledBefore(myOtherClassMock.foo(anything())); // Success!
verify(myOtherClassMock.foo(anything())).calledAfter(myClassMock.foo(anything())); // Success!
```

### Stubbing

`ts-mockito` provides also a stubbing feature, i.e. it can stub determined value for specific calls without actually executing the implementation.

The library doesn't make a difference between mocks and stubs (specific to their definitions) here, since the stubbing is also done on the mock object.

#### Basic Usage
```
let myClassMock: MyClass = mock(MyClass);
when(myClassMock.get(3)).thenReturn("This is a test string");

let myClassMockInstance: MyClass = instance(myClassMock);

console.log(myClassMockInstance.get(3)) // Prints 'This is a test string'
console.log(myClassMockInstance.get(4)) // Prints undefined
```

### Stubs for different calls
```
let myClassMock: MyClass = mock(MyClass);
when(myClassMock.get(3)).thenReturn("This is a test string");
when(myClassMock.get(4)).thenReturn("Another test string");

let myClassMockInstance: MyClass = instance(myClassMock);

console.log(myClassMockInstance.get(3)) // Prints 'This is a test string'
console.log(myClassMockInstance.get(4)) // Prints 'Another test string'
```

### Multiple stubs for the same call
```
let myClassMock: MyClass = mock(MyClass);
when(myClassMock.get(3))
  .thenReturn("A stub")
  .thenReturn("Another stub")
  .thenReturn("Final stub");

let myClassMockInstance: MyClass = instance(myClassMock);

console.log(myClassMockInstance.get(3)) // Prints 'A stub'
console.log(myClassMockInstance.get(3)) // Prints 'Another stub'
console.log(myClassMockInstance.get(3)) // Prints 'Final stub'
console.log(myClassMockInstance.get(3)) // Prints 'Final stub'
```

### Supported Mock Types
`ts-mockito` supports the mocking of normal classes and abstract classes. However, it *can't* stub abstract methods in abstract classes. Furthermore, it also doesn't support the mocking of interfaces. The reason behind this is that abstract methods and interface are Typescript constructs and aren't defined at runtime. Thus, there is no way for `ts-mockito` to do anything about those types.

However, there is a quick work-around for this, if one really wants/needs to mock an interface. It requires the usage of a fake class implemented the wanted interface.

```
interface MyInterface {
  foo(n: number): string;
}

class FakeOfMyInterface implements MyInterface {
  foo(n: number): string {
    throw new Error(`Method not implemented`);
  }
}

...

let myInterfaceMock: MyInterface = mock(FakeOfMyInterface);
let myInterfaceMockInstance: MyInterface = instance(myInterfaceMock);

...
```

## Final thoughts

I think that `ts-mockito` is a great library. It provides strongly typed mocks, intuitive functions and powerful features. I personally used it a few times and I liked it better than the features provided by the Jasmine framework.

Here is the test file from the motivation section using `ts-mockito`:
```
describe('Load Stuff', () => {
  let httpServiceMock: Http = mock(Http);

  let myService: MyService = new MyService(instance(httpServiceMock));

  it('should load stuff', () => {
    myService.loadStuff();
    verify(httpServiceMock.get(...)).called();
  });
});
```

Finally, there are some advices that one should know in order to not get lost in the sea of mocks and create hard to read tests. Those advices come from the `Mockito` documentation page
> * Do not mock types you don’t own
> * Don’t mock value objects
> * Don’t mock everything
> * Show love with your tests!

Code from examples can be found here: ...

## References
1. `ts-mockito` GitHub page: https://github.com/NagRock/ts-mockito
2. Martin Fowler - 'Mocks Aren't Stubs': https://martinfowler.com/articles/mocksArentStubs.html
3. Mockito (Mocking Framework for Java): http://site.mockito.org/