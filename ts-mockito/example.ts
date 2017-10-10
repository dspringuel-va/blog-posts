export class MyClass {
  public foo(n: number): string {
    return `Foo number ${n}`;
  }
}

export interface MyInterface {
  foo(n:number): string;
}