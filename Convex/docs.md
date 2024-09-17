

Page URL: https://docs.convex.dev/

# Convex Docs
Convex is a Backend Application Platform that keeps you focused on building
your product. Convex Functions, Database, File Storage, Scheduling, and Search
fit together cohesively, and are accessible from client libraries for your
favorite environment. Everything in Convex is live and realtime.
## Learn about Convex by creating a chat app
Convex is a novel, fun, and extremely productive way to make backends for your
## Quickstarts​
Quickly get up and running with your favorite frontend tooling or language:
## React
Add Convex to a React project
## Next.js
Add Convex to a Next.js project
## React Native
Add Convex to a React Native Expo project
## Node.js
Add Convex to a Node.js project
## Python
Add Convex to a Python project
## Rust
Add Convex to a Rust project
## Why Convex?​
Visit Stack to learn more about building products
with Convex:
## Convex vs Relational Databases

## Convex vs Firebase

## It's not you, it's SQL

## Building a Full-Stack ChatGPT app




Page URL: https://docs.convex.dev/get-started

# A Tour of Convex
Convex is a novel, fun, and extremely productive way to make backends for your
full-stack apps using 100% TypeScript. So let's get an example app up running in
a few minutes. Then, we'll explore how it works, improve it together, and along
the way learn the fundamentals of how to build your own projects in Convex.
Ensure you have Node.js version 16 or greater installed on your computer. You
can check your version of Node.js by running node --version in your terminal.
If you don't have the appropriate version of Node.js installed,
install it from the Node.js website.
In addition, this walkthrough requires Git. If you cannot run the git command
successfully in your terminal, head over to the
Git website for
instructions.
## Your first Convex project in three steps​
First, clone the example project repo from Github:
```sh
git clone https://github.com/get-convex/convex-tour-chat.git
cd convex-tour-chat
```
In the project root directory, install convex and the other project
dependencies with npm:
```sh
npm install
```
Finally, this app's dev npm command sets up Convex and then runs the web app:
```sh
npm run dev
```
During setup, you'll see that Convex uses your GitHub account for
authentication. Sign into Convex with GitHub and then accept the default project
setup prompts.
Make sure you keep this command (npm run dev) running in the background
throughout this tutorial. It's running both the Node.js web server for the
frontend as well as npx convex in the background to keep your backend in sync
with your local codebase.
Once your app is up and running, open localhost:5173
and check it out. You'll see a chat frontend running in Node.js on your
computer. This frontend connects to your new Convex backend hosted in the cloud,
which stores and retrieves the app's chat messages:

Since we just checked this codebase out, you may wonder how it knows to connect
to your specific Convex backend? Information about your project backend was
written to the .env.local file when we set up the project. When the app starts
up, the Convex client library uses an environment variable to connect to your
backend.
For extra fun, pop up a couple of browser windows and watch Convex relay chat
messages between them:
Screen recording of two different chat windows side-by-side with messages
popping up instantly
Screen recording of two different chat windows side-by-side with messages
popping up instantly
(Something is off! The new messages are on top. We'll fix that in a minute.)
Throughout the rest of this tutorial, we're going to learn more about how this
app works and learn about how to build apps in general using Convex. We'll make
a few improvements to this app as we go, and finish by integrating some cool GPT
AI.
If instead you want to see other example projects, head on over to our
Template Gallery, or see our
Quickstarts.
## Browse the Template Gallery

## Get up & running with Quickstarts

We still recommend you make your way back here eventually to learn the basics
about how Convex works and how to "think in Convex." Most developers find that
once they master the concepts in this tutorial, they're extremely comfortable
making new application architectures on the platform.
## Convex main ingredients​
In the next three parts, we'll use this chat app to walk through the following
fundamental platform concepts:
The Convex reactor First we'll explore the
beating heart of Convex, a custom cloud-hosted reactive database called "the
reactor." The reactor combines document-relational tables with
deterministic TypeScript query and mutation functions.
Convex and your app Next, we'll dive into the
app's frontend code, and explore how to use Convex client libraries to
seamlessly connect your hosted backend to your app.
The broader platform and the outside world
Finally, we'll touch on the broader backend features outside the reactor
that work together to create a comprehensive backend platform. In
particular, we'll go deep on actions, Convex's way to create powerful
jobs that integrate your app with outside services like OpenAI.
Let's go!



Page URL: https://docs.convex.dev/tutorial/reactor

# 1: The reactor
##### You are here
### Convex Tour
Learn about Convex's reactive database accessed through TypeScript cloud
functions

The core of the Convex platform, the engine that powers everything else, is an
innovative database that uses TypeScript cloud functions as its interface.
Together, the database and its functions form the reactor
which gives you realtime updates, perfect caching, type safety, and ACID transactions - all out of
the box.
In this section, you'll explore the reactor through the Convex Dashboard to
get familiar with:

The Convex Dashboard is your hub for viewing &
managing your Convex projects. From any Convex app, you can always quickly jump
into the dashboard for that particular backend with the npx convex tool. Let's
do that now for our new chat app:
```sh
npx convex dashboard
```
## Table time​
In Convex, your data is stored as documents organized into tables. On the
dashboard's Data tab
 you can view and edit
tables & documents manually.

As you can see, our chat project has only one table, named messages. It
contains documents with author and body string fields in addition to
Convex-generated _id and _creationTime fields. The _id field is the
document's primary key, and on the next page we'll explore how it can be used to
create relationships between documents.
Both! Why choose, when you can have the best of both worlds?
Convex lets you store documents with all the flexibility you'd expect from a
NoSQL database while also supporting first-class relationships and
multi-document ACID transactions. All your existing relational modeling
techniques work great on Convex.
Read more:
Document IDs: References and Relationships
## Convex functions​
We've seen the tables, but how does data get in and out of them? In Convex, you
write TypeScript cloud functions to create, read, update, and delete your
data. There is no extra query language like SQL or GraphQL – everything
in Convex is 100% TypeScript.
For sure, it is possible to write your Convex functions in good old JavaScript.
But we recommend using Convex with TypeScript for the convenience & safety of
end-to-end type safety.
In the future, we may support other languages than TS/JS, so stay tuned!
The Functions tab  in
the dashboard lets you view, run, and monitor your functions – click it
now. In our chat app, you'll see we have a messages module with two functions:
list and send. 
When you drill down into a specific function, the dashboard displays the
function's currently deployed source code. These functions live in your
project's codebase under the convex/ folder. You develop them on your computer
right beside the rest of your app, and Convex (specifically, the npx convex
command line) automatically keeps them in sync in the background by redeploying
them when they change.
That module has a couple of functions that create some seed data for the chat,
as a convenience for getting started. You can ignore it for the purposes of
this tutorial.
In our chat app's messages module, we have two functions you can find in
convex/messages.ts:
Let's dive into query functions first.
## Reading data with query functions​
messages:list is a query function that retrieves up to 100 of the most recent
documents in the messages table using the ctx.db object provided by Convex:
The Convex context object, usually named ctx, provides
lots of useful platform capabilities
to your cloud functions.
```sh
// convex/messages.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    return messages;
  },
});
```
The query() constructor, imported from Convex, accepts an object with a
handler function property that represents the server-side code Convex will run
when this query is called. Additionally, an args object can be provided which
specifies the arguments expected by the handler.
### Find & fix the query bug​
In our chat application, the new messages are, annoyingly, appearing at the top!
Let's fix that and display the messages in a chronological order.
Edit the above list query in convex/messages.ts to fix this by modifying the
return value of the function, reversing the messages array before returning
it.
Instead of returning messages, you can return messages.reverse() to put the
chat back in the right order.
```sh
// convex/messages.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Reverse the list so that it's in chronological order.
    return messages.reverse();
  },
});
```
Notice when you save your changes to convex/messages.ts, logs will show up in
your npm run dev terminal as Convex detects and syncs your changes. You see
"Convex functions ready!" when the new version is live.
Immediately, in the chat app, you should now see messages displayed in
appropriate chronological order, newest at the bottom – no refresh
required.
Screen recording of scrolling through chat messages presented in chronological order
## Changing data with mutations​
Mutation functions write to the database, letting you create, update, and
delete documents. In our case, the send mutation adds a new document to the
messages table using ctx.db, which is again provided by Convex to your
function:
```sh
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, { body, author }) => {
    // Send a new message.
    await ctx.db.insert("messages", { body, author });
  },
});
```
Like query(), the mutation() constructor accepts an object with args and
handler. But in this case, send requires two arguments: a string with the
author name, and a string with the message body. The handler takes these
arguments as an object in the second argument to the handler function,
immediately after the Convex-provided mutation context.
You can test-run functions in the dashboard with the "Run Function" button. Type
in values for the required args and click "Run" to execute the function.
This send mutation doesn't return anything, but the dashboard confirms that
the function ran successfully. Back on the "Data" tab, you'll see a new document
has been added to the messages table, and you'll see the new message pop up
instantly in the chat app.


## Realtime is all the time​
You may have noticed you never have to refresh the data view or the app whenever
you run a mutation. The new and changed records just appear! This also applies
to edits in the dashboard, changes to function source code – literally
any change that would affect your app. Feel free to do lots of random
modifications to your app and see for yourself:
Screen capture video of reactive updates to the app through the dashboard
This is Convex's reactor at work. It knows precisely when the mutation
functions create or modify any records that the query functions depend upon, and
it will push new values out as soon as they exist. Even if those query
functions aggregate records, or join together multiple tables or whatever.
But how? The key is Convex query and mutation TypeScript functions are
required to be deterministic. This means they need to return the same value
every time they're run when they're given the same arguments and they operate
on the same underlying database state. Convex uses this determinism to track
the query function "read sets" – that is, which ranges of records in
which tables the function used to produce its result. Since it tracks read
sets, it has complete information to determine whether a mutation function
made a change that would effect any "subscribed" query. If so Convex
automatically re-runs that function and streams the new value to any
subscribed clients.
Nope! Convex will give you a helpful error if you rely on any behavior or packages that
make your query and mutation functions non-deterministic.
Obviously, non-determinism–such as calling other cloud APIs–is an crucial part
of modern apps. Don't worry, Convex has a great solution for that too! We'll
cover it in part three of this tutorial when we integrate OpenAI.
## Recap​
## Let's get coding!​
Phew!
Now that you've gotten your feet wet with the Convex reactor, let's dive into
the chat app's code itself and add some cool new features.



Page URL: https://docs.convex.dev/tutorial/client

# 2: Convex and your app
##### You are here
### Convex Tour
Learn how to connect your project to Convex and quickly build out new fullstack features

In Part 1 you learned the basics of tables, documents,
queries, and mutations, and took a first glance at the data & functions for the
Convex chat app.
In this module, you'll dive deeper into the codebase to learn how to:
Starting with the (now correctly-ordered!) chat app from Part 1, in this module
you'll implement a new feature: a heart button that lets users "like" a message.

Take a moment to familiarize yourself with the codebase structure & contents.
Most importantly:
## Coding with the Convex client​
Open the convex-tour-chat repo in your IDE/editor of choice, and let's take a
closer look at the Convex-related code in src/App.tsx.
The App module imports query and mutation hooks from the convex/react client
library, as well as the typed api that Convex auto-generates from your
function code:
```sh
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
```
In the <App> component, the query/mutation hooks are called with specific
functions defined in the convex/ directory (the list and send functions
you saw in Part 1). Those functions are accessed via the api object using a
[module].[function] naming convention:
```sh
const messages = useQuery(api.messages.list);
const sendMessage = useMutation(api.messages.send);
```
The reactive messages variable contains whatever data is returned from the
list function (or undefined while data is loading). Similar to a state
variable created with useState, any time the query's data changes, the
messages value will change and the component will re-render - all thanks to
Convex's built-in reactivity.
As for sendMessage, its value will be a typed, asynchronous function you can
call to run the corresponding send mutation. In this case, sendMessage is
called within the onSubmit handler of the form:
```sh
  onSubmit={async (event) => {
    event.preventDefault();
    await sendMessage({ body: newMessageText, author: NAME });
    setNewMessageText("");
  }}
```
Whatever arguments the send mutation needs will also be required by the
sendMessage async function; in this case, an object specifying the body and
author of the new message to be added.
Read more about the React client hooks:
## Implement a new feature​
Now that you've taken a glance at how the Convex client connects to the UI, it's
time to jump into the deep end and implement a whole new feature: "like"
buttons!
To get this functionality working, you'll need a few things:
If you're not already running the development server, do so now with the command
```sh
npm run dev
```
### Refine the data model​
In order to track who has liked which messages, let's set up a new likes table
in the database. Each document in the table will have a liker field that
stores the given user's name as a string, and a messageId field that links to
a document in the messages table.
#### Add a 'likes' table to the database schema​
Define the new table and its fields in the
Schema declared in
convex/schema.ts, below the existing messages table definition.
Using messages as a syntax guide, you'll specify the data model using the
defineTable function as well as field
Validators like
v.string() and v.id("table name").
```sh
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    author: v.string(),
    body: v.string(),
  }),
  likes: defineTable({
    liker: v.string(),
    messageId: v.id("messages"),
  }),
});
```
When you save your changes to schema.ts, Convex will sync the new schema with
your project and create the likes table as specified. But there's no data yet,
let's fix that!
### Add a function for new business logic​
Time to populate your new table. While you could go into the dashboard and add
likes documents manually, ultimately you'll want a mutation function that can
create new documents as needed based on user interaction.
#### Define a 'like' mutation​
Export a new mutation() called like from convex/messages.ts.
Using the send function as an example, pass in an object to the
mutation() constructor
with two properties:
```sh
export const like = mutation({
  args: { liker: v.string(), messageId: v.id("messages") },
  handler: async (ctx, { liker, messageId }) => {
    // TODO
  },
});
```
Great! Now, time to actually do something in the mutation's handler
function.
The first argument Convex passes to the handler is a
MutationContext
object, which gives the function access to your Convex database through its db
property. The ctx.db.insert() method lets you add a new document to a
particular table.
#### Insert a new 'likes' document​
In the like handler, use the ctx.db object to insert a new (empty)
document into the likes table, with the liker and messageId passed in as
arguments. Refer to the send handler for an example.
```sh
export const like = mutation({
  args: { liker: v.string(), messageId: v.id("messages") },
  handler: async (ctx, { liker, messageId }) => {
    // Save a user's "like" of a particular message
    await ctx.db.insert("likes", { liker, messageId });
  },
});
```
It lives! Er, likes! Now you just need a way for users to trigger the function.
(Although you can test-run it yourself from the Dashboard if you'd like!)
### Trigger the new function from the UI​
A backend function for liking messages isn't much use if there's no way to
trigger it from the UI! Let's fix that.
#### Hook into the new mutation​
In the <App> component, call the useMutation hook on the like mutation,
naming the resulting function likeMessage or whatever you like (pun intended!)
```sh
const likeMessage = useMutation(api.messages.like);
```
#### Button it up​
Next, add a button element to the p that contains the message body. The text
of the button is up to you, but perhaps a heart (🤍) is appropriate.
To make the button work, add an onClick handler that calls the likeMessage
function, passing in the required arguments to indicate the current user & the
message id (don't forget that mutations are async functions, so you'll need to
await the results!):
```sh
<p>
  {message.body}
  <button
    onClick={async () => {
      await likeMessage({ liker: NAME, messageId: message._id });
    }}
  >
    🤍
  </button>
</p>
```
Huzzah! You can now confirm in the Dashboard that the likes table gets a new
document every time a user clicks one of the heart buttons in the app.
Screen recording of a user clicking the like button in the app in one window while another window open to the dashboard shows new documents in the 'likes' table
### Find out who liked what​
While you can check your Convex Dashboard to see which messages were liked by
someone, your users don't have that option! So to round out this feature you'll
need to give them some way to see how many times a message has been liked.
That means that given a message ID, you'll need to find out how many documents
in the likes table relate to that particular message. To do that, you could
look at every single document in the likes table and check if it has the
matching messageId, but that could get slow as your tables grow. Let's see if
there's a more performant way.
#### Index likes by message ID​
To quickly find all the likes for a given message, we can add an
Index on the likes table that
organizes all the likes documents by their messageId.
#### Add an .index() to the likes table schema​
In convex/schema.js, add an index to the likes table using the
defineTable(...).index() method, which takes two arguments:
```sh
// Within convex/schema.ts defineSchema():
  likes: defineTable({
    liker: v.string(),
    messageId: v.id("messages"),
  }).index("by_messageId", ["messageId"]),
```
Now that the by_messageId index is set up, within a query function we can
quickly find likes documents with a given messageId using the .withIndex()
method, like so:
```sh
const likes = await ctx.db
  .query("likes")
  .withIndex("by_messageId", (q) => q.eq("messageId", message._id))
  .collect();
```
#### Use the new index to query likes data​
Edit the list query in convex/messages.ts to also retrieve the likes for
each message.
Before returning the messages array, .map over it with a likes query as
shown above, passing in each message's id to find its corresponding likes (don't
forget, this is an async operation so you'll need a Promise.all()).
Once you've got the .collect()ed likes array, tally up the total count (the
array's .length). Include this extra info by joining the likes data with the
original message data before returning from the .map(). You can use a spread
operator to copy the messages document data into a new object.
```sh
export const list = query({
  args: {},
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    const messagesWithLikes = await Promise.all(
      messages.map(async (m) => {
        // Find the likes for each message
        const likes = await ctx.db
          .query("likes")
          .withIndex((q) => q.eq(q.field("messageId"), m._id))
          .collect();
        // Join the count of likes with the message data
        return {
          ...m,
          likes: likes.length,
        };
      })
    );
    // Reverse the list so that it's in chronological order.
    return messagesWithLikes.reverse();
  },
});
```
Fabulous, now you're cooking with gas! If you'd like, you can test-run the
list function in the Dashboard to confirm that the returned messages now each
have a likes property.
We recommend using indexes for better performance, but if that's not a concern
you can also use a .filter() to find the documents you're looking for, e.g. in
this case to compare the messageId values given a certain messages document:
```sh
const likes = await ctx.db
  .query("likes")
  .filter((q) => q.eq(q.field("messageId"), message._id))
  .collect();
```
That q is a FilterBuilder, a special object Convex queries can use to
specify certain conditions documents must meet to be returned. You can read more
about it here:
Reading Data: Filtering
### Display the new data​
Back in App.tsx, you can now use message.likes to display the count of likes
for each message.
#### Show off those likes​
In App.tsx, add a <span> within the like button that displays the
message.likes value, but only if it's non-zero.
```sh
<button
  onClick={async () => {
    await likeMessage({ liker: NAME, messageId: message._id });
  }}
>
  {message.likes ? <span>{message.likes}</span> : null} 🤍
</button>
```
### Celebrate your win​
You did it! You implemented an entire new feature in just a few minutes by
defining a new table, writing a new mutation function, and joining data from two
tables in a query function. Congratulations, you're now a Convex developer!
Why not get some friends together to chat about the awesome work you've done?
Screen recording of the chat app with finished like button implementation
## Recap​
## Enough about functions: I want my AI!​
OK OK we get it, an app without AI is as useless as a fish without a bicycle.
Let's add a ChatGPT agent to the chat app, so that chatters can use AI on the
fly!



Page URL: https://docs.convex.dev/tutorial/actions

# 3: The platform in action
##### You are here
### Convex Tour
Learn about harnessing the broader backend platform capabilities to
connect the Reactor to external resources like third-party APIs

In Parts 1 and 2 you iterated on a
fullstack chat app, using query & mutation functions to implement new business
logic and the Convex React client to invoke those functions from the frontend.
So far, all the app's data & functions have been self-contained within the
Convex platform: a pure, deterministic oasis where you enjoy end-to-end
type-safety and transactional guarantees that your data will never be incorrect
or inconsistent.
But what happens when you need to interact with the "real" world outside of
Convex? How do you call external APIs, access data stored elsewhere, or perform
any other "side effects" your specific app might need?
To find out, in this module you'll modify the chat app to integrate an AI chat
agent powered by OpenAI's API! Along the way, you'll learn how to:
Ready to get your GPT on? Let's go!
Screen recording of chat app with a GPT-powered AI agent embedded in the
chat
Screen recording of chat app with a GPT-powered AI agent embedded in the
chat
The AI agent in the chat will be powered by the
OpenAI API, which allows you to use OpenAI's
state-of-the-art LLMs programmatically.
In order to access this API, you'll need to
create a free OpenAI account and create a
new API secret key.
## GPT API FTW!​
Let's use the now-famous GPT language model to create an AI agent that will be
able to answer users' questions from the chat. We'll use OpenAI's
Chat Completions API
to request "completions" (responses) to user input.
### Connect your project to OpenAI​
#### Install the OpenAI client​
OpenAI provides an npm package for easy access to their APIs from JS/TS. Open a
Terminal in the convex-tour-chat root directory and install the openai
package as a project dependency:
```sh
npm install openai
```
#### Set your API key​
In the Convex dashboard, navigate to your deployment Settings page using the
link in the left side bar. There, you'll have the option to add new variables to
your environment, which is the safest way to access a secret like an API key
from your functions.
Create an environment variable named OPENAI_API_KEY and set its value to the
secret key you generated for your OpenAI account.

Now your Convex project has everything it needs to access the API. Time to make
it happen with an action function!
## Write your first action​
### Fire up OpenAI​
Like queries and mutations, actions live in TypeScript modules within the
convex/ directory in your project's root.
#### Create a module for your AI action​
Create a new file convex/openai.ts where you'll import the openai client
library you installed earlier and instantiate a client with the API key from
your project's environment.
```sh
// convex/openai.ts
import { Configuration, OpenAIApi } from "openai";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAIApi(new Configuration({ apiKey }));
```
Start up the development server with npm run dev, if it's not running already.
When you save the new file, you'll notice something is amiss: Convex complains
that it can't push your function!
This is because you're using the wrong runtime for this action; let's fix
that.
### Get to node your runtime​
The Reactor's query and mutation functions run deterministically, enabling
transactional guarantees that keep your data consistent, correct, and
automatically reactive. This is because queries & mutations run in the
Convex Runtime, a special JS/TS
environment built by Convex to provide these guarantees.
The tradeoff is that the Convex Runtime only has access to certain language
features and npm packages. Actions run in the Convex Runtime by default, but for
cases where you need libraries or features that runtime doesn't support, Convex
actions also have access to a "traditional" Node runtime.
#### Switch to the Node Runtime​
Tell Convex that the openai.ts module should run in the Node runtime by adding
the directive "use node"; to the top of the file:
```sh
// convex/openai.ts
"use node;";
import { Configuration, OpenAIApi } from "openai";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAIApi(new Configuration({ apiKey }));
```
Now that your action is running in the appropriate runtime, when you save the
changes Convex should be able to successfully sync them.
Read about the advantages and disadvantages of each runtime in detail here:
Function Runtimes
### A little less conversation, a little more action​
OK, now you're ready to actually get your AI on!
Analogous to query() and mutation(), Convex provides an action()
constructor that defines an action function, which accepts an object defining
the function's args and handler.
#### Get ready for action​
In convex/openai.ts, import the action() constructor and export a new action
called chat that accepts a messageBody string as its argument. Similar to
mutations, action handlers accept two arguments: an ActionContext ctx and an
arguments object as defined in args.
```sh
"use node";
import { Configuration, OpenAIApi } from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAIApi(new Configuration({ apiKey }));

export const chat = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO
  },
});
```
Great, now you just need to draw the rest of the owl!
In the action's handler, you'll use the openai client instantiated earlier
to call the
Chat Completions API.
Looking at the API documentation, it expects a language model name
('gpt-3.5-turbo' works for this app) and a messages array that gives the model
the context of the chat to be completed.
#### Get GPT to complete the chat​
Complete the handler function body to get a response from
openai.createChatCompletion.
Pass gpt-3.5-turbo as the model name, and in the messages array provide two
messages: one 'system' message that tells GPT how you want it to respond, and
one 'user' message that passes on the message content to respond to.
Then, grab the text content of GPT's answer from the response from OpenAI, which
is a nested object of the form (simplified):
```sh
{
  data: {
    choices: [
      { message: { content: "This is the response text from me, GPT" } },
    ];
  }
}
```
```sh
handler: async (ctx, { messageBody }) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        // Provide a 'system' message to give GPT context about how to respond
        role: "system",
        content:
          "You are a terse bot in a group chat responding to questions with 1-sentence answers.",
      },
      {
        // Pass on the chat user's message to GPT
        role: "user",
        content: messageBody,
      },
    ],
  });

  // Pull the message content out of the response
  const responseContent = response.data.choices[0].message?.content;
};
```
Almost there! Time to go back to the first argument of the action's handler
function. When the action runs, Convex will pass an ActionContext as the first
argument to the handler, which includes the utility method runMutation (along
with runQuery and runAction, which you don't need right now). This gives
actions the opportunity to invoke other Convex functions as needed.
Similar to the useMutation hook on the frontend, runMutation accepts a
Convex function belonging to the api Convex generates from your codebase.
#### Send GPT's response as a new message​
Import the api into your openai.ts module:
```sh
import { api } from "./_generated/api";
```
In the action's handler, use ctx.runMutation to execute the existing
api.messages.send mutation to add a new message to the chat, passing through
the chat completion response you received from OpenAI (or a fallback string in
case the response didn't have any content, for whatever reason):
Your convex/openai.ts module should now look something like this:
```sh
"use node";
import { Configuration, OpenAIApi } from "openai";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

// Initialize the OpenAI client with the given API key
const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAIApi(new Configuration({ apiKey }));

export const chat = action({
  args: {
    messageBody: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // "gpt-4" also works, but is so slow!
      messages: [
        {
          // Provide a 'system' message to give GPT context about how to respond
          role: "system",
          content:
            "You are a terse bot in a group chat responding to questions with 1-sentence answers.",
        },
        {
          // Pass on the chat user's message to GPT
          role: "user",
          content: args.messageBody,
        },
      ],
    });

    // Pull the message content out of the response
    const responseContent = response.data.choices[0].message?.content;

    // Send GPT's response as a new message
    await ctx.runMutation(api.messages.send, {
      author: "ChatGPT",
      body: responseContent || "Sorry, I don't have an answer for that.",
    });
  },
});
```
### Put your action into action​
To make sure the chat action works as intended, you can test-run it in the
Dashboard's "Functions" tab, or with the CLI using the convex run command
(substituting in your own question, of course!):
```sh
npx convex run openai:chat '{"messageBody":"What is a serverless function?"}'
```
If all went well, you'll see a new document in the messages table, and in the
chat itself!

## From mutation to action​
At this point your action still isn't connected to the UI, so there is no way to
trigger it from the chat. Time to fix that!
### Right on schedule​
As mentioned earlier, queries and mutations are deterministic functions that
always run in the Convex Runtime, whereas actions can be nondeterministic and
run in the Node runtime. If a deterministic mutation called a nondeterministic
action directly, that determinism would be lost!
However, the Convex scheduler provides a safe way for mutations to
indirectly invoke other functions (whether queries, mutations, or actions).
Using the scheduler, a mutation can "queue up" an action to run after the
mutation has successfully executed, which allows Convex to make sure that the
mutation did not encounter errors before trying to run the action.
#### Schedule the Chat action after the send mutation​
In convex/messages.ts, edit the send mutation to schedule the openai:chat
action after sending the new message.
To do this, you'll need to use the scheduler object from the ctx
MutationContext that the handler receives as its first argument.
Within the handler body, add a call to ctx.scheduler.runAfter to run the
api.openai.chat action after the mutation has completed. The runAfter method
takes 3 arguments:
```sh
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    // Send a new message.
    await ctx.db.insert("messages", { args.body, args.author });

    // Schedule the chat action to run immediately
    ctx.scheduler.runAfter(0, api.openai.chat, {
      messageBody: args.body,
    });
  },
});
```
#### Tag GPT to get A(I) response​
You probably don't want the AI agent to respond to every message in the chat,
so wrap the scheduled action in a conditional so that it will only respond to
messages starting with @gpt.
```sh
export const send = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    // Send a new message.
    await ctx.db.insert("messages", { args.body, args.author });

    if (body.startsWith("@gpt")) {
      // Schedule the chat action to run immediately
      await ctx.scheduler.runAfter(0, api.openai.chat, {
        messageBody: args.body,
      });
    }
  },
});
```
### Enjoy your new GPT BFF​
Your AI chat agent is now ready to go! Try chatting with it using the @gpt
tag.
Screen recording of chat app with finished AI agent implementation
congratulating the user on building your first Convex app
Screen recording of chat app with finished AI agent implementation
congratulating the user on building your first Convex app
## Recap​
## Go forth and Convex!​
You've now completed all 3 parts of the Convex Tour, and built an AI-enabled
chat app in the process - amazing work!
But we hope this is just the beginning of your Convex journey, so on the next
page we've collected some resources you might want to explore next. Choose your
own adventure!



Page URL: https://docs.convex.dev/tutorial/next

# Next steps
## Connect with the Convex community​
Do you want some company as you continue your Convex journey? Join the Convex
Discord server to get support, share ideas, and
chat with other Convex users and team members.
## Dig into the docs​
Did the tour pique your curiosity about the technology and concepts behind
Convex? Do you want to explore other platform features and use cases not covered
on the tour, such as authentication, search, and file storage? The Convex Docs
have you covered! Use the links below or the sidebar to deep dive into the
details.
## Functions
Write functions to define your server behavior.
## Database
Store JSON-like documents with a relational data model.
## File Storage
Store and serve files of any type.
## Authentication
Add authentication to your Convex app.
## Typescript
Move faster with end-to-end type safety.
## Deploying your project
Share your Convex backend and web app with the world.
## Try out templates​
Are you looking for inspiration, or a project you can use as boilerplate to
start your own? Then the Template Gallery is for you!
## Browse the template gallery

## Quickstart your own project​
Do you have an existing project you'd like to integrate Convex into? Check out
these quickstarts to get Convex up and running in your tech stack of choice.
## React
Add Convex to a React project
## Next.js
Add Convex to a Next.js project
## React Native
Add Convex to a React Native Expo project
## Node.js
Add Convex to a Node.js project
## Python
Add Convex to a Python project
## Rust
Add Convex to a Rust project



Page URL: https://docs.convex.dev/quickstarts

# Quickstarts
Quickly get up and running with your favorite frontend tooling or language:
## React
Add Convex to a React project
## Next.js
Add Convex to a Next.js project
## React Native
Add Convex to a React Native Expo project
## Node.js
Add Convex to a Node.js project
## Python
Add Convex to a Python project
## Rust
Add Convex to a Rust project



Page URL: https://docs.convex.dev/quickstart/react

# React Quickstart
Learn how to query data from Convex in a React app using Vite
andTypeScript
Create a React app using the create vite command.
```sh
npm create vite@latest my-app -- --template react-ts
```
To get started, install the convex
package which provides a convenient interface for working
with Convex from a React app.
Navigate to your app directory and install convex.
```sh
cd my-app && npm install convex
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
In a new terminal window, create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table
with the sample data into your Convex database with
the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file schema.ts in the convex/ folder
with a description of your data.
This will declare the types of your data for optional
typechecking with TypeScript, and it will be also
enforced at runtime.
Alternatively remove the line 'plugin:@typescript-eslint/recommended-requiring-type-checking',
from the .eslintrc.cjs file to lower the type checking strictness.
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
```
Add a new file tasks.ts in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, api.tasks.get.
```sh
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```
In src/main.tsx, create a ConvexReactClient and pass it to a ConvexProvider
wrapping your app.
```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```
In src/App.tsx, use the useQuery hook to fetch from your api.tasks.get
API function and display the data.
```sh
import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {tasks?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
    </div>
  );
}

export default App;
```
Start the app, open http://localhost:5173/ in a browser,
and see the list of tasks.
```sh
npm run dev
```
Using create-react-app? See the
Create React App version of this
guide.



Page URL: https://docs.convex.dev/quickstart/nextjs

# Next.js Quickstart
Learn how to query data from Convex in a Next.js app using the App Router
andTypeScript
Alternatively see the
Pages Router
version of this quickstart.
Create a Next.js app using the npx create-next-app command.
Choose the default option for every prompt (hit Enter).
```sh
npx create-next-app@latest my-app
```
To get started, install the convex
package which provides a convenient interface for working
with Convex from a React app.
Navigate to your app and install convex.
```sh
cd my-app && npm install convex
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
In a new terminal window, create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table
with the sample data into your Convex database with
the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file tasks.ts in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, api.tasks.get.
```sh
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```
Add a new file ConvexClientProvider.tsx in the app/ folder. Include the "use client"; directive, create a
ConvexReactClient and a component that wraps its children in a ConvexProvider.
```sh
"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
```
In app/layout.tsx, wrap the children of the body element with the ConvexClientProvider.
```sh
import "./globals.css";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
```
In app/page.tsx, use the useQuery hook to fetch from your api.tasks.get
API function.
```sh
"use client";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {tasks?.map(({ _id, text }) => (
        <div key={_id.toString()}>{text}</div>
      ))}
    </main>
  );
}
```
Start the app, open http://localhost:3000 in a browser,
and see the list of tasks.
```sh
npm run dev
```



Page URL: https://docs.convex.dev/quickstart/react-native

# React Native Quickstart
Learn how to query data from Convex in a React Native app.
Create a React Native app using the npx create-expo-app command.
```sh
npx create-expo-app my-app
```
To get started, install the convex
package which provides a convenient interface for working
with Convex from a React app.
Navigate to your app and install convex and
its peer dependencies.
```sh
cd my-app && npm install convex react-dom react-native-get-random-values
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
To configure your Convex deployment URL
via .env files, in a new terminal window,
install react-native-dotenv.
```sh
npm install --dev react-native-dotenv
```
To use the deployment URL directly from
the .env files, configure babel.
```sh
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: ["module:react-native-dotenv"],
  };
};
```
Create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table with the sample data into
your Convex database with the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file tasks.js in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, api.tasks.get.
```sh
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```
In App.js, create a ConvexReactClient and pass it to a ConvexProvider
wrapping your component tree.
Also import 'react-native-get-random-values'.
Finally include the Tasks component which we'll add in the next step.
```sh
import { ConvexProvider, ConvexReactClient } from "convex/react";
import "react-native-get-random-values";
import { CONVEX_URL } from "@env";
import Tasks from "./Tasks";

const convex = new ConvexReactClient(CONVEX_URL, {
  unsavedChangesWarning: false,
});

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <Tasks />
    </ConvexProvider>
  );
}
```
Add a new file Tasks.js with a component using the useQuery hook to fetch
from your api.tasks.get API.
```sh
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Tasks() {
  const tasks = useQuery(api.tasks.get);
  return (
    <View style={styles.container}>
      {tasks?.map(({ _id, text }) => (
        <Text key={_id.toString()}>{text}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
```
Start the app, scan the provided QR code with your phone,
and see the serialized list of tasks in the center of the screen.
```sh
npm start
```
Are you trying to build a universal app targeting both browsers and mobile
devices? Use npm create tamagui and apply the steps above to the apps/expo
directory and the steps in the Next.js Quickstart
to the apps/next directory.



Page URL: https://docs.convex.dev/quickstart/nodejs

# Node.js Quickstart
Learn how to query data from Convex in a Node.js project.
Create a new directory for your Node.js project.
```sh
mkdir my-project && cd my-project
```
Install the convex
package which provides a convenient interface for working
with Convex from JavaScript.
Also install the dotenv library for loading .env files.
```sh
npm install convex dotenv
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
In a new terminal window, create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table
with the sample data into your Convex database with
the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file tasks.js in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, api.tasks.get.
```sh
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```
In a new file script.js, create a ConvexHttpClient using
the URL of your development environment.
```sh
const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api");
require("dotenv").config({ path: ".env.local" });
const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

client.query(api.tasks.get).then(console.log);
```
Run the script from the same directory and see the list of tasks logged to the terminal.
```sh
node script.js
```



Page URL: https://docs.convex.dev/quickstart/python

# Python Quickstart
Learn how to query data from Convex in a Python app.
Create a folder for your Python script
with a virtual environment.
```sh
python3 -m venv my-app/venv
```
To get started, install the convex npm
package which enables you to write your
backend.
And also install the convex Python client
library and python-dotenv for working with .env files.
```sh
cd my-app && npm install convex && venv/bin/pip install convex python-dotenv
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
In a new terminal window, create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table
with the sample data into your Convex database with
the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file tasks.js in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, "tasks:get".
```sh
import { query } from "./_generated/server";

export const get = query({
  handler: async ({ db }) => {
    return await db.query("tasks").collect();
  },
});
```
In a new file main.py, create a ConvexClient and use it
to fetch from your "tasks:get" API.
```sh
import os

from dotenv import load_dotenv

from convex import ConvexClient

load_dotenv(".env.local")
load_dotenv()

client = ConvexClient(os.getenv("CONVEX_URL"))
print(client.query("tasks:get"))
```
Run the script
and see the serialized list of tasks.
```sh
venv/bin/python -m main
```



Page URL: https://docs.convex.dev/quickstart/rust

# Rust Quickstart
Learn how to query data from Convex in a Rust app with Tokio.
Create a new Cargo project.
```sh
cargo new my_app
cd my_app
```
To get started, install the convex npm
package which enables you to write your
backend.
And also install the convex Rust client library,
the tokio runtime, and dotenvy for working with .env files.
```sh
npm install convex && cargo add convex tokio dotenvy
```
Next, run npx convex dev. This
will prompt you to log in with GitHub,
create a project, and save your production and deployment URLs.
It will also create a convex/ folder for you
to write your backend API functions in. The dev command
will then continue running to sync your functions
with your dev deployment in the cloud.
```sh
npx convex dev
```
In a new terminal window, create a sampleData.jsonl
file with some sample data.
```sh
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```
Now that your project is ready, add a tasks table
with the sample data into your Convex database with
the import command.
```sh
npx convex import tasks sampleData.jsonl
```
Add a new file tasks.js in the convex/ folder
with a query function that loads the data.
Exporting a query function from this file
declares an API function named after the file
and the export name, "tasks:get".
```sh
import { query } from "./_generated/server";

export const get = query({
  handler: async ({ db }) => {
    return await db.query("tasks").collect();
  },
});
```
In the file src/main.rs, create a ConvexClient and use it
to fetch from your "tasks:get" API.
```sh
use std::{
    collections::BTreeMap,
    env,
};

use convex::ConvexClient;

#[tokio::main]
async fn main() {
    dotenvy::from_filename(".env.local").ok();
    dotenvy::dotenv().ok();

    let deployment_url = env::var("CONVEX_URL").unwrap();

    let mut client = ConvexClient::new(&deployment_url).await.unwrap();
    let result = client.query("tasks:get", BTreeMap::new()).await.unwrap();
    println!("{result:#?}");
}
```
Run the app and see the serialized list of tasks.
```sh
cargo run
```



Page URL: https://docs.convex.dev/zen

# The Zen of Convex
By now you probably sense that Convex is an opinionated framework, and you'd be
right. Every element of Convex has been designed to pull developers into
the pit of success.
The Zen of Convex is a set of guidelines developers have discovered that keep
their projects falling into this wonderful pit:



Page URL: https://docs.convex.dev/functions

# Functions
Functions run on the backend and are written in JavaScript (or TypeScript). They
are automatically available as APIs accessed through
client libraries. Everything you do in the Convex
backend starts from functions.
There are three types of functions:
You can also build HTTP actions when you
want to call your functions from a webhook or a custom client.



Page URL: https://docs.convex.dev/functions/query-functions

# Queries
Queries are the bread and butter of your backend API. They fetch data from the
database, check authentication or perform other business logic, and return data
back to the client application.
This is an example query, taking in named arguments, reading data from the
database and returning a result:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

// Return the last 100 tasks in a given task list.
export const getTaskList = query({
  args: { taskListId: v.id("taskLists") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("taskListId"), args.taskListId))
      .order("desc")
      .take(100);
    return tasks;
  },
});
```
Read on to understand how to build queries yourself.
## Query names​
Queries are defined in TypeScript files inside your convex/
directory.
The path and name of the file, as well as the way the function is exported from
the file, determine the name the client will use to call it:
```sh
// This function will be referred to as `api.myFunctions.myQuery`.
export const myQuery = …;

// This function will be referred to as `api.myFunctions.sum`.
export const sum = …;
```
To structure your API you can nest directories inside the convex/ directory:
```sh
// This function will be referred to as `api.foo.myQueries.listMessages`.
export const listMessages = …;
```
Default exports receive the name default.
```sh
// This function will be referred to as `api.myFunctions.default`.
export default …;
```
The same rules apply to mutations and
actions, while
HTTP actions use a different routing
approach.
Client libraries in languages other than JavaScript and TypeScript use strings
instead of API objects:
## The query constructor​
To actually declare a query in Convex you use the query constructor function.
Pass it an object with a handler function, which returns the query result:
```sh
import { query } from "./_generated/server";

export const myConstantString = query({
  handler: () => {
    return "My never changing string";
  },
});
```
### Query arguments and responses​
Queries accept named arguments. The argument values are accessible as fields of
the second parameter of the handler function:
```sh
import { query } from "./_generated/server";

export const sum = query({
  handler: (_, args: { a: number; b: number }) => {
    return args.a + args.b;
  },
});
```
Arguments and responses are automatically serialized and deserialized, and you
can pass and return most value-like JavaScript data to and from your query.
To both declare the types of arguments and to validate them, add an args
object using v validators:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const sum = query({
  args: { a: v.number(), b: v.number() },
  handler: (_, args) => {
    return args.a + args.b;
  },
});
```
See argument validation for the full list
of supported types and validators.
The first parameter of the handler function contains the query context.
### Query context​
The query constructor enables fetching data, and other Convex features by
passing a QueryCtx object to the
handler function as the first parameter:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const myQuery = query({
  args: { a: v.number(), b: v.number() },
  handler: (ctx, args) => {
    // Do something with `ctx`
  },
});
```
Which part of the query context is used depends on what your query needs to do:
To fetch from the database use the db field. Note that we make the handler
function an async function so we can await the promise returned by
db.get():
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTask = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```
Read more about Reading Data.
To return URLs to stored files use the storage field. Read more about
File Storage.
To check user authentication use the auth field. Read more about
Authentication.
## Using NPM packages​
Queries can import NPM packages installed in node_modules. Not all NPM
packages are supported, see
Runtimes for more
details.
```sh
npm install @faker-js/faker
```
```sh
import { query } from "./_generated/server";
import { faker } from "@faker-js/faker";

export const randomName = query({
  args: {},
  handler: () => {
    faker.seed();
    return faker.person.fullName();
  },
});
```
## Calling queries from clients​
To call a query from React use the
useQuery hook along with the generated
api object.
```sh
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyApp() {
  const data = useQuery(api.myFunctions.sum, { a: 1, b: 2 });
  // do something with `data`
}
```
See the React client documentation for all the ways
queries can be called.
## Caching & reactivity​
Queries have two awesome attributes:
To have these attributes the handler function must be deterministic, which
means that given the same arguments (including the query context) it will return
the same response.
For this reason queries cannot call third party APIs. To call third party APIs,
use actions.
You might wonder whether you can use non-deterministic language functionality
like Math.random() or Date.now(). The short answer is that Convex takes care
of implementing these in a way that you don't have to think about the
deterministic constraint.
See Runtimes for more
details on the Convex runtime.
## Limits​
Queries have a limit to the amount of data they can read at once to guarantee
good performance. Check out these limits
here.



Page URL: https://docs.convex.dev/functions/mutation-functions

# Mutations
Mutations insert, update and remove data from the database, check authentication
or perform other business logic, and optionally return a response to the client
application.
This is an example mutation, taking in named arguments, writing data to the
database and returning a result:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const getTaskList = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("tasks", { text: args.text });
    return newTaskId;
  },
});
```
Read on to understand how to build mutations yourself.
## Mutation names​
Mutations follow the same naming rules as queries, see
Query names.
Queries and mutations can be defined in the same file when using named exports.
## The mutation constructor​
To declare a mutation in Convex use the mutation constructor function. Pass it
an object with a handler function, which performs the mutation:
```sh
import { mutation } from "./_generated/server";

export const mutateSomething = mutation({
  handler: () => {
    // implementation will be here
  },
});
```
Unlike a query, a mutation can but does not have to return a value.
### Mutation arguments and responses​
Just like queries, mutations accept named arguments, and the argument values are
accessible as fields of the second parameter of the handler function:
```sh
import { mutation } from "./_generated/server";

export const mutateSomething = mutation({
  handler: (_, args: { a: number; b: number }) => {
    // do something with `args.a` and `args.b`

    // optionally return a value
    return "success";
  },
});
```
Arguments and responses are automatically serialized and deserialized, and you
can pass and return most value-like JavaScript data to and from your mutation.
To both declare the types of arguments and to validate them, add an args
object using v validators:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const mutateSomething = mutation({
  args: { a: v.number(), b: v.number() },
  handler: (_, args) => {
    // do something with `args.a` and `args.b`
  },
});
```
See argument validation for the full list
of supported types and validators.
The first parameter to the handler function is reserved for the mutation
context.
### Mutation context​
The mutation constructor enables writing data to the database, and other
Convex features by passing a
MutationCtx object to the handler
function as the first parameter:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const mutateSomething = mutation({
  args: { a: v.number(), b: v.number() },
  handler: (ctx, args) => {
    // Do something with `ctx`
  },
});
```
Which part of the mutation context is used depends on what your mutation needs
to do:
To read from and write to the database use the db field. Note that we make
the handler function an async function so we can await the promise
returned by db.insert():
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addItem = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", { text: args.text });
  },
});
```
Read on about Writing Data.
To generate upload URLs for storing files use the storage field. Read on
about File Storage.
To check user authentication use the auth field. Read on about
Authentication.
To schedule functions to run in the future, use the scheduler field. Read on
about Scheduled Functions.
## Using NPM packages​
Mutations can import NPM packages installed in node_modules. Not all NPM
packages are supported, see
Runtimes for more
details.
```sh
npm install faker
```
```sh
import { faker } from "@faker-js/faker";
import { mutation } from "./_generated/server";

export const randomName = mutation({
  args: {},
  handler: async (ctx) => {
    faker.seed();
    await ctx.db.insert("tasks", { text: "Greet " + faker.person.fullName() });
  },
});
```
## Calling mutations from clients​
To call a mutation from React use the generated
useMutation hook:
To call a mutation from React use the
useMutation hook along with the generated
api object.
```sh
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyApp() {
  const mutateSomething = useMutation(api.myFunctions.mutateSomething);
  const handleClick = () => {
    mutateSomething({ a: 1, b: 2 });
  };
  // pass `handleClick` to a button
  // ...
}
```
See the React client documentation for all the ways
queries can be called.
When mutations are called from the React or
Rust clients, they are executed one at a time in a single,
ordered queue. You don't have to worry about mutations editing the database in a
different order than they were triggered.
## Transactions​
Mutations run transactionally. This means that:
For this to work, similarly to queries, mutations must be deterministic, and
cannot call third party APIs. To call third party APIs, use
actions.
## Limits​
Mutations have a limit to the amount of data they can read and write at once to
guarantee good performance. Check out these limits
here.



Page URL: https://docs.convex.dev/functions/actions

# Actions
Actions can call third party services to do things such as processing a payment
with Stripe. They can be run in Convex's JavaScript
environment or in Node.js. They can interact with the database indirectly by
calling queries and
mutations.
Example:
GIPHY Action
## Action names​
Actions follow the same naming rules as queries, see
Query names.
## The action constructor​
To declare an action in Convex you use the action constructor function. Pass it
an object with a handler function, which performs the action:
```sh
import { action } from "./_generated/server";

export const doSomething = action({
  handler: () => {
    // implementation goes here

    // optionally return a value
    return "success";
  },
});
```
Unlike a query, an action can but does not have to return a value.
### Action arguments and responses​
Action arguments and responses follow the same rules as
mutations:
```sh
import { action } from "./_generated/server";
import { v } from "convex/values";

export const doSomething = action({
  args: { a: v.number(), b: v.number() },
  handler: (_, args) => {
    // do something with `args.a` and `args.b`

    // optionally return a value
    return "success";
  },
});
```
The first argument to the handler function is reserved for the action context.
### Action context​
The action constructor enables interacting with the database, and other Convex
features by passing an ActionCtx object to
the handler function as the first argument:
```sh
import { action } from "./_generated/server";
import { v } from "convex/values";

export const doSomething = action({
  args: { a: v.number(), b: v.number() },
  handler: (ctx, args) => {
    // do something with `ctx`
  },
});
```
Which part of that action context is used depends on what your action needs to
do:
To read data from the database use the runQuery field, and call a query that
performs the read:
```sh
import { action, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

export const doSomething = action({
  args: { a: v.number() },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(internal.myFunctions.readData, {
      a: args.a,
    });
    // do something with `data`
  },
});

export const readData = internalQuery({
  args: { a: v.number() },
  handler: async (ctx, args) => {
    // read from `ctx.db` here
  },
});
```
Here readData is an internal query
because we don't want to expose it to the client directly. Actions, mutations
and queries can be defined in the same file.
To write data to the database use the runMutation field, and call a mutation
that performs the write:
```sh
import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const doSomething = action({
  args: { a: v.number() },
  handler: async (ctx, args) => {
    const data = await ctx.runMutation(internal.myMutations.writeData, {
      a: args.a,
    });
    // do something else, optionally use `data`
  },
});
```
Use an internal mutation when you
want to prevent users from calling the mutation directly.
As with queries, it's often convenient to define actions and mutations in the
same file.
To generate upload URLs for storing files use the storage field. Read on
about File Storage.
To check user authentication use the auth field. Auth is propagated
automatically when calling queries and mutations from the action. Read on
about Authentication.
To schedule functions to run in the future, use the scheduler field. Read on
about Scheduled Functions.
## Calling third-party APIs and using NPM packages​
Actions can run in Convex's custom JavaScript environment or in Node.js.
By default, actions run in Convex's environment. This environment supports
fetch, so actions that simply want to call a third-party API using fetch can
be run in this environment:
```sh
import { action } from "./_generated/server";

export const doSomething = action({
  args: {},
  handler: async () => {
    const data = await fetch("https://api.thirdpartyservice.com");
    // do something with data
  },
});
```
Actions running in Convex's environment are faster compared to Node.js, since
they don't require extra time to start up before running your action (cold
starts). They can also be defined in the same file as other Convex functions.
Like queries and mutations they can import NPM packages, but not all are
supported.
Actions needing unsupported NPM packages or Node.js APIs can be configured to
run in Node.js by adding the "use node" directive at the top of the file. Note
that other Convex functions cannot be defined in files with the "use node";
directive.
```sh
"use node";

import { action } from "./_generated/server";
import SomeNpmPackage from "some-npm-package";

export const doSomething = action({
  args: {},
  handler: () => {
    // do something with SomeNpmPackage
  },
});
```
Learn more about the two Convex Runtimes.
## Calling actions from clients​
To call an action from React use the
useAction hook along with the generated
api object.
```sh
import React from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function MyApp() {
  const performMyAction = useAction(api.myFunctions.doSomething);
  const handleClick = () => {
    performMyAction({ a: 1 });
  };
  // pass `handleClick` to a button
  // ...
}
```
See the React client documentation for all the ways
queries can be called.
Unlike
mutations,
actions from a single client are parallelized. Each action will be executed as
soon as it reaches the server (even if other actions and mutations from the same
client are running).
If your app relies on actions running after other actions or mutations make sure
to only trigger the action after the relevant previous function completes.
## Limits​
Actions time out after 5 minutes.
Node.js and
Convex runtime have 512MB
and 64MB memory limit respectively. Please
contact us if you have a use case that requires
configuring higher limits.
Actions can do up to 1000 concurrent operations, such as executing queries,
mutations or performing fetch requests.
## Error handling​
Unlike queries and mutations, actions may have side-effects and therefore can't
be automatically retried by Convex when errors occur. For example, say your
action calls Stripe to send a customer invoice. If the HTTP request fails,
Convex has no way of knowing if the invoice was already sent. Like in normal
backend code, it is the responsibility of the caller to handle errors raised by
actions and retry the action call if appropriate.
## Dangling promises​
Make sure to await all promises created within an action. Async tasks still
running when the function returns might or might not complete. In addition,
since the Node.js execution environment might be reused between action calls,
dangling promises might result in errors in subsequent action invocations.



Page URL: https://docs.convex.dev/functions/internal-functions

# Internal Functions
Internal functions can only be called by other functions
and cannot be called directly from a Convex client.
By default your Convex functions are public and accessible to clients. Public
functions may be called by malicious users in ways that cause surprising
results. Internal functions help you mitigate this risk. We recommend using
internal functions any time you're writing logic that should not be called from
a client.
While internal functions help mitigate risk by reducing the public surface area
of your application, you can still validate internal invariants using
argument validation and/or
authentication.
## Use cases for internal functions​
Leverage internal functions by:
## Defining internal functions​
An internal function is defined using internalQuery, internalMutation, or
internalAction. For example:
```sh
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const markPlanAsProfessional = internalMutation({
  args: { planId: v.id("plans") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.planId, { planType: "professional" });
  },
});
```
If you need to pass complicated objects to internal functions you might prefer
to not use argument validation. Note though that if you're using internalQuery
or internalMutation it's a better idea to pass around document IDs instead of
documents, to ensure the query or mutation is working with the up-to-date state
of the database.
```sh
import { internalAction } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const markPlanAsProfessional = internalAction({
  handler: async (actionCtx, args) => {
    // perform an action, perhaps calling a third-party API
  },
});
```
## Calling internal functions​
Internal functions can be called from other functions using the
internal object.
For example, consider this public upgrade action that calls the internal
plans.markPlanAsProfessional mutation we defined above:
```sh
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const upgrade = action({
  args: {
    planId: v.id("plans"),
  },
  handler: async (ctx, args) => {
    // Call out to payment provider (e.g. Stripe) to charge customer
    const response = await fetch("https://...");
    if (response.ok) {
      // Mark the plan as "professional" in the Convex DB
      await ctx.runMutation(internal.plans.markPlanAsProfessional, {
        planId: args.planId,
      });
    }
  },
});
```
In this example a user should not be able to directly call
internal.plans.markPlanAsProfessional without going through the upgrade
action — if they did, then they would get a free upgrade.
You can define public and internal functions in the same file.



Page URL: https://docs.convex.dev/functions/args-validation

# Argument Validation
Argument validators ensure that queries,
mutations, and actions are called
with the correct types of arguments.
This is important for security! Without argument validation, a malicious
user can call your public functions with unexpected arguments and cause
surprising results. TypeScript alone won't help because
TypeScript types aren't present at runtime. We recommend adding argument
validation for all public functions in production apps. For non-public functions
that are not called by clients, we recommend
internal functions and optionally
validation.
Example:
Argument Validation
## Adding validators​
To add argument validation to your functions, pass an object with args and
handler properties to the query, mutation or action constructor:
```sh
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const send = mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  handler: async (ctx, args) => {
    const { body, author } = args;
    await ctx.db.insert("messages", { body, author });
  },
});
```
If you define your function with an argument validator, there is no need to
include TypeScript type annotations! The type of your
function will be inferred automatically.
The validation will throw if the client supplies arguments not declared in
args. This is helpful to prevent bugs caused by mistyped names of arguments.
Even args: {} is a helpful use of validators because TypeScript will show an
error on the client if you try to pass any arguments to the function which
doesn't expect them.
## Supported types​
All functions, both public and internal, can accept and return the following
data types. Each type has a corresponding validator that can be accessed on the
v object imported from "convex/values".
The database can store the exact same set of
data types.
Additionally you can also express type unions, literals, any types, and
optional fields.
### Convex values​
Convex supports the following types of values:
### Unions​
You can describe fields that could be one of multiple types using v.union:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    stringOrNumber: v.union(v.string(), v.number()),
  },
  handler: async ({ db }, { stringOrNumber }) => {
    //...
  },
});
```
### Literals​
Fields that are a constant can be expressed with v.literal. This is especially
useful when combined with unions:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    oneTwoOrThree: v.union(
      v.literal("one"),
      v.literal("two"),
      v.literal("three")
    ),
  },
  handler: async ({ db }, { oneTwoOrThree }) => {
    //...
  },
});
```
### Any​
Fields that could take on any value can be represented with v.any():
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    anyValue: v.any(),
  },
  handler: async ({ db }, { anyValue }) => {
    //...
  },
});
```
This corresponds to the any type in TypeScript.
### Optional fields​
You can describe optional fields by wrapping their type with v.optional(...):
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    optionalString: v.optional(v.string()),
    optionalNumber: v.optional(v.number()),
  },
  handler: async ({ db }, { optionalString, optionalNumber }) => {
    //...
  },
});
```
This corresponds to marking fields as optional with ? in TypeScript.
## Extracting TypeScript types​
The Infer type allows you to turn validator calls
into TypeScript types. This can be useful to remove duplication between your
validators and TypeScript types:
```sh
import { mutation } from "./_generated/server";
import { Infer, v } from "convex/values";

const nestedObject = v.object({
  property: v.string(),
});

// Resolves to `{property: string}`.
export type NestedObject = Infer<typeof nestedObject>;

export default mutation({
  args: {
    nested: nestedObject,
  },
  handler: async ({ db }, { nested }) => {
    //...
  },
});
```



Page URL: https://docs.convex.dev/functions/http-actions

# HTTP Actions
HTTP actions allow you to build an HTTP API right in Convex!
HTTP actions take in a
Request and return a
Response following
the Fetch API.
HTTP actions can manipulate the request and response directly, and interact with
data in Convex indirectly by running
queries,
mutations, and
actions. HTTP actions might be used for receiving
webhooks from external applications or defining a public HTTP API.
HTTP actions are exposed at https://<your deployment name>.convex.site (e.g.
https://happy-animal-123.convex.site).
Example:
HTTP Actions
## Defining HTTP actions​
HTTP action handlers are defined using the
httpAction constructor, similar to the
action constructor for normal actions:
```sh
import { httpAction } from "./_generated/server";

export const doSomething = httpAction(async () => {
  // implementation will be here
  return new Response();
});
```
The first argument to the handler is an
ActionCtx object, which provides
auth,
storage, and
scheduler, as well as runQuery,
runMutation, runAction.
The second argument contains the
Request data. HTTP
actions do not support argument validation, as the parsing of arguments from the
incoming Request is left entirely to you.
Here's an example:
```sh
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const postMessage = httpAction(async (ctx, request) => {
  const { author, body } = await request.json();

  await ctx.runMutation(internal.messages.sendOne, {
    body: `Sent via HTTP action: ${body}`,
    author,
  });

  return new Response(null, {
    status: 200,
  });
});
```
To expose the HTTP Action, export an instance of HttpRouter
from the
convex/http.ts file. To create the instance call
the httpRouter function. On the HttpRouter you can expose routes using the
route method:
```sh
import { httpRouter } from "convex/server";
import { postMessage, getByAuthor } from "./messages";

const http = httpRouter();

http.route({
  path: "/postMessage",
  method: "POST",
  handler: postMessage,
});

// Define additional routes
http.route({
  path: "/getMessagesByAuthor",
  method: "GET",
  handler: getByAuthor,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
```
You can now call this action via HTTP and interact with data stored in the
Convex Database. HTTP actions are exposed on
https://<your deployment name>.convex.site.
```sh
export DEPLOYMENT_NAME=... # example: "happy-animal-123"
curl -d '{ "author": "User 123", "body": "Hello world" }' \
    -H 'content-type: application/json' "https://$DEPLOYMENT_NAME.convex.site/postMessage"
```
Like other Convex functions, you can view your HTTP actions in the
Functions view of
your dashboard and view logs produced by them
in the Logs view.
## Limits​
HTTP actions run in the same environment as queries and mutations so also do not
have access to Node.js-specific JavaScript APIs. HTTP actions can call
actions, which can run in Node.js.
Like actions, HTTP actions may
have side-effects and will not be automatically retried by Convex when errors
occur. It is a responsibility of the caller to handle errors and retry the
request if appropriate.
Request and response size is limited to 20MB.
HTTP actions support request and response body types of .text(), .json(),
.blob(), and .arrayBuffer().
Note that you don't need to define an HTTP action to call your queries,
mutations and actions over HTTP if you control the caller, since you can use use
the JavaScript ConvexHttpClient or
the Python client to call these functions directly.
## Common patterns​
### File Storage​
HTTP actions can be used to handle uploading and fetching stored files, see
File Storage with HTTP actions.
### CORS​
To make requests to HTTP actions from a website you need to add
Cross-Origin Resource Sharing (CORS)
headers to your HTTP actions.
There are existing resources for exactly which CORS headers are required based
on the use case. This site provides an
interactive walkthrough for what CORS headers to add. Here's an example of
adding CORS headers to a Convex HTTP action:
```sh
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    const author = new URL(request.url).searchParams.get("author");
    await ctx.runMutation(api.messages.sendImage, { storageId, author });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        // e.g. https://mywebsite.com
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        Vary: "origin",
      }),
    });
  }),
});
```
Here's an example of handling a pre-flight OPTIONS request:
```sh
// Pre-flight request for /sendImage
http.route({
  path: "/sendImage",
  method: "OPTIONS",
  handler: httpAction(async (_, request) => {
    // Make sure the necessary headers are present
    // for this to be a valid pre-flight request
    const headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null &&
      headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: new Headers({
          // e.g. https://mywebsite.com
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type, Digest",
          "Access-Control-Max-Age": "86400",
        }),
      });
    } else {
      return new Response();
    }
  }),
});
```
### Authentication​
You can leverage Convex's built-in authentication integration
and access a user identity from
ctx.auth.getUserIdentity(). To
do this call your endpoint with an Authorization header including a JWT token:
```sh
const jwtToken = "...";

fetch("https://<deployment name>.convex.site/myAction", {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});
```



Page URL: https://docs.convex.dev/functions/error-handling

# Error Handling
There are three reasons why your Convex
queries and
mutations may hit errors:
Convex will automatically handle internal Convex errors. If there are problems
on our end, we'll automatically retry your queries and mutations until the
problem is resolved and your queries and mutations succeed.
On the other hand, you must decide how to handle developer errors and
read/write limit errors.
When a developer error happens, the best practices are to:
This guide provides advice on how to do both of these things.
## Errors in queries​
If your query function hits an error, the error will be sent to the client and
thrown from your useQuery call site. The best way to handle these errors is
with a React
error boundary component.
Error boundaries allow you to catch errors thrown in their child component tree,
render fallback UI, and send information about the error to your exception
handling service. Adding error boundaries to your app is a great way to handle
errors in Convex query functions as well as other errors in your React
components. If you are using Sentry, you can use their
Sentry.ErrorBoundary
component.
With error boundaries, you can decide how granular you'd like your fallback UI
to be. Once simple option is to wrap your entire application in a single error
boundary like:
```sh
<StrictMode>
  <ErrorBoundary>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </ErrorBoundary>
</StrictMode>,
```
Then any error in any of your components will be caught by the boundary and
render the same fallback UI.
On the other hand, if you'd like to enable some portions of your app to continue
functioning even if other parts hit errors, you can instead wrap different parts
of your app in separate error boundaries.
Unlike other frameworks, there is no concept of "retrying" if your query
function hits a developer error. Because Convex functions are
deterministic, if the
query function hits an error, retrying will always produce the same error. There
is no point in running the query function with the same arguments again.
## Errors in mutations​
If a mutation hits an error, this will
If you have an exception service like Sentry configured,
it should report "unhandled promise rejections" like this automatically. That
means that with no additional work your mutation errors should be reported.
Note that errors in mutations won't be caught by your error boundaries because
the error doesn't happen as part of rendering your components.
If you would like to render UI specifically in response to a mutation failure,
you can use .catch on your mutation call. For example:
```sh
sendMessage(newMessageText).catch((error) => {
  // Do something with your error here.
});
```
If you're using an async handled function you can also use try...catch:
```sh
try {
  await sendMessage(newMessageText);
} catch {
  // Do something with your error here.
}
```
If you handle your mutation error, it will no longer become an unhandled promise
rejection. You may need to report this error to your exception handling service
manually.
## Errors in action functions​
Unlike queries and mutations, actions may have
side-effects and therefore can't be automatically retried by Convex when errors
occur. For example, say your action sends a email. If it fails part-way through,
Convex has no way of knowing if the email was already sent and can't safely
retry the action. It is responsibility of the caller to handle errors raised by
actions and retry if appropriate.
## Differences in error reporting between dev and prod​
Using a dev deployment the server error thrown on the client will include the
original error message and a server-side stack trace to ease debugging.
Using a production deployment the server error will be redacted to only include
the name of the function and a generic "Server Error" message, with no stack
trace.
Both development and production deployments log full errors with stack traces
which can be found on the Logs page of a
given deployment.
## Expected failures​
If you have common ways that you expect your query and mutations to fail, it's
often simpler to use TypeScript union return types to communicate these cases
instead of exceptions.
For example, a createUser mutation could return Id | "EMAIL_ADDRESS_IN_USE"
to express that either the mutation succeeded or the email address was already
taken.
This ensures that you remember to handle these cases in your UI. It also saves
errors for unexpected bugs that should be fixed.
## Read/write limit errors​
To ensure uptime and guarantee performance, Convex will catch queries and
mutations that try to read or write too much data. These limits are enforced at
the level of a single query or mutation function execution. The limits are:
Queries and mutations error out when:
In addition, mutations error out when:
Documents are "scanned" by the database to figure out which documents should be
returned from db.query. So for example db.query("table").take(5).collect()
will only need to scan 5 documents, but db.query("table").filter(...).first()
might scan up to as many documents as there are in "table", to find the first
one that matches the given filter.
In general, if you're running into these limits frequently, we recommend
indexing your queries to reduce the number
of documents scanned, allowing you to avoid unnecessary reads. Queries that scan
large swaths of your data may look innocent at first, but can easily blow up at
any production scale. We're working on adding early warnings when we detect such
access patterns.



Page URL: https://docs.convex.dev/functions/runtimes

# Runtimes
Convex functions can run in two runtimes:
## Default Convex runtime​
All Convex backend functions are written in JavaScript or TypeScript. By default
all functions run in a custom JavaScript runtime very similar to the
Cloudflare Workers runtime
with access to most
web standard globals.
The default runtime has many advantages including:
### Restrictions on queries and mutations​
Query and mutation functions are further restricted by the runtime to be
deterministic. This
allows Convex to automatically retry them by the system as necessary.
Determinism means that no matter how many times your function is run, as long as
it is given the same arguments, it will have identical side effects and return
the same value.
You don't have to think all that much about maintaining these properties of
determinism when you write your Convex functions. Convex will provide helpful
error messages as you go, so you can't accidentally do something forbidden.
#### Using randomness and time in queries and mutations​
Convex provides a "seeded" strong pseudo-random number generator
at Math.random() so that it can guarantee the determinism of your function.
The random number generator's seed is an implicit parameter to your function.
Multiple calls to Math.random() in one function call will return different
random values. Note that Convex does not reevaluate the Javascript modules on
every function run, so a call to Math.random() stored in a global variable
will not change between function runs.
To ensure the logic within your function is reproducible, the system time used
globally (outside of any function) is "frozen" at deploy time, while the system
time during Convex function execution is "frozen" when the function
begins. Date.now() will return the same result for the entirety of your
function's execution. For example,
```sh
const globalRand = Math.random(); // `globalRand` does not change between runs.
const globalNow = Date.now(); // `globalNow` is the time when Convex functions were deployed.

export const updateSomething = mutation({
  handler: () => {
    const now1 = Date.now(); // `now1` is the time when the function execution started.
    const rand1 = Math.random(); // `rand1` has a new value for each function run.
    // implementation
    const now2 = Date.now(); // `now2` === `now1`
    const rand2 = Math.random(); // `rand1` !== `rand2`
  },
});
```
### Actions​
Actions are unrestricted by the same rules of determinism as query and mutation
functions. Notably actions are allowed to call third-party HTTP endpoints via
the browser-standard
fetch function.
By default actions also run in Convex’s custom JavaScript runtime with all of
it’s advantages including faster cold starts and a browser like API environment.
They can also live in the same file as your query and mutation functions.
## Node.js runtime​
Some JavaScript and TypeScript libraries use features that are not included in
the default Convex runtime. This is why Convex actions provide an escape hatch
to Node.js 18 via the "use node" directive at
the top of a file that contains your action.
Learn more.
Use of the Node.js environment is restricted to action functions only. If
you want to use a library designed for Node.js and interact with the Convex
database, you need to call the Node.js library from an action, and use
runQuery or
runMutation helper to call a
query or mutation.



Page URL: https://docs.convex.dev/database

# Database
The Convex database provides a relational data model, stores JSON-like
documents, and can be used with or without a schema. It "just works," giving you
predictable query performance in an easy-to-use interface.
Query and mutation functions read and write data through
a lightweight JavaScript API. There is nothing to set up, and no need to write
any SQL. Just use JavaScript to express your app's needs.
Start by learning about the basics of
Tables & Documents,
Reading Data and
Writing Data.
As your app grows more complex you'll need more from your database:



Page URL: https://docs.convex.dev/database/document-storage

# Tables & Documents
## Tables​
Your Convex deployment contains tables that hold your app's data. Initially,
your deployment contains no tables or documents.
Each table springs into existence as soon as you add the first document to it.
```sh
// `friends` table doesn't exist.
await ctx.db.insert("friends", { name: "Jamie" });
// Now it does, and it has one document.
```
You do not have to specify a schema up front or create tables explicitly.
## Documents​
Tables contain documents. Documents are very similar to JavaScript objects. They
have fields and values, and you can nest arrays or objects within them.
These are all valid Convex documents:
```sh
{}
{"name": "Jamie"}
{"name": {"first": "Arnold", "second": "Cole": 61}
```
They can also contain references to other documents in other tables. See
Data Types to learn more about the types supported in
Convex and Document IDs to learn about how to
use those types to model your data.



Page URL: https://docs.convex.dev/database/reading-data

# Reading Data
Query and
mutation functions can read data from
database tables using document ids and document queries.
## Reading a single document​
Given a single document's id you can read its data with the
db.get method:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTask = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    // do something with `task`
  },
});
```
Note: You should use the v.id validator like in the example above to make
sure you are not exposing data from tables other than the ones you intended.
## Querying documents​
Document queries always begin by choosing the table to query with the
db.query method:
```sh
import { query } from "./_generated/server";

export const listTasks = query({
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    // do something with `tasks`
  },
});
```
Then you can:
We'll see how this works in the examples below.
## Filtering​
The filter method allows you to
restrict the documents that your document query returns. This method takes a
filter constructed by FilterBuilder
and will only select documents that match.
The examples below demonstrate some of the common uses of filter. You can see
the full list of available filtering methods
in the reference docs.
If you need to filter to documents containing some keywords, use a
search query.
### Equality conditions​
This document query finds documents in the users table where
doc.name === "Alex":
```sh
// Get all users named "Alex".
const usersNamedAlex = await ctx.db
  .query("users")
  .filter((q) => q.eq(q.field("name"), "Alex"))
  .collect();
```
Here q is the FilterBuilder utility
object. It contains methods for all of our supported filter operators.
This filter will run on all documents in the table. For each document,
q.field("name") evaluates to the name property. Then q.eq checks if this
property is equal to "Alex".
If your query references a field that is missing from a given document then that
field will be considered to have the value undefined.
### Comparisons​
Filters can also be used to compare fields against values. This document query
finds documents where doc.age >= 18:
```sh
// Get all users with an age of 18 or higher.
const adults = await ctx.db
  .query("users")
  .filter((q) => q.gte(q.field("age"), 18))
  .collect();
```
Here the q.gte operator checks if the first argument (doc.age) is greater
than or equal to the second (18).
Here's the full list of comparisons:
### Arithmetic​
You can also include basic arithmetic in your queries. This document query finds
documents in the carpets table where doc.height * doc.width > 100:
```sh
// Get all carpets that have an area of over 100.
const largeCarpets = await ctx.db
  .query("carpets")
  .filter((q) => q.gt(q.mul(q.field("height"), q.field("width")), 100))
  .collect();
```
Here's the full list of arithmetic operators:
### Combining operators​
You can construct more complex filters using methods like q.and, q.or, and
q.not. This document query finds documents where
doc.name === "Alex" && doc.age >= 18:
```sh
// Get all users named "Alex" whose age is at least 18.
const adultAlexes = await ctx.db
  .query("users")
  .filter((q) =>
    q.and(q.eq(q.field("name"), "Alex"), q.gte(q.field("age"), 18))
  )
  .collect();
```
Here is a query that finds all users where
doc.name === "Alex" || doc.name === "Emma":
```sh
// Get all users named "Alex" or "Emma".
const usersNamedAlexOrEmma = await ctx.db
  .query("users")
  .filter((q) =>
    q.or(q.eq(q.field("name"), "Alex"), q.eq(q.field("name"), "Emma"))
  )
  .collect();
```
## Ordering​
By default Convex always returns documents ordered by
_creationTime.
You can use .order("asc" | "desc") to
pick whether the order is ascending or descending. If the order isn't specified,
it defaults to ascending.
```sh
// Get all messages, oldest to newest.
const messages = await ctx.db.query("messages").order("asc").collect();
```
```sh
// Get all messages, newest to oldest.
const messages = await ctx.db.query("messages").order("desc").collect();
```
If you need to sort on a field other than _creationTime and your document
query returns a small number of documents (on the order of hundreds rather than
thousands of documents), consider sorting in Javascript:
```sh
// Get top 10 most liked messages, assuming messages is a fairly small table:
const messages = await ctx.db.query("messages").collect();
const topTenMostLikedMessages = recentMessages
  .sort((a, b) => b.likes - a.likes)
  .slice(0, 10);
```
For document queries that return larger numbers of documents, you'll want to use
an index to improve the performance.
Document queries that use indexes will be
ordered based on the columns in the index
and can avoid slow table scans.
```sh
// Get the top 20 most liked messages of all time, using the "by_likes" index.
const messages = await ctx.db
  .query("messages")
  .withIndex("by_likes", (q) => q)
  .order("desc")
  .take(20);
```
See
Limit expressions with indexes
for details.
## Retrieving results​
Most of our previous examples have ended the document query with the
.collect() method, which returns all
the documents that match your filters. Here are the other options for retrieving
results.
### Taking n results​
.take(n) selects only the first n
results that match your query.
```sh
const users = await ctx.db.query("users").take(5);
```
### Finding the first result​
.first() selects the first document that
matches your query and returns null if no documents were found.
```sh
// We expect only one user with that email address.
const userOrNull = await ctx.db
  .query("users")
  .filter((q) => q.eq(q.field("email"), "test@example.com"))
  .first();
```
### Using a unique result​
.unique() selects the single document
from your query or returns null if no documents were found. If there are
multiple results it will throw an exception.
```sh
// Our counter table only has one document.
const counterOrNull = await ctx.db.query("counter").unique();
```
### Loading a page of results​
.paginate(opts) loads a page
of results and returns a Cursor for loading
additional results.
See Paginated Queries to learn more.
## More complex queries​
Convex prefers to have a few, simple ways to walk through and select documents
from tables. When there is complex logic to perform, like an aggregation, a
group by, or a join, the way to solve that in Convex is different than many of
the databases you're used to.
In Convex, instead of using some specific query language, you can just write the
complex logic in JavaScript!
Here's an example of computing an average:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const averagePurchasePrice = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userPurchases = await ctx.db
      .query("purchases")
      .filter((q) => q.eq(q.field("buyer"), args.email))
      .collect();
    const sum = userPurchases.reduce((a, { value: b }) => a + b, 0);
    return sum / userPurchases.length;
  },
});
```
Table join might look like:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const eventAttendees = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    return Promise.all(
      event?.attendeeIds.map((userId) => ctx.db.get(userId)) ?? []
    );
  },
});
```
## Querying performance and limits​
Most of the example document queries above can lead to a full table scan. That
is, for the document query to return the requested results, it might need to
walk over every single document in the table.
Take this simple example:
```sh
const tasks = await ctx.db.query("tasks").take(5);
```
This document query will not scan more than 5 documents.
On the other hand, this document query:
```sh
const tasks = await ctx.db
  .query("tasks")
  .filter((q) => q.eq(q.field("isCompleted"), true))
  .first();
```
might need to walk over every single document in the "tasks" table just to
find the first one with isCompleted: true.
If a table has more than a few thousand documents, you should use
indexes to improve your document query
performance. Otherwise, you may run into enforced limits, detailed
here.



Page URL: https://docs.convex.dev/database/writing-data

# Writing Data
Mutations can insert, update, and
remove data from database tables.
## Inserting new documents​
You can create new documents in the database with the
db.insert method:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", { text: args.text });
    // do something with `taskId`
  },
});
```
The second argument to db.insert is a JavaScript object with data for the new
document.
The same types of values that can be passed into and returned from
queries and
mutations can be written into the
database. See Data Types for the full list of
supported types.
The insert method returns a globally unique ID for the newly inserted
document.
## Updating existing documents​
Given an existing document ID the document can be updated using the following
methods:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const updateTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    // { text: "foo", status: { done: true }, _id: ... }

    // Add `tag` and overwrite `status`:
    await ctx.db.patch(id, { tag: "bar", status: { archived: true } });
    console.log(await ctx.db.get(id));
    // { text: "foo", tag: "bar", status: { archived: true }, _id: ... }

    // Unset `tag` by setting it to `undefined`
    await ctx.db.patch(id, { tag: undefined });
    console.log(await ctx.db.get(id));
    // { text: "foo", status: { archived: true }, _id: ... }
  },
});
```
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const replaceTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const { id } = args;
    console.log(await ctx.db.get(id));
    // { text: "foo", _id: ... }

    // Replace the whole document
    await ctx.db.replace(id, { invalid: true });
    console.log(await ctx.db.get(id));
    // { invalid: true, _id: ... }
  },
});
```
## Deleting documents​
Given an existing document ID the document can be removed from the table with
the db.delete method.
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
```
## Write performance and limits​
To prevent accidental writes of large amounts of records, queries and mutations
enforce limits detailed
here.



Page URL: https://docs.convex.dev/database/document-ids

# Document IDs
Example:
Relational Data Modeling
Every document in convex has a globally unique string document ID that is
automatically generated by the system.
```sh
const userId = await ctx.db.insert("users", { name: "Michael Jordan" });
```
You can use this ID to efficiently read a single document using the get
method:
```sh
const retrievedUser = await ctx.db.get(userId);
```
You can access the ID of a document in the
_id field:
```sh
const userId = retrievedUser._id;
```
Also, this same ID can be used to update that document in place:
```sh
await ctx.db.patch(userId, { name: "Steph Curry" });
```
Convex generates an Id TypeScript type based
on your schema that is parameterized over your
table names:
```sh
import { Id } from "./_generated/dataModel";

const userId: Id<"users"> = user._id;
```
IDs are strings at runtime, but the Id type
can be used to distinguish IDs from other strings at compile time.
## References and relationships​
In Convex, you can reference a document simply by embedding its Id in another
document:
```sh
await ctx.db.insert("books", {
  title,
  ownerId: user._id,
});
```
You can follow references with db.get:
```sh
const user = await ctx.db.get(book.ownerId);
```
And query for documents with a reference:
```sh
const myBooks = await ctx.db
  .query("books")
  .filter((q) => q.eq(q.field("ownerId"), user._id))
  .collect();
```
Using Ids as references can allow you to build a complex data model.
## Trading off deeply nested documents vs. relationships​
While it's useful that Convex supports nested objects and arrays, should keep
documents relatively small in size. In practice, we recommend limiting Arrays to
no more than 5-10 elements and avoiding deeply nested Objects.
Instead, leverage separate tables, documents, and references to structure your
data. This will lead to better maintainability and performance as your project
grows.
## Serializing IDs​
IDs are strings, which can be easily inserted into URLs or stored outside of
Convex.
You can pass an ID string from an external source (like a URL) into a Convex
function and get the corresponding object. Since this ID is coming from an
external source, use an argument validator or db.normalizeId to confirm that
the ID belongs to the expected table before returning the object.
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    // ...
  },
});
```



Page URL: https://docs.convex.dev/database/types

# Data Types
All Convex documents are defined as Javascript objects. These objects can have
field values of any of the types below.
You can codify the shape of documents within your tables by
defining a schema.
## Convex values​
Convex supports the following types of values:
## System fields​
Every document in Convex has two automatically-generated system fields:
## Limits​
Convex values must be less than 1MB in total size. This is an approximate limit
for now, but if you're running into these limits and would like a more precise
method to calculate a document's size,
reach out to us. Documents can have nested
values, either objects or arrays that contain other Convex types. Convex types
can have at most 16 levels of nesting, and the cumulative size of a nested tree
of values must be under the 1MB limit.
Table names may contain alphanumeric characters ("a" to "z", "A" to "Z", and "0"
to "9") and underscores ("_"), and they cannot start with an underscore.
If any of these limits don't work for you,
let us know!



Page URL: https://docs.convex.dev/database/schemas

# Schemas
A schema is a description of
While it is possible to use Convex without defining a schema, adding a
schema.ts file will ensure that the documents in your tables are the correct
type. If you're using TypeScript, adding a schema will
also give you end-to-end type safety throughout your app.
We recommend beginning your project without a schema for rapid prototyping and
then adding a schema once you've solidified your plan. To learn more see our
Schema Philosophy.
Example:
TypeScript and Schemas
## Writing schemas​
Schemas are defined in a schema.ts file in your convex/ directory and look
like:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
```
This schema (which is based on our
users and auth example),
has 3 tables: channels, messages, and users. Each table is defined using the
defineTable function. Within each table,
the document type is defined using the validator builder,
v. In addition to the fields listed, Convex will also
automatically add _id and _creationTime fields. To learn more, see
System Fields.
While writing your schema, it can be helpful to consult the
Convex Dashboard. The
"Generate Schema" button in the "Data" view suggests a schema declaration based
on the data in your tables.
### Validators​
The validator builder, v is used to define the type
of documents in each table. It has methods for each of
Convex's types:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    id: v.id("documents"),
    string: v.string(),
    number: v.number(),
    boolean: v.boolean(),
    nestedObject: v.object({
      property: v.string(),
    }),
  }),
});
```
It additionally allows you to define unions, optional property, string literals,
and more. Argument validation and schemas
both use the same validator builder, v.
#### Optional fields​
You can describe optional fields by wrapping their type with v.optional(...):
```sh
defineTable({
  optionalString: v.optional(v.string()),
  optionalNumber: v.optional(v.number()),
});
```
This corresponds to marking fields as optional with ? in TypeScript.
#### Unions​
You can describe fields that could be one of multiple types using v.union:
```sh
defineTable({
  stringOrNumber: v.union(v.string(), v.number()),
});
```
If your table stores multiple different types of documents, you can use
v.union at the top level:
```sh
defineTable(
  v.union(
    v.object({
      kind: v.literal("StringDocument"),
      value: v.string(),
    }),
    v.object({
      kind: v.literal("NumberDocument"),
      value: v.number(),
    })
  )
);
```
In this schema, documents either have a kind of "StringDocument" and a
string for their value:
```sh
{
  "kind": "StringDocument",
  "value": "abc"
}
```
or they have a kind of "NumberDocument" and a number for their value:
```sh
{
  "kind": "NumberDocument",
  "value": 123
}
```
#### Literals​
Fields that are a constant can be expressed with v.literal:
```sh
defineTable({
  oneTwoOrThree: v.union(
    v.literal("one"),
    v.literal("two"),
    v.literal("three")
  ),
});
```
#### Any​
Fields or documents that could take on any value can be represented with
v.any():
```sh
defineTable({
  anyValue: v.any(),
});
```
This corresponds to the any type in TypeScript.
### Options​
These options are passed as part of the
options argument to
defineSchema.
#### schemaValidation: boolean​
Whether Convex should validate at runtime that your documents match your schema.
By default, Convex will enforce that all new and existing documents match your
schema.
You can disable schemaValidation by passing in schemaValidation: false:
```sh
defineSchema(
  {
    // Define tables here.
  },
  {
    schemaValidation: false,
  }
);
```
When schemaValidation is disabled, Convex will not validate that new or
existing documents match your schema. You'll still get schema-specific
TypeScript types, but there will be no validation at runtime that your documents
match those types.
#### strictTableNameTypes: boolean​
Whether the TypeScript types should allow accessing tables not in the schema.
By default, the TypeScript table name types produced by your schema are strict.
That means that they will be a union of strings (ex. "messages" | "channels")
and only support accessing tables explicitly listed in your schema.
Sometimes it's useful to only define part of your schema. For example, if you
are rapidly prototyping, it could be useful to try out a new table before adding
it your schema.ts file.
You can disable strictTableNameTypes by passing in
strictTableNameTypes: false:
```sh
defineSchema(
  {
    // Define tables here.
  },
  {
    strictTableNameTypes: false,
  }
);
```
When strictTableNameTypes is disabled, the TypeScript types will allow access
to tables not listed in the schema and their document type will be any.
Regardless of the value of strictTableNameTypes, your schema will only
validate documents in the tables listed in the schema. You can still create and
modify documents in other tables in JavaScript or on the dashboard (they just
won't be validated).
## Schema validation​
Schemas are pushed automatically in
npx convex dev and
npx convex deploy.
The first push after a schema is added or modified will validate that all
existing documents match the schema. If there are documents that fail
validation, the push will fail.
After the schema is pushed, Convex will validate that all future document
inserts and updates match the schema.
Schema validation is skipped if schemaValidation
is set to false.
Note that schemas only validate documents in the tables listed in the schema.
You can still create and modify documents in other tables (they just won't be
validated).
### Circular references​
You might want to define a schema with circular ID references like:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    preferencesId: v.id("preferences"),
  }),
  preferences: defineTable({
    userId: v.id("users"),
  }),
});
```
In this schema, documents in the users table contain a reference to documents
in preferences and vice versa.
Because schema validation enforces your schema on every db.insert,
db.replace, and db.patch call, creating circular references like this is not
possible.
The easiest way around this is to make one of the references nullable:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    preferencesId: v.id("preferences"),
  }),
  preferences: defineTable({
    userId: v.union(v.id("users"), v.null()),
  }),
});
```
This way you can create a preferences document first, then create a user
document, then set the reference on the preferences document:
```sh
import { mutation } from "./_generated/server";

export default mutation(async (ctx) => {
  const preferencesId = await ctx.db.insert("preferences", {});
  const userId = await ctx.db.insert("users", { preferencesId });
  await ctx.db.patch(preferencesId, { userId });
});
```
Les us know if you need better support for
circular references.
## TypeScript types​
Once you've defined a schema,
npx convex dev will produce new
versions of dataModel.d.ts and
server.d.ts with types based on your schema.
### Doc<TableName>​
The Doc TypeScript type from
dataModel.d.ts provides document types for all of
your tables. You can use these both when writing Convex functions and in your
React components:
```sh
import { Doc } from "../convex/_generated/dataModel";

function MessageView(props: { message: Doc<"messages"> }) {
  ...
}
```
If you need the type for a portion of a document, use the
Infer type helper.
### query and mutation​
The query and
mutation functions in
server.js have the same API as before but now provide
a db with more precise types. Functions like
db.insert(table, document) now
understand your schema. Additionally
database queries will now return the correct
document type (not any).



Page URL: https://docs.convex.dev/database/pagination

# Paginated Queries
Paginated queries are queries that return
a list of results in incremental pages.
This can be used to build components with "Load More" buttons or "infinite
scroll" UIs where more results are loaded as the user scrolls.
Example:
Paginated Messaging App
Using pagination in Convex is as simple as:
Like other Convex queries, paginated queries are completely reactive.
Paginated queries are currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!
## Writing paginated query functions​
Convex uses cursor-based pagination. This means that paginated queries return a
string called a Cursor that represents the point
in the results that the current page ended. To load more results, you simply
call the query function again, passing in the cursor.
To build this in Convex, define a query function that:
```sh
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const foo = await ctx.db
      .query("messages")
      .order("desc")
      .paginate(args.paginationOpts);
    return foo;
  },
});
```
### Additional arguments​
You can define paginated query functions that take arguments in addition to
paginationOpts:
```sh
export const listWithExtraArg = query({
  args: { paginationOpts: paginationOptsValidator, author: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("author"), args.author))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```
## Paginating within React Components​
To paginate within a React component, use the
usePaginatedQuery hook. This hook
gives you a simple interface for rendering the current items and requesting
more. Internally, this hook manages the continuation cursors.
The arguments to this hook are:
The hook returns an object with:
```sh
import { usePaginatedQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.list,
    {},
    { initialNumItems: 5 }
  );
  return (
    <div>
      {results?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
      <button onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Load More
      </button>
    </div>
  );
}
```
You can also pass additional arguments in the arguments object if your function
expects them:
```sh
import { usePaginatedQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.listWithExtraArg,
    { author: "Alex" },
    { initialNumItems: 5 }
  );
  return (
    <div>
      {results?.map(({ _id, text }) => (
        <div key={_id}>{text}</div>
      ))}
      <button onClick={() => loadMore(5)} disabled={status !== "CanLoadMore"}>
        Load More
      </button>
    </div>
  );
}
```
### Reactivity​
Like any other Convex query functions, paginated queries are completely
reactive. Your React components will automatically rerender if items in your
paginated list are added, removed or changed.
One consequence of this is that page sizes in Convex may change! If you
request a page of 10 items and then one item is removed, this page may "shrink"
to only have 9 items. Similarly if new items are added, a page may "grow" beyond
its initial size.
## Paginating manually​
If you're paginating outside of React, you can manually call your paginated
function multiple times to collect the items:
```sh
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

require("dotenv").config();

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

/**
 * Logs an array containing all messages from the paginated query "listMessages"
 * by combining pages of results into a single array.
 */
async function getAllMessages() {
  let continueCursor = null;
  let isDone = false;
  let page;

  const results = [];

  while (!isDone) {
    ({ continueCursor, isDone, page } = await client.query(api.messages.list, {
      paginationOpts: { numItems: 5, cursor: continueCursor },
    }));
    console.log("got", page.length);
    results.push(...page);
  }

  console.log(results);
}

getAllMessages();
```



Page URL: https://docs.convex.dev/database/indexes/

# Indexes
Indexes are a data structure that allow you to speed up your
document queries by
telling Convex how to organize your documents. Indexes also allow you to change
the order of documents in query results.
For a more in-depth introduction to indexing see
Indexes and Query Performance.
## Defining indexes​
Indexes are defined as part of your Convex schema.
Each index consists of:
To add an index onto a table, use the
index method on your table's
schema:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define a messages table with two indexes.
export default defineSchema({
  messages: defineTable({
    channel: v.id("channels"),
    body: v.string(),
    user: v.id("users"),
  })
    .index("by_channel", ["channel"])
    .index("by_channel_user", ["channel", "user"]),
});
```
The by_channel index is ordered by the channel field defined in the schema.
For messages in the same channel, they are ordered by the
system-generated _creationTime field
which is added to all indexes automatically.
By contrast, the by_channel_user index orders messages in the same channel
by the user who sent them, and only then by _creationTime.
Indexes are created in
npx convex dev and
npx convex deploy.
You may notice that the first deploy that defines an index is a bit slower than
normal. This is because Convex needs to backfill your index. The more data in
your table, the longer it will take Convex to organize it in index order. If
this is problematic for your workflow,
contact us.
You can feel free to query an index in the same deploy that defines it. Convex
will ensure that the index is backfilled before the new query and mutation
functions are registered.
In addition to adding new indexes, npx convex deploy will delete indexes that
are no longer present in your schema. Make sure that your indexes are completely
unused before removing them from your schema!
## Querying documents using indexes​
A query for "messages in channel created 1-2 minutes ago" over the
by_channel index would look like:
```sh
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) =>
    q
      .eq("channel", channel)
      .gt("_creationTime", Date.now() - 2 * 60000)
      .lt("_creationTime", Date.now() - 60000)
  )
  .collect();
```
The .withIndex method
defines which index to query and how Convex will use that index to select
documents. The first argument is the name of the index and the second is an
index range expression. An index range expression is a description of which
documents Convex should consider when running the query.
The choice of index both affects how you write the index range expression and
what order the results are returned in. For instance, by making both a
by_channel and by_channel_user index, we can get results within a channel
ordered by _creationTime or by user, respectively. If you were to use the
by_channel_user index like this:
```sh
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel_user", (q) => q.eq("channel", channel))
  .collect();
```
The results would be all of the messages in a channel ordered by user, then
by _creationTime. If you were to use by_channel_user like this:
```sh
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel_user", (q) =>
    q.eq("channel", channel).eq("user", user)
  )
  .collect();
```
The results would be the messages in the given channel sent by user, ordered
by _creationTime.
An index range expression is always a chained list of:
You must step through fields in index order.
Each equality expression must compare a different index field, starting from the
beginning and in order. The upper and lower bounds must follow the equality
expressions and compare the next field.
For example, it is not possible to write a query like:
```sh
// DOES NOT COMPILE!
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) =>
    q
      .gt("_creationTime", Date.now() - 2 * 60000)
      .lt("_creationTime", Date.now() - 60000)
  )
  .collect();
```
This query is invalid because the by_channel index is ordered by
(channel, _creationTime) and this query range has a comparison on
_creationTime without first restricting the range to a single channel.
Because the index is sorted first by channel and then by _creationTime, it
isn't a useful index for finding messages in all channels created 1-2 minutes
ago. The TypeScript types within withIndex will guide you through this.
To better understand what queries can be run over which indexes, see
Introduction to Indexes and Query Performance.
The performance of your query is based on the specificity of the range.
For example, if the query is
```sh
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", (q) =>
    q
      .eq("channel", channel)
      .gt("_creationTime", Date.now() - 2 * 60000)
      .lt("_creationTime", Date.now() - 60000)
  )
  .collect();
```
then query's performance would be based on the number of messages in channel
created 1-2 minutes ago.
If the index range is not specified, all documents in the index will be
considered in the query.
For performance, define index ranges that are as specific as possible! If you
are querying a large table and you're unable to add any equality conditions with
.eq, you should consider defining a new index.
.withIndex is designed to only allow you to specify ranges that Convex can
efficiently use your index to find. For all other filtering you can use the
.filter method.
For example to query for "messages in channel not created by me" you could
do:
```sh
const messages = await ctx.db
  .query("messages")
  .withIndex("by_channel", q => q.eq("channel", channel))
  .filter(q => q.neq(q.field("user"), myUserId)
  .collect();
```
In this case the performance of this query will be based on how many messages
are in the channel. Convex will consider each message in the channel and only
return the messages where the user field matches myUserId.
## Sorting with indexes​
Queries that use withIndex are ordered by the columns specified in the index.
The order of the columns in the index dictates the priority for sorting. The
values of the columns listed first in the index are compared first. Subsequent
columns are only compared as tie breakers only if all earlier columns match.
Since Convex automatically includes _creationTime as the last column in all
indexes, _creationTime will always be the final tie breaker if all other
columns in the index are equal.
For example, by_channel_user includes channel, user, and \_creationTime.
So queries on messages that use .withIndex("by_channel_user") will be sorted
first by channel, then by user within each channel, and finally by the creation
time.
Sorting with indexes allows you to satisfy use cases like displaying the top N
scoring users, the most recent N transactions, or the the most N liked
messages.
For example, to get the top 10 highest scoring players in your game, you might
define an index on the player's highest score:
```sh
export default defineSchema({
  players: defineTable({
    username: v.string(),
    highestScore: v.number(),
  }).index("by_highest_score", ["highestScore"]),
});
```
You can then efficiently find the top 10 highest scoring players using your
index and take(10):
```sh
const topScoringPlayers = await ctx.db
  .query("users")
  .withIndex("by_highest_score")
  .order("desc")
  .take(10);
```
In this example, the range expression is omitted because we're looking for the
highest scoring players of all time. This particular query is reasonably
efficient for large data sets only because we're using take().
If you use an index without a range expression, you should always use one of the
following in conjunction with withIndex:
These APIs allow you to efficiently limit your query to a reasonable size
without performing a full table scan.
When your query fetches documents from the database, it will scan the rows in
the range you specify. If you are using .collect(), for instance, it will scan
all of the rows in the range. So if you use withIndex without a range
expression, you will be
scanning the whole table,
which can be slow when your table has thousands of rows. .filter() doesn't
affect which documents are scanned. Using .first() or .unique() or
.take(n) will only scan rows until it has enough documents.
You can include a range expression to satisfy more targeted queries. For
example, to get the top scoring players in Canada, you might use both take()
and a range expression:
```sh
// query the top 10 highest scoring players in Canada.
const topScoringPlayers = await ctx.db
  .query("users")
  .withIndex("by_country_highest_score", (q) => q.eq("country", "CA"))
  .order("desc")
  .take(10);
```
## Limits​
Convex supports indexes containing up to 16 fields. You can define 32 indexes on
each table. Indexes can't contain duplicate fields.
No reserved fields (starting with _) are allowed in indexes. The
_creationTime field is automatically added to the end of every index to ensure
a stable ordering. It should not be added explicitly in the index definition,
and it's counted towards the index fields limit.
The by_creation_time index is created automatically (and is what is used in
database queries that don't specify an index). The by_id index is reserved.



Page URL: https://docs.convex.dev/database/indexes/indexes-and-query-perf

# Introduction to Indexes and Query Performance
How do I ensure my Convex database queries
are fast and efficient? When should I define an
index? What is an index?
This document explains how you should think about query performance in Convex by
describing a simplified model of how queries and indexes function.
If you already have a strong understanding of database queries and indexes you
can jump straight to the reference documentation instead:
## A Library of Documents​
You can imagine that Convex is a physical library storing documents as physical
books. In this world, every time you add a document to Convex with
db.insert("books", {...}) a
librarian places the book on a shelf.
By default, Convex organizes your documents in the order they were inserted. You
can imagine the librarian inserting documents left to right on a shelf.
If you run a query to find the first book like:
```sh
const firstBook = await ctx.db.query("books").first();
```
then the librarian could start at the left edge of the shelf and find the first
book. This is an extremely fast query because the librarian only has to look at
a single book to get the result.
Similarly, if we want to retrieve the last book that was inserted we could
instead do:
```sh
const lastBook = await ctx.db.query("books").order("desc").first();
```
This is the same query but we've swapped the order to descending. In the
library, this means that the librarian will start on the right edge of the shelf
and scan right-to-left. The librarian still only needs to look at a single book
to determine the result so this query is also extremely fast.
## Full Table Scans​
Now imagine that someone shows up at the library and asks "what books do you
have by Jane Austen?"
This could be expressed as:
```sh
const books = await ctx.db
  .query("books")
  .filter((q) => q.eq(q.field("author"), "Jane Austen"))
  .collect();
```
This query is saying "look through all of the books, left-to-right, and collect
the ones where the author field is Jane Austen." To do this the librarian will
need to look through the entire shelf and check the author of every book.
This query is a full table scan because it requires Convex to look at every
document in the table. The performance of this query is based on the number of
books in the library.
If your Convex table has a small number of documents, this is fine! Full table
scans should still be fast if there are a few hundred documents, but if the
table has many thousands of documents these queries will become slow.
In the library analogy, this kind of query is fine if the library has a single
shelf. As the library expands into a bookcase with many shelves or many
bookcases, this approach becomes infeasible.
## Card Catalogs​
How can we more efficiently find books given an author?
One option is to re-sort the entire library by author. This will solve our
immediate problem but now our original queries for firstBook and lastBook
would become full table scans because we'd need to examine every book to see
which was inserted first/last.
Another option is to duplicate the entire library. We could purchase 2 copies of
every book and put them on 2 separate shelves: one shelf sorted by insertion
time and another sorted by author. This would work, but it's expensive. We now
need twice as much space for our library.
A better option is to build an index on author. In the library, we could use
an old-school card catalog to
organize the books by author. The idea here is that the librarian will write an
index card for each book that contains:
These index cards will be sorted by author and live in a separate organizer from
the shelves that hold the books. The card catalog should stay small because it
only has an index card per book (not the entire text of the book).

When a patron asks for "books by Jane Austen", the librarian can now:
This is quite fast because the librarian can quickly find the index cards for
Jane Austen. It's still a little bit of work to find the book for each card but
the number of index cards is small so this is quite fast.
## Indexes​
Database indexes work based on the same concept! With Convex you can define an
index with:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    author: v.string(),
    title: v.string(),
    text: v.string(),
  }).index("by_author", ["author"]),
});
```
then Convex will create a new index called by_author on author. This means
that your books table will now have an additional data structure that is
sorted by the author field.
You can query this index with:
```sh
const austenBooks = await ctx.db
  .query("books")
  .withIndex("by_author", (q) => q.eq("author", "Jane Austen"))
  .collect();
```
This query instructs Convex to go to the by_author index and find all the
entries where doc.author === "Jane Austen". Because the index is sorted by
author, this is a very efficient operation. This means that Convex can execute
this query in the same manner that the librarian can:
The performance of this query is based on the number of documents where
doc.author === "Jane Austen" which should be quite small. We've dramatically
sped up the query!
## Backfilling and Maintaining Indexes​
One interesting detail to think about is the work needed to create this new
structure. In the library, the librarian must go through every book on the shelf
and put a new index card for each one in the card catalog sorted by author. Only
after that can the librarian trust that the card catalog will give it correct
results.
The same is true for Convex indexes! When you define a new index, the first time
you run npx convex deploy Convex will need to loop through all of your
documents and index each one. This is why the first deploy after the creation of
a new index will be slightly slower than normal; Convex has to do a bit of work
for each document in your table.
Similarly, even after an index is defined, Convex will have to do a bit of extra
work to keep this index up to date as the data changes. Every time a document is
inserted, updated, or deleted in an indexed table, Convex will also update its
index entry. This is analogous to a librarian creating new index cards for new
books as they add them to the library.
If you are defining a few indexes there is no need to worry about the
maintenance cost. As you define more indexes, the cost to maintain them grows
because every insert needs to update every index. This is why Convex has a
limit of 32 indexes per table. In practice most applications define a handle of
indexes per table to make their important queries efficient.
## Indexing Multiple Fields​
Now imagine that a patron shows up at the library and would like to check out
Foundation by Isaac Asimov. Given our index on author, we can write a query
that uses the index to find all the books by Isaac Asimov and then examines the
title of each book to see if it's Foundation.
```sh
const foundation = await ctx.db
  .query("books")
  .withIndex("by_author", (q) => q.eq("author", "Isaac Asimov"))
  .filter((q) => q.eq(q.field("title"), "Foundation"))
  .unique();
```
This query describes how a librarian might execute the query. The librarian will
use the card catalog to find all of the index cards for Isaac Asimov's books.
The cards themselves don't have the title of the book so the librarian will need
to find every Asimov book on the shelves and look at its title to find the one
named Foundation. Lastly, this query ends with
.unique because we expect there to be
at most one result.
This query demonstrates the difference between filtering using
withIndex and
filter. withIndex only allows you to
restrict your query based on the index. You can only do operations that the
index can do efficiently like finding all documents with a given author.
filter on the other hand allows you to write arbitrary, complex expressions
but it won't be run using the index. Instead, filter expressions will be
evaluated on every document in the range.
Given all of this, we can conclude that the performance of indexed queries is
based on how many documents are in the index range. In this case, the
performance is based on the number of Isaac Asimov books because the librarian
will need to look at each one to examine its title.
Unfortunately, Isaac Asimov wrote
a lot of books.
Realistically even with 500+ books, this will be fast enough on Convex with the
existing index, but let's consider how we could improve it anyway.
One approach is to build a separate by_title index on title. This could let
us swap the work we do in .filter and .withIndex to instead be:
```sh
const foundation = await ctx.db
  .query("books")
  .withIndex("by_title", (q) => q.eq("title", "Foundation"))
  .filter((q) => q.eq(q.field("author"), "Isaac Asimov"))
  .unique();
```
In this query, we're efficiently using the index to find all the books called
Foundation and then filtering through to find the one by Isaac Asimov.
This is okay, but we're still at risk of having a slow query because too many
books have a title of Foundation. An even better approach could be to build a
compound index that indexes both author and title. Compound indexes are
indexes on an ordered list of fields.
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    author: v.string(),
    title: v.string(),
    text: v.string(),
  }).index("by_author_title", ["author", "title"]),
});
```
In this index, books are sorted first by the author and then within each author
by title. This means that a librarian can use the index to jump to the Isaac
Asimov section and quickly find Foundation within it.
Expressing this as a Convex query this looks like:
```sh
const foundation = await ctx.db
  .query("books")
  .withIndex("by_author_title", (q) =>
    q.eq("author", "Isaac Asimov").eq("title", "Foundation")
  )
  .unique();
```
Here the index range expression tells Convex to only consider documents where
the author is Isaac Asimov and the title is Foundation. This is only a single
document so this query will be quite fast!
Because this index sorts by author and then by title, it also efficiently
supports queries like "All books by Isaac Asimov that start with F." We could
express this as:
```sh
const asimovBooksStartingWithF = await ctx.db
  .query("books")
  .withIndex("by_author_title", (q) =>
    q.eq("author", "Isaac Asimov").gte("title", "F").lt("title", "G")
  )
  .collect();
```
This query uses the index to find books where
author === "Isaac Asimov" && "F" <= title < "G". Once again, the performance
of this query is based on how many documents are in the index range. In this
case, that's just the Asimov books that begin with "F" which is quite small.
Also note that this index also supports our original query for "books by Jane
Austen." It's okay to only use the author field in an index range expression
and not restrict by title at all.
Lastly, imagine that a library patron asks for the book The Three-Body Problem
but they don't know the author's name. Our by_author_title index won't help us
here because it's sorted first by author, and then by title. The title, The
Three-Body Problem, could appear anywhere in the index!
The Convex TypeScript types in the withIndex make this clear because they
require that you compare index fields in order. Because the index is defined on
["author", "title"], you must first compare the author with .eq before the
title.
In this case, the best option is probably to create the separate by_title
index to facilitate this query.
## Conclusions​
Congrats! You now understand how queries and indexes work within Convex!
Here are the main points we've covered:
To learn more about queries and indexes, check out our reference documentation:



Page URL: https://docs.convex.dev/database/import-export/

# Import & Export
If you're bootstrapping your app from existing data, Convex provides two ways to
get the data in:
You can export data from Convex to run a quick analysis or connect to a custom
BI setup:
Import & Export is currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!



Page URL: https://docs.convex.dev/database/import-export/airbyte

# Using Convex with Airbyte
Airbyte is a data-integration platform that allows you to
sync your Convex data with other databases.
Using Airbyte enables streaming import from any of their
supported sources into
Convex and streaming export from Convex into any of their
supported destinations.
The Convex team maintains a Convex source connector for streaming export and a
Convex destination connector for streaming import.
Airbyte integration is currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!
## Streaming Export​
Exporting data can be useful for handling workloads that aren't supported by
Convex directly. Some use cases include:
Streaming export using the Convex source connector requires a
Convex Professional Plan. See the Airbyte docs
on how to set up the Convex source connector
here.
## Streaming Import​
Adopting new technologies can be a slow, daunting process, especially when the
technologies involve databases. Streaming import enables adopting Convex
alongside your existing stack without having to write your own migration or data
sync tooling. Some use cases include:
A common use case is to "mirror" a table in the source database to Convex to
build something new using Convex. We recommend leaving imported
tables as read-only in Convex because syncing the results back to the source
database could result in dangerous write conflicts. While Convex doesn't yet
have access controls that would ensure a table is read-only, you can make sure that
there are no mutations or actions writing to imported tables in your code and avoid editing
documents in imported tables in the dashboard.
Streaming import is included with all Convex plans. See the Airbyte docs on how
to set up the Convex destination connector
here.



Page URL: https://docs.convex.dev/database/import-export/export

# Exporting Data Snapshots
You can export your data from Convex using Snapshot export, which you can find
in the settings page of your project in the dashboard.

Snapshot export is currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!
When you request an export, Convex will generate a JSON file for each Convex
table in your deployment with the latest version of every document at the time
of your request. This may take a few seconds or a few minutes, depending on how
much data is in your deployment. You can download the files by clicking on the
links in the Latest Snapshot table. Each export is a consistent snapshot of your
data at the time of your request, and each JSON is an array of documents from a
single table, ordered by _id.

## FAQ​
### Can I use snapshot export as a backup?​
Right now, you can only access one export at a time, so this is not an automated
backup system. You are welcome to download your tables routinely, and feel free
to chime in on Discord if you would like to see
better support for backups.
### Are there any limitations?​
Snapshot export is only available for deployments with less than 128 tables.
Each export is accessible for up to 14 days (if no more exports are requested).
There is no limit to how many exports you can request.



Page URL: https://docs.convex.dev/database/advanced/schema-philosophy

# Schema Philosophy
With Convex there is no need to write any CREATE TABLE statements, or think
through your stored table structure ahead of time so you can name your field and
types. You simply put your objects into Convex and keep building your app!
However, moving fast early can be problematic later. "Was that field a number or
a string? I think I changed it when I fixed that one bug?"
Storage systems which are too permissive can sometimes become liabilities as
your system matures and you want to be able to reason assuredly about exactly
what data is in your system.
The good news is Convex is always typed. It's just implicitly typed! When you
submit a document to Convex, tracks all the types of all the fields in your
document. You can go to your dashboard and view the
inferred schema of any table to understand what you've ended up with.
"What about that field I changed from a string to a number?" Convex can handle
this too. Convex will track those changes, in this case the field is a union
like v.union(v.number(), v.string()). That way even when you change your mind
about your documents fields and types, Convex has your back.
Once you are ready to formalize your schema, you can define it using our
schema builder to enable schema validation and
generate types based on it.



Page URL: https://docs.convex.dev/database/advanced/occ

# OCC and Atomicity
In Queries, we mentioned that determinism
as important in the way optimistic concurrency control (OCC) was used within
Convex. In this section, we'll dive much deeper into why.
## Convex Financial, Inc.​
Imagine that you're building a banking app, and therefore your databases stores
accounts with balances. You want your users to be able to give each other money,
so you write a mutation function that transfers funds from one user's account to
another.
One run of that transaction might read Alice's account balance, and then Bob's.
You then propose to deduct $5 from Alice's account and increase Bob's balance by
the same $5.
Here's our pseudocode:
```sh
$14 <- READ Alice
$11 <- READ Bob
WRITE Alice $9
WRITE Bob $16
```
This ledger balance transfer is a classic database scenario that requires a
guarantee that these write operations will only apply together. It is a really
bad thing if only one operation succeeds!
```sh
$14 <- READ Alice
$11 <- READ Bob
WRITE Alice $9
*crash* // $5 lost from your bank
```
You need a guarantee that this can never happen. You require transaction
atomicity, and Convex provides it.
The problem of data correctness is much deeper. Concurrent transactions that
read and edit the same records can create data races.
In the case of our app it's entirely possible that someone deducts Alice's
balance right after we read it. Maybe she bought a Coke Zero at the airport with
her debit card for $3.
```sh
$5 Transfer                           $3 Debit Card Charge
----------------------------------------------------------
$14 <- READ Alice
$11 <- READ Bob
                                        $14 <- READ Alice
                                        WRITE Alice $11
WRITE Alice $9 // Free coke!
WRITE Bob $16
```
Clearly, we need to prevent these types of data races from happening. We need a
way to handle these concurrent conflicts. Generally, there are two common
approaches.
Most traditional databases choose a pessimistic locking strategy. (Pessimism
in this case means the strategy assumes conflict will happen ahead of time so
seeks to prevent it.) With pessimistic locking, you first need to acquire a lock
on Alice's record, and then acquire a lock on Bob's record. Then you can proceed
to conduct your transaction, knowing that any other transaction that needed to
touch those records will wait until you are done and all your writes are
committed.
After decades of experience, the drawbacks of pessimistic locking are well
understood and undeniable. The biggest limitation arises from real-life networks
and computers being inherently unreliable. If the lock holder goes missing for
whatever reason half way through its transaction, everyone else that wants to
modify any of those records is waiting indefinitely. Not good!
Optimistic concurrency control is, as the name states, optimistic. It assumes
the transaction will succeed and doesn't worry about locking anything ahead of
time. Very brash! How can it be so sure?
It does this by treating the transaction as a declarative proposal to write
records on the basis of any read record versions (the "read set"). At the end of
the transaction, the writes all commit if every version in the read set is still
the latest version of that record. This means no concurrent conflict occurred.
Now using our version read set, let's see how OCC would have prevented the
soda-catastrophe above:
```sh
$5 Transfer                           $3 Debit Card Charge
----------------------------------------------------------
(v1, $14) <- READ Alice
(v7, $11) <- READ Bob
                                        (v1, $14) <- READ Alice
                                        WRITE Alice $11
                                        IF Alice.v = v1

WRITE Alice = $9, Bob = $16
    IF Alice.v = v1, Bob.v = v7 // Fails! Alice is = v2
```
This is akin to being unable to push your Git repository because you're not at
HEAD. We all know in that circumstance, we need to pull, and rebase or merge,
etc.
## When OCC loses, determinism wins​
A naive optimistic concurrency control solution would be to solve this the same
way that Git does: require the user/application to resolve the conflict and
determine if it is safe to retry.
In Convex, however, we don't need to do that. We know the transaction is
deterministic. It didn't charge money to Stripe, it didn't write a permanent
value out to the filesystem. It had no effect at all other than proposing some
atomic changes to Convex tables that were not applied.
The determinism means that we can simply re-run the transaction; you never need
to worry about temporary data races. We can run several retries if necessary
until we succeed to execute the transaction without any conflicts.
In fact, the Git analogy stays very apt. An OCC conflict means we cannot push
because our HEAD is out of date, so we need to rebase our changes and try again.
And determinism is what guarantees there is never a "merge conflict", so (unlike
with Git) this rebase operation will always eventually succeed without developer
intervention.
## Snapshot Isolation vs Serializability​
It is common for optimistic multi-version concurrency control databases to
provide a guarantee of
snapshot isolation. This
isolation level
provides the illusion that all transactions execute on an atomic snapshot of the
data but it is vulnerable to
anomalies where
certain combinations of concurrent transactions can yield incorrect results. The
implementation of optimistic concurrency control in Convex instead provides true
serializability and will yield
correct results regardless of what transactions are issued concurrently.
## No need to think about this​
The beauty of this approach is that you can simply write your mutation functions
as if they will always succeed, and always be guaranteed to be atomic.
Aside from sheer curiosity about how Convex works, day to day there's no need to
worry about conflicts, locking, or atomicity when you make changes to your
tables and documents. The "obvious way" to write your mutation functions will
just work.



Page URL: https://docs.convex.dev/file-storage

# File Storage
File Storage makes it easy to implement file upload in your app, store files
from and send files to third-party APIs, and to serve dynamic files to your
users. All file types are supported.
You can manage your stored files on the
dashboard.
Examples:
File Storage with HTTP Actions,
File Storage with Queries and Mutations
File storage is currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!



Page URL: https://docs.convex.dev/file-storage/upload-files

# Uploading and Storing Files
Files can be uploaded by your users and stored in Convex. You can choose to
implement this either:
## Uploading files via an HTTP action​
The most straightforward way of uploading files is by sending the file as a body
of an HTTP request.
By defining your own HTTP action to handle
such a request you can control who can upload files to your Convex storage. But
note that the HTTP action request size is
currently limited to 20MB. For larger
files you need to use upload URLs as described
below.
Example:
File Storage with HTTP Actions
### Calling the upload HTTP action from a web page​
Here's an example of uploading an image via a form submission handler to the
sendImage HTTP action defined next.
The highlighted lines make the actual request to the HTTP action:
```sh
import { FormEvent, useRef, useState } from "react";

const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

export default function App() {
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // e.g. https://happy-animal-123.convex.site/sendImage?author=User+123
    const sendImageUrl = new URL(`${convexSiteUrl}/sendImage`);
    sendImageUrl.searchParams.set("author", "Jack Smith");

    await fetch(sendImageUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }
  return (
    <form onSubmit={handleSendImage}>
      <input
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(event) => setSelectedImage(event.target.files![0])}
        disabled={selectedImage !== null}
      />
      <input
        type="submit"
        value="Send Image"
        disabled={selectedImage === null}
      />
    </form>
  );
}
```
### Defining the upload HTTP action​
A file sent in the HTTP request body can be stored using the
storage.store function of
the ActionCtx object. This function
returns a storage ID, a globally unique identifier of the stored file.
From the HTTP action you can call a mutation to write the storage ID to a
document in your database.
To confirm success back to your hosted website, you will need to set the right
CORS headers:
```sh
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/sendImage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);

    // Step 2: Save the storage ID to the database via a mutation
    const author = new URL(request.url).searchParams.get("author");
    await ctx.runMutation(api.messages.sendImage, { storageId, author });

    // Step 3: Return a response with the correct CORS headers
    return new Response(null, {
      status: 200,
      // CORS headers
      headers: new Headers({
        // e.g. https://mywebsite.com
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        Vary: "origin",
      }),
    });
  }),
});
```
## Uploading files via upload URLs​
Large files can be uploaded directly to your backend using a generated upload
URL. This requires the client to make 3 requests:
In the first mutation that generates the upload URL you can control who can
upload files to your Convex storage.
Example:
File Storage with Queries and Mutations
### Calling the upload APIs from a web page​
Here's an example of uploading an image via a form submission handler to an
upload URL generated by a mutation:
```sh
import { FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function App() {
  const generateUploadUrl = useMutation(api.messages.generateUploadUrl);
  const sendImage = useMutation(api.messages.sendImage);

  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));
  async function handleSendImage(event: FormEvent) {
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await sendImage({ storageId, author: name });

    setSelectedImage(null);
    imageInput.current!.value = "";
  }
  return (
    <form onSubmit={handleSendImage}>
      <input
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={(event) => setSelectedImage(event.target.files![0])}
        disabled={selectedImage !== null}
      />
      <input
        type="submit"
        value="Send Image"
        disabled={selectedImage === null}
      />
    </form>
  );
}
```
### Generating the upload URL​
An upload URL can be generated by the
storage.generateUploadUrl
function of the MutationCtx object:
```sh
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});
```
This mutation can control who is allowed to upload files.
The upload URL expires in 1 hour and so should be fetched shortly before the
upload is made.
### Writing the new storage ID to the database​
Since the storage ID is returned to the client it is likely you will want to
persist it in the database via another mutation:
```sh
import { mutation } from "./_generated/server";

export const sendImage = mutation({
  args: { storageId: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      body: args.storageId,
      author: args.author,
      format: "image",
    });
  },
});
```



Page URL: https://docs.convex.dev/file-storage/store-files

# Storing Generated Files
Files can be uploaded to Convex from a client and stored directly, see
Upload.
Alternatively files can also be stored after they've been fetched or generated
in actions and
HTTP actions. For example you might call a
third-party API to generate an image based on a user prompt and then store that
image in Convex.
Example:
Dall-E Storage & Action
## Storing files in actions​
Storing files in actions is similar to
uploading a file via an HTTP action.
The actions takes these steps:
```sh
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const generateAndStore = action({
  args: { prompt: v.string() },
  handler: async (ctx, args) => {
    // Not shown: generate imageUrl from `prompt`
    const imageUrl = "https://....";

    // Download the image
    const response = await fetch(imageUrl);
    const image = await response.blob();

    // Store the image in Convex
    const storageId = await ctx.storage.store(image);

    // Write `storageId` to a document
    await ctx.runMutation(internal.images.storeResult, {
      imageId: storageId,
      prompt: args.prompt,
    });
  },
});

export const storeResult = internalMutation({
  args: {
    imageId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, args) => {
    const { imageId, prompt } = args;
    await ctx.db.insert("images", { imageId, prompt });
  },
});
```



Page URL: https://docs.convex.dev/file-storage/serve-files

# Serving Files
Files stored in Convex can be served to your users by generating a URL pointing
to a given file.
## Generating file URLs in queries​
The simplest way to serve files is to return URLs along with other data required
by your app from queries and
mutations.
A file URL can be generated from a storage ID by the
storage.getUrl function of the
QueryCtx or
MutationCtx object:
```sh
import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return Promise.all(
      messages.map(async (message) => ({
        ...message,
        // If the message is an "image" its `body` is a `StorageId`
        ...(message.format === "image"
          ? { url: await ctx.storage.getUrl(message.body) }
          : {}),
      }))
    );
  },
});
```
File URLs can be used in img elements to render images:
```sh
function Image({ message }: { message: { url: string } }) {
  return <img src={message.url} height="300px" width="auto" />;
}
```
In your query you can control who gets access to a file when the URL is
generated. If you need to control access when the file is served, you can
define your own file serving HTTP actions instead.
## Serving files from HTTP actions​
You can serve files directly from
HTTP actions. An HTTP action will need to
take some parameter(s) that can be mapped to a storage ID, or a storage ID
itself.
This enables access control at the time the file is served, such as when an
image is displayed on a website. But note that the HTTP actions response size is
currently limited to 20MB. For larger
files you need to use file URLs as described
above.
A file Blob object
can be generated from a storage ID by the
storage.get function of the
ActionCtx object, which can be returned in
a Response:
```sh
import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId")!;
    const blob = await ctx.storage.get(storageId);
    if (blob === null) {
      return new Response("Image not found", {
        status: 404,
      });
    }
    return new Response(blob);
  }),
});
```
The URL of such an action can be used directly in img elements to render
images:
```sh
const convexSiteUrl = import.meta.env.VITE_CONVEX_SITE_URL;

function Image({ storageId }: { storageId: string }) {
  // e.g. https://happy-animal-123.convex.site/getImage?storageId=456
  const getImageUrl = new URL(`${convexSiteUrl}/getImage`);
  getImageUrl.searchParams.set("storageId", storageId);

  return <img src={getImageUrl.href} height="300px" width="auto" />;
}
```



Page URL: https://docs.convex.dev/file-storage/delete-files

# Deleting Files
Files stored in Convex can be deleted from
mutations,
actions, and
HTTP actions via the
storage.delete() function,
which accepts the string storage ID:
```sh
import { mutation } from "./_generated/server";

export const deleteById = mutation({
  handler: async (ctx) => {
    // Not shown: Get `storageId` from some document or argument
    const storageId = "....";
    return await ctx.storage.delete(storageId);
  },
});
```



Page URL: https://docs.convex.dev/file-storage/file-metadata

# Accessing File Metadata
File metadata such as the size, content type, and checksum of a file can be
accessed from queries,
mutations,
actions, and
HTTP actions via the
storage.getMetadata()
function:
```sh
import { query } from "./_generated/server";

export const getMetadata = query({
  handler: async (ctx) => {
    // Not shown: Get `storageId` from some document or argument
    const storageId = "....";
    return await ctx.storage.getMetadata(storageId);
  },
});
```
You can check the metadata manually on your
dashboard.



Page URL: https://docs.convex.dev/auth

# Authentication
Authentication allows you to identify users and restrict what data they can see
and edit.
Your product will need a way for users to sign up, log in, log out and, if
passwords are used, a way to recover access after losing a password. This is a
complicated feature set to implement, especially given that any bugs impact
security.
You can implement all of this using Convex, but we currently recommend that you
instead leverage a Convex integration with an existing third-party auth
provider. This will be much less work and a more secure solution. Choose from
one of the following integrations, which both provide login via passwords,
social identity providers and one-time email or SMS access codes:
You could also leverage social identity providers directly, such as Google,
Facebook, Apple or Github. Each provider has a different way to integrate their
service though, and in general this is more complicated than using the
integrations above.
Custom Auth Integration describes how you can
integrate an identity provider on your own.



Page URL: https://docs.convex.dev/auth/clerk

# Convex Clerk
Clerk is an authentication platform providing login via
passwords, social identity providers, one-time email or SMS access codes, and
multi-factor authentication and basic user management.
Example:
Convex Authentication with Clerk
## Get started​
This guide assumes you already have a working React app with Convex. If not
follow the Convex React Quickstart first. Then:
Sign up for a free Clerk account at clerk.com/sign-up.

Choose how you want your users to sign in.

In the JWT Templates section of the Clerk dashboard tap on
+ New template and choose Convex
Copy the Issuer URL from the Issuer input field.
Hit Apply Changes.

In the convex folder create a new file auth.config.js with
the server-side configuration for validating access tokens.
Paste in the Issuer URL from the JWT template and set applicationID to "convex" (the value
of the "aud" Claims field).
```sh
export default {
  providers: [
    {
      domain: "https://your-issuer-url.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ]
};
```
Run npx convex dev to automatically sync your configuration to your backend.
```sh
npx convex dev
```
In a new terminal window, install the Clerk React library
```sh
npm install @clerk/clerk-react
```
On the Clerk dashboard in the API Keys section copy the Publishable key

Now replace your ConvexProvider with ClerkProvider wrapping
ConvexProviderWithClerk.
Pass the Clerk useAuth hook to the ConvexProviderWithClerk.
Paste the Publishable key as a prop to ClerkProvider.
```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey="pk_test_...">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
```
## Login and logout Flows​
Now that you have everything set up, you can use the
SignInButton
component to create a login flow for your app.
The login button will open the Clerk configured login dialog:
```sh
import { SignInButton } from "@clerk/clerk-react";

function App() {
  return (
    <div className="App">
      <SignInButton mode="modal" />
    </div>
  );
}
```
To enable a logout flow you can use the SignOutButton from
@clerk/clerk-react or the
UserButton
which opens a dialog that includes a sign out button.
## Logged-in and logged-out views​
Use the useConvexAuth() hook instead of
Clerk's useAuth hook when you need to check whether the user is logged in or
not. The useConvexAuth hook makes sure that the browser has fetched the auth
token needed to make authenticated requests to your Convex backend:
```sh
import { useConvexAuth } from "convex/react";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className="App">
      {isAuthenticated ? "Logged in" : "Logged out or still loading"}
    </div>
  );
}
```
You can also use the Authenticated, Unauthenticated and AuthLoading helper
components instead of the similarly named Clerk components. These components use
the useConvex hook under the hood:
```sh
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

function App() {
  return (
    <div className="App">
      <Authenticated>Logged in</Authenticated>
      <Unauthenticated>Logged out</Unauthenticated>
      <AuthLoading>Still loading</AuthLoading>
    </div>
  );
}
```
## User information in React​
You can access information about the authenticated user like their name from
Clerk's useUser hook.
See the User doc for the list
of available fields:
```sh
import { useUser } from "@clerk/clerk-react";

export default function Badge() {
  const { user } = useUser();
  return <span>Logged in as {user.fullName}</span>;
}
```
## User information in functions​
See Auth in Functions to learn about how to
access information about the authenticated user in your queries, mutations and
actions.
See Storing Users in the Convex Database to
learn about how to store user information in the Convex database.
## Next.js, React Native Expo, Gatsby​
The ConvexProviderWithClerk component supports all Clerk integrations based on
the @clerk/clerk-react library. Replace the package from which you import the
ClerkProvider component and follow any additional steps in Clerk docs.
## Configuring dev and prod instances​
To configure a different Clerk instance between your Convex development and
production deployments you can use environment variables configured on the
Convex dashboard.
### Configuring the backend​
First, change your auth.config.js file to use an environment variable:
```sh
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
```
Development configuration
Open the Settings for your dev deployment on the Convex
dashboard and add the variables there:

Now switch to the new configuration by running npx convex dev.
Production configuration
Similarly on the Convex dashboard switch to your
production deployment in the left side menu and set the values for your
production Clerk instance there.
Now switch to the new configuration by running npx convex deploy.
### Configuring a React client​
To configure your client you can use environment variables as well. The exact
name of the environment variables and the way to refer to them depends on each
client platform (Vite vs Next.js etc.), refer to our corresponding
Quickstart or the relevant documentation for the
platform you're using.
Change the props to ClerkProvider to take in an environment variable:
```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>
);
```
Development configuration
Use the .env.local or .env file to configure your client when running
locally. The name of the environment variables file depends on each client
platform (Vite vs Next.js etc.), refer to our corresponding
Quickstart or the relevant documentation for the
platform you're using:
```sh
REACT_APP_CLERK_PUBLISHABLE_KEY="pk_test_..."
```
Production configuration
Set the environment variable in your production environment depending on your
hosting platform. See Hosting.
## Debugging authentication​
If a user goes through the Clerk login flow successfully, and after being
redirected back to your page useConvexAuth gives isAuthenticated: false,
it's possible that your backend isn't correctly configured.
The auth.config.js file in your convex/ directory contains a list of
configured authentication providers. You must run npx convex dev or
npx convex deploy after adding a new provider to sync the configuration to
your backend.
## Under the hood​
The authentication flow looks like this under the hood:
ConvexProviderWithClerk takes care of refetching the token when needed to
make sure the user stays authenticated with your backend.



Page URL: https://docs.convex.dev/auth/auth0

# Convex Auth0
Auth0 is an authentication platform providing login via
passwords, social identity providers, one-time email or SMS access codes,
multi-factor authentication, and single sign on and basic user management.
Example:
Convex Authentication with Auth0
## Get started​
This guide assumes you already have a working React app with Convex. If not
follow the Convex React Quickstart first. Then:
Follow the Auth0 React Quickstart.
Sign up for a free Auth0 account.
Configure your application, using http://localhost:3000, http://localhost:5173 for Callback
and Logout URLs and Allowed Web Origins.
Come back when you finish the Install the Auth0 React SDK step.

In the convex folder create a new file auth.config.js with
the server-side configuration for validating access tokens.
Paste in the domain and clientId values shown in
Install the Auth0 React SDK step of the Auth0 quickstart or
in your Auth0 application's Settings dashboard.
```sh
export default {
  providers: [
    {
      domain: "your-domain.us.auth0.com",
      applicationID: "yourclientid",
    },
  ]
};
```
Run npx convex dev to automatically sync your configuration to your backend.
```sh
npx convex dev
```
Now replace your ConvexProvider with an Auth0Provider wrapping ConvexProviderWithAuth0.
Add the domain and clientId as props to the Auth0Provider.
Paste in the domain and clientId values shown in
Install the Auth0 React SDK step of the Auth0 quickstart or
in your Auth0 application's Settings dashboard as props to Auth0Provider.
```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="your-domain.us.auth0.com"
      clientId="yourclientid"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <App />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  </React.StrictMode>
);
```
## Login and logout flows​
Now that you have everything set up, you can use the
useAuth0() hook
to create login and logout buttons for your app.
The login button will redirect the user to the Auth0 universal login page. For
details see
Add Login to Your Application
in the Auth0 React Quickstart.
```sh
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={loginWithRedirect}>Log in</button>;
}
```
The logout button will redirect the user to the Auth0 logout endpoint. For
details see
Add Logout to your Application
in the Auth0 React Quickstart.
```sh
import { useAuth0 } from "@auth0/auth0-react";

export default function LogoutButton() {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log out
    </button>
  );
}
```
## Logged-in and logged-out views​
Use the useConvexAuth() hook instead of
the useAuth0 hook when you need to check whether the user is logged in or not.
The useConvex hook makes sure that the browser has fetched the auth token
needed to make authenticated requests to your Convex backend:
```sh
import { useConvexAuth } from "convex/react";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div className="App">
      {isAuthenticated ? "Logged in" : "Logged out or still loading"}
    </div>
  );
}
```
You can also use the Authenticated, Unauthenticated and AuthLoading helper
components which use the useConvexAuth hook under the hood:
```sh
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

function App() {
  return (
    <div className="App">
      <Authenticated>Logged in</Authenticated>
      <Unauthenticated>Logged out</Unauthenticated>
      <AuthLoading>Still loading</AuthLoading>
    </div>
  );
}
```
## User information in React​
You can access information about the authenticated user like their name from the
useAuth0 hook:
```sh
import { useAuth0 } from "@auth0/auth0-react";

export default function Badge() {
  const { user } = useAuth0();
  return <span>Logged in as {user.name}</span>;
}
```
## User information in functions​
See Auth in Functions to learn about how to
access information about the authenticated user in your queries, mutations and
actions.
See Storing Users in the Convex Database to
learn about how to store user information in the Convex database.
## Configuring dev and prod tenants​
To configure a different Auth0 tenant (environment) between your Convex
development and production deployments you can use environment variables
configured on the Convex dashboard.
### Configuring the backend​
First, change your auth.config.js file to use environment variables:
```sh
export default {
  providers: [
    {
      domain: process.env.AUTH0_DOMAIN,
      applicationID: process.env.AUTH0_CLIENT_ID,
    },
  ],
};
```
Development configuration
Open the Settings for your dev deployment on the Convex
dashboard and add the variables there:

Now switch to the new configuration by running npx convex dev.
Production configuration
Similarly on the Convex dashboard switch to your
production deployment in the left side menu and set the values for your
production Auth0 tenant there.
Now switch to the new configuration by running npx convex deploy.
### Configuring a React client​
To configure your client you can use environment variables as well. The exact
name of the environment variables and the way to refer to them depends on each
client platform (Vite vs Next.js etc.), refer to our corresponding
Quickstart or the relevant documentation for the
platform you're using.
Change the props to Auth0Provider to take in environment variables:
```sh
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <App />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  </React.StrictMode>
);
```
Development configuration
Use the .env.local or .env file to configure your client when running
locally. The name of the environment variables file depends on each client
platform (Vite vs Next.js etc.), refer to our corresponding
Quickstart or the relevant documentation for the
platform you're using:
```sh
VITE_AUTH0_DOMAIN="your-domain.us.auth0.com"
VITE_AUTH0_CLIENT_ID="yourclientid"
```
Production configuration
Set the environment variables in your production environment depending on your
hosting platform. See Hosting.
## Debugging authentication​
If a user goes through the Auth0 login flow successfully, and after being
redirected back to your page useConvexAuth gives isAuthenticated: false,
it's possible that your backend isn't correctly configured.
The auth.config.js file in your convex/ directory contains a list of
configured authentication providers. You must run npx convex dev or
npx convex deploy after adding a new provider to sync the configuration to
your backend.
## Under the hood​
The authentication flow looks like this under the hood:
ConvexProviderWithAuth0 takes care of refetching the token when needed to
make sure the user stays authenticated with your backend.



Page URL: https://docs.convex.dev/auth/custom-auth

# Custom Auth Integration
Convex can be integrated with any identity provider supporting the
OpenID Connect protocol. At minimum this means
that the provider can issue
ID tokens and
verify them. The ID token is passed from the client to your Convex backend which
ensures that the token is valid and enables you to query the user information
embedded in the token, as described in
Auth in Functions.
## Server-side integration​
Just like with Clerk and Auth0,
the backend needs to be aware of the domain of the Issuer and your application's
specific applicationID for a given identity provider.
Add these to your convex/auth.config.js file:
```sh
export default {
  providers: [
    {
      domain: "your.issuer.url.com",
      applicationID: "your-application-id",
    },
  ],
};
```
## Client-side integration​
### Integrating a new identity provider​
The ConvexProviderWithAuth
component provides a convenient abstraction for building an auth integration
similar to the ones Convex provides for Clerk and
Auth0.
In the following example we build an integration with an imaginary "ProviderX",
whose React integration includes AuthProviderXReactProvider and
useProviderXAuth hook.
First we replace ConvexProvider with AuthProviderXReactProvider wrapping
ConvexProviderWithAuth at the root of our app:
```sh
import { AuthProviderXReactProvider } from "providerX";
import { ConvexProviderWithAuth } from "convex/react";

root.render(
  <StrictMode>
    <AuthProviderXReactProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromProviderX}>
        <App />
      </ConvexProviderWithAuth>
    </AuthProviderXReactProvider>
  </StrictMode>
);
```
All we really need is to implement the useAuthFromProviderX hook which gets
passed to the ConvexProviderWithAuth component.
This useAuthFromProviderX hook provides a translation between the auth
provider API and the ConvexReactClient
API, which is ultimately responsible for making sure that the ID token is passed
down to your Convex backend.
```sh
function useAuthFromProviderX() {
  const { isLoading, isAuthenticated, getToken } = useProviderXAuth();
  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }) => {
      // Here you can do whatever transformation to get the ID Token
      // or null
      // Make sure to fetch a new token when `forceRefreshToken` is true
      return await getToken({ ignoreCache: forceRefreshToken });
    },
    // If `getToken` isn't correctly memoized
    // remove it from this dependency array
    [getToken]
  );
  return useMemo(
    () => ({
      // Whether the auth provider is in a loading state
      isLoading: isLoading,
      // Whether the auth provider has the user signed in
      isAuthenticated: isAuthenticated ?? false,
      // The async function to fetch the ID token
      fetchAccessToken,
    }),
    [isLoading, isAuthenticated, fetchAccessToken]
  );
}
```
### Using the new provider​
If you successfully follow the steps above you can now use the standard Convex
utilities for checking the authentication state: the
useConvexAuth() hook and the
Authenticated,
Unauthenticated and
AuthLoading helper components.
See
Logged-in and logged-out views
for examples of using these.



Page URL: https://docs.convex.dev/auth/functions-auth

# Auth in Functions
Within a Convex function, you can access information
about the currently logged-in user by using the the
auth property of the
QueryCtx,
MutationCtx, or
ActionCtx object:
```sh
import { mutation } from "./_generated/server";

export const myMutation = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Unauthenticated call to mutation");
    }
    //...
  },
});
```
## User identity fields​
The UserIdentity object returned by
getUserIdentity is guaranteed to have tokenIdentifier, subject and
issuer fields. Which other fields it will include depends on the identity
provider used and the configuration of JWT tokens and
OpenID scopes.
tokenIdentifier is a combination of subject and issuer to ensure
uniqueness even when multiple providers are used.
If you followed one of our integrations with Clerk or Auth0 at least the
following fields will be present: family_name, given_name, nickname,
picture, updated_at, email, email_verified. See their standard
definition in the
OpenID docs.
```sh
import { mutation } from "./_generated/server";

export const myMutation = mutation({
  args: {
    // ...
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const { tokenIdentifier, name, email } = identity!;
    //...
  },
});
```
### Clerk claims configuration​
If you're using Clerk, the fields returned by getUserIdentity are determined
by your JWT template's Claims config. Note that Convex currently only supports
passing through a list of fields which are part of the
OpenId standard.
## HTTP Actions​
You can also access the user identity from an HTTP action
ctx.auth.getUserIdentity(), by
calling your endpoint with an Authorization header including a JWT token:
```sh
const jwtToken = "...";

fetch("https://<deployment name>.convex.site/myAction", {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
});
```



Page URL: https://docs.convex.dev/auth/database-auth

# Storing Users in the Convex Database
You might want to have a centralized place that stores information about the
users who have previously signed up or logged in to your app. To do this you
can:
## storeUser mutation​
This is an example of a mutation that stores the user's name and
tokenIdentifier:
```sh
import { mutation } from "./_generated/server";

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});
```
## Calling storeUser from React​
You can call this mutation when the user logs in from a useEffect hook. Once
the mutation succeeds we store the Convex document ID representing the user in
the component state.
Here we created a helper hook that does this job:
```sh
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

export default function useStoreUserEffect() {
  const { isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  // When this state is set we know the server
  // has stored the user.
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const storeUser = useMutation(api.users.store);
  // Call the `storeUser` mutation function to store
  // the current user in the `users` table and return the `Id` value.
  useEffect(() => {
    // If the user is not logged in don't do anything
    if (!isAuthenticated) {
      return;
    }
    // Store the user in the database.
    // Recall that `storeUser` gets the user information via the `auth`
    // object on the server. You don't need to pass anything manually here.
    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }
    createUser();
    return () => setUserId(null);
    // Make sure the effect reruns if the user logs in with
    // a different identity
  }, [isAuthenticated, storeUser, user?.id]);
  return userId;
}
```
You can then use this hook in the top level component which needs the user ID:
```sh
import useStoreUserEffect from "./useStoreUserEffect.js";

export function App {
   const userId = useStoreUserEffect();
   if (userId === null) {
      return <div>Storing user...</div>;
   }
   return <div>Stored user ID: {userId}</div>;
}
```
Note that you simplify the hook based on your needs. You can remove the
isAuthenticated check if you only call the hook from a component wrapped in
Authenticated from convex/react. You can remove the useState if your
client doesn't need to know the user ID, but you need to make sure that a
mutation which requires that the user is stored doesn't get called before the
useEffect finishes.
## users table schema​
We can define a users table, optionally with an
index for efficient document queries:
```sh
users: defineTable({
  name: v.string(),
  tokenIdentifier: v.string(),
}).index("by_token", ["tokenIdentifier"]),
```
## Reading from users table​
You can now load user documents from queries and mutations. This can be useful
for referencing the user's document ID in
other documents. Note that using the "by_token" index requires you to
define that index.
```sh
import { mutation } from "./_generated/server";

export const send = mutation({
  args: { body: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    // Note: If you don't want to define an index right away, you can use
    // ctx.db.query("users")
    //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    //  .unique();
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) {
      throw new Error("Unauthenticated call to mutation");
    }
    // do something with `user`...
  }
});
```



Page URL: https://docs.convex.dev/scheduling

# Scheduling
Convex lets you easily schedule a function to run once or repeatedly in the
future. This allows you to build workflows like sending a welcome email a day
after someone joins or regularly reconciling your accounts with Stripe. Convex
provides two different features for scheduling:



Page URL: https://docs.convex.dev/scheduling/scheduled-functions

# Scheduled Functions
Convex allows you to schedule functions to run in the future. This allows you to
build powerful workflows without the need to setup and maintain queues or other
infrastructure.
Example:
Scheduling
## Scheduling functions​
You can schedule public functions and
internal functions from mutations and
actions via the scheduler provided in the
respective function context.
The rest of the arguments are the path to the function and its arguments,
similar to invoking a function from the client. For example, here is how to send
a message that self-destructs in five seconds.
```sh
import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

export const sendExpiringMessage = mutation({
  args: { body: v.string(), author: v.string() },
  handler: async (ctx, args) => {
    const { body, author } = args;
    const id = await ctx.db.insert("messages", { body, author });
    await ctx.scheduler.runAfter(5000, internal.messages.destruct, {
      messageId: id,
    });
  },
});

export const destruct = internalMutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.messageId);
  },
});
```
A single function can schedule up to 1000 functions with total argument size of
8MB.
## Scheduling from mutations​
Scheduling functions from
mutations is atomic with
the rest of the mutation. This means that if the mutation succeeds, the
scheduled function is guaranteed to be scheduled. On the other hand, if the
mutations fails, no function will be scheduled, even if the function fails after
the scheduling call.
## Scheduling from actions​
Unlike mutations, actions don't execute as a
single database transaction and can have side effects. Thus, scheduling from
actions does not depend on the outcome of the function. This means that an
action might succeed to schedule some functions and later fail due to transient
error or a timeout. The scheduled functions will still be executed.
## Scheduling immediately​
Using runAfter() with delay set to 0 is used to immediately add a function to
the event queue. This usage may be familiar to you if you're used to calling
setTimeout(fn, 0).
As noted above, actions are not atomic and are meant to cause side effects.
Scheduling immediately becomes useful when you specifically want to trigger an
action from a mutation that is conditional on the mutation succeeding.
This post
goes over a direct example of this in action, where the application depends on
an external service to fill in information to the database.
## Debugging​
You can view logs from previously executed scheduled functions in the Convex
dashboard Logs view. You can view and cancel yet
to be executed functions in the
Functions view.
## Error handling​
Once scheduled, mutations are guaranteed to be executed exactly once. Convex
will automatically retry any internal Convex errors, and only fail on developer
errors. See Error Handling for more details
on different error types.
Since actions may have side effects, they are not automatically retried by
Convex. Thus, actions will be executed at most once, and permanently fail if
there are transient errors while executing them. Developers can retry those
manually by scheduling a mutation that checks if the desired outcome has been
achieved and if not schedule the action again.
## Auth​
The auth is not propagated from the scheduling to the scheduled function. If you
want to authenticate or check authorization, you'll have to pass the requisite
user information in as a parameter.



Page URL: https://docs.convex.dev/scheduling/cron-jobs

# Cron Jobs
Convex allows you to schedule functions to run on a recurring basis. For
example, cron jobs can be used to clean up data at a regular interval, send a
reminder email at the same time every month, or schedule a backup every
Saturday.
Example:
Cron Jobs
## Defining your cron jobs​
Cron jobs are defined in a crons.ts file in your convex/ directory and look
like:
```sh
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "clear messages table",
  { minutes: 1 }, // every minute
  internal.messages.clearAll
);

crons.monthly(
  "payment reminder",
  { day: 1, hourUTC: 16, minuteUTC: 0 }, // Every month on the first day at 8:00am PST
  internal.payments.sendPaymentEmail,
  { email: "my_email@gmail.com" } // argument to sendPaymentEmail
);

// An alternative way to create the same schedule as above with cron syntax
crons.cron(
  "payment reminder duplicate",
  "0 16 1 * *",
  internal.payments.sendPaymentEmail,
  { email: "my_email@gmail.com" } // argument to sendPaymentEmail
);

export default crons;
```
The first argument is a unique identifier for the cron job.
The second argument is the schedule at which the function should run, see
Supported schedules below.
The third argument is the name of the public function or
internal function, either a
mutation or an
action.
## Supported schedules​
## Viewing your cron jobs​
You can view all your cron jobs in the Convex dashboard cron jobs view. You can
view added, updated, and deleted cron jobs in the logs and history view. Results
of previously executed runs of the cron jobs are also available in the logs
view.

## Error handling​
Mutations and actions have the same guarantees that are described in
Error handling for
scheduled functions.
At most one run of each cron job can be executing at any moment. If the function
scheduled by the cron job takes too long to run, following runs of the cron job
may be skipped to avoid execution from falling behind. Skipping a scheduled run
of a cron job due to the previous run still executing logs a message visible in
the logs view of the dashboard.



Page URL: https://docs.convex.dev/text-search

# Full Text Search
Full text search allows you to find Convex documents that match given keywords.
Unlike normal
document queries, search
queries look within a string field to find the keywords. This can be used to
build search features within your app like searching for messages that contain
certain words.
Search queries are automatically reactive, consistent, transactional, and work
seamlessly with pagination. They even include new documents created with a
mutation!
Example:
Search App
To use full text search you need to:
Search is currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!
## Defining search indexes​
Like database indexes, search indexes are a
data structure that is built in advance to enable efficient querying. Search
indexes are defined as part of your Convex schema.
Every search index definition consists of:
To add a search index onto a table, use the
searchIndex method on your
table's schema. For example, if you want an index which can search for messages
matching a keyword in a channel, your schema could look like:
```sh
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    channel: v.string(),
  }).searchIndex("search_body", {
    searchField: "body",
    filterFields: ["channel"],
  }),
});
```
You can specify search and filter fields on nested documents by using a
dot-separated path like properties.name.
## Running search queries​
A query for "10 messages in channel '#general' that have 'hello' or 'hi' in
their body" would look like:
```sh
const messages = await ctx.db
  .query("messages")
  .withSearchIndex("search_body", (q) =>
    q.search("body", "hello hi").eq("channel", "#general")
  )
  .take(10);
```
This is just a normal database read that
begins by querying the search index!
The
.withSearchIndex
method defines which search index to query and how Convex will use that search
index to select documents. The first argument is the name of the index and the
second is a search filter expression. A search filter expression is a
description of which documents Convex should consider when running the query.
A search filter expression is always a chained list of:
### Search expressions​
Internally, Convex will break up the search expression's query into separate
words (called terms) and search for any of them within the field.
In the example above, the expression search("body", "hello hi") would
internally be split into "hi" and "hello" and compared against the terms in
your document (ignoring case and punctuation). This matches:
### Equality expressions​
Unlike search expressions, equality expressions will filter to only documents
that have an exact match in the given field. In the example above,
eq("channel", "#general") will only match documents that have exactly
"#general" in their channel field.
Equality expressions support fields of any type (not just text).
To filter to documents that are missing a field, use
q.eq("fieldName", undefined).
### Other filtering​
Because search queries are normal database queries, you can also
filter results using the
.filter method!
Here's a query for "messages containing 'hi' sent in the last 10 minutes":
```sh
const messages = await ctx.db
  .query("messages")
  .withSearchIndex("search_body", (q) => q.search("body", "hi"))
  .filter((q) => q.gt(q.field("_creationTime", Date.now() - 10 * 60000)))
  .take(10);
```
For performance, always put as many of your filters as possible into
.withSearchIndex.
Every search query is executed by:
Having a very specific search filter expression will make your query faster and
less likely to hit Convex's limits because Convex will use the search index to
efficiently cut down on the number of results to consider.
### Retrieving results and paginating​
Just like ordinary database queries, you can
retrieve the results using
.collect(),
.take(n),
.first(), and
.unique().
Additionally, search results can be paginated
using
.paginate(paginationOpts).
Note that collect() will throw an exception if it attempts to collect more
than the limit of 1024 documents. It is often better to pick a smaller limit and
use take(n) or paginate the results.
### Relevance order​
Search queries always return results in relevance order based on how well the
document matches the search text.
Internally, Convex ranks documents based on their
BM25 score which takes into account:
If multiple documents have the same score, the newest documents are returned
first.
## Limits​
Search indexes must have:
Search indexes count against the
limit of 32 indexes per table.
Search queries can have:
Additionally, search queries can scan up to 1024 results from the search index.
## Coming soon​
We plan to expand Convex full text search to include:
If any of these features is important for your app,
let us know on Discord!



Page URL: https://docs.convex.dev/ai

# AI
Every AI app needs a place to pull everything together. Convex removes all the
hurdles to get a backend and database up and running and makes it easy to
quickly integrate your favorite AI APIs.
Visit Stack to learn more about building AI
products with Convex:
## Building a Full-Stack ChatGPT app

## Build with LangChain, Replicate, and OpenAI

## Using Dall-E from Convex

## AI Fundamentals: The Magic of Embeddings

## Adding Personality to ChatGPT

## Moderating ChatGPT Content: Full-Stack




Page URL: https://docs.convex.dev/realtime

# Realtime
Turns out Convex is automatically realtime! You don’t have to do anything
special if you are already using query functions,
database, and client libraries in your app.
Convex tracks the dependencies to your query functions, including database
changes, and triggers the subscription in the client libraries.

You can learn how to handle and use realtime and reactive queries in Convex on
Stack
## Implementing Presence with Convex

## Fully Reactive Pagination

## Help, my app is overreacting!

## Data Interactivity in the Serverless Future




Page URL: https://docs.convex.dev/typescript

# TypeScript
Convex provides end-to-end type support when Convex functions are written in
TypeScript.
You can gradually add TypeScript to a Convex project: the following steps
provide progressively better type support. For the best support you'll want to
complete them all.
Example:
TypeScript and Schema
### Writing Convex functions in TypeScript​
The first step to improving type support in a Convex project is to writing your
Convex functions in TypeScript by using the .ts extension.
If you are using argument validation, Convex will
infer the types of your functions arguments automatically:
```sh
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    body: v.string(),
    author: v.string(),
  },
  // Convex knows that the argument type is `{body: string, author: string}`.
  handler: async (ctx, args) => {
    const { body, author } = args;
    await ctx.db.insert("messages", { body, author });
  },
});
```
Otherwise you can annotate the arguments type manually:
```sh
import { internalMutation } from "./_generated/server";

export default internalMutation({
  // To convert this function from JavaScript to
  // TypeScript you annotate the type of the arguments object.
  handler: async (ctx, args: { body: string; author: string }) => {
    const { body, author } = args;
    await ctx.db.insert("messages", { body, author });
  },
});
```
This can be useful for
internal functions accepting
complicated types.
If TypeScript is installed in your project npx convex dev and
npx convex deploy will typecheck Convex functions before sending code to the
Convex backend.
Convex functions are typechecked with the tsconfig.json in the Convex folder:
you can modify some parts of this file to change typechecking settings, or
delete this file to disable this typecheck.
You'll find most database methods have a return type of Promise<any> until you
add a schema.
### Adding a schema​
Once you define a schema the type signature of
database methods will be known. You'll also be able to use types imported from
convex/_generated/dataModel in both Convex functions and clients written in
TypeScript (React, React Native, Node.js etc.).
The types of documents in tables can be described using the
Doc type from the generated data model and
references to documents can be described with parametrized
Document IDs.
```sh
import { Doc, Id } from "../convex/_generated/dataModel";

function Channel(props: { channelId: Id<"channels"> }) { ... }
function MessagesView(props: { message: Doc<"messages"> }) { ... }
```
### Writing frontend code in TypeScript​
React hooks like useQuery and
useMutation provide end to end type safety
by ensuring their arguments match the signatures of the corresponding Convex
functions. To use, install and configure TypeScript so you can write your React
components in .tsx files instead of .jsx files.
Follow our React or
Next.js quickstart to get started with Convex and
TypeScript.
### Recommended TypeScript version​
Convex works best with TypeScript version
5.0.3 or newer.



Page URL: https://docs.convex.dev/production/hosting/

# Hosting and Deployment
The easiest way to publish your Convex app to the internet is to use a hosting
provider like Vercel or Netlify.
Both Netlify and Vercel integrate with Git to deploy code whenever a new
revision is pushed. To host your app:
Commit all files and push to your favorite Git hosting provider such as
GitHub, GitLab or
Bitbucket.
Follow the appropriate guide below.
If you aren't using Netlify or Vercel, a similar process should work for other
providers and deployment workflows.
## Netlify
Host your frontend on Netlify and your backend on Convex.
## Vercel
Host your frontend on Vercel and your backend on Convex.



Page URL: https://docs.convex.dev/production/hosting/netlify

# Using Convex with Netlify
Hosting your Convex app on Netlify allows you to automatically re-deploy both
your backend and your frontend whenever you push your code.
## Deploying to Netlify​
This guide assumes you already have a working React app with Convex. If not
follow the Convex React Quickstart first. Then:
If you haven't done so, create a Netlify account.
This is free for small projects and should take less than a minute to set
up.
Create a Netlify project at https://app.netlify.com/start and link it to the
source code repository for your project on Github or other Git platform.

Override the Build command to be
npm run build && npx convex deploy.
If your project lives in a subdirectory of your repository you'll
also need to change Base directory in Netlify accordingly.

On your Convex Dashboard
go to your project's Production deployment. On the
Settings page copy the Deployment URL.
In Netlify, click Advanced > New Variable.
Create an environment variable with the name used by your client
code (likely VITE_CONVEX_URL or NEXT_PUBLIC_CONVEX_URL or CONVEX_URL)
and paste in the URL.

Back on the Convex Production Deployment Settings page click
on Generate a deploy key button, then click the copy button
to copy the key.
In Netlify, click New Variable.
Create an environment variable CONVEX_DEPLOY_KEY and paste
in your deploy key.

Now click the Deploy Site button and your work here is done!
Netlify will automatically publish your site to a URL
https://<site-name>.netlify.app listed at the top of the site overview page.
Every time you push to your git repository, Netlify will automatically deploy
your Convex functions and publish your site changes.
## How it works​
In Netlify, we overrode the Build Command to be
npm run build && npx convex deploy.
Your frontend framework of choice invoked by npm run build will read the
CONVEX_URL (or similarly named) environment variable to point your deployed
site (via ConvexReactClient) at your production deployment.
Then npx convex deploy will read CONVEX_DEPLOY_KEY from the environment and
use it to push your Convex functions to the production deployment. This
deployment has separate functions, data, crons and all other configuration from
the dev deployment used by npx convex dev.
Now, your production deployment has your newest functions and your app is
configured to connect to it.
## Authentication​
You will want to configure your authentication provider
(Clerk, Auth0 or other) to accept your production <site-name>.netlify.app URL.



Page URL: https://docs.convex.dev/production/hosting/vercel

# Using Convex with Vercel
Hosting your Convex app on Vercel allows you to automatically re-deploy both
your backend and your frontend whenever you push your code.
## Deploying to Vercel​
This guide assumes you already have a working React app with Convex. If not
follow the Convex React Quickstart first. Then:
If you haven't done so, create a Vercel account. This is
free for small projects and should take less than a minute to set up.
Create a Vercel project at https://vercel.com/new and link it to the
source code repository for your project on Github or other Git platform.

Override the "Build command" to be
npm run build && npx convex deploy.
If your project lives in a subdirectory of your repository you'll
also need to change Root Directory above accordingly.

On your Convex Dashboard
go to your project's Production deployment. On the Settings
page copy the Deployment URL.
In Vercel, click Environment Variables.
Create an environment variable with the name used by your client
code (likely VITE_CONVEX_URL or NEXT_PUBLIC_CONVEX_URL or CONVEX_URL)
and paste in the URL. Click on Add_.

Back on the Convex Production Deployment Settings page click
on Generate a deploy key button, then click the copy button
to copy the key.
In Vercel, create an environment variable CONVEX_DEPLOY_KEY and paste
in your deploy key. Click on Add_.

Now click the Deploy button and your work here is done!
Vercel will automatically publish your site to an URL like
https://<site-name>.vercel.app, shown on the page after deploying. Every time
you push to your Git repository, Vercel will automatically deploy your Convex
functions and publish your site changes.
## How it works​
In Vercel, we overrode the Build Command to be
npm run build && npx convex deploy.
Your frontend framework of choice invoked by npm run build will read the
CONVEX_URL (or similarly named) environment variable to point your deployed
site (via ConvexReactClient) at your production deployment.
Then npx convex deploy will read CONVEX_DEPLOY_KEY from the environment and
use it to push your Convex functions to the production deployment. This
deployment has separate functions, data, crons and all other configuration from
the dev deployment used by npx convex dev.
Now, your production deployment has your newest functions and your app is
configured to connect to it.
## Authentication​
You will want to configure your authentication provider
(Clerk, Auth0 or other) to accept your production
https://<site-name>.vercel.app URL.



Page URL: https://docs.convex.dev/production/environment-variables

# Environment Variables
Environment variables are key-value pairs that are useful for storing values you
wouldn't want to put in code or in a table, such as an API key. You can set
environment variables in Convex through the dashboard, and you can access them
in functions using process.env.
## Setting environment variables​
Under Deployment Settings in the
Dashboard, you can see a list of environment variables in the current
deployment.

You can add up to 100 environment variables. Environment variable names cannot
be more than 40 characters long, and they must start with a letter and only
contain letters numbers, and underscores. Environment variable values cannot be
larger than 8KB.
You can modify environment variables using the "Edit" button:

### Using environment variables in dev and prod deployments​
Since environment variables are set per-deployment, you can use different values
for the same key in dev and prod deployments. This can be useful for when you
have different external accounts you'd like to use depending on the environment.
For example, you might have a dev and prod SendGrid account for sending emails,
and your function expects an environment variable called SENDGRID_API_KEY that
should work in both environments.
If you expect an environment variable to be always present in a function, you
must add it to all your deployments. In this example, you would add an
environment variable with the name SENDGRID_API_KEY to your dev and prod
deployments, with a different value for dev and prod.
## Accessing environment variables​
You can access environment variables in Convex functions using
process.env.KEY. If the variable is set it is a string, otherwise it is
undefined. Here is an example of accessing an environment variable with the
key GIPHY_KEY:
```sh
function giphyUrl(query) {
  return (
    "https://api.giphy.com/v1/gifs/translate?api_key=" +
    process.env.GIPHY_KEY +
    "&s=" +
    encodeURIComponent(query)
  );
}
```
Note that you should not condition your Convex function exports on environment
variables. The set of Convex functions that can be called is determined during
deployment and is not reevaluated when you change an environment variable. The
following code will throw an error at runtime, if the DEBUG environment variable
changes between deployment and calling the function.
```sh
// THIS WILL NOT WORK!
export const myFunc = process.env.DEBUG ? mutation(...) : internalMutation(...);
```
Similarly, environment variables used in cron definitions will only be
reevaluated on deployment.
## System environment variables​
The following environment variables are always available in Convex functions:



Page URL: https://docs.convex.dev/production/project-configuration

# Project Configuration
## Local development​
When you're developing locally you need two pieces of information:
## Production deployment​
You should only be deploying to your production deployment once you have tested
your changes on your local deployment. When you're ready, you can deploy either
via a hosting/CI provider or from your local machine.
For a CI environment you can follow the
hosting docs. npx convex deploy run by
the CI pipeline will use the CONVEX_DEPLOY_KEY, and the frontend build command
will use the deployment URL variable, both configured in your CI environment.
You can also deploy your backend from your local machine. npx convex deploy
will ask for a confirmation and then deploy to the production deployment in the
same project as your configured development CONVEX_DEPLOYMENT.
## Changing the convex/ folder name or location​
If you need to change the name or location of the convex/ folder for any
reason, you can do so using the convex.json file at the root of your project.
For example, Create React App doesn't allow importing from outside the src/
directory, so if you're using Create React App you should have the following
config:
```sh
{
  "functions": "src/convex/"
}
```



Page URL: https://docs.convex.dev/production/state

# Status and Guarantees
Please contact us with any specific requirements or
if you want to build a project on Convex that is not yet satisfied by our
guarantees.
## Guarantees​
The official Convex Terms of Service, Privacy Policy and Customer Agreements are
outlined in our official terms. We do not
yet have contractual agreements beyond what is listed in our official terms and
the discussions within this document don't constitute an amendment to these
terms.
Convex is always under continual development and future releases may require
code changes in order to upgrade to a new version. Code developed on Convex 1.0
or later will continue to operate as-is. If we are required to make a breaking
change in future we will contact teams directly to provide substantial advance
notice.
All user data in Convex is encrypted at rest. Database state is replicated
durably across multiple physical availability zones. Regular periodic and
incremental database backups are performed and stored with 99.999999999% (11
9's) durability.
We target an availability of 99.99% (4 9's) for Convex deployments although
these may experience downtime for maintenance without notice. A physical outage
may affect availability of a deployment but will not affect durability of the
data stored in Convex.
## Limits​
The maximum document size is 1 MB. Convex also limits the size and nesting depth
of the documents stored in the system as described in
Data Types. The maximum number of tables is
10,000. Convex does not enforce a maximum file size for uploads to
File Storage, although upload attempts will timeout
after 2 minutes.
Please see our plans and pricing page for
resource limits. After these limits are hit on a free plan, new mutations that
attempt to commit more insertions or updates may fail. Paid plans have no hard
resource limits - they can scale to billions of documents and TBs of storage.
## Beta Features​
Features tagged with beta in these docs are still in development. They can
be used in production but their APIs might change in the future, requiring
additional effort when upgrading to a new version of the Convex NPM package and
other Convex client libraries.
## Future Features​
Convex is still under very active development and here we list some of the
missing functionality on our radar. We'd love to hear more about your
requirements in the Convex Discord Community.
### Authorization​
Convex currently has an authentication framework which
verifies user identities. In the future we plan to add an authorization
framework which will allow developers to define what data a user can access.
For now, you can implement manual authorization checks within your queries and
mutations, but stay tuned for a more comprehensive, fool-proof solution in the
future.
### Telemetry​
Currently, the dashboard provides only basic metrics. Serious sites at scale are
going to need to integrate our logs and metrics into more fully fledged
observability systems that categorize them and empower things like alerting.
Convex will eventually have methods to publish deployment data in formats that
can be ingested by third parties.
### Analytics / OLAP​
Convex is designed to primarily service all your app's realtime implementation
(OLTP) needs. It is less suited to be a good solution for the kinds of complex
queries and huge table scans that are necessary to address the requirements of
analytics (OLAP) use cases.
Convex exposes an Airbyte connector
to export Convex data to external analytics systems.
### Browser support​
Convex does not yet have an official browser support policy, but we strive to
support most modern browsers with significant
usage.


