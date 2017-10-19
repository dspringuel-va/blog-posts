export class MyClass {

  constructor(private myInterface: MyInterface){}

  public foo(n: number): string {
    return this.myInterface.foo(n);
  }
}

export interface MyInterface {
  foo(n:number): string;
}