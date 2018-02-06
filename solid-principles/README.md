# The SOLID Principles

## Overview

Every programmer knows how easy software can rot if it is not designed and maintained properly. Then, design smells begin to rise. Software can then have the following attributes:

- Rigide: Software that is hard to change, even in simple ways. Also, rigidity cause cascade updates in other modules, due to poor dependency management
- Fragile: Software that when is updated, causes break and failure in other part of the software, sometimes that are unrelated
- Immobile: Common parts that could be reused in other modules but are so anchored in their modules that the risk to refactor and extract them are too high.

The SOLID principles are simple design principles that helps prevent the precendent smells to happen in the first place. SOLID is an acronymn for the five principles

- The **S**ingle Responsibility Principle
- The **O**pen-Closed Principle
- The **L**iskow Substitution Principle
- The **I**nterface Segregation Principle
- The **D**ependency Inversion Principle

Those principles apply mainly at a module/class level.

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

Two parts are defined in this principle

1. Open for extension: As new requirements come into play, class behaviors should be easy to extend and change. It also mean that the class isn't rigid (following definition in the overview section)
1. Closed for modification: In a perfect architecture, extending a class to add a behavior shouldn't trigger any change in the base class or module.

These two parts seem contradictory. How can we extend a class behavior without modifying it. The answer is *abstraction*.

Let's go back to the example mentionned in the previous section. Let's say we have a module that is responsible for reporting. At first we have a `HoursReporter` class that is responsible to report the employee's time by the hour. This is very specific case. If we want to add a `WeeksReporter`, we'll have to adapt the reporting module, which violates the *closed for modification* part of the principle. Furthermore, if the reporting module changes, all the depending modules will have to be rebuilt (re-compiled, re-tested and re-deployed).

As mentionned above, the answer to this problem is abstraction. Let's replace the `HoursReporter` class in the reporting module by an abstract class `EmployeeReporter`, which is extended in by the `HoursReporter` class. The best thing about this now is that the `HoursReporter` class can be extracted from the reporting module into it's own module. Thus, the reporting module doesn't know anything about the specific `HoursReporter` anymore. Furthermore, if another type of reporter is needed (e.g. the `WeeksReporter`), we only need to extend the abstract class in the reporting module.

At that point, the reporting module respects the Open/Closed Principle. The module is open for extension (through the `EmployeeReporter` class) and closed for modification, which means that the reporting module doesn't have to be modified in order to add a new behavior.

Finally, this is probably the most important principle in this group. It is the heart of object-oriented programming that allows great flexibility and reusability with a minimal maintenance. However, it doesn't mean to abstract everything all the time. Since abstraction comes with a cost (in time and complexity), benefits are seen when it is applied to part of the system that changes frequently.

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
Here, we have a rectangle that implements a `Shape` interface. So far, no violation. However, we want now to implement a square class

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

Since a square is a rectangle, it makes sense to extends the `Rectangle` class. It reuses the `get` methods, plus the `calculateArea` method. However, this inheritance violates the Liskov Substitution Principle and here is why

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

Thus, the previous `Square`-`Rectangle` implementation isn't the right way to go. However, how can we reuse `Rectangle`'s `calculateArea` implementation in the `Square` class, since it's the same? The answer is composition.

```
class Square implements Shape {
  private squareRectangle: Rectangle;

  setWidth(width: int) {
    squareRectangle.setWidth(width);
    squareRectangle.setHeight(height);
  }
  setHeight(height: int) {
    squareRectangle.setWidth(width);
    squareRectangle.setHeight(height);
  }
  getWidth():int { return squareRectangle.getWidth(); }
  getHeight():int { return squareRectangle.getHeight(); }

  calculateArea(): int { return squareRectangle.calculateArea(); }
}
```

With composition, it is possible to reuse the `Rectangle` functionnality without mixing the two classes. It is now not possible to pass a `Square` in the test function above, since the `Square` class doesn't extends the `Rectangle` anymore.

Finally, the Liskov Substitution Principle is a principle that helps avoiding bugs caused by weird substitutability errors created by a misuse of inheritance.


## The Interface Segregation Principle

## The Dependency Inversion Principle

## Conclusion

## References
- Robert C. Martin, "Clean Architecture: A Craftsman's guide to Software Structure and Design", Prentice Hall, 2018
- Robert C. Martin, "Agile Software Development: Principles, Patterns, and Practices", Pearson Education, 2003
- "SOLID (object-oriented design)", Wikipedia page, https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)