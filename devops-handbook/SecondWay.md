## The Second Way: The Technical Practices of Feedback

### Create Telemetry to Enable Seeing and Solving Problems

#### Create our centralized telemetry infrastructure
*What*

Every layer of the architecture (business logic, application,
environment, deployment pipeline, etc) should have telemetry in the
form of events, logs, and metrics. Furthermore, events and metrics
should be routed to a common service for storage, visualization and
alerting purposes.

*Why*

A centralized place to store all telemetry makes it easy to consume,
organize and manage. Also, it makes easy for anyone interested in the
system to watch any telemetry of their interest without having to use
many different tools.

#### Create application logging telemetry that helps production
*What*

Logging telemetry is events that contain some interesting pieces of
information along with a timestamp. There are many levels of logging:

Debug: Could be anything that happens in the system. Most of the
time, this logging helps to debug system issues.

Info: Actions that are either user-driven or system specific.

Warn: Conditions that could potentially become errors, like a database call
that takes longer than normal.

Error: Information mostly about internal failures, like API call
failures or internal errors.

Fatal: Information that tells us that the program must terminate.


*Why*

Having different levels of logging helps to detect at a glance what is
happening throughout the system. It also helps to add some context on
why certain events are happening (e.g. what logging event preceded an
error logging message). It also allows having an alerting system in
place that depends on certain logging levels, to be able to respond
accordingly as fast as possible to resolve the problem.

#### Use telemetry to guide problem solving
*What*

Use telemetry to resolve problems that are happening brings some
objectivity to the matter. We can formulate hypotheses about the
problem causes and what is required to solve it. Example of questions
we can answer during problem resolution include

- What evidence do we have from our monitoring that a problem is
actually occurring?
- What are the relevant events and changes in our application and
environments that could have contributed to the problem?
- What hypotheses can we formulate to confirm the link between the
proposed causes and effects?
- How can we prove which of these hypotheses are correct and
successfully effect a fix?

*Why*

The main benefit of using telemetry for problem solving is that it
results in a much faster mean time to recovery, which is good for the
customers and the business. Furthermore, since it brings more objective
data when problems occur, it encourages a blameless culture around
problems and outages.


#### Enable creation of production metrics as part of daily work
*What*

To have all the telemetry necessary to monitor all parts of
the systems, every contributor should be able to easily and quickly add
new telemetry around any work done. This can be done by using metrics
library, like [StatsD](https://github.com/statsd/statsd) (created by
Etsy).

*Why*

Continuously creating telemetry as part of daily work makes sure that
everything that is going to production is monitored. Thus, we can
maintain a high level of quality.

#### Find and fill any telemetry gaps
*What*

When the telemetry infrastructure is effectively in place, we can use
telemetry to monitor as many parts of the system as possible. Example
levels are

Business level: number of sales transactions, user signups, etc.

Application level: transaction times, user response times, application
faults, etc

Infrastructure level (databases, OS, network, etc): web server traffic,
 CPU, memory and disk usage, etc.

Client software level: application errors, API response times, etc.

Deployment pipeline level: build status, change deployment lead times,
deployment frequencies, environment status, etc.


*Why*

Filling those gaps enables the monitoring of the whole system at once.
It allows us to detect problems almost as soon as they occur, wherever
they occur, which leads to a faster mean time to recovery.

### Integrate Hypothesis-Driven Development and A/B Testing into our Daily Work

#### Integrating A/B Testing into our feature testing
*What*

When business level telemetry is in place, it enables us to do some A/B
testing. A/B testing is showing randomly to a user two versions of
something (version A or version B), and gather data on how it affects
the performance of the system. For example, which button style and
placement leads to the best conversion rate for example.

*Why*

A/B testing enables continuous and fast feedback cycles. It is one
quick way to do user research. Consequently, the more we do user
research quickly, the faster the system will improve over time. That
quick feedback cycle is also very good when the given industry is
fast-paced, since it allows the business to gain an edge on competitors
and gain some market share.

### Create Review and Coordination Processes to Increase Quality of our Current Work

#### Enable coordination and scheduling of changes
*What*

When the business is growing, it becomes difficult to effectively
manage work dependencies across teams. Having loosely coupled
architecture helps to diminish the amount of dependency from one team
to another. However, it might not be always possible to reduce all
dependency to the point of not having any. Then, coordination across
teams is feasible by using chat rooms to announce upcoming changes, or
by having meetings where people can discuss potential work dependencies.

*Why*

When multiple teams could potentially have work collision, coordinating
and scheduling changes decrease the risk of dependency problems and
limits the amount of work in progress. This helps to minimize the
chances of incidents and increase the deployment lead time.

#### Enable peer review of changes
*What*

Peer review of changes means that the code is reviewed by the
appropriate subject matter expert before the code is actually
integrated and deployed. This can be done in various ways, like
over-the-shoulder review (a developer looks at the code of another one
as the latter walks through the code), or tool-assisted code review
(like a pull request on GitHub).

*Why*

The main benefits are to review and catch potential issues before the
code is integrated. That means that the cost and the time to fix those
issues are really low. Furthermore, code reviews encourage smaller
batch size of work, since small changes are easier and faster to review.


#### Enable pair programming to improve all our changes
*What*

Pair programming is having two developers working together at a single
computer. One is writing the code (the driver), while the other is
reviewing the code as it's being written (the navigator). Then,
developers switch place after a given amount of time, usually after 15
to 30 minutes.

*Why*

The main benefit of pair programming is having the code reviewed as
soon as it is created. The navigator, while reviewing the code, could
come with new ideas or see potential future problems, all of which
could be resolved faster. Furthermore, pair programming enables a
natural transfer of skills, like sharing techniques or workflows for
example.