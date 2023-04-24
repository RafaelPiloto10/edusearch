# EduSearch

A browser for education sites built by... students with ♥.

## Inspiration

This is a project for a data mining course in which we webscrapped various `.edu` websites and their corresponding newsletter sites.
The browser *in theory* should rank the original source higher than their newsletter sites as they're more likely to link to the main
university page.

## Installation

### Start the Client:
- Install NPM
- Open a terminal in the client folder and install dependencies with `npm i`
- Using the same terminal, then run `npm start`
- Your browser should automatically open a window at localhost:3000. If not, open your browser and visit that link

### Start the Server:
- Ensure NPM is installed from previous step
- Open a terminal in the server folder and run `npm i`
- Using the same terminal, then run `npm start`

### Running the webscraper:
**WARNING: This will override current results so you may need to run the webscraper and then each individual method, we encourage that you do NOT re-run the webscraper**
- Install python 3.8
- pip install bs4, networksx, numpy
- To run, `python3 webscrape.py`

### Running methods:
- Similar to the assignment, `python3 <method> <input_graph> <output>`

## Presentation video:
- https://youtu.be/Xp9m1lRyk_U

