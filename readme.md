# Saxo Bank OpenApi CommandLineInterface

This is a node.js app, written in TypeScript, that allows you to use the Saxo Bank OpenApi from the commandline.

## Current state

This CLI is currently in its very early stages of development. See the [readme.todo](./readme.todo) for a very limited list of initial tasks.

## Setup

1. If you haven't yet, create a Saxo Bank OpenApi developer account [here](https://www.developer.saxo/accounts/sim/signup)

2. If you haven't yet, create a Saxo Bank OpenApi application [here](https://www.developer.saxo/openapi/appmanagement#/)

3. Create a `saxoAppDetails.json` file in the root and copy your application details into it (use the "COPY APP OBJECT" link in the topright corner of the Application Details page on the Saxo portal)

4. Run `npm install`

## Usage

Currently things are still in development, no proper builds are defined etc. but to play around with it you can:

1. Run `npm start` to get a list of available commands

   If this is the first time you run the cli, or if the last run was too long ago, you will be redirected to the authentication page. Fill in your username/password and authenticate (for now the browser window won't close by itself)

2. To run a command you can `npm start -- <command>`

   - i.e. `npm start -- exchanges` will return a list of exchanges available in the Saxo platform for the logged on user

   - i.e. `npm start -- -p Mic,Name exchanges` will return a list of exchanges available in the Saxo platform for the logged on user but filter the output to just return the Mic and Name property of each exchange

   - i.e. `npm start -- search france` will return a list of securities that contain the keyword _france_
