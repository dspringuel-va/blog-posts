# The SOLID Principles

## Overview

Every programmer knows how easy software can rot if it is not designed and maintained properly. Then, design smells begin to rise. Software can then have the following attributes:

- *Rigid*: Software that is hard to change, even in simple ways. Also, rigidity cause cascade updates in other modules, due to poor dependency management.
- *Fragile*: Software that when is updated, causes break and failure in other parts of the software, sometimes that are unrelated.
- *Immobile*: Common parts that could be reused in other modules but are so anchored in their modules that the risk to refactor and extract them are too high.

The SOLID principles are simple design principles that help prevent the precedent smells to happen in the first place. SOLID is an acronymn for the five principles:

- The **S**ingle Responsibility Principle
- The **O**pen-Closed Principle
- The **L**iskow Substitution Principle
- The **I**nterface Segregation Principle
- The **D**ependency Inversion Principle

Those principles were defined by [Robert C. Martin](https://en.wikipedia.org/wiki/Robert_C._Martin), a.k.a. Uncle Bob.

## The Single Responsibility Principle

The Single Responsibility Principle might seem easy to understand at first:
>*A class should be responsible for one thing.*

This definition isn't quite right. If we would apply this blindly, we could end up with more classes than needed and create confusion about the cohesion of those classes.

Since we still want cohesion within the class, the following definition makes more sense
>*A class should only have one reason to change.*

From this definition, we can infer that a responsibility is a reason to change.

Here is an example of a class that violates the principle, *i.e.* that has more than one reason to change.

```
class Employee {
  public calculatePay() {...}
  public reportHours() {...}
  public save(): void {...}
}
```
This class could be coming from a payroll application. Clearly, it has three responsibities:

1. Calculate
2. Report
3. Save

In other words, this class can change if we want to update how we calculate the pay, or how we want to report the hours, or how we want to save the employee info to a persistent storage. All those changes are independent from each other.

A better design could be to refactor the `Employee` class to be essentially a data structure and create three new classes, one per responsibility: `PayCalculator`, `HoursReporter` and `EmployeePersister`, where each of those class has a dependency to the `Employee` data structure. Thus, the coupling is broken between those responsibilities and the development can continue independently from one another.

## The Open-Closed Principle

The Open-Closed Principle can be defined by the following:

>*Classes/Modules should be open for extension, but closed for modification*

Two parts are defined in this principle:

1. Open for extension: As new requirements come into play, class behaviors should be easy to extend and change. It also mean that the class isn't rigid (following definition in the overview section)
1. Closed for modification: In a perfect architecture, extending a class to add a behavior shouldn't trigger any change in the base class or module.

These two parts seem contradictory. How can we extend a class behavior without modifying it. The answer is *abstraction*.

Let's go back to the example mentionned in the previous section. Let's say we have a module that is responsible for reporting. At first we have a `HoursReporter` class that is responsible to report the employee's time by the hour. This is very specific case. If we want to add a `WeeksReporter`, we'll have to adapt the reporting module, which violates the *closed for modification* part of the principle. Furthermore, if the reporting module changes, all the depending modules will have to be rebuilt (recompiled, retested and redeployed).

As mentionned above, the answer to this problem is abstraction. Let's replace the `HoursReporter` class in the reporting module by an abstract class `EmployeeReporter`, which is extended in by the `HoursReporter` class. The best thing about this now is that the `HoursReporter` class can be extracted from the reporting module into it's own module. Thus, the reporting module doesn't know anything about the specific `HoursReporter` anymore. Furthermore, if another type of reporter is needed (e.g. the `WeeksReporter`), we only need to extend the abstract class in the reporting module.

At that point, the reporting module respects the Open/Closed Principle. The module is open for extension (through the `EmployeeReporter` class) and closed for modification, which means that the reporting module doesn't have to be modified in order to add a new behavior.

Finally, this is probably the most important principle in this group. It is the heart of object-oriented programming that allows great flexibility and reusability with a minimal maintenance. However, it doesn't mean to abstract everything all the time. Since abstraction comes with a cost (in time and complexity), benefits are seen when it is applied to parts of the system that change frequently.

## The Liskov Substitution Principle

The Open-Closed Principle uses abstraction and polymorphism as its primary mechanisms. In object-oriented language, inheritance is a tool that let the user implements abstract classes. However, there are some traps that comes with inheritance that will eventually violate the Open-Closed Principle. The Liskov Substitution Principle is a principle that helps avoids those violations. It is defined as follow:

>*Subtypes must be substitutable for their base types*

In other words, a subtype, when used as its base type, should not behave differently than the general abstract case. Let's have an example that shows a violation.

First, let's define some classes.
```
interface Shape {
  calculateArea(): int
}
class Rectangle implements Shape {
  getWidth():int {...}
  setWidth(width:int) {...}
  getHeight():int {...}
  setHeight(height:int) {...}

  calculateArea(): int { return getWidth() * getHeight(); }
}
```
Here, we have a rectangle that implements a `Shape` interface. So far, no violation. However, we want now to implement a square class.

```
class Square extends Rectangle {
  setWidth(width: int) {
    super.setWidth(width);
    super.setHeight(height);
  }
  setHeight(height: int) {
    super.setWidth(width);
    super.setHeight(height);
  }
}
```

Since a square is a rectangle, it makes sense to extends the `Rectangle` class. It reuses the `get` methods, plus the `calculateArea` method. However, this inheritance violates the Liskov Substitution Principle and here is an example why:

```
function rectangleTest(rectangle: Rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(4);

  assertThat(rectangle.calculateArea(), is(20));
}
```

Following the principle, the above assertion must always be true. It makes sense since we are expecting a rectangle and a rectangle by definition can have different width and height and that its area is the product of the two. However, if this function receives a `Square` object, the assertion will fail. With this particular implementation, a `Square` can't be substituted by its base type (here `Rectangle`) without changing the expected base class behavior.

We could update the test with the following
```
function rectangleTest(rectangle: Rectangle) {
  rectangle.setWidth(5);
  rectangle.setHeight(4);

  if(rectangle is Square) {
    assertThat(rectangle.calculateArea(), is(16));
  }
  else {
    assertThat(rectangle.calculateArea(), is(20));
  }
}
```
However, the `Rectangle` is now aware of a specific behavior from its subclass, which violates the Open-Closed principle.

Thus, the previous `Square`-`Rectangle` implementation isn't the right way to go. However, how can we reuse `Rectangle`'s `calculateArea` implementation in the `Square` class, since it's the same? The answer is *composition*.

```
class Square implements Shape {
  private squareRectangle: Rectangle;

  setWidth(width: int) {
    squareRectangle.setWidth(width);
    squareRectangle.setHeight(height);
  }
  getWidth():int { return squareRectangle.getWidth(); }

  calculateArea(): int { return squareRectangle.calculateArea(); }
}
```

With composition, it is possible to reuse the `Rectangle` functionnality without mixing the two classes. It is now not possible to pass a `Square` in the test function above, since the `Square` class doesn't extends the `Rectangle` anymore.

Finally, the Liskov Substitution Principle is a principle that helps avoiding bugs caused by weird substitutability errors created by a misuse of inheritance. Furthermore, keeping that principle in mind helps a lot when applying the Open-Closed Principle.


## The Interface Segregation Principle

The Interface Segregation Principle states the following:

>*A client should not be forced to depend on methods it doesn't use.*

When a client depends on more methods in a class that it needs, it creates unnecessary coupling between the class and those methods. For example,

```
class Base {
  foo() {...}
  bar() {...}
}

class UserA {
  aMethod(base: Base) {
    ...
    base.foo();
    ...
  }
}

class UserB {
  anotherMethod(base: Base) {
    ...
    base.bar();
    ...
  }
}
```

Here, the class `UserA` only uses the `foo()` method on the `Base` class, where `UserB` only uses the `bar()` method on the `Base` class. That means that if `UserB` forces changes on the `Base` class, it will automatically affect the `UserA` class, even though the changes has nothing to do with the `foo()` method. This is because the `Base` class needs to be recompiled and redeployed, which will trigger the same for its users, in that case `UserA` and `UserB`. However, recompiling, retesting and redeploying `UserA` each time another `Base`class' user forces changes is bad. It means that `UserA` and `UserB` and now indirectly coupled, which leads to fragility. That's why segregating interface is important.

We can fix the previous example by creating new interfaces and moving the dependencies.

```
interface Foo {
  foo();
}
interface Bar {
  bar();
}
class Base implements Foo, Bar {
  foo() {...}
  bar() {...}
}

class UserA {
  aMethod(foo: Foo) {
    ...
    foo.foo();
    ...
  }
}

class UserB {
  anotherMethod(bar: Bar) {
    ...
    bar.bar();
    ...
  }
}
```

Now, each user knows only about the methods it needs. Furtermore, if the `Bar` interface changes now (because the `UserB` needs it to), the `Foo` interface stays unaffected, which means that the `UserA` won't need to be recompiled, retested nor redeployed.


## The Dependency Inversion Principle

The Dependency Inversion Principle can be define in two ways:

>*High-level module should not depend on low-level modules. Both should depend on abstraction*

>*Abstractions should not depend upon details. Details should depend upon abstraction*

Some might ask why it is called the Dependency *Inversion* Principle. Where does the inversion come from?

Traditionally, the dependencies were as follow:

```
Policy Module --> Interactor Module --> Utility Module

(where A --> B means A depends on B)
```

In this example the high-level modules depends on low level ones. This means that high-level policies are tightly coupled to the low-level details. Each times the `Utility` module is changed, the policy module will have to be recompiled, retested and redeployed.

For example, a utility module could be a reporting module in an accounting software. It doesn't make sense to have the high-level accounting policies depend on the low-level reporting utilities. It should be the other way around, since the accounting policies might probably be reused somewhere else in the software.

The dependencies then should be inversed as follow:

```
Policy Module --> Policy Service Interface
                            ^
                            |
                     Interactor Module --> Interactor Service Interface
                                                         ^
                                                         |
                                                   Utility Module
```

In that diagram, the low-level modules now depend on a higher-level abstraction, and the high-level modules only define a interface for lower-level modules. Thus, the dependency that high-level modules had on lower-level ones disappeared.

This principle is closely related to the Open-Closed Principle. When the dependencies are reversed, it is now easy to close the high-level modules for modification (because of the non-existent lower-level dependencies) as well as to open them for extension (since they provide an interface that any lower-level modules can implement and use).

## Closing

As Uncle Bob stated,
> The SOLID principles are not rules. They are not laws. They are not perfect truths. The are statements on the order of “An apple a day keeps the doctor away.” This is a good principle, it is good advice, but it’s not a pure truth, nor is it a rule.

The principles are meant to be a guide to good software design decisions. Personally, I think they do particularly well with TDD, because they allow good design software that is really easy to test and refactor.

Finally, I think that at least be aware of those principles and try to apply them in the work environment can help every programmer going down the road of being a better programmer.

## References
- Robert C. Martin, "Clean Architecture: A Craftsman's guide to Software Structure and Design", Prentice Hall, 2018
- Robert C. Martin, "Agile Software Development: Principles, Patterns, and Practices", Pearson Education, 2003
- "SOLID (object-oriented design)", Wikipedia page, https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)
- "Getting a SOLID start", https://sites.google.com/site/unclebobconsultingllc/getting-a-solid-start