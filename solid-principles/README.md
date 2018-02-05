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

## The Interface Segregation Principle

## The Dependency Inversion Principle

## Conclusion

## References
- Robert C. Martin, "Clean Architecture: A Craftsman's guide to Software Structure and Design", Prentice Hall, 2018
- Robert C. Martin, "Agile Software Development: Principles, Patterns, and Practices", Pearson Education, 2003
- "SOLID (object-oriented design)", Wikipedia page, https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)