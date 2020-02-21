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

### Deployment Pipelines

### Automated Testing

### Continuous Integration

### Low-Risk Releases

## The Second Way: The Technical Practices of Feedback

### Telemetry

### Feedback on code deployment

### Hypothesis-Driven Development

### Code Review and Coordination

## The Third Way: The Technical Practices of Continual Learning and Experimentation

### Learning into Daily Work

### Convert Local Discoveries into Global Improvments

### Organizational Learning and Improvments
