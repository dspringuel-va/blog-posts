# DevOps 101 | The First Way: The Technical Practices of Flow

This is the part 2 of 4 of this DevOps 101 series.

The first way defines **technical practices of flow**.
Those practices are meant to ship code in a
fast, confident way, to have a maximal flow. A great flow means
that the customers gets what they want earlier, which is good for the
business.

## Basics

### Make our work visible
*What*

Contrary to manufacturing, work in software development is invisible by
nature. However, it can be made visible by creating physical or virtual
board. On that board, all the steps of the value stream should be
present as columns. Then, each workpiece resides on the corresponding
column representing its state in the stream.

*Why*

First, it helps to define a technical value stream and makes everyone
involved on the same page. Furthermore, the work in progress is easy to
understand at a glance. Finally, it's easier to calculate the lead
time, which is the time it is put on the board up to the time it is
placed on the last column.

### Limit the work in progress
*What*

Limiting the work in progress means to establish and enforce a limit on
the number of work cards in each of the work columns.

*Why*

Limiting the work in progress helps reduce the lead time of the work by
focusing on work that has already started. Furthermore, it helps
to see problems in the value stream, e.g. where in the stream does the
work gets stuck, and why.

### Reduce batch size
*What*

Reducing batch size means to have small units of work that can go
through all the streams at once and be delivered independently.

*Why*

It reduces the risks of delivering the wrong work, or defectuous work.
Furthermore, it decreases the lead time, since the amount of work is
smaller. That allows the customers to see value faster.


## Create the foundations of Our Deployment Pipeline

### Enable on-demand creation of dev, test, and production environments
*What*

Ideally, developers should develop their code locally in the exact same
environment as in production. Instead of only documenting how the
production environment consists of, it is better to create a build
mechanism to create in minutes any environment on demand. This can be
achieve in many ways, such as using virtual images and containers (like
Docker), or using infrastructure as code configuration management tools
(like Puppet, Chef, etc).

*Why*

Having a separate yet identical environment, a developer can quickly
and safely develop new code, can reproduce, diagnose and fix defects, and
can experiments on infrastructure code that creates the environment.


### Make infrastructure easier to rebuild than to repair
*What*

The key to having an infrastructure easy to build is to have all
configuration in version control. Thus, it becomes the source of truth
for the automated build mechanisms to replicate every configuration
everywhere.

*Why*

When the infrastructure is easy and quick to rebuild, we can rely on
the build mechanism to ensure environment consistency across all
machines/containers. If any manual configuration change is done on a
production environment, it'll be lost when a new environment is created
Thus, no variance can creep in production, which allows a more
stable and controlled environment.

### Modify our definition of done to include running in a production-like environment
*What*

Before some work can be consider done, we must have integrated, tested,
and working code, where all of this is demonstrated in a
production-like environment.

*Why*

It prevents having problems in production. When caught
early, problems are much easier and quicker to fix and cause no
disruption to customers. Furthermore, it increases the confidence in
delivering quality work to production.

## Enable Fast and Reliable Automated Testing

### Build a fast and reliable automated validation test suite
*What*

To have a high level of confidence about the work done, it should be
validated with automated tests. Many types of tests should be implemented,
all of which serve a specific purpose.

Unit test: Small and fast test that verifies that a single function
works properly in isolation. This proves to the developer that the code
behaves as it was designed. External dependencies (api, databases)
should be stubbed out, so the tests can remain small and fast to run.

Acceptance test: Test that makes sure that the application as a whole
runs as intended, and that regression errors have not been introduced.
The difference between acceptance and unit tests is the point of view.
The acceptance test should prove that the code works as the customer/
business wants it (and not the developer).

Integration test: Test that makes sure that the system works well as a
whole, i.e. with real application and services, and not stubbed out
interfaces. By nature, it'll probably take more time to run than unit
or acceptance test, but will reflect more closely the production
environment, which makes sure that we can catch errors earlier.

Whenever an error is caught in an acceptance or integration test, a
unit test should be created to make sure that the error is caught
earlier in the process.

*Why*

Having tests, in general, make sure that we have the confidence that the
new code works as intended and that it *should not* introduce problems
with the existing code. Also, having multiple kinds of tests
increases that confidence to many levels in the system, like the
business logic works and is preserved, and that the integration between
multiple services remain. Furthermore, having automated tests
reduce the amount of manual test to be done, which helps to reduce the
deployment lead time and is less error-prone.


### Pull our Andon Cord when the deployment pipeline breaks
*What*

The Andon Cord is a cord that exists on Toyota manufacturing lines.
When a worker has a problem on an item that can't be resolved in the
time allowed for the item to be in that work station, the worker should
pull the Andon Cord, which stops the whole manufacturing line, and
notify managers and other workers that there is a problem, so it can be
resolved as quickly as possible.

The equivalent in the software development world is to have an
automated alert sent to everyone when a production deployment pipeline
broke on any steps. If any tests were broken, new tests should be
implemented, so that future regression can be avoided.


*Why*
Letting everyone aware that the deployment pipeline is broken makes
sure that it is fixed as quickly as possible to keep everyone unblocked
and thus keeping the leading time low. It also allows everyone to learn
why it failed and how it was resolved, which empowers everyone to
potentially fix it in the future.


## Automate and Enable Low-Risk Releases

### Automate our deployment process
*What*

The deployment process should be as automated as possible. In an ideal
world, the pipeline should infer so much confidence that the number of
manual steps to deploy code would be 0. Examples of automated steps
include:
- Building and packaging code in ways suitable for deployment
- Restarting servers, applications, or services
- Generating configuration files from templates
- Running testing procedures

*Why*

Having automated deployment steps reduce the amount of manual human to
be done during the deployment. Consequently, it makes the deployment
more consistent throughout the organization, and less prone to
human error that could result in hard to detect/fix problems. Again,
it also means that the total deployment time is reduced, which means a
lower lead time.

### Decouple deployments from releases
*What*

In this context, a deployment is the installation of a given version of
a system onto a given environment. A release is when a set of features
is made available to the users of the system. There are many ways to
decouple one from another.

Blue/Green deployment: The goal of this deployment is to have two
production environments running at the same time, where one has the
change to introduce to the system. When the new environment is ready to
serve traffic, a router will redirect the traffic from the old
production environment to the new one. For example, in Kubernetes, this
can be achieved with a Deployment resource.

Canary deployment: A canary deployment builds on the blue/green
deployment. Instead of redirecting all at once the traffic from the
blue to the green environment, a canary deployment will gradually send
traffic to the new environment, based on many factors such as user
persona or randomness.

Implement feature toggles (a.k.a. feature flags): In this pattern,
there is only one production environment at a time. However, there are
some conditional statements in the application code that show variants
of a feature based on the state of the toggle for a given user (or
group of users).

*Why*

Decoupling deployment from releases allows new code and features to live
in real production environments. It allows another layer of confidence
and safety when releasing new features. For example, if a problem is
detected during a canary deployment at 1%, it means that probably at
most 1% of the users will be affected by this defect. The problem can
be fixed earlier, without any major disruptions. Furthermore, patterns
like the feature toggles allow easy rollbacks, or gracefully degrade
performance if problems arise (e.g. Netflix showing static
recommendations instead of personalized recommendations).