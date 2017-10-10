import {expect} from "chai";
import {mock, instance, verify, anything, anyNumber, between, when} from "ts-mockito";
import {MyClass, MyInterface} from "./example";

describe(`Mocking`, () => {
  it(`should mock properly`, () => {
    let myClassMock: MyClass = mock(MyClass);

    let myClassMockInstance: MyClass = instance(myClassMock);
    myClassMockInstance.foo(4);

    verify(myClassMock.foo(4)).called();
  });

  it(`should count calls properly`, () => {
    let myClassMock: MyClass = mock(MyClass);

    let myClassMockInstance: MyClass = instance(myClassMock);
    myClassMockInstance.foo(1);
    myClassMockInstance.foo(1);
    myClassMockInstance.foo(1);

    // verify(myClassMock.foo(1)).once(); // Failure!
    // verify(myClassMock.foo(1)).twice(); // Failure!
    verify(myClassMock.foo(1)).thrice(); // Success!
    verify(myClassMock.foo(1)).atLeast(2); // Success!
    // verify(myClassMock.foo(1)).atMost(2); // Failure!
    // verify(myClassMock.foo(1)).never(); // Failure!
  });

  it(`should handle multiple argument specifications`, () => {
    let myClassMock: MyClass = mock(MyClass);

    let myClassMockInstance: MyClass = instance(myClassMock);
    myClassMockInstance.foo(4);

    verify(myClassMock.foo(anything())).called(); // Success!
    verify(myClassMock.foo(anyNumber())).called(); // Success!
    verify(myClassMock.foo(between(2, 6))).called(); // Success!
  });

  it(`should handle call order verification`, () => {
    let myClassMock: MyClass = mock(MyClass);
    let myOtherClassMock: MyClass = mock(MyClass);

    let myClassMockInstance: MyClass = instance(myClassMock);
    let myOtherClassMockInstance: MyClass = instance(myOtherClassMock);
    myClassMockInstance.foo(4);
    myOtherClassMockInstance.foo(5);

    verify(myClassMock.foo(anything())).calledBefore(myOtherClassMock.foo(anything())); // Success!
    verify(myOtherClassMock.foo(anything())).calledAfter(myClassMock.foo(anything())); // Success!
  });
});

describe(`Stubbing`, () => {
  it(`should stub properly`, () => {
    let myClassMock: MyClass = mock(MyClass);
    when(myClassMock.foo(3)).thenReturn("This is a test string");

    let myClassMockInstance: MyClass = instance(myClassMock);

    expect(myClassMockInstance.foo(3)).to.be.equal("This is a test string");
    expect(myClassMockInstance.foo(4)).to.be.null;
  });

  it(`should handle stubs for different calls`, () => {
    let myClassMock: MyClass = mock(MyClass);
    when(myClassMock.foo(3)).thenReturn("This is a test string");
    when(myClassMock.foo(4)).thenReturn("Another test string");

    let myClassMockInstance: MyClass = instance(myClassMock);

    expect(myClassMockInstance.foo(3)).to.be.equal("This is a test string");
    expect(myClassMockInstance.foo(4)).to.be.equal("Another test string");
  });

  it(`should handle multiple stubs for the same call`, () => {
    let myClassMock: MyClass = mock(MyClass);
    when(myClassMock.foo(3))
      .thenReturn("A stub")
      .thenReturn("Another stub")
      .thenReturn("Final stub");

    let myClassMockInstance: MyClass = instance(myClassMock);

    expect(myClassMockInstance.foo(3)).to.be.equal("A stub");
    expect(myClassMockInstance.foo(3)).to.be.equal("Another stub");
    expect(myClassMockInstance.foo(3)).to.be.equal("Final stub");
    expect(myClassMockInstance.foo(3)).to.be.equal("Final stub");
  });
});

describe(`Work around for interface`, () => {
  it(`should handle interfaces through a fake implementation`, () => {
    let myInterfaceMock: MyInterface = mock(FakeOfMyInterface);
    let myInterfaceMockInstance: MyInterface = instance(myInterfaceMock);
    myInterfaceMockInstance.foo(5);

    verify(myInterfaceMock.foo(anything())).called();
  });
});

class FakeOfMyInterface implements MyInterface {
  foo(n: number): string {
    throw new Error("Method not implemented.");
  }
}