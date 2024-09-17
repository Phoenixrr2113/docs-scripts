Page URL: https://docs.convex.dev/production/best-practices

# Best Practices
Here's a collection of our recommendations on how best to use Convex to build
your application. If you want guidance specific to your app's needs or have
discovered other ways of using Convex,
message us on Discord!
## Use TypeScript!​
All Convex libraries have complete type annotations and using theses types is a
great way to learn the framework.
Even better, Convex supports code generation to create types
that are specific to your app's schema and
Convex functions.
Code generation is run automatically by
npx convex dev.
## Functions​
### Use argument validation in all public functions.​
Argument validation prevents malicious users from calling your functions with
the wrong types of arguments. It's okay to skip argument validation for
internal functions because they are
not publicly accessible.
### Use console.log to debug your Convex functions.​
All server-side logs from Convex functions are shown on the
dashboard Logs page. If a server-side
exception occurs, it will also be logged as an error event.
On a dev deployment the logs will also be forwarded to the client and will
show up in the browser developer tools Console for the user who invoked the
function call, including full server error messages and server-side stack
traces.
### Use helper functions to write shared code.​
You can feel free to write additional helper functions in your /convex
directory and use them within your Convex functions. Helpers can be a powerful
way to share business logic, authorization code, and more.
### Prefer queries and mutations over actions​
You should generally avoid using actions when the same goal can be achieved
using queries or mutations. Since actions can have side effects, they can't be
automatically retried nor their results cached. Actions should be used in more
limited scenarios, such as calling third-party services.
## Database​
### Use indexes or paginate all large database queries.​
Database indexes with
range expressions
allow you to write efficient database queries that only scan a small number of
documents in the table. Pagination allows you
to quickly display incremental lists of results. If your table could contain
more than a few thousand documents, you should consider pagination or an index
with a range expression to ensure that your queries stay fast.
For more details, check out our
Introduction to Indexes and Query Performance
article.
### Use tables to separate logical object types.​
Even though Convex does support nested documents, it is often better to put
separate objects into separate tables and use Ids to create references between
them. This will give you more flexibility when loading and
querying documents.
You can read more about this at Document IDs.
## UI patterns​
### Check for undefined to determine if a query is loading.​
The useQuery React hook will return undefined
when it is first mounted, before the query has been loaded from Convex. Once a
query is loaded it will never be undefined again (even as the data reactively
updates). undefined is not a valid return type for queries (you can see the
types that Convex supports at Data Types)
You can use this as a signal for when to render loading indicators and
placeholder UI.
### Add optimistic updates for the interactions you want to feel snappy.​
By default all relevant useQuery hooks will update automatically after a
mutation is synced from Convex. If you would like some interactions to happen
even faster, you can add
optimistic updates to your
useMutation calls so that the UI updates instantaneously.
### Use an exception handling service and error boundaries to manage errors.​
Inevitably, your Convex functions will have bugs and hit exceptions. If you have
an exception handling service and error boundaries configured, you can ensure
that you hear about these errors and your users see appropriate UI.
See Error Handling for more information.



Page URL: https://docs.convex.dev/production/contact

# Contact Us
Convex is a rapidly developing platform and we're always eager to hear your
feedback.
## Feedback and Support​
Please share any general questions, feature requests, or product feedback in our
Convex Discord Community. We're particularly
excited to see what you build on Convex!
Any specific support questions that aren't able to be adequately addressed on
our Discord channel can be directed to
support@convex.dev.
## Following Convex​
Release notes are shared on the Convex Blog and the
Convex Discord Community.
Product announcements, articles and demos are posted on the
Convex Blog and
Convex Youtube channel,
and Convex Twitter feed.
## Vulnerability Disclosure​
If you believe you've discovered a bug in Convex's security, please get in touch
at security@convex.dev and we'll get back to you
within 24 hours. We request that you not publicly disclose the issue until we
have had a chance to address it.



Page URL: https://docs.convex.dev/client/react

# Convex React
Convex React is the client library enabling your React application to interact
with your Convex backend. It allows your frontend code to:
The Convex React client is open source and available on
GitHub.
Follow the React Quickstart to get started with
React using Vite.
## Installation​
Convex React is part of the convex npm package:
```sh
npm install convex
```
## Connecting to a backend​
The ConvexReactClient maintains a
connection to your Convex backend, and is used by the React hooks described
below to call your functions.
First you need to create an instance of the client by giving it your backend
deployment URL. See
Configuring Deployment URL on how to pass
in the right value:
```sh
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient("https://<domain>.convex.cloud");
```
And then you make the client available to your app by passing it in to a
ConvexProvider wrapping your component
tree:
```sh
reactDOMRoot.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```
## Fetching data​
Your React app fetches data using the useQuery
React hook by calling your queries via an
api object.
The npx convex dev command generates this api object for you in the
convex/_generated/api.js module to provide better autocompletion in JavaScript
and end-to-end type safety in TypeScript:
```sh
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const data = useQuery(api.functions.myQuery);
  return data ?? "Loading...";
}
```
The useQuery hook returns undefined while the data is first loading and
afterwards the return value of your query.
### Query arguments​
Arguments to your query follow the query name:
```sh
export function App() {
  const a = "Hello world";
  const b = 4;
  const data = useQuery(api.functions.myQuery, { a, b });
  //...
}
```
### Reactivity​
The useQuery hook makes your app automatically reactive: when the underlying
data changes in your database, your component rerenders with the new query
result.
The first time the hook is used it creates a subscription to your backend for a
given query and any arguments you pass in. When your component unmounts, the
subscription is canceled.
### Consistency​
Convex React ensures that your application always renders a consistent view of
the query results based on a single state of the underlying database.
Imagine a mutation changes some data in the database, and that 2 different
useQuery call sites rely on this data. Your app will never render in an
inconsistent state where only one of the useQuery call sites reflects the new
data.
### One-off queries​
Sometimes you might want to read state from the database in response to a user
action, for example to validate given input, without making any changes to the
database. In this case you can use a one-off
query call, similarly to calling
mutations and actions.
The async method query is exposed on the ConvexReactClient, which you can
reference in your components via the
useConvex() hook.
```sh
import { useConvex } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const convex = useConvex();
  return (
    <button
      onClick={async () => {
        console.log(await convex.query(api.functions.myQuery));
      }}
    >
      Check
    </button>
  );
}
```
## Editing data​
Your React app edits data using the
useMutation React hook by calling your
mutations.
The convex dev command generates this api object for you in the
convex/_generated/api.js module to provide better autocompletion in JavaScript
and end-to-end type safety in TypeScript:
```sh
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  return <button onClick={() => doSomething()}>Click me</button>;
}
```
The hook returns an async function which performs the call to the mutation.
### Mutation arguments​
Arguments to your mutation are passed to the async function returned from
useMutation:
```sh
export function App() {
  const a = "Hello world";
  const b = 4;
  const doSomething = useMutation(api.functions.doSomething);
  return <button onClick={() => doSomething({ a, b })}>Click me</button>;
}
```
### Mutation response and error handling​
The mutation can optionally return a value or throw errors, which you can
await:
```sh
export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  const onClick = () => {
    async function callBackend() {
      try {
        const result = await doSomething();
      } catch (error) {
        console.error(error);
      }
      console.log(result);
    }
    void callBackend();
  };
  return <button onClick={onClick}>Click me</button>;
}
```
Or handle as a
Promise:
```sh
export function App() {
  const doSomething = useMutation(api.functions.doSomething);
  const onClick = () => {
    doSomething()
      .catch((error) => {
        console.error(error);
      })
      .then((result) => {
        console.log(result);
      });
  };
  return <button onClick={onClick}>Click me</button>;
}
```
Learn more about Error Handling in
functions.
### Retries​
Convex React automatically retries mutations until they are confirmed to have
been written to the database. The Convex backend ensures that despite multiple
retries, every mutation call only executes once.
Additionally, Convex React will warn users if they try to close their browser
tab while there are outstanding mutations. This means that when you call a
Convex mutation, you can be sure that the user's edits won't be lost.
### Optimistic updates​
Convex queries are fully reactive, so all query results will be automatically
updated after a mutation. Sometimes you may want to update the UI before the
mutation changes propagate back to the client. To accomplish this, you can
configure an optimistic update to execute as part of your mutation.
Optimistic updates are temporary, local changes to your query results which are
used to make your app more responsive.
See Optimistic Updates on how to
configure them.
## Calling third-party APIs​
Your React app can read data, call third-party services, and write data with a
single backend call using the useAction React
hook by calling your actions.
Like useQuery and useMutation, this hook is used with the api object
generated for you in the convex/_generated/api.js module to provide better
autocompletion in JavaScript and end-to-end type safety in
TypeScript:
```sh
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export function App() {
  const doSomeAction = useAction(api.functions.doSomeAction);
  return <button onClick={() => doSomeAction()}>Click me</button>;
}
```
The hook returns an async function which performs the call to the action.
### Action arguments​
Action arguments work exactly the same as
mutation arguments.
### Action response and error handling​
Action response and error handling work exactly the same as
mutation response and error handling.
Actions do not support automatic retries or optimistic updates.
## Under the hood​
The ConvexReactClient connects to your
Convex deployment by creating a
WebSocket. The
WebSocket provides a 2-way communication channel over TCP. This allows Convex to
push new query results reactively to the client without the client needing to
poll for updates.
If the internet connection drops, the client will handle reconnecting and
re-establishing the Convex session automatically.



Page URL: https://docs.convex.dev/client/react/deployment-urls

# Configuring Deployment URL
When connecting to your backend
it's important to correctly configure the deployment URL.
### Create a Convex project​
The first time you run
```sh
npx convex dev
```
in your project directory you will create a new Convex project.
Your new project includes two deployments: production and development. The
development deployment's URL will be saved in .env.local or .env file,
depending on the frontend framework or bundler you're using.
You can find the URLs of all deployments in a project by visiting the
deployment settings on your Convex
dashboard.
### Configure the client​
Construct a Convex React client by passing in the URL of the Convex deployment.
There should generally be a single Convex client in a frontend application.
```sh
import { ConvexProvider, ConvexReactClient } from "convex/react";

const deploymentURL = import.meta.env.VITE_CONVEX_URL;

const convex = new ConvexReactClient(deploymentURL);
```
While this URL can be hardcoded, it's convenient to use an environment variable
to determine which deployment the client should connect to.
Use an environment variable name accessible from your client code according to
the frontend framework or bundler you're using.
### Choosing environment variable names​
To avoid unintentionally exposing secret environment variables in frontend code,
many bundlers require environment variables referenced in frontend code to use a
specific prefix.
Vite requires environment
variables used in frontend code start with VITE_, so VITE_CONVEX_URL is a
good name.
Create React App
requires environment variables used in frontend code to begin with REACT_APP_,
so the code above uses REACT_APP_CONVEX_URL.
Next.js
requires them to begin with NEXT_PUBLIC_, so NEXT_PUBLIC_CONVEX_URL is a
good name.
Bundlers provide different ways to access these variables too: while
Vite uses import.meta.env.VARIABLE_NAME,
many other tools like Next.js use the Node.js-like
process.env.VARIABLE_NAME
```sh
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
```
.env files are a common way to wire up
different environment variable values in development and production
environments. npx convex dev will save the deployment URL to the corresponding
.env file, while trying to infer which bundler your project uses.
```sh
NEXT_PUBLIC_CONVEX_URL=https://guiltless-dog-960.convex.cloud

# examples of other environment variables that might be passed to the frontend
NEXT_PUBLIC_SENTRY_DSN=https://123abc@o123.ingest.sentry.io/1234
NEXT_PUBLIC_LAUNCHDARKLY_SDK_CLIENT_SIDE_ID=01234567890abcdef
```
Your backend functions can use
environment variables configured
on your dashboard. They do not source values from .env files.



Page URL: https://docs.convex.dev/client/react/optimistic-updates

# Optimistic Updates
Even though Convex queries are completely reactive, sometimes you'll want to
update your UI before the mutation changes propagate back to the client. To
accomplish this, you can configure an optimistic update to execute as part of
your mutation.
Optimistic updates are temporary, local changes to your query results which are
used to make your app more responsive. These updates are made by functions
registered on a mutation invocation with the
.withOptimisticUpdate
configuration option.
Optimistic updates are run when a mutation is initiated, rerun if the local
query results change, and rolled back when a mutation completes.
Optimistic updates are currently a beta
feature. If you have feedback or
feature requests, let us know on Discord!
## Simple example​
Here is how an optimistic update could be added to an increment mutation in a
simple counter app:
```sh
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

export function IncrementCounter() {
  const increment = useMutation(api.counter.increment).withOptimisticUpdate(
    (localStore, args) => {
      const { increment } = args;
      const currentValue = localStore.getQuery(api.counter.get);
      if (currentValue !== undefined) {
        localStore.setQuery(api.counter.get, {}, currentValue + increment);
      }
    }
  );

  const incrementCounter = () => {
    increment({ increment: 1 });
  };

  return <button onClick={incrementCounter}>+1</button>;
}
```
Optimistic updates receive a
localStore, a view of the
Convex client's internal state, followed by the arguments to the mutation.
This optimistic update updates the api.counter.get query to be increment
higher if it's loaded.
## Complex example​
If we want to add an optimistic update to a multi-channel chat app, that might
look like:
```sh
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "../convex/_generated/dataModel";

export function MessageSender(props: { channel: Id<"channels"> }) {
  const sendMessage = useMutation(api.messages.send).withOptimisticUpdate(
    (localStore, args) => {
      const { channel, body } = args;
      const existingMessages = localStore.getQuery(api.messages.list, {
        channel,
      });
      // If we've loaded the api.messages.list query, push an optimistic message
      // onto the list.
      if (existingMessages !== undefined) {
        const now = Date.now();
        const newMessage = {
          _id: crypto.randomUUID() as Id<"messages">,
          _creationTime: now,
          channel,
          body,
        };
        localStore.setQuery(api.messages.list, { channel }, [
          ...existingMessages,
          newMessage,
        ]);
      }
    }
  );

  async function handleSendMessage(
    channelId: Id<"channels">,
    newMessageText: string
  ) {
    await sendMessage({ channel: channelId, body: newMessageText });
  }

  return (
    <button onClick={() => handleSendMessage(props.channel, "Hello world!")}>
      Send message
    </button>
  );
}
```
This optimistic update changes the api.messages.list query for the current
channel to include a new message. The newly created message object should match
the structure of the real messages generated by the api.messages.list query on
the server.
Because this message includes the client's current time (not the server's), it
will inevitably not match the api.messages.list query after the mutation runs.
That's okay! The Convex client will handle rolling back this update after the
mutation completes and the queries are updated. If there are small mistakes in
optimistic updates, the UI will always eventually render the correct values.
Similarly, the update creates a temporary Id with
new Id("messages", crypto.randomUUID()). This will also be rolled back and
replaced with the true ID once the server assigns it.
Lastly, note that this update creates a new array of messages instead of using
existingMessages.push(newMessage). This is important! Mutating objects inside
of optimistic updates will corrupt the client's internal state and lead to
surprising results. Always create new objects inside of optimistic updates.
## Learning more​
To learn more, check out our API documentation:
If you'd like some hands on experience, try adding optimistic updates to the
tutorial app! If you do, you
should notice the app feels snappier — just a little, Convex is pretty fast
already! — but otherwise works the same.
To explore even further, try inserting a mistake into this update! You should
see a flicker as the optimistic update is applied and then rolled back.



Page URL: https://docs.convex.dev/client/react/nextjs/

# Next.js
Next.js is a React web development framework. When used
with Convex, Next.js provides:
and more!
This pages covers the App Router variant of Next.js. Alternatively see the
Pages Router version of
this page.
## Getting started​
Follow the Next.js Quickstart to add Convex to a
new or existing Next.js project.
## Adding client-side authentication​
The simplest approach to authentication in Next.js is to keep it client-side.
For example Auth0 describes this approach in
Next.js Authentication with Auth0 guide,
describing it in
"Next.js Static Site Approach"
and "Serverless with the user on the frontend".
To require login on every page of your application you can add logic to
app/ConvexClientProvider.tsx to conditionally render page content, blocking it
until the user is logged in.
If you're using Auth0, the helper component ConvexProviderWithAuth0 can be
imported from convex/react-auth0.
```sh
"use client";

import { ReactNode } from "react";
import { ConvexProviderWithAuth0, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined" ? undefined : window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        {children}
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```
Custom loading and logged out views can be built with the helper
Authenticated, Unauthenticated and AuthLoading components from
convex/react, see the
Convex Next.js demo
for an example.
If only some routes of your app require login, the same helpers can be used
directly in page components that do require login instead of being shared
between all pages from app/ConvexClientProvider.tsx. Share a single
ConvexReactClient instance between pages
to avoid needing to reconnect to Convex on client-side page navigation.
Read more about authenticating users with Convex in
Authentication.
## Route Handlers​
Next.js supports building HTTP request handling routes, similar to Convex
HTTP Actions. Using Next.js routes might be
helpful if you need to use a dependency not supported by the Convex default
runtime.
To build a
Route Handler
add route.js|ts file to the your app directory.
To load and edit Convex data in your route handler, you can use the
ConvexHttpClient to call your query and
mutation functions:
```sh
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function GET(request: Request) {
  const clicks = await convex.query(api.counter.get, { counterName: "clicks" });
  return NextResponse.json({ clicks });
}
```
## Server-side rendering​
We currently recommend client-side rendering Convex data when using Next.js.
This is because data from Convex is
fully reactive. Convex
needs a connection from your deployment to the browser in order to push updates
as data changes and that must happen on the client.
If you need Convex data on the server, you can load data from Convex in your
Server Components,
but it will be non-reactive. To do this, use the
ConvexHttpClient to call query
functions just like you would in Route Handlers.
To make authenticated requests to Convex during server-side rendering, the
ConvexHttpClient instance needs
authentication info present server-side. Auth0 describes this approach in
Serverless with the user on the backend.
When server-side rendering, call
ConvexHttpClient.setAuth to
fetch the user's identity token before making the query.
We are investigating ways to combine Next.js server-side rendering with
end-to-end reactivity. Stay tuned!



Page URL: https://docs.convex.dev/client/react/nextjs/pages

# Next.js Pages Router
This pages covers the Pages Router variant of Next.js. Alternatively see the
App Router version of this page.
## Getting started​
Follow the
Next.js Pages Router Quickstart
to add Convex to a new or existing Next.js project.
## Adding client-side authentication​
The simplest approach to authentication in Next.js is to keep it client-side.
For example Auth0 describes this approach in
Next.js Authentication with Auth0 guide,
describing it in
"Next.js Static Site Approach"
and "Serverless with the user on the frontend".
To require login on every page of your application you can add logic to
_app.jsx to conditionally render page content, blocking it until the user is
logged in.
If you're using Auth0, the helper component ConvexProviderWithAuth0 can be
imported from convex/react-auth0.
```sh
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth0 } from "convex/react-auth0";
import { Auth0Provider } from "@auth0/auth0-react";
import { AppProps } from "next/app";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri:
          typeof window === "undefined" ? undefined : window.location.origin,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <ConvexProviderWithAuth0 client={convex}>
        <Component {...pageProps} />
      </ConvexProviderWithAuth0>
    </Auth0Provider>
  );
}
```
Custom loading and logged out views can be built with the helper
Authenticated, Unauthenticated and AuthLoading components from
convex/react, see the
Convex Next.js demo
for an example.
If only some routes of your app require login, the same helpers can be used
directly in page components that do require login instead of being shared
between all pages from pages/_app.jsx. Share a single
ConvexReactClient instance between pages
to avoid needing to reconnect to Convex on client-side page navigation.
Read more about authenticating users with Convex in
Authentication.
## API routes​
Next.js supports building HTTP request handling routes, similar to Convex
HTTP Actions. Using Next.js routes might be
helpful if you need to use a dependency not supported by the Convex default
runtime.
To build an API route add a
file to the pages/api directory.
To load and edit Convex data in your endpoints, you can use the
ConvexHttpClient to call your query and
mutation functions:
```sh
import type { NextApiRequest, NextApiResponse } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const count = async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const clicks = await convex.query(api.counter.get, { counterName: "clicks" });
  res.status(200).json({ clicks });
};
```
## Server-side rendering​
We currently recommend client-side rendering Convex data when using Next.js.
This is because data from Convex is
fully reactive. Convex
needs a connection from your deployment to the browser in order to push updates
as data changes and that must happen on the client.
If you need Convex data on the server, you can load data from Convex in
getStaticProps
or
getServerSideProps,
but it will be non-reactive. To do this, use the
ConvexHttpClient to call query
functions just like you would in API routes.
To make authenticated requests to Convex during server-side rendering, the
ConvexHttpClient instance needs
authentication info present server-side. Auth0 describes this approach in
Serverless with the user on the backend.
When server-side rendering, call
ConvexHttpClient.setAuth to
fetch the user's identity token before making the query.
We are investigating ways to combine Next.js server-side rendering with
end-to-end reactivity. Stay tuned!



Page URL: https://docs.convex.dev/client/react/nextjs/pages-quickstart

# Next.js Pages Quickstart
Learn how to query data from Convex in a Next.js app using the Pages Router.
Alternatively see the App Router version of this
quickstart.
Create a Next.js app using the npx create-next-app command.
Choose the default option for every prompt (hit Enter).
```sh
npx create-next-app@latest my-app --no-app --js
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
In pages/_app.js, create a ConvexReactClient and pass it to a ConvexProvider
wrapping your app.
```sh
import "@/styles/globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function App({ Component, pageProps }) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}
```
In pages/index.js, use the useQuery hook to fetch from your api.tasks.get
API function.
```sh
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
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



Page URL: https://docs.convex.dev/client/react/quickstart-create-react-app

# Create-React-App Quickstart
Learn how to query data from Convex in a React app using Create React App.
Alternatively check out the React Quickstart using
Vite.
Create a React app using the create-react-app command.
```sh
npx create-react-app my-app
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
It will also create a src/convex/ folder for you
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
Add a new file tasks.js in the src/convex/ folder
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
In index.js, create a ConvexReactClient and pass it to a ConvexProvider
wrapping your app.
```sh
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.REACT_APP_CONVEX_URL);
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```
In App.js, use the useQuery hook to fetch from your api.tasks.get
API function.
```sh
import { useQuery } from "convex/react";
import { api } from "./convex/_generated/api";

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {JSON.stringify(tasks, null, 2)}
    </div>
  );
}
```
Start the app, go to http://localhost:3000 in a browser,
and see the serialized list of tasks at the top of the page.
```sh
npm start
```



Page URL: https://docs.convex.dev/client/react-native

# Convex React Native
To use Convex in React Native use the
Convex React client library.
Follow the React Native Quickstart for the
different configuration needed specifically for React Native.
You can also clone a working
Convex React Native demo.



Page URL: https://docs.convex.dev/client/javascript

# JavaScript
The ConvexHttpClient is the simplest
way to use Convex outside of React client components,
for example in a JavaScript backend or scripts,
See the Node.js Quickstart.
```sh
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api";

const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

// either this
const count = await client.query(api.counter.get);
// or this
client.query(api.counter.get).then((count) => console.log(count));
```
If you don't have generated code or the source code for your Convex functions
available from the project (monorepos are useful for this) you can use the
untyped api object called anyApi.
```sh
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const client = new ConvexHttpClient(process.env["CONVEX_URL"]);

// either this
const count = await client.query(anyApi.counter.get);
// or this
client.query(anyApi.counter.get).then((count) => console.log(count));
```



Page URL: https://docs.convex.dev/client/python

# Python
See the Python Quickstart and the
convex PyPI package
docs. The Python client is open source and available on
GitHub.



Page URL: https://docs.convex.dev/client/rust

# Rust
See the Rust Quickstart and
convex on
docs.rs docs. The Rust client is open source and available on
GitHub.



Page URL: https://docs.convex.dev/dashboard

# Dashboard

The dashboard shows all of your Convex teams
and projects, allowing you to manage your teams, projects, and Convex
deployments.



Page URL: https://docs.convex.dev/dashboard/teams

# Teams
In Convex, your projects are organized by team. Teams are used to share access
to your projects with other people. You may switch between teams or create a new
team by clicking on the team switcher located on the top-left corner of the
Convex dashboard.

You may change the name of a team or invite new members to a team by clicking on
the Settings navigation button while on the dashboard landing page.
## Team Settings​
### General​

### Members​
Use the members settings page to invite or remove members from your team.

### Billing​
Use the billing page to upgrade your Convex subscription to a higher tier, or
manage your existing subscription.
Learn more about Convex pricing.




Page URL: https://docs.convex.dev/dashboard/projects

# Projects

A project corresponds to a codebase that uses Convex, which contains a
production deployment and one personal deployment for each team member.
Clicking on a project in the landing page will redirect you to project details.
## Creating a project​
Projects cannot currently be created from the Convex dashboard. To create a
project, use the CLI.
## Project Settings​
You can access project-level settings by clicking on the triple-dot ⋮ button
on each Project card on the Projects page.

On the Project Settings page, you'll find:




Page URL: https://docs.convex.dev/deployments

# Deployments
Each project in Convex has one production deployment. In addition, each
developer on your team can create their own personal development deployment.
While on a project page, you may switch between your development deployment and
production by using the dropdown menu on the top-left of the page.




Page URL: https://docs.convex.dev/dashboard/deployments/functions

# Functions
 The functions view shows
all currently deployed Convex functions.
For dev deployments, these are updated continuously by
npx convex dev. The functions for
production deployments are registered with
npx convex deploy.
## Running functions​
To run a Convex function in the dashboard, select a function from the list on
the left-hand side of the page, and click the "Run Function" button that appears
next to the function's name.
This screen allows you to provide arguments for your function (in the order they
are defined in code), as well as view the results of your function.
Query results will update automatically as data changes and you modify function
arguments.
Mutation and action results will be visible once you click the "Run" button.
Note that these results will show the value returned from the function. To see
what changed when you ran your function, see the data view.

### Querying a paginated function​
When querying a paginated function in the dashboard, the UI will expect the
arguments to include
PaginationOptions -- i.e. an
object containing the numItems field, and optionally the cursor field. The
name of this argument should be the same as the name defined in your query
function.

### Assuming a user identity​
Assuming a user identity in the Convex dashboard does not give you access to a
real user identity. Instead, this concept can be thought of as "mocking" a user
identity into your function.
If you're building an authenticated application, you may want to run a Convex
function while acting as an authenticated user identity.
To do so, check the "Act as a user" box.
From there, you can type in the box that appears to fill out the user identity
object.

The valid user attributes are:
*These attributes are required.
## Metrics​
There are four basic charts for each function:
### Invocations​
This chart plots the number of times your function was called per minute. As
your app's usage increases, you should see this chart trend upward as well.
### Errors​
A plot of any exceptions that occur while running your function. Want to know
what's going wrong? Check out the logs page, detailed below.
### Cache Hit Rate​
Cache hit rate only applies to query functions
A percentage rate of how often this function is simply reusing a cached value
vs. being rerun. Your application will run best and your response times will be
fastest with high cache hit rates.
### Execution Time​
How long, in milliseconds, this function is taking to run.
There are four individual lines plotted on this chart, p50, p90, p95, and p99.
Each of these lines represents the response time for that percentile in the
distribution of hits over time. So, only 1% of requests took longer to run than
the time shown by the p99 line. Typically, keeping an eye on these tail
latencies is a good way to make sure your application is getting data services
quickly.
Consider the relationship of the execution time to the cache hit rate. As a
rule, a cache hit takes well under 1 ms, so the higher your cache hit rate, the
better your response times will be.
Clicking on any of the charts will give you a larger, detailed view where you
can customize the time ranges you're inspecting.
## Scheduled Jobs​
You can view all
scheduled invocations for the
function you are currently viewing. You can click to see a more detailed view,
including function arguments, as well as cancel all or individual scheduled
calls.



Page URL: https://docs.convex.dev/dashboard/deployments/data

# Data

The data view provides insight into your current tables and the documents
contained within each of those tables.
On the left side of the window is a list of your tables. Clicking on an
individual table will drill down into a layout that allows you to create, view,
update, and delete documents in that table.
## Filtering documents​
You may filters documents on the data page by clicking the "Filter" button on
the top of the page.

All fields in a document are filterable by the operations supported in Convex
query syntax. Equality
and Comparison when filtering in
the dashboard share the same rules as a query using the Convex client. You may
also filter based on the type of the field.
To add a filter, click "Add condition" in the filter selection menu. If you add
more than one condition, they will be evaluated using the and operation.
For each filter, you must select a field to filter by, operation, and comparison
value. In the third input box (selecting a value), you may enter a valid Convex
value, such as "a string", 123, or even a complex object, such as
{ a: { b: 2 } }
When filtering by _creationTime, a date picker will be displayed instead of
the normal JavaScript syntax input box. Comparisons for _creationTime are made
at the nanosecond granularity, so if you'd like to filter to an exact time, try
adding two filter conditions for creationTime >= $time and
creationTime <= $time + 1 minute.
## Creating tables​
You may create a table from the dashboard by clicking the "Create Table" button
and entering a new name for the table.
## Creating documents​
The dashboard currently supports editing all
Convex types except Sets, Maps, and Bytes.
You may add individual documents to the table using the "Add document" button
located in the data table's toolbar.
Once you click "Add document" a side panel will open, allowing you to add a new
document to your table using JavaScript syntax.

## Editing a cell​
To edit a value, double-click on a cell in the data table.
You can change the value by editing inline, or click on the pencil icon to open
an advanced editor, allowing you to change the data type.


## Editing a document​
To edit multiple values in a document at the same time, hover over the row and
click the button that appears on the right hand side.

## Adding references to other documents​
To add an ID reference to your document, use the syntax
new Id("TABLE_NAME", "ID_STRING") when editing or adding a document. If the ID
is valid, hovering the ID will indicate which document is being referenced.

## Deleting documents​
To selectively delete documents from a table, hover over and click on the "_id"
cell of a document row to select it. When at least one document is selected, the
"Delete documents" button will be visible in the table toolbar.
Clicking "Delete documents" will open a prompt to confirm deletion.

## Clear a table​
The "Clear table" button can be found by clicking on the overflow menu at the
top of the data view. This action will delete all documents in the table,
without deleting the table itself.
In production environments, the Convex dashboard will have you type in the name
of the table before deletion.

## Delete a table​
Deleting a table is irreversible. In production environments, the Convex
dashboard will have you type in the name of the table before deletion.

The "Delete table" button can be found by clicking on the overflow menu at the
top of the data view. This action will delete all documents and indexes for this
table, and remove the table from your list of tables. If this table had indexes,
you will need to redeploy your convex functions (by running npx convex deploy
or npx convex dev for production or development, respectively) to recreate the
indexes.
## Generating a schema​
At the bottom-left of the view is a "Generate Schema" button which you can click
to have Convex generate a schema of all your
documents within this table.

## Indexes​
The "Indexes" button can be found by clicking on the overflow menu at the top of
the data view.

This button will open a view showing the
Indexes associated with the selected table.
Indexes that have not completed backfilling will be accompanied by a loading
spinner next to their name.




Page URL: https://docs.convex.dev/dashboard/deployments/file-storage

# File Storage
The "File Storage" view displays
files stored in your deployment. From here, you can
see your existing files, their storage IDs, size, and content type. On this
page, you can upload new files and download or delete existing files. You may
choose to reference storage objects in a table by saving their "Storage ID" in a
document within a table.
When new files are uploaded, the UI will reference the name of the recently
uploaded file. However, these names are not persisted and will no longer appear
when the page is reloaded.




Page URL: https://docs.convex.dev/dashboard/deployments/logs

# Logs

The logs view is a realtime view of all activity that occurs within your
deployment.
Function activity includes:
In addition to function activity, deployment events describing
configuration changes will be present here.
You can use controls on the left-hand side of this page to filter logs by text,
function name, execution status, and log severity.
### Filter logs​
Use the "Filter" text box on the top of the controls to filter by the name of
the function or log text.
### Status​
The status of a log entry indicates whether the Convex function succeeded or
failed. All failed executions will include a reason, which will usually be a
JavaScript exception.
### Log Levels​
The log level filter will control which log lines are included in the logs page.
If a Convex function execution does not contain a log line matching the level
filter, it will be omitted from the results. The "No log lines" filter controls
whether executions with no console output are included in the results.



Page URL: https://docs.convex.dev/dashboard/deployments/history

# History

This history view is an audit log of configuration-related events that have
occurred in the selected deployment, such as function deployments, changes to
indexes, and changes to environment variables.



Page URL: https://docs.convex.dev/dashboard/deployments/deployment-settings

# Settings

This settings page gives you access to information and configuration options
related to a specific deployment (Production or your personal Development
environments).
Here, you'll find:



Page URL: https://docs.convex.dev/cli

# CLI
The Convex command-line interface (CLI) is your interface for managing Convex
projects and Convex functions.
To install the CLI, run:
```sh
npm install convex
```
You can view the full list of commands with:
```sh
npx convex
```
### Create a new project​
The first time you run
```sh
npx convex dev
```
it will ask you to log in your device and create a new Convex project. It will
then create:
### Recreate project configuration​
Run
```sh
npx convex dev
```
in a project directory without a set CONVEX_DEPLOYMENT to configure a new or
existing project.
## Write Code​
### Run the Convex dev server​
```sh
npx convex dev
```
Watches the local filesystem. When you change a function
or the schema, the new versions are pushed to your
dev deployment and the generated types in convex/_generated
are updated.
### Deploy Convex functions to production​
```sh
npx convex deploy
```
This command will:
Once this command succeeds the new functions will be available immediately.
### Modify authentication settings​
```sh
npx convex auth <subcommand>
```
Update the authentication settings for your application. The possible
subcommands are:
To learn more about adding authentication to your app, see
Authentication.
## Misc​
### Run Convex functions​
```sh
npx convex run <functionName> [args]
```
Run a public or internal Convex query, mutation, or action after pushing local
code.
Arguments are specified as a JSON object.
```sh
npx convex run messages:send '{"body": "hello", "author": "me"}'
```
Add --watch to live update the results of a query. Add --no-push to run the
active version of the code without pushing local changes.
The default is to run functions in your dev deployment. Use --prod to run
functions in the production deployment for a project.
### Import data from a file into a table​
```sh
npx convex import <tableName> <path>
```
Import a CSV, JSON, or JSONLines file into a Convex table.
Imports into a table with existing data will fail by default, but you can
specify --append to append the imported rows to the table or --replace to
replace existing data in the table with your import.
The default is to import into your dev deployment. Use --prod to import to
your production deployment
#### Limitations​
Currently Convex only supports imports of up to 8192 rows and 8MiB in size. To
work around this, you can split your large import file into smaller files and
run npx convex import --append for each one. Feel free to ping us in the
community Discord if you would like better
support for large imports!
### Update generated code​
```sh
npx convex codegen
```
Update the generated code in convex/_generated without
pushing. This can be useful for orchestrating build steps in CI.
### Open the dashboard​
```sh
npx convex dashboard
```
Open the Convex dashboard.
### Open the docs​
```sh
npx convex docs
```
Get back to these docs!



Page URL: https://docs.convex.dev/api/

# Convex
TypeScript/JavaScript client libraries and CLI for Convex.
Convex is the backend application platform with everything you need to build
your product.
Get started at docs.convex.dev!
Or see Convex demos.
Open discussions and issues in this repository about Convex
TypeScript/JavaScript clients, the Convex CLI, or the Convex platform in
general.
Also feel free to share feature requests, product feedback, or general questions
in the Convex Discord Community.
# Structure
This package includes several entry points for building apps on Convex:
This package also includes convex, the
command-line interface for managing Convex projects.



Page URL: https://docs.convex.dev/api/modules/browser

# Module: browser
Tools for accessing Convex in the browser.
If you are using React, use the react module instead.
## Usage​
Create a ConvexHttpClient to connect to the Convex Cloud.
```sh
import { ConvexHttpClient } from "convex/browser";
// typically loaded from an environment variable
const address = "https://small-mouse-123.convex.cloud";
const convex = new ConvexHttpClient(address);
```
## Classes​
## Interfaces​
## Type Aliases​
### FunctionResult​
Ƭ FunctionResult: { success: true ; value: Value ; logLines: string[]  } | { success: false ; errorMessage: string ; logLines: string[]  }
The result of running a function on the server.
If the function hit an exception it will have an errorMessage. Otherwise
it will produce a Value.
#### Defined in​
browser/sync/function_result.ts:11
### OptimisticUpdate​
Ƭ OptimisticUpdate<Args>: (localQueryStore: OptimisticLocalStore, args: Args) => void
#### Type parameters​
#### Type declaration​
▸ (localQueryStore, args): void
A temporary, local update to query results within this client.
This update will always be executed when a mutation is synced to the Convex
server and rolled back when the mutation completes.
Note that optimistic updates can be called multiple times! If the client
loads new data while the mutation is in progress, the update will be replayed
again.
##### Parameters​
##### Returns​
void
#### Defined in​
browser/sync/optimistic_updates.ts:90
### QueryJournal​
Ƭ QueryJournal: string | null
A serialized representation of decisions made during a query's execution.
A journal is produced when a query function first executes and is re-used
when a query is re-executed.
Currently this is used to store pagination end cursors to ensure
that pages of paginated queries will always end at the same cursor. This
enables gapless, reactive pagination.
null is used to represent empty journals.
#### Defined in​
browser/sync/protocol.ts:111
### UserIdentityAttributes​
Ƭ UserIdentityAttributes: Omit<UserIdentity, "tokenIdentifier">
#### Defined in​
browser/sync/protocol.ts:159
### QueryToken​
Ƭ QueryToken: string
A string representing the name and arguments of a query.
This is used by the BaseConvexClient.
#### Defined in​
browser/sync/udf_path_utils.ts:27



Page URL: https://docs.convex.dev/api/classes/browser.BaseConvexClient

# Class: BaseConvexClient
browser.BaseConvexClient
Low-level client for directly integrating state management libraries
with Convex.
Most developers should use higher level clients, like
the ConvexHttpClient or the React hook based ConvexReactClient.
## Constructors​
### constructor​
• new BaseConvexClient(address, onTransition, options?)
#### Parameters​
#### Defined in​
browser/sync/client.ts:149
## Methods​
### getMaxObservedTimestamp​
▸ getMaxObservedTimestamp(): undefined | Long
#### Returns​
undefined | Long
#### Defined in​
browser/sync/client.ts:331
### setAuth​
▸ setAuth(fetchToken, onChange): void
#### Parameters​
#### Returns​
void
#### Defined in​
browser/sync/client.ts:370
### hasAuth​
▸ hasAuth(): boolean
#### Returns​
boolean
#### Defined in​
browser/sync/client.ts:377
### clearAuth​
▸ clearAuth(): void
#### Returns​
void
#### Defined in​
browser/sync/client.ts:387
### subscribe​
▸ subscribe(name, args?, options?): Object
Subscribe to a query function.
Whenever this query's result changes, the onTransition callback
passed into the constructor will be called.
#### Parameters​
#### Returns​
Object
An object containing a QueryToken corresponding to this
query and an unsubscribe callback.
#### Defined in​
browser/sync/client.ts:406
### localQueryResult​
▸ localQueryResult(udfPath, args?): undefined | Value
A query result based only on the current, local state.
The only way this will return a value is if we're already subscribed to the
query or its value has been set optimistically.
#### Parameters​
#### Returns​
undefined | Value
#### Defined in​
browser/sync/client.ts:438
### queryJournal​
▸ queryJournal(name, args?): undefined | QueryJournal
Retrieve the current QueryJournal for this query function.
If we have not yet received a result for this query, this will be undefined.
#### Parameters​
#### Returns​
undefined | QueryJournal
The query's QueryJournal or undefined.
#### Defined in​
browser/sync/client.ts:468
### connectionState​
▸ connectionState(): ConnectionState
Get the current ConnectionState between the client and the Convex
backend.
#### Returns​
ConnectionState
The ConnectionState with the Convex backend.
#### Defined in​
browser/sync/client.ts:483
### mutation​
▸ mutation(name, args?, options?): Promise<any>
Execute a mutation function.
#### Parameters​
#### Returns​
Promise<any>
#### Defined in​
browser/sync/client.ts:502
### action​
▸ action(name, args?): Promise<any>
Execute an action function.
#### Parameters​
#### Returns​
Promise<any>
A promise of the action's result.
#### Defined in​
browser/sync/client.ts:561
### close​
▸ close(): Promise<void>
Close any network handles associated with this client and stop all subscriptions.
Call this method when you're done with an BaseConvexClient to
dispose of its sockets and resources.
#### Returns​
Promise<void>
A Promise fulfilled when the connection has been completely closed.
#### Defined in​
browser/sync/client.ts:600



Page URL: https://docs.convex.dev/api/classes/browser.ConvexHttpClient

# Class: ConvexHttpClient
browser.ConvexHttpClient
A Convex client that runs queries and mutations over HTTP.
This is appropriate for server-side code (like Netlify Lambdas) or non-reactive
webapps.
If you're building a React app, consider using
ConvexReactClient instead.
## Constructors​
### constructor​
• new ConvexHttpClient(address)
Create a new ConvexHttpClient.
#### Parameters​
#### Defined in​
browser/http_client.ts:52
## Methods​
### backendUrl​
▸ backendUrl(): string
Obtain the ConvexHttpClient's URL to its backend.
#### Returns​
string
The URL to the Convex backend, including the client's API version.
#### Defined in​
browser/http_client.ts:63
### setAuth​
▸ setAuth(value): void
Set the authentication token to be used for subsequent queries and mutations.
Should be called whenever the token changes (i.e. due to expiration and refresh).
#### Parameters​
#### Returns​
void
#### Defined in​
browser/http_client.ts:74
### clearAuth​
▸ clearAuth(): void
Clear the current authentication token if set.
#### Returns​
void
#### Defined in​
browser/http_client.ts:90
### query​
▸ query<Query>(query, ...args): Promise<FunctionReturnType<Query>>
Execute a Convex query function.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Query>>
A promise of the query's result.
#### Defined in​
browser/http_client.ts:112
### mutation​
▸ mutation<Mutation>(mutation, ...args): Promise<FunctionReturnType<Mutation>>
Execute a Convex mutation function.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Mutation>>
A promise of the mutation's result.
#### Defined in​
browser/http_client.ts:165
### action​
▸ action<Action>(action, ...args): Promise<FunctionReturnType<Action>>
Execute a Convex action function.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Action>>
A promise of the action's result.
#### Defined in​
browser/http_client.ts:217



Page URL: https://docs.convex.dev/api/interfaces/browser.ClientOptions

# Interface: ClientOptions
browser.ClientOptions
Options for BaseConvexClient.
## Properties​
### unsavedChangesWarning​
• Optional unsavedChangesWarning: boolean
Whether to prompt the user if they have unsaved changes pending
when navigating away or closing a web page.
This is only possible when the window object exists, i.e. in a browser.
The default value is true in browsers.
#### Defined in​
browser/sync/client.ts:51
### webSocketConstructor​
• Optional webSocketConstructor: Object
#### Call signature​
• new webSocketConstructor(url, protocols?): WebSocket
Specifies an alternate
WebSocket
constructor to use for client communication with the Convex cloud.
The default behavior is to use WebSocket from the global environment.
##### Parameters​
##### Returns​
WebSocket
#### Type declaration​
#### Defined in​
browser/sync/client.ts:58
### verbose​
• Optional verbose: boolean
Adds additional logging for debugging purposes.
The default value is false.
#### Defined in​
browser/sync/client.ts:64
### reportDebugInfoToConvex​
• Optional reportDebugInfoToConvex: boolean
Sends additional metrics to Convex for debugging purposes.
The default value is false.
#### Defined in​
browser/sync/client.ts:70



Page URL: https://docs.convex.dev/api/interfaces/browser.MutationOptions

# Interface: MutationOptions
browser.MutationOptions
Options for mutation.
## Properties​
### optimisticUpdate​
• Optional optimisticUpdate: OptimisticUpdate<any>
An optimistic update to apply along with this mutation.
An optimistic update locally updates queries while a mutation is pending.
Once the mutation completes, the update will be rolled back.
#### Defined in​
browser/sync/client.ts:112



Page URL: https://docs.convex.dev/api/interfaces/browser.OptimisticLocalStore

# Interface: OptimisticLocalStore
browser.OptimisticLocalStore
A view of the query results currently in the Convex client for use within
optimistic updates.
## Methods​
### getQuery​
▸ getQuery<Query>(query, ...args): undefined | FunctionReturnType<Query>
Retrieve the result of a query from the client.
Important: Query results should be treated as immutable!
Always make new copies of structures within query results to avoid
corrupting data within the client.
#### Type parameters​
#### Parameters​
#### Returns​
undefined | FunctionReturnType<Query>
The query result or undefined if the query is not currently
in the client.
#### Defined in​
browser/sync/optimistic_updates.ts:28
### getAllQueries​
▸ getAllQueries<Query>(query): { args: FunctionArgs<Query> ; value: undefined | FunctionReturnType<Query>  }[]
Retrieve the results are arguments of all queries with a given name.
This is useful for complex optimistic updates that need to inspect and
update many query results (for example updating a paginated list).
Important: Query results should be treated as immutable!
Always make new copies of structures within query results to avoid
corrupting data within the client.
#### Type parameters​
#### Parameters​
#### Returns​
{ args: FunctionArgs<Query> ; value: undefined | FunctionReturnType<Query>  }[]
An array of objects, one for each query of the given name.
Each object includes:
#### Defined in​
browser/sync/optimistic_updates.ts:49
### setQuery​
▸ setQuery<Query>(query, args, value): void
Optimistically update the result of a query.
This can either be a new value (perhaps derived from the old value from
getQuery) or undefined to remove the query.
Removing a query is useful to create loading states while Convex recomputes
the query results.
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
browser/sync/optimistic_updates.ts:69



Page URL: https://docs.convex.dev/api/interfaces/browser.SubscribeOptions

# Interface: SubscribeOptions
browser.SubscribeOptions
Options for subscribe.
## Properties​
### journal​
• Optional journal: QueryJournal
An (optional) journal produced from a previous execution of this query
function.
If there is an existing subscription to a query function with the same
name and arguments, this journal will have no effect.
#### Defined in​
browser/sync/client.ts:97



Page URL: https://docs.convex.dev/api/modules/server

# Module: server
Utilities for implementing server-side Convex query and mutation functions.
## Usage​
### Code Generation​
This module is typically used alongside generated server code.
To generate the server code, run npx convex dev in your Convex project.
This will create a convex/_generated/server.js file with the following
functions, typed for your schema:
If you aren't using TypeScript and code generation, you can use these untyped
functions instead:
### Example​
Convex functions are defined by using either the query or
mutation wrappers.
Queries receive a db that implements the DatabaseReader interface.
```sh
import { query } from "./_generated/server";

export default query(async ({ db }, { arg1, arg2 }) => {
  // Your (read-only) code here!
});
```
If your function needs to write to the database, such as inserting, updating,
or deleting documents, use mutation instead which provides a db that
implements the DatabaseWriter interface.
```sh
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, { arg1, arg2 }) => {
  // Your mutation code here!
});
```
## Classes​
## Interfaces​
## Type Aliases​
### FunctionType​
Ƭ FunctionType: "query" | "mutation" | "action"
The type of a Convex function.
#### Defined in​
server/api.ts:17
### FunctionReference​
Ƭ FunctionReference<Type, Visibility, Args, ReturnType>: Object
A reference to a registered Convex function.
You can create a FunctionReference using the generated api utility:
```sh
import { api } from "../convex/_generated/api";

const reference = api.myModule.myFunction;
```
If you aren't using code generation, you can create references using
anyApi:
```sh
import { anyApi } from "convex/server";

const reference = anyApi.myModule.myFunction;
```
Function references can be used to invoke functions from the client. For
example, in React you can pass references to the useQuery hook:
```sh
const result = useQuery(api.myModule.myFunction);
```
#### Type parameters​
#### Type declaration​
#### Defined in​
server/api.ts:50
### ApiFromModules​
Ƭ ApiFromModules<AllModules>: FilterApi<ApiFromModulesAllowEmptyNodes<AllModules>, FunctionReference<any, any, any, any>>
Given the types of all modules in the convex/ directory, construct the type
of api.
api is a utility for constructing FunctionReferences.
#### Type parameters​
#### Defined in​
server/api.ts:221
### FilterApi​
Ƭ FilterApi<API, Predicate>: Expand<{ [mod in keyof API as API[mod] extends Predicate ? mod : API[mod] extends FunctionReference<any, any, any, any> ? never : FilterApi<API[mod], Predicate> extends Record<string, never> ? never : mod]: API[mod] extends Predicate ? API[mod] : FilterApi<API[mod], Predicate> }>
Filter a Convex deployment api object for functions which meet criteria,
for example all public queries.
#### Type parameters​
#### Defined in​
server/api.ts:245
### AnyApi​
Ƭ AnyApi: Record<string, Record<string, AnyModuleDirOrFunc>>
The type that Convex api objects extend. If you were writing an api from
scratch it should extend this type.
#### Defined in​
server/api.ts:359
### PartialApi​
Ƭ PartialApi<API>: { [mod in keyof API]?: API[mod] extends FunctionReference<any, any, any, any> ? API[mod] : PartialApi<API[mod]> }
Recursive partial API, useful for defining a subset of an API when mocking
or building custom api objects.
#### Type parameters​
#### Defined in​
server/api.ts:367
### FunctionArgs​
Ƭ FunctionArgs<FuncRef>: FuncRef["_args"]
Given a FunctionReference, get the return type of the function.
This is represented as an object mapping argument names to values.
#### Type parameters​
#### Defined in​
server/api.ts:401
### OptionalRestArgs​
Ƭ OptionalRestArgs<FuncRef>: FuncRef["_args"] extends EmptyObject ? [args?: EmptyObject] : [args: FuncRef["_args"]]
A tuple type of the (maybe optional) arguments to FuncRef.
This type is used to make methods involving arguments type safe while allowing
skipping the arguments for functions that don't require arguments.
#### Type parameters​
#### Defined in​
server/api.ts:412
### ArgsAndOptions​
Ƭ ArgsAndOptions<FuncRef, Options>: FuncRef["_args"] extends EmptyObject ? [args?: EmptyObject, options?: Options] : [args: FuncRef["_args"], options?: Options]
A tuple type of the (maybe optional) arguments to FuncRef, followed by an options
object of type Options.
This type is used to make methods like useQuery type-safe while allowing
#### Type parameters​
#### Defined in​
server/api.ts:426
### FunctionReturnType​
Ƭ FunctionReturnType<FuncRef>: FuncRef["_returnType"]
Given a FunctionReference, get the return type of the function.
#### Type parameters​
#### Defined in​
server/api.ts:438
### GenericDocument​
Ƭ GenericDocument: Record<string, Value>
A document stored in Convex.
#### Defined in​
server/data_model.ts:9
### GenericFieldPaths​
Ƭ GenericFieldPaths: string
A type describing all of the document fields in a table.
These can either be field names (like "name") or references to fields on
nested objects (like "properties.name").
#### Defined in​
server/data_model.ts:18
### GenericIndexFields​
Ƭ GenericIndexFields: string[]
A type describing the ordered fields in an index.
These can either be field names (like "name") or references to fields on
nested objects (like "properties.name").
#### Defined in​
server/data_model.ts:29
### GenericTableIndexes​
Ƭ GenericTableIndexes: Record<string, GenericIndexFields>
A type describing the indexes in a table.
It's an object mapping each index name to the fields in the index.
#### Defined in​
server/data_model.ts:37
### GenericSearchIndexConfig​
Ƭ GenericSearchIndexConfig: Object
A type describing the configuration of a search index.
#### Type declaration​
#### Defined in​
server/data_model.ts:43
### GenericTableSearchIndexes​
Ƭ GenericTableSearchIndexes: Record<string, GenericSearchIndexConfig>
A type describing all of the search indexes in a table.
This is an object mapping each index name to the config for the index.
#### Defined in​
server/data_model.ts:54
### FieldTypeFromFieldPath​
Ƭ FieldTypeFromFieldPath<Document, FieldPath>: FieldPath extends `${infer First}.${infer Second}` ? First extends keyof Document ? Document[First] extends GenericDocument ? FieldTypeFromFieldPath<Document[First], Second> : undefined : undefined : FieldPath extends keyof Document ? Document[FieldPath] : undefined
The type of a field in a document.
Note that this supports both simple fields like "name" and nested fields like
"properties.name".
If the field is not present in the document it is considered to be undefined.
#### Type parameters​
#### Defined in​
server/data_model.ts:69
### GenericTableInfo​
Ƭ GenericTableInfo: Object
A type describing the document type and indexes in a table.
#### Type declaration​
#### Defined in​
server/data_model.ts:90
### DocumentByInfo​
Ƭ DocumentByInfo<TableInfo>: TableInfo["document"]
The type of a document in a table for a given GenericTableInfo.
#### Type parameters​
#### Defined in​
server/data_model.ts:101
### FieldPaths​
Ƭ FieldPaths<TableInfo>: TableInfo["fieldPaths"]
The field paths in a table for a given GenericTableInfo.
These can either be field names (like "name") or references to fields on
nested objects (like "properties.name").
#### Type parameters​
#### Defined in​
server/data_model.ts:111
### Indexes​
Ƭ Indexes<TableInfo>: TableInfo["indexes"]
The database indexes in a table for a given GenericTableInfo.
This will be an object mapping index names to the fields in the index.
#### Type parameters​
#### Defined in​
server/data_model.ts:120
### IndexNames​
Ƭ IndexNames<TableInfo>: keyof Indexes<TableInfo>
The names of indexes in a table for a given GenericTableInfo.
#### Type parameters​
#### Defined in​
server/data_model.ts:126
### NamedIndex​
Ƭ NamedIndex<TableInfo, IndexName>: Indexes<TableInfo>[IndexName]
Extract the fields of an index from a GenericTableInfo by name.
#### Type parameters​
#### Defined in​
server/data_model.ts:133
### SearchIndexes​
Ƭ SearchIndexes<TableInfo>: TableInfo["searchIndexes"]
The search indexes in a table for a given GenericTableInfo.
This will be an object mapping index names to the search index config.
#### Type parameters​
#### Defined in​
server/data_model.ts:144
### SearchIndexNames​
Ƭ SearchIndexNames<TableInfo>: keyof SearchIndexes<TableInfo>
The names of search indexes in a table for a given GenericTableInfo.
#### Type parameters​
#### Defined in​
server/data_model.ts:151
### NamedSearchIndex​
Ƭ NamedSearchIndex<TableInfo, IndexName>: SearchIndexes<TableInfo>[IndexName]
Extract the fields of an index from a GenericTableInfo by name.
#### Type parameters​
#### Defined in​
server/data_model.ts:158
### GenericDataModel​
Ƭ GenericDataModel: Record<string, GenericTableInfo>
A type describing the tables in a Convex project.
This is designed to be code generated with npx convex dev.
#### Defined in​
server/data_model.ts:171
### AnyDataModel​
Ƭ AnyDataModel: Object
A GenericDataModel that considers documents to be any and does not
support indexes.
This is the default before a schema is defined.
#### Index signature​
▪ [tableName: string]: { document: any ; fieldPaths: GenericFieldPaths ; indexes:  ; searchIndexes:   }
#### Defined in​
server/data_model.ts:180
### TableNamesInDataModel​
Ƭ TableNamesInDataModel<DataModel>: keyof DataModel & string
A type of all of the table names defined in a GenericDataModel.
#### Type parameters​
#### Defined in​
server/data_model.ts:195
### NamedTableInfo​
Ƭ NamedTableInfo<DataModel, TableName>: DataModel[TableName]
Extract the TableInfo for a table in a GenericDataModel by table
name.
#### Type parameters​
#### Defined in​
server/data_model.ts:204
### DocumentByName​
Ƭ DocumentByName<DataModel, TableName>: DataModel[TableName]["document"]
The type of a document in a GenericDataModel by table name.
#### Type parameters​
#### Defined in​
server/data_model.ts:213
### ExpressionOrValue​
Ƭ ExpressionOrValue<T>: Expression<T> | T
An Expression or a constant Value
#### Type parameters​
#### Defined in​
server/filter_builder.ts:38
### Cursor​
Ƭ Cursor: string
An opaque identifier used for paginating a database query.
Cursors are returned from paginate and represent the
point of the query where the page of results ended.
To continue paginating, pass the cursor back into
paginate in the PaginationOptions object to
fetch another page of results.
Note: Cursors can only be passed to exactly the same database query that
they were generated from. You may not reuse a cursor between different
database queries.
#### Defined in​
server/pagination.ts:19
### DefaultFunctionArgs​
Ƭ DefaultFunctionArgs: Record<string, unknown>
The default arguments type for a Convex query, mutation, or action function.
Convex functions always take an arguments object that maps the argument
names to their values.
#### Defined in​
server/registration.ts:164
### ArgsArray​
Ƭ ArgsArray: OneArgArray | NoArgsArray
An array of arguments to a Convex function.
Convex functions can take either a single DefaultFunctionArgs object or no
args at all.
#### Defined in​
server/registration.ts:187
### FunctionVisibility​
Ƭ FunctionVisibility: "public" | "internal"
A type representing the visibility of a Convex function.
#### Defined in​
server/registration.ts:212
### RegisteredMutation​
Ƭ RegisteredMutation<Visibility, Args, Output>: (ctx: MutationCtx<any>, args: Args) => Output & VisibilityProperties<Visibility>
A mutation function that is part of this app.
You can create a mutation by wrapping your function in
mutationGeneric or internalMutationGeneric and exporting it.
#### Type parameters​
#### Defined in​
server/registration.ts:235
### RegisteredQuery​
Ƭ RegisteredQuery<Visibility, Args, Output>: (ctx: QueryCtx<any>, args: Args) => Output & VisibilityProperties<Visibility>
A query function that is part of this app.
You can create a query by wrapping your function in
queryGeneric or internalQueryGeneric and exporting it.
#### Type parameters​
#### Defined in​
server/registration.ts:261
### RegisteredAction​
Ƭ RegisteredAction<Visibility, Args, Output>: (ctx: ActionCtx, args: Args) => Output & VisibilityProperties<Visibility>
An action that is part of this app.
You can create an action by wrapping your function in
actionGeneric or internalActionGeneric and exporting it.
#### Type parameters​
#### Defined in​
server/registration.ts:290
### PublicHttpAction​
Ƭ PublicHttpAction: Object
#### Call signature​
▸ (ctx, request): Response
An HTTP action that is part of this app's public API.
You can create public HTTP actions by wrapping your function in
httpActionGeneric and exporting it.
##### Parameters​
##### Returns​
Response
#### Type declaration​
#### Defined in​
server/registration.ts:316
### UnvalidatedFunction​
Ƭ UnvalidatedFunction<Ctx, Args, Output>: (ctx: Ctx, ...args: Args) => Output | { handler: (ctx: Ctx, ...args: Args) => Output  }
The definition of a Convex query, mutation, or action function without
argument validation.
Convex functions always take a context object as their first argument
and an (optional) args object as their second argument.
This can be written as a function like:
```sh
import { query } from "./_generated/server";

export const func = query(({ db }, { arg }) => {...});
```
or as an object like:
```sh
import { query } from "./_generated/server";

export const func = query({
  handler: ({ db }, { arg }) => {...},
});
```
See ValidatedFunction to add argument validation.
#### Type parameters​
#### Defined in​
server/registration.ts:351
### MutationBuilder​
Ƭ MutationBuilder<DataModel, Visibility>: <Output, ArgsValidator>(func: ValidatedFunction<MutationCtx<DataModel>, ArgsValidator, Output>) => RegisteredMutation<Visibility, ObjectType<ArgsValidator>, Output><Output, Args>(func: UnvalidatedFunction<MutationCtx<DataModel>, Args, Output>) => RegisteredMutation<Visibility, ArgsArrayToObject<Args>, Output>
#### Type parameters​
#### Type declaration​
▸ <Output, ArgsValidator>(func): RegisteredMutation<Visibility, ObjectType<ArgsValidator>, Output>
Internal type helper used by Convex code generation.
Used to give mutationGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredMutation<Visibility, ObjectType<ArgsValidator>, Output>
▸ <Output, Args>(func): RegisteredMutation<Visibility, ArgsArrayToObject<Args>, Output>
Internal type helper used by Convex code generation.
Used to give mutationGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredMutation<Visibility, ArgsArrayToObject<Args>, Output>
#### Defined in​
server/registration.ts:427
### QueryBuilder​
Ƭ QueryBuilder<DataModel, Visibility>: <Output, ArgsValidator>(func: ValidatedFunction<QueryCtx<DataModel>, ArgsValidator, Output>) => RegisteredQuery<Visibility, ObjectType<ArgsValidator>, Output><Output, Args>(func: UnvalidatedFunction<QueryCtx<DataModel>, Args, Output>) => RegisteredQuery<Visibility, ArgsArrayToObject<Args>, Output>
#### Type parameters​
#### Type declaration​
▸ <Output, ArgsValidator>(func): RegisteredQuery<Visibility, ObjectType<ArgsValidator>, Output>
Internal type helper used by Convex code generation.
Used to give queryGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredQuery<Visibility, ObjectType<ArgsValidator>, Output>
▸ <Output, Args>(func): RegisteredQuery<Visibility, ArgsArrayToObject<Args>, Output>
Internal type helper used by Convex code generation.
Used to give queryGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredQuery<Visibility, ArgsArrayToObject<Args>, Output>
#### Defined in​
server/registration.ts:446
### ActionBuilder​
Ƭ ActionBuilder<Visibility>: <Output, ArgsValidator>(func: ValidatedFunction<ActionCtx, ArgsValidator, Output>) => RegisteredAction<Visibility, ObjectType<ArgsValidator>, Output><Output, Args>(func: UnvalidatedFunction<ActionCtx, Args, Output>) => RegisteredAction<Visibility, ArgsArrayToObject<Args>, Output>
#### Type parameters​
#### Type declaration​
▸ <Output, ArgsValidator>(func): RegisteredAction<Visibility, ObjectType<ArgsValidator>, Output>
Internal type helper used by Convex code generation.
Used to give actionGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredAction<Visibility, ObjectType<ArgsValidator>, Output>
▸ <Output, Args>(func): RegisteredAction<Visibility, ArgsArrayToObject<Args>, Output>
Internal type helper used by Convex code generation.
Used to give actionGeneric a type specific to your data model.
##### Type parameters​
##### Parameters​
##### Returns​
RegisteredAction<Visibility, ArgsArrayToObject<Args>, Output>
#### Defined in​
server/registration.ts:465
### HttpActionBuilder​
Ƭ HttpActionBuilder: (func: (ctx: ActionCtx, request: Request) => Promise<Response>) => PublicHttpAction
#### Type declaration​
▸ (func): PublicHttpAction
Internal type helper used by Convex code generation.
Used to give httpActionGeneric a type specific to your data model
and functions.
##### Parameters​
##### Returns​
PublicHttpAction
#### Defined in​
server/registration.ts:482
### RoutableMethod​
Ƭ RoutableMethod: typeof ROUTABLE_HTTP_METHODS[number]
A type representing the methods supported by Convex HTTP actions.
HEAD is handled by Convex by running GET and stripping the body.
CONNECT is not supported and will not be supported.
TRACE is not supported and will not be supported.
#### Defined in​
server/router.ts:31
### SchedulableFunctionReference​
Ƭ SchedulableFunctionReference: FunctionReference<"mutation" | "action", "public" | "internal">
A FunctionReference that can be scheduled to run in the future.
Schedulable functions are mutations and actions that are public or internal.
#### Defined in​
server/scheduler.ts:10
### GenericSchema​
Ƭ GenericSchema: Record<string, TableDefinition>
A type describing the schema of a Convex project.
This should be constructed using defineSchema, defineTable,
and v.
#### Defined in​
server/schema.ts:312
### DataModelFromSchemaDefinition​
Ƭ DataModelFromSchemaDefinition<SchemaDef>: MaybeMakeLooseDataModel<{ [TableName in keyof SchemaDef["tables"] & string]: SchemaDef["tables"][TableName] extends TableDefinition<infer Document, infer FieldPaths, infer Indexes, infer SearchIndexes> ? Object : never }, SchemaDef["strictTableNameTypes"]>
Internal type used in Convex code generation!
Convert a SchemaDefinition into a GenericDataModel.
#### Type parameters​
#### Defined in​
server/schema.ts:441
### StorageId​
Ƭ StorageId: string
A reference to a file in storage.
This is used in the StorageReader and StorageWriter which are accessible in
Convex queries and mutations via QueryCtx and MutationCtx respectively.
#### Defined in​
server/storage.ts:9
### FileMetadata​
Ƭ FileMetadata: Object
Metadata for a single file as returned by storage.getMetadata.
#### Type declaration​
#### Defined in​
server/storage.ts:16
### WithoutSystemFields​
Ƭ WithoutSystemFields<Document>: Expand<BetterOmit<Document, keyof SystemFields | "_id">>
A Convex document with the system fields like _id and _creationTime omitted.
#### Type parameters​
#### Defined in​
server/system_fields.ts:28
## Variables​
### anyApi​
• Const anyApi: AnyApi
A utility for constructing FunctionReferences in projects that
are not using code generation.
You can create a reference to a function like:
```sh
const reference = anyApi.myModule.myFunction;
```
This supports accessing any path regardless of what directories and modules
are in your project. All function references are typed as
AnyFunctionReference.
If you're using code generation, use api from convex/_generated/api
instead. It will be more type-safe and produce better auto-complete
in your editor.
#### Defined in​
server/api.ts:393
### paginationOptsValidator​
• Const paginationOptsValidator: ObjectValidator<{ numItems: Validator<number, false, never> ; cursor: Validator<null | string, false, never> ; id: Validator<undefined | number, true, never>  }>
A Validator for PaginationOptions.
This includes the standard numItems and
cursor properties along with
an optional cache-busting id property used by react.usePaginatedQueryGeneric.
#### Defined in​
server/pagination.ts:109
### ROUTABLE_HTTP_METHODS​
• Const ROUTABLE_HTTP_METHODS: readonly ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
A list of the methods supported by Convex HTTP actions.
HEAD is handled by Convex by running GET and stripping the body.
CONNECT is not supported and will not be supported.
TRACE is not supported and will not be supported.
#### Defined in​
server/router.ts:14
## Functions​
### getFunctionName​
▸ getFunctionName(functionReference): string
Get the name of a function from a FunctionReference.
The name is a string like "myDir/myModule:myFunction". If the exported name
of the function is "default", the function name is omitted
(e.g. "myDir/myModule").
#### Parameters​
#### Returns​
string
A string of the function's name.
#### Defined in​
server/api.ts:79
### makeFunctionReference​
▸ makeFunctionReference<type, args, ret>(name): FunctionReference<type, "public", args, ret>
FunctionReferences generally come from generated code, but in custom clients
it may be useful to be able to build one manually.
Real function references are empty objects at runtime, but the same interface
can be implemented with an object for tests and clients which don't use
code generation.
#### Type parameters​
#### Parameters​
#### Returns​
FunctionReference<type, "public", args, ret>
#### Defined in​
server/api.ts:107
### filterApi​
▸ filterApi<API, Predicate>(api): FilterApi<API, Predicate>
Given an api of type API and a FunctionReference subtype, return an api object
containing only the function references that match.
```sh
const q = filterApi<typeof api, FunctionReference<"query">>(api)
```
#### Type parameters​
#### Parameters​
#### Returns​
FilterApi<API, Predicate>
#### Defined in​
server/api.ts:267
### cronJobs​
▸ cronJobs(): Crons
Create a CronJobs object to schedule recurring tasks.
```sh
// convex/crons.js
import { cronJobs } from 'convex/server';
import { api } from "./_generated/api";

const crons = cronJobs();
crons.weekly(
  "weekly re-engagement email",
  {
    hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
    minuteUTC: 30,
  },
  api.emails.send
)
export default crons;
```
#### Returns​
Crons
#### Defined in​
server/cron.ts:180
### mutationGeneric​
▸ mutationGeneric<Output, ArgsValidator>(func): RegisteredMutation<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define a mutation in this Convex app's public API.
This function will be allowed to modify your Convex database and will be accessible from the client.
If you're using code generation, use the mutation function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredMutation<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped mutation. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:431
▸ mutationGeneric<Output, Args>(func): RegisteredMutation<"public", ArgsArrayToObject<Args>, Output>
Define a mutation in this Convex app's public API.
This function will be allowed to modify your Convex database and will be accessible from the client.
If you're using code generation, use the mutation function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredMutation<"public", ArgsArrayToObject<Args>, Output>
The wrapped mutation. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:435
### internalMutationGeneric​
▸ internalMutationGeneric<Output, ArgsValidator>(func): RegisteredMutation<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define a mutation that is only accessible from other Convex functions (but not from the client).
This function will be allowed to modify your Convex database. It will not be accessible from the client.
If you're using code generation, use the internalMutation function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredMutation<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped mutation. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:431
▸ internalMutationGeneric<Output, Args>(func): RegisteredMutation<"internal", ArgsArrayToObject<Args>, Output>
Define a mutation that is only accessible from other Convex functions (but not from the client).
This function will be allowed to modify your Convex database. It will not be accessible from the client.
If you're using code generation, use the internalMutation function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredMutation<"internal", ArgsArrayToObject<Args>, Output>
The wrapped mutation. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:435
### queryGeneric​
▸ queryGeneric<Output, ArgsValidator>(func): RegisteredQuery<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define a query in this Convex app's public API.
This function will be allowed to read your Convex database and will be accessible from the client.
If you're using code generation, use the query function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredQuery<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped query. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:450
▸ queryGeneric<Output, Args>(func): RegisteredQuery<"public", ArgsArrayToObject<Args>, Output>
Define a query in this Convex app's public API.
This function will be allowed to read your Convex database and will be accessible from the client.
If you're using code generation, use the query function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredQuery<"public", ArgsArrayToObject<Args>, Output>
The wrapped query. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:454
### internalQueryGeneric​
▸ internalQueryGeneric<Output, ArgsValidator>(func): RegisteredQuery<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define a query that is only accessible from other Convex functions (but not from the client).
This function will be allowed to read from your Convex database. It will not be accessible from the client.
If you're using code generation, use the internalQuery function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredQuery<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped query. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:450
▸ internalQueryGeneric<Output, Args>(func): RegisteredQuery<"internal", ArgsArrayToObject<Args>, Output>
Define a query that is only accessible from other Convex functions (but not from the client).
This function will be allowed to read from your Convex database. It will not be accessible from the client.
If you're using code generation, use the internalQuery function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredQuery<"internal", ArgsArrayToObject<Args>, Output>
The wrapped query. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:454
### actionGeneric​
▸ actionGeneric<Output, ArgsValidator>(func): RegisteredAction<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define an action in this Convex app's public API.
If you're using code generation, use the action function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredAction<"public", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped function. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:466
▸ actionGeneric<Output, Args>(func): RegisteredAction<"public", ArgsArrayToObject<Args>, Output>
Define an action in this Convex app's public API.
If you're using code generation, use the action function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredAction<"public", ArgsArrayToObject<Args>, Output>
The wrapped function. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:470
### internalActionGeneric​
▸ internalActionGeneric<Output, ArgsValidator>(func): RegisteredAction<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
Define an action that is only accessible from other Convex functions (but not from the client).
If you're using code generation, use the internalAction function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredAction<"internal", Expand<{ [Property in string | number | symbol]?: ArgsValidator[Property]["type"] } & { [Property in string | number | symbol]: ArgsValidator[Property]["type"] }>, Output>
The wrapped function. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:466
▸ internalActionGeneric<Output, Args>(func): RegisteredAction<"internal", ArgsArrayToObject<Args>, Output>
Define an action that is only accessible from other Convex functions (but not from the client).
If you're using code generation, use the internalAction function in
convex/_generated/server.d.ts which is typed for your data model.
#### Type parameters​
#### Parameters​
#### Returns​
RegisteredAction<"internal", ArgsArrayToObject<Args>, Output>
The wrapped function. Include this as an export to name it and make it accessible.
#### Defined in​
server/registration.ts:470
### httpActionGeneric​
▸ httpActionGeneric(func): PublicHttpAction
Define a Convex HTTP action.
#### Parameters​
#### Returns​
PublicHttpAction
The wrapped function. Route a URL path to this function in convex/http.js.
#### Defined in​
server/impl/registration_impl.ts:367
### httpRouter​
▸ httpRouter(): HttpRouter
Return a new HttpRouter object.
#### Returns​
HttpRouter
#### Defined in​
server/router.ts:47
### defineTable​
▸ defineTable<DocumentSchema>(documentSchema): TableDefinition<ExtractDocument<DocumentSchema>, ExtractFieldPaths<DocumentSchema>>
Define a table in a schema.
You can either specify the schema of your documents as an object like
```sh
defineTable({
  field: v.string()
});
```
or as a schema type like
```sh
defineTable(
 v.union(
   v.object({...}),
   v.object({...})
 )
);
```
#### Type parameters​
#### Parameters​
#### Returns​
TableDefinition<ExtractDocument<DocumentSchema>, ExtractFieldPaths<DocumentSchema>>
A TableDefinition for the table.
#### Defined in​
server/schema.ts:252
▸ defineTable<DocumentSchema>(documentSchema): TableDefinition<ExtractDocument<ObjectValidator<DocumentSchema>>, ExtractFieldPaths<ObjectValidator<DocumentSchema>>>
Define a table in a schema.
You can either specify the schema of your documents as an object like
```sh
defineTable({
  field: v.string()
});
```
or as a schema type like
```sh
defineTable(
 v.union(
   v.object({...}),
   v.object({...})
 )
);
```
#### Type parameters​
#### Parameters​
#### Returns​
TableDefinition<ExtractDocument<ObjectValidator<DocumentSchema>>, ExtractFieldPaths<ObjectValidator<DocumentSchema>>>
A TableDefinition for the table.
#### Defined in​
server/schema.ts:285
### defineSchema​
▸ defineSchema<Schema, StrictTableNameTypes>(schema, options?): SchemaDefinition<Schema, StrictTableNameTypes>
Define the schema of this Convex project.
This should be exported from a schema.ts file in your convex/ directory
like:
```sh
export default defineSchema({
  ...
});
```
#### Type parameters​
#### Parameters​
#### Returns​
SchemaDefinition<Schema, StrictTableNameTypes>
The schema.
#### Defined in​
server/schema.ts:424



Page URL: https://docs.convex.dev/api/classes/server.Crons

# Class: Crons
server.Crons
A class for scheduling cron jobs.
To learn more see the documentation at https://docs.convex.dev/scheduling/cron-jobs
## Constructors​
### constructor​
• new Crons()
#### Defined in​
server/cron.ts:246
## Properties​
### crons​
• crons: Record<string, CronJob>
#### Defined in​
server/cron.ts:244
### isCrons​
• isCrons: true
#### Defined in​
server/cron.ts:245
## Methods​
### interval​
▸ interval<FuncRef>(cronIdentifier, schedule, functionReference, ...args): void
Schedule a mutation or action to run on an hourly basis.
```sh
crons.interval("Clear presence data", {seconds: 30}, api.presence.clear);
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:283
### hourly​
▸ hourly<FuncRef>(cronIdentifier, schedule, functionReference, ...args): void
Schedule a mutation or action to run on a daily basis.
```sh
crons.daily(
  "Reset high scores",
  {
    hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
    minuteUTC: 30,
  },
  api.scores.reset
)
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:332
### daily​
▸ daily<FuncRef>(cronIdentifier, schedule, functionReference, ...args): void
Schedule a mutation or action to run on a daily basis.
```sh
crons.daily(
  "Reset high scores",
  {
    hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
    minuteUTC: 30,
  },
  api.scores.reset
)
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:367
### weekly​
▸ weekly<FuncRef>(cronIdentifier, schedule, functionReference, ...args): void
Schedule a mutation or action to run on a weekly basis.
```sh
crons.weekly(
  "Weekly re-engagement email",
  {
    hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
    minuteUTC: 30,
  },
  api.emails.send
)
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:402
### monthly​
▸ monthly<FuncRef>(cronIdentifier, schedule, functionReference, ...args): void
Schedule a mutation or action to run on a monthly basis.
Note that some months have fewer days than others, so e.g. a function
scheduled to run on the 30th will not run in February.
```sh
crons.monthly(
  "Bill customers at ",
  {
    hourUTC: 17, // (9:30am Pacific/10:30am Daylight Savings Pacific)
    minuteUTC: 30,
    day: 1,
  },
  api.billing.billCustomers
)
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:443
### cron​
▸ cron<FuncRef>(cronIdentifier, cron, functionReference, ...args): void
Schedule a mutation or action to run on a recurring basis.
Like the unix command cron, Sunday is 0, Monday is 1, etc.
```sh
 ┌─ minute (0 - 59)
 │ ┌─ hour (0 - 23)
 │ │ ┌─ day of the month (1 - 31)
 │ │ │ ┌─ month (1 - 12)
 │ │ │ │ ┌─ day of the week (0 - 6) (Sunday to Saturday)
"* * * * *"
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
server/cron.ts:480



Page URL: https://docs.convex.dev/api/classes/server.Expression

# Class: Expression<T>
server.Expression
Expressions are evaluated to produce a Value in the course of executing a query.
To construct an expression, use the FilterBuilder provided within
filter.
## Type parameters​



Page URL: https://docs.convex.dev/api/classes/server.HttpRouter

# Class: HttpRouter
server.HttpRouter
HTTP router for specifying the paths and methods of httpActionGenerics
An example convex/http.js file might look like this.
```sh
import { httpRouter } from "convex/server";
import { getMessagesByAuthor } from "./getMessagesByAuthor";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// HTTP actions can be defined inline...
http.route({
  path: "/message",
  method: "POST",
  handler: httpAction(async ({ runMutation }, request) => {
    const { author, body } = await request.json();

    await runMutation(api.sendMessage.default, { body, author });
    return new Response(null, {
      status: 200,
    });
  })
});

// ...or they can be imported from other files.
http.route({
  path: "/getMessagesByAuthor",
  method: "GET",
  handler: getMessagesByAuthor,
});

// Convex expects the router to be the default export of `convex/http.js`.
export default http;
```
## Constructors​
### constructor​
• new HttpRouter()
## Properties​
### exactRoutes​
• exactRoutes: Map<string, Map<"GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", PublicHttpAction>>
#### Defined in​
server/router.ts:101
### prefixRoutes​
• prefixRoutes: Map<"GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", Map<string, PublicHttpAction>>
#### Defined in​
server/router.ts:102
### isRouter​
• isRouter: boolean = true
#### Defined in​
server/router.ts:103
## Methods​
### route​
▸ route(spec): void
Specify an HttpAction to be used to respond to requests
for an HTTP method (e.g. "GET") and a path or pathPrefix.
Paths must begin with a slash. Path prefixes must also end in a slash.
```sh
// matches `/profile` (but not `/profile/`)
http.route({ path: "/profile", method: "GET", handler: getProfile})

// matches `/profiles/`, `/profiles/abc`, and `/profiles/a/c/b` (but not `/profile`)
http.route({ pathPrefix: "/profile/", method: "GET", handler: getProfile})
```
#### Parameters​
#### Returns​
void
#### Defined in​
server/router.ts:119
### getRoutes​
▸ getRoutes(): readonly [string, "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", (...args: any[]) => any][]
Returns a list of routed HTTP actions.
These are used to populate the list of routes shown in the Functions page of the Convex dashboard.
#### Returns​
readonly [string, "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", (...args: any[]) => any][]
#### Defined in​
server/router.ts:185
### lookup​
▸ lookup(path, method): null | readonly [PublicHttpAction, "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", string]
Returns the appropriate HTTP action and its routed request path and method.
The path and method returned are used for logging and metrics, and should
match up with one of the routes returned by getRoutes.
For example,
```sh
http.route({ pathPrefix: "/profile/", method: "GET", handler: getProfile});

http.lookup("/profile/abc", "GET") // returns [getProfile, "GET", "/profile/*"]
```
#### Parameters​
#### Returns​
null | readonly [PublicHttpAction, "GET" | "POST" | "PUT" | "DELETE" | "OPTIONS" | "PATCH", string]
#### Defined in​
server/router.ts:231
### runRequest​
▸ runRequest(argsStr): Promise<string>
Given a JSON string representation of a Request object, return a Response
by routing the request and running the appropriate endpoint or returning
a 404 Response.
#### Parameters​
#### Returns​
Promise<string>
#### Defined in​
server/router.ts:257



Page URL: https://docs.convex.dev/api/classes/server.IndexRange

# Class: IndexRange
server.IndexRange
An expression representing an index range created by
IndexRangeBuilder.



Page URL: https://docs.convex.dev/api/classes/server.SchemaDefinition

# Class: SchemaDefinition<Schema, StrictTableTypes>
server.SchemaDefinition
The definition of a Convex project schema.
This should be produced by using defineSchema.
## Type parameters​
## Properties​
### tables​
• tables: Schema
#### Defined in​
server/schema.ts:325
### strictTableNameTypes​
• strictTableNameTypes: StrictTableTypes
#### Defined in​
server/schema.ts:326



Page URL: https://docs.convex.dev/api/classes/server.SearchFilter

# Class: SearchFilter
server.SearchFilter
An expression representing a search filter created by
SearchFilterBuilder.
## Hierarchy​
SearchFilter
↳ SearchFilterFinalizer



Page URL: https://docs.convex.dev/api/classes/server.TableDefinition

# Class: TableDefinition<Document, FieldPaths, Indexes, SearchIndexes>
server.TableDefinition
The definition of a table within a schema.
This should be produced by using defineTable.
## Type parameters​
## Methods​
### index​
▸ index<IndexName, FirstFieldPath, RestFieldPaths>(name, fields): TableDefinition<Document, FieldPaths, Expand<Indexes & Record<IndexName, [FirstFieldPath, ...RestFieldPaths[], "_creationTime"]>>, SearchIndexes>
Define an index on this table.
To learn about indexes, see Defining Indexes.
#### Type parameters​
#### Parameters​
#### Returns​
TableDefinition<Document, FieldPaths, Expand<Indexes & Record<IndexName, [FirstFieldPath, ...RestFieldPaths[], "_creationTime"]>>, SearchIndexes>
A TableDefinition with this index included.
#### Defined in​
server/schema.ts:146
### searchIndex​
▸ searchIndex<IndexName, SearchField, FilterFields>(name, indexConfig): TableDefinition<Document, FieldPaths, Indexes, Expand<SearchIndexes & Record<IndexName, { searchField: SearchField ; filterFields: FilterFields  }>>>
Define a search index on this table.
To learn about search indexes, see Search.
#### Type parameters​
#### Parameters​
#### Returns​
TableDefinition<Document, FieldPaths, Indexes, Expand<SearchIndexes & Record<IndexName, { searchField: SearchField ; filterFields: FilterFields  }>>>
A TableDefinition with this search index included.
#### Defined in​
server/schema.ts:180



Page URL: https://docs.convex.dev/api/interfaces/server.ActionCtx

# Interface: ActionCtx
server.ActionCtx
A set of services for use within Convex action functions.
The context is passed as the first argument to any Convex action
run on the server.
If you're using code generation, use the ActionCtx type in
convex/_generated/server.d.ts which is typed for your data model.
## Properties​
### scheduler​
• scheduler: Scheduler
A utility for scheduling Convex functions to run in the future.
#### Defined in​
server/registration.ts:143
### auth​
• auth: Auth
Information about the currently authenticated user.
#### Defined in​
server/registration.ts:148
### storage​
• storage: StorageActionWriter
A utility for reading and writing files in storage.
#### Defined in​
server/registration.ts:153
## Methods​
### runQuery​
▸ runQuery<Query>(query, ...args): Promise<FunctionReturnType<Query>>
Run the Convex query with the given name and arguments.
Consider using an internalQuery to prevent users from calling the
query directly.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Query>>
A promise of the query's result.
#### Defined in​
server/registration.ts:103
### runMutation​
▸ runMutation<Mutation>(mutation, ...args): Promise<FunctionReturnType<Mutation>>
Run the Convex mutation with the given name and arguments.
Consider using an internalMutation to prevent users from calling
the mutation directly.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Mutation>>
A promise of the mutation's result.
#### Defined in​
server/registration.ts:118
### runAction​
▸ runAction<Action>(action, ...args): Promise<FunctionReturnType<Action>>
Run the Convex action with the given name and arguments.
Consider using an internalAction to prevent users from calling the
action directly.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Action>>
A promise of the action's result.
#### Defined in​
server/registration.ts:135



Page URL: https://docs.convex.dev/api/interfaces/server.Auth

# Interface: Auth
server.Auth
An interface to access information about the currently authenticated user
within Convex query and mutation functions.
## Methods​
### getUserIdentity​
▸ getUserIdentity(): Promise<null | UserIdentity>
Get details about the currently authenticated user.
#### Returns​
Promise<null | UserIdentity>
A promise that resolves to a UserIdentity if the Convex
client was configured with a valid ID token and null otherwise.
#### Defined in​
server/authentication.ts:63



Page URL: https://docs.convex.dev/api/interfaces/server.CronJob

# Interface: CronJob
server.CronJob
A schedule to run a Convex mutation or action on.
You can schedule Convex functions to run regularly with
interval and exporting it.
## Properties​
### name​
• name: string
#### Defined in​
server/cron.ts:153
### args​
• args: JSONValue
#### Defined in​
server/cron.ts:154
### schedule​
• schedule: Schedule
#### Defined in​
server/cron.ts:155



Page URL: https://docs.convex.dev/api/interfaces/server.DatabaseReader

# Interface: DatabaseReader<DataModel>
server.DatabaseReader
An interface to read from the database within Convex query functions.
The two entry points are get, which fetches a single
document by its GenericId, or query, which starts
building a query.
If you're using code generation, use the DatabaseReader type in
convex/_generated/server.d.ts which is typed for your data model.
## Type parameters​
## Hierarchy​
DatabaseReader
↳ DatabaseWriter
## Methods​
### get​
▸ get<TableName>(id): Promise<null | DocumentByName<DataModel, TableName>>
Fetch a single document from the database by its GenericId.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<null | DocumentByName<DataModel, TableName>>
#### Defined in​
server/database.ts:33
### query​
▸ query<TableName>(tableName): QueryInitializer<NamedTableInfo<DataModel, TableName>>
Begin a query for the given table name.
Queries don't execute immediately, so calling this method and extending its
query are free until the results are actually used.
#### Type parameters​
#### Parameters​
#### Returns​
QueryInitializer<NamedTableInfo<DataModel, TableName>>
#### Defined in​
server/database.ts:46
### normalizeId​
▸ normalizeId<TableName>(tableName, id): null | GenericId<TableName>
Returns the string ID format for the ID in a given table, or null if the ID
is from a different table or is not a valid ID.
This accepts the string ID format as well as the .toString() representation
of the legacy class-based ID format.
This does not guarantee that the ID exists (i.e. db.get(id) may return null).
#### Type parameters​
#### Parameters​
#### Returns​
null | GenericId<TableName>
#### Defined in​
server/database.ts:62



Page URL: https://docs.convex.dev/api/interfaces/server.DatabaseWriter

# Interface: DatabaseWriter<DataModel>
server.DatabaseWriter
An interface to read from and write to the database within Convex mutation
functions.
Convex guarantees that all writes within a single mutation are
executed atomically, so you never have to worry about partial writes leaving
your data in an inconsistent state. See the Convex Guide
for the guarantees Convex provides your functions.
If you're using code generation, use the DatabaseReader type in
convex/_generated/server.d.ts which is typed for your data model.
## Type parameters​
## Hierarchy​
DatabaseReader<DataModel>
↳ DatabaseWriter
## Methods​
### get​
▸ get<TableName>(id): Promise<null | DocumentByName<DataModel, TableName>>
Fetch a single document from the database by its GenericId.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<null | DocumentByName<DataModel, TableName>>
#### Inherited from​
DatabaseReader.get
#### Defined in​
server/database.ts:33
### query​
▸ query<TableName>(tableName): QueryInitializer<NamedTableInfo<DataModel, TableName>>
Begin a query for the given table name.
Queries don't execute immediately, so calling this method and extending its
query are free until the results are actually used.
#### Type parameters​
#### Parameters​
#### Returns​
QueryInitializer<NamedTableInfo<DataModel, TableName>>
#### Inherited from​
DatabaseReader.query
#### Defined in​
server/database.ts:46
### normalizeId​
▸ normalizeId<TableName>(tableName, id): null | GenericId<TableName>
Returns the string ID format for the ID in a given table, or null if the ID
is from a different table or is not a valid ID.
This accepts the string ID format as well as the .toString() representation
of the legacy class-based ID format.
This does not guarantee that the ID exists (i.e. db.get(id) may return null).
#### Type parameters​
#### Parameters​
#### Returns​
null | GenericId<TableName>
#### Inherited from​
DatabaseReader.normalizeId
#### Defined in​
server/database.ts:62
### insert​
▸ insert<TableName>(table, value): Promise<GenericId<TableName>>
Insert a new document into a table.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<GenericId<TableName>>
#### Defined in​
server/database.ts:91
### patch​
▸ patch<TableName>(id, value): Promise<void>
Patch an existing document, shallow merging it with the given partial
document.
New fields are added. Existing fields are overwritten. Fields set to
undefined are removed.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/database.ts:107
### replace​
▸ replace<TableName>(id, value): Promise<void>
Replace the value of an existing document, overwriting its old value.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/database.ts:119
### delete​
▸ delete(id): Promise<void>
Delete an existing document.
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/database.ts:129



Page URL: https://docs.convex.dev/api/interfaces/server.DefineSchemaOptions

# Interface: DefineSchemaOptions<StrictTableNameTypes>
server.DefineSchemaOptions
Options for defineSchema.
## Type parameters​
## Properties​
### schemaValidation​
• Optional schemaValidation: boolean
Whether Convex should validate at runtime that all documents match
your schema.
If schemaValidation is true, Convex will:
If schemaValidation is false, Convex will not validate that new or
existing documents match your schema. You'll still get schema-specific
TypeScript types, but there will be no validation at runtime that your
documents match those types.
By default, schemaValidation is true.
#### Defined in​
server/schema.ts:382
### strictTableNameTypes​
• Optional strictTableNameTypes: StrictTableNameTypes
Whether the TypeScript types should allow accessing tables not in the schema.
If strictTableNameTypes is true, using tables not listed in the schema
will generate a TypeScript compilation error.
If strictTableNameTypes is false, you'll be able to access tables not
listed in the schema and their document type will be any.
strictTableNameTypes: false is useful for rapid prototyping.
Regardless of the value of strictTableNameTypes, your schema will only
validate documents in the tables listed in the schema. You can still create
and modify other tables on the dashboard or in JavaScript mutations.
By default, strictTableNameTypes is true.
#### Defined in​
server/schema.ts:401



Page URL: https://docs.convex.dev/api/interfaces/server.FilterBuilder

# Interface: FilterBuilder<TableInfo>
server.FilterBuilder
An interface for defining filters in queries.
FilterBuilder has various methods that produce Expressions.
These expressions can be nested together along with constants to express
a filter predicate.
FilterBuilder is used within filter to create query
filters.
Here are the available methods:
## Type parameters​
## Methods​
### eq​
▸ eq<T>(l, r): Expression<boolean>
l === r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:87
### neq​
▸ neq<T>(l, r): Expression<boolean>
l !== r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:97
### lt​
▸ lt<T>(l, r): Expression<boolean>
l < r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:107
### lte​
▸ lte<T>(l, r): Expression<boolean>
l <= r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:117
### gt​
▸ gt<T>(l, r): Expression<boolean>
l > r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:127
### gte​
▸ gte<T>(l, r): Expression<boolean>
l >= r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:137
### add​
▸ add<T>(l, r): Expression<T>
l + r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:149
### sub​
▸ sub<T>(l, r): Expression<T>
l - r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:159
### mul​
▸ mul<T>(l, r): Expression<T>
l * r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:169
### div​
▸ div<T>(l, r): Expression<T>
l / r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:179
### mod​
▸ mod<T>(l, r): Expression<T>
l % r
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:189
### neg​
▸ neg<T>(x): Expression<T>
-x
#### Type parameters​
#### Parameters​
#### Returns​
Expression<T>
#### Defined in​
server/filter_builder.ts:199
### and​
▸ and(...exprs): Expression<boolean>
exprs[0] && exprs[1] && ... && exprs[n]
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:208
### or​
▸ or(...exprs): Expression<boolean>
exprs[0] || exprs[1] || ... || exprs[n]
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:215
### not​
▸ not(x): Expression<boolean>
!x
#### Parameters​
#### Returns​
Expression<boolean>
#### Defined in​
server/filter_builder.ts:222
### field​
▸ field<FieldPath>(fieldPath): Expression<FieldTypeFromFieldPath<DocumentByInfo<TableInfo>, FieldPath>>
Evaluates to the field at the given fieldPath.
For example, in filter this can be used to examine the values being filtered.
#### Example​
On this object:
```sh
{
  "user": {
    "isActive": true
  }
}
```
field("user.isActive") evaluates to true.
#### Type parameters​
#### Parameters​
#### Returns​
Expression<FieldTypeFromFieldPath<DocumentByInfo<TableInfo>, FieldPath>>
#### Defined in​
server/filter_builder.ts:246



Page URL: https://docs.convex.dev/api/interfaces/server.IndexRangeBuilder

# Interface: IndexRangeBuilder<Document, IndexFields, FieldNum>
server.IndexRangeBuilder
Builder to define an index range to query.
An index range is a description of which documents Convex should consider
when running the query.
An index range is always a chained list of:
You must step through fields in index order.
Each equality expression must compare a different index field, starting from
the beginning and in order. The upper and lower bounds must follow the
equality expressions and compare the next field.
For example, if there is an index of messages on
["projectId", "priority"], a range searching for "messages in 'myProjectId'
with priority at least 100" would look like:
```sh
q.eq("projectId", myProjectId)
 .gte("priority", 100)
```
The performance of your query is based on the specificity of the range.
This class is designed to only allow you to specify ranges that Convex can
efficiently use your index to find. For all other filtering use
filter.
To learn about indexes, see Indexes.
## Type parameters​
## Hierarchy​
LowerBoundIndexRangeBuilder<Document, IndexFields[FieldNum]>
↳ IndexRangeBuilder
## Methods​
### eq​
▸ eq(fieldName, value): NextIndexRangeBuilder<Document, IndexFields, FieldNum>
Restrict this range to documents where doc[fieldName] === value.
#### Parameters​
#### Returns​
NextIndexRangeBuilder<Document, IndexFields, FieldNum>
#### Defined in​
server/index_range_builder.ts:76
### gt​
▸ gt(fieldName, value): UpperBoundIndexRangeBuilder<Document, IndexFields[FieldNum]>
Restrict this range to documents where doc[fieldName] > value.
#### Parameters​
#### Returns​
UpperBoundIndexRangeBuilder<Document, IndexFields[FieldNum]>
#### Inherited from​
LowerBoundIndexRangeBuilder.gt
#### Defined in​
server/index_range_builder.ts:114
### gte​
▸ gte(fieldName, value): UpperBoundIndexRangeBuilder<Document, IndexFields[FieldNum]>
Restrict this range to documents where doc[fieldName] >= value.
#### Parameters​
#### Returns​
UpperBoundIndexRangeBuilder<Document, IndexFields[FieldNum]>
#### Inherited from​
LowerBoundIndexRangeBuilder.gte
#### Defined in​
server/index_range_builder.ts:125
### lt​
▸ lt(fieldName, value): IndexRange
Restrict this range to documents where doc[fieldName] < value.
#### Parameters​
#### Returns​
IndexRange
#### Inherited from​
LowerBoundIndexRangeBuilder.lt
#### Defined in​
server/index_range_builder.ts:150
### lte​
▸ lte(fieldName, value): IndexRange
Restrict this range to documents where doc[fieldName] <= value.
#### Parameters​
#### Returns​
IndexRange
#### Inherited from​
LowerBoundIndexRangeBuilder.lte
#### Defined in​
server/index_range_builder.ts:163



Page URL: https://docs.convex.dev/api/interfaces/server.MutationCtx

# Interface: MutationCtx<DataModel>
server.MutationCtx
A set of services for use within Convex mutation functions.
The mutation context is passed as the first argument to any Convex mutation
function run on the server.
If you're using code generation, use the MutationCtx type in
convex/_generated/server.d.ts which is typed for your data model.
## Type parameters​
## Properties​
### db​
• db: DatabaseWriter<DataModel>
A utility for reading and writing data in the database.
#### Defined in​
server/registration.ts:32
### auth​
• auth: Auth
Information about the currently authenticated user.
#### Defined in​
server/registration.ts:37
### storage​
• storage: StorageWriter
A utility for reading and writing files in storage.
#### Defined in​
server/registration.ts:42
### scheduler​
• scheduler: Scheduler
A utility for scheduling Convex functions to run in the future.
#### Defined in​
server/registration.ts:47



Page URL: https://docs.convex.dev/api/interfaces/server.OrderedQuery

# Interface: OrderedQuery<TableInfo>
server.OrderedQuery
A Query with an order that has already been defined.
## Type parameters​
## Hierarchy​
AsyncIterable<DocumentByInfo<TableInfo>>
↳ OrderedQuery
↳↳ Query
## Methods​
### [asyncIterator]​
▸ [asyncIterator](): AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Returns​
AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Inherited from​
AsyncIterable.[asyncIterator]
#### Defined in​
../../common/temp/node_modules/.pnpm/typescript@5.0.4/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:38
### filter​
▸ filter(predicate): OrderedQuery<TableInfo>
Filter the query output, returning only the values for which predicate evaluates to true.
#### Parameters​
#### Returns​
OrderedQuery<TableInfo>
#### Defined in​
server/query.ts:165
### paginate​
▸ paginate(paginationOpts): Promise<PaginationResult<DocumentByInfo<TableInfo>>>
Load a page of n results and obtain a Cursor for loading more.
Note: If this is called from a reactive query function the number of
results may not match paginationOpts.numItems!
paginationOpts.numItems is only an initial value. After the first invocation,
paginate will return all items in the original query range. This ensures
that all pages will remain adjacent and non-overlapping.
#### Parameters​
#### Returns​
Promise<PaginationResult<DocumentByInfo<TableInfo>>>
A PaginationResult containing the page of results and a
cursor to continue paginating.
#### Defined in​
server/query.ts:194
### collect​
▸ collect(): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return all of the results as an array.
Note: when processing a query with a lot of results, it's often better to use the Query as an
AsyncIterable instead.
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Defined in​
server/query.ts:206
### take​
▸ take(n): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return the first n results.
#### Parameters​
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Defined in​
server/query.ts:215
### first​
▸ first(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the first result if there is one.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Defined in​
server/query.ts:222
### unique​
▸ unique(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the singular result if there is one.
Throws
Will throw an error if the query returns more than one result.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Defined in​
server/query.ts:230



Page URL: https://docs.convex.dev/api/interfaces/server.PaginationOptions

# Interface: PaginationOptions
server.PaginationOptions
The options passed to paginate.
To use this type in argument validation,
use the paginationOptsValidator.
## Properties​
### numItems​
• numItems: number
Number of items to load in this page of results.
Note: This is only an initial value!
If you are running this paginated query in a reactive query function, you
may receive more or less items than this if items were added to or removed
from the query range.
#### Defined in​
server/pagination.ts:61
### cursor​
• cursor: null | string
A Cursor representing the start of this page or null to start
at the beginning of the query results.
#### Defined in​
server/pagination.ts:67



Page URL: https://docs.convex.dev/api/interfaces/server.PaginationResult

# Interface: PaginationResult<T>
server.PaginationResult
The result of paginating using paginate.
## Type parameters​
## Properties​
### page​
• page: T[]
The page of results.
#### Defined in​
server/pagination.ts:30
### isDone​
• isDone: boolean
Have we reached the end of the results?
#### Defined in​
server/pagination.ts:35
### continueCursor​
• continueCursor: string
A Cursor to continue loading more results.
#### Defined in​
server/pagination.ts:40



Page URL: https://docs.convex.dev/api/interfaces/server.Query

# Interface: Query<TableInfo>
server.Query
The Query interface allows functions to read values out of the database.
If you only need to load an object by ID, use db.get(id) instead.
Executing a query consists of calling
Queries are lazily evaluated. No work is done until iteration begins, so constructing and
extending a query is free. The query is executed incrementally as the results are iterated over,
so early terminating also reduces the cost of the query.
It is more efficient to use filter expression rather than executing JavaScript to filter.
To learn more about how to write queries, see Querying the Database.
## Type parameters​
## Hierarchy​
OrderedQuery<TableInfo>
↳ Query
↳↳ QueryInitializer
## Methods​
### [asyncIterator]​
▸ [asyncIterator](): AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Returns​
AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Inherited from​
OrderedQuery.[asyncIterator]
#### Defined in​
../../common/temp/node_modules/.pnpm/typescript@5.0.4/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:38
### order​
▸ order(order): OrderedQuery<TableInfo>
Define the order of the query output.
Use "asc" for an ascending order and "desc" for a descending order. If not specified, the order defaults to ascending.
#### Parameters​
#### Returns​
OrderedQuery<TableInfo>
#### Defined in​
server/query.ts:149
### filter​
▸ filter(predicate): Query<TableInfo>
Filter the query output, returning only the values for which predicate evaluates to true.
#### Parameters​
#### Returns​
Query<TableInfo>
#### Inherited from​
OrderedQuery.filter
#### Defined in​
server/query.ts:165
### paginate​
▸ paginate(paginationOpts): Promise<PaginationResult<DocumentByInfo<TableInfo>>>
Load a page of n results and obtain a Cursor for loading more.
Note: If this is called from a reactive query function the number of
results may not match paginationOpts.numItems!
paginationOpts.numItems is only an initial value. After the first invocation,
paginate will return all items in the original query range. This ensures
that all pages will remain adjacent and non-overlapping.
#### Parameters​
#### Returns​
Promise<PaginationResult<DocumentByInfo<TableInfo>>>
A PaginationResult containing the page of results and a
cursor to continue paginating.
#### Inherited from​
OrderedQuery.paginate
#### Defined in​
server/query.ts:194
### collect​
▸ collect(): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return all of the results as an array.
Note: when processing a query with a lot of results, it's often better to use the Query as an
AsyncIterable instead.
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Inherited from​
OrderedQuery.collect
#### Defined in​
server/query.ts:206
### take​
▸ take(n): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return the first n results.
#### Parameters​
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Inherited from​
OrderedQuery.take
#### Defined in​
server/query.ts:215
### first​
▸ first(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the first result if there is one.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Inherited from​
OrderedQuery.first
#### Defined in​
server/query.ts:222
### unique​
▸ unique(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the singular result if there is one.
Throws
Will throw an error if the query returns more than one result.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Inherited from​
OrderedQuery.unique
#### Defined in​
server/query.ts:230



Page URL: https://docs.convex.dev/api/interfaces/server.QueryCtx

# Interface: QueryCtx<DataModel>
server.QueryCtx
A set of services for use within Convex query functions.
The query context is passed as the first argument to any Convex query
function run on the server.
This differs from the MutationCtx because all of the services are
read-only.
If you're using code generation, use the QueryCtx type in
convex/_generated/server.d.ts which is typed for your data model.
## Type parameters​
## Properties​
### db​
• db: DatabaseReader<DataModel>
A utility for reading data in the database.
#### Defined in​
server/registration.ts:68
### auth​
• auth: Auth
Information about the currently authenticated user.
#### Defined in​
server/registration.ts:73
### storage​
• storage: StorageReader
A utility for reading files in storage.
#### Defined in​
server/registration.ts:78



Page URL: https://docs.convex.dev/api/interfaces/server.QueryInitializer

# Interface: QueryInitializer<TableInfo>
server.QueryInitializer
The QueryInitializer interface is the entry point for building a Query
over a Convex database table.
There are two types of queries:
For convenience, QueryInitializer extends the Query interface, implicitly
starting a full table scan.
## Type parameters​
## Hierarchy​
Query<TableInfo>
↳ QueryInitializer
## Methods​
### [asyncIterator]​
▸ [asyncIterator](): AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Returns​
AsyncIterator<DocumentByInfo<TableInfo>, any, undefined>
#### Inherited from​
Query.[asyncIterator]
#### Defined in​
../../common/temp/node_modules/.pnpm/typescript@5.0.4/node_modules/typescript/lib/lib.es2018.asynciterable.d.ts:38
### fullTableScan​
▸ fullTableScan(): Query<TableInfo>
Query by reading all of the values out of this table.
This query's cost is relative to the size of the entire table, so this
should only be used on tables that will stay very small (say between a few
hundred and a few thousand documents) and are updated infrequently.
#### Returns​
Query<TableInfo>
#### Defined in​
server/query.ts:40
### withIndex​
▸ withIndex<IndexName>(indexName, indexRange?): Query<TableInfo>
Query by reading documents from an index on this table.
This query's cost is relative to the number of documents that match the
index range expression.
Results will be returned in index order.
To learn about indexes, see Indexes.
#### Type parameters​
#### Parameters​
#### Returns​
Query<TableInfo>
#### Defined in​
server/query.ts:59
### withSearchIndex​
▸ withSearchIndex<IndexName>(indexName, searchFilter): OrderedQuery<TableInfo>
Query by running a full text search against a search index.
Search queries must always search for some text within the index's
searchField. This query can optionally add equality filters for any
filterFields specified in the index.
Documents will be returned in relevance order based on how well they
match the search text.
To learn about full text search, see Indexes.
#### Type parameters​
#### Parameters​
#### Returns​
OrderedQuery<TableInfo>
#### Defined in​
server/query.ts:88
### order​
▸ order(order): OrderedQuery<TableInfo>
Define the order of the query output.
Use "asc" for an ascending order and "desc" for a descending order. If not specified, the order defaults to ascending.
#### Parameters​
#### Returns​
OrderedQuery<TableInfo>
#### Inherited from​
Query.order
#### Defined in​
server/query.ts:149
### filter​
▸ filter(predicate): QueryInitializer<TableInfo>
Filter the query output, returning only the values for which predicate evaluates to true.
#### Parameters​
#### Returns​
QueryInitializer<TableInfo>
#### Inherited from​
Query.filter
#### Defined in​
server/query.ts:165
### paginate​
▸ paginate(paginationOpts): Promise<PaginationResult<DocumentByInfo<TableInfo>>>
Load a page of n results and obtain a Cursor for loading more.
Note: If this is called from a reactive query function the number of
results may not match paginationOpts.numItems!
paginationOpts.numItems is only an initial value. After the first invocation,
paginate will return all items in the original query range. This ensures
that all pages will remain adjacent and non-overlapping.
#### Parameters​
#### Returns​
Promise<PaginationResult<DocumentByInfo<TableInfo>>>
A PaginationResult containing the page of results and a
cursor to continue paginating.
#### Inherited from​
Query.paginate
#### Defined in​
server/query.ts:194
### collect​
▸ collect(): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return all of the results as an array.
Note: when processing a query with a lot of results, it's often better to use the Query as an
AsyncIterable instead.
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Inherited from​
Query.collect
#### Defined in​
server/query.ts:206
### take​
▸ take(n): Promise<DocumentByInfo<TableInfo>[]>
Execute the query and return the first n results.
#### Parameters​
#### Returns​
Promise<DocumentByInfo<TableInfo>[]>
#### Inherited from​
Query.take
#### Defined in​
server/query.ts:215
### first​
▸ first(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the first result if there is one.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Inherited from​
Query.first
#### Defined in​
server/query.ts:222
### unique​
▸ unique(): Promise<null | DocumentByInfo<TableInfo>>
Execute the query and return the singular result if there is one.
Throws
Will throw an error if the query returns more than one result.
#### Returns​
Promise<null | DocumentByInfo<TableInfo>>
#### Inherited from​
Query.unique
#### Defined in​
server/query.ts:230



Page URL: https://docs.convex.dev/api/interfaces/server.Scheduler

# Interface: Scheduler
server.Scheduler
An interface to schedule Convex functions.
You can schedule either mutations or actions. Mutations are guaranteed to execute
exactly once - they are automatically retried on transient errors and either execute
successfully or fail deterministically due to developer error in defining the
function. Actions execute at most once - they are not retried and might fail
due to transient errors.
Consider using an internalMutation or internalAction to enforce that
these functions cannot be called directly from a Convex client.
## Methods​
### runAfter​
▸ runAfter<FuncRef>(delayMs, functionReference, ...args): Promise<void>
Schedule a function to execute after a delay.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/scheduler.ts:40
### runAt​
▸ runAt<FuncRef>(timestamp, functionReference, ...args): Promise<void>
Schedule a function to execute at a given timestamp.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/scheduler.ts:57



Page URL: https://docs.convex.dev/api/interfaces/server.SearchFilterBuilder

# Interface: SearchFilterBuilder<Document, SearchIndexConfig>
server.SearchFilterBuilder
Builder for defining search filters.
A search filter is a chained list of:
The search expression must search for text in the index's searchField. The
filter expressions can use any of the filterFields defined in the index.
For all other filtering use filter.
To learn about full text search, see Indexes.
## Type parameters​
## Methods​
### search​
▸ search(fieldName, query): SearchFilterFinalizer<Document, SearchIndexConfig>
Search for the terms in query within doc[fieldName].
This will do a full text search that returns results where any word of of
query appears in the field.
Documents will be returned based on their relevance to the query. This
takes into account:
#### Parameters​
#### Returns​
SearchFilterFinalizer<Document, SearchIndexConfig>
#### Defined in​
server/search_filter_builder.ts:42



Page URL: https://docs.convex.dev/api/interfaces/server.SearchFilterFinalizer

# Interface: SearchFilterFinalizer<Document, SearchIndexConfig>
server.SearchFilterFinalizer
Builder to define equality expressions as part of a search filter.
See SearchFilterBuilder.
## Type parameters​
## Hierarchy​
SearchFilter
↳ SearchFilterFinalizer
## Methods​
### eq​
▸ eq<FieldName>(fieldName, value): SearchFilterFinalizer<Document, SearchIndexConfig>
Restrict this query to documents where doc[fieldName] === value.
#### Type parameters​
#### Parameters​
#### Returns​
SearchFilterFinalizer<Document, SearchIndexConfig>
#### Defined in​
server/search_filter_builder.ts:66



Page URL: https://docs.convex.dev/api/interfaces/server.SearchIndexConfig

# Interface: SearchIndexConfig<SearchField, FilterFields>
server.SearchIndexConfig
The configuration for a search index.
## Type parameters​
## Properties​
### searchField​
• searchField: SearchField
The field to index for full text search.
This must be a field of type string.
#### Defined in​
server/schema.ts:84
### filterFields​
• Optional filterFields: FilterFields[]
Additional fields to index for fast filtering when running search queries.
#### Defined in​
server/schema.ts:89



Page URL: https://docs.convex.dev/api/interfaces/server.StorageActionWriter

# Interface: StorageActionWriter
server.StorageActionWriter
An interface to read and write files to storage within Convex actions and HTTP actions.
## Hierarchy​
StorageWriter
↳ StorageActionWriter
## Methods​
### getUrl​
▸ getUrl(storageId): Promise<null | string>
Get the URL for a file in storage by its StorageId.
The GET response includes a standard HTTP Digest header with a sha256 checksum.
#### Parameters​
#### Returns​
Promise<null | string>
#### Inherited from​
StorageWriter.getUrl
#### Defined in​
server/storage.ts:49
### getMetadata​
▸ getMetadata(storageId): Promise<null | FileMetadata>
Get metadata for a file.
#### Parameters​
#### Returns​
Promise<null | FileMetadata>
#### Inherited from​
StorageWriter.getMetadata
#### Defined in​
server/storage.ts:56
### generateUploadUrl​
▸ generateUploadUrl(): Promise<string>
Fetch a short-lived URL for uploading a file into storage.
Upon a POST request to this URL, the endpoint will return a JSON object containing a newly allocated StorageId.
The POST URL accepts an optional standard HTTP Digest header with a sha256 checksum.
#### Returns​
Promise<string>
#### Inherited from​
StorageWriter.generateUploadUrl
#### Defined in​
server/storage.ts:74
### delete​
▸ delete(storageId): Promise<void>
Delete a file from Convex storage.
Once a file is deleted, any URLs previously generated by getUrl will return 404s.
#### Parameters​
#### Returns​
Promise<void>
#### Inherited from​
StorageWriter.delete
#### Defined in​
server/storage.ts:82
### get​
▸ get(storageId): Promise<null | Blob>
Get a Blob containing the file associated with the provided StorageId, or null if there is no file.
#### Parameters​
#### Returns​
Promise<null | Blob>
#### Defined in​
server/storage.ts:94
### store​
▸ store(blob, options?): Promise<string>
Store the file contained in the Blob.
If provided, this will verify the sha256 checksum matches the contents of the file.
#### Parameters​
#### Returns​
Promise<string>
#### Defined in​
server/storage.ts:100



Page URL: https://docs.convex.dev/api/interfaces/server.StorageReader

# Interface: StorageReader
server.StorageReader
An interface to read files from storage within Convex query functions.
## Hierarchy​
StorageReader
↳ StorageWriter
## Methods​
### getUrl​
▸ getUrl(storageId): Promise<null | string>
Get the URL for a file in storage by its StorageId.
The GET response includes a standard HTTP Digest header with a sha256 checksum.
#### Parameters​
#### Returns​
Promise<null | string>
#### Defined in​
server/storage.ts:49
### getMetadata​
▸ getMetadata(storageId): Promise<null | FileMetadata>
Get metadata for a file.
#### Parameters​
#### Returns​
Promise<null | FileMetadata>
#### Defined in​
server/storage.ts:56



Page URL: https://docs.convex.dev/api/interfaces/server.StorageWriter

# Interface: StorageWriter
server.StorageWriter
An interface to write files to storage within Convex mutation functions.
## Hierarchy​
StorageReader
↳ StorageWriter
↳↳ StorageActionWriter
## Methods​
### getUrl​
▸ getUrl(storageId): Promise<null | string>
Get the URL for a file in storage by its StorageId.
The GET response includes a standard HTTP Digest header with a sha256 checksum.
#### Parameters​
#### Returns​
Promise<null | string>
#### Inherited from​
StorageReader.getUrl
#### Defined in​
server/storage.ts:49
### getMetadata​
▸ getMetadata(storageId): Promise<null | FileMetadata>
Get metadata for a file.
#### Parameters​
#### Returns​
Promise<null | FileMetadata>
#### Inherited from​
StorageReader.getMetadata
#### Defined in​
server/storage.ts:56
### generateUploadUrl​
▸ generateUploadUrl(): Promise<string>
Fetch a short-lived URL for uploading a file into storage.
Upon a POST request to this URL, the endpoint will return a JSON object containing a newly allocated StorageId.
The POST URL accepts an optional standard HTTP Digest header with a sha256 checksum.
#### Returns​
Promise<string>
#### Defined in​
server/storage.ts:74
### delete​
▸ delete(storageId): Promise<void>
Delete a file from Convex storage.
Once a file is deleted, any URLs previously generated by getUrl will return 404s.
#### Parameters​
#### Returns​
Promise<void>
#### Defined in​
server/storage.ts:82



Page URL: https://docs.convex.dev/api/interfaces/server.UserIdentity

# Interface: UserIdentity
server.UserIdentity
Information about an authenticated user.
The only fields guaranteed to be present are
tokenIdentifier and issuer. All
remaining fields may or may not be present depending on the information given
by the identity provider.
See the OpenID Connect specification
for more information on these fields.
## Properties​
### tokenIdentifier​
• Readonly tokenIdentifier: string
A stable and globally unique string for this identity (i.e. no other
user, even from a different identity provider, will have the same string.)
#### Defined in​
server/authentication.ts:19
### subject​
• Readonly subject: string
Identifier for the end-user from the identity provider, not necessarily
unique across different providers.
#### Defined in​
server/authentication.ts:25
### issuer​
• Readonly issuer: string
The hostname of the identity provider used to authenticate this user.
#### Defined in​
server/authentication.ts:30
### name​
• Optional Readonly name: string
#### Defined in​
server/authentication.ts:31
### givenName​
• Optional Readonly givenName: string
#### Defined in​
server/authentication.ts:32
### familyName​
• Optional Readonly familyName: string
#### Defined in​
server/authentication.ts:33
### nickname​
• Optional Readonly nickname: string
#### Defined in​
server/authentication.ts:34
### preferredUsername​
• Optional Readonly preferredUsername: string
#### Defined in​
server/authentication.ts:35
### profileUrl​
• Optional Readonly profileUrl: string
#### Defined in​
server/authentication.ts:36
### pictureUrl​
• Optional Readonly pictureUrl: string
#### Defined in​
server/authentication.ts:37
### email​
• Optional Readonly email: string
#### Defined in​
server/authentication.ts:38
### emailVerified​
• Optional Readonly emailVerified: boolean
#### Defined in​
server/authentication.ts:39
### gender​
• Optional Readonly gender: string
#### Defined in​
server/authentication.ts:40
### birthday​
• Optional Readonly birthday: string
#### Defined in​
server/authentication.ts:41
### timezone​
• Optional Readonly timezone: string
#### Defined in​
server/authentication.ts:42
### language​
• Optional Readonly language: string
#### Defined in​
server/authentication.ts:43
### phoneNumber​
• Optional Readonly phoneNumber: string
#### Defined in​
server/authentication.ts:44
### phoneNumberVerified​
• Optional Readonly phoneNumberVerified: boolean
#### Defined in​
server/authentication.ts:45
### address​
• Optional Readonly address: string
#### Defined in​
server/authentication.ts:46
### updatedAt​
• Optional Readonly updatedAt: string
#### Defined in​
server/authentication.ts:47



Page URL: https://docs.convex.dev/api/interfaces/server.ValidatedFunction

# Interface: ValidatedFunction<Ctx, ArgsValidator, Output>
server.ValidatedFunction
The definition of a Convex query, mutation, or action function with argument
validation.
Argument validation allows you to assert that the arguments to this function
are the expected type.
Example:
```sh
import { query } from "./_generated/server";
import { v } from "convex/values";

export const func = query({
  args: {
    arg: v.string()
  },
  handler: ({ db }, { arg }) => {...},
});
```
For security, argument validation should be added to all public functions in
production apps.
See UnvalidatedFunction for functions without argument validation.
## Type parameters​
## Properties​
### args​
• args: ArgsValidator
A validator for the arguments of this function.
This is an object mapping argument names to validators constructed with
v.
```sh
import { v } from "convex/values";

const args = {
  stringArg: v.string(),
  optionalNumberArg: v.optional(v.number()),
}
```
#### Defined in​
server/registration.ts:404
### handler​
• handler: (ctx: Ctx, args: ObjectType<ArgsValidator>) => Output
#### Type declaration​
▸ (ctx, args): Output
The implementation of this function.
This is a function that takes in the appropriate context and arguments
and produces some result.
##### Parameters​
##### Returns​
Output
#### Defined in​
server/registration.ts:418



Page URL: https://docs.convex.dev/api/modules/react

# Module: react
Tools to integrate Convex into React applications.
This module contains:
## Usage​
### Creating the client​
```sh
import { ConvexReactClient } from "convex/react";

// typically loaded from an environment variable
const address = "https://small-mouse-123.convex.cloud"
const convex = new ConvexReactClient(address);
```
### Storing the client in React Context​
```sh
import { ConvexProvider } from "convex/react";

<ConvexProvider client={convex}>
  <App />
</ConvexProvider>
```
### Using the auth helpers​
```sh
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

<Authenticated>
  Logged in
</Authenticated>
<Unauthenticated>
  Logged out
</Unauthenticated>
<AuthLoading>
  Still loading
</AuthLoading>
```
### Using React hooks​
```sh
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const counter = useQuery(api.getCounter.default);
  const increment = useMutation(api.incrementCounter.default);
  // Your component here!
}
```
## Classes​
## Interfaces​
## Type Aliases​
### AuthTokenFetcher​
Ƭ AuthTokenFetcher: (args: { forceRefreshToken: boolean  }) => Promise<string | null | undefined>
#### Type declaration​
▸ (args): Promise<string | null | undefined>
An async function returning the JWT-encoded OpenID Connect Identity Token
if available.
forceRefreshToken is true if the server rejected a previously
returned token, and the client should try to fetch a new one.
See setAuth.
##### Parameters​
##### Returns​
Promise<string | null | undefined>
#### Defined in​
browser/sync/authentication_manager.ts:16
### ConvexAuthState​
Ƭ ConvexAuthState: Object
Type representing the state of an auth integration with Convex.
#### Type declaration​
#### Defined in​
react/ConvexAuthState.tsx:26
### PaginatedQueryReference​
Ƭ PaginatedQueryReference: FunctionReference<"query", "public", { paginationOpts: PaginationOptions  }, PaginationResult<any>>
A FunctionReference that is usable with usePaginatedQuery.
This function reference must:
#### Defined in​
react/use_paginated_query.ts:29
### UsePaginatedQueryResult​
Ƭ UsePaginatedQueryResult<Item>: { results: Item[] ; loadMore: (numItems: number) => void  } & { status: "LoadingFirstPage" ; isLoading: true  } | { status: "CanLoadMore" ; isLoading: false  } | { status: "LoadingMore" ; isLoading: true  } | { status: "Exhausted" ; isLoading: false  }
The result of calling the usePaginatedQueryGeneric hook.
This includes:
#### Type parameters​
#### Defined in​
react/use_paginated_query.ts:312
### PaginationStatus​
Ƭ PaginationStatus: UsePaginatedQueryResult<any>["status"]
The possible pagination statuses in UsePaginatedQueryResult.
This is a union of string literal types.
#### Defined in​
react/use_paginated_query.ts:340
### PaginatedQueryArgs​
Ƭ PaginatedQueryArgs<Query>: Expand<BetterOmit<FunctionArgs<Query>, "paginationOpts">>
Given a PaginatedQueryReference, get the type of the arguments
object for the query, excluding the paginationOpts argument.
#### Type parameters​
#### Defined in​
react/use_paginated_query.ts:348
### PaginatedQueryItem​
Ƭ PaginatedQueryItem<Query>: FunctionReturnType<Query>["page"][number]
Given a PaginatedQueryReference, get the type of the item being
paginated over.
#### Type parameters​
#### Defined in​
react/use_paginated_query.ts:357
### UsePaginatedQueryReturnType​
Ƭ UsePaginatedQueryReturnType<Query>: UsePaginatedQueryResult<PaginatedQueryItem<Query>>
The return type of usePaginatedQuery.
#### Type parameters​
#### Defined in​
react/use_paginated_query.ts:365
### RequestForQueries​
Ƭ RequestForQueries: Record<string, { query: FunctionReference<"query"> ; args: Record<string, Value>  }>
An object representing a request to load multiple queries.
The keys of this object are identifiers and the values are objects containing
the query function and the arguments to pass to it.
This is used as an argument to useQueriesGeneric.
#### Defined in​
react/use_queries.ts:156
## Functions​
### useConvexAuth​
▸ useConvexAuth(): Object
Get the ConvexAuthState within a React component.
This relies on a Convex auth integration provider being above in the React
component tree.
#### Returns​
Object
The current ConvexAuthState.
#### Defined in​
react/ConvexAuthState.tsx:43
### ConvexProviderWithAuth​
▸ ConvexProviderWithAuth(«destructured»): Element
A replacement for ConvexProvider which additionally provides
ConvexAuthState to descendants of this component.
Use this to integrate any auth provider with Convex. The useAuth prop
should be a React hook that returns the provider's authentication state
and a function to fetch a JWT access token.
See Custom Auth Integration for more information.
#### Parameters​
#### Returns​
Element
#### Defined in​
react/ConvexAuthState.tsx:72
### Authenticated​
▸ Authenticated(«destructured»): null | Element
Renders children if the client is authenticated.
#### Parameters​
#### Returns​
null | Element
#### Defined in​
react/auth_helpers.tsx:10
### Unauthenticated​
▸ Unauthenticated(«destructured»): null | Element
Renders children if the client is using authentication but is not authenticated.
#### Parameters​
#### Returns​
null | Element
#### Defined in​
react/auth_helpers.tsx:23
### AuthLoading​
▸ AuthLoading(«destructured»): null | Element
Renders children if the client isn't using authentication or is in the process
of authenticating.
#### Parameters​
#### Returns​
null | Element
#### Defined in​
react/auth_helpers.tsx:37
### useConvex​
▸ useConvex(): ConvexReactClient
Get the ConvexReactClient within a React component.
This relies on the ConvexProvider being above in the React component tree.
#### Returns​
ConvexReactClient
The active ConvexReactClient object, or undefined.
#### Defined in​
react/client.ts:511
### ConvexProvider​
▸ ConvexProvider(props, context?): null | ReactElement<any, any>
Provides an active Convex ConvexReactClient to descendants of this component.
Wrap your app in this component to use Convex hooks useQuery,
useMutation, and useConvex.
#### Parameters​
#### Returns​
null | ReactElement<any, any>
#### Defined in​
../../common/temp/node_modules/.pnpm/@types+react@18.2.15/node_modules/@types/react/ts5.0/index.d.ts:525
### useQuery​
▸ useQuery<Query>(query, ...args): Query["_returnType"] | undefined
Load a reactive query within a React component.
This React hook contains internal state that will cause a rerender
whenever the query result changes.
Throws an error if not used under ConvexProvider.
#### Type parameters​
#### Parameters​
#### Returns​
Query["_returnType"] | undefined
the result of the query. If the query is loading returns undefined.
#### Defined in​
react/client.ts:560
### useMutation​
▸ useMutation<Mutation>(mutation): ReactMutation<Mutation>
Construct a new ReactMutation.
Mutation objects can be called like functions to request execution of the
corresponding Convex function, or further configured with
optimistic updates.
The value returned by this hook is stable across renders, so it can be used
by React dependency arrays and memoization logic relying on object identity
without causing rerenders.
Throws an error if not used under ConvexProvider.
#### Type parameters​
#### Parameters​
#### Returns​
ReactMutation<Mutation>
The ReactMutation object with that name.
#### Defined in​
react/client.ts:606
### useAction​
▸ useAction<Action>(action): ReactAction<Action>
Construct a new ReactAction.
Action objects can be called like functions to request execution of the
corresponding Convex function.
The value returned by this hook is stable across renders, so it can be used
by React dependency arrays and memoization logic relying on object identity
without causing rerenders.
Throws an error if not used under ConvexProvider.
#### Type parameters​
#### Parameters​
#### Returns​
ReactAction<Action>
The ReactAction object with that name.
#### Defined in​
react/client.ts:647
### usePaginatedQuery​
▸ usePaginatedQuery<Query>(query, args, options): UsePaginatedQueryReturnType<Query>
Load data reactively from a paginated query to a create a growing list.
This can be used to power "infinite scroll" UIs.
This hook must be used with public query references that match
PaginatedQueryReference.
usePaginatedQuery concatenates all the pages of results into a single list
and manages the continuation cursors when requesting more items.
Example usage:
```sh
const { results, status, isLoading, loadMore } = usePaginatedQuery(
  api.messages.list,
  { channel: "#general" },
  { initialNumItems: 5 }
);
```
If the query reference or arguments change, the pagination state will be reset
to the first page. Similarly, if any of the pages result in an InvalidCursor
error or an error associated with too much data, the pagination state will also
reset to the first page.
To learn more about pagination, see Paginated Queries.
#### Type parameters​
#### Parameters​
#### Returns​
UsePaginatedQueryReturnType<Query>
A UsePaginatedQueryResult that includes the currently loaded
items, the status of the pagination, and a loadMore function.
#### Defined in​
react/use_paginated_query.ts:73
### optimisticallyUpdateValueInPaginatedQuery​
▸ optimisticallyUpdateValueInPaginatedQuery<Query>(localStore, query, args, updateValue): void
Optimistically update the values in a paginated list.
This optimistic update is designed to be used to update data loaded with
usePaginatedQueryGeneric. It updates the list by applying
updateValue to each element of the list across all of the loaded pages.
This will only apply to queries with a matching names and arguments.
Example usage:
```sh
const myMutation = useMutation(api.myModule.myMutation)
.withOptimisticUpdate((localStore, mutationArg) => {

  // Optimistically update the document with ID `mutationArg`
  // to have an additional property.

  optimisticallyUpdateValueInPaginatedQuery(
    localStore,
    api.myModule.paginatedQuery
    {},
    currentValue => {
      if (mutationArg === currentValue._id) {
        return {
          ...currentValue,
          "newProperty": "newValue",
        };
      }
      return currentValue;
    }
  );

});
```
#### Type parameters​
#### Parameters​
#### Returns​
void
#### Defined in​
react/use_paginated_query.ts:411
### useQueries​
▸ useQueries(queries): Record<string, any | undefined | Error>
Load a variable number of reactive Convex queries.
useQueriesGeneric is similar to useQueryGeneric but it allows
loading multiple queries which can be useful for loading a dynamic number
of queries without violating the rules of React hooks.
This hook accepts an object whose keys are identifiers for each query and the
values are objects of { query: FunctionReference, args: Record<string, Value> }. The
query is a FunctionReference for the Convex query function to load, and the args are
the arguments to that function.
The hook returns an object that maps each identifier to the result of the query,
undefined if the query is still loading, or an instance of Error if the query
threw an exception.
For example if you loaded a query like:
```sh
const results = useQueriesGeneric({
  messagesInGeneral: {
    query: "listMessages",
    args: { channel: "#general" }
  }
});
```
then the result would look like:
```sh
{
  messagesInGeneral: [{
    channel: "#general",
    body: "hello"
    _id: ...,
    _creationTime: ...
  }]
}
```
This React hook contains internal state that will cause a rerender
whenever any of the query results change.
Throws an error if not used under ConvexProvider.
#### Parameters​
#### Returns​
Record<string, any | undefined | Error>
An object with the same keys as the input. The values are the result
of the query function, undefined if it's still loading, or an Error if
it threw an exception.
#### Defined in​
react/use_queries.ts:60



Page URL: https://docs.convex.dev/api/classes/react.ConvexReactClient

# Class: ConvexReactClient
react.ConvexReactClient
A Convex client for use within React.
This loads reactive queries and executes mutations over a WebSocket.
## Constructors​
### constructor​
• new ConvexReactClient(address, options?)
#### Parameters​
#### Defined in​
react/client.ts:226
## Methods​
### setAuth​
▸ setAuth(fetchToken, onChange?): void
Set the authentication token to be used for subsequent queries and mutations.
fetchToken will be called automatically again if a token expires.
fetchToken should return null if the token cannot be retrieved, for example
when the user's rights were permanently revoked.
#### Parameters​
#### Returns​
void
#### Defined in​
react/client.ts:274
### clearAuth​
▸ clearAuth(): void
Clear the current authentication token if set.
#### Returns​
void
#### Defined in​
react/client.ts:296
### watchQuery​
▸ watchQuery<Query>(query, ...argsAndOptions): Watch<FunctionReturnType<Query>>
Construct a new Watch on a Convex query function.
Most application code should not call this method directly. Instead use
the useQuery hook.
#### Type parameters​
#### Parameters​
#### Returns​
Watch<FunctionReturnType<Query>>
The Watch object.
#### Defined in​
react/client.ts:327
### mutation​
▸ mutation<Mutation>(mutation, ...argsAndOptions): Promise<FunctionReturnType<Mutation>>
Execute a mutation function.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Mutation>>
A promise of the mutation's result.
#### Defined in​
react/client.ts:397
### action​
▸ action<Action>(action, ...args): Promise<FunctionReturnType<Action>>
Execute an action function.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Action>>
A promise of the action's result.
#### Defined in​
react/client.ts:418
### query​
▸ query<Query>(query, ...args): Promise<FunctionReturnType<Query>>
Fetch a query result once.
Most application code should subscribe to queries instead, using
the useQuery hook.
#### Type parameters​
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Query>>
A promise of the query's result.
#### Defined in​
react/client.ts:438
### connectionState​
▸ connectionState(): ConnectionState
Get the current ConnectionState between the client and the Convex
backend.
#### Returns​
ConnectionState
The ConnectionState with the Convex backend.
#### Defined in​
react/client.ts:461
### close​
▸ close(): Promise<void>
Close any network handles associated with this client and stop all subscriptions.
Call this method when you're done with a ConvexReactClient to
dispose of its sockets and resources.
#### Returns​
Promise<void>
A Promise fulfilled when the connection has been completely closed.
#### Defined in​
react/client.ts:473



Page URL: https://docs.convex.dev/api/interfaces/react.MutationOptions

# Interface: MutationOptions<Args>
react.MutationOptions
Options for mutation.
## Type parameters​
## Properties​
### optimisticUpdate​
• Optional optimisticUpdate: OptimisticUpdate<Args>
An optimistic update to apply along with this mutation.
An optimistic update locally updates queries while a mutation is pending.
Once the mutation completes, the update will be rolled back.
#### Defined in​
react/client.ts:201



Page URL: https://docs.convex.dev/api/interfaces/react.ReactAction

# Interface: ReactAction<Action>
react.ReactAction
## Type parameters​
## Callable​
### ReactAction​
▸ ReactAction(...args): Promise<FunctionReturnType<Action>>
Execute the function on the server, returning a Promise of its return value.
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Action>>
The return value of the server-side function call.
#### Defined in​
react/client.ts:115



Page URL: https://docs.convex.dev/api/interfaces/react.ReactMutation

# Interface: ReactMutation<Mutation>
react.ReactMutation
## Type parameters​
## Callable​
### ReactMutation​
▸ ReactMutation(...args): Promise<FunctionReturnType<Mutation>>
Execute the mutation on the server, returning a Promise of its return value.
#### Parameters​
#### Returns​
Promise<FunctionReturnType<Mutation>>
The return value of the server-side function call.
#### Defined in​
react/client.ts:46
## Methods​
### withOptimisticUpdate​
▸ withOptimisticUpdate(optimisticUpdate): ReactMutation<Mutation>
Define an optimistic update to apply as part of this mutation.
This is a temporary update to the local query results to facilitate a
fast, interactive UI. It enables query results to update before a mutation
executed on the server.
When the mutation is invoked, the optimistic update will be applied.
Optimistic updates can also be used to temporarily remove queries from the
client and create loading experiences until a mutation completes and the
new query results are synced.
The update will be automatically rolled back when the mutation is fully
completed and queries have been updated.
#### Parameters​
#### Returns​
ReactMutation<Mutation>
A new ReactMutation with the update configured.
#### Defined in​
react/client.ts:69



Page URL: https://docs.convex.dev/api/interfaces/react.UseQueryOptions

# Interface: UseQueryOptions
react.UseQueryOptions
Options object for useQuery.



Page URL: https://docs.convex.dev/api/interfaces/react.Watch

# Interface: Watch<T>
react.Watch
A watch on the output of a Convex query function.
## Type parameters​
## Methods​
### onUpdate​
▸ onUpdate(callback): () => void
Initiate a watch on the output of a query.
This will subscribe to this query and call
the callback whenever the query result changes.
Important: If the query is already known on the client this watch will
never be invoked. To get the current, local result call
localQueryResult.
#### Parameters​
#### Returns​
fn
▸ (): void
Initiate a watch on the output of a query.
This will subscribe to this query and call
the callback whenever the query result changes.
Important: If the query is already known on the client this watch will
never be invoked. To get the current, local result call
localQueryResult.
##### Returns​
void
#### Defined in​
react/client.ts:146
### localQueryResult​
▸ localQueryResult(): undefined | T
Get the current result of a query.
This will only return a result if we're already subscribed to the query
and have received a result from the server or the query value has been set
optimistically.
Throws
An error if the query encountered an error on the server.
#### Returns​
undefined | T
The result of the query or undefined if it isn't known.
#### Defined in​
react/client.ts:158
### journal​
▸ journal(): undefined | QueryJournal
Get the current QueryJournal for this query.
If we have not yet received a result for this query, this will be undefined.
#### Returns​
undefined | QueryJournal
#### Defined in​
react/client.ts:170



Page URL: https://docs.convex.dev/api/interfaces/react.WatchQueryOptions

# Interface: WatchQueryOptions
react.WatchQueryOptions
Options for watchQuery.
## Properties​
### journal​
• Optional journal: QueryJournal
An (optional) journal produced from a previous execution of this query
function.
If there is an existing subscription to a query function with the same
name and arguments, this journal will have no effect.
#### Defined in​
react/client.ts:186



Page URL: https://docs.convex.dev/api/modules/react_auth0

# Module: react-auth0
React login component for use with Auth0.
## Functions​
### ConvexProviderWithAuth0​
▸ ConvexProviderWithAuth0(«destructured»): Element
A wrapper React component which provides a ConvexReactClient
authenticated with Auth0.
It must be wrapped by a configured Auth0Provider from @auth0/auth0-react.
See Convex Auth0 on how to set up
Convex with Auth0.
#### Parameters​
#### Returns​
Element
#### Defined in​
react-auth0/ConvexProviderWithAuth0.tsx:26



Page URL: https://docs.convex.dev/api/modules/react_clerk

# Module: react-clerk
React login component for use with Clerk.
## Functions​
### ConvexProviderWithClerk​
▸ ConvexProviderWithClerk(«destructured»): Element
A wrapper React component which provides a ConvexReactClient
authenticated with Clerk.
It must be wrapped by a configured ClerkProvider, from
@clerk/clerk-react, @clerk/clerk-expo, @clerk/clerk-next or
another React-based Clerk client library and have the corresponding
useAuth hook passed in.
See Convex Clerk on how to set up
Convex with Clerk.
#### Parameters​
#### Returns​
Element
#### Defined in​
react-clerk/ConvexProviderWithClerk.tsx:38



Page URL: https://docs.convex.dev/api/modules/values

# Module: values
Utilities for working with values stored in Convex.
You can see the full set of supported types at
Types.
## Namespaces​
## Classes​
## Type Aliases​
### PropertyValidators​
Ƭ PropertyValidators: Record<string, Validator<any, any, any>>
Validators for each property of an object.
This is represented as an object mapping the property name to its
Validator.
#### Defined in​
values/validator.ts:177
### ObjectType​
Ƭ ObjectType<Validators>: Expand<{ [Property in OptionalKeys<Validators>]?: Validators[Property]["type"] } & { [Property in RequiredKeys<Validators>]: Validators[Property]["type"] }>
Compute the type of an object from PropertyValidators.
#### Type parameters​
#### Defined in​
values/validator.ts:184
### Infer​
Ƭ Infer<V>: V["type"]
Extract a TypeScript type from a validator.
Example usage:
```sh
const objectSchema = v.object({
  property: v.string(),
});
type MyObject = Infer<typeof objectSchema>; // { property: string }
```
#### Type parameters​
#### Defined in​
values/validator.ts:251
### JSONValue​
Ƭ JSONValue: null | boolean | number | string | JSONValue[] | { [key: string]: JSONValue;  }
The type of JavaScript values serializable to JSON.
#### Defined in​
values/value.ts:24
### GenericId​
Ƭ GenericId<TableName>: string & { __tableName: TableName  }
An identifier for a document in Convex.
Convex documents are uniquely identified by their Id, which is accessible
on the _id field. To learn more, see Document IDs.
Documents can be loaded using db.get(id) in query and mutation functions.
IDs are base 32 encoded strings which are URL safe.
IDs are just strings at runtime, but this type can be used to distinguish them from other
strings at compile time.
If you're using code generation, use the Id type generated for your data model in
convex/_generated/dataModel.d.ts.
#### Type parameters​
#### Defined in​
values/value.ts:52
### Value​
Ƭ Value: null | bigint | number | boolean | string | ArrayBuffer | Value[] | { [key: string]: undefined | Value;  }
A value supported by Convex.
Values can be:
You can see the full set of supported types at
Types.
#### Defined in​
values/value.ts:66
### NumericValue​
Ƭ NumericValue: bigint | number
The types of Value that can be used to represent numbers.
#### Defined in​
values/value.ts:81
## Variables​
### v​
• Const v: Object
The validator builder.
This builder allows you to build validators for Convex values.
Validators can be used in schema definitions
and as input validators for Convex functions.
#### Type declaration​
#### Defined in​
values/validator.ts:79
## Functions​
### jsonToConvex​
▸ jsonToConvex(value): Value
Parse a Convex value from its JSON representation.
This function will revive classes like GenericId that have been serialized to JSON, parse out BigInts, and so on.
To learn more about Convex values, see Types.
#### Parameters​
#### Returns​
Value
The JavaScript representation of the Convex value.
#### Defined in​
values/value.ts:286
### convexToJson​
▸ convexToJson(value): JSONValue
Convert a Convex value to its JSON representation.
Use jsonToConvex to recreate the original value.
To learn more about Convex values, see Types.
#### Parameters​
#### Returns​
JSONValue
The JSON representation of value.
#### Defined in​
values/value.ts:511



Page URL: https://docs.convex.dev/api/classes/values.Validator

# Class: Validator<TypeScriptType, IsOptional, FieldPaths>
values.Validator
A validator for a Convex value.
This should be constructed using the validator builder, v.
This class encapsulates:
## Type parameters​
## Properties​
### type​
• Readonly type: TypeScriptType
#### Defined in​
values/validator.ts:22
### isOptional​
• Readonly isOptional: IsOptional
#### Defined in​
values/validator.ts:23
### fieldPaths​
• Readonly fieldPaths: FieldPaths
#### Defined in​
values/validator.ts:24
### _isValidator​
• Readonly _isValidator: undefined
#### Defined in​
values/validator.ts:27
### optional​
• Readonly optional: boolean
#### Defined in​
values/validator.ts:29



Page URL: https://docs.convex.dev/api/namespaces/values.Base64

# Namespace: Base64
values.Base64
## Functions​
### byteLength​
▸ byteLength(b64): number
#### Parameters​
#### Returns​
number
#### Defined in​
values/base64.ts:46
### toByteArray​
▸ toByteArray(b64): Uint8Array
#### Parameters​
#### Returns​
Uint8Array
#### Defined in​
values/base64.ts:58
### fromByteArray​
▸ fromByteArray(uint8): string
#### Parameters​
#### Returns​
string
#### Defined in​
values/base64.ts:125



Page URL: https://docs.convex.dev/generated-api/

# Generated Code
Convex uses code generation to create code that is specific to your app's data
model and API. Convex generates JavaScript files (.js) with TypeScript type
definitions (.d.ts).
Code generation isn't required to use Convex, but using the generated code will
give you more better autocompletion in your editor and more type safety if
you're using TypeScript.
To generate the code, run:
```sh
npx convex dev
```
This creates a convex/_generated directory that contains:



Page URL: https://docs.convex.dev/generated-api/data-model

# dataModel.d.ts
These exports are not directly available in the convex package!
Instead you must run npx convex dev to create
convex/_generated/dataModel.d.ts.
Generated data model types.
## Types​
### TableNames​
Ƭ TableNames: string
The names of all of your Convex tables.
### Doc​
Ƭ Doc<TableName>: Object
The type of a document stored in Convex.
#### Type parameters​
### Id​
An identifier for a document in Convex.
Convex documents are uniquely identified by their Id, which is accessible on
the _id field. To learn more, see
Document IDs.
Documents can be loaded using db.get(id) in query and mutation functions.
IDs are just strings at runtime, but this type can be used to distinguish them
from other strings when type checking.
This is an alias of GenericId that is typed
for your data model.
#### Type parameters​
### DataModel​
Ƭ DataModel: Object
A type describing your Convex data model.
This type includes information about what tables you have, the type of documents
stored in those tables, and the indexes defined on them.
This type is used to parameterize methods like
queryGeneric and
mutationGeneric to make them type-safe.



Page URL: https://docs.convex.dev/generated-api/api

# api.js
These exports are not directly available in the convex package!
Instead you need to run npx convex dev to create convex/_generated/api.js
and convex/_generated/api.d.ts.
These types require running code generation because they are specific to the
Convex functions you define for your app.
If you aren't using code generation, you can use
makeFunctionReference instead.
### api​
An object of type API describing your app's public Convex API.
Its API type includes information about the arguments and return types of your
app's Convex functions.
The api object is used by client-side React hooks and Convex functions that run
or schedule other functions.
```sh
import { api } from "../convex/_generated/api";
import { useQuery } from "convex/react";

const data = useQuery(api.messages.list);
```
### internal​
Another object of type API describing your app's internal Convex API.
```sh
import { action } from "../_generated/server";
import { internal } from "../_generated/api";

export default action(async ({ runMutation }, { planId, ... }) => {
  // Call out to payment provider (e.g. Stripe) to charge customer
  const response = await fetch(...);
  if (response.ok) {
    // Mark the plan as "professional" in the Convex DB
    await runMutation(internal.plans.markPlanAsProfessional, { planId });
  }
});
```



Page URL: https://docs.convex.dev/generated-api/server

# server.js
These exports are not directly available in the convex package!
Instead you must run npx convex dev to create convex/_generated/server.js
and convex/_generated/server.d.ts.
Generated utilities for implementing server-side Convex query and mutation
functions.
## Functions​
### query​
▸ query(func): RegisteredQuery
Define a query in this Convex app's public API.
This function will be allowed to read your Convex database and will be
accessible from the client.
This is an alias of queryGeneric that is
typed for your app's data model.
#### Parameters​
#### Returns​
RegisteredQuery
The wrapped query. Include this as an export to name it and make it
accessible.
### internalQuery​
▸ internalQuery(func):
RegisteredQuery
Define a query that is only accessible from other Convex functions (but not from
the client).
This function will be allowed to read from your Convex database. It will not be
accessible from the client.
This is an alias of
internalQueryGeneric that is typed
for your app's data model.
#### Parameters​
#### Returns​
RegisteredQuery
The wrapped query. Include this as an export to name it and make it
accessible.
### mutation​
▸ mutation(func):
RegisteredMutation
Define a mutation in this Convex app's public API.
This function will be allowed to modify your Convex database and will be
accessible from the client.
This is an alias of mutationGeneric
that is typed for your app's data model.
#### Parameters​
#### Returns​
RegisteredMutation
The wrapped mutation. Include this as an export to name it and make it
accessible.
### internalMutation​
▸ internalMutation(func):
RegisteredMutation
Define a mutation that is only accessible from other Convex functions (but not
from the client).
This function will be allowed to read and write from your Convex database. It
will not be accessible from the client.
This is an alias of
internalMutationGeneric that is
typed for your app's data model.
#### Parameters​
#### Returns​
RegisteredMutation
The wrapped mutation. Include this as an export to name it and make it
accessible.
### action​
▸ action(func): RegisteredAction
Define an action in this Convex app's public API.
An action is a function which can execute any JavaScript code, including
non-deterministic code and code with side-effects, like calling third-party
services. They can be run in Convex's JavaScript environment or in Node.js using
the "use node" directive. They can interact with the database indirectly by
calling queries and mutations using the ActionCtx.
This is an alias of actionGeneric that is
typed for your app's data model.
#### Parameters​
#### Returns​
RegisteredAction
The wrapped function. Include this as an export to name it and make it
accessible.
### internalAction​
▸ internalAction(func):
RegisteredAction
Define an action that is only accessible from other Convex functions (but not
from the client).
This is an alias of
internalActionGeneric that is
typed for your app's data model.
#### Parameters​
#### Returns​
RegisteredAction
The wrapped action. Include this as an export to name it and make it
accessible.
### httpAction​
▸
httpAction(func: (ctx: ActionCtx, request: Request) => Promise<Response>):
PublicHttpAction
#### Parameters​
#### Returns​
PublicHttpAction
The wrapped function. Import this function from convex/http.js and route it to
hook it up.
## Types​
### QueryCtx​
Ƭ QueryCtx: Object
A set of services for use within Convex query functions.
The query context is passed as the first argument to any Convex query function
run on the server.
This differs from the MutationCtx because all of the services
are read-only.
This is an alias of QueryCtx that is typed
for your app's data model.
#### Type declaration​
### MutationCtx​
Ƭ MutationCtx: Object
A set of services for use within Convex mutation functions.
The mutation context is passed as the first argument to any Convex mutation
function run on the server.
This is an alias of MutationCtx that is
typed for your app's data model.
#### Type declaration​
### ActionCtx​
Ƭ ActionCtx: Object
A set of services for use within Convex action functions.
The action context is passed as the first argument to any Convex action function
run on the server.
This is an alias of ActionCtx that is typed
for your app's data model.
#### Type declaration​
### DatabaseReader​
An interface to read from the database within Convex query functions.
This is an alias of DatabaseReader
that is typed for your app's data model.
### DatabaseWriter​
An interface to read from and write to the database within Convex mutation
functions.
This is an alias of DatabaseWriter
that is typed for your app's data model.



Page URL: https://docs.convex.dev/http-api/

# Sync APIs
Convex supports both streaming export and streaming import via Airbyte.
## Authorization​
Streaming export and streaming import requests require the HTTP header
Authorization. The value is Convex <access_key> where the access key comes
from "Deploy key" on the Convex dashboard and gives full read and write access
to your Convex data.
## Streaming Export​
Sign up for a Professional plan for streaming
export support. Read more about using streaming export with Airbyte
here.
### Format​
Each of the streaming export APIs take a format query param that describes how
documents are formatted. Currently the only supported value is convex_json,
which encodes documents with enough information to determine the original type.
For example, floats (JavaScript number) are represented as JSON numbers, so
integers are represented as {"$int": "<base64 integer>"}. Similarly, arrays
are represented as JSON arrays, so sets (JavaScript Set) are represented as
{"$set": [<values>]}.
### GET /api/json_schemas​
The JSON Schemas endpoint lists tables, and for each table describes how
documents will be encoded, given as JSON Schema.
This endpoint returns $description tags throughout the schema to describe
unintuitive encodings and give extra information like the table referenced by
Id fields.
An additional query param deltaSchema=true shows extra fields returned by
/api/document_deltas and /api/list_snapshot for each document. These fields
are metadata about what has changed about the document: the document table’s
name (_table), the timestamp of the change (_ts) and whether the document
was deleted (_deleted).
### GET /api/list_snapshot​
The list_snapshot endpoint walks a consistent snapshot of documents.
The tableName query param filters to a table. If omitted, list_snapshot
returns documents from all tables.
Expected API usage:
### GET /api/document_deltas​
The document_deltas endpoint walks the change log of documents to find new,
updated, and deleted documents in the order of their mutations. This order is
given by a _ts field on the returned documents. Deletions are represented as
JSON objects with fields _id, _ts, and _deleted: true.
Expected API usage:
## Streaming Import​
Streaming import support is automatically enabled for all Convex projects.
### Headers​
Streaming import endpoints accept a Convex-Client: streaming-import-<version>
header, where the version follows Semver guidelines. If
this header is not specified, Convex will default to the latest version. We
recommend using the header to ensure the consumer of this API does not break as
the API changes.
### GET /api/streaming_import/primary_key_indexes_ready​
The primary_key_indexes_ready endpoint takes a list of table names and returns
true if the primary key indexes (created by add_primary_key_indexes) on all
those tables are ready. If the tables are newly created, the indexes should be
ready immediately; however if there are existing documents in the tables, it may
take some time to backfill the primary key indexes. The response looks like:
```sh
{
  "indexesReady": true
}
```
### PUT /api/streaming_import/add_primary_key_indexes​
The add_primary_key_indexes endpoint takes a JSON body containing the primary
keys for tables and creates indexes on the primary keys to be backfilled. Note
that they are not immediately ready to query - the primary_key_indexes_ready
endpoint needs to be polled until it returns True before calling
import_airbyte_records with records that require primary key indexes. Also
note that Convex queries will not have access to these added indexes. These are
solely for use in import_airbyte_records. The body takes the form of a map of
index names to list of field paths to index. Each field path is represented by a
list of fields that can represent nested field paths.
```sh
{
  "indexes": {
    "<table_name>": [["<field1>"], ["<field2>", "<nested_field>"]]
  }
}
```
Expected API Usage:
### PUT api/streaming_import/clear_tables​
The clear_tables endpoint deletes all documents from the specified tables.
Note that this may require multiple transactions. If there is an intermediate
error only some documents may be deleted. The JSON body to use this API request
contains a list of table names:
```sh
{
  "tableNames": ["<table_1>", "<table_2>"]
}
```
### POST api/streaming_import/replace_tables​
This endpoint is no longer supported. Use api/streaming_import/clear_tables
instead.
The replace_tables endpoint renames tables with temporary names to their final
names, deleting any existing tables with the final names.
The JSON body to use this API request contains a list of table names:
```sh
{
  "tableNames": { "<table_1_temp>": "<table_1>", "<table_2_temp>": "<table_2>" }
}
```
### POST api/streaming_import/import_airbyte_records​
The import_airbyte_records endpoint enables streaming ingress into a Convex
deployment and is designed to be called from an Airbyte destination connector.
It takes a map of streams and a list of messages in the JSON body. Each stream
has a name and JSON schema that will correspond to a Convex table. Streams where
records should be deduplicated include a primary key as well, which is
represented as a list of lists of strings that are field paths. Records for
streams without a primary key are appended to tables; records for streams with a
primary key replace an existing record where the primary key value matches or
are appended if there is no match. If you are using primary keys, you must call
the add_primary_key_indexes endpoint first and wait for them to backfill by
polling primary_key_indexes_ready.
Each message contains a stream name and a JSON document that will be inserted
(or replaced, in the case of deduplicated sync) into the table with the
corresponding stream name. Table names are same as the stream names. Airbyte
records become Convex documents.
```sh
{
   "tables": {
      "<stream_name>": {
         "primaryKey": [["<field1>"], ["<field2>", "<nested_field>"]],
         "jsonSchema": // see https://json-schema.org/ for examples
      }
   },
   "messages": [{
      "tableName": "<table_name>",
      "data": {} // JSON object conforming to the `json_schema` for that stream
   }]
}
```
Similar to clear_tables, it is possible to execute a partial import using
import_airbyte_records if there is a failure after a transaction has
committed.
Expected API Usage:

