# DevOps 101

DevOps (portmanteau for [Software] Development and [Information
Technology] Operations) is a set of practices designed to shorten the
development cycle and increase the software quality.

I heard the term before, like probably the majority of software
developers in the industry. However, I realized that I was not really
knowledgeable in the subject.

> **Wait, DevOps isn't only about continous deployment?**
>
> *Me, right before doing this.*

It's much more than that.

## The DevOps Handbook

The DevOps term was coined by Patrick Debois in 2009, after watching a
conference presentation named "10 Deploys per Day: Dev and Ops
Cooperation at Flickr". He then organized the first DevOpsDays in
Belgium. The DevOps movement was born. That movement is a continuity of
the Agile movement (set of values and principles designed to deliver
working software frequently) in early 2000s, and the Lean movement
(techniques to measure and understand manufacturing lead time, which is
a great predicator of product quality and customer satifaction) in the
1980s.

Debois and some of his peers (Gene Kim, Jez Humble and John Willis)
decided to write the DevOps handbook, where its purpose is "... to give
you the theory, principles, and practices to successfully start your
DevOps initiative and achieve your desired outcomes".


![DevOpsHandbook](https://images-na.ssl-images-amazon.com/images/I/81B4f4soNAL.jpg)

This post is a summary of The Three Ways of DevOps, as defined in that
handbook. It is meant as a rough introduction to some DevOps practices,
and why they matter.

## The Three Ways

A value stream is a concept coming from the Lean movement. It is the
sequence of activities to perform in order to take a customer/business
request and delivering the value.

In software development, the value stream looks ressembles to something
like a product owner captures the next most important business idea to
be developed, transforms it into user stories, which are then picked up
by developers, implemented, integrated, and delivered to the rest of
the system in production.

DevOps practices focus on the deployment lead time, which is the time
from when the developers check in their code to when it is delivered in
production. The handbook authors define an ideal deployment lead time
in the order of minutes.

In order to enable that short lead time, three ways are defined, where
one builds on the previous one. The first one defines **technical
practices of flow**. Those practices are meant to ship code in a fast,
confident way, in order that have a maximal flow. A great flow means
that the customers gets what they want earlier, which is good for the
business.

The second way defines the **technical practices of feedback**. Once a
good flow is established, practices of feeback from all steps of the
stream will help to improve the quality of the work delivered, improve
the time to detect and recover from problems and improve even more the
deployment flow.

The last way defines the **technical practices of continual learning
and experimentations**. Learning from success and failures is crucial
to improving the quality of work. Furthermore, when the flow and the
feedback loop are short and strong, it is easier and safer to
experiment and take calculated risks. Ultimately, that fast learning
and experimentations help do outdo the competition and win in the
marketplace.

## The First Way: The Technical Practices of Flow

### Basics

#### Make our work visible
*What*

Contrary to manufaturing, work in software development is invisible by
nature. However, it can be made visible by creating physical or virtual
board. On that board, all the steps of the value stream should be
present as columns. Then, each work piece resides on the corresponding
column representing its state in the stream.

*Why*

First, it helps to define a technical value stream, and makes everyone
involved on the same page. Furthermore, the work in progress is easy to
understand at a glance. Finally, it's easier to calculate the lead
time, which is the time it is put on the board up to the time it is
placed on the last column.

#### Limit the work in progress
*What*

Limiting the work in progress is establishing and enforcing a limit on
the amount of work cards in each of the work column.

*Why*

Limiting the work in progress helps reduce the lead time of the work by
focusing on work that already has been started. Furthermore, it helps
to see problems in the value stream, e.g. where in the stream do the
work get stuck, and why.

#### Reduce batch size
*What*

Reducing batch size means to have small units of work that can go
through all the stream at once and be delivered independently.

*Why*

It reduces the risks of delivering the wrong work, or defectuous work.
Furthermore, it decreases the lead time, since the amount of work is
smaller. That allows the customers see value faster.


### Create the foundations of Our Deployment Pipeline

#### Enable on demand creation of dev, test, and production environments
*What*

Ideally, developers should develop their code locally in the exact same
environment than in production. Instead of only documenting how the
production environment consists of, it is better to create a build
mechanisms to create in minutes any environment on demand. This can be
achieve in many ways, such as using virtual images and containers (like
Docker), or using infrastructure as code configuration management tools
(like Puppet, Chef, etc) for example.

*Why*

Having a separate yet identical environment, a developer can quickly
and safely develop new code, can reproduce, diagnose and fix defects,
can experiments on infrastructure code that creates the environment.


#### Make infrastructure easier to rebuild than to repair
*What*

The key to have an infrastructure easy to build is to have all
configuration in version control. Thus, it becomes the source of truth
for the automated build mechanism to replicate every configuration
everywhere.

*Why*

When the infrastructure is easy and quick to rebuild, we can rely on
the the build mechanism to ensure environment consistency across all
machines/containers. If any manual configuration change is done on a
production environment, it'll be lost when a new environment is created
Thus, no variance is able to creep in production, which allows a more
stable and controlled environment.


#### Modify our definition of done to include running in production-like environment
*What*

Before some work can be consider done, we must have integrated, tested,
and working code, where all of this is demonstrated in a
production-like environment.

*Why*

It prevents having problems all the way to production. When caught
early, problems are much easier and quicker to fix, and cause no
disruption to customers. Furthermore, it increase the confidence of
delivering quality work to production.

### Enable Fast and Reliable Automated Testing

#### Build a fast a reliable automated validation test suite
*What*

To have a high level of confidence about the work done, it should be
validated with automated tests. There are many types of tests that
should be implemented, all of which serves a specific purpose.

Unit test: Small and fast test that verifies that a single function works properly in isolation. This proves to the developer that the code
behaves as it was designed. External dependencies (api, databases)
should be stubbed out, so the tests can remain small and fast to run.

Acceptance test: Test that make sure that the application as a whole
runs as intendend, and that regression erros have not been introduced.
The difference between acceptance and unit test is the point of view.
The acceptance test should prove that the code works as the customer/
business wants it (and not the developer).

Integration test: Test that make sure that the system works well as a
whole, i.e. with real application and services, and not stubbed out
interfaces. By nature, it'll probably take more time to run than unit
or acceptance test, but will reflect more closely the production
environment, which make sure that we can catch errors earlier.

Whenever an error is caught in an acceptance or integration test, a
unit test should be created to make sure that the error is caught
earlier in the process.

*Why*

Having tests in general make sure that we have the confidence that the
new code works as intended and that it *should* not introduce problems
with the existing code. Furthermore, having multiple kind of tests
increases that confidence to many levels in the system, like the
business logic works and is preserved, and that the integration between
multiple service still remains. Furthermore, having automated tests
reduce the amount of manual test to be done, which helps to reduce the
deployment lead time.


#### Pull our Andon Cord when the deployment pipeline breaks
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


### Automate and Enable Low-Risk Releases

#### Automate our deployment process
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
human-error that could result into hard to detect/fix problems. Again,
it also means that the total deployment time is reduced, which means a
lower lead time.

#### Decouple deployments from releases
*What*

In this context, a deployment is the installation of a given version of a system onto a given environment. A release is when a set of features is made available to the users of the system. There are many ways to decouple one from another.

Blue/Green deployment: The goal of this deployment is to have two production environments running at the same time, where one has the change to introduce to the system. When the new environment is ready to serve traffic, a router will redirect the traffic from the old production environment to the new one. For example, in Kubernetes, this can be achieved with a Deployment resource.

Canary deployment: A canary deployment builds on the blue/green deployment. Instead of redirecting all at once the traffic from the blue to the green environment, a canary deployment will gradually send traffic to the new environment, based on many factors such as user persona or randomness.

Implement feature toggles (a.k.a. feature flags): In this pattern, there is only one production environment at a time. However, there are some conditional statements in the application code that show variant of a features based on the state of the toggle for a given user (or group of users).

*Why*

Decoupling deployment from releases allows new code and feature to live
on real production environments. It allows another layer of confidence
and safety when releasing new features. For example, if a problem is
detected during a canary deployment at 1%, it means that probably at
most 1% of the users will be affected by this defect. The problem can
be fixed earlier, without any major disruption. Furthermore, patterns
like the feature toggles allows easy rollbacks, or gracefully degrade
performance if problems arise (e.g. Netflix showing static
recommendations instead of personalized recommendations).

## The Second Way: The Technical Practices of Feedback

### Telemetry

### Feedback on code deployment

### Hypothesis-Driven Development

### Code Review and Coordination

## The Third Way: The Technical Practices of Continual Learning and Experimentation

### Learning into Daily Work

### Convert Local Discoveries into Global Improvments

### Organizational Learning and Improvments
