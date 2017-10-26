# Exploration of Netlify

Netlify is a platform designed to host front-end applications.
From Netlify's [website](https://www.netlify.com/):
>Write frontend code. Push it. We handle the rest.

>Netlify is a unified platform that automates your code to create high-performant,
>easily maintainable sites and web apps.
>Simply push your code and let us take care of the rest.

For my hackathon project, I decided to explore this platform to learn what
it can and cannot do.

I created an Angular 2 application with the Angular CLI utility,
and used this application to be hosted on the Netlify platform.

## Overview

The Netlify's main feature is linking some code repository with
the platorm and then build, deploy and publish the application
each time some code is pushed to the repository. Thus,
the deployment/publish process is very streamlined.
The platorm takes care of building the application and serving it online.

### Key features

#### Build and Deploy
* Multiple source repositories: GitHub, GitLab, Bitbucket
* Specify production branch
* Specify build command
* Specify publish directory
* Set up environment variables
* Build hooks to trigger a build
* Pre-rendering (for single page apps)
* Snippet injection and asset optimization
* Deploy notifications: Slack, webhook, email, GitHub commit status, GitHub PR comments
* Split testing from multiple branches

#### Domain Management
* Ability to choose application name (under the `*.netlify.com` domain)
* Custom Domain and domain aliases
* One-click SSL Certificate (with Let's Encrypt)
* Force HTTPS
* DNS Management

#### Forms
* Collect data from forms in application
* Set up outgoing notification: Slack, webhook, email
* Export collected data to CSV

#### Access Control
Note that access control features are only for paid plans.

* Password protection
* Role bases access controls with JWT tokens

## Deployment

From all the features available on the platform,
I think that Deployment/Publishing is really the one that shines.

### Setup
Creating a website on Netlify is really easy. There are two methods:
1. Drag & Drop
2. Create from Git

#### Drag & Drop
The Drag & Drop method is nice and easy. You drop the website files
and then your website is live online. There's nothing else to do.
However, dropping the files each time one needs to update the website
can be tedious and annoying.

#### Git
Creating a website from a Git repository is more practical.
The only thing to setup is the repository URL and the default branch
(let's say `master`) to be on production. Upon creation, Netlify
deploys and publishes the application at the head of `master`.
To publish subsequent versions, one simply needs to push new code to `master` on GitHub.

![Create new site](https://i.imgur.com/6ICrCzel.png)

This enables a great development workflow. Development happens in a feature branch.
When it is ready to be released, the feature branch is simply merged into `master`
and Netlify automatically builds, deploys and publishes the application.

![Production deploys](https://i.imgur.com/3yGHeKPl.png?1)

In fact, Netlify creates 'Deploys' for every new push in every available branch.
A deploy is a snapshot of the application for a given commit hash. Netlify doesn't
create a deploy for each individual commit, but creates one each time code
is pushed to GitHub.


Each deploy begins by building the application code. Again, one simply needs
to supply the build command to be executed by Netlify. Node, Ruby and
Python environments are supported. Netlify also manages dependencies
(assuming that dependencies files are provided, e.g. package.json, Gemfile,
requirements.txt). Furthermore, it caches the dependencies for a faster
build time for subsequent builds (assuming the dependencies don't change).
For the Angular 2 application that I created, I set the build command to
`npm run build:prod`, which was mapped to `ng build --target=production --aot`.

Depending on the build tool, the build output could be in different folder.
Thus, Netlify lets the user specify the publish directory. In my test
application, I set this directory to `dist`, since it's the Angular CLI
default output destination.

![Deploy settings](https://i.imgur.com/U8ixR6Ul.png)

Moreover, Netlify lets the user defines some environment variables which will
be available during build time. It also exposes some pre-defined environment
variables, e.g. `REPOSITORY_URL`, `BRANCH`, `PULL_REQUEST`, etc.

### Continous Deployment
Once the application is set up, deploying a new version is as simple as
pushing new code to GitHub. As mentionned above, each push on each branch
will create a deploy on Netlify. There are three deploy contexts defined
in Netlify: Production, Branch Deploy and Deploy Previews.

![All Deploys](https://i.imgur.com/Eeqkm6Rl.png)

However, only the deploys from the production context (deploy from `master`
in the example) will be published. The auto-publish feature can be turn off
in the dashboard. Then, the user will have to manually publish any desired deploys.

![Deploy Dashboard](https://i.imgur.com/8dnTvY8l.png)

In any cases, the user can publish any deploy living on Netlify. That means
that every deploy created from any branch can be published into production by a
click of a button. Publishing a deploy into production is a matter of seconds.
For example, if there was a bad push into production, a Netlify user can roll
it back by publishing the previous version to have a clean application in
production while the problem is being fixed.

![Deploy not published](https://i.imgur.com/gVgwrlZl.png)

At any given time, there will be only one deploy published in production.
However, each individual deploy is also hosted online. Netlify exposes those
deploys by specifying a prefix in the URL for each of them. For example,
individual deploy can be accessed by prefixing the commit hash in the URL;
deploys referring to a branch's head can also be access by prefixing the
branch name in the URL; deploys referred in a pull request can be accessed
by prefixing 'deploy-preview-' + *pull request number* in the URL. Moreover,
a Netlify user can simply click the 'Preview deploy' to preview the a deploy.

### Deploy Previews

Each time there a pull request against the production branch, Netlify
creates another deploy called 'Deploy Previews'. There is a 1:1 mapping
between deploy previews and pull requests on the repository. Netlify also
integrates with GitHub to expose a link (within the pull request's page) to
the preview version. That means that the reviewer can see an actual live
preview for the pull request, which gives a good context to give meaningful
comments.

![GitHub deploy preview](https://i.imgur.com/X76Wbl4l.png)

## Other features
I think the following features are not as meaningful as the deployment feature, but still worth mentionning.

### Split Testing
From the [docs](https://www.netlify.com/docs/split-testing/):
>Netlify’s Split Testing lets you divide traffic to your site
>between different deploys, straight from our CDN network, without losing
>any download performance, and without installing any third party JavaScript library.

![Split testing](https://i.imgur.com/e4NzPsEl.png)

Split testing takes advantages of having different branches on GitHub.
As mentionned earlier, Netlify builds deploy for each individual branch in
the repository. Thus, the Netlify user only needs to specify which branches
are part of the split testing, along with the distribution of traffic (in %)
amongst those branches.

However, there is no way to determine which users will be served which version.

### Forms
Netlify can receive submissions from any forms living in the website.
For each deploy, there is a post-processing bots that looks for a
`netlify` attribute within a `form` tag. Then, it exposes the found
forms in the Netlify dashboard. Netlify keeps every submissions on the
platform. The submissions can be exported into a CSV file.

Furthermore, notifications can be created for each submissions received.
Netlify supports Slack messages, webhooks and emails notifications.

However, applications that are using frameworks that renders HTML dynamically,
like Angular or React, will have to implement some workarounds to
get the handling working (see this [blog post](https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/) for a React example).

### REST API

Netlify exposes a great number of endpoints to manage the platform
programmatically.  Almost every Netlify resources are available from that
API: sites, deploys, forms, hooks, etc.

All API must be over HTTPS, authenticated with a OAuth2 token.


## Conclusion

I think that Netlify created a nice platform where deploying and publishing code
is really easy. I like very much the idea of having every deploy hosted online
and be accessible at all time.

Also, it is very nice to have a live demo for a pull request. It gives the
reviewers a possibility to play around the application and see the new
feature before being published.

Netlify is a really good platform for web applications that aren't supported
by backend server (or at most a really simple backend).

However, I don't think it scales well with a big and complex backend architecture.
I mean scaling not in term of performance, but in term of integration with the
other components in the architecture. Furthermore, adding another vendor to the
suite might be difficult, or might be a turn-off for some, especially when
big cloud platforms like Google Cloud Platform or Amazon Web Services fill
out almost every needs.

## References
1. https://www.netlify.com/
1. https://www.netlify.com/docs/continuous-deployment/
1. https://www.netlify.com/docs/build-settings/
1. https://www.netlify.com/docs/api/
1. https://www.netlify.com/docs/form-handling/
1. https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/