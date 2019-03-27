# Kubernetes in Action

## What is it?

## Building Blocks

### Container

![Container Diagram](https://docs.google.com/drawings/d/e/2PACX-1vSzE6SM-GPQvUcY6HZJ2K9kgRb9ndPv8a63k77VFgz0jlDXMKF_WYwg7Tyf9xcWJNxwUrUj_Gd19qEA/pub?w=263&h=311)

### Pod

![Pod Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQsoPj5L9ab2o0ZgeNqLzYQhdSiu_KAs1dNaPhwopQjujnW1SNBhX5gvyFQ2iV4_20_nqdmflNolblp/pub?w=415&h=625)


### Node

![Node Diagram](https://docs.google.com/drawings/d/e/2PACX-1vQUI6h9QuTXPSfnJ0ehCORuNo6aknViuqi2Oan2L4a7gEajvKhv8L89qvnN8XJFSa6L-oZ7oPnjKZM5/pub?w=1517&h=851)
### Cluster

![Cluster Diagram](https://docs.google.com/drawings/d/e/2PACX-1vRu7wUcEbgvU8kSli7Ye58hbXlqCUKsgXVnlk-IxbSQWUpBl3tVJOCWZFGc_VQp_t1_5e3lfu5BAOWM/pub?w=1770&h=1129)

## Resources

### Namespaces

### Workloads

#### Pod

#### ReplicaSet

#### Deployment

#### Other
- Job
- CronJob
- DaemonSet
- StatefulSet

### Services

#### Service

- ClusterIp
- NodePort
- LoadBalancer

#### Ingress

### Config

#### Secrets

#### ConfigMap

### Storage

#### PersistentVolume

#### PersistentVolumeClaim

#### StorageClass

### Scaling

#### HorizontalAutoScaler

### Security

#### ServiceAccount


## Architecture

### Control Plane (a.k.a. Master Node)

#### ApiServer

#### etcd

#### Scheduler / Controller Manager

### Worker Nodes

#### Container Runtime

#### Kubelet

#### Kubernetes Service Proxy (a.k.a. kube-proxy)

## References

- Marko Luksa, "Kubernetes in Action", Manning Publication, 2018