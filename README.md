# Damien Meere - BT Ireland
Interactive Frontend Development Milestone Project - Code Institute

This project website will highlight my capability to employ the various tools illustrated throughout the Interactive frontend development section of the Code Institute programme.
This project will present a dashboard of mock training data, presenting a visual representation of data within interactive charts. Ultimately, as will be discussed within the UX + User
Story section, the goal is to make analysis and processing of training data easier to understand, and more actionable by upper management.

### Table of Contents

- [Demo](#Demo)
- [Database](#Database)
- [UX + User Stories](#UX+User-Stories)
- [Technologies](#Technologies)
- [Page Notes](#Page-Notes)
- [Current Features](#Current-Features)
- [Future Features](#Future-Features)
- [Testing](#Testing)
- [Testing -  Unresolved Bugs](#Testing-Unresolved_Bugs)
- [Deployment](#Deployment)
- [Media](#Media)
- [Acknowledgements](#Acknowledgements)
- [Content](#Content)

## Demo
A live demo of the dashboard can be found [Here](https://damien-meere.github.io/interactive_frontend_milestone/)

## Database
[data_consol.json](https://github.com/damien-meere/interactive_frontend_milestone/blob/master/assets/data/data_consol.json)
File consists of 6 key: value pairs. These pairs consist of data amalgamated from the dataset1, dataset2 and dataset3 files, all visible
witin the [Data Folder](https://github.com/damien-meere/interactive_frontend_milestone/tree/master/assets/data).The excel file accessible
in the Data Folder also contains the data as laid out before consolidation within the data_consol file.

The data_consol folders keys are the date, the year, the month, the type of training, the hours commited to that type of training and the overall spend for that
type training. The values for these keys contain the useful information that will be broken down and represented in a meaningful way in the dashboard. The reason for
the seperation of the date, year and month, is to make the visualisation of the monthly totals easier to work with and visualise.

The data itself is mocked from existing datasets within BT. The original real data will be utilised for deployment on an internal training dashboard.

## UX+User-Stories



## Technologies
1. HTML
2. CSS
3. Bootstrap (4.3.1)
4. FontAwesome
5. Google Font - [Raleway](https://fonts.google.com/specimen/Raleway)
6. JQuery
7. D3 - a JavaScript library for manipulating data, particularly to render our interactive charts and graphs
8. DC - a JavaScript library for data visualization, here for plotting the charts
9. Crossfilter
10. Queue - an asynchronous helper library for JavaScript

## Page-Notes



## Current-Features
TODO: include detailed breakdown and description of the various charts:
1. Total Hours and Total Spend Number Displays
2. Annual Breakdown of Hours and Spend (Bar Chart & stacked Bar Chart variations)
3. Pie Chart detailing the various types of training undertaken
4. Composite Line chart illustrating the breakdown of Hours per training type per month
5. Breakdown of Total Hours and Spend over the last number of years


## Future-Features
TODO: Detail the storing of the live data within a backend database, as well as the development of a data collection form to the monthly submission of relevant data.


## Testing
During initial building of the Dashboard, the requisite data was split across three seperate datasets. Therefore some charts related to different datasets, and as such, were not
directly linked wihin the site. I decided to consolidate this data into a single file (using mocked data). This meant that the various downdown menus and charts could be linked,
making it overall, much easier for someone to understand the data.


## Testing-Unresolved_Bugs



## Deployment
This site is hosted using GitHub pages, deployed directly from the master branch. The deployed site will update automatically upon new commits to the master branch.
In order for the site to deploy correctly on GitHub pages, the landing page is named `index.html`, and the current live site can be accessed [HERE](PASTE LINK HERE)

To run locally, you can clone this repository directly into the editor of your choice by pasting `git clone https://github.com/damien-meere/interactive_frontend_milestone.git` into your terminal.
To cut ties with this GitHub repository, type `git remote rm origin` into the terminal.

You can also Clone this Repository to GitHub Desktop, by navigating to the [main page](https://github.com/damien-meere/interactive_frontend_milestone) of the repository on GitHub, under the repository
name, click Clone or download. Click Open in Desktop to clone the repository and open it in GitHub Desktop. Click Choose... and, using Windows Explorer, navigate to a local path where you
want to clone the repository. For more information you can review the [GitHub site](https://help.github.com/en/articles/cloning-a-repository#cloning-a-repository-to-github-desktop).


### Acknowledgements


### Content


**This site is for educational purposes**