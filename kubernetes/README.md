# Kubernetes in Action

Recently, I took some professional development days.
Since Kubernetes was a black box to me, I decided to dig into it.
I opened a ticket to order the book "Kubernetes in Action", published by Manning.
Then, I spent most of my time reading it.

This post is meant to be a high level view of Kubernetes, and its underlying architecture.
Also, I would hope that it could serve as an easy first entry to learning Kubernetes for those who don't know it.

## Table of content
* [What is it?](#what-is-it)
* [Building Blocks](#building-blocks)
  * [Container](#container)
  * [Pod](#pod)
  * [Node](#node)
  * [Cluster](#cluster)
* [Resources](#resources)
  * [Namespace](#namespace)
  * [Workloads](#workloads)
    * [Pod](#pod-1)
    * [ReplicaSet](#replicaset)
    * [Deployment](#deployment)
    * [Others](#others)
  * [Services](#services)
    * [Service (ClusterIP, NodePort, and Load Balancer)](#service)
    * [Ingress](#ingress)
  * [Config](#config)
    * [ConfigMap](#configmap)
    * [Secret](#secret)
* [Architecture](#architecture)
  * [Control Plane (a.k.a. master node)](#control-plane-aka-master-node)
    * [API Server](#api-server)
    * [etcd](#etcd)
    * [Scheduler/ Controller Manager](#scheduler--controller-manager)
  * [Worker Nodes](#worker-nodes)
    * [Kubelet / Container Runtime](#kubelet--container-runtime)
    * [Kubernetes Service Proxy (a.k.a. kube-proxy)](#kubernetes-service-proxy-aka-kube-proxy)
* [References](#references)

## What is it?

Moving from monolithic applications to a microservices architecture has many benefits: independent development and releases, granular scability, possibility to select the right technology for a problem, etc.
However, those benefits come at a price: the complexity of successfully managing all the services to have a performant and resiliant system.

Kubernetes is a platform that alleviates that complexity to make a microservice architecture easier to manage.

From Kubernetes' official website,

> Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications. It groups containers that make up an application into logical units for easy management and discovery.

Kubernetes relies on Linux containers to run heterogenous applications without having to know anything about the application internals.
This abstraction makes it easy to run multiple different applications on the same hardware.

Furthermore, the applications don't know anything about the underlying infrastructure. It is all abstracted away by Kubernetes. Thus, this simplifies development, deployment and management for the software teams.

## Building Blocks

Let's start by describing the logical building blocks of what compose a Kubernetes ensemble.

It starts with some containers, and goes all the way up to a cluster.

![Building Blocks](https://docs.google.com/drawings/d/e/2PACX-1vQXcxnzV0f-g0e9Q_XtuwdHYFFg7wmtsyQO_VsZBWyyCeJwXUY_3M5cBTjO85UWL9S0IfUuok-SDx5a/pub?w=643&h=633)

### Container

A container is a unit of software packaged with all the needed dependencies to run it.

![Container Diagram](https://docs.google.com/drawings/d/e/2PACX-1vSzE6SM-GPQvUcY6HZJ2K9kgRb9ndPv8a63k77VFgz0jlDXMKF_WYwg7Tyf9xcWJNxwUrUj_Gd19qEA/pub?w=263&h=311)

The most common container runtime is Docker, which is one of the runtimes supported by Kubernetes. rkt is an alternative to Docker, which is also supported by Kubernetes.

Docker gives the user the possibility to declaratively build an image of the container.
A Docker image is a model for a container.
It is then possible to create as many container as one wants based on that image.
Furthermore, it is possible to host an image on registeries over the Internet,
which thus makes container creation really easy.

The most known one is DockerHub. Google Cloud Platform also offers its own image registry: Google Cloud Registry.

### Pod

A Kubernetes pod is a group of 1 or more containers.

![Pod Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQsoPj5L9ab2o0ZgeNqLzYQhdSiu_KAs1dNaPhwopQjujnW1SNBhX5gvyFQ2iV4_20_nqdmflNolblp/pub?w=415&h=625)

Containers within a pod have their processes isolated (like every other container).
However, containers in a pod share their network namespace, i.e. they share the same IP address and the same port space.
The IP address is chosen by Kubernetes at creation time, and only stays around for the pod instance life.

A pod can contain more than 1 container. However, those should be tightly coupled together.
Usually, that means a "main" container which runs the application that the pod is meant for, along with sidecar containers that provide specific value (or add complementary functionality) to the main container.
Here, main is only a logical concept.

An example could be a nginx server that runs as the main container,
along with another container that is meant to fetch the website files from somewhere else.
Here, one container can't do much without the other.

A counter-example would be to have a frontend and backend container within the same pod.
In this case, one can definitely run without the other.
Those containers shouldn't really be coupled at that level. Maybe they don't need the same resources, or same availability.
It's impossible to scale one without scaling the other, which might be a problem.
In this case, it would be better separate the apps into two pods.

### Node

A node is a machine representation where a group of pods are running.

![Node Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQUI6h9QuTXPSfnJ0ehCORuNo6aknViuqi2Oan2L4a7gEajvKhv8L89qvnN8XJFSa6L-oZ7oPnjKZM5/pub?w=1517&h=851)

A pod can't live across two different nodes, i.e. have one container run in one node, and a second container in a different node.
All of a pod's containers are guaranteed to run in the same node.

### Cluster

A cluster is simply a group of nodes.

![Cluster Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRu7wUcEbgvU8kSli7Ye58hbXlqCUKsgXVnlk-IxbSQWUpBl3tVJOCWZFGc_VQp_t1_5e3lfu5BAOWM/pub?w=1770&h=1129)

The nodes can have differents computational resources, depending on what the system needs. They also can be in different data-centers, accross different regions.

## Resources

Almost everything that defines a Kubernetes clusters is represented by a resource.
The resources are managed by a single RESTful API server.
They represent the state of the cluster at any moment in time.
There are controllers that listen to a resource's CRUD operations at any time and execute actions accordingly to unify the actual state with the desired state.

That architecture makes Kubernetes declarative (instead of imperative), i.e. it only needs to be told what state the cluster should be in (and Kubernetes will take care of reconciliating it), instead of being told what to do in order to be in that state.

There are more details on Kubernetes architecture [further down](#architecture).

One last thing before jumping into individual resources, `kubectl` is a nice little CLI tool that can quickly expose documentation for each resources.
The command for it is `explain`.

For example,

```
kubectl explain pod
```

shows the documentation for the pod resource and its fields.

It is also possible to dig deeper in the doc.
If one wants to know more about pod spec, the command to run is the following:

```
kubectl explain pod.spec
```

### Namespace

Every single resource in the cluster is named. The namespace resource is used to group resources together in a non overlapping way. Therefore, all resources' names must be unique within a namespace. A different resource with the same name can exist in a different namespace.

![Namespace Diagram](https://docs.google.com/drawings/d/e/2PACX-1vTR7MCsBMEVbMBA9AQg-32kEKqNLHMdkK1sunii7x2Rb5fylYdhwYszPjYGEP2QqxReeIwnzGloRcVk/pub?w=1898&h=1014)

Kubernetes creates a default namespace, where all resources go if no namespace is specified upon resource creation.

Some resources are cluster-level resources, which means that they can't be in a namespace.
The namespace resource itself is a good example of a cluster-level resource (Kubernetes doesn't allow you to have a namespace resource within a namespace).
Nodes and persistent volumes are other examples of cluster-level resources.

### Workloads

Workloads is a logical group of resources that manages the life of pods. The most simple one is the pod resource itself. Let's take a look at a few of those resources.

#### Pod

The Pod is the atomic workload resource. As mentioned before, it runs one or more containers within it.

![Detailed Pod Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRO_zH_xjWw9SXZ9szPmCUtxYmg52Sj8TscNJ8dBBiAids0XFRFxxVu1NfRwEuGQNTph79P3cOuTpBy/pub?w=824&h=870)

In the Pod resource definition, it is possible to attribute many properties.
The metadata exposes information on the pod itself, like its name, namespace or labels.
The spec describes among other things which container to run, from which images to create them, or which volume to create.

Labels are part of the metadata section of the pod definition, and it is an important property for the pods.
It allows the user to organize the pods, in a potentially overlapping way.
Furthermore, it allows other resources to select pods based on those labels.

The ReplicaSet is one of such resource.

#### ReplicaSet

A ReplicaSet is a resource responsible for managing a group of pods. The main properties of that resources are the pod template (what each pod should be like), the pod selector (which pods are part of this set), and the replicas (how many pods should be running under that set).

![Replica Set Diagram](https://docs.google.com/drawings/d/e/2PACX-1vTCrgcAKk-InhOQPw84ULsK8Z0eioosmABeYZYDZzKa8gyY9vhwUr1mk0FYscNq7cAvxOHgyfSqyFS3/pub?w=991&h=1064)

The ReplicaSet watches for any pod changes. If, for any reason, the number of pods doesn't match the replica number (a pod crashed, a pod label changed, or the host node failed for example), the ReplicaSet will spin up a new pod automatically.

The ReplicaSet doesn't decide on which node the pod is created, nor its IP address.
It only cares about the number of pods running.
If the ReplicaSet replicas property would change (up or down), it would then command to create or kill the needed pods.

If the pod template would change, it doesn't affect the currently running pods under the ReplicaSet. The next time the ReplicaSet needs to create a pod, it would use the new template, which means that two versions of the pods could concurrently run under that ReplicaSet (which isn't ideal).

The Deployment resource alleviates that problem.

#### Deployment

The Deployment resource is almost the same as the ReplicaSet. It has a pod selector, a pod template and a replicas property.

![Deployment Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRUwVm0eMdmQVOkQ6WOR6kiMRP_lM1cBQgFixzWFAh-l5Ml2jPKRVgYXxx2tXzY-pFap4Q5_1ai6YzV/pub?w=4487&h=1709)

The difference resides in what happens when the pod template is updated.
In that scenario, the Deployment will create another ReplicaSet with the updated pod template.
That new ReplicaSet has its replicas property set to 0.
Then, it gradually increases the new ReplicaSet replicas number, while decreasing the old ReplicaSet replicas number to 0.

![Deployment Diagram - Rolling Update](https://docs.google.com/drawings/d/e/2PACX-1vTKew2mhzCXOMfBZOHCxyF3eOykFSL9h-PKkbj2RmrkkdlpOR7U4IiFdzSPiy3OwMUeQvVdKErcmm-i/pub?w=3325&h=1699)

Once the rolling update is done, the Deployment doesn't delete the old ReplicaSet. It is kept around, in case that a rollback is needed.

The Deployment defines also a Rolling Update Strategy. It is composed mainly of two properties: maxSurge and maxUnavailable.
The maxSurge property defines how many more pods than the desired number can run during the update.
The maxUnavailable property defines the opposite, i.e. how many fewer pods than the desired number can run during the update.

For example, if the maxSurge is set to 1 and maxUnavailable is set to 0 with a desired number set to 3, the rolling update will have at most 4 pods at any moment, and at least 3 at any moment.

#### Others

There are many other resources that can spin up new pods. Let's talk about a few of them.

*Job*

A Job is almost the same resource as a Pod.

Usually, a Pod needs to run continuously. When it fails, the general use case for it is to be brought back to life, usually by a ReplicaSet.

However, there are some cases where a pod would normally execute and terminate successfully.
In those cases, the pod shouldn't be restarted, since it was meant for a one time execution.
The Job resource was created especially for that purpose.

The Job will run a pod until it finishes successfully. If the pod fails for any reason (the node crashed, etc), it will reschedule it to run again.

Furthermore, it is possible to setup a job to run many times the pods, sequentially or concurrently (or both).

*CronJob*

A CronJob is the exact same thing as a Job, except for the fact that it is possible to schedule the running time of the pod in time.

At approximately the schedule time, the CronJob simply creates a Job resource, which in turn takes care of running the pod.

*DaemonSet*

The DaemonSet is a resource similar to the ReplicaSets. Instead of specifying the number of replicas to run, the DaemonSet makes sure that a single pod runs on every node in the cluster.

This is useful for example to monitor the node itself, or to run system wide operations.

### Services

As mentionned earlier, pods are assigned unpredictable IP address when they are created.
Then, how can one pod call another pod if it doesn't know its address?
Services is a resource type that takes care of that issue.

There are two main service resources: a Service (duh!) and an Ingress.

The common thing amongst all the services is that they map a group of pods to a stable IP address. Then, other pods can call the service IP, which then will redirect requests to a pod under its management.

#### Service

*ClusterIP*

The simplest Service resource is called a ClusterIP Service.

![Cluster IP Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRjzGBrjZTZmKlVyLvEYaKaXtjzcuQSGbfp7xh4M05rKKyFJuv7gXJTIjtU-d4JDVm7_zqfriqlK-30/pub?w=1397&h=945)

A ClusterIP service exposes an internal only IP address (i.e. can be called only from within the cluster internal network). When a handling a request, it redirects it to a random pod it manages.

The service uses the same labelling system the ReplicaSet uses. A pod selector is specified in the Service description. All pods with a matching label can receive a redirected request from that service.

One thing to mention is that the Service resource itself doesn't manage the pods' IP addresses under its wings. Another resource called Endpoints (note the plural) takes care of that.

The Endpoints resource can be created manually. When matched by name with a Service that doesn't specify a pod selector, it can be used to create a service that points to external services outside the cluster.

![Endpoints to external service](https://docs.google.com/drawings/d/e/2PACX-1vSdFY4W97DJuRz0agL_GG8SoYBZ2QiDqTSWQrj6pKiAx0xdOHhkRTr4roqS-LHuUFsmm73OvS0520Sb/pub?w=1870&h=1278)

*NodePort*

A ClusterIP service doesn't expose the service outside the cluster.
A NodePort service can.
That type of service listens to an open port on any node in the cluster.
Then, the request is redirected to a random pod under the service.

Since the nodes have an external IP address, the service is effectively exposed to external clients.

![NodePort Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vR_wFvaJUmfEOg8IwWwrmP_ZtVKblBl0pow7VuZj5kqdfXZYfO8YlUqY7xVtmI-3iZNnP_20UmR879b/pub?w=1929&h=1233)

One thing to note is that the client must know a node IP address.
It could be any nodes, even though the pod the request is directed to doesn't run on that node.
Also, this type of service requires to configure the cluster firewall to have the right ports open on every node.

*Load Balancer*

A Load Balancer Service is almost the same thing as a NodePort service. In fact, it is just an extension of it.

![Load Balancer Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRZTBO7-f7i0H_eMZVPZDPnGt0kG-i1i0d3En71GXXwsS3TsHdYqaGyg712HQ_vEUDnxEPrkljxrqQc/pub?w=1806&h=1226)

Instead of having the clients call the nodes directly, that service uses a load balancer in front of the nodes. Thus, the client needs to know only one IP address, instead of individual node IP.
Furthermore, it makes sure that the service load is evenly distributed amongst all nodes.

#### Ingress

When there are many different services exposed externally, it can become hard to manage all the load-balancer's IP addresses.

An Ingress is a resources that sits in front of many other services.
It operates at the L7 (application layer) of the network stack.
That means that it can redirect requests based on either the request domain, or the request path for example.

![Ingress Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ5gIevkt6uJntEbEBWg0sIMOD8m6dBw6EJ-x0X4jdvRJuvK0b-LegHQY2VofHJrjObNKRUCdvQn4X_/pub?w=2003&h=823)

To make the Ingress resources work, it needs a Ingress controller. For example, GKE uses Google Cloud Platform's own HTTP load-balancing features to provide the Ingress functionality.

With the correct set of rules, it would be possible to have a single Ingress resource that act as an entry point to all the services within the cluster.

### Config

Almost every application needs some configuration.
Usually, we don't want that configuration hard-coded in the application itself.
Kubernetes defines two resources to help passing configurations to applications: ConfigMaps and Secrets.

#### ConfigMap
A ConfigMap resource is simply a list of key-value pairs.
It can be passed in the pod either by environment variable or by a mounted volume.

![Config Map Diagram](https://docs.google.com/drawings/d/e/2PACX-1vT6vIlztG8iSEWAFlBpM1AZOBl4ZvBPiSEJRO9FXXB0bBkOjeCt_T74vpkSpXkydRC4N7Mk4KdxT7mw/pub?w=927&h=628)

Therefore, ConfigMaps allow decoupling the pod configuration from the pod definition.
In other words, it means that two pods can share the same definition, but different configurations, like staging vs production configurations for example.

Another potential advantage of using ConfigMap with a referenced mounted volume is that the configuration could be updated in runtime without restarting the app (although it could be quite slow).

#### Secret

A Secret resource is the exact same concept as a ConfigMap, except it is used for sensitive data configuration.
One big difference with ConfigMap is that Secrets are stored encrypted on the Kubernetes' Control Plane (the etcd storage).

Also, having a different resource type means that it's possible to have different access restrictions regarding different users (typically having Secrets be more restricted obviously than ConfigMaps).

## Architecture

Now that a we know a bit more about what Kubernetes can do, let's take a look on how it works under the hood.

![Overall Architecture Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQCYKzEwsN1q74BkfHv85o6bsE_1gSigon8mHLn9Yf7A4bIYEV0PRT0Y5GT97_Sss-i51NL9LwJysC0/pub?w=1416&h=778)

Kubernetes' architecture consists of a Control Plane and worker nodes (or plainly, the nodes). Some system applications are also running on the worker nodes.

### Control Plane (a.k.a. Master Node)

The Control Plane consists of an API service, an etcd database, a scheduler and a controller manager. Let's take a more detailed look at each of those elements.

#### API Server

The API Server is the focal point of the Control Plane.
It is simply a RESTful API server that takes care of managing all the Kubernetes resources (basic CRUD operations).
It also offers a "watch" functionality, so take clients can listen on resources updates they care about.

#### etcd

Resources needs to be persistently stored somewhere.
That is where etcd comes in.

From [CoreOS website](https://coreos.com/etcd/):

> etcd is a distributed key value store that provides a reliable way to store data across a cluster of machines.

The API Server stores all the resources directly in etcd, and is the only part of the system that has access to it.

#### Scheduler / Controller Manager

Having a simple CRUD server without doing anything with that data wouldn't do much work.
Various controllers exist to run reconciliation tasks to make sure the desired state reflects the actual cluster state.

Those controllers are run in the Controller Manager.
For example, when the ReplicaSet controller picks up new/updated ReplicaSet, it create the necessary Pod resources accordingly.
That specific controller doesn't create the actual Pod, only the Pod resources.
Creating the actual pods is made by another component in the system, in response of a new/updated Pod resources.

The Scheduler is a specific type of controller that takes care of choosing on which node each pod should run.
It listens on Pod resource creation.
When it happens, the Scheduler finds all the nodes that can accept the Pod (based on resources management, or affinity for example), prioritizes those nodes and choose the best one.
Then, it updates the Pod resource to indicates which node it should run on.

There is almost a controller for every type of resource creatable. Furthermore, every controller's job is really scoped to the resource it's controlling. It makes the controller loosely coupled from one another.

### Worker Nodes

The API server and the controllers are at the heart of the Control Plane. However, some system components must also run on each of the worker nodes, namely the Kubernetes Service Proxy and the Kubelet.

#### Kubelet / Container Runtime

The Kubelet is responsible for everything running on the worker nodes, but
the main responsibility is to manage the life of containers on the node.

When a pod is scheduled on a node, Kubelet gets notified and actually starts the container by using the configured container runtime (Docker, etc).
Also, Kubelet is responsible for monitoring the health of the pods, either by running liveness and readiness probes, or by watching computational resource consumption.
It also stops the container when the corresponding pod resource gets deleted from the API server.

Finally, the Kubelet is also responsible for registering the node to the cluster by creating a Node resource on the API server.

#### Kubernetes Service Proxy (a.k.a. kube-proxy)

Besides the Kubelet, every node also runs the Kubernetes Service Proxy.

The main responsibility of this component is to handle services correctly, so that clients can connect correctly to the associated pods.
The kube-proxy acheives that by listening to the Service and Enpoints resources, and updating the node's iptables rules accordingly.

## References

- Marko Luksa, "Kubernetes in Action", Manning Publications, 2018
