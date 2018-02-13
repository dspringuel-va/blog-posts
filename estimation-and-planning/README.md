# Research on estimation and planning

This is a post on research that I did about R&D's estimation and planning process for hackathon in Feb 2018.

## Motivations
There has been a few things that bothered me for a while now related to our estimation and planning process in R&D.

### Having only three estimate size doesn't feel enough
### I don't feel that the actual number estimates are really useful
### Off-time (vacation, sick days, hackathon) doesn't seem to be considered in the planning

## Goals
### Understand better how we use estimation and planning in R&D
### Find a way to have more meaningful estimates
### Find a way to have better confidence in roadmaps (timeline wise)

## Actions
To achieve the previous goals, I planned to do the following actions

- Read the book [*Agile Estimating and Planning*](https://www.mountaingoatsoftware.com/books/agile-estimating-and-planning) by Mike Cohn
- Interview some of our product managers
- Experiments with possible workflows

## How it went

### The book
![Agile Estimating and Planning](https://www.mountaingoatsoftware.com/uploads/reviews/agile-estimating-planning-cover.jpg)

First, I read the book. Actually, I was done reading it before hackathon. The book contains section on estimation sizes, planning for value, scheduling and tracking/communication.

At the beginning, the author states that the estimations for stories work better when they reflect their abstract sizes relative to one another. For example, a story estimated at 4 points should be about twice the amount of work as a story estimated at 2 points. Here, the key notion is the estimation represents the *amount of work* to do, not how much time it would take to complete the story. That approach removes the uncertainty related to time in the estimation and keeps only the uncertainty related to the work itself.

The author also talks about planning and scheduling. The planning part gives ways to plan a block of stories focusing on value, either by themes, by some financial measures or by desirability. He also talks about how splitting user stories might help the planning.

The next point is scheduling the release planning and the iteration planning. The release planning should be pretty straigtforward: Sum of the wanted stories divided by a velocity yields how many iterations are needed. The author also talks about techniques for estimating velocity (use historical values, run a iteration or make a forecast). Furthermore, he talks about how to calculate buffers to plan for uncertainty.

Then, the author gives examples on how to track and communicate progress on both release and iteration plans, like task boards or burdown charts.

Finally, the books ends with reasons on why agile estimating and planning works. To name a few
- Replanning occurs frequently
- Estimate of size and duration are separated
- Plans are based on features, not tasks
- Uncertainty is acknowledged and planned for

Overall, I think this is a good book. The author raised some valid points and I was eager to try applying them in our process.

### Interview with some PMs

I interviewed three PM during the first half of hackathon. I asked questions that were aligned with themes of the books:

- Estimations
  - What do you use estimations for?
  - What do like/dislike about estimations?
- Planning
  - What do you like about release planning and/or roadmapping?
  - What are the blockers related to planning?
- Tracking and communication
  - *Questions about tools (Pivotal, Jira)*
  - Do you think burdown charts (either for release or iteration planning) would help?
  - Do you think tracking various metric would help he process in general?


### Experiments
For the first half of hackathon, I experimented with workflows to help to automatically plan the release and track some metrics.

I also tested some workflows for iteration planning and tracking by implementing an automatic iteration burndown chart.

Those experiments were done in Google Spreadsheets with custom Google Script functions.


## Realizations

![Oh Boy](https://i.imgur.com/89HANHg.gif)

Oh boy...

After the first interview, I remember thinking *"This is way harder than expected. How to propose a potentially better process that still fits people needs?"*. The answers I got were not greatly aligned with what I envisionned (which in turn are more aligned with the concepts proposed in the book).

When I was done interview the third PM, I started realizing something: Estimation and planning might not be as important as I think it is. All PM's answer (relatively) aligned with that statement. They're not all from the same division and they all have different background, but they still answer somewhat the same thing:

>The estimations should be fairly lightweight and be used to help for sprint planning. The release planning/roadmap are there to have rough understanding of what is coming up within the next few months, knowing that it's very likely to change.

At that point, I started to feel that I wasn't focusing on the right thing. Maybe that a process that yields more accurate estimation and planning is not the most useful thing for R&D. It doesn't matter if you nailed the estimations and the plan if you deliver software that doesn't add value for customers.

The focus becomes *what* stories to deliver, not *when* to deliver them. In an agile environment, short development-feedback cycle is favored over mid to long term releases. In this environment, everything changes so fast that maintaining a relatively precise time would be too much work to be worth it.

Thus, I realized why the estimations are very light weight and why the release planning don't need to be very precise. It's because the most critical part (and possibly the hardest) is to find and prioritize the stories to deliver value as fast as possible.


## Return on goals

After this research, I can say I understand more about how we use estimation and planning. I know that continuously delivering actual value as fast as possible is (and should be) the number 1 priority.

One consequence from that statement is that estimates are not as critical as it seemed to me. The amount of work required to be more meaningful in this short cycle time is simply not worth it. It is simply used to roughly gauge if a team has enough defined work for the very next sprint or if more stories need to be refined. With that in mind, I think that our current estimation process is good enough.

Furthermore, the goal to find a way to have better confidence in roadmaps doesn't make much sense anymore. Since the *what* is more important than the *when*, we could even question the existence of roadmaps. Long term goals should be defined by value and not by time. Luckily, we have OKRs (Objective and Key Results) that exist especially for that reason.

An OKR defines a business oriented goal, along with the key results and/or metrics to measure how much that goal was achieved. Then, it defines tactics that drive the completion of the goal. Within those tactics lies candidate features, i.e. software features that add value needed to achieve the objective.

Thus, OKRs can be used to keep the big picture, and at the same time, to keep the focus on delivering actual value.

## What we can do