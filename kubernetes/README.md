# Kubernetes in Action

## What is it?

## Building Blocks

Let's start by describing the logical building blocks of what compose a Kubernetes ensemble.

It starts with some containers, and goes all the way up to a cluster.

![Building Blocks](https://docs.google.com/drawings/d/e/2PACX-1vQXcxnzV0f-g0e9Q_XtuwdHYFFg7wmtsyQO_VsZBWyyCeJwXUY_3M5cBTjO85UWL9S0IfUuok-SDx5a/pub?w=643&h=633)

### Container

A container is a unit of software packaged with all the needed dependencies to run it.

![Container Diagram](https://docs.google.com/drawings/d/e/2PACX-1vSzE6SM-GPQvUcY6HZJ2K9kgRb9ndPv8a63k77VFgz0jlDXMKF_WYwg7Tyf9xcWJNxwUrUj_Gd19qEA/pub?w=263&h=311)

The most common container runtime is Docker, which is one of the runtime supported by Kubernetes (rkt is an alternative to Docker, which is also supported by Kubernetes).

Docker gives the possibility to the user to build declaratively an image of the container.
A Docker image is a model for a container. It is then possible to create as many container as one want based on that image. Furthermore, it is possible to host an image on registeries over the Internet, which thus makes container creation really easy.

The most known one is DockerHub. Google Cloud Platform offers also its own image registry: Google Cloud Registry.

### Pod

![Pod Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQsoPj5L9ab2o0ZgeNqLzYQhdSiu_KAs1dNaPhwopQjujnW1SNBhX5gvyFQ2iV4_20_nqdmflNolblp/pub?w=415&h=625)


### Node

![Node Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQUI6h9QuTXPSfnJ0ehCORuNo6aknViuqi2Oan2L4a7gEajvKhv8L89qvnN8XJFSa6L-oZ7oPnjKZM5/pub?w=1517&h=851)
### Cluster

![Cluster Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRu7wUcEbgvU8kSli7Ye58hbXlqCUKsgXVnlk-IxbSQWUpBl3tVJOCWZFGc_VQp_t1_5e3lfu5BAOWM/pub?w=1770&h=1129)

## Resources

### Namespaces

![Namespace Diagram](https://docs.google.com/drawings/d/e/2PACX-1vTR7MCsBMEVbMBA9AQg-32kEKqNLHMdkK1sunii7x2Rb5fylYdhwYszPjYGEP2QqxReeIwnzGloRcVk/pub?w=1898&h=1014)

### Workloads

#### Pod

![Detailed Pod Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRO_zH_xjWw9SXZ9szPmCUtxYmg52Sj8TscNJ8dBBiAids0XFRFxxVu1NfRwEuGQNTph79P3cOuTpBy/pub?w=824&h=870)

#### ReplicaSet

![Replica Set Diagram](https://docs.google.com/drawings/d/e/2PACX-1vTCrgcAKk-InhOQPw84ULsK8Z0eioosmABeYZYDZzKa8gyY9vhwUr1mk0FYscNq7cAvxOHgyfSqyFS3/pub?w=991&h=1064)

#### Deployment

![Deployment Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRUwVm0eMdmQVOkQ6WOR6kiMRP_lM1cBQgFixzWFAh-l5Ml2jPKRVgYXxx2tXzY-pFap4Q5_1ai6YzV/pub?w=4487&h=1709)

![Deployment Diagram - Rolling Update](https://docs.google.com/drawings/d/e/2PACX-1vTKew2mhzCXOMfBZOHCxyF3eOykFSL9h-PKkbj2RmrkkdlpOR7U4IiFdzSPiy3OwMUeQvVdKErcmm-i/pub?w=3325&h=1699)

#### Other
- Job
- CronJob
- DaemonSet
- StatefulSet

### Services

#### Service

*ClusterIp*

![Cluster IP Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRjzGBrjZTZmKlVyLvEYaKaXtjzcuQSGbfp7xh4M05rKKyFJuv7gXJTIjtU-d4JDVm7_zqfriqlK-30/pub?w=1397&h=945)

![Endpoints to external service](https://docs.google.com/drawings/d/e/2PACX-1vSdFY4W97DJuRz0agL_GG8SoYBZ2QiDqTSWQrj6pKiAx0xdOHhkRTr4roqS-LHuUFsmm73OvS0520Sb/pub?w=1870&h=1278)

*NodePort*

![NodePort Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vR_wFvaJUmfEOg8IwWwrmP_ZtVKblBl0pow7VuZj5kqdfXZYfO8YlUqY7xVtmI-3iZNnP_20UmR879b/pub?w=1929&h=1233)

*Load Balancer*

![Load Balancer Service Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRZTBO7-f7i0H_eMZVPZDPnGt0kG-i1i0d3En71GXXwsS3TsHdYqaGyg712HQ_vEUDnxEPrkljxrqQc/pub?w=1806&h=1226)


#### Ingress

![Ingress Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQ5gIevkt6uJntEbEBWg0sIMOD8m6dBw6EJ-x0X4jdvRJuvK0b-LegHQY2VofHJrjObNKRUCdvQn4X_/pub?w=2003&h=823)

### Config

#### ConfigMap

![Config Map Diagram](https://docs.google.com/drawings/d/e/2PACX-1vT6vIlztG8iSEWAFlBpM1AZOBl4ZvBPiSEJRO9FXXB0bBkOjeCt_T74vpkSpXkydRC4N7Mk4KdxT7mw/pub?w=927&h=628)

#### Secrets

### Storage

#### PersistentVolume

#### PersistentVolumeClaim

#### StorageClass

### Scaling

#### HorizontalAutoScaler

### Security

#### ServiceAccount

## Architecture

![Overall Architecture Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQCYKzEwsN1q74BkfHv85o6bsE_1gSigon8mHLn9Yf7A4bIYEV0PRT0Y5GT97_Sss-i51NL9LwJysC0/pub?w=1416&h=778)

### Control Plane (a.k.a. Master Node)

#### ApiServer

#### etcd

#### Scheduler / Controller Manager

### Worker Nodes

#### Kubernetes Service Proxy (a.k.a. kube-proxy)

#### Kubelet

#### Container Runtime

## References

- Marko Luksa, "Kubernetes in Action", Manning Publications, 2018