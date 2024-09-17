

Page URL: https://sdk.vercel.ai/docs/foundations/prompts

# Prompts

Prompts are instructions that you give a large language model (LLM) to tell it what to do.
It's like when you ask someone for directions; the clearer your question, the better the directions you'll get.

Many LLM providers offer complex interfaces for specifying prompts. They involve different roles and message types.
While these interfaces are powerful, they can be hard to use and understand.

In order to simplify prompting across compatible providers, the Vercel AI SDK offers two categories of prompts: text prompts and message prompts.

## Text Prompts

Text prompts are strings.
They are ideal for simple generation use cases,
e.g. repeatedly generating content for variants of the same prompt text.

You can set text prompts using the prompt property made available by AI SDK functions like generateText or streamUI.
You can structure the text in any way and inject variables, e.g. using a template literal.

```ts
const result = await generateText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

You can also use template literals to provide dynamic data to your prompt.

```ts
const result = await generateText({
  model: yourModel,
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```

## Message Prompts

A message prompt is an array of user, assistant, and tool messages.
They are great for chat interfaces and more complex, multi-modal prompts.

Each message has a role and a content property. The content can either be text (for user and assistant messages), or an array of relevant parts (data) for that message type.

```ts
const result = await streamUI({
  model: yourModel,
  messages: [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: 'Hello, how can I help?' },
    { role: 'user', content: 'Where can I buy the best Currywurst in Berlin?' },
  ],
});
```

Not all language models support all message and content types. For example,
some models might not be capable of handling multi-modal inputs or tool
messages. Learn more about the capabilities of select
models.

### Multi-modal messages

Multi-modal refers to interacting with a model across different data types
such as text, image, or audio data.

Instead of sending a text in the content property, you can send an array of parts that include text and other data types.
Currently image and text parts are supported.

For models that support multi-modal inputs, user messages can include images. An image can be one of the following:

It is possible to mix text and multiple images.

Not all models support all types of multi-modal inputs. Check the model's
capabilities before using this feature.

#### Example: Binary image (Buffer)

```ts
const result = await generateText({
  model,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png'),
        },
      ],
    },
  ],
});
```

#### Example: Base-64 encoded image (string)

```ts
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image: fs.readFileSync('./data/comic-cat.png').toString('base64'),
        },
      ],
    },
  ],
});
```

#### Example: Image URL (string)

```ts
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe the image in detail.' },
        {
          type: 'image',
          image:
            'https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true',
        },
      ],
    },
  ],
});
```

### Tool messages

Tools (also known as function calling) are programs
that you can provide an LLM to extend it's built-in functionality. This can be
anything from calling an external API to calling functions within your UI.
Learn more about Tools in the next section.

For models that support tool calls, assistant messages can contain tool call parts, and tool messages can contain tool result parts.
A single assistant message can call multiple tools, and a single tool message can contain multiple tool results.

```ts
const result = await generateText({
  model: yourModel,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: 'How many calories are in this block of cheese?',
        },
        { type: 'image', image: fs.readFileSync('./data/roquefort.jpg') },
      ],
    },
    {
      role: 'assistant',
      content: [
        {
          type: 'tool-call',
          toolCallId: '12345',
          toolName: 'get-nutrition-data',
          args: { cheese: 'Roquefort' },
        },
        // there could be more tool calls here (parallel calling)
      ],
    },
    {
      role: 'tool',
      content: [
        {
          type: 'tool-result',
          toolCallId: '12345', // needs to match the tool call id
          toolName: 'get-nutrition-data',
          result: {
            name: 'Cheese, roquefort',
            calories: 369,
            fat: 31,
            protein: 22,
          },
        },
        // there could be more tool results here (parallel calling)
      ],
    },
  ],
});
```

## System Messages

System messages are the initial set of instructions given to models that help guide and constrain the models' behaviors and responses.
You can set system prompts using the system property.
System messages work with both the prompt and the messages properties.

```ts
const result = await generateText({
  model: yourModel,
  system:
    `You help planning travel itineraries. ` +
    `Respond to the users' request with a list ` +
    `of the best stops to make in their destination.`,
  prompt:
    `I am planning a trip to ${destination} for ${lengthOfStay} days. ` +
    `Please suggest the best tourist activities for me to do.`,
});
```





Page URL: https://sdk.vercel.ai/docs/foundations/tools

# Tools

While large language models (LLMs) have incredible generation capabilities,
they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather).

Tools can be thought of as programs you give to a model which can be run as and when the model deems applicable.

## What is a tool?

A tool is an object that can be called by the model to perform a specific task.
You can use tools with functions across the AI SDK (like generateText or streamUI) by passing a tool(s) to the tools parameter.

There are three elements of a tool, a description, parameters, and an optional execute or generate function (dependent on the SDK function).

## Tool Calls

If the LLM decides to use a tool, it will generate a tool call.
Tools with an execute or generate function are run automatically when these calls are generated.
The results of the tool calls are returned using tool result objects.
Each tool result object has a toolCallId, a toolName, a typed args object, and a typed result.

## Tool Choice

You can use the toolChoice setting to influence when a tool is selected.
It supports the following settings:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';


const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  toolChoice: 'required', // force the model to call a tool
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});
```

## Schema Specification and Validation with Zod

Tool usage and structured object generation require the specification of schemas.
The AI SDK uses Zod, the most popular JavaScript schema validation library, for schema specification and validation.

You can install Zod with:

You can then specify schemas, for example:

```ts
import z from 'zod';


const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      }),
    ),
    steps: z.array(z.string()),
  }),
});
```

These schemas can be used to define parameters for tool calls and generated structured objects with generateObject and streamObject.

You can also use a JSON schema without Zod using the jsonSchema function to
define the schema.





Page URL: https://sdk.vercel.ai/docs/foundations/streaming

# Streaming

Streaming conversational text UIs (like ChatGPT) have gained massive popularity over the past few months. This section explores the benefits and drawbacks of streaming and blocking interfaces.

Large language models (LLMs) are extremely powerful. However, when generating long outputs, they can be very slow compared to the latency you're likely used to. If you try to build a traditional blocking UI, your users might easily find themselves staring at loading spinners for 5, 10, even up to 40s waiting for the entire LLM response to be generated. This can lead to a poor user experience, especially in conversational applications like chatbots. Streaming UIs can help mitigate this issue by displaying parts of the response as they become available.

Blocking UI

Blocking responses wait until the full response is available before displaying it.

Streaming UI

Streaming responses can transmit parts of the response as they become available.

## Real-world Examples

Here are 2 examples that illustrate how streaming UIs can improve user experiences in a real-world setting – the first uses a blocking UI, while the second uses a streaming UI.

### Blocking UI

### Streaming UI

As you can see, the streaming UI is able to start displaying the response much faster than the blocking UI. This is because the blocking UI has to wait for the entire response to be generated before it can display anything, while the streaming UI can display parts of the response as they become available.

While streaming interfaces can greatly enhance user experiences, especially with larger language models, they aren't always necessary or beneficial. If you can achieve your desired functionality using a smaller, faster model without resorting to streaming, this route can often lead to simpler and more manageable development processes.

However, regardless of the speed of your model, the Vercel AI SDK is designed to make implementing streaming UIs as simple as possible. In the example below, we stream text generation from OpenAI's gpt-4-turbo in under 10 lines of code using the SDK's streamText function:

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const { textStream } = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a poem about embedding models.',
});


for await (const textPart of textStream) {
  console.log(textPart);
}
```

For an introduction to streaming UIs and the AI SDK, check out our Getting Started guides.





Page URL: https://sdk.vercel.ai/docs/getting-started

# Getting Started

The following guides are intended to provide you with an introduction to some of the core features provided by the Vercel AI SDK.

Next.js App Router

Next.js Pages Router

SvelteKit

Nuxt

Node.js





Page URL: https://sdk.vercel.ai/docs/getting-started/navigating-the-library

# Navigating the Library

The Vercel AI SDK is a powerful toolkit for building AI applications. This page will help you pick the right tools for your requirements.

Let’s start with a quick overview of the Vercel AI SDK, which is comprised of three parts:

## Choosing the Right Tool for Your Environment

When deciding which part of the Vercel AI SDK to use, your first consideration should be the environment and existing stack you are working with. Different components of the SDK are tailored to specific frameworks and environments.

## Environment Compatibility

These tools have been designed to work seamlessly with each other and it's likely that you will be using them together. Let's look at how you could decide which libraries to use based on your application environment, existing stack, and requirements.

The following table outlines AI SDK compatibility based on environment:

## When to use AI SDK RSC

React Server Components (RSCs) provide a new approach to building React applications that allow components to render on the server, fetch data directly, and stream the results to the client, reducing bundle size and improving performance. They also introduce a new way to call server-side functions from anywhere in your application called Server Actions.

When considering whether to use AI SDK RSC, it's important to be aware of the current limitations of RSCs and Server Actions:

If any of the above limitations are important to your application, we recommend using AI SDK UI. If these limitations don't affect your use case, AI SDK RSC is a great choice that enables powerful server-side rendering capabilities and seamless integration with RSCs.

## AI SDK UI Framework Compatibility

AI SDK UI supports the following frameworks: React, Svelte, Vue.js, and SolidJS. Here is a comparison of the supported functions across these frameworks:

Contributions are
welcome to implement missing features for non-React frameworks.





Page URL: https://sdk.vercel.ai/docs/getting-started/nextjs-app-router

# Next.js App Router Quickstart

In this quick start tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

Check out Prompt Engineering and HTTP Streaming if you haven't heard of them.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Create Your Application

Start by creating a new Next.js application. This command will create a new directory named my-ai-app and set up a basic Next.js application inside it.

Be sure to select yes when prompted to use the App Router. If you are
looking for the Next.js Pages Router quickstart guide, you can find it
here.

Navigate to the newly created directory:

### Install dependencies

Install ai and @ai-sdk/openai, the Vercel AI package and Vercel AI SDK's  OpenAI provider  respectively.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

Make sure you are using ai version 3.1 or higher.

### Configure OpenAI API key

Create a .env.local file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

Edit the .env.local file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key.

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Create a Route Handler

Create a route handler, app/api/chat/route.ts and add the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

Let's take a look at what is happening in this code:

This Route Handler creates a POST request endpoint at /api/chat.

## Wire up the UI

Now that you have a Route Handler that can query an LLM, it's time to setup your frontend. Vercel AI SDK's  UI  package abstracts the complexity of a chat interface into one hook, useChat.

Update your root page (app/page.tsx) with the following code to show a list of chat messages and provide a user message input:

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

Make sure you add the "use client" directive to the top of your file. This
allows you to add interactivity with Javascript.

This page utilizes the useChat hook, which will, by default, use the POST API route you created earlier (/api/chat). The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

## Running Your Application

With that, you have built everything you need for your chatbot! To start your application, use the command:

Head to your browser and open http://localhost:3000. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! Vercel AI SDK makes it fast and easy to build AI chat interfaces with Next.js.

## Stream Data Alongside Response

Depending on your use case, you may want to stream additional data alongside the model's response. This can be done using StreamData.

### Update your Route Handler

Make the following changes to your Route Handler (app/api/chat/route.ts):

```ts
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, StreamData } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const data = new StreamData();
  data.append({ test: 'value' });


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
    onFinish() {
      data.close();
    },
  });


  return result.toDataStreamResponse({ data });
}
```

In this code, you:

### Update your frontend

To access this data on the frontend, the useChat hook returns an optional value that stores this data. Update your root route with the following code to render the streamed data:

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

Head back to your browser (http://localhost:3000) and enter a new message. You should see a JSON object appear with the value you sent from your API route!

## Introducing more granular control with ai/rsc

So far, you have used Vercel AI SDK's  UI  package to connect your frontend to your API route. This package is framework agnostic and provides simple abstractions for quickly building chat-like interfaces with LLMs.

The Vercel AI SDK also has a package (ai/rsc) specifically designed for frameworks that support the React Server Component architecture. With ai/rsc, you can build AI applications that go beyond pure text.

## Next.js App Router

The Next.js App Router is a React Server Component (RSC) framework. This means that pages and components are rendered on the server. Optionally, you can add directives, like "use client" when you want to add interactivity using Javascript and "use server" when you want to ensure code will only run on the server.

The server-first architecture of RSCs enables a number of powerful features, like Server Actions, which we will use as our server-side environment to query the language model.

Server Actions are functions that run on a server, but can be called directly
from your Next.js frontend. Server Actions reduce the amount of code you write
while also providing end-to-end type safety between the client and server. You
can learn more
here

### Create a Server Action

Create your first Server Action (app/actions.tsx) and add the following code:

```tsx
'use server';


import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });


  const stream = createStreamableValue(result.textStream);
  return stream.value;
}
```

Let's take a look at what is happening in this code:

### Update the UI

Now that you have created a Server Action that can query an LLM, it's time to update your frontend. With ai/rsc, you have much finer control over how you send and receive streamable values from the LLM.

Update your root page (app/page.tsx) with the following code:

```tsx
'use client';


import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content as string}
        </div>
      ))}


      <form
        onSubmit={async e => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ];


          setMessages(newMessages);
          setInput('');


          const result = await continueConversation(newMessages);


          for await (const content of readStreamableValue(result)) {
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
```

Let's look at how your implementation has changed. Without useChat, you have to manage your own state using the useState hook to manage the user's input and messages, respectively. The biggest change in your implementation is how you manage the form submission behaviour:

## Streaming Additional Data

Stream additional data alongside the response from the model by simply returning an additional value in your Server Action.
Update your app/actions.tsxwith the following code:

```ts
'use server';


import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


export async function continueConversation(messages: CoreMessage[]) {
  'use server';
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });
  const data = { test: 'hello' };
  const stream = createStreamableValue(result.textStream);
  return { message: stream.value, data };
}
```

The only change that you make here is to declare a new value (data) and return it alongside the stream.

### Update the UI

Update your root page with the following code:

```tsx
'use client';


import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { continueConversation } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState('');
  const [data, setData] = useState<any>();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map((m, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content as string}
        </div>
      ))}


      <form
        onSubmit={async e => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ];


          setMessages(newMessages);
          setInput('');


          const result = await continueConversation(newMessages);
          setData(result.data);


          for await (const content of readStreamableValue(result.message)) {
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
```

In the code above, you first create a new variable to manage the state of the additional data (data). Then, you update the state of the additional data with setData(result.data). Just like that, you've sent additional data alongside the model's response.

The ai/rsc library is designed to give you complete control over streamable values. This unlocks LLM applications beyond the traditional chat format.

## Where to Next?

You've built an AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or introducing more granular control over AI and UI states.

If you are looking to leverage the broader capabilities of LLMs, Vercel  AI SDK Core  provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/getting-started/nextjs-pages-router

# Next.js Pages Router Quickstart

The Vercel AI SDK is a powerful Typescript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of Prompt Engineering and HTTP Streaming, you can optionally read these documents first.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Setup Your Application

Start by creating a new Next.js application. This command will create a new directory named my-ai-app and set up a basic Next.js application inside it.

Be sure to select no when prompted to use the App Router. If you are looking
for the Next.js App Router quickstart guide, you can find it
here.

Navigate to the newly created directory:

### Install dependencies

Install ai and @ai-sdk/openai, Vercel AI SDK's OpenAI provider.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

Make sure you are using ai version 3.1 or higher.

### Configure OpenAI API Key

Create a .env.local file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

Edit the .env.local file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key.

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Create a Route Handler

As long as you are on Next.js 13+, you can use Route Handlers (using the App
Router) alongside the Pages Router. This is recommended to enable you to use
the Web APIs interface/signature and to better support streaming.

Create a Route Handler (app/api/chat/route.ts) and add the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });


  return result.toDataStreamResponse();
}
```

Let's take a look at what is happening in this code:

This Route Handler creates a POST request endpint at /api/chat.

## Wire up the UI

Now that you have an API route that can query an LLM, it's time to setup your frontend. Vercel AI SDK's  UI  package abstract the complexity of a chat interface into one hook, useChat.

Update your root page (pages/index.tsx) with the following code to show a list of chat messages and provide a user message input:

```tsx
import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

This page utilizes the useChat hook, which will, by default, use the POST API route you created earlier (/api/chat). The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

## Running Your Application

With that, you have built everything you need for your chatbot! To start your application, use the command:

Head to your browser and open http://localhost:3000. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! Vercel AI SDK makes it fast and easy to build AI chat interfaces with Next.js.

## Stream Data Alongside Response

Depending on your use case, you may want to stream additional data alongside the model's response. This can be done using StreamData.

### Update your Route Handler

Make the following changes to your Route Handler (app/api/chat/route.ts)

```ts
import { openai } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const data = new StreamData();
  data.append({ test: 'value' });


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    onFinish() {
      data.close();
    },
  });


  return result.toDataStreamResponse({ data });
}
```

In this code, you:

### Update your frontend

To access this data on the frontend, the useChat hook returns an optional value that stores this data. Update your root route with the following code to render the streamed data:

```tsx
import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, data } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

Head back to your browser (http://localhost:3000) and enter a new message. You should see a JSON object appear with the value you sent from your API route!

## Where to Next?

You've built an AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or persisting chat history.

If you are looking to leverage the broader capabilities of LLMs, Vercel  AI SDK Core  provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/getting-started/svelte

# Svelte Quickstart

The Vercel AI SDK is a powerful Typescript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of Prompt Engineering and HTTP Streaming, you can optionally read these documents first.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Setup Your Application

Start by creating a new SvelteKit application. This command will create a new directory named my-ai-app and set up a basic SvelteKit application inside it.

Navigate to the newly created directory:

### Install Dependencies

Install ai and @ai-sdk/openai, Vercel AI SDK's OpenAI provider.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

Make sure you are using ai version 3.1 or higher.

### Configure OpenAI API Key

Create a .env.local file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

Edit the .env.local file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key.

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Create an API route

Create a SvelteKit Endpoint, src/routes/api/chat/+server.ts and add the following code:

```tsx
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import type { RequestHandler } from './$types';


import { env } from '$env/dynamic/private';


const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});


export const POST = (async ({ request }) => {
  const { messages } = await request.json();


  const result = await streamText({
    model: openai('gpt-4-turbo-preview'),
    messages,
  });


  return result.toDataStreamResponse();
}) satisfies RequestHandler;
```

Let's take a look at what is happening in this code:

## Wire up the UI

Now that you have an API route that can query an LLM, it's time to setup your frontend. Vercel AI SDK's  UI  package abstract the complexity of a chat interface into one hook, useChat.

Update your root page (src/routes/+page.svelte) with the following code to show a list of chat messages and provide a user message input:

```html
<script>
  import { useChat } from '@ai-sdk/svelte';


  const { input, handleSubmit, messages } = useChat();
</script>


<main>
  <ul>
    {#each $messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Send</button>
  </form>
</main>
```

This page utilizes the useChat hook, which will, by default, use the POST route handler you created earlier. The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

## Running Your Application

With that, you have built everything you need for your chatbot! To start your application, use the command:

Head to your browser and open http://localhost:5173. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! Vercel AI SDK makes it fast and easy to build AI chat interfaces with Svelte.

## Stream Data Alongside Response

Depending on your use case, you may want to stream additional data alongside the model's response. This can be done using StreamData.

### Update your API route

Make the following changes to your POST endpoint (src/routes/api/chat/+server.ts)

```ts
import { createOpenAI } from '@ai-sdk/openai';
import { StreamData, streamText } from 'ai';
import type { RequestHandler } from './$types';


import { env } from '$env/dynamic/private';


const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY ?? '',
});


export const POST = (async ({ request }) => {
  const { messages } = await request.json();


  const data = new StreamData();
  data.append({ test: 'value' });


  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    onFinish() {
      data.close();
    },
    messages,
  });


  return result.toDataStreamResponse({ data });
}) satisfies RequestHandler;
```

In this code, you:

### Update your frontend

To access this data on the frontend, the useChat hook returns an optional value that stores this data. Update your root route with the following code to render the streamed data:

```html
<script>
  import { useChat } from '@ai-sdk/svelte';


  const { input, handleSubmit, messages, data } = useChat();
</script>


<main>
  <pre>{JSON.stringify($data, null, 2)}</pre>
  <ul>
    {#each $messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Send</button>
  </form>
</main>
```

Head back to your browser (http://localhost:5173) and enter a new message. You should see a JSON object appear with the value you sent from your API route!

## Where to Next?

You've built an AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or persisting chat history.

If you are looking to leverage the broader capabilities of LLMs, Vercel  AI SDK Core  provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/getting-started/nuxt

# Nuxt Quickstart

The Vercel AI SDK is a powerful Typescript library designed to help developers build AI-powered applications.

In this quickstart tutorial, you'll build a simple AI-chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of Prompt Engineering and HTTP Streaming, you can optionally read these documents first.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Setup Your Application

Start by creating a new Nuxt application. This command will create a new directory named my-ai-app and set up a basic Nuxt application inside it.

Navigate to the newly created directory:

### Install dependencies

Install ai and @ai-sdk/openai, Vercel AI SDK's OpenAI provider.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

Make sure you are using ai version 3.1 or higher.

### Configure OpenAI API key

Create a .env.local file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

Edit the .env.local file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key and configure the environment variable in nuxt.config.ts:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
});
```

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Create an API route

Create an API route, server/api/chat.ts and add the following code:

```tsx
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';


export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });


  return defineEventHandler(async (event: any) => {
    const { messages } = await readBody(event);


    const result = await streamText({
      model: openai('gpt-4-turbo'),
      messages,
    });


    return result.toDataStreamResponse();
  });
});
```

Let's take a look at what is happening in this code:

## Wire up the UI

Now that you have an API route that can query an LLM, it's time to setup your frontend. Vercel AI SDK's  UI  package abstract the complexity of a chat interface into one hook, useChat.

Update your root page (pages/index.vue) with the following code to show a list of chat messages and provide a user message input:

```tsx
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';


const { messages, input, handleSubmit } = useChat();
</script>


<template>
  <div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    <div v-for="m in messages" :key="m.id" class="whitespace-pre-wrap">
      {{ m.role === 'user' ? 'User: ' : 'AI: ' }}
      {{ m.content }}
    </div>


    <form @submit="handleSubmit">
      <input
        class="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
        v-model="input"
        placeholder="Say something..."
      />
    </form>
  </div>
</template>
```

This page utilizes the useChat hook, which will, by default, use the API route you created earlier (/api/chat). The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

## Running Your Application

With that, you have built everything you need for your chatbot! To start your application, use the command:

Head to your browser and open http://localhost:3000. You should see an input field. Test it out by entering a message and see the AI chatbot respond in real-time! Vercel AI SDK makes it fast and easy to build AI chat interfaces with Nuxt.

## Stream Data Alongside Response

Depending on your use case, you may want to stream additional data alongside the model's response. This can be done using StreamData.

### Update your API route

Make the following changes to your API route (pages/api/chat.ts)

```ts
import { streamText, StreamData } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';


export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().openaiApiKey;
  if (!apiKey) throw new Error('Missing OpenAI API key');
  const openai = createOpenAI({
    apiKey: apiKey,
  });


  return defineEventHandler(async (event: any) => {
    const { messages } = await readBody(event);


    const data = new StreamData();
    data.append({ test: 'value' });


    const result = await streamText({
      model: openai('gpt-4-turbo'),
      onFinish() {
        data.close();
      },
      messages,
    });


    return result.toDataStreamResponse({ data });
  });
});
```

In this code, you:

### Update your frontend

To access this data on the frontend, the useChat hook returns an optional value that stores this data. Update your root route with the following code to render the streamed data:

```tsx
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue';


const { messages, input, handleSubmit, data } = useChat();
</script>


<template>
  <div class="flex flex-col w-full max-w-md py-24 mx-auto stretch">
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    <div v-for="m in messages" :key="m.id" class="whitespace-pre-wrap">
      {{ m.role === 'user' ? 'User: ' : 'AI: ' }}
      {{ m.content }}
    </div>


    <form @submit="handleSubmit">
      <input
        class="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
        v-model="input"
        placeholder="Say something..."
      />
    </form>
  </div>
</template>
```

Head back to your browser (http://localhost:3000) and enter a new message. You should see a JSON object appear with the value you sent from your API route!

## Where to Next?

You've built an AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or persisting chat history.

If you are looking to leverage the broader capabilities of LLMs, Vercel  AI SDK Core  provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/getting-started/nodejs

# Node.js Quickstart

In this quickstart tutorial, you'll build a simple AI chatbot with a streaming user interface. Along the way, you'll learn key concepts and techniques that are fundamental to using the SDK in your own projects.

If you are unfamiliar with the concepts of Prompt Engineering and HTTP Streaming, you can optionally read these documents first.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

## Setup Your Application

Start by creating a new directory using the mkdir command. Change into your new directory and then run the pnpm init command. This will create a a package.json in your new directory.

```bash
mkdir my-ai-app
cd my-ai-app
pnpm init
```

### Install dependencies

In your new directory, install the following dependencies:

```bash
pnpm add ai @ai-sdk/openai zod dotenv
pnpm add -D @types/node tsx typescript
```

Make sure you are using ai version 3.1 or higher.

The ai and @ai-sdk/openai packages contain the Vercel AI SDK and the  Vercel AI SDK OpenAI provider, respectively. You will use zod to define type-safe schemas that you will pass to the large language model (LLM). You will use dotenv to access environment variables (your OpenAI key) within your application. There are also three development dependencies, installed with the -D flag, that are necessary to run your Typescript code.

### Configure OpenAI API key

Create a .env file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key.

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Build Your Application

Now that your project is configured, it’s time to start building.

In this quickstart guide, you will explore the fundamental concepts behind Vercel AI SDK by building a Node.js chatbot that will run in your terminal.

First, create an index.ts file in the root of your project and add the following code:

```ts
import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import dotenv from 'dotenv';
import * as readline from 'node:readline/promises';


dotenv.config();


const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


const messages: CoreMessage[] = [];


async function main() {
  while (true) {
    const userInput = await terminal.question('You: ');


    messages.push({ role: 'user', content: userInput });


    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system: `You are a helpful, respectful and honest assistant.`,
      messages,
    });


    let fullResponse = '';
    process.stdout.write('\nAssistant: ');
    for await (const delta of result.textStream) {
      fullResponse += delta;
      process.stdout.write(delta);
    }
    process.stdout.write('\n\n');


    messages.push({ role: 'assistant', content: fullResponse });
  }
}


main().catch(console.error);
```

Let's take a closer look at the code:

Head back to the terminal and run the following command:

Type in a message and hit enter. You should see the model's response stream in as it’s being generated, just like a typewriter.

## Where to Next?

You've built an AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or generating structured data.

If you are looking to leverage the broader capabilities of LLMs, Vercel  AI SDK Core  provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/guides

# Guides

These use-case specific guides are intended to help you build real applications with the Vercel AI SDK.





Page URL: https://sdk.vercel.ai/docs/guides/rag-chatbot

# RAG Chatbot Guide

In this guide, you will learn how to build a retrieval-augmented generation (RAG) chatbot application.

Before we dive in, let's look at what RAG is, and why we would want to use it.

### What is RAG?

RAG stands for retrieval augmented generation. In simple terms, RAG is the process of providing a Large Language Model (LLM) with specific information relevant to the prompt.

### Why is RAG important?

While LLMs are powerful, the information they can reason on is restricted to the data they were trained on. This problem becomes apparent when asking an LLM for information outside of their training data, like proprietary data or common knowledge that has occurred after the model’s training cutoff. RAG solves this problem by fetching information relevant to the prompt and then passing that to the model as context.

To illustrate with a basic example, imagine asking the model for your favorite food:

```txt
**input**
What is my favorite food?


**generation**
I don't have access to personal information about individuals, including their
favorite foods.
```

Not surprisingly, the model doesn’t know. But imagine, alongside your prompt, the model received some extra context:

```txt
**input**
Respond to the user's prompt using only the provided context.
user prompt: 'What is my favorite food?'
context: user loves chicken nuggets


**generation**
Your favorite food is chicken nuggets!
```

Just like that, you have augmented the model’s generation by providing relevant information to the query. Assuming the model has the appropriate information, it is now highly likely to return an accurate response to the users query. But how does it retrieve the relevant information? The answer relies on a concept called embedding.

You could fetch any context for your RAG application (eg. Google search).
Embeddings and Vector Databases are just a specific retrieval approach to
achieve semantic search.

### Embedding

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space. In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

In practice, this means that if you embedded the words cat and dog, you would expect them to be plotted close to each other in vector space. The process of calculating the similarity between two vectors is called ‘cosine similarity’ where a value of 1 would indicate high similarity and a value of -1 would indicate high opposition.

Don’t worry if this seems complicated. a high level understanding is all you
need to get started! For a more in-depth introduction to embeddings, check out
this guide.

As mentioned above, embeddings are a way to represent the semantic meaning of words and phrases. The implication here is that the larger the input to your embedding, the lower quality the embedding will be. So how would you approach embedding content longer than a simple phrase?

### Chunking

Chunking refers to the process of breaking down a particular source material into smaller pieces. There are many different approaches to chunking and it’s worth experimenting as the most effective approach can differ by use case. A simple and common approach to chunking (and what you will be using in this guide) is separating written content by sentences.

Once your source material is appropriately chunked, you can embed each one and then store the embedding and the chunk together in a database. Embeddings can be stored in any database that supports vectors. For this tutorial, you will be using Postgres alongside the pgvector plugin.

### All Together Now

Combining all of this together, RAG is the process of enabling the model to respond with information outside of it’s training data by embedding a users query, retrieving the relevant source material (chunks) with the highest semantic similarity, and then passing them alongside the initial query as context. Going back to the example where you ask the model for your favorite food, the prompt preparation process would look like this.

By passing the appropriate context and refining the model’s objective, you are able to fully leverage its strengths as a reasoning machine.

Onto the project!

## Project Setup

In this project, you will build a chatbot that will only respond with information that it has within its knowledge base. The chatbot will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

This project will use the following stack:

### Clone Repo

To reduce the scope of this guide, you will be starting with a repository that already has a few things set up for you:

To get started, clone the starter repository with the following command:

First things first, run the following command to install the project’s dependencies:

### Create Database

You will need a Postgres database to complete this tutorial. If you don’t have Postgres setup on your local machine you can:

### Migrate Database

Once you have a Postgres database, you need to add the connection string as an environment secret.

Make a copy of the .env.example file and rename it to .env.

Open the new .env file. You should see an item called DATABASE_URL. Copy in your database connection string after the equals sign.

With that set up, you can now run your first database migration. Run the following command:

This will first add the pgvector extension to your database. Then it will create a new table for your resources schema that is defined in lib/db/schema/resources.ts. This schema has four columns: id, content, createdAt, and updatedAt.

If you experience an error with the migration, open your migration file
(lib/db/migrations/0000_yielding_bloodaxe.sql), cut (copy and remove) the
first line, and run it directly on your postgres instance. You should now be
able to run the updated migration. More
info.

### OpenAI API Key

For this guide, you will need an OpenAI API key. To generate an API key, go to platform.openai.com.

Once you have your API key, paste it into your .env file (OPENAI_API_KEY).

## Build

Let’s build a quick task list of what needs to be done:

### Create Embeddings Table

Currently, your application has one table (resources) which has a column (content) for storing content. Remember, each resource (source material) will have to be chunked, embedded, and then stored. Let’s create a table called embeddings to store these chunks.

Create a new file (lib/db/schema/embeddings.ts) and add the following code:

```tsx
import { nanoid } from '@/lib/utils';
import { index, pgTable, text, varchar, vector } from 'drizzle-orm/pg-core';
import { resources } from './resources';


export const embeddings = pgTable(
  'embeddings',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar('resource_id', { length: 191 }).references(
      () => resources.id,
      { onDelete: 'cascade' },
    ),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
  },
  table => ({
    embeddingIndex: index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  }),
);
```

This table has four columns:

To perform similarity search, you also need to include an index (HNSW or IVFFlat) on this column for better performance.

To push this change to the database, run the following command:

### Add Embedding Logic

Now that you have a table to store embeddings, it’s time to write the logic to create the embeddings.

Create a file with the following command:

### Generate Chunks

Remember, to create an embedding, you will start with a piece of source material (unknown length), break it down into smaller chunks, embed each chunk, and then save the chunk to the database. Let’s start by creating a function to break the source material into small chunks.

```tsx
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};
```

This function will take an input string and split it by periods, filtering out any empty items. This will return an array of strings. It is worth experimenting with different chunking techniques in your projects as the best technique will vary.

### Install AI SDK

You will use the Vercel AI SDK to create embeddings. This will require two more dependencies, which you can install by running the following command:

This will install the Vercel AI SDK and the OpenAI provider.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

### Generate Embeddings

Let’s add a function to generate embeddings. Copy the following code into your lib/ai/embedding.ts file.

```tsx
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';


const embeddingModel = openai.embedding('text-embedding-ada-002');


const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};


export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};
```

In this code, you first define the model you want to use for the embeddings. In this example, you are using OpenAI’s text-embedding-ada-002 embedding model.

Next, you create an asynchronous function called generateEmbeddings. This function will take in the source material (value) as an input and return a promise of an array of objects, each containing an embedding and content. Within the function, you first generate chunks for the input. Then, you pass those chunks to the embedMany function imported from the Vercel AI SDK which will return embeddings of the chunks you passed in. Finally, you map over and return the embeddings in a format that is ready to save in the database.

### Update Server Action

Open the file at lib/actions/resources.ts. This file has one function, createResource, which, as the name implies, allows you to create a resource.

```tsx
'use server';


import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';


export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);


    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();


    return 'Resource successfully created.';
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'Error, please try again.';
  }
};
```

This function is a Server Action, as denoted by the “use server”; directive at the top of the file. This means that it can be called anywhere in your Next.js application. This function will take an input, run it through a Zod schema to ensure it adheres to the correct schema, and then creates a new resource in the database. This is the ideal location to generate and store embeddings of the newly created resources.

Update the file with the following code:

```tsx
'use server';


import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from '@/lib/db/schema/resources';
import { db } from '../db';
import { generateEmbeddings } from '../ai/embedding';
import { embeddings as embeddingsTable } from '../db/schema/embeddings';


export const createResource = async (input: NewResourceParams) => {
  try {
    const { content } = insertResourceSchema.parse(input);


    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();


    const embeddings = await generateEmbeddings(content);
    await db.insert(embeddingsTable).values(
      embeddings.map(embedding => ({
        resourceId: resource.id,
        ...embedding,
      })),
    );


    return 'Resource successfully created and embedded.';
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};
```

First, you call the generateEmbeddings function created in the previous step, passing in the source material (content). Once you have your embeddings (e) of the source material, you can save them to the database, passing the resourceId alongside each embedding.

### Create Root Page

Great! Let's build the frontend. Vercel AI SDK’s useChat hook allows you to easily create a conversational user interface for your chatbot application.

Replace your root page (app/page.tsx) with the following code.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>{m.content}</p>
            </div>
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

The useChat hook enables the streaming of chat messages from your AI provider (you will be using OpenAI), manages the state for chat input, and updates the UI automatically as new messages are received.

Run the following command to start the Next.js dev server:

Head to http://localhost:3000. You should see an empty screen with an input bar floating at the bottom. Try to send a message. The message shows up in the UI for a fraction of a second and then disappears. This is because you haven’t set up the corresponding API route to call the model! By default, useChat will send a POST request to the /api/chat endpoint with the messages as the request body.

### Create API Route

In Next.js, you can create custom request handlers for a given route using Route Handlers. Route Handlers are defined in a route.ts file and can export HTTP methods like GET, POST, PUT, PATCH etc.

Create a file at app/api/chat/route.ts by running the following command:

Open the file and add the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

In this code, you declare and export an asynchronous function called POST. You retrieve the messages from the request body and then pass them to the streamText function imported from the Vercel AI SDK, alongside the model you would like to use. Finally, you return the model’s response in AIStreamResponse format.

Head back to the browser and try to send a message again. You should see a response from the model streamed directly in!

### Refining your prompt

While you now have a working chatbot, it isn't doing anything special.

Let’s add system instructions to refine and restrict the model’s behavior. In this case, you want the model to only use information it has retrieved to generate responses. Update your route handler with the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

Head back to the browser and try to ask the model what your favorite food is. The model should now respond exactly as you instructed above (“Sorry, I don’t know”) given it doesn’t have any relevant information.

In its current form, your chatbot is now, well, useless. How do you give the model the ability to add and query information?

### Using Tools

A tool is a function that can be called by the model to perform a specific task. You can think of a tool like a program you give to the model that it can run as and when it deems necessary.

Let’s see how you can create a tool to give the model the ability to create, embed and save a resource to your chatbots’ knowledge base.

### Add Resource Tool

Update your route handler with the following code:

```tsx
import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from 'zod';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
    },
  });


  return result.toDataStreamResponse();
}
```

In this code, you define a tool called addResource. This tool has three elements:

In simple terms, on each generation, the model will decide whether it should call the tool. If it deems it should call the tool, it will extract the parameters from the input and then append a new message to the messages array of type tool-call. The AI SDK will then run the execute function with the parameters provided by the tool-call message.

Head back to the browser and tell the model your favorite food. You should see an empty response in the UI. Did anything happen? Let’s see. Run the following command in a new terminal window.

This will start Drizzle Studio where we can view the rows in our database. You should see a new row in both the embeddings and resources table with your favorite food!

Let’s make a few changes in the UI to communicate to the user when a tool has been called. Head back to your root page (app/page.tsx) and add the following code:

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {'calling tool: ' + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>


      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

With this change, you now conditionally render the tool that has been called directly in the UI. Save the file and head back to browser. Tell the model your favorite movie. You should see which tool is called in place of the model’s typical text response.

### Improving UX with Tool Roundtrips

It would be nice if the model could summarize the action too. However, technically, once the model calls a tool, it has completed its generation as it ‘generated’ a tool call. How could you achieve this desired behaviour?

The AI SDK has a feature called maxToolCallRoundtrips which will automatically send tool call results back to the model!

Open your root page (app/page.tsx) and add the following key to the useChat configuration object:

```tsx
// ... Rest of your code


const { messages, input, handleInputChange, handleSubmit } = useChat({
  maxToolRoundtrips: 2,
});


// ... Rest of your code
```

Head back to the browser and tell the model your favorite pizza topping (note: pineapple is not an option). You should see a follow-up response from the model confirming the action.

### Retrieve Resource Tool

The model can now add and embed arbitrary information to your knowledge base. However, it still isn’t able to query it. Let’s create a new tool to allow the model to answer questions by finding relevant information in your knowledge base.

To find similar content, you will need to embed the users query, search the database for semantic similarities, then pass those items to the model as context alongside the query. To achieve this, let’s update your embedding logic file (lib/ai/embedding.ts):

```tsx
import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';


const embeddingModel = openai.embedding('text-embedding-ada-002');


const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};


export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};


export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};


export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);
  return similarGuides;
};
```

In this code, you add two functions:

With that done, it’s onto the final step: creating the tool.

Go back to your route handler (api/chat/route.ts) and add a new tool called getInformation:

```ts
import { createResource } from '@/lib/actions/resources';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from '@/lib/ai/embedding';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    tools: {
      addResource: tool({
        description: `add a resource to your knowledge base.
          If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe('the content or resource to add to the knowledge base'),
        }),
        execute: async ({ content }) => createResource({ content }),
      }),
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    },
  });


  return result.toDataStreamResponse();
}
```

Head back to the browser, refresh the page, and ask for your favorite food. You should see the model call the getInformation tool, and then use the relevant information to formulate a response!

## Conclusion

Congratulations, you have successfully built an AI chatbot that can dynamically add and retrieve information to and from a knowledge base. Throughout this guide, you learned how to create and store embeddings, set up server actions to manage resources, and use tools to extend the capabilities of your chatbot.





Page URL: https://sdk.vercel.ai/docs/guides/multi-modal-chatbot

# Multi-Modal Chatbot

In this guide, you will build a multi-modal AI-chatbot with a streaming user interface.

Multi-modal refers to the ability of the chatbot to understand and generate responses in multiple formats, such as text, images, and videos. In this example, we will focus on sending images and generating text-based responses.

## Prerequisites

To follow this quickstart, you'll need:

If you haven't obtained your OpenAI API key, you can do so by signing up on the OpenAI website.

## Create Your Application

Start by creating a new Next.js application. This command will create a new directory named multi-modal-chatbot and set up a basic Next.js application inside it.

Be sure to select yes when prompted to use the App Router. If you are
looking for the Next.js Pages Router quickstart guide, you can find it
here.

Navigate to the newly created directory:

### Install dependencies

Install ai and @ai-sdk/openai, the Vercel AI package and Vercel AI SDK's  OpenAI provider  respectively.

Vercel AI SDK is designed to be a unified interface to interact with any large
language model. This means that you can change model and providers with just
one line of code! Learn more about available providers and
building custom providers
in the providers section.

Make sure you are using ai version 3.2.27 or higher.

### Configure OpenAI API key

Create a .env.local file in your project root and add your OpenAI API Key. This key is used to authenticate your application with the OpenAI service.

Edit the .env.local file:

```env
OPENAI_API_KEY=xxxxxxxxx
```

Replace xxxxxxxxx with your actual OpenAI API key.

Vercel AI SDK's OpenAI Provider will default to using the OPENAI_API_KEY
environment variable.

## Implementation Plan

To build a multi-modal chatbot, you will need to:

## Create a Route Handler

Create a route handler, app/api/chat/route.ts and add the following code:

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

Let's take a look at what is happening in this code:

This Route Handler creates a POST request endpoint at /api/chat.

## Wire up the UI

Now that you have a Route Handler that can query a large language model (LLM), it's time to setup your frontend.  AI SDK UI  abstracts the complexity of a chat interface into one hook, useChat.

Update your root page (app/page.tsx) with the following code to show a list of chat messages and provide a user message input:

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}


      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8 border border-gray-300 rounded shadow-xl"
      >
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

Make sure you add the "use client" directive to the top of your file. This
allows you to add interactivity with Javascript.

This page utilizes the useChat hook, which will, by default, use the POST API route you created earlier (/api/chat). The hook provides functions and state for handling user input and form submission. The useChat hook provides multiple utility functions and state variables:

## Add Image Upload

To make your chatbot multi-modal, let's add the ability to upload and send images to the model. There are two ways to send attachments alongside a message with the useChat hook: by  providing a FileList object  or a  list of URLs  to the handleSubmit function. In this guide, you will be using the FileList approach as it does not require any additional setup.

Update your root page (app/page.tsx) with the following code:

```tsx
'use client';


import { useChat } from 'ai/react';
import { useRef, useState } from 'react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();


  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
          <div>
            {m?.experimental_attachments
              ?.filter(attachment =>
                attachment?.contentType?.startsWith('image/'),
              )
              .map((attachment, index) => (
                <img
                  key={`${m.id}-${index}`}
                  src={attachment.url}
                  width={500}
                  alt={attachment.name}
                />
              ))}
          </div>
        </div>
      ))}


      <form
        className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl space-y-2"
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });


          setFiles(undefined);


          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          className=""
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          className="w-full p-2"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

In this code, you:

## Running Your Application

With that, you have built everything you need for your multi-modal chatbot! To start your application, use the command:

Head to your browser and open http://localhost:3000. You should see an input field and a button to upload an image.

Upload a file and ask the model to describe what it sees. Watch as the model's response is streamed back to you!

## Where to Next?

You've built a multi-modal AI chatbot using the Vercel AI SDK! Experiment and extend the functionality of this application further by exploring tool calling or introducing more granular control over AI and UI states.

If you are looking to leverage the broader capabilities of LLMs, Vercel AI SDK Core provides a comprehensive set of lower-level tools and APIs that will help you unlock a wider range of AI functionalities beyond the chatbot paradigm.





Page URL: https://sdk.vercel.ai/docs/guides/llama-3_1

# Get started with Llama 3.1

With the release of Llama 3.1, there has never been a better time to start building AI applications.

The Vercel AI SDK is a powerful TypeScript toolkit for building AI application with large language models (LLMs) like Llama 3.1 alongside popular frameworks like React, Next.js, Vue, Svelte, Node.js, and more

## Llama 3.1

The release of Meta's Llama 3.1 is an important moment in AI development. As the first state-of-the-art open weight AI model, Llama 3.1 is helping accelerate developers building AI apps. Available in 8B, 70B, and 405B sizes, these instruction-tuned models work well for tasks like dialogue generation, translation, reasoning, and code generation.

## Benchmarks

Llama 3.1 surpasses most available open-source chat models on common industry benchmarks and even outperforms some closed-source models, offering superior performance in language nuances, contextual understanding, and complex multi-step tasks. The models' refined post-training processes significantly improve response alignment, reduce false refusal rates, and enhance answer diversity, making Llama 3.1 a powerful and accessible tool for building generative AI applications.

Source: Meta AI - Llama 3.1 Model Card

## Choosing Model Size

Llama 3.1 includes a new 405B parameter model, becoming the largest open-source model available today. This model is designed to handle the most complex and demanding tasks.

When choosing between the different sizes of Llama 3.1 models (405B, 70B, 8B), consider the trade-off between performance and computational requirements. The 405B model offers the highest accuracy and capability for complex tasks but requires significant computational resources. The 70B model provides a good balance of performance and efficiency for most applications, while the 8B model is suitable for simpler tasks or resource-constrained environments where speed and lower computational overhead are priorities.

## Getting Started with the Vercel AI SDK

The Vercel AI SDK is the TypeScript toolkit designed to help developers build AI-powered applications with React, Next.js, Vue, Svelte, Node.js, and more. Integrating LLMs into applications is complicated and heavily dependent on the specific model provider you use.

The Vercel AI SDK abstracts away the differences between model providers, eliminates boilerplate code for building chatbots, and allows you to go beyond text output to generate rich, interactive components.

At the center of the Vercel AI SDK is AI SDK Core, which provides a unified API to call any LLM. The code snippet below is all you need to call Llama 3.1 (using Groq) with the Vercel AI SDK:

```tsx
import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const { text } = await generateText({
  model: groq('llama-3.1-405b-reasoning'),
  prompt: 'What is love?',
});
```

Llama 3.1 is available to use with many AI SDK providers including
Groq, Amazon
Bedrock,
Perplexity,
Fireworks, and more.

AI SDK Core abstracts away the differences between model providers, allowing you to focus on building great applications. Prefer to use Amazon Bedrock? The unified interface also means that you can easily switch between models by changing just two lines of code.

```tsx
import { generateText } from 'ai';
import { bedrock } from '@ai-sdk/amazon-bedrock';


const { text } = await generateText({
  model: bedrock('meta.llama3-1-405b-instruct-v1'),
  prompt: 'What is love?',
});
```

### Streaming the Response

To stream the model's response as it's being generated, update your code snippet to use the streamText function.

```tsx
import { streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const { textStream } = await streamText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is love?',
});
```

### Generating Structured Data

While text generation can be useful, you might want to generate structured JSON data. For example, you might want to extract information from text, classify data, or generate synthetic data. AI SDK Core provides two functions (generateObject and streamObject) to generate structured data, allowing you to constrain model outputs to a specific schema.

```tsx
import { generateObject } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const { object } = await generateObject({
  model: groq('llama-3.1-70b-versatile'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

This code snippet will generate a type-safe recipe that conforms to the specified zod schema.

### Tools

While LLMs have incredible generation capabilities, they struggle with discrete tasks (e.g. mathematics) and interacting with the outside world (e.g. getting the weather). The solution: tools, which are like programs that you provide to the model, which it can choose to call as necessary.

### Using Tools with the Vercel AI SDK

The Vercel AI SDK supports tool usage across several of its functions, including generateText and streamUI. By passing one or more tools to the tools parameter, you can extend the capabilities of LLMs, allowing them to perform discrete tasks and interact with external systems.

Here's an example of how you can use a tool with the Vercel AI SDK and Llama 3.1:

```tsx
import { generateText, tool } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { getWeather } from './weatherTool';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const { text } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is the weather like today?',
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
});
```

In this example, the getWeather tool allows the model to fetch real-time weather data, enhancing its ability to provide accurate and up-to-date information.

### Agents

Agents take your AI applications a step further by allowing models to execute multiple steps (i.e. tools) in a non-deterministic way, making decisions based on context and user input.

Agents use LLMs to choose the next step in a problem-solving process. They can reason at each step and make decisions based on the evolving context.

### Implementing Agents with the Vercel AI SDK

The Vercel AI SDK supports agent implementation through the maxToolRoundtrips parameter. This allows the model to make multiple decisions and tool calls in a single interaction.

Here's an example of an agent that solves math problems:

```tsx
import { generateText, tool } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import * as mathjs from 'mathjs';
import { z } from 'zod';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const problem =
  'Calculate the profit for a day if revenue is $5000 and expenses are $3500.';


const { text: answer } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  system:
    'You are solving math problems. Reason step by step. Use the calculator when necessary.',
  prompt: problem,
  tools: {
    calculate: tool({
      description: 'A tool for evaluating mathematical expressions.',
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }) => mathjs.evaluate(expression),
    }),
  },
  maxToolRoundtrips: 5,
});
```

In this example, the agent can use the calculator tool multiple times if needed, reasoning through the problem step by step.

### Building Interactive Interfaces

AI SDK Core can be paired with AI SDK UI, another powerful component of the Vercel AI SDK, to streamline the process of building chat, completion, and assistant interfaces with popular frameworks like Next.js, Nuxt, SvelteKit, and SolidStart.

AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently.

With four main hooks — useChat, useCompletion, useObject, and useAssistant — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

Let's explore building a chatbot with Next.js, Vercel AI SDK, and Llama 3.1 (via Groq):

```tsx
import { convertToCoreMessages, streamText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: groq('llama-3.1-70b-versatile'),
    system: 'You are a helpful assistant.',
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();


  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

The useChat hook on your root page (app/page.tsx) will make a request to your AI provider endpoint (app/api/chat/route.ts) whenever the user submits a message. The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

### Going Beyond Text

The Vercel AI SDK's React Server Components (RSC) API enables you to create rich, interactive interfaces that go beyond simple text generation. With the streamUI function, you can dynamically stream React components from the server to the client.

Let's dive into how you can leverage tools with AI SDK RSC to build a generative user interface with Next.js (App Router).

First, create a Server Action.

```tsx
'use server';


import { streamUI } from 'ai/rsc';
import { createOpenAI as createGroq } from '@ai-sdk/openai';
import { z } from 'zod';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


export async function streamComponent() {
  const result = await streamUI({
    model: groq('llama-3.1-70b-versatile'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({ location: z.string() }),
        generate: async function* ({ location }) {
          yield <div>loading...</div>;
          const weather = '25c'; // await getWeather(location);
          return (
            <div>
              the weather in {location} is {weather}.
            </div>
          );
        },
      },
    },
  });
  return result.value;
}
```

In this example, if the model decides to use the getWeather tool, it will first yield a div while fetching the weather data, then return a weather component with the fetched data (note: static data in this example). This allows for a more dynamic and responsive UI that can adapt based on the AI's decisions and external data.

On the frontend, you can call this Server Action like any other asynchronous function in your application. In this case, the function returns a regular React component.

```tsx
'use client';


import { useState } from 'react';
import { streamComponent } from './actions';


export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();


  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <button>Stream Component</button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

To see AI SDK RSC in action, check out our open-source Next.js Gemini Chatbot.

## Migrate from OpenAI

One of the key advantages of the Vercel AI SDK is its unified API, which makes it incredibly easy to switch between different AI models and providers. This flexibility is particularly useful when you want to migrate from one model to another, such as moving from OpenAI's GPT models to Meta's Llama models hosted on Groq.

Here's how simple the migration process can be:

OpenAI Example:

```tsx
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'What is love?',
});
```

Llama on Groq Example:

```tsx
import { generateText } from 'ai';
import { createOpenAI as createGroq } from '@ai-sdk/openai';


const groq = createGroq({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


const { text } = await generateText({
  model: groq('llama-3.1-70b-versatile'),
  prompt: 'What is love?',
});
```

Thanks to the unified API, the core structure of the code remains the same. The main differences are:

With just these few changes, you've migrated from using OpenAI's GPT-4-Turbo to Meta's Llama 3.1 hosted on Groq. The generateText function and its usage remain identical, showcasing the power of the Vercel AI SDK's unified API.

This feature allows you to easily experiment with different models, compare their performance, and choose the best one for your specific use case without having to rewrite large portions of your codebase.

## Prompt Engineering and Fine-tuning

While the Llama 3.1 family of models are powerful out-of-the-box, their performance can be enhanced through effective prompt engineering and fine-tuning techniques.

### Prompt Engineering

Prompt engineering is the practice of crafting input prompts to elicit desired outputs from language models. It involves structuring and phrasing prompts in ways that guide the model towards producing more accurate, relevant, and coherent responses.

For more information on prompt engineering techniques (specific to Llama models), check out these resources:

### Fine-tuning

Fine-tuning involves further training a pre-trained model on a specific dataset or task to customize its performance for particular use cases. This process allows you to adapt Llama 3.1 to your specific domain or application, potentially improving its accuracy and relevance for your needs.

To learn more about fine-tuning Llama models, check out these resources:

## Conclusion

The Vercel AI SDK offers a powerful and flexible way to integrate cutting-edge AI models like Llama 3.1 into your applications. With AI SDK Core, you can seamlessly switch between different AI models and providers by changing just two lines of code. This flexibility allows for quick experimentation and adaptation, reducing the time required to change models from days to minutes.

The Vercel AI SDK ensures that your application remains clean and modular, accelerating development and future-proofing against the rapidly evolving landscape.

Ready to get started? Here's how you can dive in:





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core

# AI SDK Core





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/overview

# AI SDK Core

Large Language Models (LLMs) are advanced programs that can understand, create, and engage with human language on a large scale.
They are trained on vast amounts of written material to recognize patterns in language and predict what might come next in a given piece of text.

The Vercel AI SDK Core simplifies working with LLMs by offering a standardized way of integrating them into your app - so you can focus on building great AI applications for your users, not waste time on technical details.

For example, here’s how you can generate text with various models using the Vercel AI SDK:

## AI SDK Core Functions

AI SDK Core has various functions designed for text generation, structured data generation, and tool usage.
These functions take a standardized approach to setting up prompts and settings, making it easier to work with different models.

generateText: Generates text and tool calls.
This function is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

streamText: Stream text and tool calls.
You can use the streamText function for interactive use cases such as chat bots and content streaming. You can also generate UI components with tools (see Generative UI).

generateObject: Generates a typed, structured object that matches a Zod schema.
You can use this function to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.

streamObject: Stream a structured object that matches a Zod schema.
You can use this function to stream generated UIs in combination with React Server Components (see Generative UI).





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/generating-text

# Generating and Streaming Text

Large language models (LLMs) can generate text in response to a prompt, which can contain instructions and information to process.
For example, you can ask a model to come up with a recipe, draft an email, or summarize a document.

The Vercel AI SDK Core provides two functions to generate text and stream it from LLMs:

Advanced LLM features such as tool calling and structured data generation are built on top of text generation.

## generateText

You can generate text using the generateText function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

```tsx
import { generateText } from 'ai';


const { text } = await generateText({
  model: yourModel,
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

You can use more advanced prompts to generate text with more complex instructions and content:

```tsx
import { generateText } from 'ai';


const { text } = await generateText({
  model: yourModel,
  system:
    'You are a professional writer. You write simple, clear, and concise content.',
  prompt: `summarize the following article in 3-5 sentences:\n${article}`,
});
```

## streamText

Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating it's response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.

Vercel AI SDK Core provides the streamText function which simplifies streaming text from LLMs.
Its result has methods that can be used in different environments, e.g.
result.toDataStreamResponse() to create a response object that can be used
in a Next.js App Router API route.

```ts
import { streamText } from 'ai';


const result = await streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
});


// example: use textStream as an async iterable
for await (const textPart of result.textStream) {
  console.log(textPart);
}
```

You can use streamText on it's own or in combination with AI SDK
UI and AI SDK
RSC

result.textStream is also a ReadableStream, so you can use it in a browser or Node.js environment.

```ts
import { streamText } from 'ai';


const result = await streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
});


// use textStream as a ReadableStream:
const reader = result.textStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  process.stdout.write(value);
}
```

### onChunk callback

When using streamText, you can provide an onChunk callback that is triggered for each chunk of the stream.

It receives the following chunk types:

```tsx
import { streamText } from 'ai';


const result = await streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
  onChunk({ chunk }) {
    // implement your own logic here, e.g.:
    if (chunk.type === 'text-delta') {
      console.log(chunk.text);
    }
  },
});
```

### onFinish callback

When using streamText, you can provide an onFinish callback that is triggered when the model finishes generating the response and all tool executions.

```tsx
import { streamText } from 'ai';


const result = await streamText({
  model: yourModel,
  prompt: 'Invent a new holiday and describe its traditions.',
  onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
    // your own logic, e.g. for saving the chat history or recording usage
  },
});
```

### Result helper functions

The result object of streamText contains several helper functions to make the integration into AI SDK UI easier:

### Result promises

The result object of streamText contains several promises that resolve when all required data is available:

## Examples

You can see generateText and streamText in action using various frameworks in the following examples:

### generateText

### streamText





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/generating-structured-data

# Generating Structured Data

While text generation can be useful, your use case will likely call for generating structured data.
For example, you might want to extract information from text, classify data, or generate synthetic data.

Many language models are capable of generating structured data, often defined as using "JSON modes" or "tools".
However, you need to manually provide schemas and then validate the generated data as LLMs can produce incorrect or incomplete structured data.

The Vercel AI SDK standardises structured object generation across model providers
with the generateObject
and streamObject functions.
You can use both functions with different output strategies, e.g. array, object, or no-schema,
and with different generation modes, e.g. auto, tool, or json.
You can use Zod schemas or JSON schemas to specify the shape of the data that you want,
and the AI model will generate data that conforms to that structure.

## Generate Object

The generateObject generates structured data from a prompt.
The schema is also used to validate the generated data, ensuring type safety and correctness.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: yourModel,
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

## Stream Object

Given the added complexity of returning structured data, model response time can be unacceptable for your interactive use case.
With the streamObject function, you can stream the model's response as it is generated.

```ts
import { streamObject } from 'ai';


const { partialObjectStream } = await streamObject({
  // ...
});


// use partialObjectStream as an async iterable
for await (const partialObject of partialObjectStream) {
  console.log(partialObject);
}
```

You can use streamObject to stream generated UIs in combination with React Server Components (see Generative UI)) or the useObject hook.

## Output Strategy

You can use both functions with different output strategies, e.g. array, object, or no-schema.

### Output Strategy: Object

The default output strategy is object, which returns the generated data as an object.
You don't need to specify the output strategy if you want to use the default.

### Output Strategy: Array

If you want to generate an array of objects, you can set the output strategy to array.
When you use the array output strategy, the schema specifies the shape of an array element.
With streamObject, you can also stream the generated array elements using elementStream.

```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';


const { elementStream } = await streamObject({
  model: openai('gpt-4-turbo'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});


for await (const hero of elementStream) {
  console.log(hero);
}
```

### Output Strategy: No Schema

In some cases, you might not want to use a schema,
for example when the data is a dynamic user request.
You can use the output setting to set the output format to no-schema in those cases
and omit the schema parameter.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

## Generation Mode

While some models (like OpenAI) natively support object generation, others require alternative methods, like modified tool calling. The generateObject function allows you to specify the method it will use to return structured data.

Please note that not every provider supports all generation modes. Some
providers do not support object generation at all.

## Schema Name and Description

You can optionally specify a name and description for the schema. These are used by some providers for additional LLM guidance, e.g. via tool or schema name.

```ts
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: yourModel,
  schemaName: 'Recipe',
  schemaDescription: 'A recipe for a dish.',
  schema: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

## Schema Writing Tips

The mapping from Zod schemas to LLM inputs (typically JSON schema) is not always straightforward, since the mapping is not one-to-one.
Please checkout the following tips and the Prompt Engineering with Tools guide.

### Dates

Zod expects JavaScript Date objects, but models return dates as strings.
You can specify and validate the date format using z.string().datetime() or z.string().date(),
and then use a Zod transformer to convert the string to a Date object.

```ts
const result = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    events: z.array(
      z.object({
        event: z.string(),
        date: z
          .string()
          .date()
          .transform(value => new Date(value)),
      }),
    ),
  }),
  prompt: 'List 5 important events from the the year 2000.',
});
```

## Error Handling

When you use generateObject, errors are thrown when the model fails to generate proper JSON (JSONParseError)
or when the generated JSON does not match the schema (TypeValidationError).
Both error types contain additional information, e.g. the generated text or the invalid value.

You can use this to e.g. design a function that safely process the result object and also returns values in error cases:

```ts
import { openai } from '@ai-sdk/openai';
import { JSONParseError, TypeValidationError, generateObject } from 'ai';
import { z } from 'zod';


const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.object({ name: z.string(), amount: z.string() })),
    steps: z.array(z.string()),
  }),
});


type Recipe = z.infer<typeof recipeSchema>;


async function generateRecipe(
  food: string,
): Promise<
  | { type: 'success'; recipe: Recipe }
  | { type: 'parse-error'; text: string }
  | { type: 'validation-error'; value: unknown }
  | { type: 'unknown-error'; error: unknown }
> {
  try {
    const result = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: recipeSchema,
      prompt: `Generate a ${food} recipe.`,
    });


    return { type: 'success', recipe: result.object };
  } catch (error) {
    if (TypeValidationError.isTypeValidationError(error)) {
      return { type: 'validation-error', value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      return { type: 'parse-error', text: error.text };
    } else {
      return { type: 'unknown-error', error };
    }
  }
}
```

## More Examples

You can see generateObject and streamObject in action using various frameworks in the following examples:

### generateObject

### streamObject





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling

# Tool Calling

As covered under Foundations, tools are objects that can be called by the model to perform a specific task.

When used with AI SDK Core, tools contain three elements:

The tools parameter of generateText and streamText is an object that has the tool names as keys and the tools as values:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';


const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});
```

You can use the tool helper function to
infer the types of the execute parameters.

When a model uses a tool, it is called a "tool call" and the output of the
tool is called a "tool result".

Tool calling is not restricted to only text generation.
You can also use it to render user interfaces with Generative AI.

## Tool Choice

You can use the toolChoice setting to influence when a tool is selected.
It supports the following settings:

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';


const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  toolChoice: 'required', // force the model to call a tool
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});
```

## Tool Roundtrips

The large language model needs to know the tool results before it can continue generating text.
This requires sending the tool results back to the model.
You can enable this feature by setting the maxToolRoundtrips setting to a number greater than 0.

```ts
import { z } from 'zod';
import { generateText, tool } from 'ai';


const result = await generateText({
  model: yourModel,
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get the weather for'),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
  maxToolRoundtrips: 5, // allow up to 5 tool roundtrips
  prompt:
    'What is the weather in San Francisco and what attractions should I visit?',
});
```

## Pre-Built Tools

When you work with tools, you typically need a mix of application specific tools and general purpose tools.
There are several providers that offer pre-built tools that you can use out of the box:

Do you have open source tools or tool libraries that are compatible with the
Vercel AI SDK? Please file a pull
request to add them to this list.

## Prompt Engineering with Tools

When you create prompts that include tools, getting good results can be tricky as the number and complexity of your tools increases.

Here are a few tips to help you get the best results:

In general, the goal should be to give the model all information it needs in a clear way.

## Examples

You can see tools in action using various frameworks in the following examples:





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/agents

# Agents

AI agents let the language model execute several steps in a non-deterministic way.
The model can make decisions based on the context of the conversation and the user's input.

One approach to implementing agents is to allow the LLM to choose the next step in a loop.
With generateText, you can combine tools with maxToolRoundtrips.
This makes it possible to implement basic agents that reason at each step and make decisions based on the context.

### Example

This example demonstrates how to create an agent that solves math problems.
It has a calculator tool (using math.js) that it can call to evaluate mathematical expressions.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import * as mathjs from 'mathjs';
import { z } from 'zod';


const problem =
  'A taxi driver earns $9461 per 1-hour of work. ' +
  'If he works 12 hours a day and in 1 hour ' +
  'he uses 12 liters of petrol with a price  of $134 for 1 liter. ' +
  'How much money does he earn in one day?';


console.log(`PROBLEM: ${problem}`);


const { text: answer } = await generateText({
  model: openai('gpt-4-turbo'),
  system:
    'You are solving math problems. ' +
    'Reason step by step. ' +
    'Use the calculator when necessary. ' +
    'When you give the final answer, ' +
    'provide an explanation for how you arrived at it.',
  prompt: problem,
  tools: {
    calculate: tool({
      description:
        'A tool for evaluating mathematical expressions. ' +
        'Example expressions: ' +
        "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
      parameters: z.object({ expression: z.string() }),
      execute: async ({ expression }) => mathjs.evaluate(expression),
    }),
  },
  maxToolRoundtrips: 10,
});


console.log(`ANSWER: ${answer}`);
```

## Accessing information from all roundtrips

Calling generateText with maxToolRoundtrips can result in several calls to the LLM (roundtrips).
You can access information from all roundtrips by using the roundtrips property of the response.

```ts
const { roundtrips } = await generateText({
  model: openai('gpt-4-turbo'),
  maxToolRoundtrips: 10,
  // ...
});


// extract all tool calls from the roundtrips:
const allToolCalls = roundtrips.flatMap(roundtrip => roundtrip.toolCalls);
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/settings

# Settings

Large language models (LLMs) typically provide settings to augment their output.

All Vercel AI SDK functions support the following common settings in addition to the model, the prompt, and additional provider-specific settings:

```ts
const result = await generateText({
  model: yourModel,
  maxTokens: 512,
  temperature: 0.3,
  maxRetries: 5,
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

Some providers do not support all common settings. If you use a setting with a
provider that does not support it, a warning will be generated. You can check
the warnings property in the result object to see if any warnings were
generated.

### maxTokens

Maximum number of tokens to generate.

### temperature

Temperature setting.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, 0 means almost deterministic results, and higher values mean more randomness.

It is recommended to set either temperature or topP, but not both.

### topP

Nucleus sampling.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, nucleus sampling is a number between 0 and 1.
E.g. 0.1 would mean that only tokens with the top 10% probability mass are considered.

It is recommended to set either temperature or topP, but not both.

### topK

Only sample from the top K options for each subsequent token.

Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use temperature.

### presencePenalty

The presence penalty affects the likelihood of the model to repeat information that is already in the prompt.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, 0 means no penalty.

### frequencyPenalty

The frequency penalty affects the likelihood of the model to repeatedly use the same words or phrases.

The value is passed through to the provider. The range depends on the provider and model.
For most providers, 0 means no penalty.

### stopSequences

The stop sequences to use for stopping the text generation.

If set, the model will stop generating text when one of the stop sequences is generated.
Providers may have limits on the number of stop sequences.

### seed

It is the seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

### maxRetries

Maximum number of retries. Set to 0 to disable retries. Default: 2.

### abortSignal

An optional abort signal that can be used to cancel the call.

### headers

Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

You can use the request headers to provide additional information to the provider,
depending on what the provider supports. For example, some observability providers support
headers such as Prompt-Id.

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';


const result = await generateText({
  model: openai('gpt-3.5-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
  headers: {
    'Prompt-Id': 'my-prompt-id',
  },
});
```

The headers setting is for request-specific headers. You can also set
headers in the provider configuration. These headers will be sent with every
request made by the provider.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/embeddings

# Embeddings

Embeddings are a way to represent words, phrases, or images as vectors in a high-dimensional space.
In this space, similar words are close to each other, and the distance between words can be used to measure their similarity.

## Embedding a Single Value

The Vercel AI SDK provides the embed function to embed single values, which is useful for tasks such as finding similar words
or phrases or clustering text.
You can use it with embeddings models, e.g. openai.embedding('text-embedding-3-large') or mistral.embedding('mistral-embed').

```tsx
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';


// 'embedding' is a single embedding object (number[])
const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

## Embedding Many Values

When loading data, e.g. when preparing a data store for retrieval-augmented generation (RAG),
it is often useful to embed many values at once (batch embedding).

The Vercel AI SDK provides the embedMany function for this purpose.
Similar to embed, you can use it with embeddings models,
e.g. openai.embedding('text-embedding-3-large') or mistral.embedding('mistral-embed').

```tsx
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';


// 'embeddings' is an array of embedding objects (number[][]).
// It is sorted in the same order as the input values.
const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```

## Embedding Similarity

After embedding values, you can calculate the similarity between them using the cosineSimilarity function.
This is useful to e.g. find similar words or phrases in a dataset.
You can also rank and filter related items based on their similarity.

```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';


const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});


console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```

## Token Usage

Many providers charge based on the number of tokens used to generate embeddings.
Both embed and embedMany provide token usage information in the usage property of the result object:

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding, usage } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});


console.log(usage); // { tokens: 10 }
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/provider-management

# Provider Management

When you work with multiple providers and models, it is often desirable to manage them in a central place
and access the models through simple string ids.

The Vercel AI SDK provides a ProviderRegistry for this purpose.
You can register multiple providers. The provider id will become the prefix of the model id:
providerId:modelId.

## Provider Registry

### Setup

You can create a registry with multiple providers and models using experimental_createProviderRegistry.

It is common to keep the registry setup in a separate file and import it where
needed.

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';


export const registry = createProviderRegistry({
  // register provider with prefix and default setup:
  anthropic,


  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});
```

### Language models

You can access language models by using the languageModel method on the registry.
The provider id will become the prefix of the model id: providerId:modelId.

```ts
import { generateText } from 'ai';
import { registry } from './registry';


const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

### Text embedding models

You can access text embedding models by using the textEmbeddingModel method on the registry.
The provider id will become the prefix of the model id: providerId:modelId.

```ts
import { embed } from 'ai';
import { registry } from './registry';


const { embedding } = await embed({
  model: registry.textEmbeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```

## Model Maps

An alternative approach to the provider registry is to just create an object that maps ids
to models. This has the following advantages:

However, it is more verbose and you need to specify each model individually.

### Examples

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const myModels = {
  'structuring-model': openai('gpt-4o-2024-08-06', {
    structuredOutputs: true,
  }),
  'smart-model': anthropic('claude-3-5-sonnet-20240620'),
} as const;


const result = await streamText({
  model: myModels['structuring-model'],
  prompt: 'Invent a new holiday and describe its traditions.',
});
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/error-handling

# Error Handling

## Handling regular errors

Regular errors are thrown and can be handled using the try/catch block.

```ts
import { generateText } from 'ai';


try {
  const { text } = await generateText({
    model: yourModel,
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });
} catch (error) {
  // handle error
}
```

## Handling streaming errors (simple streams)

When errors occur during streams that do not support error chunks,
the error is thrown as a regular error.
You can handle these errors using the try/catch block.

```ts
import { generateText } from 'ai';


try {
  const { textStream } = await streamText({
    model: yourModel,
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });


  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
} catch (error) {
  // handle error
}
```

## Handling streaming errors (streaming with error support)

Full streams support error parts.
You can handle those parts similar to other parts.
It is recommended to also add a try-catch block for errors that
happen outside of the streaming.

```ts
import { generateText } from 'ai';


try {
  const { fullStream } = await streamText({
    model: yourModel,
    prompt: 'Write a vegetarian lasagna recipe for 4 people.',
  });


  for await (const part of fullStream) {
    switch (part.type) {
      // ... handle other part types


      case 'error': {
        const error = part.error;
        // handle error
        break;
      }
    }
  }
} catch (error) {
  // handle error
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-core/telemetry

# Telemetry

The Vercel AI SDK uses OpenTelemetry to collect telemetry data.
OpenTelemetry is an open-source observability framework designed to provide
standardized instrumentation for collecting telemetry data.

This feature is experimental and may change in the future. The following AI
SDK functions support telemetry: generateText, streamText,
generateObject, streamObject, embed, and embedMany.

## Enabling telemetry

For Next.js applications, please follow the Next.js OpenTelemetry guide to enable telemetry first.

You can then use the experimental_telemetry option to enable telemetry on specific function calls while the feature is experimental:

```ts
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: { isEnabled: true },
});
```

When telemetry is enabled, you can also control if you want to record the input values and the output values for the function.
By default, both are enabled. You can disable them by setting the recordInputs and recordOutputs options to false.

Disabling the recording of inputs and outputs can be useful for privacy, data transfer, and performance reasons.
You might for example want to disable recording inputs if they contain sensitive information.

## Telemetry Metadata

You can provide a functionId to identify the function that the telemetry data is for,
and metadata to include additional information in the telemetry data.

```ts
const result = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Write a short story about a cat.',
  experimental_telemetry: {
    isEnabled: true,
    functionId: 'my-awesome-function',
    metadata: {
      something: 'custom',
      someOtherThing: 'other-value',
    },
  },
});
```

## Collected Data

### generateText function

generateText records 3 types of spans:

### streamText function

streamText records 3 types of spans:

It also records a ai.stream.firstChunk event when the first chunk of the stream is received.

### generateObject function

generateObject records 2 types of spans:

### streamObject function

streamObject records 2 types of spans:

### embed function

embed records 2 types of spans:

### embedMany function

embedMany records 2 types of spans:

## Span Details

### Basic LLM span information

Many spans that use LLMs (ai.generateText, ai.generateText.doGenerate, ai.streamText, ai.streamText.doStream,
ai.generateObject, ai.generateObject.doGenerate, ai.streamObject, ai.streamObject.doStream) contain the following attributes:

### Basic embedding span information

Many spans that use embedding models (ai.embed, ai.embed.doEmbed, ai.embedMany, ai.embedMany.doEmbed) contain the following attributes:

### Tool call spans

Tool call spans (ai.toolCall) contain the following attributes:





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc

# AI SDK RSC





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/overview

# AI SDK RSC

The ai/rsc package is compatible with frameworks that support React Server
Components.

React Server Components (RSC) allow you to write UI that can be rendered on the server and streamed to the client. RSCs enable  Server Actions , a new way to call server-side code directly from the client just like any other function with end-to-end type-safety. This combination opens the door to a new way of building AI applications, allowing the large language model (LLM) to generate and stream UI directly from the server to the client.

## AI SDK RSC Functions

AI SDK RSC has various functions designed to help you build AI-native applications with React Server Components. These functions:

## Templates

Check out the following templates to see AI SDK RSC in action.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-react-components

# Streaming React Components

The RSC API allows you to stream React components from the server to the client with the streamUI function. This is useful when you want to go beyond raw text and stream components to the client in real-time.

Similar to  AI SDK Core  APIs (like  streamText  and  streamObject , streamUI provides a single function to call a model and allow it to respond with React Server Components.
It supports the same model interfaces as AI SDK Core APIs.

### Concepts

To give the model the ability to respond to a user's prompt with a React component, you can leverage tools.

Remember, tools are like programs you can give to the model, and the model can
decide as and when to use based on the context of the conversation.

With the streamUI function, you provide tools that return React components. With the ability to stream components, the model is akin to a dynamic router that is able to understand the user's intention and display relevant UI.

At a high level, the streamUI works like other AI SDK Core functions: you can provide the model with a prompt or some conversation history and, optionally, some tools. If the model decides, based on the context of the conversation, to call a tool, it will generate a tool call. The streamUI function will then run the respective tool, returning a React component. If the model doesn't have a relevant tool to use, it will return a text generation, which will be passed to the text function, for you to handle (render and return as a React component).

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {},
});
```

This example calls the streamUI function using OpenAI's gpt-4o model, passes a prompt, specifies how the model's plain text response (content) should be rendered, and then provides an empty object for tools. Even though this example does not define any tools, it will stream the model's response as a div rather than plain text.

### Adding A Tool

Using tools with streamUI is similar to how you use tools with generateText and streamText.
A tool is an object that has:

Let's expand the previous example to add a tool.

```tsx
const result = await streamUI({
  model: openai('gpt-4o'),
  prompt: 'Get the weather for San Francisco',
  text: ({ content }) => <div>{content}</div>,
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({ location: z.string() }),
      generate: async function* ({ location }) {
        yield <LoadingComponent />;
        const weather = await getWeather(location);
        return <WeatherComponent weather={weather} location={location} />;
      },
    },
  },
});
```

This tool would be run if the user asks for the weather for their location. If the user hasn't specified a location, the model will ask for it before calling the tool. When the model calls the tool, the generate function will initially return a loading component. This component will show until the awaited call to getWeather is resolved, at which point, the model will stream the <WeatherComponent /> to the user.

Note: This example uses a  generator function

(function*), which allows you to pause its execution and return a value,
then resume from where it left off on the next call. This is useful for
handling data streams, as you can fetch and return data from an asynchronous
source like an API, then resume the function to fetch the next chunk when
needed. By yielding values one at a time, generator functions enable efficient
processing of streaming data without blocking the main thread.

## Using streamUI with Next.js

Let's see how you can use the example above in a Next.js application.

To use streamUI in a Next.js application, you will need two things:

### Step 1: Create a Server Action

Server Actions are server-side functions that you can call directly from the
frontend. For more info, see the
documentation.

Create a Server Action at app/actions.tsx and add the following code:

```tsx
'use server';


import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);


const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};


interface WeatherProps {
  location: string;
  weather: string;
}


const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);


export async function streamComponent() {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return <WeatherComponent weather={weather} location={location} />;
        },
      },
    },
  });


  return result.value;
}
```

The getWeather tool should look familiar as it is identical to the example in the previous section. In order for this tool to work:

Your Server Action is an asynchronous function called streamComponent that takes no inputs, and returns a ReactNode. Within the action, you call the streamUI function, specifying the model (gpt-4o), the prompt, the component that should be rendered if the model chooses to return text, and finally, your getWeather tool. Last but not least, you return the resulting component generated by the model with result.value.

To call this Server Action and display the resulting React Component, you will need a page.

### Step 2: Create a Page

Create or update your root page (app/page.tsx) with the following code:

```tsx
'use client';


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { streamComponent } from './actions';


export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();


  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```

This page is first marked as a client component with the "use client"; directive given it will be using hooks and interactivity. On the page, you render a form. When that form is submitted, you call the streamComponent action created in the previous step (just like any other function). The streamComponent action returns a ReactNode that you can then render on the page using React state (setComponent).

## Going beyond a single prompt

You can now allow the model to respond to your prompt with a React component. However, this example is limited to a static prompt that is set within your Server Action. You could make this example interactive by turning it into a chatbot.

Learn how to stream React components with the Next.js App Router using streamUI with this example.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/generative-ui-state

# Managing Generative UI State

State is an essential part of any application. State is particularly important in AI applications as it is passed to large language models (LLMs) on each request to ensure they have the necessary context to produce a great generation. Traditional chatbots are text-based and have a structure that mirrors that of any chat application.

For example, in a chatbot, state is an array of messages where each message has:

This state can be rendered in the UI and sent to the model without any modifications.

With Generative UI, the model can now return a React component, rather than a plain text message. The client can render that component without issue, but that state can't be sent back to the model because React components aren't serialisable. So, what can you do?

The solution is to split the state in two, where one (AI State) becomes a proxy for the other (UI State).

One way to understand this concept is through a Lego analogy. Imagine a 10,000 piece Lego model that, once built, cannot be easily transported because it is fragile. By taking the model apart, it can be easily transported, and then rebuilt following the steps outlined in the instructions pamphlet. In this way, the instructions pamphlet is a proxy to the physical structure. Similarly, AI State provides a serialisable (JSON) representation of your UI that can be passed back and forth to the model.

## What is AI and UI State?

The RSC API simplifies how you manage AI State and UI State, providing a robust way to keep them in sync between your database, server and client.

### AI State

AI State refers to the state of your application in a serialisable format that will be used on the server and can be shared with the language model.

For a chat app, the AI State is the conversation history (messages) between the user and the assistant. Components generated by the model would be represented in a JSON format as a tool alongside any necessary props. AI State can also be used to store other values and meta information such as createdAt for each message and chatId for each conversation. The LLM reads this history so it can generate the next message. This state serves as the source of truth for the current application state.

Note: AI state can be accessed/modified from both the server and the
client.

### UI State

UI State refers to the state of your application that is rendered on the client. It is a fully client-side state (similar to useState) that can store anything from Javascript values to React elements. UI state is a list of actual UI elements that are rendered on the client.

## Using AI / UI State

### Creating the AI Context

AI SDK RSC simplifies managing AI and UI state across your application by providing several hooks. These hooks are powered by  React context  under the hood.

Notably, this means you do not have to pass the message history to the server explicitly for each request. You also can access and update your application state in any child component of the context provider. As you begin building multistep generative interfaces, this will be particularly helpful.

To use ai/rsc to manage AI and UI State in your application, you can create a React context using createAI:

```tsx
// Define the AI state and UI state types
export type ServerMessage = {
  role: 'user' | 'assistant';
  content: string;
};


export type ClientMessage = {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
};


export const sendMessage = async (input: string): Promise<ClientMessage> => {
  "use server"
  ...
}


export type AIState = ServerMessage[];
export type UIState = ClientMessage[];


// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
  },
});
```

In this example, you define types for AI State and UI State, respectively.

Next, wrap your application with your newly created context. With that, you can get and set AI and UI State across your entire application.

```tsx
import { type ReactNode } from 'react';
import { AI } from './actions';


export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

## Reading UI State in Client

The UI state can be accessed in Client Components using the useUIState hook provided by the RSC API. The hook returns the current UI state and a function to update the UI state like React's useState.

```tsx
'use client';


import { useUIState } from 'ai/rsc';


export default function Page() {
  const [messages, setMessages] = useUIState();


  return (
    <ul>
      {messages.map(message => (
        <li key={message.id}>{message.display}</li>
      ))}
    </ul>
  );
}
```

## Reading AI State in Client

The AI state can be accessed in Client Components using the useAIState hook provided by the RSC API. The hook returns the current AI state.

```tsx
'use client';


import { useAIState } from 'ai/rsc';


export default function Page() {
  const [messages, setMessages] = useAIState();


  return (
    <ul>
      {messages.map(message => (
        <li key={message.id}>{message.content}</li>
      ))}
    </ul>
  );
}
```

## Reading AI State on Server

The AI State can be accessed within any Server Action provided to the createAI context using the getAIState function. It returns the current AI state as a read-only value:

```tsx
import { getAIState } from 'ai/rsc';


export async function sendMessage(message: string) {
  'use server';


  const history = getAIState();


  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: [...history, { role: 'user', content: message }],
  });


  return response;
}
```

Remember, you can only access state within actions that have been passed to
the createAI context within the actions key.

## Updating AI State on Server

The AI State can also be updated from within your Server Action with the getMutableAIState function. This function is similar to getAIState, but it returns the state with methods to read and update it:

```tsx
import { getMutableAIState } from 'ai/rsc';


export async function sendMessage(message: string) {
  'use server';


  const history = getMutableAIState();


  // Update the AI state with the new user message.
  history.update([...history.get(), { role: 'user', content: message }]);


  const response = await generateText({
    model: openai('gpt-3.5-turbo'),
    messages: history.get(),
  });


  // Update the AI state again with the response from the model.
  history.done([...history.get(), { role: 'assistant', content: response }]);


  return response;
}
```

It is important to update the AI State with new responses using .update()
and .done() to keep the conversation history in sync.

## Calling Server Actions from the Client

To call the sendMessage action from the client, you can use the useActions hook. The hook returns all the available Actions that were provided to createAI:

```tsx
'use client';


import { useActions, useUIState } from 'ai/rsc';
import { AI } from './actions';


export default function Page() {
  const { sendMessage } = useActions<typeof AI>();
  const [messages, setMessages] = useUIState();


  const handleSubmit = async event => {
    event.preventDefault();


    setMessages([
      ...messages,
      { id: Date.now(), role: 'user', display: event.target.message.value },
    ]);


    const response = await sendMessage(event.target.message.value);


    setMessages([
      ...messages,
      { id: Date.now(), role: 'assistant', display: response },
    ]);
  };


  return (
    <>
      <ul>
        {messages.map(message => (
          <li key={message.id}>{message.display}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </>
  );
}
```

When the user submits a message, the sendMessage action is called with the message content. The response from the action is then added to the UI state, updating the displayed messages.

Important! Don't forget to update the UI State after you call your Server
Action otherwise the streamed component will not show in the UI.

To learn more, check out this example on managing AI and UI state using ai/rsc.

Next, you will learn how you can save and restore state with ai/rsc.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/saving-and-restoring-states

# Saving and Restoring States

AI SDK RSC provides convenient methods for saving and restoring AI and UI state. This is useful for saving the state of your application after every model generation, and restoring it when the user revisits the generations.

## AI State

### Saving AI state

The AI state can be saved using the onSetAIState callback, which gets called whenever the AI state is updated. In the following example, you save the chat history to a database whenever the generation is marked as done.

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onSetAIState: async ({ state, done }) => {
    'use server';


    if (done) {
      saveChatToDB(state);
    }
  },
});
```

### Restoring AI state

The AI state can be restored using the initialAIState prop passed to the context provider created by the createAI function. In the following example, you restore the chat history from a database when the component is mounted.

```tsx
import { ReactNode } from 'react';
import { AI } from './actions';


export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const chat = await loadChatFromDB();


  return (
    <html lang="en">
      <body>
        <AI initialAIState={chat}>{children}</AI>
      </body>
    </html>
  );
}
```

## UI State

### Saving UI state

The UI state cannot be saved directly, since the contents aren't yet serializable. Instead, you can use the AI state as proxy to store details about the UI state and use it to restore the UI state when needed.

### Restoring UI state

The UI state can be restored using the AI state as a proxy. In the following example, you restore the chat history from the AI state when the component is mounted. You use the onGetUIState callback to listen for SSR events and restore the UI state.

```tsx
export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  onGetUIState: async () => {
    'use server';


    const historyFromDB: ServerMessage[] = await loadChatFromDB();
    const historyFromApp: ServerMessage[] = getAIState();


    // If the history from the database is different from the
    // history in the app, they're not in sync so return the UIState
    // based on the history from the database


    if (historyFromDB.length !== historyFromApp.length) {
      return historyFromDB.map(({ role, content }) => ({
        id: generateId(),
        role,
        display:
          role === 'function' ? (
            <Component {...JSON.parse(content)} />
          ) : (
            content
          ),
      }));
    }
  },
});
```

To learn more, check out this example that persists and restores states in your Next.js application.

Next, you will learn how you can use ai/rsc functions like useActions and useUIState to create interactive, multistep interfaces.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/multistep-interfaces

# Designing Multistep Interfaces

Multistep interfaces refer to user interfaces that require multiple independent steps to be executed in order to complete a specific task.

For example, if you wanted to build a Generative UI chatbot capable of booking flights, it could have three steps:

To build this kind of application you will leverage two concepts, tool composition and application context.

Tool composition is the process of combining multiple tools to create a new tool. This is a powerful concept that allows you to break down complex tasks into smaller, more manageable steps. In the example above, "search all flights", "pick flight", and "check availability" come together to create a holistic "book flight" tool.

Application context refers to the state of the application at any given point in time. This includes the user's input, the output of the language model, and any other relevant information. In the example above, the flight selected in "pick flight" would be used as context necessary to complete the "check availability" task.

## Overview

In order to build a multistep interface with ai/rsc, you will need a few things:

The general flow that you will follow is:

## Implementation

The turn-by-turn implementation is the simplest form of multistep interfaces. In this implementation, the user and the model take turns during the conversation. For every user input, the model generates a response, and the conversation continues in this turn-by-turn fashion.

In the following example, you specify two tools (searchFlights and lookupFlight) that the model can use to search for flights and lookup details for a specific flight.

```tsx
import { createAI, streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';


const searchFlights = async (
  source: string,
  destination: string,
  date: string,
) => {
  return [
    {
      id: '1',
      flightNumber: 'AA123',
    },
    {
      id: '2',
      flightNumber: 'AA456',
    },
  ];
};


const lookupFlight = async (flightNumber: string) => {
  return {
    flightNumber: flightNumber,
    departureTime: '10:00 AM',
    arrivalTime: '12:00 PM',
  };
};


export async function submitUserMessage(input: string) {
  'use server';


  const ui = await streamUI({
    model: openai('gpt-4o'),
    system: 'you are a flight booking assistant',
    prompt: input,
    text: async ({ content }) => <div>{content}</div>,
    tools: {
      searchFlights: {
        description: 'search for flights',
        parameters: z.object({
          source: z.string().describe('The origin of the flight'),
          destination: z.string().describe('The destination of the flight'),
          date: z.string().describe('The date of the flight'),
        }),
        generate: async function* ({ source, destination, date }) {
          yield `Searching for flights from ${source} to ${destination} on ${date}...`;
          const results = await searchFlights(source, destination, date);


          return (
            <div>
              {results.map(result => (
                <div key={result.id}>
                  <div>{result.flightNumber}</div>
                </div>
              ))}
            </div>
          );
        },
      },
      lookupFlight: {
        description: 'lookup details for a flight',
        parameters: z.object({
          flightNumber: z.string().describe('The flight number'),
        }),
        generate: async function* ({ flightNumber }) {
          yield `Looking up details for flight ${flightNumber}...`;
          const details = await lookupFlight(flightNumber);


          return (
            <div>
              <div>Flight Number: {details.flightNumber}</div>
              <div>Departure Time: {details.departureTime}</div>
              <div>Arrival Time: {details.arrivalTime}</div>
            </div>
          );
        },
      },
    },
  });


  return ui.value;
}


export const AI = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});
```

Next, wrap your application with your newly created context.

```tsx
import { type ReactNode } from 'react';
import { AI } from './actions';


export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AI>
  );
}
```

To call your Server Action, update your root page with the following:

```tsx
'use client';


import { useState } from 'react';
import { AI } from './actions';
import { useActions, useUIState } from 'ai/rsc';


export default function Page() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div>{input}</div>,
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [...currentConversation, message]);
  };


  return (
    <div>
      <div>
        {conversation.map((message, i) => (
          <div key={i}>{message}</div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button>Send Message</button>
        </form>
      </div>
    </div>
  );
}
```

This page pulls in the current UI State using the useUIState hook, which is then mapped over and rendered in the UI. To access the Server Action, you use the useActions hook which will return all actions that were passed to the actions key of the createAI function in your actions.tsx file. Finally, you call the submitUserMessage function like any other TypeScript function. This function returns a React component (message) that is then rendered in the UI by updating the UI State with setConversation.

In this example, to call the next tool, the user must respond with plain text. Given you are streaming a React component, you can add a button to trigger the next step in the conversation.

To add user interaction, you will have to convert the component into a client component and use the useAction hook to trigger the next step in the conversation.

```tsx
'use client';


import { useActions, useUIState } from 'ai/rsc';
import { ReactNode } from 'react';


interface FlightsProps {
  flights: { id: string; flightNumber: string }[];
}


export const Flights = ({ flights }: FlightsProps) => {
  const { submitUserMessage } = useActions();
  const [_, setMessages] = useUIState();


  return (
    <div>
      {flights.map(result => (
        <div key={result.id}>
          <div
            onClick={async () => {
              const display = await submitUserMessage(
                `lookupFlight ${result.flightNumber}`,
              );


              setMessages((messages: ReactNode[]) => [...messages, display]);
            }}
          >
            {result.flightNumber}
          </div>
        </div>
      ))}
    </div>
  );
};
```

Now, update your searchFlights tool to render the new <Flights /> component.

```tsx
...
searchFlights: {
  description: 'search for flights',
  parameters: z.object({
    source: z.string().describe('The origin of the flight'),
    destination: z.string().describe('The destination of the flight'),
    date: z.string().describe('The date of the flight'),
  }),
  generate: async function* ({ source, destination, date }) {
    yield `Searching for flights from ${source} to ${destination} on ${date}...`;
    const results = await searchFlights(source, destination, date);
    return (<Flights flights={results} />);
  },
}
...
```

In the above example, the Flights component is used to display the search results. When the user clicks on a flight number, the lookupFlight tool is called with the flight number as a parameter. The submitUserMessage action is then called to trigger the next step in the conversation.

Learn more about tool calling in Next.js App Router by checking out examples here.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/streaming-values

# Streaming Values

The RSC API provides several utility functions to allow you to stream values from the server to the client. This is useful when you need more granular control over what you are streaming and how you are streaming it.

These utilities can also be paired with AI SDK Core
functions like streamText and
streamObject to easily stream
LLM generations from the server to the client.

There are two functions provided by the RSC API that allow you to create streamable values:

## createStreamableValue

The RSC API allows you to stream serializable Javascript values from the server to the client using createStreamableValue, such as strings, numbers, objects, and arrays.

This is useful when you want to stream:

## Creating a Streamable Value

You can import createStreamableValue from ai/rsc and use it to create a streamable value.

```tsx
'use server';


import { createStreamableValue } from 'ai/rsc';


export const runThread = async () => {
  const streamableStatus = createStreamableValue('thread.init');


  setTimeout(() => {
    streamableStatus.update('thread.run.create');
    streamableStatus.update('thread.run.update');
    streamableStatus.update('thread.run.end');
    streamableStatus.done('thread.end');
  }, 1000);


  return {
    status: streamableStatus.value,
  };
};
```

## Reading a Streamable Value

You can read streamable values on the client using readStreamableValue. It returns an async iterator that yields the value of the streamable as it is updated:

```tsx
import { readStreamableValue } from 'ai/rsc';
import { runThread } from '@/actions';


export default function Page() {
  return (
    <button
      onClick={async () => {
        const { status } = await runThread();


        for await (const value of readStreamableValue(status)) {
          console.log(value);
        }
      }}
    >
      Ask
    </button>
  );
}
```

Learn how to stream a text generation (with streamText) using the Next.js App Router and createStreamableValue in this example.

## createStreamableUI

createStreamableUI creates a stream that holds a React component. Unlike AI SDK Core APIs, this function does not call a large language model. Instead, it provides a primitive that can be used to have granular control over streaming a React component.

## Using createStreamableUI

Let's look at how you can use the createStreamableUI function with a Server Action.

```tsx
'use server';


import { createStreamableUI } from 'ai/rsc';


export async function getWeather() {
  const weatherUI = createStreamableUI();


  weatherUI.update(<div style={{ color: 'gray' }}>Loading...</div>);


  setTimeout(() => {
    weatherUI.done(<div>It's a sunny day!</div>);
  }, 1000);


  return weatherUI.value;
}
```

First, you create a streamable UI with an empty state and then update it with a loading message. After 1 second, you mark the stream as done passing in the actual weather information as it's final value. The .value property contains the actual UI that can be sent to the client.

## Reading a Streamable UI

On the client side, you can call the getWeather Server Action and render the returned UI like any other React component.

```tsx
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { getWeather } from '@/actions';


export default function Page() {
  const [weather, setWeather] = useState(null);


  return (
    <div>
      <button
        onClick={async () => {
          const weatherUI = await getWeather();
          setWeather(weatherUI);
        }}
      >
        What's the weather?
      </button>


      {weather}
    </div>
  );
}
```

When the button is clicked, the getWeather function is called, and the returned UI is set to the weather state and rendered on the page. Users will see the loading message first and then the actual weather information after 1 second.

Learn more about handling multiple streams in a single request in the Multiple Streamables guide.

Learn more about handling state for more complex use cases with  AI/UI State .





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/loading-state

# Handling Loading State

Given that responses from language models can often take a while to complete, it's crucial to be able to show loading state to users. This provides visual feedback that the system is working on their request and helps maintain a positive user experience.

There are three approaches you can take to handle loading state with the AI SDK RSC:

## Handling Loading State on the Client

### Client

Let's create a simple Next.js page that will call the generateResponse function when the form is submitted. The function will take in the user's prompt (input) and then generate a response (response). To handle the loading state, use the loading state variable. When the form is submitted, set loading to true, and when the response is received, set it back to false. While the response is being streamed, the input field will be disabled.

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const response = await generateResponse(input);


          let textContent = '';


          for await (const delta of readStreamableValue(response)) {
            textContent = `${textContent}${delta}`;
            setGeneration(textContent);
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

### Server

Now let's implement the generateResponse function. Use the streamText function to generate a response to the input.

```typescript
'use server';


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';


export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();


  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-4o'),
      prompt,
    });


    for await (const text of textStream) {
      stream.update(text);
    }


    stream.done();
  })();


  return stream.value;
}
```

## Streaming Loading State from the Server

If you are looking to track loading state on a more granular level, you can create a new streamable value to store a custom variable and then read this on the frontend. Let's update the example to create a new streamable value for tracking loading state:

### Server

```typescript
'use server';


import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';


export async function generateResponse(prompt: string) {
  const stream = createStreamableValue();
  const loadingState = createStreamableValue({ loading: true });


  (async () => {
    const { textStream } = await streamText({
      model: openai('gpt-4o'),
      prompt,
    });


    for await (const text of textStream) {
      stream.update(text);
    }


    stream.done();
    loadingState.done({ loading: false });
  })();


  return { response: stream.value, loadingState: loadingState.value };
}
```

### Client

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
          const { response, loadingState } = await generateResponse(input);


          let textContent = '';


          for await (const responseDelta of readStreamableValue(response)) {
            textContent = `${textContent}${responseDelta}`;
            setGeneration(textContent);
          }
          for await (const loadingDelta of readStreamableValue(loadingState)) {
            if (loadingDelta) {
              setLoading(loadingDelta.loading);
            }
          }
          setInput('');
          setLoading(false);
        }}
      >
        <input
          type="text"
          value={input}
          disabled={loading}
          className="disabled:opacity-50"
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```

This allows you to provide more detailed feedback about the generation process to your users.

## Streaming Loading Components with streamUI

If you are using the  streamUI  function, you can stream the loading state to the client in the form of a React component. streamUI supports the usage of  JavaScript generator functions , which allow you to yield some value (in this case a React component) while some other blocking work completes.

## Server

```ts
'use server';


import { openai } from '@ai-sdk/openai';
import { streamUI } from 'ai/rsc';


export async function generateResponse(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt,
    text: async function* ({ content }) {
      yield <div>loading...</div>;
      return <div>{content}</div>;
    },
  });


  return result.value;
}
```

Remember to update the file from .ts to .tsx because you are defining a
React component in the streamUI function.

## Client

```tsx
'use client';


import { useState } from 'react';
import { generateResponse } from './actions';
import { readStreamableValue } from 'ai/rsc';


// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const maxDuration = 30;


export default function Home() {
  const [input, setInput] = useState<string>('');
  const [generation, setGeneration] = useState<React.ReactNode>();


  return (
    <div>
      <div>{generation}</div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          const result = await generateResponse(input);
          setGeneration(result);
          setInput('');
        }}
      >
        <input
          type="text"
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/error-handling

# Error Handling

Two categories of errors can occur when working with the RSC API: errors while streaming user interfaces and errors while streaming other values.

## Handling UI Errors

To handle errors while generating UI, the streamableUI object exposes an error() method.

```tsx
'use server';


import { createStreamableUI } from 'ai/rsc';


export async function getStreamedUI() {
  const ui = createStreamableUI();


  (async () => {
    ui.update(<div>loading</div>);
    const data = await fetchData();
    ui.done(<div>{data}</div>);
  })().catch(e => {
    ui.error(<div>Error: {e.message}</div>);
  });


  return ui.value;
}
```

With this method, you can catch any error with the stream, and return relevant UI. On the client, you can also use a React Error Boundary to wrap the streamed component and catch any additional errors.

```tsx
import { getStreamedUI } from '@/actions';
import { useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';


export default function Page() {
  const [streamedUI, setStreamedUI] = useState(null);


  return (
    <div>
      <button
        onClick={async () => {
          const newUI = await getStreamedUI();
          setStreamedUI(newUI);
        }}
      >
        What does the new UI look like?
      </button>
      <ErrorBoundary>{streamedUI}</ErrorBoundary>
    </div>
  );
}
```

## Handling Other Errors

To handle other errors while streaming, you can return an error object that the reciever can use to determine why the failure occurred.

```tsx
'use server';


import { createStreamableValue } from 'ai/rsc';
import { fetchData, emptyData } from '../utils/data';


export const getStreamedData = async () => {
  const streamableData = createStreamableValue<string>(emptyData);


  try {
    (() => {
      const data1 = await fetchData();
      streamableData.update(data1);


      const data2 = await fetchData();
      streamableData.update(data2);


      const data3 = await fetchData();
      streamableData.done(data3);
    })();


    return { data: streamableData.value };
  } catch (e) {
    return { error: e.message };
  }
};
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-rsc/authentication

# Authentication

The RSC API makes extensive use of Server Actions to power streaming values and UI from the server.

Server Actions are exposed as public, unprotected endpoints. As a result, you should treat Server Actions as you would public-facing API endpoints and ensure that the user is authorized to perform the action before returning any data.

```tsx
'use server';


import { cookies } from 'next/headers';
import { createStremableUI } from 'ai/rsc';
import { validateToken } from '../utils/auth';


export const getWeather = async () => {
  const token = cookies().get('token');


  if (!token || !validateToken(token)) {
    return {
      error: 'This action requires authentication',
    };
  }
  const streamableDisplay = createStreamableUI(null);


  streamableDisplay.update(<Skeleton />);
  streamableDisplay.done(<Weather />);


  return {
    display: streamableDisplay.value,
  };
};
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui

# AI SDK UI





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/overview

# Vercel AI SDK UI

Vercel AI SDK UI is designed to help you build interactive chat, completion, and assistant applications with ease. It is a framework-agnostic toolkit, streamlining the integration of advanced AI functionalities into your applications.

Vercel AI SDK UI provides robust abstractions that simplify the complex tasks of managing chat streams and UI updates on the frontend, enabling you to develop dynamic AI-driven interfaces more efficiently. With four main hooks — useChat, useCompletion, useObject, and useAssistant — you can incorporate real-time chat capabilities, text completions, streamed JSON, and interactive assistant features into your app.

These hooks are designed to reduce the complexity and time required to implement AI interactions, letting you focus on creating exceptional user experiences.

## UI Framework Support

AI SDK UI supports the following frameworks: React, Svelte, Vue.js, and SolidJS.
Here is a comparison of the supported functions across these frameworks:

Contributions are
welcome to implement missing features for non-React frameworks.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot

# Chatbot

The useChat hook makes it effortless to create a conversational user interface for your chatbot application. It enables the streaming of chat messages from your AI provider, manages the chat state, and updates the UI automatically as new messages arrive.

To summarize, the useChat hook provides the following features:

In this guide, you will learn how to use the useChat hook to create a chatbot application with real-time message streaming. Let's start with the following example first.

## Example

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Page() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    keepLastMessageOnError: true,
  });


  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input name="prompt" value={input} onChange={handleInputChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

```ts
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: 'You are a helpful assistant.',
    messages: convertToCoreMessages(messages),
  });


  return result.toDataStreamResponse();
}
```

In the Page component, the useChat hook will request to your AI provider endpoint whenever the user submits a message.
The messages are then streamed back in real-time and displayed in the chat UI.

This enables a seamless chat experience where the user can see the AI response as soon as it is available,
without having to wait for the entire response to be received.

useChat has a keepLastMessageOnError option that defaults to false. This
option can be enabled to keep the last message on error. We will make this the
default behavior in the next major release. Please enable it and update your
error handling/resubmit behavior.

## Customized UI

useChat also provides ways to manage the chat message and input states via code, show loading and error states, and update messages without being triggered by user interactions.

### Loading State

The isLoading state returned by the useChat hook can be used for several
purposes

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, stop } =
    useChat({
      keepLastMessageOnError: true,
    });


  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.content}
        </div>
      ))}


      {isLoading && (
        <div>
          <Spinner />
          <button type="button" onClick={() => stop()}>
            Stop
          </button>
        </div>
      )}


      <form onSubmit={handleSubmit}>
        <input
          name="prompt"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
```

### Error State

Similarly, the error state reflects the error object thrown during the fetch request.
It can be used to display an error message, disable the submit button, or show a retry button:

We recommend showing a generic error message to the user, such as "Something
went wrong." This is a good practice to avoid leaking information from the
server.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({
      keepLastMessageOnError: true,
    });


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}


      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
```

Please also see the error handling guide for more information.

### Modify messages

Sometimes, you may want to directly modify some existing messages. For example, a delete button can be added to each message to allow users to remove them from the chat history.

The setMessages function can help you achieve these tasks:

```tsx
const { messages, setMessages, ... } = useChat()


const handleDelete = (id) => {
  setMessages(messages.filter(message => message.id !== id))
}


return <>
  {messages.map(message => (
    <div key={message.id}>
      {message.role === 'user' ? 'User: ' : 'AI: '}
      {message.content}
      <button onClick={() => handleDelete(message.id)}>Delete</button>
    </div>
  ))}
  ...
```

You can think of messages and setMessages as a pair of state and setState in React.

### Controlled input

In the initial example, we have handleSubmit and handleInputChange callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like setInput and append with your custom input and submit button components:

```tsx
const { input, setInput, append } = useChat()


return <>
  <MyCustomInput value={input} onChange={value => setInput(value)} />
  <MySubmitButton onClick={() => {
    // Send a new message to the AI provider
    append({
      role: 'user',
      content: input,
    })
  }}/>
  ...
```

### Cancelation and regeneration

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the stop function returned by the useChat hook.

```tsx
const { stop, isLoading, ... } = useChat()


return <>
  <button onClick={stop} disabled={!isLoading}>Stop</button>
  ...
```

When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your chatbot application.

Similarly, you can also request the AI provider to reprocess the last message by calling the reload function returned by the useChat hook:

```tsx
const { reload, isLoading, ... } = useChat()


return <>
  <button onClick={reload} disabled={isLoading}>Regenerate</button>
  ...
</>
```

When the user clicks the "Regenerate" button, the AI provider will regenerate the last message and replace the current one correspondingly.

## Event Callbacks

useChat provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle:

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
import { Message } from 'ai/react';


const {
  /* ... */
} = useChat({
  onFinish: (message, { usage, finishReason }) => {
    console.log('Finished streaming message:', message);
    console.log('Token usage:', usage);
    console.log('Finish reason:', finishReason);
  },
  onError: error => {
    console.error('An error occurred:', error);
  },
  onResponse: response => {
    console.log('Received HTTP response from server:', response);
  },
});
```

It's worth noting that you can abort the processing by throwing an error in the onResponse callback. This will trigger the onError callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## Configure Request Options

By default, the useChat hook sends a HTTP POST request to the /api/chat endpoint with the message list as the request body. You can customize the request by passing additional options to the useChat hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/custom-chat',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the useChat hook sends a POST request to the /api/custom-chat endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.

## Setting custom body fields per request

You can configure custom body fields on a per-request basis using the body option of the handleSubmit function.
This is useful if you want to pass in additional information to your backend that is not part of the message list.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}


      <form
        onSubmit={event => {
          handleSubmit(event, {
            body: {
              customKey: 'customValue',
            },
          });
        }}
      >
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

You can retrieve these custom fields on your server side by destructuring the request body:

```ts
export async function POST(req: Request) {
  // Extract addition information ("customKey") from the body of the request:
  const { messages, customKey } = await req.json();
  //...
}
```

## Empty Submissions

You can configure the useChat hook to allow empty submissions by setting the allowEmptySubmit option to true.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}


      <form
        onSubmit={event => {
          handleSubmit(event, {
            allowEmptySubmit: true,
          });
        }}
      >
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## Attachments (Experimental)

The useChat hook supports sending attachments along with a message as well as rendering them on the client. This can be useful for building applications that involve sending images, files, or other media content to the AI provider.

Note: Attachments is currently only available for React frameworks.

There are two ways to send attachments with a message, either by providing a FileList object or a list of URLs to the handleSubmit function:

### FileList

By using FileList, you can send multiple files as attachments along with a message using the file input element. The useChat hook will automatically convert them into data URLs and send them to the AI provider.

Note: Currently, only image/* and text/* content types get automatically converted into multi-modal content parts. You will need to handle other content types manually.

```tsx
'use client';


import { useChat } from 'ai/react';
import { useRef, useState } from 'react';


export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();


  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>


            <div>
              {message.content}


              <div>
                {message.experimental_attachments
                  ?.filter(attachment =>
                    attachment.contentType.startsWith('image/'),
                  )
                  .map((attachment, index) => (
                    <img
                      key={`${message.id}-${index}`}
                      src={attachment.url}
                      alt={attachment.name}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>


      <form
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: files,
          });


          setFiles(undefined);


          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
      >
        <input
          type="file"
          onChange={event => {
            if (event.target.files) {
              setFiles(event.target.files);
            }
          }}
          multiple
          ref={fileInputRef}
        />
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

### URLs

You can also send URLs as attachments along with a message. This can be useful for sending links to external resources or media content.

Note: The URL can also be a data URL, which is a base64-encoded string that represents the content of a file. Currently, only image/* content types get automatically converted into multi-modal content parts. You will need to handle other content types manually.

```tsx
'use client';


import { useChat } from 'ai/react';
import { useState } from 'react';
import { Attachment } from '@ai-sdk/ui-utils';


export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, isLoading } =
    useChat();


  const [attachments] = useState<Attachment[]>([
    {
      name: 'earth.png',
      contentType: 'image/png',
      url: 'https://example.com/earth.png',
    },
    {
      name: 'moon.png',
      contentType: 'image/png',
      url: 'data:image/png;base64,iVBORw0KGgo...',
    },
  ]);


  return (
    <div>
      <div>
        {messages.map(message => (
          <div key={message.id}>
            <div>{`${message.role}: `}</div>


            <div>
              {message.content}


              <div>
                {message.experimental_attachments
                  ?.filter(attachment =>
                    attachment.contentType?.startsWith('image/'),
                  )
                  .map((attachment, index) => (
                    <img
                      key={`${message.id}-${index}`}
                      src={attachment.url}
                      alt={attachment.name}
                    />
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>


      <form
        onSubmit={event => {
          handleSubmit(event, {
            experimental_attachments: attachments,
          });
        }}
      >
        <input
          value={input}
          placeholder="Send message..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot-with-tool-calling

# Chatbot with Tools

The tool calling functionality described here is currently only available for
React, Svelte, and SolidJS.

With useChat and streamText, you can use tools in your chatbot application.
The Vercel AI SDK supports three types of tools in this context:

The flow is as follows:

The tool call and tool executions are integrated into the assistant message as toolInvocations.
A tool invocation is at first a tool call, and then it becomes a tool result when the tool is executed.
The tool result contains all information about the tool call as well as the result of the tool execution.

In order to automatically send another request to the server when all tool
calls are server-side, you need to set
maxToolRoundtrips
to a value greater than 0 in the useChat options. It is disabled by default
for backward compatibility.

## Example

In this example, we'll use three tools:

### API route

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
    tools: {
      // server-side tool with execute function:
      getWeatherInformation: {
        description: 'show the weather in a given city to the user',
        parameters: z.object({ city: z.string() }),
        execute: async ({}: { city: string }) => {
          const weatherOptions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
          return weatherOptions[
            Math.floor(Math.random() * weatherOptions.length)
          ];
        },
      },
      // client-side tool that starts user interaction:
      askForConfirmation: {
        description: 'Ask the user for confirmation.',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      // client-side tool that is automatically executed on the client:
      getLocation: {
        description:
          'Get the user location. Always ask for confirmation before using this tool.',
        parameters: z.object({}),
      },
    },
  });


  return result.toDataStreamResponse();
}
```

### Client-side page

The client-side page uses the useChat hook to create a chatbot application with real-time message streaming.
Tool invocations are displayed in the chat UI.

There are three things worth mentioning:

The onToolCall callback is used to handle client-side tools that should be automatically executed.
In this example, the getLocation tool is a client-side tool that returns a random city.

The toolInvocations property of the last assistant message contains all tool calls and results.
The client-side tool askForConfirmation is displayed in the UI.
It asks the user for confirmation and displays the result once the user confirms or denies the execution.
The result is added to the chat using addToolResult.

The maxToolRoundtrips option is set to 5.
This enables several tool use iterations between the client and the server.

```tsx
'use client';


import { ToolInvocation } from 'ai';
import { Message, useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxToolRoundtrips: 5,


      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'getLocation') {
          const cities = [
            'New York',
            'Los Angeles',
            'Chicago',
            'San Francisco',
          ];
          return cities[Math.floor(Math.random() * cities.length)];
        }
      },
    });


  return (
    <>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          <strong>{m.role}:</strong>
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;
            const addResult = (result: string) =>
              addToolResult({ toolCallId, result });


            // render confirmation tool (client-side tool with user interaction)
            if (toolInvocation.toolName === 'askForConfirmation') {
              return (
                <div key={toolCallId}>
                  {toolInvocation.args.message}
                  <div>
                    {'result' in toolInvocation ? (
                      <b>{toolInvocation.result}</b>
                    ) : (
                      <>
                        <button onClick={() => addResult('Yes')}>Yes</button>
                        <button onClick={() => addResult('No')}>No</button>
                      </>
                    )}
                  </div>
                </div>
              );
            }


            // other tools:
            return 'result' in toolInvocation ? (
              <div key={toolCallId}>
                Tool call {`${toolInvocation.toolName}: `}
                {toolInvocation.result}
              </div>
            ) : (
              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
            );
          })}
          <br />
        </div>
      ))}


      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </>
  );
}
```

## Tool call streaming

You can stream tool calls while they are being generated by enabling the
experimental_toolCallStreaming option in streamText.

```tsx
export async function POST(req: Request) {
  // ...


  const result = await streamText({
    experimental_toolCallStreaming: true,
    // ...
  });


  return result.toDataStreamResponse();
}
```

When the flag is enabled, partial tool calls will be streamed as part of the AI stream.
They are available through the useChat hook.
The toolInvocations property of assistant messages will also contain partial tool calls.
You can use the state property of the tool invocation to render the correct UI.

```tsx
export default function Chat() {
  // ...
  return (
    <>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            switch (toolInvocation.state) {
              case 'partial-call':
                return <>render partial tool call</>;
              case 'call':
                return <>render full tool call</>;
              case 'result':
                return <>render tool result</>;
            }
          })}
        </div>
      ))}
    </>
  );
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/completion

# Completion

The useCompletion hook allows you to create a user interface to handle text completions in your application. It enables the streaming of text completions from your AI provider, manages the state for chat input, and updates the UI automatically as new messages are received.

In this guide, you will learn how to use the useCompletion hook in your application to generate text completions and stream them in real-time to your users.

## Example

```tsx
'use client';


import { useCompletion } from 'ai/react';


export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    api: '/api/completion',
  });


  return (
    <form onSubmit={handleSubmit}>
      <input
        name="prompt"
        value={input}
        onChange={handleInputChange}
        id="input"
      />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();


  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    prompt,
  });


  return result.toDataStreamResponse();
}
```

In the Page component, the useCompletion hook will request to your AI provider endpoint whenever the user submits a message. The completion is then streamed back in real-time and displayed in the UI.

This enables a seamless text completion experience where the user can see the AI response as soon as it is available, without having to wait for the entire response to be received.

## Customized UI

useCompletion also provides ways to manage the prompt via code, show loading and error states, and update messages without being triggered by user interactions.

### Loading and error states

To show a loading spinner while the chatbot is processing the user's message, you can use the isLoading state returned by the useCompletion hook:

```tsx
const { isLoading, ... } = useCompletion()


return(
  <>
    {isLoading ? <Spinner /> : null}
  </>
)
```

Similarly, the error state reflects the error object thrown during the fetch request. It can be used to display an error message, or show a toast notification:

```tsx
const { error, ... } = useCompletion()


useEffect(() => {
  if (error) {
    toast.error(error.message)
  }
}, [error])


// Or display the error message in the UI:
return (
  <>
    {error ? <div>{error.message}</div> : null}
  </>
)
```

### Controlled input

In the initial example, we have handleSubmit and handleInputChange callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like setInput with your custom input and submit button components:

```tsx
const { input, setInput } = useCompletion();


return (
  <>
    <MyCustomInput value={input} onChange={value => setInput(value)} />
  </>
);
```

### Cancelation

It's also a common use case to abort the response message while it's still streaming back from the AI provider. You can do this by calling the stop function returned by the useCompletion hook.

```tsx
const { stop, isLoading, ... } = useCompletion()


return (
  <>
    <button onClick={stop} disabled={!isLoading}>Stop</button>
  </>
)
```

When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your application.

## Event Callbacks

useCompletion also provides optional event callbacks that you can use to handle different stages of the chatbot lifecycle. These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
const { ... } = useCompletion({
  onResponse: (response: Response) => {
    console.log('Received response from server:', response)
  },
  onFinish: (message: Message) => {
    console.log('Finished streaming message:', message)
  },
  onError: (error: Error) => {
    console.error('An error occurred:', error)
  },
})
```

It's worth noting that you can abort the processing by throwing an error in the onResponse callback. This will trigger the onError callback and stop the message from being appended to the chat UI. This can be useful for handling unexpected responses from the AI provider.

## Configure Request Options

By default, the useCompletion hook sends a HTTP POST request to the /api/completion endpoint with the prompt as part of the request body. You can customize the request by passing additional options to the useCompletion hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useCompletion({
  api: '/api/custom-completion',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the useCompletion hook sends a POST request to the /api/completion endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation

# Object Generation

The useObject hook allows you to create interfaces that represent a structured JSON object that is being streamed.

In this guide, you will learn how to use the useObject hook in your application to generate UIs for structured data on the fly.

## Example

The example shows a small notfications demo app that generates fake notifications in real-time.

### Schema

It is helpful to set up the schema in a separate file that is imported on both the client and server.

```ts
import { z } from 'zod';


// define a schema for the notifications
export const notificationSchema = z.object({
  notifications: z.array(
    z.object({
      name: z.string().describe('Name of a fictional person.'),
      message: z.string().describe('Message. Do not use emojis or links.'),
    }),
  ),
});
```

### Client

The client uses useObject to stream the object generation process.

The results are partial and are displayed as they are received.
Please note the code for handling undefined values in the JSX.

```tsx
'use client';


import { experimental_useObject as useObject } from 'ai/react';
import { notificationSchema } from './api/notifications/schema';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
  });


  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```

### Server

On the server, we use streamObject to stream the object generation process.

```typescript
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { notificationSchema } from './schema';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const context = await req.json();


  const result = await streamObject({
    model: openai('gpt-4-turbo'),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });


  return result.toTextStreamResponse();
}
```

## Event Callbacks

useObject provides optional event callbacks that you can use to handle life-cycle events.

These callbacks can be used to trigger additional actions, such as logging, analytics, or custom UI updates.

```tsx
'use client';


import { experimental_useObject as useObject } from 'ai/react';
import { notificationSchema } from './api/notifications/schema';


export default function Page() {
  const { object, submit } = useObject({
    api: '/api/notifications',
    schema: notificationSchema,
    onFinish({ object, error }) {
      // typed object, undefined if schema validation fails:
      console.log('Object generation completed:', object);


      // error, undefined if schema validation succeeds:
      console.log('Schema validation error:', error);
    },
    onError(error) {
      // error during fetch request:
      console.error('An error occurred:', error);
    },
  });


  return (
    <div>
      <button onClick={() => submit('Messages during finals week.')}>
        Generate notifications
      </button>


      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/openai-assistants

# OpenAI Assistants

The useAssistant hook allows you to handle the client state when interacting with an OpenAI compatible assistant API.
This hook is useful when you want to integrate assistant capabilities into your application,
with the UI updated automatically as the assistant is streaming its execution.

The useAssistant hook is supported in ai/react, ai/svelte, and ai/vue.

## Example

```tsx
'use client';


import { Message, useAssistant } from 'ai/react';


export default function Chat() {
  const { status, messages, input, submitMessage, handleInputChange } =
    useAssistant({ api: '/api/assistant' });


  return (
    <div>
      {messages.map((m: Message) => (
        <div key={m.id}>
          <strong>{`${m.role}: `}</strong>
          {m.role !== 'data' && m.content}
          {m.role === 'data' && (
            <>
              {(m.data as any).description}
              <br />
              <pre className={'bg-gray-200'}>
                {JSON.stringify(m.data, null, 2)}
              </pre>
            </>
          )}
        </div>
      ))}


      {status === 'in_progress' && <div />}


      <form onSubmit={submitMessage}>
        <input
          disabled={status !== 'awaiting_message'}
          value={input}
          placeholder="What is the temperature in the living room?"
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
```

```tsx
import { AssistantResponse } from 'ai';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();


  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;


  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message,
  });


  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream, sendDataMessage }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id:
          process.env.ASSISTANT_ID ??
          (() => {
            throw new Error('ASSISTANT_ID is not set');
          })(),
      });


      // forward run status would stream message deltas
      let runResult = await forwardStream(runStream);


      // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
      while (
        runResult?.status === 'requires_action' &&
        runResult.required_action?.type === 'submit_tool_outputs'
      ) {
        const tool_outputs =
          runResult.required_action.submit_tool_outputs.tool_calls.map(
            (toolCall: any) => {
              const parameters = JSON.parse(toolCall.function.arguments);


              switch (toolCall.function.name) {
                // configure your tool calls here


                default:
                  throw new Error(
                    `Unknown tool call function: ${toolCall.function.name}`,
                  );
              }
            },
          );


        runResult = await forwardStream(
          openai.beta.threads.runs.submitToolOutputsStream(
            threadId,
            runResult.id,
            { tool_outputs },
          ),
        );
      }
    },
  );
}
```

## Customized UI

useAssistant also provides ways to manage the chat message and input states via code and show loading and error states.

### Loading and error states

To show a loading spinner while the assistant is running the thread, you can use the status state returned by the useAssistant hook:

```tsx
const { status, ... } = useAssistant()


return(
  <>
    {status === "in_progress" ? <Spinner /> : null}
  </>
)
```

Similarly, the error state reflects the error object thrown during the fetch request. It can be used to display an error message, or show a toast notification:

```tsx
const { error, ... } = useAssistant()


useEffect(() => {
  if (error) {
    toast.error(error.message)
  }
}, [error])


// Or display the error message in the UI:
return (
  <>
    {error ? <div>{error.message}</div> : null}
  </>
)
```

### Controlled input

In the initial example, we have handleSubmit and handleInputChange callbacks that manage the input changes and form submissions. These are handy for common use cases, but you can also use uncontrolled APIs for more advanced scenarios such as form validation or customized components.

The following example demonstrates how to use more granular APIs like append with your custom input and submit button components:

```tsx
const { append } = useAssistant();


return (
  <>
    <MySubmitButton
      onClick={() => {
        // Send a new message to the AI provider
        append({
          role: 'user',
          content: input,
        });
      }}
    />
  </>
);
```

## Configure Request Options

By default, the useAssistant hook sends a HTTP POST request to the /api/assistant endpoint with the prompt as part of the request body. You can customize the request by passing additional options to the useAssistant hook:

```tsx
const { messages, input, handleInputChange, handleSubmit } = useAssistant({
  api: '/api/custom-completion',
  headers: {
    Authorization: 'your_token',
  },
  body: {
    user_id: '123',
  },
  credentials: 'same-origin',
});
```

In this example, the useAssistant hook sends a POST request to the /api/custom-completion endpoint with the specified headers, additional body fields, and credentials for that fetch request. On your server side, you can handle the request with these additional information.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/storing-messages

# Storing Messages

The ability to store message history is essential for chatbot use cases.
The Vercel AI SDK simplifies the process of storing chat history through the onFinish callback of the streamText function.

onFinish is called after the model's response and all tool executions have completed.
It provides the final text, tool calls, tool results, and usage information,
making it an ideal place to e.g. store the chat history in a database.

## Implementing Persistent Chat History

To implement persistent chat storage, you can utilize the onFinish callback on the streamText function.
This callback is triggered upon the completion of the model's response and all tool executions,
making it an ideal place to handle the storage of each interaction.

### API Route Example

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
    async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
      // implement your own storage logic:
      await saveChat({ text, toolCalls, toolResults });
    },
  });


  return result.toDataStreamResponse();
}
```

### Server Action Example

```tsx
'use server';


import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';


export async function continueConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    async onFinish({ text, toolCalls, toolResults, finishReason, usage }) {
      // implement your own storage logic:
      await saveChat({ text, toolCalls, toolResults });
    },
  });


  return result.toDataStreamResponse();
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/streaming-data

# Streaming Data

Depending on your use case, you may want to stream additional data alongside the model's response.
This can be achieved with StreamData.

## What is StreamData

The StreamData class allows you to stream arbitrary data to the client alongside your LLM response.
This can be particularly useful in applications that need to augment AI responses with metadata, auxiliary information,
or custom data structures that are relevant to the ongoing interaction.

## How To Use StreamData

To use StreamData, create a StreamData value on the server,
append some data, and then include it in toDataStreamResponse.

You need to call close() on the StreamData object to ensure the data is sent to the client.
This can best be done in the onFinish callback of streamText.

On the client, the useChat hook returns data, which will contain the additional data.

### On the server

While this example uses Next.js (App Router), StreamData is compatible with
any framework.

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText, StreamData } from 'ai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();


  // Create a new StreamData
  const data = new StreamData();


  // Append additional data
  data.append({ test: 'value' });


  // Call the language model
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    onFinish() {
      data.close();
    },
    messages,
  });


  // Respond with the stream and additional StreamData
  return result.toDataStreamResponse({ data });
}
```

### On the client

On the client, you can destructure data from the useChat hook which stores all StreamData in an array. The data is of the type JSONValue[].

```tsx
const { data } = useChat();
```

Future versions of the AI SDK will support each Message having a data object attached to it.





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/error-handling

# Error Handling

### useChat: Keep Last Message on Error

useChat has a keepLastMessageOnError option that defaults to false.
This option can be enabled to keep the last message on error.
We will make this the default behavior in the next major release,
and recommend enabling it.

### Error Helper Object

Each AI SDK UI hook also returns an error object that you can use to render the error in your UI.
You can use the error object to show an error message, disable the submit button, or show a retry button.

We recommend showing a generic error message to the user, such as "Something
went wrong." This is a good practice to avoid leaking information from the
server.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error, reload } =
    useChat({ keepLastMessageOnError: true });


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}


      {error && (
        <>
          <div>An error occurred.</div>
          <button type="button" onClick={() => reload()}>
            Retry
          </button>
        </>
      )}


      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={error != null}
        />
      </form>
    </div>
  );
}
```

#### Alternative: replace last message

Alternatively you can write a custom submit handler that replaces the last message when an error is present.

```tsx
'use client';


import { useChat } from 'ai/react';


export default function Chat() {
  const {
    handleInputChange,
    handleSubmit,
    error,
    input,
    messages,
    setMesages,
  } = useChat({ keepLastMessageOnError: true });


  function customSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (error != null) {
      setMessages(messages.slice(0, -1)); // remove last message
    }


    handleSubmit(event);
  }


  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}


      {error && <div>An error occurred.</div>}


      <form onSubmit={customSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

### Error Handling Callback

Errors can be processed by passing an onError callback function as an option to the useChat, useCompletion or useAssistant hooks.
The callback function receives an error object as an argument.

```tsx
import { useChat } from 'ai/react';


export default function Page() {
  const {
    /* ... */
  } = useChat({
    keepLastMessageOnError: true,
    // handle error:
    onError: error => {
      console.error(error);
    },
  });
}
```

### Injecting Errors for Testing

You might want to create errors for testing.
You can easily do so by throwing an error in your route handler:

```ts
export async function POST(req: Request) {
  throw new Error('This is a test error');
}
```





Page URL: https://sdk.vercel.ai/docs/ai-sdk-ui/stream-protocol

# Stream Protocols

AI SDK UI functions such as useChat and useCompletion support both text streams and data streams.
The stream protocol defines how the data is streamed to the frontend on top of the HTTP protocol.

This page describes both protocols and how to use them in the backend and frontend.

You can use this information to develop custom backends and frontends for your use case, e.g.,
to provide compatible API endpoints that are implemented in a different language such as Python.

For instance, here's an example using FastAPI as a backend.

## Text Stream Protocol

A text stream contains chunks in plain text, that are streamed to the frontend.
Each chunk is then appended together to form a full text response.

Text streams are supported by useChat, useCompletion, and useObject.
When you use useChat or useCompletion, you need to enable text streaming
by setting the streamProtocol options to text.

You can generate text streams with streamText in the backend.
When you call toTextStreamResponse() on the result object,
a streaming HTTP response is returned.

Text streams only support basic text data. If you need to stream other types
of data such as tool calls, use data streams.

### Text Stream Example

Here is a Next.js example that uses the text stream protocol:

```tsx
'use client';


import { useCompletion } from 'ai/react';


export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    streamProtocol: 'text',
  });


  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
  });


  return result.toTextStreamResponse();
}
```

## Data Stream Protocol

A data stream follows a special protocol that the Vercel AI SDK provides to send information to the frontend.

Each stream part has the format TYPE_ID:CONTENT_JSON\n.

When you provide data streams from a custom backend, you need to set the
x-vercel-ai-data-stream header to v1.

The following stream parts are currently supported:

### Text Part

The text parts are appended to the message as they are received.

Format: 0:string\n

Example: 0:"example"\n

### Data Part

The data parts are parsed as JSON and appended to the message as they are received. The data part is available through data.

Format: 2:Array<JSONValue>\n

Example: 2:[{"key":"object1"},{"anotherKey":"object2"}]\n

### Error Part

The error parts are appended to the message as they are received.

Format: 3:string\n

Example: 3:"error message"\n

### Tool Call Streaming Start Part

A part indicating the start of a streaming tool call. This part needs to be sent before any tool call delta for that tool call. Tool call streaming is optional, you can use tool call and tool result parts without it.

Format: b:{toolCallId:string; toolName:string}\n

Example: b:{"toolCallId":"call-456","toolName":"streaming-tool"}\n

### Tool Call Delta Part

A part representing a delta update for a streaming tool call.

Format: c:{toolCallId:string; argsTextDelta:string}\n

Example: c:{"toolCallId":"call-456","argsTextDelta":"partial arg"}\n

### Tool Call Part

A part representing a tool call. When there are streamed tool calls, the tool call part needs to come after the tool call streaming is finished.

Format: 9:{toolCallId:string; toolName:string; args:object}\n

Example: 9:{"toolCallId":"call-123","toolName":"my-tool","args":{"some":"argument"}}\n

### Tool Result Part

A part representing a tool result. The result part needs to be sent after the tool call part for that tool call.

Format: a:{toolCallId:string; result:object}\n

Example: a:{"toolCallId":"call-123","result":"tool output"}\n

### Finish Message Part

A part indicating the completion of a message with additional metadata, such as FinishReason and Usage. This part needs to be the last part in the stream.

Format: d:{finishReason:'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';usage:{promptTokens:number; completionTokens:number;}}\n

Example: d:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20}}\n

The data stream protocol is supported
by useChat and useCompletion on the frontend and used by default.
useCompletion only supports the text and data stream parts.

On the backend, you can use toDataStreamResponse() from the streamText result object to return a streaming HTTP response.

### Data Stream Example

Here is a Next.js example that uses the data stream protocol:

```tsx
'use client';


import { useCompletion } from 'ai/react';


export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    streamProtocol: 'data', // optional, this is the default
  });


  return (
    <form onSubmit={handleSubmit}>
      <input name="prompt" value={input} onChange={handleInputChange} />
      <button type="submit">Submit</button>
      <div>{completion}</div>
    </form>
  );
}
```

```ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();


  const result = await streamText({
    model: openai('gpt-4o'),
    prompt,
  });


  return result.toDataStreamResponse();
}
```





Page URL: https://sdk.vercel.ai/docs/advanced

# Advanced

This section covers advanced topics and concepts for the AI SDK and RSC API. Working with LLMs often requires a different mental model compared to traditional software development.

After these concepts, you should have a better understanding of the paradigms behind the AI SDK and RSC API, and how to use them to build more AI applications.





Page URL: https://sdk.vercel.ai/docs/advanced/prompt-engineering

# Prompt Engineering

## What is a Large Language Model (LLM)?

A Large Language Model is essentially a prediction engine that takes a sequence of words as input and aims to predict the most likely sequence to follow. It does this by assigning probabilities to potential next sequences and then selecting one. The model continues to generate sequences until it meets a specified stopping criterion.

These models learn by training on massive text corpuses, which means they will be better suited to some use cases than others. For example, a model trained on GitHub data would understand the probabilities of sequences in source code particularly well. However, it's crucial to understand that the generated sequences, while often seeming plausible, can sometimes be random and not grounded in reality. As these models become more accurate, many surprising abilities and applications emerge.

## What is a prompt?

Prompts are the starting points for LLMs. They are the inputs that trigger the model to generate text. The scope of prompt engineering involves not just crafting these prompts but also understanding related concepts such as hidden prompts, tokens, token limits, and the potential for prompt hacking, which includes phenomena like jailbreaks and leaks.

## Why is prompt engineering needed?

Prompt engineering currently plays a pivotal role in shaping the responses of LLMs. It allows us to tweak the model to respond more effectively to a broader range of queries. This includes the use of techniques like semantic search, command grammars, and the ReActive model architecture. The performance, context window, and cost of LLMs varies between models and model providers which adds further constraints to the mix. For example, the GPT-4 model is more expensive than GPT-3.5-turbo and significantly slower, but it can also be more effective at certain tasks. And so, like many things in software engineering, there is a trade-offs between cost and performance.

To assist with comparing and tweaking LLMs, we've built an AI playground that allows you to compare the performance of different models side-by-side online. When you're ready, you can even generate code with the Vercel AI SDK to quickly use your prompt and your selected model into your own applications.

## Example: Build a Slogan Generator

### Start with an instruction

Imagine you want to build a slogan generator for marketing campaigns. Creating catchy slogans isn't always straightforward!

First, you'll need a prompt that makes it clear what you want. Let's start with an instruction. Submit this prompt to generate your first completion.

Not bad! Now, try making your instruction more specific.

Introducing a single descriptive term to our prompt influences the completion. Essentially, crafting your prompt is the means by which you "instruct" or "program" the model.

### Include examples

Clear instructions are key for quality outcomes, but that might not always be enough. Let's try to enhance your instruction further.

These slogans are fine, but could be even better. It appears the model overlooked the 'live' part in our prompt. Let's change it slightly to generate more appropriate suggestions.

Often, it's beneficial to both demonstrate and tell the model your requirements. Incorporating examples in your prompt can aid in conveying patterns or subtleties. Test this prompt that carries a few examples.

Great! Incorporating examples of expected output for a certain input prompted the model to generate the kind of names we aimed for.

### Tweak your settings

Apart from designing prompts, you can influence completions by tweaking model settings. A crucial setting is the temperature.

You might have seen that the same prompt, when repeated, yielded the same or nearly the same completions. This happens when your temperature is at 0.

Attempt to re-submit the identical prompt a few times with temperature set to 1.

Notice the difference? With a temperature above 0, the same prompt delivers varied completions each time.

Keep in mind that the model forecasts the text most likely to follow the preceding text. Temperature, a value from 0 to 1, essentially governs the model's confidence level in making these predictions. A lower temperature implies lesser risks, leading to more precise and deterministic completions. A higher temperature yields a broader range of completions.

For your slogan generator, you might want a large pool of name suggestions. A moderate temperature of 0.6 should serve well.

## Recommended Resources

Prompt Engineering is evolving rapidly, with new methods and research papers surfacing every week. Here are some resources that we've found useful for learning about and experimenting with prompt engineering:





Page URL: https://sdk.vercel.ai/docs/advanced/stopping-streams

# Stopping Streams

Cancelling ongoing streams is often needed.
For example, users might want to stop a stream when they realize that the response is not what they want.

The different parts of the Vercel AI SDK support cancelling streams in different ways.

## AI SDK Core

The AI SDK functions have an abortSignal argument that you can use to cancel a stream.
You would use this if you want to cancel a stream from the server side to the LLM API, e.g. by
forwarding the abortSignal from the request.

```tsx
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


export async function POST(req: Request) {
  const { prompt } = await req.json();


  const result = await streamText({
    model: openai('gpt-4-turbo'),
    prompt,
    // forward the abort signal:
    abortSignal: req.signal,
  });


  return result.toTextStreamResponse();
}
```

## AI SDK UI

The hooks, e.g. useChat or useCompletion, provide a stop helper function that can be used to cancel a stream.
This will cancel the stream from the client side to the server.

```tsx
'use client';


import { useCompletion } from 'ai/react';


export default function Chat() {
  const {
    input,
    completion,
    stop,
    isLoading,
    handleSubmit,
    handleInputChange,
  } = useCompletion();


  return (
    <div>
      {isLoading && (
        <button type="button" onClick={() => stop()}>
          Stop
        </button>
      )}
      {completion}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}
```

## AI SDK RSC

The AI SDK RSC does not currently support stopping streams.





Page URL: https://sdk.vercel.ai/docs/advanced/backpressure

# Stream Back-pressure and Cancellation

This page focuses on understanding back-pressure and cancellation when working with streams. You do not need to know this information to use the Vercel AI SDK, but for those interested, it offers a deeper dive on why and how the SDK optimally streams responses.

In the following sections, we'll explore back-pressure and cancellation in the context of a simple example program. We'll discuss the issues that can arise from an eager approach and demonstrate how a lazy approach can resolve them.

## Back-pressure and Cancellation with Streams

Let's begin by setting up a simple example program:

```jsx
// A generator that will yield positive integers
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;


    await sleep(100);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}


// Collect data from stream
async function run() {
  // Set up a stream of integers
  const stream = createStream(integers());


  // Read values from our stream
  const reader = stream.getReader();
  for (let i = 0; i < 10_000; i++) {
    // we know our stream is infinite, so there's no need to check `done`.
    const { value } = await reader.read();
    console.log(`read ${value}`);


    await sleep(1_000);
  }
}
run();
```

In this example, we create an async-generator that yields positive integers, a ReadableStream that wraps our integer generator, and a reader which will read values out of our stream. Notice, too, that our integer generator logs out "yielding ${i}", and our reader logs out "read ${value}". Both take an arbitrary amount of time to process data, represented with a 100ms sleep in our generator, and a 1sec sleep in our reader.

## Back-pressure

If you were to run this program, you'd notice something funny. We'll see roughly 10 "yield" logs for every "read" log. This might seem obvious, the generator can push values 10x faster than the reader can pull them out. But it represents a problem, our stream has to maintain an ever expanding queue of items that have been pushed in but not pulled out.

The problem stems from the way we wrap our generator into a stream. Notice the use of for await (…) inside our start handler. This is an eager for-loop, and it is constantly running to get the next value from our generator to be enqueued in our stream. This means our stream does not respect back-pressure, the signal from the consumer to the producer that more values aren't needed yet. We've essentially spawned a thread that will perpetually push more data into the stream, one that runs as fast as possible to push new data immediately. Worse, there's no way to signal to this thread to stop running when we don't need additional data.

To fix this, ReadableStream allows a pull handler. pull is called every time the consumer attempts to read more data from our stream (if there's no data already queued internally). But it's not enough to just move the for await(…) into pull, we also need to convert from an eager enqueuing to a lazy one. By making these 2 changes, we'll be able to react to the consumer. If they need more data, we can easily produce it, and if they don't, then we don't need to spend any time doing unnecessary work.

```jsx
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();


      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

Our createStream is a little more verbose now, but the new code is important. First, we need to manually call our iterator.next() method. This returns a Promise for an object with the type signature { done: boolean, value: T }. If done is true, then we know that our iterator won't yield any more values and we must close the stream (this allows the consumer to know that the stream is also finished producing values). Else, we need to enqueue our newly produced value.

When we run this program, we see that our "yield" and "read" logs are now paired. We're no longer yielding 10x integers for every read! And, our stream now only needs to maintain 1 item in its internal buffer. We've essentially given control to the consumer, so that it's responsible for producing new values as it needs it. Neato!

## Cancellation

Let's go back to our initial eager example, with 1 small edit. Now instead of reading 10,000 integers, we're only going to read 3:

```jsx
// A generator that will yield positive integers
async function* integers() {
  let i = 1;
  while (true) {
    console.log(`yielding ${i}`);
    yield i++;


    await sleep(100);
  }
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async start(controller) {
      for await (const v of iterator) {
        controller.enqueue(v);
      }
      controller.close();
    },
  });
}
// Collect data from stream
async function run() {
  // Set up a stream that of integers
  const stream = createStream(integers());


  // Read values from our stream
  const reader = stream.getReader();
  // We're only reading 3 items this time:
  for (let i = 0; i < 3; i++) {
    // we know our stream is infinite, so there's no need to check `done`.
    const { value } = await reader.read();
    console.log(`read ${value}`);


    await sleep(1000);
  }
}
run();
```

We're back to yielding 10x the number of values read. But notice now, after we've read 3 values, we're continuing to yield new values. We know that our reader will never read another value, but our stream doesn't! The eager for await (…) will continue forever, loudly enqueuing new values into our stream's buffer and increasing our memory usage until it consumes all available program memory.

The fix to this is exactly the same: use pull and manual iteration. By producing values lazily, we tie the lifetime of our integer generator to the lifetime of the reader. Once the reads stop, the yields will stop too:

```jsx
// Wraps a generator into a ReadableStream
function createStream(iterator) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();


      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}
```

Since the solution is the same as implementing back-pressure, it shows that they're just 2 facets of the same problem: Pushing values into a stream should be done lazily, and doing it eagerly results in expected problems.

## Tying Stream Laziness to AI Responses

Now let's imagine you're integrating AIBot service into your product. Users will be able to prompt "count from 1 to infinity", the browser will fetch your AI API endpoint, and your servers connect to AIBot to get a response. But "infinity" is, well, infinite. The response will never end!

After a few seconds, the user gets bored and navigates away. Or maybe you're doing local development and a hot-module reload refreshes your page. The browser will have ended its connection to the API endpoint, but will your server end its connection with AIBot?

If you used the eager for await (...) approach, then the connection is still running and your server is asking for more and more data from AIBot. Our server spawned a "thread" and there's no signal when we can end the eager pulls. Eventually, the server is going to run out of memory (remember, there's no active fetch connection to read the buffering responses and free them).

With the lazy approach, this is taken care of for you. Because the stream will only request new data from AIBot when the consumer requests it, navigating away from the page naturally frees all resources. The fetch connection aborts and the server can clean up the response. The ReadableStream tied to that response can now be garbage collected. When that happens, the connection it holds to AIBot can then be freed.





Page URL: https://sdk.vercel.ai/docs/advanced/caching

# Caching Responses

Depending on the type of application you're building, you may want to cache the responses you receive from your AI provider, at least temporarily.

Each stream helper for each provider has special lifecycle callbacks you can use.
The one of interest is likely onFinish, which is called when the stream is closed. This is where you can cache the full response.

Here's an example of how you can implement caching using Vercel KV and Next.js to cache the OpenAI response for 1 hour:

## Example: Vercel KV

This example uses Vercel KV and Next.js to cache the OpenAI response for 1 hour.

```tsx
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, formatStreamPart, streamText } from 'ai';
import kv from '@vercel/kv';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


// simple cache implementation, use Vercel KV or a similar service for production
const cache = new Map<string, string>();


export async function POST(req: Request) {
  const { messages } = await req.json();


  // come up with a key based on the request:
  const key = JSON.stringify(messages);


  // Check if we have a cached response
  const cached = await kv.get(key);
  if (cached != null) {
    return new Response(formatStreamPart('text', cached), {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }


  // Call the language model:
  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    async onFinish({ text }) {
      // Cache the response text:
      await kv.set(key, text);
      await kv.expire(key, 60 * 60);
    },
  });


  // Respond with the stream
  return result.toDataStreamResponse();
}
```





Page URL: https://sdk.vercel.ai/docs/advanced/multiple-streamables

# Multiple Streams

## Multiple Streamable UIs

The AI SDK RSC APIs allow you to compose and return any number of streamable UIs, along with other data, in a single request. This can be useful when you want to decouple the UI into smaller components and stream them separately.

```tsx
'use server';


import { createStreamableUI } from 'ai/rsc';


export async function getWeather() {
  const weatherUI = createStreamableUI();
  const forecastUI = createStreamableUI();


  weatherUI.update(<div>Loading weather...</div>);
  forecastUI.update(<div>Loading forecast...</div>);


  getWeatherData().then(weatherData => {
    weatherUI.done(<div>{weatherData}</div>);
  });


  getForecastData().then(forecastData => {
    forecastUI.done(<div>{forecastData}</div>);
  });


  // Return both streamable UIs and other data fields.
  return {
    requestedAt: Date.now(),
    weather: weatherUI.value,
    forecast: forecastUI.value,
  };
}
```

The client side code is similar to the previous example, but the tool call will return the new data structure with the weather and forecast UIs. Depending on the speed of getting weather and forecast data, these two components might be updated independently.

## Nested Streamable UIs

You can stream UI components within other UI components. This allows you to create complex UIs that are built up from smaller, reusable components. In the example below, we pass a historyChart streamable as a prop to a StockCard component. The StockCard can render the historyChart streamable, and it will automatically update as the server responds with new data.

```tsx
async function getStockHistoryChart({ symbol: string }) {
  'use server';


  const ui = createStreamableUI(<Spinner />);


  // We need to wrap this in an async IIFE to avoid blocking.
  (async () => {
    const price = await getStockPrice({ symbol });


    // Show a spinner as the history chart for now.
    const historyChart = createStreamableUI(<Spinner />);
    ui.done(<StockCard historyChart={historyChart.value} price={price} />);


    // Getting the history data and then update that part of the UI.
    const historyData = await fetch('https://my-stock-data-api.com');
    historyChart.done(<HistoryChart data={historyData} />);
  })();


  return ui;
}
```





Page URL: https://sdk.vercel.ai/docs/advanced/rate-limiting

# Rate Limiting

Rate limiting helps you protect your APIs from abuse. It involves setting a
maximum threshold on the number of requests a client can make within a
specified timeframe. This simple technique acts as a gatekeeper,
preventing excessive usage that can degrade service performance and incur
unnecessary costs.

## Rate Limiting with Vercel KV and Upstash Ratelimit

In this example, you will protect an API endpoint using Vercel KV
and Upstash Ratelimit.

```tsx
import kv from '@vercel/kv';
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;


// Create Rate limit
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.fixedWindow(5, '30s'),
});


export async function POST(req: NextRequest) {
  // call ratelimit with request ip
  const ip = req.ip ?? 'ip';
  const { success, remaining } = await ratelimit.limit(ip);


  // block the request if unsuccessfull
  if (!success) {
    return new Response('Ratelimited!', { status: 429 });
  }


  const { messages } = await req.json();


  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages,
  });


  return result.toDataStreamResponse();
}
```

## Simplify API Protection

With Vercel KV and Upstash Ratelimit, it is possible to protect your APIs
from such attacks with ease. To learn more about how Ratelimit works and
how it can be configured to your needs, see Ratelimit Documentation.





Page URL: https://sdk.vercel.ai/docs/advanced/rendering-ui-with-language-models

# Rendering User Interfaces with Language Models

Language models generate text, so at first it may seem like you would only need to render text in your application.

```tsx
const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'You are a friendly assistant',
  prompt: 'What is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in'),
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        return `It is currently ${weather.value}°${unit} and ${weather.description} in ${city}!`;
      },
    },
  },
});
```

Above, the language model is passed a tool called getWeather that returns the weather information as text. However, instead of returning text, if you return a JSON object that represents the weather information, you can use it to render a React component instead.

```tsx
const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'You are a friendly assistant',
  prompt: 'What is the weather in SF?',
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in'),
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit });
        const { temperature, unit, description, forecast } = weather;


        return {
          temperature,
          unit,
          description,
          forecast,
        };
      },
    },
  },
});
```

Now you can use the object returned by the getWeather function to conditionally render a React component <WeatherCard/> that displays the weather information by passing the object as props.

```tsx
return (
  <div>
    {messages.map(message => {
      if (message.role === 'function') {
        const { name, content } = message
        const { temperature, unit, description, forecast } = content;


        return (
          <WeatherCard
            weather={{
              temperature: 47,
              unit: 'F',
              description: 'sunny'
              forecast,
            }}
          />
        )
      }
    })}
  </div>
)
```

Here's a little preview of what that might look like.

Weather

An example of an assistant that renders the weather information in a streamed component.

Rendering interfaces as part of language model generations elevates the user experience of your application, allowing people to interact with language models beyond text.

They also make it easier for you to interpret sequential tool calls that take place in multiple steps and help identify and debug where the model reasoned incorrectly.

## Rendering Multiple User Interfaces

To recap, an application has to go through the following steps to render user interfaces as part of model generations:

Most applications have multiple tools that are called by the language model, and each tool can return a different user interface.

For example, a tool that searches for courses can return a list of courses, while a tool that searches for people can return a list of people. As this list grows, the complexity of your application will grow as well and it can become increasingly difficult to manage these user interfaces.

```tsx
{
  message.role === 'tool' ? (
    message.name === 'api-search-course' ? (
      <Courses courses={message.content} />
    ) : message.name === 'api-search-profile' ? (
      <People people={message.content} />
    ) : message.name === 'api-meetings' ? (
      <Meetings meetings={message.content} />
    ) : message.name === 'api-search-building' ? (
      <Buildings buildings={message.content} />
    ) : message.name === 'api-events' ? (
      <Events events={message.content} />
    ) : message.name === 'api-meals' ? (
      <Meals meals={message.content} />
    ) : null
  ) : (
    <div>{message.content}</div>
  );
}
```

## Rendering User Interfaces on the Server

The AI SDK RSC (ai/rsc) takes advantage of RSCs to solve the problem of managing all your React components on the client side, allowing you to render React components on the server and stream them to the client.

Rather than conditionally rendering user interfaces on the client based on the data returned by the language model, you can directly stream them from the server during a model generation.

```tsx
import { createStreamableUI } from 'ai/rsc'


const uiStream = createStreamableUI();


const text = generateText({
  model: openai('gpt-3.5-turbo'),
  system: 'you are a friendly assistant'
  prompt: 'what is the weather in SF?'
  tools: {
    getWeather: {
      description: 'Get the weather for a location',
      parameters: z.object({
        city: z.string().describe('The city to get the weather for'),
        unit: z
          .enum(['C', 'F'])
          .describe('The unit to display the temperature in')
      }),
      execute: async ({ city, unit }) => {
        const weather = getWeather({ city, unit })
        const { temperature, unit, description, forecast } = weather


        uiStream.done(
          <WeatherCard
            weather={{
              temperature: 47,
              unit: 'F',
              description: 'sunny'
              forecast,
            }}
          />
        )
      }
    }
  }
})


return {
  display: uiStream.value
}
```

The createStreamableUI function belongs to the ai/rsc module and creates a stream that can send React components to the client.

On the server, you render the <WeatherCard/> component with the props passed to it, and then stream it to the client. On the client side, you only need to render the UI that is streamed from the server.

```tsx
return (
  <div>
    {messages.map(message => (
      <div>{message.display}</div>
    ))}
  </div>
);
```

Now the steps involved are simplified:

Note: You can also render text on the server and stream it to the client using React Server Components. This way, all operations from language model generation to UI rendering can be done on the server, while the client only needs to render the UI that is streamed from the server.

Check out this example for a full illustration of how to stream component updates with React Server Components in Next.js App Router.





Page URL: https://sdk.vercel.ai/docs/advanced/model-as-router

# Generative User Interfaces

Since language models can render user interfaces as part of their generations, the resulting model generations are referred to as generative user interfaces.

In this section we will learn more about generative user interfaces and their impact on the way AI applications are built.

## Deterministic Routes and Probabilistic Routing

Generative user interfaces are not deterministic in nature because they depend on the model's generation output. Since these generations are probabilistic in nature, it is possible for every user query to result in a different user interface.

Users expect their experience using your application to be predictable, so non-deterministic user interfaces can sound like a bad idea at first. However, language models can be set up to limit their generations to a particular set of outputs using their ability to call functions.

When language models are provided with a set of function definitions and instructed to execute any of them based on user query, they do either one of the following things:

```tsx
const sendMessage = (prompt: string) =>
  generateText({
    model: 'gpt-3.5-turbo',
    system: 'you are a friendly weather assistant!',
    prompt,
    tools: {
      getWeather: {
        description: 'Get the weather in a location',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }: { location: string }) => ({
          location,
          temperature: 72 + Math.floor(Math.random() * 21) - 10,
        }),
      },
    },
  });


sendMessage('What is the weather in San Francisco?'); // getWeather is called
sendMessage('What is the weather in New York?'); // getWeather is called
sendMessage('What events are happening in London?'); // No function is called
```

This way, it is possible to ensure that the generations result in deterministic outputs, while the choice a model makes still remains to be probabilistic.

This emergent ability exhibited by a language model to choose whether a function needs to be executed or not based on a user query is believed to be models emulating "reasoning".

As a result, the combination of language models being able to reason which function to execute as well as render user interfaces at the same time gives you the ability to build applications where language models can be used as a router.

## Language Models as Routers

Historically, developers had to write routing logic that connected different parts of an application to be navigable by a user and complete a specific task.

In web applications today, most of the routing logic takes place in the form of routes:

While routes help you build web applications that connect different parts of an application into a seamless user experience, it can also be a burden to manage them as the complexity of applications grow.

Next.js has helped reduce complexity in developing with routes by introducing:

With language models becoming better at reasoning, we believe that there is a future where developers only write core application specific components while models take care of routing them based on the user's state in an application.

With generative user interfaces, the language model decides which user interface to render based on the user's state in the application, giving users the flexibility to interact with your application in a conversational manner instead of navigating through a series of predefined routes.

### Routing by parameters

For routes like:

that have segments dependent on dynamic data, the language model can generate the correct parameters and render the user interface.

For example, when you're in a search application, you can ask the language model to search for artworks from different artists. The language model will call the search function with the artist's name as a parameter and render the search results.

Media Search

Let your users see more than words can say by rendering components directly within your search experience.

### Routing by sequence

For actions that require a sequence of steps to be completed by navigating through different routes, the language model can generate the correct sequence of routes to complete in order to fulfill the user's request.

For example, when you're in a calendar application, you can ask the language model to schedule a happy hour evening with your friends. The language model will then understand your request and will perform the right sequence of tool calls to:

Planning an Event

The model calls functions and generates interfaces based on user intent, acting like a router.

Just by defining functions to lookup contacts, pull events from a calendar, and search for nearby locations, the model is able to sequentially navigate the routes for you.

To learn more, check out these examples using the streamUI function to stream generative user interfaces to the client based on the response from the language model.





Page URL: https://sdk.vercel.ai/docs/advanced/multistep-interfaces

# Multistep Interfaces

Multistep interfaces refer to user interfaces that require multiple independent steps to be executed in order to complete a specific task.

In order to understand multistep interfaces, it is important to understand two concepts:

Tool composition is the process of combining multiple tools to create a new tool. This is a powerful concept that allows you to break down complex tasks into smaller, more manageable steps.

Application context refers to the state of the application at any given point in time. This includes the user's input, the output of the language model, and any other relevant information.

When designing multistep interfaces, you need to consider how the tools in your application can be composed together to form a coherent user experience as well as how the application context changes as the user progresses through the interface.

## Application Context

The application context can be thought of as the conversation history between the user and the language model. The richer the context, the more information the model has to generate relevant responses.

In the context of multistep interfaces, the application context becomes even more important. This is because the user's input in one step may affect the output of the model in the next step.

For example, consider a meal logging application that helps users track their daily food intake. The language model is provided with the following tools:

When the user logs a meal, the model generates a response confirming the meal has been logged.

```txt
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.
```

Now when the user decides to delete the meal, the model should be able to reference the previous step to identify the meal to be deleted.

```txt
User: Log a chicken shawarma for lunch.
Tool: log_meal("chicken shawarma", "250g", "12:00 PM")
Model: Chicken shawarma has been logged for lunch.
...
...
User: I skipped lunch today, can you update my log?
Tool: delete_meal("chicken shawarma")
Model: Chicken shawarma has been deleted from your log.
```

In this example, managing the application context is important for the model to generate the correct response. The model needs to have information about the previous actions in order for it to use generate the parameters for the delete_meal tool.

## Tool Composition

Tool composition is the process of combining multiple tools to create a new tool. This involves defining the inputs and outputs of each tool, as well as how they interact with each other.

The design of how these tools can be composed together to form a multistep interface is crucial to both the user experience of your application and the model's ability to generate the correct output.

For example, consider a flight booking assistant that can help users book flights. The assistant can be designed to have the following tools:

The searchFlights tool is called when the user wants to lookup flights for a specific route. This would typically mean the tool should be able to take in parameters like the origin and destination of the flight.

The lookupFlight tool is called when the user wants to get more details about a specific flight. This would typically mean the tool should be able to take in parameters like the flight number and return information about seat availability.

The bookFlight tool is called when the user decides to book a flight. In order to identify the flight to book, the tool should be able to take in parameters like the flight number, trip date, and passenger details.

So the conversation between the user and the model could look like this:

```txt
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself and my wife.
Tool: lookupFlight("BA123") -> "4 seats available"
Model: Sure, there are seats available! Can you provide the names of the passengers?
User: John Doe and Jane Doe.
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

In the last tool call, the bookFlight tool does not include passenger details as it is not available in the application context. As a result, it requests the user to provide the passenger details before proceeding with the booking.

Looking up passenger information could've been another tool that the model could've called before calling the bookFlight tool assuming that the user is logged into the application. This way, the model does not have to ask the user for the passenger details and can proceed with the booking.

```txt
User: I want to book a flight from New York to London.
Tool: searchFlights("New York", "London")
Model: Here are the available flights from New York to London.
User: I want to book flight number BA123 on 12th December for myself an my wife.
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: bookFlight("BA123", "12th December", ["John Doe", "Jane Doe"])
Model: Your flight has been booked!
```

The lookupContacts tool is called before the bookFlight tool to ensure that the passenger details are available in the application context when booking the flight. This way, the model can reduce the number of steps required from the user and use its ability to call tools that populate its context and use that information to complete the booking process.

Now, let's introduce another tool called lookupBooking that can be used to show booking details by taking in the name of the passenger as parameter. This tool can be composed with the existing tools to provide a more complete user experience.

```txt
User: What's the status of my wife's upcoming flight?
Tool: lookupContacts() -> ["John Doe", "Jane Doe"]
Tool: lookupBooking("Jane Doe") -> "BA123 confirmed"
Tool: lookupFlight("BA123") -> "Flight BA123 is scheduled to depart on 12th December."
Model: Your wife's flight BA123 is confirmed and scheduled to depart on 12th December.
```

In this example, the lookupBooking tool is used to provide the user with the status of their wife's upcoming flight. By composing this tool with the existing tools, the model is able to generate a response that includes the booking status and the departure date of the flight without requiring the user to provide additional information.

As a result, the more tools you design that can be composed together, the more complex and powerful your application can become.





Page URL: https://sdk.vercel.ai/docs/advanced/vercel-deployment-guide

# Vercel Deployment Guide

In this guide, you will deploy an AI application to Vercel using Next.js (App Router).

Vercel is a platform for developers that provides the tools, workflows, and infrastructure you need to build and deploy your web apps faster, without the need for additional configuration.

Vercel allows for automatic deployments on every branch push and merges onto the production branch of your GitHub, GitLab, and Bitbucket projects. It is a great option for deploying your AI application.

## Before You Begin

To follow along with this guide, you will need:

This guide will teach you how to deploy the application you built in the Next.js (App Router) quickstart tutorial to Vercel. If you haven’t completed the quickstart guide, you can start with this repo.

## Commit Changes

Vercel offers a powerful git-centered workflow that automatically deploys your application to production every time you push to your repository’s main branch.

Before committing your local changes, make sure that you have a .gitignore. Within your .gitignore, ensure that you are excluding your environment variables (.env) and your node modules (node_modules).

If you have any local changes, you can commit them by running the following commands:

```bash
git add .
git commit -m "init"
```

## Create Git Repo

You can create a GitHub repository from within your terminal, or on github.com. For this tutorial, you will use the GitHub CLI (more info here).

To create your GitHub repository:

Once you have created your repository, GitHub will redirect you to your new repository.

Note: if you run into the error "error: remote origin already exists.", this is because your local repository is still linked to the repository you cloned. To "unlink", you can run the following command:

```bash
rm -rf .git
git init
git add .
git commit -m "init"
```

Rerun the code snippet from the previous step.

## Import Project in Vercel

On the New Project page, under the Import Git Repository section, select the Git provider that you would like to import your project from. Follow the prompts to sign in to your GitHub account.

Once you have signed in, you should see your newly created repository from the previous step in the "Import Git Repository" section. Click the "Import" button next to that project.

### Add Environment Variables

Your application stores uses environment secrets to store your OpenAI API key using a .env.local file locally in development. To add this API key to your production deployment, expand the "Environment Variables" section and paste in your .env.local file. Vercel will automatically parse your variables and enter them in the appropriate key:value format.

### Deploy

Press the Deploy button. Vercel will create the Project and deploy it based on the chosen configurations.

### Enjoy the confetti!

To view your deployment, select the Project in the dashboard and then select the Domain. This page is now visible to anyone who has the URL.

## Considerations

When deploying an AI application, there are infrastructure-related considerations to be aware of.

### Function Duration

In most cases, you will call the large language model (LLM) on the server. By default, Vercel serverless functions have a maximum duration of 10 seconds on the Hobby Tier. Depending on your prompt, it can take an LLM more than this limit to complete a response. If the response is not resolved within this limit, the server will throw an error.

You can specify the maximum duration of your Vercel function using route segment config. To update your maximum duration, add the following route segment config to the top of your route handler or the page which is calling your server action.

```ts
export const maxDuration = 30;
```

You can increase the max duration to 60 seconds on the Hobby Tier. For other tiers, see the documentation for limits.

## Security Considerations

Given the high cost of calling an LLM, it's important to have measures in place that can protect your application from abuse.

### Rate Limit

Rate limiting is a method used to regulate network traffic by defining a maximum number of requests that a client can send to a server within a given time frame.

Follow this guide to add rate limiting to your application.

### Firewall

A firewall helps protect your applications and websites from DDoS attacks and unauthorized access.

Vercel Firewall is a set of tools and infrastructure, created specifically with security in mind. It automatically mitigates DDoS attacks and Enterprise teams can get further customization for their site, including dedicated support and custom rules for IP blocking.

## Troubleshooting





Page URL: https://sdk.vercel.ai/docs/reference

# API Reference





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core

# AI SDK Core

AI SDK Core is a set of functions that allow you to interact with language models and other AI models.
These functions are designed to be easy-to-use and flexible, allowing you to generate text, structured data,
and embeddings from language models and other AI models.

AI SDK Core contains the following main functions:

It also contains the following helper functions:





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-text

# generateText()

Generates text and calls tools for a given prompt using a language model.

It is ideal for non-interactive use cases such as automation tasks where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.

```ts
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';


const { text } = await generateText({
  model: openai('gpt-4-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
});


console.log(text);
```

To see generateText in action, check out these examples.





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-text

# streamText()

Streams text generations from a language model.

You can use the streamText function for interactive use cases such as chat bots and other real-time applications. You can also generate UI components with tools.

```ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';


const { textStream } = await streamText({
  model: openai('gpt-4-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
});


for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

To see streamText in action, check out these examples.




Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/generate-object

# generateObject()

Generates a typed, structured object for a given prompt and schema using a language model.

It can be used to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.

#### Example: generate an object using a schema

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


console.log(JSON.stringify(object, null, 2));
```

#### Example: generate an array using a schema

For arrays, you specify the schema of the array items.

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';


const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});
```

#### Example: generate JSON without a schema

```ts
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';


const { object } = await generateObject({
  model: openai('gpt-4-turbo'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});
```

To see generateObject in action, check out the additional examples.




Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/stream-object

# streamObject()

Streams a typed, structured object for a given prompt and schema using a language model.

It can be used to force the language model to return structured data, e.g. for information extraction, synthetic data generation, or classification tasks.

#### Example: stream an object using a schema

```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';


const { partialObjectStream } = await streamObject({
  model: openai('gpt-4-turbo'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      steps: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});


for await (const partialObject of partialObjectStream) {
  console.clear();
  console.log(partialObject);
}
```

#### Example: stream an array using a schema

For arrays, you specify the schema of the array items.
You can use elementStream to get the stream of complete array elements.

```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';


const { elementStream } = await streamObject({
  model: openai('gpt-4-turbo'),
  output: 'array',
  schema: z.object({
    name: z.string(),
    class: z
      .string()
      .describe('Character class, e.g. warrior, mage, or thief.'),
    description: z.string(),
  }),
  prompt: 'Generate 3 hero descriptions for a fantasy role playing game.',
});


for await (const hero of elementStream) {
  console.log(hero);
}
```

#### Example: generate JSON without a schema

```ts
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';


const { partialObjectStream } = await streamObject({
  model: openai('gpt-4-turbo'),
  output: 'no-schema',
  prompt: 'Generate a lasagna recipe.',
});


for await (const partialObject of partialObjectStream) {
  console.clear();
  console.log(partialObject);
}
```

To see streamObject in action, check out the additional examples.





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/embed

# embed()

Generate an embedding for a single value using an embedding model.

This is ideal for use cases where you need to embed a single value to e.g. retrieve similar items or to use the embedding in a downstream task.

```ts
import { openai } from '@ai-sdk/openai';
import { embed } from 'ai';


const { embedding } = await embed({
  model: openai.embedding('text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```



Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/embed-many

# embedMany()

Embed several values using an embedding model. The type of the value is defined
by the embedding model.

embedMany automatically splits large requests into smaller chunks if the model
has a limit on how many embeddings can be generated in a single call.

```ts
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';


const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
});
```


Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/tool

# tool()

Tool is a helper function that infers the tool paramaters for its execute method.

It does not have any runtime behavior, but it helps TypeScript infer the types of the parameters for the execute method.

Without this helper function, TypeScript is unable to connect the parameters property to the execute method,
and the argument types of execute cannot be inferred.

```ts
import { tool } from 'ai';
import { z } from 'zod';


export const weatherTool = tool({
  description: 'Get the weather in a location',
  parameters: z.object({
    location: z.string().describe('The location to get the weather for'),
  }),
  // location below is inferred to be a string:
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});
```

## Import

## API Signature

### Parameters

### tool:

### description?:

### parameters:

### execute?:

### Returns

The tool that was passed in.





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/json-schema

# jsonSchema()

jsonSchema is a helper function that creates a JSON schema object that is compatible with the AI SDK.
It takes the JSON schema and an optional validation function as inputs, and can be typed.

You can use it to generate structured data and in tools.

jsonSchema is an alternative to using Zod schemas that provides you with flexibility in dynamic situations
(e.g. when using OpenAPI definitions) or for using other validation libraries.

```ts
import { jsonSchema } from 'ai';


const mySchema = jsonSchema<{
  recipe: {
    name: string;
    ingredients: { name: string; amount: string }[];
    steps: string[];
  };
}>({
  type: 'object',
  properties: {
    recipe: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        ingredients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              amount: { type: 'string' },
            },
            required: ['name', 'amount'],
          },
        },
        steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name', 'ingredients', 'steps'],
    },
  },
  required: ['recipe'],
});
```

## Import

## API Signature

### Parameters

### schema:

### options:

### validate?:

### Returns

A JSON schema object that is compatible with the AI SDK.





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/core-message

# CoreMessage

CoreMessage represents the fundamental message structure used with AI SDK Core functions. It encompasses various message types that can be used in the messages field of any AI SDK Core functions.

## CoreMessage Types

### CoreSystemMessage

A system message that can contain system information.

```typescript
type CoreSystemMessage = {
  role: 'system';
  content: string;
};
```

Using the "system" part of the prompt is strongly recommended to enhance resilience
against prompt injection attacks and because not all providers support multiple
system messages.

### CoreUserMessage

A user message that can contain text or a combination of text and images.

```typescript
type CoreUserMessage = {
  role: 'user';
  content: UserContent;
};


type UserContent = string | Array<TextPart | ImagePart>;
```

### CoreAssistantMessage

An assistant message that can contain text, tool calls, or a combination of both.

```typescript
type CoreAssistantMessage = {
  role: 'assistant';
  content: AssistantContent;
};


type AssistantContent = string | Array<TextPart | ToolCallPart>;
```

### CoreToolMessage

A tool message that contains the result of one or more tool calls.

```typescript
type CoreToolMessage = {
  role: 'tool';
  content: ToolContent;
};


type ToolContent = Array<ToolResultPart>;
```

## CoreMessage Parts

### TextPart

Represents a text content part of a prompt. It contains a string of text.

```typescript
export interface TextPart {
  type: 'text';
  /**
   * The text content.
   */
  text: string;
}
```

### ImagePart

Represents an image part in a user message.

```typescript
export interface ImagePart {
  type: 'image';
  /**
   * Image data. Can either be:
   * - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
   * - URL: a URL that points to the image
   */
  image: DataContent | URL;
  /**
   * Optional mime type of the image.
   */
  mimeType?: string;
}
```

### ToolCallPart

Represents a tool call content part of a prompt, typically generated by the AI model.

```typescript
export interface ToolCallPart {
  type: 'tool-call';
  /**
   * ID of the tool call. This ID is used to match the tool call with the tool result.
   */
  toolCallId: string;
  /**
   * Name of the tool that is being called.
   */
  toolName: string;
  /**
   * Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
   */
  args: unknown;
}
```

### ToolResultPart

Represents the result of a tool call in a tool message.

```typescript
export interface ToolResultPart {
  type: 'tool-result';
  /**
   * ID of the tool call that this result is associated with.
   */
  toolCallId: string;
  /**
   * Name of the tool that generated this result.
   */
  toolName: string;
  /**
   * Result of the tool call. This is a JSON-serializable object.
   */
  result: unknown;
  /**
   * Optional flag if the result is an error or an error message.
   */
  isError?: boolean;
}
```





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/provider-registry

# experimental_createProviderRegistry()

When you work with multiple providers and models, it is often desirable to manage them
in a central place and access the models through simple string ids.

createProviderRegistry lets you create a registry with multiple providers that you
can access by their ids.

## Import

## API Signature

Registers a language model provider with a given id.

### Parameters

### providers:

### Returns

The experimental_createProviderRegistry function returns a experimental_ProviderRegistry instance. It has the following methods:

### languageModel:

### textEmbeddingModel:

## Examples

### Setup

You can create a registry with multiple providers and models using createProviderRegistry.

```ts
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai';


export const registry = createProviderRegistry({
  // register provider with prefix and default setup:
  anthropic,


  // register provider with prefix and custom setup:
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  }),
});
```

### Language models

You can access language models by using the languageModel method on the registry.
The provider id will become the prefix of the model id: providerId:modelId.

```ts
import { generateText } from 'ai';
import { registry } from './registry';


const { text } = await generateText({
  model: registry.languageModel('openai:gpt-4-turbo'),
  prompt: 'Invent a new holiday and describe its traditions.',
});
```

### Text embedding models

You can access text embedding models by using the textEmbeddingModel method on the registry.
The provider id will become the prefix of the model id: providerId:modelId.

```ts
import { embed } from 'ai';
import { registry } from './registry';


const { embedding } = await embed({
  model: registry.textEmbeddingModel('openai:text-embedding-3-small'),
  value: 'sunny day at the beach',
});
```





Page URL: https://sdk.vercel.ai/docs/reference/ai-sdk-core/cosine-similarity

# cosineSimilarity()

When you want to compare the similarity of embeddings, standard vector similarity metrics
like cosine similarity are often used.

cosineSimilarity calculates the cosine similarity between two vectors.
A high value (close to 1) indicates that the vectors are very similar, while a low value (close to -1) indicates that they are different.

```ts
import { openai } from '@ai-sdk/openai';
import { cosineSimilarity, embedMany } from 'ai';


const { embeddings } = await embedMany({
  model: openai.embedding('text-embedding-3-small'),
  values: ['sunny day at the beach', 'rainy afternoon in the city'],
});


console.log(
  `cosine similarity: ${cosineSimilarity(embeddings[0], embeddings[1])}`,
);
```
