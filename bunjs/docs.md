

Page URL: https://bun.sh/docs

# What is Bun?

Edit on GitHub

Bun is an all-in-one toolkit for JavaScript and TypeScript apps. It ships as a single executable called bun​.

At its core is the Bun runtime, a fast JavaScript runtime designed as a drop-in replacement for Node.js. It's written in Zig and powered by JavaScriptCore under the hood, dramatically reducing startup times and memory usage.

```typescript
bun run index.tsx  # TS and JSX supported out of the box
```

​​The bun​ command-line tool also implements a test runner, script runner, and Node.js-compatible package manager, all significantly faster than existing tools and usable in existing Node.js projects with little to no changes necessary.

```typescript
bun run start                 # run the `start` script
```

​​Bun is still under development. Use it to speed up your development workflows or run simpler production code in resource-constrained environments like serverless functions. We're working on more complete Node.js compatibility and integration with existing frameworks. Join the Discord and watch the GitHub repository to keep tabs on future releases.

Get started with one of the quick links below, or read on to learn more about Bun.

Install Bun

Do the quickstart

Install a package

Use a project template

Bundle code for production

Build an HTTP server

Build a Websocket server

Read and write files

Run SQLite queries

Write and run tests

## What is a runtime?

JavaScript (or, more formally, ECMAScript) is just a specification for a programming language. Anyone can write a JavaScript engine that ingests a valid JavaScript program and executes it. The two most popular engines in use today are V8 (developed by Google) and JavaScriptCore (developed by Apple). Both are open source.

### Browsers

But most JavaScript programs don't run in a vacuum. They need a way to access the outside world to perform useful tasks. This is where runtimes come in. They implement additional APIs that are then made available to the JavaScript programs they execute. Notably, browsers ship with JavaScript runtimes that implement a set of Web-specific APIs that are exposed via the global window object. Any JavaScript code executed by the browser can use these APIs to implement interactive or dynamic behavior in the context of the current webpage.

### Node.js

Similarly, Node.js is a JavaScript runtime that can be used in non-browser environments, like servers. JavaScript programs executed by Node.js have access to a set of Node.js-specific globals like Buffer, process, and __dirname in addition to built-in modules for performing OS-level tasks like reading/writing files (node:fs) and networking (node:net, node:http). Node.js also implements a CommonJS-based module system and resolution algorithm that pre-dates JavaScript's native module system.

Bun is designed as a faster, leaner, more modern replacement for Node.js.

## Design goals

Bun is designed from the ground-up with today's JavaScript ecosystem in mind.

Bun is more than a runtime. The long-term goal is to be a cohesive, infrastructural toolkit for building apps with JavaScript/TypeScript, including a package manager, transpiler, bundler, script runner, test runner, and more.

Next

Installation

Edit on GitHub



Page URL: https://bun.sh/docs/installation

# Installation

Edit on GitHub

Bun ships as a single executable that can be installed a few different ways.

## macOS and Linux

Linux users — The unzip package is required to install Bun. Kernel version 5.6 or higher is strongly recommended, but the minimum is 5.1.

```typescript
curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
```

```typescript
npm install -g bun # the last `npm` command you'll ever need
```

```typescript
brew tap oven-sh/bun # for macOS and Linux
```

```typescript
docker pull oven/bun
```

```typescript
proto install bun
```

## Windows

Bun provides a limited, experimental native build for Windows. At the moment, only the Bun runtime is supported.

The test runner, package manager, and bundler are still under development. The following commands have been disabled.

## Upgrading

Once installed, the binary can upgrade itself.

```typescript
bun upgrade
```

Homebrew users — To avoid conflicts with Homebrew, use brew upgrade bun instead.

proto users - Use proto install bun --pin instead.

Bun automatically releases an (untested) canary build on every commit to main. To upgrade to the latest canary build:

```typescript
bun upgrade --canary
```

View canary build

## TypeScript

To install TypeScript definitions for Bun's built-in APIs in your project, install bun-types.

```typescript
bun add -d bun-types # dev dependency
```

Then include "bun-types" in the compilerOptions.types in your tsconfig.json:

```typescript
{
  "compilerOptions": {
    "types": ["bun-types"]
  }
}
```

Refer to Ecosystem > TypeScript for a complete guide to TypeScript support in Bun.

## Completions

Shell auto-completion should be configured automatically when Bun is installed.

If not, run the following command. It uses $SHELL to determine which shell you're using and writes a completion file to the appropriate place on disk. It's automatically re-run on every bun upgrade.

```typescript
bun completions
```

To write the completions to a custom location:

```typescript
bun completions > path-to-file      # write to file
```

Previous

What is Bun?

Next

Quickstart

Edit on GitHub



Page URL: https://bun.sh/docs/quickstart

# Quickstart

Edit on GitHub

Let's write a simple HTTP server using the built-in Bun.serve API. First, create a fresh directory.

```typescript
mkdir quickstart
```

Run bun init to scaffold a new project. It's an interactive tool; for this tutorial, just press enter to accept the default answer for each prompt.

```typescript
bun init
```

Since our entry point is a *.ts file, Bun generates a tsconfig.json for you. If you're using plain JavaScript, it will generate a jsconfig.json instead.

## Run a file

Open index.ts and paste the following code snippet, which implements a simple HTTP server with Bun.serve.

```typescript
const server = Bun.serve({
  port: 3000,
  fetch(req) {
    return new Response(`Bun!`);
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
```

Run the file from your shell.

```typescript
bun index.ts
```

Visit http://localhost:3000 to test the server. You should see a simple page that says "Bun!".

## Run a script

Bun can also execute "scripts" from your package.json. Add the following script:

```typescript
{
  "name": "quickstart",
  "module": "index.ts",
  "type": "module",
  "scripts": {
    "start": "bun run index.ts"
  },
  "devDependencies": {
    "bun-types": "^0.7.0"
  }
}
```

Then run it with bun run start.

```typescript
bun run start
```

⚡️ Performance — bun run is roughly 28x faster than npm run (6ms vs 170ms of overhead).

## Install a package

Let's make our server a little more interesting by installing a package. First install the figlet package and its type declarations. Figlet is a utility for converting strings into ASCII art.

```typescript
bun add figlet
```

Update index.ts to use figlet in the fetch handler.

```typescript
import figlet from "figlet";

const server = Bun.serve({
  fetch() {
    const body = figlet.textSync('Bun!');
    return new Response(body);
    return new Response(`Bun!`);
  },
  port: 3000,
});
```

Restart the server and refresh the page. You should see a new ASCII art banner.

```typescript
____              _
 | __ ) _   _ _ __ | |
 |  _ \| | | | '_ \| |
 | |_) | |_| | | | |_|
 |____/ \__,_|_| |_(_)
```

Previous

Installation

Next

Templates

Edit on GitHub



Page URL: https://bun.sh/docs/templates

# Templates

Edit on GitHub

## bun init

Scaffold an empty project with the interactive bun init command.

```typescript
bun init
```

Press enter to accept the default answer for each prompt, or pass the -y flag to auto-accept the defaults.

## bun create

Note — You don’t need bun create to use Bun. You don’t need any configuration at all. This command exists to make getting started a bit quicker and easier.

Template a new Bun project with bun create. This is a flexible command that can be used to create a new project with a ```create-<template?>``` npm package, a GitHub repo, or a local template.

### From npm

```typescript
bun create <template> [<destination>]
```

Assuming you don't have a local template with the same name, this command will download and execute the ```create-<template>``` package from npm. The following two commands will behave identically:

```typescript
bun create remix
```

Refer to the documentation of the associated ```create-<template>``` package for complete documentation and usage instructions.

### From GitHub

This will download the contents of the GitHub repo to disk.

```typescript
bun create <user>/<repo>
```

Optionally specify a name for the destination folder. If no destination is specified, the repo name will be used.

```typescript
bun create <user>/<repo> mydir
```

Bun will perform the following steps:

By default Bun will not overwrite any existing files. Use the --force flag to overwrite existing files.

### From a local template

⚠️ Warning — Unlike remote templates, running bun create with a local template will delete the entire destination folder if it already exists! Be careful.

Bun's templater can be extended to support custom templates defined on your local file system. These templates should live in one of the following directories:

Note — You can customize the global template path by setting the BUN_CREATE_DIR environment variable.

To create a local template, navigate to $HOME/.bun-create and create a new directory with the desired name of your template.

```typescript
cd $HOME/.bun-create
```

Then, create a package.json file in that directory with the following contents:

```typescript
{
  "name": "foo"
}
```

You can run bun create foo elsewhere on your file system to verify that Bun is correctly finding your local template.

#### Setup logic

You can specify pre- and post-install setup scripts in the "bun-create" section of your local template's package.json.

```typescript
{
  "name": "@bun-examples/simplereact",
  "version": "0.0.1",
  "main": "index.js",
  "dependencies": {
    "react": "^17.0.2",
    "react-dom": "^17.0.2"
  },
  "bun-create": {
    "preinstall": "echo 'Installing...'", // a single command
    "postinstall": ["echo 'Done!'"], // an array of commands
    "start": "bun run echo 'Hello world!'"
  }
}
```

The following fields are supported. Each of these can correspond to a string or array of strings. An array of commands will be executed in order.

After cloning a template, bun create will automatically remove the "bun-create" section from package.json before writing it to the destination folder.

## Reference

### CLI flags

### Environment variables

How bun create works

When you run bun create ${template} ${destination}, here’s what happens:

IF remote template

GET registry.npmjs.org/@bun-examples/${template}/latest and parse it

GET registry.npmjs.org/@bun-examples/${template}/-/${template}-${latestVersion}.tgz

Decompress & extract ${template}-${latestVersion}.tgz into ${destination}

IF GitHub repo

Download the tarball from GitHub’s API

Decompress & extract into ${destination}

ELSE IF local template

Open local template folder

Delete destination directory recursively

Copy files recursively using the fastest system calls available (on macOS fcopyfile and Linux, copy_file_range). Do not copy or traverse into node_modules folder if exists (this alone makes it faster than cp)

Parse the package.json (again!), update name to be ${basename(destination)}, remove the bun-create section from the package.json and save the updated package.json to disk.

Auto-detect the npm client, preferring pnpm, yarn (v1), and lastly npm

Run any tasks defined in "bun-create": { "preinstall" } with the npm client

Run ${npmClient} install unless --no-install is passed OR no dependencies are in package.json

Run any tasks defined in "bun-create": { "preinstall" } with the npm client

Run git init; git add -A .; git commit -am "Initial Commit";

Previous

Quickstart

Next

bun run

Edit on GitHub



Page URL: https://bun.sh/docs/cli/run

# bun run

Edit on GitHub

The bun CLI can be used to execute JavaScript/TypeScript files, package.json scripts, and executable packages.

## Run a file

Compare to node "file"

Use bun run to execute a source file.

```typescript
bun run index.js
```

Bun supports TypeScript and JSX out of the box. Every file is transpiled on the fly by Bun's fast native transpiler before being executed.

```typescript
bun run index.js
```

The "naked" bun command is equivalent to bun run.

```typescript
bun index.tsx
```

### --watch

To run a file in watch mode, use the --watch flag.

```typescript
bun --watch run index.tsx
```

### --smol

In memory-constrained environments, use the --smol flag to reduce memory usage at a cost to performance.

```typescript
bun --smol run index.tsx
```

## Run a package.json script

Compare to npm run ```<script>``` or yarn ```<script>```

Your package.json can define a number of named "scripts" that correspond to shell commands.

```typescript
{
  // ... other fields
  "scripts": {
    "clean": "rm -rf dist && echo 'Done.'",
    "dev": "bun server.ts"
  }
}
```

Use bun ```<script>``` to execute these scripts.

```typescript
bun clean
```

Bun executes the script command in a subshell. It checks for the following shells in order, using the first one it finds: bash, sh, zsh.

⚡️ The startup time for npm run on Linux is roughly 170ms; with Bun it is 6ms.

If there is a name conflict between a package.json script and a built-in bun command (install, dev, upgrade, etc.) Bun's built-in command takes precedence. In this case, use the more explicit bun run command to execute your package script.

```typescript
bun run dev
```

To see a list of available scripts, run bun run without any arguments.

```typescript
bun run
```

Bun respects lifecycle hooks. For instance, bun run clean will execute preclean and postclean, if defined. If the pre(script>) fails, Bun will not execute the script itself.

## Environment variables

Bun automatically loads environment variables from .env files before running a file, script, or executable. The following files are checked, in order:

To debug environment variables, run bun run env to view a list of resolved environment variables.

## Performance

Bun is designed to start fast and run fast.

Under the hood Bun uses the JavaScriptCore engine, which is developed by Apple for Safari. In most cases, the startup and running performance is faster than V8, the engine used by Node.js and Chromium-based browsers. Its transpiler and runtime are written in Zig, a modern, high-performance language. On Linux, this translates into startup times 4x faster than Node.js.

Previous

Templates

Next

File types

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/loaders

# File types

Edit on GitHub

## TypeScript

Bun natively supports TypeScript out of the box. All files are transpiled on the fly by Bun's fast native transpiler before being executed. Similar to other build tools, Bun does not perform typechecking; it simply removes type annotations from the file.

```typescript
bun index.js
```

Some aspects of Bun's runtime behavior are affected by the contents of your tsconfig.json file. Refer to Runtime > TypeScript page for details.

## JSX

Bun supports .jsx and .tsx files out of the box. Bun's internal transpiler converts JSX syntax into vanilla JavaScript before execution.

```typescript
function Component(props: {message: string}) {
  return (
    <body>
      <h1 style={{color: 'red'}}>{props.message}</h1>
    </body>
  );
}

console.log(<Component message="Hello world!" />);
```

Bun implements special logging for JSX to make debugging easier.

```typescript
bun run react.tsx
```

## Text files

Text files can be imported as strings.

```typescript
import text from "./text.txt";
console.log(text);
// => "Hello world!"
```

```typescript
Hello world!
```

## JSON and TOML

JSON and TOML files can be directly imported from a source file. The contents will be loaded and returned as a JavaScript object.

```typescript
import pkg from "./package.json";
import data from "./data.toml";
```

## WASM

🚧 Experimental

Bun has experimental support for WASI, the WebAssembly System Interface. To run a .wasm binary with Bun:

```typescript
bun ./my-wasm-app.wasm
```

Note — WASI support is based on wasi-js. Currently, it only supports WASI binaries that use the wasi_snapshot_preview1 or wasi_unstable APIs. Bun's implementation is not fully optimized for performance; this will become more of a priority as WASM grows in popularity.

## Custom loaders

Support for additional file types can be implemented with plugins. Refer to Runtime > Plugins for full documentation.

Previous

bun run

Next

TypeScript

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/typescript

# TypeScript

Edit on GitHub

Bun treats TypeScript as a first-class citizen.

## Running .ts files

Bun can directly execute .ts and .tsx files just like vanilla JavaScript, with no extra configuration. If you import a .ts or .tsx file (or an npm module that exports these files), Bun internally transpiles it into JavaScript then executes the file.

Note — Similar to other build tools, Bun does not typecheck the files. Use tsc (the official TypeScript CLI) if you're looking to catch static type errors.

Is transpiling still necessary? — Because Bun can directly execute TypeScript, you may not need to transpile your TypeScript to run in production. Bun internally transpiles every file it executes (both .js and .ts), so the additional overhead of directly executing your .ts/.tsx source files is negligible.

That said, if you are using Bun as a development tool but still targeting Node.js or browsers in production, you'll still need to transpile.

## Configuring tsconfig.json

Bun supports a number of features that TypeScript doesn't support by default, such as extensioned imports, top-level await, and exports conditions. It also implements global APIs like the Bun. To enable these features, your tsconfig.json must be configured properly.

If you initialized your project with bun init, everything is already configured properly.

To get started, install the bun-types package.

```typescript
bun add -d bun-types # dev dependency
```

If you're using a canary build of Bun, use the canary tag. The canary package is updated on every commit to the main branch.

```typescript
bun add -d bun-types@canary
```

### Recommended compilerOptions

These are the recommended compilerOptions for a Bun project.

```typescript
{
  "compilerOptions": {
    // add Bun type definitions
    "types": ["bun-types"],

    // enable latest features
    "lib": ["esnext"],
    "module": "esnext",
    "target": "esnext",

    // if TS 5.x+
    "moduleResolution": "bundler",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "moduleDetection": "force",
    // if TS 4.x or earlier
    "moduleResolution": "nodenext",

    "jsx": "react-jsx", // support JSX
    "allowJs": true, // allow importing `.js` from `.ts`
    "esModuleInterop": true, // allow default imports for CommonJS modules

    // best practices
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  }
}
```

### Add DOM types

Settings "types": ["bun-types"] means TypeScript will ignore other global type definitions, including lib: ["dom"]. To add DOM types into your project, add the following triple-slash directives at the top of any TypeScript file in your project.

```typescript
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
```

The same applies to other global type definition libs like webworker.

## Path mapping

When resolving modules, Bun's runtime respects path mappings defined in compilerOptions.paths in your tsconfig.json. No other runtime does this.

Given the following tsconfig.json...

```typescript
{
  "compilerOptions": {
    "paths": {
      "data": ["./data.ts"]
    }
  }
}
```

...the import from "data" will work as expected.

```typescript
import { foo } from "data";
console.log(foo); // => "Hello world!"
```

```typescript
export const foo = "Hello world!"
```

Previous

File types

Next

JSX

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/jsx

# JSX

Edit on GitHub

Bun supports .jsx and .tsx files out of the box. Bun's internal transpiler converts JSX syntax into vanilla JavaScript before execution.

```typescript
function Component(props: {message: string}) {
  return (
    <body>
      <h1 style={{color: 'red'}}>{props.message}</h1>
    </body>
  );
}

console.log(<Component message="Hello world!" />);
```

## Configuration

Bun reads your tsconfig.json or jsconfig.json configuration files to determines how to perform the JSX transform internally. To avoid using either of these, the following options can also be defined in bunfig.toml.

The following compiler options are respected.

### jsx

How JSX constructs are transformed into vanilla JavaScript internally. The table below lists the possible values of jsx, along with their transpilation of the following simple JSX component:

```typescript
<Box width={5}>Hello</Box>
```

```typescript
{
  "jsx": "react"
}
```

```typescript
import { createElement } from "react";
createElement("Box", { width: 5 }, "Hello");
```

```typescript
{
  "jsx": "react-jsx"
}
```

```typescript
import { jsx } from "react/jsx-runtime";
jsx("Box", { width: 5 }, "Hello");
```

```typescript
{
  "jsx": "react-jsxdev"
}
```

```typescript
import { jsxDEV } from "react/jsx-dev-runtime";
jsxDEV(
  "Box",
  { width: 5, children: "Hello" },
  undefined,
  false,
  undefined,
  this,
);
```

The jsxDEV variable name is a convention used by React. The DEV suffix is a visible way to indicate that the code is intended for use in development. The development version of React is slower and includes additional validity checks & debugging tools.

```typescript
{
  "jsx": "preserve"
}
```

```typescript
// JSX is not transpiled
// "preserve" is not supported by Bun currently
<Box width={5}>Hello</Box>
```

### jsxFactory

Note — Only applicable when jsx is react.

The function name used to represent JSX constructs. Default value is "createElement". This is useful for libraries like Preact that use a different function name ("h").

```typescript
{
  "jsx": "react",
  "jsxFactory": "h"
}
```

```typescript
import { h } from "react";
h("Box", { width: 5 }, "Hello");
```

### jsxFragmentFactory

Note — Only applicable when jsx is react.

The function name used to represent JSX fragments such as <>Hello</>; only applicable when jsx is react. Default value is "Fragment".

```typescript
{
  "jsx": "react",
  "jsxFactory": "myjsx",
  "jsxFragmentFactory": "MyFragment"
}
```

```typescript
// input
<>Hello</>;

// output
import { myjsx, MyFragment } from "react";
createElement("Box", { width: 5 }, "Hello");
```

### jsxImportSource

Note — Only applicable when jsx is react-jsx or react-jsxdev.

The module from which the component factory function (createElement, jsx, jsxDEV, etc) will be imported. Default value is "react". This will typically be necessary when using a component library like Preact.

```typescript
{
  "jsx": "react"
  // jsxImportSource is not defined
  // default to "react"
}
```

```typescript
import { jsx } from "react/jsx-runtime";
jsx("Box", { width: 5, children: "Hello" });
```

```typescript
{
  "jsx": "react-jsx",
  "jsxImportSource": "preact"
}
```

```typescript
import { jsx } from "preact/jsx-runtime";
jsx("Box", { width: 5, children: "Hello" });
```

```typescript
{
  "jsx": "react-jsxdev",
  "jsxImportSource": "preact"
}
```

```typescript
// /jsx-runtime is automatically appended
import { jsxDEV } from "preact/jsx-dev-runtime";
jsxDEV(
  "Box",
  { width: 5, children: "Hello" },
  undefined,
  false,
  undefined,
  this,
);
```

### JSX pragma

All of these values can be set on a per-file basis using pragmas. A pragma is a special comment that sets a compiler option in a particular file.

```typescript
// @jsx h
```

```typescript
{
  "jsxFactory": "h"
}
```

```typescript
// @jsxFrag MyFragment
```

```typescript
{
  "jsxFragmentFactory": "MyFragment"
}
```

```typescript
// @jsxImportSource preact
```

```typescript
{
  "jsxImportSource": "preact"
}
```

## Logging

Bun implements special logging for JSX to make debugging easier. Given the following file:

```typescript
import { Stack, UserCard } from "./components";

console.log(
  <Stack>
    <UserCard name="Dom" bio="Street racer and Corona lover" />
    <UserCard name="Jakob" bio="Super spy and Dom's secret brother" />
  </Stack>
);
```

Bun will pretty-print the component tree when logged:

## Prop punning

The Bun runtime also supports "prop punning" for JSX. This is a shorthand syntax useful for assigning a variable to a prop with the same name.

```typescript
function Div(props: {className: string;}) {
  const {className} = props;

  // without punning
  return <div className={className} />;
  // with punning
  return <div {className} />;
}
```

Previous

TypeScript

Next

Bun APIs

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/bun-apis

# Bun APIs

Edit on GitHub

Bun implements a set of native APIs on the Bun global object and through a number of built-in modules. These APIs are heavily optimized and represent the canonical "Bun-native" way to implement some common functionality.

Bun strives to implement standard Web APIs wherever possible. Bun introduces new APIs primarily for server-side tasks where no standard exists, such as file I/O and starting an HTTP server. In these cases, Bun's approach still builds atop standard APIs like Blob, URL, and Request.

```typescript
Bun.serve({
  fetch(req: Request) {
    return new Response("Success!");
  },
});
```

Click the link in the right column to jump to the associated documentation.

Previous

JSX

Next

Web APIs

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/web-apis

# Web APIs

Edit on GitHub

Some Web APIs aren't relevant in the context of a server-first runtime like Bun, such as the DOM API or History API. Many others, though, are broadly useful outside of the browser context; when possible, Bun implements these Web-standard APIs instead of introducing new APIs.

The following Web APIs are partially or completely supported.

Debugging

console performance

Previous

Bun APIs

Next

Node.js compatibility

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/nodejs-apis

# Node.js compatibility

Edit on GitHub

Bun aims for complete Node.js API compatibility. Most npm packages intended for Node.js environments will work with Bun out of the box; the best way to know for certain is to try it.

This page is updated regularly to reflect compatibility status of the latest version of Bun. If you run into any bugs with a particular package, please open an issue. Opening issues for compatibility bugs helps us prioritize what to work on next.

## Built-in modules

### node:assert

🟢 Fully implemented.

### node:async_hooks

🟡 Only AsyncLocalStorage, and AsyncResource are implemented.

### node:buffer

🟢 Fully implemented.

### node:child_process

🟡 Missing Stream stdio, proc.gid, proc.uid. IPC has partial support and only current only works with other bun processes.

### node:cluster

🔴 Not implemented.

### node:console

🟡 Missing Console constructor.

### node:crypto

🟡 Missing crypto.Certificate crypto.ECDH crypto.KeyObject crypto.X509Certificate crypto.checkPrime{Sync} crypto.createPrivateKey crypto.createPublicKey crypto.createSecretKey crypto.diffieHellman crypto.generateKey{Sync} crypto.generateKeyPair{Sync} crypto.generatePrime{Sync} crypto.getCipherInfo crypto.{get|set}Fips crypto.hkdf crypto.hkdfSync crypto.secureHeapUsed crypto.setEngine crypto.sign crypto.verify. Some methods are not optimized yet.

### node:dgram

🔴 Not implemented.

### node:diagnostics_channel

🟢 Fully implemented.

### node:dns

🟢 Fully implemented.

### node:domain

🟢 Fully implemented.

### node:events

🟡 Missing on

### node:fs

🟡 Missing fs.fdatasync{Sync} fs.opendir{Sync}. fs.promises.open incorrectly returns a file descriptor instead of a FileHandle.

### node:http

🟢 Fully implemented.

### node:http2

🔴 Not implemented.

### node:https

🟢 Fully implemented.

### node:inspector

🔴 Not implemented.

### node:module

🟢 Fully implemented.

### node:net

🟡 Missing net.{get|set}DefaultAutoSelectFamily net.SocketAddress net.BlockList.

### node:os

🟢 Fully implemented.

### node:path

🟢 Fully implemented.

### node:perf_hooks

🟡 Only perf_hooks.performance.now() and perf_hooks.performance.timeOrigin are implemented. Recommended to use performance global instead of perf_hooks.performance.

### node:process

🟡 See Globals > process.

### node:punycode

🟢 Fully implemented. Deprecated by Node.js.

### node:querystring

🟢 Fully implemented.

### node:readline

🟢 Fully implemented.

### node:repl

🔴 Not implemented.

### node:stream

🟢 Fully implemented.

### node:string_decoder

🟢 Fully implemented.

### node:sys

🟡 See node:util.

### node:timers

🟢 Recommended to use global setTimeout, et. al. instead.

### node:tls

🟡 Missing tls.createSecurePair

### node:trace_events

🔴 Not implemented.

### node:tty

🟢 Fully implemented.

### node:url

🟡 Missing url.domainTo{ASCII|Unicode}. Recommended to use URL and URLSearchParams globals instead.

### node:util

🟡 Missing util.MIMEParams util.MIMEType util.getSystemErrorMap() util.getSystemErrorName() util.parseArgs() util.stripVTControlCharacters() util.transferableAbortController() util.transferableAbortSignal().

### node:v8

🔴 serialize and deserialize use JavaScriptCore's wire format instead of V8's. Otherwise, not implemented. For profiling, use bun:jsc instead.

### node:vm

🟡 Core functionality works, but VM modules are not implemented. ShadowRealm can be used.

### node:wasi

🟡 Partially implemented.

### node:worker_threads

🟡 Worker doesn't support the following options: eval, argv, execArgv, stdin, stdout, stderr, trackedUnmanagedFds, resourceLimits. Missing markAsUntransferable, moveMessagePortToContext, getHeapSnapshot.

### node:zlib

🟡 Missing zlib.brotli*. Has not been optimized.

## Globals

The table below lists all globals implemented by Node.js and Bun's current compatibility status.

### AbortController

🟢 Fully implemented.

### AbortSignal

🟢 Fully implemented.

### Blob

🟢 Fully implemented.

### Buffer

🟡 Incomplete implementation of base64 and base64url encodings.

### ByteLengthQueuingStrategy

🟢 Fully implemented.

### __dirname

🟢 Fully implemented.

### __filename

🟢 Fully implemented.

### atob()

🟢 Fully implemented.

### BroadcastChannel

🟢 Fully implemented.

### btoa()

🟢 Fully implemented.

### clearImmediate()

🟢 Fully implemented.

### clearInterval()

🟢 Fully implemented.

### clearTimeout()

🟢 Fully implemented.

### CompressionStream

🔴 Not implemented.

### console

🟡 Missing Console constructor.

### CountQueuingStrategy

🟢 Fully implemented.

### Crypto

🟢 Fully implemented.

### SubtleCrypto (crypto)

🟢 Fully implemented.

### CryptoKey

🟢 Fully implemented.

### CustomEvent

🟢 Fully implemented.

### DecompressionStream

🔴 Not implemented.

### Event

🟢 Fully implemented.

### EventTarget

🟢 Fully implemented.

### exports

🟢 Fully implemented.

### fetch

🟢 Fully implemented.

### FormData

🟢 Fully implemented.

### global

🟢 Implemented. This is an object containing all objects in the global namespace. It's rarely referenced directly, as its contents are available without an additional prefix, e.g. __dirname instead of global.__dirname.

### globalThis

🟢 Aliases to global.

### Headers

🟢 Fully implemented.

### MessageChannel

🟢 Fully implemented.

### MessageEvent

🟢 Fully implemented.

### MessagePort

🟢 Fully implemented.

### module

🟢 Fully implemented.

### PerformanceEntry

🔴 Not implemented.

### PerformanceMark

🔴 Not implemented.

### PerformanceMeasure

🔴 Not implemented.

### PerformanceObserver

🔴 Not implemented.

### PerformanceObserverEntryList

🔴 Not implemented.

### PerformanceResourceTiming

🔴 Not implemented.

### performance

🟢 Fully implemented.

### process

🟡 Missing process.allowedNodeEnvironmentFlags process.channel process.constrainedMemory() process.getActiveResourcesInfo/setActiveResourcesInfo() process.setuid/setgid/setegid/seteuid/setgroups() process.hasUncaughtExceptionCaptureCallback process.initGroups() process.report process.resourceUsage().

### queueMicrotask()

🟢 Fully implemented.

### ReadableByteStreamController

🟢 Fully implemented.

### ReadableStream

🟢 Fully implemented.

### ReadableStreamBYOBReader

🔴 Not implemented.

### ReadableStreamBYOBRequest

🔴 Not implemented.

### ReadableStreamDefaultController

🟢 Fully implemented.

### ReadableStreamDefaultReader

🟢 Fully implemented.

### require()

🟢 Fully implemented, as well as require.main, require.cache, and require.resolve

### Response

🟢 Fully implemented.

### Request

🟢 Fully implemented.

### setImmediate()

🟢 Fully implemented.

### setInterval()

🟢 Fully implemented.

### setTimeout()

🟢 Fully implemented.

### structuredClone()

🟢 Fully implemented.

### SubtleCrypto

🟢 Fully implemented.

### DOMException

🟢 Fully implemented.

### TextDecoder

🟢 Fully implemented.

### TextDecoderStream

🔴 Not implemented.

### TextEncoder

🟢 Fully implemented.

### TextEncoderStream

🔴 Not implemented.

### TransformStream

🟢 Fully implemented.

### TransformStreamDefaultController

🟢 Fully implemented.

### URL

🟢 Fully implemented.

### URLSearchParams

🟢 Fully implemented.

### WebAssembly

🟢 Fully implemented.

### WritableStream

🟢 Fully implemented.

### WritableStreamDefaultController

🟢 Fully implemented.

### WritableStreamDefaultWriter

🟢 Fully implemented.

Previous

Web APIs

Next

Plugins

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/plugins

# Plugins

Edit on GitHub

Bun provides a universal plugin API that can be used to extend both the runtime and bundler.

Plugins intercept imports and perform custom loading logic: reading files, transpiling code, etc. They can be used to add support for additional file types, like .scss or .yaml. In the context of Bun's bundler, plugins can be used to implement framework-level features like CSS extraction, macros, and client-server code co-location.

## Usage

A plugin is defined as simple JavaScript object containing a name property and a setup function. Register a plugin with Bun using the plugin function.

```typescript
import { plugin, type BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};
```

Plugins have to be registered before any other code runs! To achieve this, use the preload option in your bunfig.toml. Bun automatically loads the files/modules specified in preload before running a file.

```typescript
preload = ["./myPlugin.ts"]
```

To preload files before bun test:

```typescript
[test]
preload = ["./myPlugin.ts"]
```

## Third-party plugins

By convention, third-party plugins intended for consumption should export a factory function that accepts some configuration and returns a plugin object.

```typescript
import { plugin } from "bun";
import fooPlugin from "bun-plugin-foo";

plugin(
  fooPlugin({
    // configuration
  }),
);
```

Bun's plugin API is based on esbuild. Only a subset of the esbuild API is implemented, but some esbuild plugins "just work" in Bun, like the official MDX loader:

```typescript
import { plugin } from "bun";
import mdx from "@mdx-js/esbuild";

plugin(mdx());
```

## Loaders

Plugins are primarily used to extend Bun with loaders for additional file types. Let's look at a simple plugin that implements a loader for .yaml files.

```typescript
import { plugin } from "bun";

plugin({
  name: "YAML",
  async setup(build) {
    const { load } = await import("js-yaml");
    const { readFileSync } = await import("fs");

    // when a .yaml file is imported...
    build.onLoad({ filter: /\.(yaml|yml)$/ }, (args) => {

      // read and parse the file
      const text = readFileSync(args.path, "utf8");
      const exports = load(text) as Record<string, any>;

      // and returns it as a module
      return {
        exports,
        loader: "object", // special loader for JS objects
      };
    });
  },
});
```

With this plugin, data can be directly imported from .yaml files.

```typescript
import "./yamlPlugin.ts"
import {name, releaseYear} from "./data.yml"

console.log(name, releaseYear);
```

```typescript
name: Fast X
releaseYear: 2023
```

Note that the returned object has a loader property. This tells Bun which of its internal loaders should be used to handle the result. Even though we're implementing a loader for .yaml, the result must still be understandable by one of Bun's built-in loaders. It's loaders all the way down.

In this case we're using "object"—a built-in loader (intended for use by plugins) that converts a plain JavaScript object to an equivalent ES module. Any of Bun's built-in loaders are supported; these same loaders are used by Bun internally for handling files of various kinds. The table below is a quick reference; refer to Bundler > Loaders for complete documentation.

Loading a YAML file is useful, but plugins support more than just data loading. Let's look at a plugin that lets Bun import *.svelte files.

```typescript
import { plugin } from "bun";

plugin({
  name: "svelte loader",
  async setup(build) {
    const { compile } = await import("svelte/compiler");
    const { readFileSync } = await import("fs");

    // when a .svelte file is imported...
    build.onLoad({ filter: /\.svelte$/ }, ({ path }) => {

      // read and compile it with the Svelte compiler
      const file = readFileSync(path, "utf8");
      const contents = compile(file, {
        filename: path,
        generate: "ssr",
      }).js.code;

      // and return the compiled source code as "js"
      return {
        contents,
        loader: "js",
      };
    });
  },
});
```

Note: in a production implementation, you'd want to cache the compiled output and include additional error handling.

The object returned from build.onLoad contains the compiled source code in contents and specifies "js" as its loader. That tells Bun to consider the returned contents to be a JavaScript module and transpile it using Bun's built-in js loader.

With this plugin, Svelte components can now be directly imported and consumed.

```typescript
import "./sveltePlugin.ts";
import MySvelteComponent from "./component.svelte";

console.log(mySvelteComponent.render());
```

## Reading the config

Plugins can read and write to the build config with build.config.

```typescript
Bun.build({
  entrypoints: ["./app.ts"],
  outdir: "./dist",
  sourcemap: "external",
  plugins: [
    {
      name: "demo",
      setup(build) {
        console.log(build.config.sourcemap); // "external"

        build.config.minify = true; // enable minification

        // `plugins` is readonly
        console.log(`Number of plugins: ${build.config.plugins.length}`);
      },
    },
  ],
});
```

## Reference

```typescript
namespace Bun {
  function plugin(plugin: {
    name: string;
    setup: (build: PluginBuilder) => void;
  }): void;
}

type PluginBuilder = {
  onResolve: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string; importer: string }) => {
      path: string;
      namespace?: string;
    } | void,
  ) => void;
  onLoad: (
    args: { filter: RegExp; namespace?: string },
    callback: (args: { path: string }) => {
      loader?: Loader;
      contents?: string;
      exports?: Record<string, any>;
    },
  ) => void;
  config: BuildConfig;
};

type Loader = "js" | "jsx" | "ts" | "tsx" | "json" | "toml" | "object";
```

The onLoad method optionally accepts a namespace in addition to the filter regex. This namespace will be be used to prefix the import in transpiled code; for instance, a loader with a filter: /\.yaml$/ and namespace: "yaml:" will transform an import from ./myfile.yaml into yaml:./myfile.yaml.

Previous

Node.js compatibility

Next

Watch mode

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/hot

# Watch mode

Edit on GitHub

Bun supports two kinds of automatic reloading via CLI flags:

## --watch mode

Watch mode can be used with bun test or when running TypeScript, JSX, and JavaScript files.

To run a file in --watch mode:

```typescript
bun --watch index.tsx
```

To run your tests in --watch mode:

```typescript
bun --watch test
```

In --watch mode, Bun keeps track of all imported files and watches them for changes. When a change is detected, Bun restarts the process, preserving the same set of CLI arguments and environment variables used in the initial run. If Bun crashes, --watch will attempt to automatically restart the process.

⚡️ Reloads are fast. The filesystem watchers you're probably used to have several layers of libraries wrapping the native APIs or worse, rely on polling.

Instead, Bun uses operating system native filesystem watcher APIs like kqueue or inotify to detect changes to files. Bun also does a number of optimizations to enable it scale to larger projects (such as setting a high rlimit for file descriptors, statically allocated file path buffers, reuse file descriptors when possible, etc).

The following examples show Bun live-reloading a file as it is edited, with VSCode configured to save the file on each keystroke.

```typescript
bun run --watch watchy.tsx
```

```typescript
import { serve } from "bun";
console.log("I restarted at:", Date.now());

serve({
  port: 4003,

  fetch(request) {
    return new Response("Sup");
  },
});
```





Running bun test in watch mode and save-on-keypress enabled:

```typescript
bun --watch test
```





## --hot mode

Use bun --hot to enable hot reloading when executing code with Bun.

```typescript
bun --hot server.ts
```

Starting from the entrypoint (server.ts in the example above), Bun builds a registry of all imported source files (excluding those in node_modules) and watches them for changes. When a change is detected, Bun performs a "soft reload". All files are re-evaluated, but all global state (notably, the globalThis object) is persisted.

```typescript
// make TypeScript happy
declare global {
  var count: number;
}

globalThis.count ??= 0;
console.log(`Reloaded ${globalThis.count} times`);
globalThis.count++;

// prevent `bun run` from exiting
setInterval(function () {}, 1000000);
```

If you run this file with bun --hot server.ts, you'll see the reload count increment every time you save the file.

```typescript
bun --hot index.ts
```

Traditional file watchers like nodemon restart the entire process, so HTTP servers and other stateful objects are lost. By contrast, bun --hot is able to reflect the updated code without restarting the process.

### HTTP servers

Bun provides the following simplified API for implementing HTTP servers. Refer to API > HTTP for full details.

```typescript
import {serve} from "bun";

globalThis.count ??= 0;
globalThis.count++;

serve({
  fetch(req: Request) {
    return new Response(`Reloaded ${globalThis.count} times`);
  },
  port: 3000,
});
```

The file above is simply exporting an object with a fetch handler defined. When this file is executed, Bun interprets this as an HTTP server and passes the exported object into Bun.serve.

When you save the file, your HTTP server be reloaded with the updated code without the process being restarted. This results in seriously fast refresh speeds.

Note — In a future version of Bun, support for Vite's import.meta.hot is planned to enable better lifecycle management for hot reloading and to align with the ecosystem.

Implementation details

On hot reload, Bun:

This implementation isn't particularly optimized. It re-transpiles files that haven't changed. It makes no attempt at incremental compilation. It's a starting point.

Previous

Plugins

Next

Module resolution

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/modules

# Module resolution

Edit on GitHub

Module resolution in JavaScript is a complex topic.

The ecosystem is currently in the midst of a years-long transition from CommonJS modules to native ES modules. TypeScript enforces its own set of rules around import extensions that aren't compatible with ESM. Different build tools support path re-mapping via disparate non-compatible mechanisms.

Bun aims to provide a consistent and predictable module resolution system that just works. Unfortunately it's still quite complex.

## Syntax

Consider the following files.

```typescript
import { hello } from "./hello";

hello();
```

```typescript
export function hello() {
  console.log("Hello world!");
}
```

When we run index.ts, it prints "Hello world".

```typescript
bun index.ts
```

In this case, we are importing from ./hello, a relative path with no extension. To resolve this import, Bun will check for the following files in order:

Import paths are case-insensitive.

```typescript
import { hello } from "./hello";
import { hello } from "./HELLO";
import { hello } from "./hElLo";
```

Import paths can optionally include extensions. If an extension is present, Bun will only check for a file with that exact extension.

```typescript
import { hello } from "./hello";
import { hello } from "./hello.ts"; // this works
```

There is one exception: if you import from "*.js{x}", Bun will additionally check for a matching *.ts{x} file, to be compatible with TypeScript's ES module support.

```typescript
import { hello } from "./hello";
import { hello } from "./hello.ts"; // this works
import { hello } from "./hello.js"; // this also works
```

Bun supports both ES modules (import/export syntax) and CommonJS modules (require()/module.exports). The following CommonJS version would also work in Bun.

```typescript
const { hello } = require("./hello");

hello();
```

```typescript
function hello() {
  console.log("Hello world!");
}

exports.hello = hello;
```

That said, using CommonJS is discouraged in new projects.

## Resolution

Bun implements the Node.js module resolution algorithm, so you can import packages from node_modules with a bare specifier.

```typescript
import { stuff } from "foo";
```

The full specification of this algorithm are officially documented in the Node.js documentation; we won't rehash it here. Briefly: if you import from "foo", Bun scans up the file system for a node_modules directory containing the package foo.

Once it finds the foo package, Bun reads the package.json to determine how the package should be imported. To determine the package's entrypoint, Bun first reads the exports field and checks for the following conditions.

```typescript
{
  "name": "foo",
  "exports": {
    "bun": "./index.js",
    "worker": "./index.js",
    "node": "./index.js",
    "require": "./index.js", # if importer is CommonJS
    "import": "./index.mjs", # if importer is ES module
    "default": "./index.js",
  }
}
```

Whichever one of these conditions occurs first in the package.json is used to determine the package's entrypoint.

Bun respects subpath "exports" and "imports". Specifying any subpath in the "exports" map will prevent other subpaths from being importable.

```typescript
{
  "name": "foo",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json" // subpath
  }
}
```

Shipping TypeScript — Note that Bun supports the special "bun" export condition. If your library is written in TypeScript, you can publish your (un-transpiled!) TypeScript files to npm directly. If you specify your package's *.ts entrypoint in the "bun" condition, Bun will directly import and execute your TypeScript source files.

If exports is not defined, Bun falls back to "module" (ESM imports only) then "main".

```typescript
{
  "name": "foo",
  "module": "./index.js",
  "main": "./index.js"
}
```

## Path re-mapping

In the spirit of treating TypeScript as a first-class citizen, the Bun runtime will re-map import paths according to the compilerOptions.paths field in tsconfig.json. This is a major divergence from Node.js, which doesn't support any form of import path re-mapping.

```typescript
{
  "compilerOptions": {
    "paths": {
      "config": ["./config.ts"],         // map specifier to file
      "components/*": ["components/*"],  // wildcard matching
    }
  }
}
```

If you aren't a TypeScript user, you can create a jsconfig.json in your project root to achieve the same behavior.

## CommonJS

Bun has native support for CommonJS modules. ES Modules are the recommended module format, but CommonJS modules are still widely used in the Node.js ecosystem. Bun supports both module formats.

In Bun's JavaScript runtime, require can be used by both ES Modules and CommonJS modules. If the target module is an ES Module, require returns the module namespace object (equivalent to import * as). If the target module is a CommonJS module, require returns the module.exports object (as in Node.js).

### What is a CommonJS module?

In 2016, ECMAScript added support for ES Modules. ES Modules are the standard for JavaScript modules. However, millions of npm packages still use CommonJS modules.

CommonJS modules are modules that use module.exports to export values. Typically, require is used to import CommonJS modules.

```typescript
// my-commonjs.cjs
const stuff = require("./stuff");
module.exports = { stuff };
```

The biggest difference between CommonJS and ES Modules is that CommonJS modules are synchronous, while ES Modules are asynchronous. There are other differences too, like ES Modules support top-level await and CommonJS modules don't. ES Modules are always in strict mode, while CommonJS modules are not. Browsers do not have native support for CommonJS modules, but they do have native support for ES Modules (script type="module"). CommonJS modules are not statically analyzable, while ES Modules only allow static imports and exports.

### Importing CommonJS from ESM

You can import or require CommonJS modules from ESM modules.

```typescript
import { stuff } from "./my-commonjs.cjs";
import Stuff from "./my-commonjs.cjs";
const myStuff = require("./my-commonjs.cjs");
```

### Importing ESM from CommonJS

```typescript
// this works in Bun but not Node.js
const { stuff } = require("./my-esm.mjs");
```

### Importing CommonJS from CommonJS

```typescript
const { stuff } = require("./my-commonjs.cjs");
```

#### Top-level await

If you are using top-level await, you must use import() to import ESM modules from CommonJS modules.

```typescript
import("./my-esm.js").then(({ stuff }) => {
  // ...
});

// this will throw an error if "my-esm.js" uses top-level await
const { stuff } = require("./my-esm.js");
```

Low-level details of CommonJS interop in Bun

Bun's JavaScript runtime has native support for CommonJS. When Bun's JavaScript transpiler detects usages of module.exports, it treats the file as CommonJS. The module loader will then wrap the transpiled module in a function shaped like this:

```typescript
(function (module, exports, require) {
  // transpiled module
})(module, exports, require);
```

module, exports, and require are very much like the module, exports, and require in Node.js. These are assigned via a with scope in C++. An internal Map stores the exports object to handle cyclical require calls before the module is fully loaded.

Once the CommonJS module is successfully evaluated, a Synthetic Module Record is created with the default ES Module export set to module.exports and keys of the module.exports object are re-exported as named exports (if the module.exports object is an object).

When using Bun's bundler, this works differently. The bundler will wrap the CommonJS module in a require_${moduleName} function which returns the module.exports object.

Previous

Watch mode

Next

Auto-install

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/autoimport

# Auto-install

Edit on GitHub

If no node_modules directory is found in the working directory or higher, Bun will abandon Node.js-style module resolution in favor of the Bun module resolution algorithm.

Under Bun-style module resolution, all imported packages are auto-installed on the fly into a global module cache during execution (the same cache used by bun install).

```typescript
import { foo } from "foo"; // install `latest` version

foo();
```

The first time you run this script, Bun will auto-install "foo" and cache it. The next time you run the script, it will use the cached version.

## Version resolution

To determine which version to install, Bun follows the following algorithm:

## Cache behavior

Once a version or version range has been determined, Bun will:

## Installation

Packages are installed and cached into ```<cache>/<pkg>@<version>```, so multiple versions of the same package can be cached at once. Additionally, a symlink is created under ```<cache>/<pkg>/<version>``` to make it faster to look up all versions of a package that exist in the cache.

## Version specifiers

This entire resolution algorithm can be short-circuited by specifying a version or version range directly in your import statement.

```typescript
import { z } from "zod@3.0.0"; // specific version
import { z } from "zod@next"; // npm tag
import { z } from "zod@^3.20.0"; // semver range
```

## Benefits

This auto-installation approach is useful for a few reasons:

## Limitations

## FAQ

How is this different from what pnpm does?

With pnpm, you have to run pnpm install, which creates a node_modules folder of symlinks for the runtime to resolve. By contrast, Bun resolves dependencies on the fly when you run a file; there's no need to run any install command ahead of time. Bun also doesn't create a node_modules folder.

How is this different from Yarn Plug'N'Play does?

With Yarn, you must run yarn install before you run a script. By contrast, Bun resolves dependencies on the fly when you run a file; there's no need to run any install command ahead of time.

Yarn Plug'N'Play also uses zip files to store dependencies. This makes dependency loading slower at runtime, as random access reads on zip files tend to be slower than the equivalent disk lookup.

How is this different from what Deno does?

Deno requires an npm: specifier before each npm import, lacks support for import maps via compilerOptions.paths in tsconfig.json, and has incomplete support for package.json settings. Unlike Deno, Bun does not currently support URL imports.

Previous

Module resolution

Next

Configuration

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/configuration

# Configuration

Edit on GitHub

There are two primary mechanisms for configuring the behavior of Bun.

Configuring with bunfig.toml is optional. Bun aims to be zero-configuration out of the box, but is also highly configurable for advanced use cases. Your bunfig.toml should live in your project root alongside package.json.

You can also create a global configuration file at the following paths:

If both a global and local bunfig are detected, the results are shallow-merged, with local overridding global. CLI flags will override bunfig setting where applicable.

## Runtime

```typescript
# scripts to run before `bun run`ning a file or script
# useful for registering plugins
preload = ["./preload.ts"]

# equivalent to corresponding tsconfig compilerOptions
jsx = "react"
jsxFactory = "h"
jsxFragment = "Fragment"
jsxImportSource = "react"

# Reduce memory usage at the cost of performance
smol = true

# Set Bun's log level
logLevel = "debug" # "debug", "warn", "error"

[define]
# Replace any usage of "process.env.bagel" with the string `lox`.
# The values are parsed as JSON, except single-quoted strings are supported and `'undefined'` becomes `undefined` in JS.
# This will probably change in a future release to be just regular TOML instead. It is a holdover from the CLI argument parsing.
"process.env.bagel" = "'lox'"

[loader]
# When loading a .bagel file, run the JS parser
".bagel" = "js"
```

## Test runner

```typescript
[test]
# Scripts to run before all test files
preload = ["./setup.ts"]

# Reduce memory usage at the cost of performance
smol = true
```

## Package manager

Package management is a complex issue; to support a range of use cases, the behavior of bun install can be configured in bunfig.toml.

### Default flags

The following settings modify the core behavior of Bun's package management commands. The default values are shown below.

```typescript
[install]

# whether to install optionalDependencies
optional = true

# whether to install devDependencies
dev = true

# whether to install peerDependencies
peer = false

# equivalent to `--production` flag
production = false

# equivalent to `--frozen-lockfile` flag
frozenLockfile = false

# equivalent to `--dry-run` flag
dryRun = false
```

### Private scopes and registries

The default registry is https://registry.npmjs.org/. This can be globally configured in bunfig.toml:

```typescript
[install]
# set default registry as a string
registry = "https://registry.npmjs.org"
# set a token
registry = { url = "https://registry.npmjs.org", token = "123456" }
# set a username/password
registry = "https://username:password@registry.npmjs.org"
```

To configure scoped registries:

```typescript
[install.scopes]
# registry as string
myorg1 = "https://username:password@registry.myorg.com/"

# registry with username/password
# you can reference environment variables
myorg12 = { username = "myusername", password = "$NPM_PASS", url = "https://registry.myorg.com/" }

# registry with token
myorg3 = { token = "$npm_token", url = "https://registry.myorg.com/" }
```

### Cache

To configure caching behavior:

```typescript
[install]
# where `bun install --global` installs packages
globalDir = "~/.bun/install/global"

# where globally-installed package bins are linked
globalBinDir = "~/.bun/bin"

[install.cache]
# the directory to use for the cache
dir = "~/.bun/install/cache"

# when true, don't load from the global cache.
# Bun may still write to node_modules/.cache
disable = false

# when true, always resolve the latest versions from the registry
disableManifest = false
```

### Lockfile

To configure lockfile behavior:

```typescript
[install.lockfile]

# path to read bun.lockb from
path = "bun.lockb"

# path to save bun.lockb to
savePath = "bun.lockb"

# whether to save the lockfile to disk
save = true

# whether to save a non-Bun lockfile alongside bun.lockb
# only "yarn" is supported
print = "yarn"
```

### Debugging

```typescript
[debug]
# When navigating to a blob: or src: link, open the file in your editor
# If not, it tries $EDITOR or $VISUAL
# If that still fails, it will try Visual Studio Code, then Sublime Text, then a few others
# This is used by Bun.openInEditor()
editor = "code"

# List of editors:
# - "subl", "sublime"
# - "vscode", "code"
# - "textmate", "mate"
# - "idea"
# - "webstorm"
# - "nvim", "neovim"
# - "vim","vi"
# - "emacs"
```

## Environment variables

These environment variables are checked by Bun to detect functionality and toggle features.

Previous

Auto-install

Next

Debugger

Edit on GitHub



Page URL: https://bun.sh/docs/runtime/debugger

# Debugger

Edit on GitHub

Bun speaks the WebKit Inspector Protocol, so you can debug your code with an interactive debugger. For demonstration purposes, consider the following simple web server.

```typescript
Bun.serve({
  fetch(req){
    console.log(req.url);
    return new Response("Hello, world!");
  }
})
```

### --inspect

To enable debugging when running code with Bun, use the --inspect flag. This automatically starts a WebSocket server on an available port that can be used to introspect the running Bun process.

```typescript
bun --inspect server.ts
```

### --inspect-brk

The --inspect-brk flag behaves identically to --inspect, except it automatically injects a breakpoint at the first line of the executed script. This is useful for debugging scripts that run quickly and exit immediately.

### --inspect-wait

The --inspect-wait flag behaves identically to --inspect, except the code will not execute until a debugger has attached to the running process.

### Setting a port or URL for the debugger

Regardless of which flag you use, you can optionally specify a port number, URL prefix, or both.

```typescript
bun --inspect=4000 server.ts
```

## Debuggers

Various debugging tools can connect to this server to provide an interactive debugging experience. Bun hosts a web-based debugger at debug.bun.sh. It is a modified version of WebKit's Web Inspector Interface, which will look familiar to Safari users.

### debug.bun.sh

Bun hosts a web-based debugger at debug.bun.sh. It is a modified version of WebKit's Web Inspector Interface, which will look familiar to Safari users.

Open the provided debug.bun.sh URL in your browser to start a debugging session. From this interface, you'll be able to view the source code of the running file, view and set breakpoints, and execute code with the built-in console.

Let's set a breakpoint. Navigate to the Sources tab; you should see the code from earlier. Click on the line number 3 to set a breakpoint on our console.log(req.url) statement.

Then visit http://localhost:3000 in your web browser. This will send an HTTP request to our localhost web server. It will seem like the page isn't loading. Why? Because the program has paused execution at the breakpoint we set earlier.

Note how the UI has changed.

At this point there's a lot we can do to introspect the current execution environment. We can use the console at the bottom to run arbitrary code in the context of the program, with full access to the variables in scope at our breakpoint.

On the right side of the Sources pane, we can see all local variables currently in scope, and drill down to see their properties and methods. Here, we're inspecting the req variable.

In the upper left of the Sources pane, we can control the execution of the program.

Here's a cheat sheet explaining the functions of the control flow buttons.

Previous

Configuration

Next

bun install

Edit on GitHub



Page URL: https://bun.sh/docs/cli/install

# bun install

Edit on GitHub

The bun CLI contains a Node.js-compatible package manager designed to be a dramatically faster replacement for npm, yarn, and pnpm. It's a standalone tool that will work in pre-existing Node.js projects; if your project has a package.json, bun install can help you speed up your workflow.

⚡️ 25x faster — Switch from npm install to bun install in any Node.js project to make your installations up to 25x faster.

For Linux users

The minimum Linux Kernel version is 5.1. If you're on Linux kernel 5.1 - 5.5, bun install should still work, but HTTP requests will be slow due to a lack of support for io_uring's connect() operation.

If you're using Ubuntu 20.04, here's how to install a newer kernel:

```typescript
# If this returns a version >= 5.6, you don't need to do anything
uname -r

# Install the official Ubuntu hardware enablement kernel
sudo apt install --install-recommends linux-generic-hwe-20.04
```

## Manage dependencies

### bun install

To install all dependencies of a project:

```typescript
bun install
```

On Linux, bun install tends to install packages 20-100x faster than npm install. On macOS, it's more like 4-80x.





Running bun install will:

To install in production mode (i.e. without devDependencies):

```typescript
bun install --production
```

To install with reproducible dependencies, use --frozen-lockfile. If your package.json disagrees with bun.lockb, Bun will exit with an error. This is useful for production builds and CI environments.

```typescript
bun install --frozen-lockfile
```

To perform a dry run (i.e. don't actually install anything):

```typescript
bun install --dry-run
```

To modify logging verbosity:

```typescript
bun install --verbose # debug logging
```

Configuring behavior

The default behavior of bun install can be configured in bun.toml:

```typescript
[install]

# whether to install optionalDependencies
optional = true

# whether to install devDependencies
dev = true

# whether to install peerDependencies
peer = false

# equivalent to `--production` flag
production = false

# equivalent to `--frozen-lockfile` flag
frozenLockfile = false

# equivalent to `--dry-run` flag
dryRun = false
```

### bun add

To add a particular package:

```typescript
bun add preact
```

To specify a version, version range, or tag:

```typescript
bun add zod@3.20.0
```

To add a package as a dev dependency ("devDependencies"):

```typescript
bun add --dev @types/react
```

To add a package as an optional dependency ("optionalDependencies"):

```typescript
bun add --optional lodash
```

To add a package and pin to the resolved version, use --exact. This will resolve the version of the package and add it to your package.json with an exact version number instead of a version range.

```typescript
bun add react --exact
```

This will add the following to your package.json:

```typescript
{
  "dependencies": {
    // without --exact
    "react": "^18.2.0", // this matches >= 18.2.0 < 19.0.0

    // with --exact
    "react": "18.2.0" // this matches only 18.2.0 exactly
  }
}
```

To install a package globally:

```typescript
bun add --global cowsay # or `bun add -g cowsay`
```

Configuring global installation behavior

```typescript
[install]
# where `bun install --global` installs packages
globalDir = "~/.bun/install/global"

# where globally-installed package bins are linked
globalBinDir = "~/.bun/bin"
```

To view a complete list of options for a given command:

```typescript
bun add --help
```

### bun remove

To remove a dependency:

```typescript
bun remove preact
```

## Local packages (bun link)

Use bun link in a local directory to register the current package as a "linkable" package.

```typescript
cd /path/to/cool-pkg
```

This package can now be "linked" into other projects using bun link cool-pkg. This will create a symlink in the node_modules directory of the target project, pointing to the local directory.

```typescript
cd /path/to/my-app
```

In addition, the --save flag can be used to add cool-pkg to the dependencies field of your app's package.json with a special version specifier that tells Bun to load from the registered local directory instead of installing from npm:

```typescript
{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "cool-pkg": "link:cool-pkg"
  }
}
```

## Trusted dependencies

Unlike other npm clients, Bun does not execute arbitrary lifecycle scripts for installed dependencies, such as postinstall. These scripts represent a potential security risk, as they can execute arbitrary code on your machine.

To tell Bun to allow lifecycle scripts for a particular package, add the package to trustedDependencies in your package.json.

```typescript
{
  "name": "my-app",
  "version": "1.0.0",
  "trustedDependencies": ["my-trusted-package"]
}
```

Bun reads this field and will run lifecycle scripts for my-trusted-package.

## Git dependencies

To add a dependency from a git repository:

```typescript
bun install git@github.com:moment/moment.git
```

Bun supports a variety of protocols, including github, git, git+ssh, git+https, and many more.

```typescript
{
  "dependencies": {
    "dayjs": "git+https://github.com/iamkun/dayjs.git",
    "lodash": "git+ssh://github.com/lodash/lodash.git#4.17.21",
    "moment": "git@github.com:moment/moment.git",
    "zod": "github:colinhacks/zod"
  }
}
```

## Tarball dependencies

A package name can correspond to a publically hosted .tgz file. During bun install, Bun will download and install the package from the specified tarball URL, rather than from the package registry.

```typescript
{
  "dependencies": {
    "zod": "https://registry.npmjs.org/zod/-/zod-3.21.4.tgz"
  }
}
```

## CI/CD

Looking to speed up your CI? Use the official oven-sh/setup-bun action to install bun in a GitHub Actions pipeline.

```typescript
name: bun-types
jobs:
  build:
    name: build-app
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
      - name: Install bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Build app
        run: bun run build
```

Previous

Debugger

Next

Global cache

Edit on GitHub



Page URL: https://bun.sh/docs/install/cache

# Global cache

Edit on GitHub

All packages downloaded from the registry are stored in a global cache at ~/.bun/install/cache. They are stored in subdirectories named like ${name}@${version}, so multiple versions of a package can be cached.

Configuring cache behavior

```typescript
[install.cache]
# the directory to use for the cache
dir = "~/.bun/install/cache"

# when true, don't load from the global cache.
# Bun may still write to node_modules/.cache
disable = false

# when true, always resolve the latest versions from the registry
disableManifest = false
```

## Minimizing re-downloads

Bun strives to avoid re-downloading packages multiple times. When installing a package, if the cache already contains a version in the range specified by package.json, Bun will use the cached package instead of downloading it again.

Installation details

If the semver version has pre-release suffix (1.0.0-beta.0) or a build suffix (1.0.0+20220101), it is replaced with a hash of that value instead, to reduce the chances of errors associated with long file paths.

When the node_modules folder exists, before installing, Bun checks that node_modules contains all expected packages with appropriate versions. If so bun install completes. Bun uses a custom JSON parser which stops parsing as soon as it finds "name" and "version".

If a package is missing or has a version incompatible with the package.json, Bun checks for a compatible module in the cache. If found, it is installed into node_modules. Otherwise, the package will be downloaded from the registry then installed.

## Fast copying

Once a package is downloaded into the cache, Bun still needs to copy those files into node_modules. Bun uses the fastest syscalls available to perform this task. On Linux, it uses hardlinks; on macOS, it uses clonefile.

## Saving disk space

Since Bun uses hardlinks to "copy" a module into a project's node_modules directory on Linux, the contents of the package only exist in a single location on disk, greatly reducing the amount of disk space dedicated to node_modules.

This benefit does not extend to macOS, which uses clonefile for performance reasons.

Installation strategies

This behavior is configurable with the --backend flag, which is respected by all of Bun's package management commands.

If you install with --backend=symlink, Node.js won't resolve node_modules of dependencies unless each dependency has its own node_modules folder or you pass --preserve-symlinks to node. See Node.js documentation on --preserve-symlinks.

```typescript
bun install --backend symlink
```

Bun's runtime does not currently expose an equivalent of --preserve-symlinks.

Previous

bun install

Next

Workspaces

Edit on GitHub



Page URL: https://bun.sh/docs/install/workspaces

# Workspaces

Edit on GitHub

Bun supports workspaces in package.json. Workspaces make it easy to develop complex software as a monorepo consisting of several independent packages.

To try it, specify a list of sub-packages in the workspaces field of your package.json; it's conventional to place these sub-packages in a directory called packages.

```typescript
{
  "name": "my-project",
  "version": "1.0.0",
  "workspaces": ["packages/*"]
}
```

Glob support — Bun supports simple ```<directory>/*``` globs in "workspaces". Full glob syntax (e.g. ** and ?) is not yet supported.

This has a couple major benefits.

⚡️ Speed — Installs are fast, even for big monorepos. Bun installs the Remix monorepo in about 500ms on Linux.

Previous

Global cache

Next

Lockfile

Edit on GitHub



Page URL: https://bun.sh/docs/install/lockfile

# Lockfile

Edit on GitHub

Running bun install will create a binary lockfile called bun.lockb.

#### Why is it binary?

In a word: Performance. Bun’s lockfile saves & loads incredibly quickly, and saves a lot more data than what is typically inside lockfiles.

#### How do I inspect Bun's lockfile?

Run bun install -y to generate a Yarn-compatible yarn.lock (v1) that can be inspected more easily.

#### How do I git diff Bun's lockfile?

To add to the global gitattributes file:

For example, on macOS, add the following to ~/.config/git/attributes:

```typescript
*.lockb diff=lockb
```

Then add the following to ~/.gitconfig:

```typescript
[diff "lockb"]
    textconv = bun
    binary = true
```

To only add to the local gitattributes file:

```typescript
git config diff.lockb.textconv bun
```

Why this works:

Running bun on a lockfile will print a human-readable diff. So we just need to tell git to run bun on the lockfile before diffing it.

#### Platform-specific dependencies?

Bun stores normalized cpu and os values from npm in the lockfile, along with the resolved packages. It skips downloading, extracting, and installing packages disabled for the current target at runtime. This means the lockfile won’t change between platforms/architectures even if the packages ultimately installed do change.

#### What does Bun's lockfile store?

Packages, metadata for those packages, the hoisted install order, dependencies for each package, what packages those dependencies resolved to, an integrity hash (if available), what each package was resolved to, and which version (or equivalent).

#### Why is Bun's lockfile fast?

It uses linear arrays for all data. Packages are referenced by an auto-incrementing integer ID or a hash of the package name. Strings longer than 8 characters are de-duplicated. Prior to saving on disk, the lockfile is garbage-collected & made deterministic by walking the package tree and cloning the packages in dependency order.

#### Can I opt out?

To install without creating a lockfile:

```typescript
bun install --no-save
```

To install a Yarn lockfile in addition to bun.lockb.

```typescript
bun install --yarn
```

```typescript
[install.lockfile]
# whether to save a non-Bun lockfile alongside bun.lockb
# only "yarn" is supported
print = "yarn"
```

Configuring lockfile

```typescript
[install.lockfile]

# path to read bun.lockb from
path = "bun.lockb"

# path to save bun.lockb to
savePath = "bun.lockb"

# whether to save the lockfile to disk
save = true

# whether to save a non-Bun lockfile alongside bun.lockb
# only "yarn" is supported
print = "yarn"
```

Previous

Workspaces

Next

Scopes and registries

Edit on GitHub



Page URL: https://bun.sh/docs/install/registries

# Scopes and registries

Edit on GitHub

The default registry is registry.npmjs.org. This can be globally configured in bunfig.toml:

```typescript
[install]
# set default registry as a string
registry = "https://registry.npmjs.org"
# set a token
registry = { url = "https://registry.npmjs.org", token = "123456" }
# set a username/password
registry = "https://username:password@registry.npmjs.org"
```

To configure a private registry scoped to a particular organization:

```typescript
[install.scopes]
# registry as string
"@myorg1" = "https://username:password@registry.myorg.com/"

# registry with username/password
# you can reference environment variables
"@myorg2" = { username = "myusername", password = "$NPM_PASS", url = "https://registry.myorg.com/" }

# registry with token
"@myorg3" = { token = "$npm_token", url = "https://registry.myorg.com/" }
```

### .npmrc

Bun does not currently read .npmrc files. For private registries, migrate your registry configuration to bunfig.toml as documented above.

Previous

Lockfile

Next

Utilities

Edit on GitHub



Page URL: https://bun.sh/docs/install/utilities

# Utilities

Edit on GitHub

The bun pm command group provides a set of utilities for working with Bun's package manager.

To print the path to the bin directory for the local project:

```typescript
bun pm bin
```

To print the path to the global bin directory:

```typescript
bun pm bin -g
```

To print a list of installed dependencies in the current project and their resolved versions, excluding their dependencies.

```typescript
bun pm ls
```

To print all installed dependencies, including nth-order dependencies.

```typescript
bun pm ls --all
```

To print the path to Bun's global module cache:

```typescript
bun pm cache
```

To clear Bun's global module cache:

```typescript
bun pm cache rm
```

Previous

Scopes and registries

Next

Bun.build

Edit on GitHub



Page URL: https://bun.sh/docs/bundler

# Bun.build

Edit on GitHub

Bun's fast native bundler is now in beta. It can be used via the bun build CLI command or the Bun.build() JavaScript API.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './build',
});
```

```typescript
bun build ./index.tsx --outdir ./build
```

It's fast. The numbers below represent performance on esbuild's three.js benchmark.

## Why bundle?

The bundler is a key piece of infrastructure in the JavaScript ecosystem. As a brief overview of why bundling is so important:

Let's jump into the bundler API.

## Basic example

Let's build our first bundle. You have the following two files, which implement a simple client-side rendered React app.

```typescript
import * as ReactDOM from 'react-dom/client';
import {Component} from "./Component"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Component message="Sup!" />)
```

```typescript
export function Component(props: {message: string}) {
  return <p>{props.message}</p>
}
```

Here, index.tsx is the "entrypoint" to our application. Commonly, this will be a script that performs some side effect, like starting a server or—in this case—initializing a React root. Because we're using TypeScript & JSX, we need to bundle our code before it can be sent to the browser.

To create our bundle:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
})
```

```typescript
bun build ./index.tsx --outdir ./out
```

For each file specified in entrypoints, Bun will generate a new bundle. This bundle will be written to disk in the ./out directory (as resolved from the current working directory). After running the build, the file system looks like this:

```typescript
.
├── index.tsx
├── Component.tsx
└── out
    └── index.js
```

The contents of out/index.js will look something like this:

```typescript
// ...
// ~20k lines of code
// including the contents of `react-dom/client` and all its dependencies
// this is where the $jsxDEV and $createRoot functions are defined


// Component.tsx
function Component(props) {
  return $jsxDEV("p", {
    children: props.message
  }, undefined, false, undefined, this);
}

// index.tsx
var rootNode = document.getElementById("root");
var root = $createRoot(rootNode);
root.render($jsxDEV(Component, {
  message: "Sup!"
}, undefined, false, undefined, this));
```

Tutorial: Run this file in your browser

We can load this file in the browser to see our app in action. Create an index.html file in the out directory:

```typescript
touch out/index.html
```

Then paste the following contents into it:

```typescript
<html>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>
```

Then spin up a static file server serving the out directory:

```typescript
bunx serve out
```

Visit http://localhost:5000 to see your bundled app in action.

## Content types

Like the Bun runtime, the bundler supports an array of file types out of the box. The following table breaks down the bundler's set of standard "loaders". Refer to Bundler > File types for full documentation.

.json

JSON files are parsed and inlined into the bundle as a JavaScript object.

```typescript
import pkg from "./package.json";
pkg.name; // => "my-package"
```

.toml

TOML files are parsed and inlined into the bundle as a JavaScript object.

```typescript
import config from "./bunfig.toml";
config.logLevel; // => "debug"
```

.txt

The contents of the text file are read and inlined into the bundle as a string.

```typescript
import contents from "./file.txt";
console.log(contents); // => "Hello, world!"
```

### Assets

If the bundler encounters an import with an unrecognized extension, it treats the imported file as an external file. The referenced file is copied as-is into outdir, and the import is resolved as a path to the file.

```typescript
// bundle entrypoint
import logo from "./logo.svg";
console.log(logo);
```

```typescript
// bundled output
var logo = "./logo-ab237dfe.svg";
console.log(logo);
```

The exact behavior of the file loader is also impacted by naming and publicPath.

Refer to the Bundler > Loaders page for more complete documentation on the file loader.

### Plugins

The behavior described in this table can be overridden or extended with plugins. Refer to the Bundler > Loaders page for complete documentation.

## API

### entrypoints

Required. An array of paths corresponding to the entrypoints of our application. One bundle will be generated for each entrypoint.

```typescript
const result = await Bun.build({
  entrypoints: ["./index.ts"],
});
// => { success: boolean, outputs: BuildArtifact[], logs: BuildMessage[] }
```

```typescript
bun build --entrypoints ./index.ts
```

### outdir

The directory where output files will be written.

```typescript
const result = await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './out'
});
// => { success: boolean, outputs: BuildArtifact[], logs: BuildMessage[] }
```

```typescript
bun build --entrypoints ./index.ts --outdir ./out
```

If outdir is not passed to the JavaScript API, bundled code will not be written to disk. Bundled files are returned in an array of BuildArtifact objects. These objects are Blobs with extra properties; see Outputs for complete documentation.

```typescript
const result = await Bun.build({
  entrypoints: ["./index.ts"],
});

for (const result of result.outputs) {
  // Can be consumed as blobs
  await result.text();

  // Bun will set Content-Type and Etag headers
  new Response(result);

  // Can be written manually, but you should use `outdir` in this case.
  Bun.write(path.join("out", result.path), result);
}
```

When outdir is set, the path property on a BuildArtifact will be the absolute path to where it was written to.

### target

The intended execution environment for the bundle.

```typescript
await Bun.build({
  entrypoints: ['./index.ts'],
  outdir: './out',
  target: 'browser', // default
})
```

```typescript
bun build --entrypoints ./index.ts --outdir ./out --target browser
```

Depending on the target, Bun will apply different module resolution rules and optimizations.

bun

For generating bundles that are intended to be run by the Bun runtime. In many cases, it isn't necessary to bundle server-side code; you can directly execute the source code without modification. However, bundling your server code can reduce startup times and improve running performance.

All bundles generated with target: "bun" are marked with a special // @bun pragma, which indicates to the Bun runtime that there's no need to re-transpile the file before execution.

If any entrypoints contains a Bun shebang (#!/usr/bin/env bun) the bundler will default to target: "bun" instead of "browser.

### format

Specifies the module format to be used in the generated bundles.

Currently the bundler only supports one module format: "esm". Support for "cjs" and "iife" are planned.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  format: "esm",
})
```

```typescript
bun build ./index.tsx --outdir ./out --format esm
```

### splitting

Whether to enable code splitting.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  splitting: false, // default
})
```

```typescript
bun build ./index.tsx --outdir ./out --splitting
```

When true, the bundler will enable code splitting. When multiple entrypoints both import the same file, module, or set of files/modules, it's often useful to split the shared code into a separate bundle. This shared bundle is known as a chunk. Consider the following files:

```typescript
import { shared } from './shared.ts';
```

```typescript
import { shared } from './shared.ts';
```

```typescript
export const shared = 'shared';
```

To bundle entry-a.ts and entry-b.ts with code-splitting enabled:

```typescript
await Bun.build({
  entrypoints: ['./entry-a.ts', './entry-b.ts'],
  outdir: './out',
  splitting: true,
})
```

```typescript
bun build ./entry-a.ts ./entry-b.ts --outdir ./out --splitting
```

Running this build will result in the following files:

```typescript
.
├── entry-a.tsx
├── entry-b.tsx
├── shared.tsx
└── out
    ├── entry-a.js
    ├── entry-b.js
    └── chunk-2fce6291bf86559d.js
```

The generated chunk-2fce6291bf86559d.js file contains the shared code. To avoid collisions, the file name automatically includes a content hash by default. This can be customized with naming.

### plugins

A list of plugins to use during bundling.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  plugins: [/* ... */],
})
```

```typescript
n/a
```

Bun implements a universal plugin system for both Bun's runtime and bundler. Refer to the plugin documentation for complete documentation.

### sourcemap

Specifies the type of sourcemap to generate.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  sourcemap: "external", // default "none"
})
```

```typescript
bun build ./index.tsx --outdir ./out --sourcemap=external
```

"inline"

A sourcemap is generated and appended to the end of the generated bundle as a base64 payload.

```typescript
// <bundled code here>

//# sourceMappingURL=data:application/json;base64,<encoded sourcemap here>
```

Generated bundles contain a debug id that can be used to associate a bundle with its corresponding sourcemap. This debugId is added as a comment at the bottom of the file.

```typescript
// <generated bundle code>

//# debugId=<DEBUG ID>
```

The associated *.js.map sourcemap will be a JSON file containing an equivalent debugId property.

### minify

Whether to enable minification. Default false.

When targeting bun, identifiers will be minified by default.

To enable all minification options:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  minify: true, // default false
})
```

```typescript
bun build ./index.tsx --outdir ./out --minify
```

To granularly enable certain minifications:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
})
```

```typescript
bun build ./index.tsx --outdir ./out --minify-whitespace --minify-identifiers --minify-syntax
```

### external

A list of import paths to consider external. Defaults to [].

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  external: ["lodash", "react"], // default: []
})
```

```typescript
bun build ./index.tsx --outdir ./out --external lodash --external react
```

An external import is one that will not be included in the final bundle. Instead, the import statement will be left as-is, to be resolved at runtime.

For instance, consider the following entrypoint file:

```typescript
import _ from "lodash";
import {z} from "zod";

const value = z.string().parse("Hello world!")
console.log(_.upperCase(value));
```

Normally, bundling index.tsx would generate a bundle containing the entire source code of the "zod" package. If instead, we want to leave the import statement as-is, we can mark it as external:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  external: ['zod'],
})
```

```typescript
bun build ./index.tsx --outdir ./out --external zod
```

The generated bundle will look something like this:

```typescript
import {z} from "zod";

// ...
// the contents of the "lodash" package
// including the `_.upperCase` function

var value = z.string().parse("Hello world!")
console.log(_.upperCase(value));
```

To mark all imports as external, use the wildcard *:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  external: ['*'],
})
```

```typescript
bun build ./index.tsx --outdir ./out --external '*'
```

### naming

Customizes the generated file names. Defaults to ./[dir]/[name].[ext].

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: "[dir]/[name].[ext]", // default
})
```

```typescript
bun build ./index.tsx --outdir ./out --entry-naming [dir]/[name].[ext]
```

By default, the names of the generated bundles are based on the name of the associated entrypoint.

```typescript
.
├── index.tsx
└── out
    └── index.js
```

With multiple entrypoints, the generated file hierarchy will reflect the directory structure of the entrypoints.

```typescript
.
├── index.tsx
└── nested
    └── index.tsx
└── out
    ├── index.js
    └── nested
        └── index.js
```

The names and locations of the generated files can be customized with the naming field. This field accepts a template string that is used to generate the filenames for all bundles corresponding to entrypoints. where the following tokens are replaced with their corresponding values:

For example:

We can combine these tokens to create a template string. For instance, to include the hash in the generated bundle names:

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: 'files/[dir]/[name]-[hash].[ext]',
})
```

```typescript
bun build ./index.tsx --outdir ./out --entry-naming [name]-[hash].[ext]
```

This build would result in the following file structure:

```typescript
.
├── index.tsx
└── out
    └── files
        └── index-a1b2c3d4.js
```

When a string is provided for the naming field, it is used only for bundles that correspond to entrypoints. The names of chunks and copied assets are not affected. Using the JavaScript API, separate template strings can be specified for each type of generated file.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  naming: {
    // default values
    entry: '[dir]/[name].[ext]',
    chunk: '[name]-[hash].[ext]',
    asset: '[name]-[hash].[ext]',
  },
})
```

```typescript
bun build ./index.tsx --outdir ./out --entry-naming "[dir]/[name].[ext]" --chunk-naming "[name]-[hash].[ext]" --asset-naming "[name]-[hash].[ext]"
```

### root

The root directory of the project.

```typescript
await Bun.build({
  entrypoints: ['./pages/a.tsx', './pages/b.tsx'],
  outdir: './out',
  root: '.',
})
```

```typescript
n/a
```

If unspecified, it is computed to be the first common ancestor of all entrypoint files. Consider the following file structure:

```typescript
.
└── pages
  └── index.tsx
  └── settings.tsx
```

We can build both entrypoints in the pages directory:

```typescript
await Bun.build({
  entrypoints: ['./pages/index.tsx', './pages/settings.tsx'],
  outdir: './out',
})
```

```typescript
bun build ./pages/index.tsx ./pages/settings.tsx --outdir ./out
```

This would result in a file structure like this:

```typescript
.
└── pages
  └── index.tsx
  └── settings.tsx
└── out
  └── index.js
  └── settings.js
```

Since the pages directory is the first common ancestor of the entrypoint files, it is considered the project root. This means that the generated bundles live at the top level of the out directory; there is no out/pages directory.

This behavior can be overridden by specifying the root option:

```typescript
await Bun.build({
  entrypoints: ['./pages/index.tsx', './pages/settings.tsx'],
  outdir: './out',
  root: '.',
})
```

```typescript
bun build ./pages/index.tsx ./pages/settings.tsx --outdir ./out --root .
```

By specifying . as root, the generated file structure will look like this:

```typescript
.
└── pages
  └── index.tsx
  └── settings.tsx
└── out
  └── pages
    └── index.js
    └── settings.js
```

### publicPath

A prefix to be appended to any import paths in bundled code.

In many cases, generated bundles will contain no import statements. After all, the goal of bundling is to combine all of the code into a single file. However there are a number of cases with the generated bundles will contain import statements.

In any of these cases, the final bundles may contain paths to other files. By default these imports are relative. Here is an example of a simple asset import:

```typescript
import logo from './logo.svg';
console.log(logo);
```

```typescript
// logo.svg is copied into <outdir>
// and hash is added to the filename to prevent collisions
var logo = './logo-a7305bdef.svg';
console.log(logo);
```

Setting publicPath will prefix all file paths with the specified value.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  publicPath: 'https://cdn.example.com/', // default is undefined
})
```

```typescript
n/a
```

The output file would now look something like this.

```typescript
var logo = './logo-a7305bdef.svg';
var logo = 'https://cdn.example.com/logo-a7305bdef.svg';
```

### define

A map of global identifiers to be replaced at build time. Keys of this object are identifier names, and values are JSON strings that will be inlined.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  define: {
    STRING: JSON.stringify("value"),
    "nested.boolean": "true",
  },
})
```

```typescript
bun build ./index.tsx --outdir ./out --define 'STRING="value"' --define "nested.boolean=true"
```

### loader

A map of file extensions to built-in loader names. This can be used to quickly customize how certain file files are loaded.

```typescript
await Bun.build({
  entrypoints: ['./index.tsx'],
  outdir: './out',
  loader: {
    ".png": "dataurl",
    ".txt": "file",
  },
})
```

```typescript
bun build ./index.tsx --outdir ./out --loader .png:dataurl --loader .txt:file
```

## Outputs

The Bun.build function returns a ```Promise<BuildOutput>```, defined as:

```typescript
interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<object>; // see docs for details
}

interface BuildArtifact extends Blob {
  kind: "entry-point" | "chunk" | "asset" | "sourcemap";
  path: string;
  loader: Loader;
  hash: string | null;
  sourcemap: BuildArtifact | null;
}
```

The outputs array contains all the files that were generated by the build. Each artifact implements the Blob interface.

```typescript
const build = Bun.build({
  /* */
});

for (const output of build.outputs) {
  await output.arrayBuffer(); // => ArrayBuffer
  await output.text(); // string
}
```

Each artifact also contains the following properties:

Similar to BunFile, BuildArtifact objects can be passed directly into new Response().

```typescript
const build = Bun.build({
  /* */
});

const artifact = build.outputs[0];

// Content-Type header is automatically set
return new Response(artifact);
```

The Bun runtime implements special pretty-printing of BuildArtifact object to make debugging easier.

```typescript
// build.ts
const build = Bun.build({/* */});

const artifact = build.outputs[0];
console.log(artifact);
```

```typescript
bun run build.ts
```

### Executables

Bun supports "compiling" a JavaScript/TypeScript entrypoint into a standalone executable. This executable contains a copy of the Bun binary.

```typescript
bun build ./cli.tsx --outfile mycli --compile
```

Refer to Bundler > Executables for complete documentation.

## Logs and errors

Bun.build only throws if invalid options are provided. Read the success property to determine if the build was successful; the logs property will contain additional details.

```typescript
const result = await Bun.build({
  entrypoints: ["./index.tsx"],
  outdir: "./out",
});

if (!result.success) {
  console.error("Build failed");
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message);
  }
}
```

Each message is either a BuildMessage or ResolveMessage object, which can be used to trace what problems happened in the build.

```typescript
class BuildMessage {
  name: string;
  position?: Position;
  message: string;
  level: "error" | "warning" | "info" | "debug" | "verbose";
}

class ResolveMessage extends BuildMessage {
  code: string;
  referrer: string;
  specifier: string;
  importKind: ImportKind;
}
```

If you want to throw an error from a failed build, consider passing the logs to an AggregateError. If uncaught, Bun will pretty-print the contained messages nicely.

```typescript
if (!result.success) {
  throw new AggregateError(result.logs, "Build failed");
}
```

## Reference

```typescript
interface Bun {
  build(options: BuildOptions): Promise<BuildOutput>;
}

interface BuildOptions {
  entrypoints: string[]; // required
  outdir?: string; // default: no write (in-memory only)
  format?: "esm"; // later: "cjs" | "iife"
  target?: "browser" | "bun" | "node"; // "browser"
  splitting?: boolean; // true
  plugins?: BunPlugin[]; // [] // See https://bun.sh/docs/bundler/plugins
  loader?: { [k in string]: Loader }; // See https://bun.sh/docs/bundler/loaders
  manifest?: boolean; // false
  external?: string[]; // []
  sourcemap?: "none" | "inline" | "external"; // "none"
  root?: string; // computed from entrypoints
  naming?:
    | string
    | {
        entry?: string; // '[dir]/[name].[ext]'
        chunk?: string; // '[name]-[hash].[ext]'
        asset?: string; // '[name]-[hash].[ext]'
      };
  publicPath?: string; // e.g. http://mydomain.com/
  minify?:
    | boolean // false
    | {
        identifiers?: boolean;
        whitespace?: boolean;
        syntax?: boolean;
      };
}

interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<BuildMessage | ResolveMessage>;
}

interface BuildArtifact extends Blob {
  path: string;
  loader: Loader;
  hash?: string;
  kind: "entry-point" | "chunk" | "asset" | "sourcemap";
  sourcemap?: BuildArtifact;
}

type Loader =
  | "js"
  | "jsx"
  | "ts"
  | "tsx"
  | "json"
  | "toml"
  | "file"
  | "napi"
  | "wasm"
  | "text";

interface BuildOutput {
  outputs: BuildArtifact[];
  success: boolean;
  logs: Array<BuildMessage | ResolveMessage>;
}

declare class ResolveMessage {
  readonly name: "ResolveMessage";
  readonly position: Position | null;
  readonly code: string;
  readonly message: string;
  readonly referrer: string;
  readonly specifier: string;
  readonly importKind:
    | "entry_point"
    | "stmt"
    | "require"
    | "import"
    | "dynamic"
    | "require_resolve"
    | "at"
    | "at_conditional"
    | "url"
    | "internal";
  readonly level: "error" | "warning" | "info" | "debug" | "verbose";

  toString(): string;
}
```

Previous

Utilities

Next

Loaders

Edit on GitHub



Page URL: https://bun.sh/docs/bundler/loaders

# Loaders

Edit on GitHub

The Bun bundler implements a set of default loaders out of the box. As a rule of thumb, the bundler and the runtime both support the same set of file types out of the box.

.js .cjs .mjs .mts .cts .ts .tsx .jsx .toml .json .txt .wasm .node

Bun uses the file extension to determine which built-in loader should be used to parse the file. Every loader has a name, such as js, tsx, or json. These names are used when building plugins that extend Bun with custom loaders.

## Built-in loaders

### js

JavaScript. Default for .cjs and .mjs.

Parses the code and applies a set of default transforms, like dead-code elimination, tree shaking, and environment variable inlining. Note that Bun does not attempt to down-convert syntax at the moment.

### jsx

JavaScript + JSX.. Default for .js and .jsx.

Same as the js loader, but JSX syntax is supported. By default, JSX is downconverted to plain JavaScript; the details of how this is done depends on the jsx* compiler options in your tsconfig.json. Refer to the TypeScript documentation on JSX for more information.

### ts

TypeScript loader. Default for .ts, .mts, and .cts.

Strips out all TypeScript syntax, then behaves identically to the js loader. Bun does not perform typechecking.

### tsx

TypeScript + JSX loader. Default for .tsx. Transpiles both TypeScript and JSX to vanilla JavaScript.

### json

JSON loader. Default for .json.

JSON files can be directly imported.

```typescript
import pkg from "./package.json";
pkg.name; // => "my-package"
```

During bundling, the parsed JSON is inlined into the bundle as a JavaScript object.

```typescript
var pkg = {
  name: "my-package",
  // ... other fields
};
pkg.name;
```

If a .json file is passed as an entrypoint to the bundler, it will be converted to a .js module that export defaults the parsed object.

```typescript
{
  "name": "John Doe",
  "age": 35,
  "email": "johndoe@example.com"
}
```

```typescript
export default {
  name: "John Doe",
  age: 35,
  email: "johndoe@example.com"
}
```

### toml

TOML loader. Default for .toml.

TOML files can be directly imported. Bun will parse them with its fast native TOML parser.

```typescript
import config from "./bunfig.toml";
config.logLevel; // => "debug"
```

During bundling, the parsed TOML is inlined into the bundle as a JavaScript object.

```typescript
var config = {
  logLevel: "debug",
  // ...other fields
};
config.logLevel;
```

If a .toml file is passed as an entrypoint, it will be converted to a .js module that export defaults the parsed object.

```typescript
name = "John Doe"
age = 35
email = "johndoe@example.com"
```

```typescript
export default {
  name: "John Doe",
  age: 35,
  email: "johndoe@example.com"
}
```

### text

Text loader. Default for .txt.

The contents of the text file are read and inlined into the bundle as a string. Text files can be directly imported. The file is read and returned as a string.

```typescript
import contents from "./file.txt";
console.log(contents); // => "Hello, world!"
```

When referenced during a build, the contents are into the bundle as a string.

```typescript
var contents = `Hello, world!`;
console.log(contents);
```

If a .txt file is passed as an entrypoint, it will be converted to a .js module that export defaults the file contents.

```typescript
Hello, world!
```

```typescript
export default "Hello, world!";
```

### wasm

WebAssembly loader. Default for .wasm.

In the runtime, WebAssembly files can be directly imported. The file is read and returned as a WebAssembly.Module.

```typescript
import wasm from "./module.wasm";
console.log(wasm); // => WebAssembly.Module
```

In the bundler, .wasm files are handled using the file loader.

### napi

Native addon loader. Default for .node.

In the runtime, native addons can be directly imported.

```typescript
import addon from "./addon.node";
console.log(addon);
```

In the bundler, .node files are handled using the file loader.

### file

File loader. Default for all unrecognized file types.

The file loader resolves the import as a path/URL to the imported file. It's commonly used for referencing media or font assets.

```typescript
import logo from "./logo.svg";
console.log(logo);
```

In the runtime, Bun checks that the logo.svg file exists and converts it to an absolute path to the location of logo.svg on disk.

```typescript
bun run logo.ts
```

In the bundler, things are slightly different. The file is copied into outdir as-is, and the import is resolved as a relative path pointing to the copied file.

```typescript
var logo = "./logo.svg";
console.log(logo);
```

If a value is specified for publicPath, the import will use value as a prefix to construct an absolute path/URL.

The location and file name of the copied file is determined by the value of naming.asset.

This loader is copied into the outdir as-is. The name of the copied file is determined using the value of naming.asset.

Fixing TypeScript import errors

If you're using TypeScript, you may get an error like this:

```typescript
// TypeScript error
// Cannot find module './logo.svg' or its corresponding type declarations.
```

This can be fixed by creating *.d.ts file anywhere in your project (any name will work) with the following contents:

```typescript
declare module "*.svg" {
  const content: string;
  export default content;
}
```

This tells TypeScript that any default imports from .svg should be treated as a string.

Previous

Bun.build

Next

Plugins

Edit on GitHub



Page URL: https://bun.sh/docs/bundler/plugins

# Plugins

Edit on GitHub

Bun provides a universal plugin API that can be used to extend both the runtime and bundler.

Plugins intercept imports and perform custom loading logic: reading files, transpiling code, etc. They can be used to add support for additional file types, like .scss or .yaml. In the context of Bun's bundler, plugins can be used to implement framework-level features like CSS extraction, macros, and client-server code co-location.

For more complete documentation of the Plugin API, see Runtime > Plugins.

## Usage

A plugin is defined as simple JavaScript object containing a name property and a setup function. Register a plugin with Bun using the plugin function.

```typescript
import type { BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "Custom loader",
  setup(build) {
    // implementation
  },
};
```

This plugin can be passed into the plugins array when calling Bun.build.

```typescript
Bun.build({
  entrypoints: ["./app.ts"],
  outdir: "./out",
  plugins: [myPlugin],
});
```

Previous

Loaders

Next

Executables

Edit on GitHub



Page URL: https://bun.sh/docs/bundler/executables

# Executables

Edit on GitHub

Bun's bundler implements a --compile flag for generating a standalone binary from a TypeScript or JavaScript file.

```typescript
bun build ./cli.ts --compile --outfile mycli
```

```typescript
console.log("Hello world!");
```

This bundles cli.ts into an executable that can be executed directly:

```typescript
$ ./mycli
Hello world!
```

All imported files and packages are bundled into the executable, along with a copy of the Bun runtime. All built-in Bun and Node.js APIs are supported.

Note — Currently, the --compile flag can only accept a single entrypoint at a time and does not support the following flags:

## Embedding files

Standalone executables support embedding files.

To embed files into an executable with bun build --compile, import the file in your code

```typescript
// this becomes an internal file path
import icon from "./icon.png";

import { file } from "bun";

export default {
  fetch(req) {
    return new Response(file(icon));
  },
};
```

You may need to specify a --loader for it to be treated as a "file" loader (so you get back a file path).

Embedded files can be read using Bun.file's functions or the Node.js fs.readFile function (in "node:fs").

## Minification

To trim down the size of the executable a little, pass --minify to bun build --compile. This uses Bun's minifier to reduce the code size. Overall though, Bun's binary is still way too big and we need to make it smaller.

Previous

Plugins

Next

Macros

Edit on GitHub



Page URL: https://bun.sh/docs/bundler/macros

# Macros

Edit on GitHub

Macros are a mechanism for running JavaScript functions at bundle-time. The value returned from these functions are directly inlined into your bundle.

As a toy example, consider this simple function that returns a random number.

```typescript
export function random() {
  return Math.random();
}
```

This is just a regular function in a regular file, but we can use it as a macro like so:

```typescript
import { random } from './random.ts' with { type: 'macro' };

console.log(`Your random number is ${random()}`);
```

Note — Macros are indicated using import attribute syntax. If you haven't seen this syntax before, it's a Stage 3 TC39 proposal that lets you attach additional metadata to import statements.

Now we'll bundle this file with bun build. The bundled file will be printed to stdout.

```typescript
bun build ./cli.tsx
```

As you can see, the source code of the random function occurs nowhere in the bundle. Instead, it is executed during bundling and function call (random()) is replaced with the result of the function. Since the source code will never be included in the bundle, macros can safely perform privileged operations like reading from a database.

## When to use macros

If you have several build scripts for small things where you would otherwise have a one-off build script, bundle-time code execution can be easier to maintain. It lives with the rest of your code, it runs with the rest of the build, it is automatically parallelized, and if it fails, the build fails too.

If you find yourself running a lot of code at bundle-time though, consider running a server instead.

## Import attributes

Bun Macros are import statements annotated using either:

## Security considerations

Macros must explicitly be imported with { type: "macro" } in order to be executed at bundle-time. These imports have no effect if they are not called, unlike regular JavaScript imports which may have side effects.

You can disable macros entirely by passing the --no-macros flag to Bun. It produces a build error like this:

```typescript
error: Macros are disabled

foo();
^
./hello.js:3:1 53
```

To reduce the potential attack surface for malicious packages, macros cannot be invoked from inside node_modules/**/*. If a package attempts to invoke a macro, you'll see an error like this:

```typescript
error: For security reasons, macros cannot be run from node_modules.

beEvil();
^
node_modules/evil/index.js:3:1 50
```

Your application code can still import macros from node_modules and invoke them.

```typescript
import {macro} from "some-package" with { type: "macro" };

macro();
```

## Export condition "macro"

When shipping a library containing a macro to npm or another package registry, use the "macro" export condition to provide a special version of your package exclusively for the macro environment.

```typescript
{
  "name": "my-package",
  "exports": {
    "import": "./index.js",
    "require": "./index.js",
    "default": "./index.js",
    "macro": "./index.macro.js"
  }
}
```

With this configuration, users can consume your package at runtime or at bundle-time using the same import specifier:

```typescript
import pkg from "my-package";                            // runtime import
import {macro} from "my-package" with { type: "macro" }; // macro import
```

The first import will resolve to ./node_modules/my-package/index.js, while the second will be resolved by Bun's bundler to ./node_modules/my-package/index.macro.js.

## Execution

When Bun's transpiler sees a macro import, it calls the function inside the transpiler using Bun's JavaScript runtime and converts the return value from JavaScript into an AST node. These JavaScript functions are called at bundle-time, not runtime.

Macros are executed synchronously in the transpiler during the visiting phase—before plugins and before the transpiler generates the AST. They are executed in the order they are imported. The transpiler will wait for the macro to finish executing before continuing. The transpiler will also await any Promise returned by a macro.

Bun's bundler is multi-threaded. As such, macros execute in parallel inside of multiple spawned JavaScript "workers".

## Dead code elimination

The bundler performs dead code elimination after running and inlining macros. So given the following macro:

```typescript
export function returnFalse() {
  return false;
}
```

...then bundling the following file will produce an empty bundle.

```typescript
import {returnFalse} from './returnFalse.ts' with { type: 'macro' };

if (returnFalse()) {
  console.log("This code is eliminated");
}
```

## Serializablility

Bun's transpiler needs to be able to serialize the result of the macro so it can be inlined into the AST. All JSON-compatible data structures are supported:

```typescript
export function getObject() {
  return {
    foo: "bar",
    baz: 123,
    array: [ 1, 2, { nested: "value" }],
  };
}
```

Macros can be async, or return Promise instances. Bun's transpiler will automatically await the Promise and inline the result.

```typescript
export async function getText() {
  return "async value";
}
```

The transpiler implements special logic for serializing common data formats like Response, Blob, TypedArray.

The result of fetch is ```Promise<Response>```, so it can be directly returned.

```typescript
export function getObject() {
  return fetch("https://bun.sh")
}
```

Functions and instances of most classes (except those mentioned above) are not serializable.

```typescript
export function getText(url: string) {
  // this doesn't work!
  return () => {};
}
```

## Arguments

Macros can accept inputs, but only in limited cases. The value must be statically known. For example, the following is not allowed:

```typescript
import {getText} from './getText.ts' with { type: 'macro' };

export function howLong() {
  // the value of `foo` cannot be statically known
  const foo = Math.random() ? "foo" : "bar";

  const text = getText(`https://example.com/${foo}`);
  console.log("The page is ", text.length, " characters long");
}
```

However, if the value of foo is known at bundle-time (say, if it's a constant or the result of another macro) then it's allowed:

```typescript
import {getText} from './getText.ts' with { type: 'macro' };
import {getFoo} from './getFoo.ts' with { type: 'macro' };

export function howLong() {
  // this works because getFoo() is statically known
  const foo = getFoo();
  const text = getText(`https://example.com/${foo}`);
  console.log("The page is", text.length, "characters long");
}
```

This outputs:

```typescript
function howLong() {
  console.log("The page is", 1322, "characters long");
}
export { howLong };
```

## Examples

### Embed latest git commit hash

```typescript
export function getGitCommitHash() {
  const {stdout} = Bun.spawnSync({
    cmd: ["git", "rev-parse", "HEAD"],
    stdout: "pipe",
  });

  return stdout.toString();
}
```

When we build it, the getGitCommitHash is replaced with the result of calling the function:

```typescript
import { getGitCommitHash } from './getGitCommitHash.ts' with { type: 'macro' };

console.log(`The current Git commit hash is ${getGitCommitHash()}`);
```

```typescript
console.log(`The current Git commit hash is 3ee3259104f`);
```

You're probably thinking "Why not just use process.env.GIT_COMMIT_HASH?" Well, you can do that too. But can you do this with an environment variable?

### Make fetch() requests at bundle-time

In this example, we make an outgoing HTTP request using fetch(), parse the HTML response using HTMLRewriter, and return an object containing the title and meta tags–all at bundle-time.

```typescript
export async function extractMetaTags(url: string) {
  const response = await fetch(url);
  const meta = {
    title: "",
  };
  new HTMLRewriter()
    .on("title", {
      text(element) {
        meta.title += element.text;
      },
    })
    .on("meta", {
      element(element) {
        const name =
          element.getAttribute("name") || element.getAttribute("property") || element.getAttribute("itemprop");

        if (name) meta[name] = element.getAttribute("content");
      },
    })
    .transform(response);

  return meta;
}
```

The extractMetaTags function is erased at bundle-time and replaced with the result of the function call. This means that the fetch request happens at bundle-time, and the result is embedded in the bundle. Also, the branch throwing the error is eliminated since it's unreachable.

```typescript
import { extractMetaTags } from './meta.ts' with { type: 'macro' };

export const Head = () => {
  const headTags = extractMetaTags("https://example.com");

  if (headTags.title !== "Example Domain") {
    throw new Error("Expected title to be 'Example Domain'");
  }

  return <head>
    <title>{headTags.title}</title>
    <meta name="viewport" content={headTags.viewport} />
  </head>;
};
```

```typescript
import { jsx, jsxs } from "react/jsx-runtime";
export const Head = () => {
  jsxs("head", {
    children: [
      jsx("title", {
        children: "Example Domain",
      }),
      jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      }),
    ],
  });
};

export { Head };
```

Previous

Executables

Next

vs esbuild

Edit on GitHub



Page URL: https://bun.sh/docs/bundler/vs-esbuild

# vs esbuild

Edit on GitHub

Bun's bundler API is inspired heavily by esbuild. Migrating to Bun's bundler from esbuild should be relatively painless. This guide will briefly explain why you might consider migrating to Bun's bundler and provide a side-by-side API comparison reference for those who are already familiar with esbuild's API.

There are a few behavioral differences to note.

## Performance

With an performance-minded API coupled with the extensively optimized Zig-based JS/TS parser, Bun's bundler is 1.75x faster than esbuild on esbuild's three.js benchmark.

## CLI API

Bun and esbuild both provide a command-line interface.

```typescript
esbuild <entrypoint> --outdir=out --bundle
```

In Bun's CLI, simple boolean flags like --minify do not accept an argument. Other flags like --outdir ```<path>``` do accept an argument; these flags can be written as --outdir out or --outdir=out. Some flags like --define can be specified several times: --define foo=bar --define bar=baz.

--define:K=V

--define K=V

Small syntax difference; no colon.

```typescript
esbuild --define:foo=bar
```

--external:```<pkg>```

--external ```<pkg>```

Small syntax difference; no colon.

```typescript
esbuild --external:react
```

--loader:.ext=loader

--loader .ext:loader

Bun supports a different set of built-in loaders than esbuild; see Bundler > Loaders for a complete reference. The esbuild loaders dataurl, binary, base64, copy, and empty are not yet implemented.

The syntax for --loader is slightly different.

```typescript
esbuild app.ts --bundle --loader:.svg=text
```

## JavaScript API

assetNames

naming.asset

Uses same templating syntax as esbuild, but [ext] must be included explicitly.

```typescript
Bun.build({
  entrypoints: ["./index.tsx"],
  naming: {
    asset: "[name].[ext]",
  },
});
```

chunkNames

naming.chunk

Uses same templating syntax as esbuild, but [ext] must be included explicitly.

```typescript
Bun.build({
  entrypoints: ["./index.tsx"],
  naming: {
    chunk: "[name].[ext]",
  },
});
```

entryNames

naming or naming.entry

Bun supports a naming key that can either be a string or an object. Uses same templating syntax as esbuild, but [ext] must be included explicitly.

```typescript
Bun.build({
  entrypoints: ["./index.tsx"],
  // when string, this is equivalent to entryNames
  naming: "[name].[ext]",

  // granular naming options
  naming: {
    entry: "[name].[ext]",
    asset: "[name].[ext]",
    chunk: "[name].[ext]",
  },
});
```

minify

minify

In Bun, minify can be a boolean or an object.

```typescript
Bun.build({
  entrypoints: ['./index.tsx'],
  // enable all minification
  minify: true

  // granular options
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true
  }
})
```

## Plugin API

Bun's plugin API is designed to be esbuild compatible. Bun doesn't support esbuild's entire plugin API surface, but the core functionality is implemented. Many third-party esbuild plugins will work out of the box with Bun.

Long term, we aim for feature parity with esbuild's API, so if something doesn't work please file an issue to help us prioritize.

Plugins in Bun and esbuild are defined with a builder object.

```typescript
import type { BunPlugin } from "bun";

const myPlugin: BunPlugin = {
  name: "my-plugin",
  setup(builder) {
    // define plugin
  },
};
```

The builder object provides some methods for hooking into parts of the bundling process. Bun implements onResolve and onLoad; it does not yet implement the esbuild hooks onStart, onEnd, and onDispose, and resolve utilities. initialOptions is partially implemented, being read-only and only having a subset of esbuild's options; use config (same thing but with Bun's BuildConfig format) instead.

```typescript
import type { BunPlugin } from "bun";
const myPlugin: BunPlugin = {
  name: "my-plugin",
  setup(builder) {
    builder.onResolve(
      {
        /* onResolve.options */
      },
      args => {
        return {
          /* onResolve.results */
        };
      },
    );
    builder.onLoad(
      {
        /* onLoad.options */
      },
      args => {
        return {
          /* onLoad.results */
        };
      },
    );
  },
};
```

### onResolve

#### options

#### arguments

#### results

### onLoad

#### options

#### arguments

#### results

Previous

Macros

Next

bun test

Edit on GitHub



Page URL: https://bun.sh/docs/cli/test

# bun test

Edit on GitHub

Bun ships with a fast built-in test runner. Tests are executed with the Bun runtime, and support the following features.

## Run tests

```typescript
bun test
```

Tests are written in JavaScript or TypeScript with a Jest-like API. Refer to Writing tests for full documentation.

```typescript
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

The runner recursively searches the working directory for files that match the following patterns:

You can filter the set of test files to run by passing additional positional arguments to bun test. Any test file with a path that matches one of the filters will run. Commonly, these filters will be file or directory names; glob patterns are not yet supported.

```typescript
bun test <filter> <filter> ...
```

To filter by test name, use the -t/--test-name-pattern flag.

```typescript
# run all tests or test suites with "addition" in the name
```

The test runner runs all tests in a single process. It loads all --preload scripts (see Lifecycle for details), then runs all tests. If a test fails, the test runner will exit with a non-zero exit code.

## Timeouts

Use the --timeout flag to specify a per-test timeout in milliseconds. If a test times out, it will be marked as failed. The default value is 5000.

```typescript
# default value is 5000
```

## Rerun tests

Use the --rerun-each flag to run each test multiple times. This is useful for detecting flaky or non-deterministic test failures.

```typescript
bun test --rerun-each 100
```

## Bail out with --bail

Use the --bail flag to abort the test run early after a pre-determined number of test failures. By default Bun will run all tests and report all failures, but sometimes in CI environments it's preferable to terminate earlier to reduce CPU usage.

```typescript
# bail after 1 failure
```

## Watch mode

Similar to bun run, you can pass the --watch flag to bun test to watch for changes and re-run tests.

```typescript
bun test --watch
```

## Lifecycle hooks

Bun supports the following lifecycle hooks:

These hooks can be define inside test files, or in a separate file that is preloaded with the --preload flag.

```typescript
$ bun test --preload ./setup.ts
```

See Test > Lifecycle for complete documentation.

## Mocks

Create mocks with the mock function. Mocks are automatically reset between tests.

```typescript
import { test, expect, mock } from "bun:test";
const random = mock(() => Math.random());

test("random", async () => {
  const val = random();
  expect(val).toBeGreaterThan(0);
  expect(random).toHaveBeenCalled();
  expect(random).toHaveBeenCalledTimes(1);
});
```

See Test > Mocks for complete documentation.

## Snapshot testing

Snapshots are supported by bun test. See Test > Snapshots for complete documentation.

## UI & DOM testing

Bun is compatible with popular UI testing libraries:

See Test > DOM Testing for complete documentation.

## Performance

Bun's test runner is fast.

Previous

vs esbuild

Next

Writing tests

Edit on GitHub



Page URL: https://bun.sh/docs/test/writing

# Writing tests

Edit on GitHub

Define tests with a Jest-like API imported from the built-in bun:test module. Long term, Bun aims for complete Jest compatibility; at the moment, a limited set of expect matchers are supported.

## Basic usage

To define a simple test:

```typescript
import { expect, test } from "bun:test";

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});
```

Jest-style globals

As in Jest, you can use describe, test, expect, and other functions without importing them. Unlike Jest, they are not injected into the global scope. Instead, the Bun transpiler will automatically inject an import from bun:test internally.

```typescript
typeof globalThis.describe; // "undefined"
typeof describe; // "function"
```

This transpiler integration only occurs during bun test, and only for test files & preloaded scripts. In practice there's no significant difference to the end user.

Tests can be grouped into suites with describe.

```typescript
import { expect, test, describe } from "bun:test";

describe("arithmetic", () => {
  test("2 + 2", () => {
    expect(2 + 2).toBe(4);
  });

  test("2 * 2", () => {
    expect(2 * 2).toBe(4);
  });
});
```

Tests can be async.

```typescript
import { expect, test } from "bun:test";

test("2 * 2", async () => {
  const result = await Promise.resolve(2 * 2);
  expect(result).toEqual(4);
});
```

Alternatively, use the done callback to signal completion. If you include the done callback as a parameter in your test definition, you must call it or the test will hang.

```typescript
import { expect, test } from "bun:test";

test("2 * 2", done => {
  Promise.resolve(2 * 2).then(result => {
    expect(result).toEqual(4);
    done();
  });
});
```

## Timeouts

Optionally specify a per-test timeout in milliseconds by passing a number as the third argument to test.

```typescript
import { test } from "bun:test";

test("wat", async () => {
  const data = await slowOperation();
  expect(data).toBe(42);
}, 500); // test must run in <500ms
```

## test.skip

Skip individual tests with test.skip. These tests will not be run.

```typescript
import { expect, test } from "bun:test";

test.skip("wat", () => {
  // TODO: fix this
  expect(0.1 + 0.2).toEqual(0.3);
});
```

## test.todo

Mark a test as a todo with test.todo. These tests will be run, and the test runner will expect them to fail. If they pass, you will be prompted to mark it as a regular test.

```typescript
import { expect, test } from "bun:test";

test.todo("fix this", () => {
  myTestFunction();
});
```

To exclusively run tests marked as todo, use bun test --todo.

```typescript
bun test --todo
```

## test.only

To run a particular test or suite of tests use test.only() or describe.only(). Once declared, running bun test --skip will only execute tests/suites that have been marked with .only().

```typescript
import { test, describe } from "bun:test";

test("test #1", () => {
  // does not run
});

test.only("test #2", () => {
  // runs
});

describe.only("only", () => {
  test("test #3", () => {
    // runs
  });
});
```

The following command will only execute tests #2 and #3.

```typescript
bun test --only
```

## test.if

To run a test conditionally, use test.if(). The test will run if the condition is truthy. This is particularly useful for tests that should only run on specific architectures or operating systems.

```typescript
test.if(Math.random() > 0.5)("runs half the time", () => {
  // ...
});
```

```typescript
test.if(Math.random() > 0.5)("runs half the time", () => {
  // ...
});

const macOS = process.arch === "darwin";
test.if(macOS)("runs on macOS", () => {
  // runs if macOS
});
```

To instead skip a test based on some condition, use test.skipIf() or describe.skipIf().

```typescript
const macOS = process.arch === "darwin";

test.skipIf(macOS)("runs on non-macOS", () => {
  // runs if *not* macOS
});
```

## Matchers

Bun implements the following matchers. Full Jest compatibility is on the roadmap; track progress here.

Previous

bun test

Next

Watch mode

Edit on GitHub



Page URL: https://bun.sh/docs/test/hot

# Watch mode

Edit on GitHub

To automatically re-run tests when files change, use the --watch flag:

```typescript
bun test --watch
```

Bun will watch for changes to any files imported in a test file, and re-run tests when a change is detected.

It's fast.

"bun test --watch url" in a large folder with multiple files that start with "url" pic.twitter.com/aZV9BP4eFu

Previous

Writing tests

Next

Lifecycle hooks

Edit on GitHub



Page URL: https://bun.sh/docs/test/lifecycle

# Lifecycle hooks

Edit on GitHub

The test runner supports the following lifecycle hooks. This is useful for loading test fixtures, mocking data, and configuring the test environment.

Perform per-test setup and teardown logic with beforeEach and afterEach.

```typescript
import { beforeEach, afterEach } from "bun:test";

beforeEach(() => {
  console.log("running test.");
});

afterEach(() => {
  console.log("done with test.");
});

// tests...
```

Perform per-scope setup and teardown logic with beforeAll and afterAll. The scope is determined by where the hook is defined.

To scope the hooks to a particular describe block:

```typescript
import { describe, beforeAll } from "bun:test";

describe("test group", () => {
  beforeAll(() => {
    // setup
  });

  // tests...
});
```

To scope the hooks to a test file:

```typescript
import { describe, beforeAll } from "bun:test";

describe("test group", () => {
  beforeAll(() => {
    // setup
  });

  // tests...
});
```

To scope the hooks to an entire multi-file test run, define the hooks in a separate file.

```typescript
import { beforeAll, afterAll } from "bun:test";

beforeAll(() => {
  // global setup
});

afterAll(() => {
  // global teardown
});
```

Then use --preload to run the setup script before any test files.

```typescript
$ bun test --preload ./setup.ts
```

To avoid typing --preload every time you run tests, it can be added to your bunfig.toml:

```typescript
[test]
preload = ["./setup.ts"]
```

Previous

Watch mode

Next

Mocks

Edit on GitHub



Page URL: https://bun.sh/docs/test/mocks

# Mocks

Edit on GitHub

Create mocks with the mock function.

```typescript
import { test, expect, mock } from "bun:test";
const random = mock(() => Math.random());

test("random", async () => {
  const val = random();
  expect(val).toBeGreaterThan(0);
  expect(random).toHaveBeenCalled();
  expect(random).toHaveBeenCalledTimes(1);
});
```

The result of mock() is a new function that's been decorated with some additional properties.

```typescript
import { mock } from "bun:test";
const random = mock((multiplier: number) => multiplier * Math.random());

random(2);
random(10);

random.mock.calls;
// [[ 2 ], [ 10 ]]

random.mock.results;
//  [
//    { type: "return", value: 0.6533907460954099 },
//    { type: "return", value: 0.6452713933037312 }
//  ]
```

## .spyOn()

It's possible to track calls to a function without replacing it with a mock. Use spyOn() to create a spy; these spies can be passed to .toHaveBeenCalled() and .toHaveBeenCalledTimes().

```typescript
import { test, expect, spyOn } from "bun:test";

const ringo = {
  name: "Ringo",
  sayHi() {
    console.log(`Hello I'm ${this.name}`);
  },
};

const spy = spyOn(ringo, "sayHi");

test("spyon", () => {
  expect(spy).toHaveBeenCalledTimes(0);
  ringo.sayHi();
  expect(spy).toHaveBeenCalledTimes(1);
});
```

Previous

Lifecycle hooks

Next

Snapshots

Edit on GitHub



Page URL: https://bun.sh/docs/test/snapshots

# Snapshots

Edit on GitHub

Snapshot tests are written using the .toMatchSnapshot() matcher:

```typescript
import { test, expect } from "bun:test";

test("snap", () => {
  expect("foo").toMatchSnapshot();
});
```

The first time this test is run, the argument to expect will be serialized and written to a special snapshot file in a __snapshots__ directory alongside the test file. On future runs, the argument is compared against the snapshot on disk. Snapshots can be re-generated with the following command:

```typescript
bun test --update-snapshots
```

Previous

Mocks

Next

Dates and times

Edit on GitHub



Page URL: https://bun.sh/docs/test/time

# Dates and times

Edit on GitHub

bun:test lets you change what time it is in your tests.

This works with any of the following:

Timers are not impacted yet, but may be in a future release of Bun.

## setSystemTime

To change the system time, use setSystemTime:

```typescript
import { setSystemTime, beforeAll, test, expect } from "bun:test";

beforeAll(() => {
  setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
});

test("it is 2020", () => {
  expect(new Date().getFullYear()).toBe(2020);
});
```

To support existing tests that use Jest's useFakeTimers and useRealTimers, you can use useFakeTimers and useRealTimers:

```typescript
test("just like in jest", () => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  expect(new Date().getFullYear()).toBe(2020);
  jest.useRealTimers();
  expect(new Date().getFullYear()).toBeGreaterThan(2020);
});

test("unlike in jest", () => {
  const OriginalDate = Date;
  jest.useFakeTimers();
  if (typeof Bun === "undefined") {
    // In Jest, the Date constructor changes
    // That can cause all sorts of bugs because suddenly Date !== Date before the test.
    expect(Date).not.toBe(OriginalDate);
    expect(Date.now).not.toBe(OriginalDate.now);
  } else {
    // In bun:test, Date constructor does not change when you useFakeTimers
    expect(Date).toBe(OriginalDate);
    expect(Date.now).toBe(OriginalDate.now);
  }
});
```

Timers — Note that we have not implemented builtin support for mocking timers yet, but this is on the roadmap.

### Reset the system time

To reset the system time, pass no arguments to setSystemTime:

```typescript
import { setSystemTime, beforeAll } from "bun:test";

test("it was 2020, for a moment.", () => {
  // Set it to something!
  setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
  expect(new Date().getFullYear()).toBe(2020);

  // reset it!
  setSystemTime();

  expect(new Date().getFullYear()).toBeGreaterThan(2020);
});
```

## Set the time zone

To change the time zone, either pass the $TZ environment variable to bun test.

```typescript
TZ=America/Los_Angeles bun test
```

Or set process.env.TZ at runtime:

```typescript
import { test, expect } from "bun:test";

test("Welcome to California!", () => {
  process.env.TZ = "America/Los_Angeles";
  expect(new Date().getTimezoneOffset()).toBe(420);
  expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
    "America/Los_Angeles",
  );
});

test("Welcome to New York!", () => {
  // Unlike in Jest, you can set the timezone multiple times at runtime and it will work.
  process.env.TZ = "America/New_York";
  expect(new Date().getTimezoneOffset()).toBe(240);
  expect(new Intl.DateTimeFormat().resolvedOptions().timeZone).toBe(
    "America/New_York",
  );
});
```

Previous

Snapshots

Next

DOM testing

Edit on GitHub



Page URL: https://bun.sh/docs/test/dom

# DOM testing

Edit on GitHub

Bun's test runner plays well with existing component and DOM testing libraries, including React Testing Library and happy-dom.

## happy-dom

For writing headless tests for your frontend code and components, we recommend happy-dom. Happy DOM implements a complete set of HTML and DOM APIs in plain JavaScript, making it possible to simulate a browser environment with high fidelity.

To get started install the @happy-dom/global-registrator package as a dev dependency.

```typescript
bun add -d @happy-dom/global-registrator
```

We'll be using Bun's preload functionality to register the happy-dom globals before running our tests. This step will make browser APIs like document available in the global scope. Create a file called happydom.ts in the root of your project and add the following code:

```typescript
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();
```

To preload this file before bun test, open or create a bunfig.toml file and add the following lines.

```typescript
[test]
preload = "./happydom.ts"
```

This will execute happydom.ts when you run bun test. Now you can write tests that use browser APIs like document and window.

```typescript
import {test, expect} from 'bun:test';

test('dom test', () => {
  document.body.innerHTML = `<button>My button</button>`;
  const button = document.querySelector('button');
  expect(button?.innerText).toEqual('My button');
});
```

Depending on your tsconfig.json setup, you may see a "Cannot find name 'document'" type error in the code above. To "inject" the types for document and other browser APIs, add the following triple-slash directive to the top of any test file.

```typescript
/// <reference lib="dom" />

import {test, expect} from 'bun:test';

test('dom test', () => {
  document.body.innerHTML = `<button>My button</button>`;
  const button = document.querySelector('button');
  expect(button?.innerText).toEqual('My button');
});
```

Let's run this test with bun test:

```typescript
bun test
```

Previous

Dates and times

Next

Code coverage

Edit on GitHub



Page URL: https://bun.sh/docs/test/coverage

# Code coverage

Edit on GitHub

Bun's test runner now supports built-in code coverage reporting. This makes it easy to see how much of the codebase is covered by tests, and find areas that are not currently well-tested.

## Enabling coverage

bun:test supports seeing which lines of code are covered by tests. To use this feature, pass --coverage to the CLI. It will print out a coverage report to the console:

```typescript
$ bun test --coverage
-------------|---------|---------|-------------------
File         | % Funcs | % Lines | Uncovered Line #s
-------------|---------|---------|-------------------
All files    |   38.89 |   42.11 |
 index-0.ts  |   33.33 |   36.84 | 10-15,19-24
 index-1.ts  |   33.33 |   36.84 | 10-15,19-24
 index-10.ts |   33.33 |   36.84 | 10-15,19-24
 index-2.ts  |   33.33 |   36.84 | 10-15,19-24
 index-3.ts  |   33.33 |   36.84 | 10-15,19-24
 index-4.ts  |   33.33 |   36.84 | 10-15,19-24
 index-5.ts  |   33.33 |   36.84 | 10-15,19-24
 index-6.ts  |   33.33 |   36.84 | 10-15,19-24
 index-7.ts  |   33.33 |   36.84 | 10-15,19-24
 index-8.ts  |   33.33 |   36.84 | 10-15,19-24
 index-9.ts  |   33.33 |   36.84 | 10-15,19-24
 index.ts    |  100.00 |  100.00 |
-------------|---------|---------|-------------------
```

To always enable coverage reporting by default, add the following line to your bunfig.toml:

```typescript
[test]

# always enable coverage
coverage = true
```

By default coverage reports will include test files and exclude sourcemaps. This is usually what you want, but it can be configured otherwise in bunfig.toml.

```typescript
[test]
coverageSkipTestFiles = true       # default false
```

### Coverage thresholds

It is possible to specify a coverage threshold in bunfig.toml. If your test suite does not meet or exceed this threshold, bun test will exit with a non-zero exit code to indicate the failure.

```typescript
[test]

# to require 90% line-level and function-level coverage
coverageThreshold = 0.9

# to set different thresholds for lines and functions
coverageThreshold = { line = 0.9, function = 0.9 }
```

### Sourcemaps

Internally, Bun transpiles all files by default, so Bun automatically generates an internal source map that maps lines of your original source code onto Bun's internal representation. If for any reason you want to disable this, set test.coverageIgnoreSourcemaps to false; this will rarely be desirable outside of advanced use cases.

```typescript
[test]
coverageIgnoreSourcemaps = true   # default false
```

Previous

DOM testing

Next

bunx

Edit on GitHub



Page URL: https://bun.sh/docs/cli/bunx

# bunx

Edit on GitHub

Note — bunx is an alias for bun x. The bunx CLI will be auto-installed when you install bun.

Use bunx to auto-install and run packages from npm. It's Bun's equivalent of npx or yarn dlx.

```typescript
bunx cowsay "Hello world!"
```

⚡️ Speed — With Bun's fast startup times, bunx is roughly 100x faster than npx for locally installed packages.

Packages can declare executables in the "bin" field of their package.json. These are known as package executables or package binaries.

```typescript
{
  // ... other fields
  "name": "my-cli",
  "bin": {
    "my-cli": "dist/index.js"
  }
}
```

These executables are commonly plain JavaScript files marked with a shebang line to indicate which program should be used to execute them. The following file indicates that it should be executed with node.

```typescript
#!/usr/bin/env node

console.log("Hello world!");
```

These executables can be run with bunx,

```typescript
bunx my-cli
```

As with npx, bunx will check for a locally installed package first, then fall back to auto-installing the package from npm. Installed packages will be stored in Bun's global cache for future use.

## Arguments and flags

To pass additional command-line flags and arguments through to the executable, place them after the executable name.

```typescript
bunx my-cli --foo bar
```

## Shebangs

By default, Bun respects shebangs. If an executable is marked with #!/usr/bin/env node, Bun will spin up a node process to execute the file. However, in some cases it may be desirable to run executables using Bun's runtime, even if the executable indicates otherwise. To do so, include the --bun flag.

```typescript
bunx --bun my-cli
```

The --bun flag must occur before the executable name. Flags that appear after the name are passed through to the executable.

```typescript
bunx --bun my-cli # good
```

Previous

Code coverage

Next

HTTP server

Edit on GitHub



Page URL: https://bun.sh/docs/api/http

# HTTP server

Edit on GitHub

The page primarily documents the Bun-native Bun.serve API. Bun also implements fetch and the Node.js http and https modules.

These modules have been re-implemented to use Bun's fast internal HTTP infrastructure. Feel free to use these modules directly; frameworks like Express that depend on these modules should work out of the box. For granular compatibility information, see Runtime > Node.js APIs.

To start a high-performance HTTP server with a clean API, the recommended approach is Bun.serve.

## Bun.serve()

Start an HTTP server in Bun with Bun.serve.

```typescript
Bun.serve({
  fetch(req) {
    return new Response(`Bun!`);
  },
});
```

The fetch handler handles incoming requests. It receives a Request object and returns a Response or ```Promise<Response>```.

```typescript
Bun.serve({
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return new Response(`Home page!`);
    if (url.pathname === "/blog") return new Response("Blog!");
    return new Response(`404!`);
  },
});
```

To configure which port and hostname the server will listen on:

```typescript
Bun.serve({
  port: 8080, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  hostname: "mydomain.com", // defaults to "0.0.0.0"
  fetch(req) {
    return new Response(`404!`);
  },
});
```

To listen on a unix domain socket:

```typescript
Bun.serve({
  unix: "/tmp/my-socket.sock", // path to socket
  fetch(req) {
    return new Response(`404!`);
  },
});
```

## Error handling

To activate development mode, set development: true. By default, development mode is enabled unless NODE_ENV is production.

```typescript
Bun.serve({
  development: true,
  fetch(req) {
    throw new Error("woops!");
  },
});
```

In development mode, Bun will surface errors in-browser with a built-in error page.

To handle server-side errors, implement an error handler. This function should return a Response to served to the client when an error occurs. This response will supercede Bun's default error page in development mode.

```typescript
Bun.serve({
  fetch(req) {
    throw new Error("woops!");
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});
```

Learn more about debugging in Bun

The call to Bun.serve returns a Server object. To stop the server, call the .stop() method.

```typescript
const server = Bun.serve({
  fetch() {
    return new Response("Bun!");
  },
});

server.stop();
```

## TLS

Bun supports TLS out of the box, powered by BoringSSL. Enable TLS by passing in a value for key and cert; both are required to enable TLS.

```typescript
Bun.serve({
  fetch(req) {
    return new Response("Hello!!!");
  },

  tls: {
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
  }
});
```

The key and cert fields expect the contents of your TLS key and certificate, not a path to it. This can be a string, BunFile, TypedArray, or Buffer.

```typescript
Bun.serve({
  fetch() {},

  tls: {
    // BunFile
    key: Bun.file("./key.pem"),
    // Buffer
    key: fs.readFileSync("./key.pem"),
    // string
    key: fs.readFileSync("./key.pem", "utf8"),
    // array of above
    key: [Bun.file("./key1.pem"), Bun.file("./key2.pem")],
  },
});
```

If your private key is encrypted with a passphrase, provide a value for passphrase to decrypt it.

```typescript
Bun.serve({
  fetch(req) {
    return new Response("Hello!!!");
  },

  tls: {
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
    passphrase: "my-secret-passphrase",
  }
});
```

Optionally, you can override the trusted CA certificates by passing a value for ca. By default, the server will trust the list of well-known CAs curated by Mozilla. When ca is specified, the Mozilla list is overwritten.

```typescript
Bun.serve({
  fetch(req) {
    return new Response("Hello!!!");
  },
  tls: {
    key: Bun.file("./key.pem"), // path to TLS key
    cert: Bun.file("./cert.pem"), // path to TLS cert
    ca: Bun.file("./ca.pem"), // path to root CA certificate
  }
});
```

To override Diffie-Helman parameters:

```typescript
Bun.serve({
  // ...
  tls: {
    // other config
    dhParamsFile: "/path/to/dhparams.pem", // path to Diffie Helman parameters
  },
});
```

## Object syntax

Thus far, the examples on this page have used the explicit Bun.serve API. Bun also supports an alternate syntax.

```typescript
import {type Serve} from "bun";

export default {
  fetch(req) {
    return new Response(`Bun!`);
  },
} satisfies Serve;
```

Instead of passing the server options into Bun.serve, export default it. This file can be executed as-is; when Bun sees a file with a default export containing a fetch handler, it passes it into Bun.serve under the hood.

## Streaming files

To stream a file, return a Response object with a BunFile object as the body.

```typescript
import { serve, file } from "bun";

serve({
  fetch(req) {
    return new Response(Bun.file("./hello.txt"));
  },
});
```

⚡️ Speed — Bun automatically uses the sendfile(2) system call when possible, enabling zero-copy file transfers in the kernel—the fastest way to send files.

You can send part of a file using the slice(start, end) method on the Bun.file object. This automatically sets the Content-Range and Content-Length headers on the Response object.

```typescript
Bun.serve({
  fetch(req) {
    // parse `Range` header
    const [start = 0, end = Infinity] = req.headers
      .get("Range") // Range: bytes=0-100
      .split("=") // ["Range: bytes", "0-100"]
      .at(-1) // "0-100"
      .split("-") // ["0", "100"]
      .map(Number); // [0, 100]

    // return a slice of the file
    const bigFile = Bun.file("./big-video.mp4");
    return new Response(bigFile.slice(start, end));
  },
});
```

## Benchmarks

Below are Bun and Node.js implementations of a simple HTTP server that responds Bun! to each incoming Request.

```typescript
Bun.serve({
  fetch(req: Request) {
    return new Response(`Bun!`);
  },
  port: 3000,
});
```

```typescript
require("http")
  .createServer((req, res) => res.end("Bun!"))
  .listen(8080);
```

The Bun.serve server can handle roughly 2.5x more requests per second than Node.js on Linux.

## Reference

See TypeScript definitions

```typescript
interface Bun {
  serve(options: {
    fetch: (req: Request, server: Server) => Response | Promise<Response>;
    hostname?: string;
    port?: number;
    development?: boolean;
    error?: (error: Error) => Response | Promise<Response>;
    tls?: {
      key?:
        | string
        | TypedArray
        | BunFile
        | Array<string | TypedArray | BunFile>;
      cert?:
        | string
        | TypedArray
        | BunFile
        | Array<string | TypedArray | BunFile>;
      ca?: string | TypedArray | BunFile | Array<string | TypedArray | BunFile>;
      passphrase?: string;
      dhParamsFile?: string;
    };
    maxRequestBodySize?: number;
    lowMemoryMode?: boolean;
  }): Server;
}

interface Server {
  development: boolean;
  hostname: string;
  port: number;
  pendingRequests: number;
  stop(): void;
}
```

Previous

bunx

Next

WebSockets

Edit on GitHub



Page URL: https://bun.sh/docs/api/websockets

# WebSockets

Edit on GitHub

Bun.serve() supports server-side WebSockets, with on-the-fly compression, TLS support, and a Bun-native publish-subscribe API.

⚡️ 7x more throughput — Bun's WebSockets are fast. For a simple chatroom on Linux x64, Bun can handle 7x more requests per second than Node.js + "ws".

Internally Bun's WebSocket implementation is built on uWebSockets.

## Start a WebSocket server

Below is a simple WebSocket server built with Bun.serve, in which all incoming requests are upgraded to WebSocket connections in the fetch handler. The socket handlers are declared in the websocket parameter.

```typescript
Bun.serve({
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed :(", { status: 500 });
  },
  websocket: {}, // handlers
});
```

The following WebSocket event handlers are supported:

```typescript
Bun.serve({
  fetch(req, server) {}, // upgrade logic
  websocket: {
    message(ws, message) {}, // a message is received
    open(ws) {}, // a socket is opened
    close(ws, code, message) {}, // a socket is closed
    drain(ws) {}, // the socket is ready to receive more data
  },
});
```

An API designed for speed

In Bun, handlers are declared once per server, instead of per socket.

ServerWebSocket expects you to pass a WebSocketHandler object to the Bun.serve() method which has methods for open, message, close, drain, and error. This is different than the client-side WebSocket class which extends EventTarget (onmessage, onopen, onclose),

Clients tend to not have many socket connections open so an event-based API makes sense.

But servers tend to have many socket connections open, which means:

So, instead of using an event-based API, ServerWebSocket expects you to pass a single object with methods for each event in Bun.serve() and it is reused for each connection.

This leads to less memory usage and less time spent adding/removing event listeners.

The first argument to each handler is the instance of ServerWebSocket handling the event. The ServerWebSocket class is a fast, Bun-native implementation of WebSocket with some additional features.

```typescript
Bun.serve({
  fetch(req, server) {}, // upgrade logic
  websocket: {
    message(ws, message) {
      ws.send(message); // echo back the message
    },
  },
});
```

### Sending messages

Each ServerWebSocket instance has a .send() method for sending messages to the client. It supports a range of input types.

```typescript
ws.send("Hello world"); // string
ws.send(response.arrayBuffer()); // ArrayBuffer
ws.send(new Uint8Array([1, 2, 3])); // TypedArray | DataView
```

### Headers

Once the upgrade succeeds, Bun will send a 101 Switching Protocols response per the spec. Additional headers can be attched to this Response in the call to server.upgrade().

```typescript
Bun.serve({
  fetch(req, server) {
    const sessionId = await generateSessionId();
    server.upgrade(req, {
      headers: {
        "Set-Cookie": `SessionId=${sessionId}`,
      },
    });
  },
  websocket: {}, // handlers
});
```

### Contextual data

Contextual data can be attached to a new WebSocket in the .upgrade() call. This data is made available on the ws.data property inside the WebSocket handlers.

```typescript
type WebSocketData = {
  createdAt: number;
  channelId: string;
  authToken: string;
};

// TypeScript: specify the type of `data`
Bun.serve<WebSocketData>({
  fetch(req, server) {
    // use a library to parse cookies
    const cookies = parseCookies(req.headers.get("Cookie"));
    server.upgrade(req, {
      // this object must conform to WebSocketData
      data: {
        createdAt: Date.now(),
        channelId: new URL(req.url).searchParams.get("channelId"),
        authToken: cookies["X-Token"],
      },
    });

    return undefined;
  },
  websocket: {
    // handler called when a message is received
    async message(ws, message) {
      const user = getUserFromToken(ws.data.authToken);

      await saveMessageToDatabase({
        channel: ws.data.channelId,
        message: String(message),
        userId: user.id,
      });
    },
  },
});
```

To connect to this server from the browser, create a new WebSocket.

```typescript
const socket = new WebSocket("ws://localhost:3000/chat");

socket.addEventListener("message", event => {
  console.log(event.data);
})
```

Identifying users — The cookies that are currently set on the page will be sent with the WebSocket upgrade request and available on req.headers in the fetch handler. Parse these cookies to determine the identity of the connecting user and set the value of data accordingly.

### Pub/Sub

Bun's ServerWebSocket implementation implements a native publish-subscribe API for topic-based broadcasting. Individual sockets can .subscribe() to a topic (specified with a string identifier) and .publish() messages to all other subscribers to that topic. This topic-based broadcast API is similar to MQTT and Redis Pub/Sub.

```typescript
const server = Bun.serve<{ username: string }>({
  fetch(req, server) {
    const url = new URL(req.url);
    if (url.pathname === "/chat") {
      console.log(`upgrade!`);
      const username = getUsernameFromReq(req);
      const success = server.upgrade(req, { data: { username } });
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.username} has entered the chat`;
      ws.subscribe("the-group-chat");
      ws.publish("the-group-chat", msg);
    },
    message(ws, message) {
      // this is a group chat
      // so the server re-broadcasts incoming message to everyone
      ws.publish("the-group-chat", `${ws.data.username}: ${message}`);
    },
    close(ws) {
      const msg = `${ws.data.username} has left the chat`;
      ws.unsubscribe("the-group-chat");
      ws.publish("the-group-chat", msg);
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);
```

Calling .publish(data) will send the message to all subscribers of a topic except the socket that called .publish().

### Compression

Per-message compression can be enabled with the perMessageDeflate parameter.

```typescript
Bun.serve({
  fetch(req, server) {}, // upgrade logic
  websocket: {
    // enable compression and decompression
    perMessageDeflate: true,
  },
});
```

Compression can be enabled for individual messages by passing a boolean as the second argument to .send().

```typescript
ws.send("Hello world", true);
```

For fine-grained control over compression characteristics, refer to the Reference.

### Backpressure

The .send(message) method of ServerWebSocket returns a number indicating the result of the operation.

This gives you better control over backpressure in your server.

## Connect to a Websocket server

🚧 — The WebSocket client still does not pass the full Autobahn test suite and should not be considered ready for production.

Bun implements the WebSocket class. To create a WebSocket client that connects to a ws:// or wss:// server, create an instance of WebSocket, as you would in the browser.

```typescript
const socket = new WebSocket("ws://localhost:3000");
```

In browsers, the cookies that are currently set on the page will be sent with the WebSocket upgrade request. This is a standard feature of the WebSocket API.

For convenience, Bun lets you setting custom headers directly in the constructor. This is a Bun-specific extension of the WebSocket standard. This will not work in browsers.

```typescript
const socket = new WebSocket("ws://localhost:3000", {
  headers: {
    // custom headers
  },
});
```

To add event listeners to the socket:

```typescript
// message is received
socket.addEventListener("message", event => {});

// socket opened
socket.addEventListener("open", event => {});

// socket closed
socket.addEventListener("close", event => {});

// error handler
socket.addEventListener("error", event => {});
```

## Reference

```typescript
namespace Bun {
  export function serve(params: {
    fetch: (req: Request, server: Server) => Response | Promise<Response>;
    websocket?: {
      message: (
        ws: ServerWebSocket,
        message: string | ArrayBuffer | Uint8Array,
      ) => void;
      open?: (ws: ServerWebSocket) => void;
      close?: (ws: ServerWebSocket) => void;
      error?: (ws: ServerWebSocket, error: Error) => void;
      drain?: (ws: ServerWebSocket) => void;
      perMessageDeflate?:
        | boolean
        | {
            compress?: boolean | Compressor;
            decompress?: boolean | Compressor;
          };
    };
  }): Server;
}

type Compressor =
  | `"disable"`
  | `"shared"`
  | `"dedicated"`
  | `"3KB"`
  | `"4KB"`
  | `"8KB"`
  | `"16KB"`
  | `"32KB"`
  | `"64KB"`
  | `"128KB"`
  | `"256KB"`;

interface Server {
  pendingWebsockets: number;
  publish(
    topic: string,
    data: string | ArrayBufferView | ArrayBuffer,
    compress?: boolean,
  ): number;
  upgrade(
    req: Request,
    options?: {
      headers?: HeadersInit;
      data?: any;
    },
  ): boolean;
}

interface ServerWebSocket {
  readonly data: any;
  readonly readyState: number;
  readonly remoteAddress: string;
  send(message: string | ArrayBuffer | Uint8Array, compress?: boolean): number;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string | ArrayBuffer | Uint8Array): void;
  isSubscribed(topic: string): boolean;
  cork(cb: (ws: ServerWebSocket) => void): void;
}
```

Previous

HTTP server

Next

Workers

Edit on GitHub



Page URL: https://bun.sh/docs/api/workers

# Workers

Edit on GitHub

🚧 — The Worker API is still experimental and should not be considered ready for production.

Worker lets you start and communicate with a new JavaScript instance running on a separate thread while sharing I/O resources with the main thread.

Bun implements a minimal version of the Web Workers API with extensions that make it work better for server-side use cases. Like the rest of Bun, Worker in Bun support CommonJS, ES Modules, TypeScript, JSX, TSX and more out of the box. No extra build steps are necessary.

## Creating a Worker

Like in browsers, Worker is a global. Use it to create a new worker thread.

From the main thread:

```typescript
const workerURL = new URL("worker.ts", import.meta.url).href;
const worker = new Worker(workerURL);

worker.postMessage("hello");
worker.onmessage = event => {
  console.log(event.data);
};
```

Worker thread:

```typescript
self.onmessage = (event: MessageEvent) => {
  console.log(event.data);
  postMessage("world");
};
```

You can use import/export syntax in your worker code. Unlike in browsers, there's no need to specify {type: "module"} to use ES Modules.

To simplify error handling, the initial script to load is resolved at the time new Worker(url) is called.

```typescript
const worker = new Worker("/not-found.js");
// throws an error immediately
```

The specifier passed to Worker is resolved relative to the project root (like typing bun ./path/to/file.js).

### "open"

The "open" event is emitted when a worker is created and ready to receive messages. This can be used to send an initial message to a worker once it's ready. (This event does not exist in browsers.)

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

worker.addEventListener("open", () => {
  console.log("worker is ready");
});
```

Messages are automatically enqueued until the worker is ready, so there is no need to wait for the "open" event to send messages.

## Messages with postMessage

To send messages, use worker.postMessage and self.postMessage. This leverages the HTML Structured Clone Algorithm.

```typescript
// On the worker thread, `postMessage` is automatically "routed" to the parent thread.
postMessage({ hello: "world" });

// On the main thread
worker.postMessage({ hello: "world" });
```

To receive messages, use the message event handler on the worker and main thread.

```typescript
// Worker thread:
self.addEventListener("message", event => {
  console.log(event.data);
});
// or use the setter:
// self.onmessage = fn

// if on the main thread
worker.addEventListener("message", event => {
  console.log(event.data);
});
// or use the setter:
// worker.onmessage = fn
```

## Terminating a worker

A Worker instance terminates automatically once it's event loop has no work left to do. Attaching a "message" listener on the global or any MessagePorts will keep the event loop alive. To forcefully terminate a Worker, call worker.terminate().

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

// ...some time later
worker.terminate();
```

This will cause the worker's to exit as soon as possible.

### process.exit()

A worker can terminate itself with process.exit(). This does not terminate the main process. Like in Node.js, process.on('beforeExit', callback) and process.on('exit', callback) are emitted on the worker thread (and not on the main thread), and the exit code is passed to the "close" event.

### "close"

The "close" event is emitted when a worker has been terminated. It can take some time for the worker to actually terminate, so this event is emitted when the worker has been marked as terminated. The CloseEvent will contain the exit code passed to process.exit(), or 0 if closed for other reasons.

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href);

worker.addEventListener("close", event => {
  console.log("worker is being closed");
});
```

This event does not exist in browsers.

## Managing lifetime

By default, an active Worker will keep the main (spawning) process alive, so async tasks like setTimeout and promises will keep the process alive. Attaching message listeners will also keep the Worker alive.

### worker.unref()

To stop a running worker from keeping the process alive, call worker.unref(). This decouples the lifetime of the worker to the lifetime of the main process, and is equivlent to what Node.js' worker_threads does.

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href);
worker.unref();
```

Note: worker.unref() is not available in browers.

### worker.ref()

To keep the process alive until the Worker terminates, call worker.ref(). A ref'd worker is the default behavior, and still needs something going on in the event loop (such as a "message" listener) for the worker to continue running.

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href);
worker.unref();
// later...
worker.ref();
```

Alternatively, you can also pass an options object to Worker:

```typescript
const worker = new Worker(new URL("worker.ts", import.meta.url).href, {
  ref: false,
});
```

Note: worker.ref() is not available in browers.

## Memory usage with smol

JavaScript instances can use a lot of memory. Bun's Worker supports a smol mode that reduces memory usage, at a cost of performance. To enable smol mode, pass smol: true to the options object in the Worker constructor.

```typescript
const worker = new Worker("./i-am-smol.ts", {
  smol: true,
});
```

What does smol mode actually do?

Setting smol: true sets JSC::HeapSize to be Small instead of the default Large.

Previous

WebSockets

Next

Binary data

Edit on GitHub



Page URL: https://bun.sh/docs/api/binary-data

# Binary data

Edit on GitHub

This page is intended as an introduction to working with binary data in JavaScript. Bun implements a number of data types and utilities for working with binary data, most of which are Web-standard. Any Bun-specific APIs will be noted as such.

Below is a quick "cheat sheet" that doubles as a table of contents. Click an item in the left column to jump to that section.

## ArrayBuffer and views

Until 2009, there was no language-native way to store and manipulate binary data in JavaScript. ECMAScript v5 introduced a range of new mechanisms for this. The most fundamental building block is ArrayBuffer, a simple data structure that represents a sequence of bytes in memory.

```typescript
// this buffer can store 8 bytes
const buf = new ArrayBuffer(8);
```

Despite the name, it isn't an array and supports none of the array methods and operators one might expect. In fact, there is no way to directly read or write values from an ArrayBuffer. There's very little you can do with one except check its size and create "slices" from it.

```typescript
const buf = new ArrayBuffer(8);

buf.byteLength; // => 8

const slice = buf.slice(0, 4); // returns new ArrayBuffer
slice.byteLength; // => 4
```

To do anything interesting we need a construct known as a "view". A view is a class that wraps an ArrayBuffer instance and lets you read and manipulate the underlying data. There are two types of views: typed arrays and DataView.

### DataView

The DataView class is a lower-level interface for reading and manipulating the data in an ArrayBuffer.

Below we create a new DataView and set the first byte to 5.

```typescript
const buf = new ArrayBuffer(4);
// [0x0, 0x0, 0x0, 0x0]

const dv = new DataView(buf);
dv.setUint8(0, 3); // write value 3 at byte offset 0
dv.getUint8(0); // => 3
// [0x11, 0x0, 0x0, 0x0]
```

Now lets write a Uint16 at byte offset 1. This requires two bytes. We're using the value 513, which is 2 * 256 + 1; in bytes, that's 00000010 00000001.

```typescript
dv.setUint16(1, 513);
// [0x11, 0x10, 0x1, 0x0]

console.log(dv.getUint16(1)); // => 513
```

We've now assigned a value to the first three bytes in our underlying ArrayBuffer. Even though the second and third bytes were created using setUint16(), we can still read each of its component bytes using getUint8().

```typescript
console.log(dv.getUint8(1)); // => 2
console.log(dv.getUint8(2)); // => 1
```

Attempting to write a value that requires more space than is available in the underlying ArrayBuffer will cause an error. Below we attempt to write a Float64 (which requires 8 bytes) at byte offset 0, but there are only four total bytes in the buffer.

```typescript
dv.setFloat64(0, 3.1415);
// ^ RangeError: Out of bounds access
```

The following methods are available on DataView:

### TypedArray

Typed arrays are a family of classes that provide an Array-like interface for interacting with data in an ArrayBuffer. Whereas a DataView lets you write numbers of varying size at a particular offset, a TypedArray interprets the underlying bytes as an array of numbers, each of a fixed size.

Note — It's common to refer to this family of classes collectively by their shared superclass TypedArray. This class as internal to JavaScript; you can't directly create instances of it, and TypedArray is not defined in the global scope. Think of it as an interface or an abstract class.

```typescript
const buffer = new ArrayBuffer(3);
const arr = new Uint8Array(buffer);

// contents are initialized to zero
console.log(arr); // Uint8Array(3) [0, 0, 0]

// assign values like an array
arr[0] = 0;
arr[1] = 10;
arr[2] = 255;
arr[3] = 255; // no-op, out of bounds
```

While an ArrayBuffer is a generic sequence of bytes, these typed array classes interpret the bytes as an array of numbers of a given byte size. The top row contains the raw bytes, and the later rows contain how these bytes will be interpreted when viewed using different typed array classes.

The following classes are typed arrays, along with a description of how they interpret the bytes in an ArrayBuffer:

The table below demonstrates how the bytes in an ArrayBuffer are interpreted when viewed using different typed array classes.

To create a typed array from a pre-defined ArrayBuffer:

```typescript
// create typed array from ArrayBuffer
const buf = new ArrayBuffer(10);
const arr = new Uint8Array(buf);

arr[0] = 30;
arr[1] = 60;

// all elements are initialized to zero
console.log(arr); // => Uint8Array(10) [ 30, 60, 0, 0, 0, 0, 0, 0, 0, 0 ];
```

If we tried to instantiate a Uint32Array from this same ArrayBuffer, we'd get an error.

```typescript
const buf = new ArrayBuffer(10);
const arr = new Uint32Array(buf);
//          ^  RangeError: ArrayBuffer length minus the byteOffset
//             is not a multiple of the element size
```

A Uint32 value requires four bytes (16 bits). Because the ArrayBuffer is 10 bytes long, there's no way to cleanly divide its contents into 4-byte chunks.

To fix this, we can create a typed array over a particular "slice" of an ArrayBuffer. The Uint16Array below only "views" the first 8 bytes of the underlying ArrayBuffer. To achieve these, we specify a byteOffset of 0 and a length of 2, which indicates the number of Uint32 numbers we want our array to hold.

```typescript
// create typed array from ArrayBuffer slice
const buf = new ArrayBuffer(10);
const arr = new Uint32Array(buf, 0, 2);

/*
  buf    _ _ _ _ _ _ _ _ _ _    10 bytes
  arr   [_______,_______]       2 4-byte elements
*/

arr.byteOffset; // 0
arr.length; // 2
```

You don't need to explicitly create an ArrayBuffer instance; you can instead directly specify a length in the typed array constructor:

```typescript
const arr2 = new Uint8Array(5);

// all elements are initialized to zero
// => Uint8Array(5) [0, 0, 0, 0, 0]
```

Typed arrays can also be instantiated directly from an array of numbers, or another typed array:

```typescript
// from an array of numbers
const arr1 = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);
arr1[0]; // => 0;
arr1[7]; // => 7;

// from another typed array
const arr2 = new Uint8Array(arr);
```

Broadly speaking, typed arrays provide the same methods as regular arrays, with a few exceptions. For example, push and pop are not available on typed arrays, because they would require resizing the underlying ArrayBuffer.

```typescript
const arr = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]);

// supports common array methods
arr.filter(n => n > 128); // Uint8Array(1) [255]
arr.map(n => n * 2); // Uint8Array(8) [0, 2, 4, 6, 8, 10, 12, 14]
arr.reduce((acc, n) => acc + n, 0); // 28
arr.forEach(n => console.log(n)); // 0 1 2 3 4 5 6 7
arr.every(n => n < 10); // true
arr.find(n => n > 5); // 6
arr.includes(5); // true
arr.indexOf(5); // 5
```

Refer to the MDN documentation for more information on the properties and methods of typed arrays.

### Uint8Array

It's worth specifically highlighting Uint8Array, as it represents a classic "byte array"—a sequence of 8-bit unsigned integers between 0 and 255. This is the most common typed array you'll encounter in JavaScript.

It is the return value of TextEncoder#encode, and the input type of TextDecoder#decode, two utility classes designed to translate strings and various binary encodings, most notably "utf-8".

```typescript
const encoder = new TextEncoder();
const bytes = encoder.encode("hello world");
// => Uint8Array(11) [ 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100 ]

const decoder = new TextDecoder();
const text = decoder.decode(bytes);
// => hello world
```

### Buffer

Bun implements Buffer, a Node.js API for working with binary data that pre-dates the introduction of typed arrays in the JavaScript spec. It has since been re-implemented as a subclass of Uint8Array. It provides a wide range of methods, including several Array-like and DataView-like methods.

```typescript
const buf = Buffer.from("hello world");
// => Buffer(16) [ 116, 104, 105, 115, 32, 105, 115, 32, 97, 32, 115, 116, 114, 105, 110, 103 ]

buf.length; // => 11
buf[0]; // => 104, ascii for 'h'
buf.writeUInt8(72, 0); // => ascii for 'H'

console.log(buf.toString());
// => Hello world
```

For complete documentation, refer to the Node.js documentation.

## Blob

Blob is a Web API commonly used for representing files. Blob was initially implemented in browsers (unlike ArrayBuffer which is part of JavaScript itself), but it is now supported in Node and Bun.

It isn't common to directly create Blob instances. More often, you'll recieve instances of Blob from an external source (like an <input type="file"> element in the browser) or library. That said, it is possible to create a Blob from one or more string or binary "blob parts".

```typescript
const blob = new Blob(["<html>Hello</html>"], {
  type: "text/html",
});

blob.type; // => text/html
blob.size; // => 19
```

These parts can be string, ArrayBuffer, TypedArray, DataView, or other Blob instances. The blob parts are concatenated together in the order they are provided.

```typescript
const blob = new Blob([
  "<html>",
  new Blob(["<body>"]),
  new Uint8Array([104, 101, 108, 108, 111]), // "hello" in binary
  "</body></html>",
]);
```

The contents of a Blob can be asynchronously read in various formats.

```typescript
await blob.text(); // => <html><body>hello</body></html>
await blob.arrayBuffer(); // => ArrayBuffer (copies contents)
await blob.stream(); // => ReadableStream
```

### BunFile

BunFile is a subclass of Blob used to represent a lazily-loaded file on disk. Like File, it adds a name and lastModified property. Unlike File, it does not require the file to be loaded into memory.

```typescript
const file = Bun.file("index.txt");
// => BunFile
```

### File

Browser only. Experimental support in Node.js 20.

File is a subclass of Blob that adds a name and lastModified property. It's commonly used in the browser to represent files uploaded via a <input type="file"> element. Node.js and Bun implement File.

```typescript
// on browser!
// <input type="file" id="file" />

const files = document.getElementById("file").files;
// => File[]
```

```typescript
const file = new File(["<html>Hello</html>"], "index.html", {
  type: "text/html",
});
```

Refer to the MDN documentation for complete docs information.

## Streams

Streams are an important abstraction for working with binary data without loading it all into memory at once. They are commonly used for reading and writing files, sending and receiving network requests, and processing large amounts of data.

Bun implements the Web APIs ReadableStream and WritableStream.

Bun also implements the node:stream module, including Readable, Writable, and Duplex. For complete documentation, refer to the Node.js docs.

To create a simple readable stream:

```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("hello");
    controller.enqueue("world");
    controller.close();
  },
});
```

The contents of this stream can be read chunk-by-chunk with for await syntax.

```typescript
for await (const chunk of stream) {
  console.log(chunk);
  // => "hello"
  // => "world"
}
```

For a more complete discusson of streams in Bun, see API > Streams.

## Conversion

Converting from one binary format to another is a common task. This section is intended as a reference.

### From ArrayBuffer

Since ArrayBuffer stores the data that underlies other binary structures like TypedArray, the snippets below are not converting from ArrayBuffer to another format. Instead, they are creating a new instance using the data stored underlying data.

#### To TypedArray

```typescript
new Uint8Array(buf);
```

#### To DataView

```typescript
new DataView(buf);
```

#### To Buffer

```typescript
// create Buffer over entire ArrayBuffer
Buffer.from(buf);

// create Buffer over a slice of the ArrayBuffer
Buffer.from(buf, 0, 10);
```

#### To string

```typescript
new TextDecoder().decode(buf);
```

#### To number[]

```typescript
Array.from(new Uint8Array(buf));
```

#### To Blob

```typescript
new Blob([buf], { type: "text/plain" });
```

#### To ReadableStream

The following snippet creates a ReadableStream and enqueues the entire ArrayBuffer as a single chunk.

```typescript
new ReadableStream({
  start(controller) {
    controller.enqueue(buf);
    controller.close();
  },
});
```

With chunking

To stream the ArrayBuffer in chunks, use a Uint8Array view and enqueue each chunk.

```typescript
const view = new Uint8Array(buf);
const chunkSize = 1024;

new ReadableStream({
  start(controller) {
    for (let i = 0; i < view.length; i += chunkSize) {
      controller.enqueue(view.slice(i, i + chunkSize));
    }
    controller.close();
  },
});
```

### From TypedArray

#### To ArrayBuffer

This retrieves the underlying ArrayBuffer. Note that a TypedArray can be a view of a slice of the underlying buffer, so the sizes may differ.

```typescript
arr.buffer;
```

#### To DataView

To creates a DataView over the same byte range as the TypedArray.

```typescript
new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
```

#### To Buffer

```typescript
Buffer.from(arr);
```

#### To string

```typescript
new TextDecoder().decode(arr);
```

#### To number[]

```typescript
Array.from(arr);
```

#### To Blob

```typescript
new Blob([arr.buffer], { type: "text/plain" });
```

#### To ReadableStream

```typescript
new ReadableStream({
  start(controller) {
    controller.enqueue(arr);
    controller.close();
  },
});
```

With chunking

To stream the ArrayBuffer in chunks, split the TypedArray into chunks and enqueue each one individually.

```typescript
new ReadableStream({
  start(controller) {
    for (let i = 0; i < arr.length; i += chunkSize) {
      controller.enqueue(arr.slice(i, i + chunkSize));
    }
    controller.close();
  },
});
```

### From DataView

#### To ArrayBuffer

```typescript
view.buffer;
```

#### To TypedArray

Only works if the byteLength of the DataView is a multiple of the BYTES_PER_ELEMENT of the TypedArray subclass.

```typescript
new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
new Uint16Array(view.buffer, view.byteOffset, view.byteLength / 2);
new Uint32Array(view.buffer, view.byteOffset, view.byteLength / 4);
// etc...
```

#### To Buffer

```typescript
Buffer.from(view.buffer, view.byteOffset, view.byteLength);
```

#### To string

```typescript
new TextDecoder().decode(view);
```

#### To number[]

```typescript
Array.from(view);
```

#### To Blob

```typescript
new Blob([view.buffer], { type: "text/plain" });
```

#### To ReadableStream

```typescript
new ReadableStream({
  start(controller) {
    controller.enqueue(view.buffer);
    controller.close();
  },
});
```

With chunking

To stream the ArrayBuffer in chunks, split the DataView into chunks and enqueue each one individually.

```typescript
new ReadableStream({
  start(controller) {
    for (let i = 0; i < view.byteLength; i += chunkSize) {
      controller.enqueue(view.buffer.slice(i, i + chunkSize));
    }
    controller.close();
  },
});
```

### From Buffer

#### To ArrayBuffer

```typescript
buf.buffer;
```

#### To TypedArray

```typescript
new Uint8Array(buf);
```

#### To DataView

```typescript
new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
```

#### To string

```typescript
buf.toString();
```

#### To number[]

```typescript
Array.from(buf);
```

#### To Blob

```typescript
new Blob([buf], { type: "text/plain" });
```

#### To ReadableStream

```typescript
new ReadableStream({
  start(controller) {
    controller.enqueue(buf);
    controller.close();
  },
});
```

With chunking

To stream the ArrayBuffer in chunks, split the Buffer into chunks and enqueue each one individually.

```typescript
new ReadableStream({
  start(controller) {
    for (let i = 0; i < buf.length; i += chunkSize) {
      controller.enqueue(buf.slice(i, i + chunkSize));
    }
    controller.close();
  },
});
```

### From Blob

#### To ArrayBuffer

The Blob class provides a convenience method for this purpose.

```typescript
await blob.arrayBuffer();
```

#### To TypedArray

```typescript
new Uint8Array(await blob.arrayBuffer());
```

#### To DataView

```typescript
new DataView(await blob.arrayBuffer());
```

#### To Buffer

```typescript
Buffer.from(await blob.arrayBuffer());
```

#### To string

```typescript
await blob.text();
```

#### To number[]

```typescript
Array.from(new Uint8Array(await blob.arrayBuffer()));
```

#### To ReadableStream

```typescript
blob.stream();
```

### From ReadableStream

It's common to use Response as a convenient intermediate representation to make it easier to convert ReadableStream to other formats.

```typescript
stream; // ReadableStream

const buffer = new Response(stream).arrayBuffer();
```

However this approach is verbose and adds overhead that slows down overall performance unnecessarily. Bun implements a set of optimized convenience functions for converting ReadableStream various binary formats.

#### To ArrayBuffer

```typescript
// with Response
new Response(stream).arrayBuffer();

// with Bun function
Bun.readableStreamToArrayBuffer(stream);
```

#### To TypedArray

```typescript
// with Response
const buf = await new Response(stream).arrayBuffer();
new Uint8Array(buf);

// with Bun function
new Uint8Array(Bun.readableStreamToArrayBuffer(stream));
```

#### To DataView

```typescript
// with Response
const buf = await new Response(stream).arrayBuffer();
new DataView(buf);

// with Bun function
new DataView(Bun.readableStreamToArrayBuffer(stream));
```

#### To Buffer

```typescript
// with Response
const buf = await new Response(stream).arrayBuffer();
Buffer.from(buf);

// with Bun function
Buffer.from(Bun.readableStreamToArrayBuffer(stream));
```

#### To string

```typescript
// with Response
new Response(stream).text();

// with Bun function
await Bun.readableStreamToText(stream);
```

#### To number[]

```typescript
// with Response
const buf = await new Response(stream).arrayBuffer();
Array.from(new Uint8Array(buf));

// with Bun function
Array.from(new Uint8Array(Bun.readableStreamToArrayBuffer(stream)));
```

Bun provides a utility for resolving a ReadableStream to an array of its chunks. Each chunk may be a string, typed array, or ArrayBuffer.

```typescript
// with Bun function
Bun.readableStreamToArray(stream);
```

#### To Blob

```typescript
new Response(stream).blob();
```

#### To ReadableStream

To split a ReadableStream into two streams that can be consumed independently:

```typescript
const [a, b] = stream.tee();
```

Previous

Workers

Next

Streams

Edit on GitHub



Page URL: https://bun.sh/docs/api/streams

# Streams

Edit on GitHub

Streams are an important abstraction for working with binary data without loading it all into memory at once. They are commonly used for reading and writing files, sending and receiving network requests, and processing large amounts of data.

Bun implements the Web APIs ReadableStream and WritableStream.

Bun also implements the node:stream module, including Readable, Writable, and Duplex. For complete documentation, refer to the Node.js docs.

To create a simple ReadableStream:

```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("hello");
    controller.enqueue("world");
    controller.close();
  },
});
```

The contents of a ReadableStream can be read chunk-by-chunk with for await syntax.

```typescript
for await (const chunk of stream) {
  console.log(chunk);
  // => "hello"
  // => "world"
}
```

## Direct ReadableStream

Bun implements an optimized version of ReadableStream that avoid unnecessary data copying & queue management logic. With a traditional ReadableStream, chunks of data are enqueued. Each chunk is copied into a queue, where it sits until the stream is ready to send more data.

```typescript
const stream = new ReadableStream({
  start(controller) {
    controller.enqueue("hello");
    controller.enqueue("world");
    controller.close();
  },
});
```

With a direct ReadableStream, chunks of data are written directly to the stream. No queueing happens, and there's no need to clone the chunk data into memory. The controller API is updated to reflect this; instead of .enqueue() you call .write.

```typescript
const stream = new ReadableStream({
  type: "direct",
  pull(controller) {
    controller.write("hello");
    controller.write("world");
  },
});
```

When using a direct ReadableStream, all chunk queueing is handled by the destination. The consumer of the stream receives exactly what is passed to controller.write(), without any encoding or modification.

## Bun.ArrayBufferSink

The Bun.ArrayBufferSink class is a fast incremental writer for constructing an ArrayBuffer of unknown size.

```typescript
const sink = new Bun.ArrayBufferSink();

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

sink.end();
// ArrayBuffer(5) [ 104, 101, 108, 108, 111 ]
```

To instead retrieve the data as a Uint8Array, pass the asUint8Array option to the constructor.

```typescript
const sink = new Bun.ArrayBufferSink({
  asUint8Array: true
});

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

sink.end();
// Uint8Array(5) [ 104, 101, 108, 108, 111 ]
```

The .write() method supports strings, typed arrays, ArrayBuffer, and SharedArrayBuffer.

```typescript
sink.write("h");
sink.write(new Uint8Array([101, 108]));
sink.write(Buffer.from("lo").buffer);

sink.end();
```

Once .end() is called, no more data can be written to the ArrayBufferSink. However, in the context of buffering a stream, it's useful to continuously write data and periodically .flush() the contents (say, into a WriteableStream). To support this, pass stream: true to the constructor.

```typescript
const sink = new Bun.ArrayBufferSink({
  stream: true,
});

sink.write("h");
sink.write("e");
sink.write("l");
sink.flush();
// ArrayBuffer(5) [ 104, 101, 108 ]

sink.write("l");
sink.write("o");
sink.flush();
// ArrayBuffer(5) [ 108, 111 ]
```

The .flush() method returns the buffered data as an ArrayBuffer (or Uint8Array if asUint8Array: true) and clears internal buffer.

To manually set the size of the internal buffer in bytes, pass a value for highWaterMark:

```typescript
const sink = new Bun.ArrayBufferSink({
  highWaterMark: 1024 * 1024, // 1 MB
});
```

Reference

```typescript
/**
 * Fast incremental writer that becomes an `ArrayBuffer` on end().
 */
export class ArrayBufferSink {
  constructor();

  start(options?: {
    asUint8Array?: boolean;
    /**
     * Preallocate an internal buffer of this size
     * This can significantly improve performance when the chunk size is small
     */
    highWaterMark?: number;
    /**
     * On {@link ArrayBufferSink.flush}, return the written data as a `Uint8Array`.
     * Writes will restart from the beginning of the buffer.
     */
    stream?: boolean;
  }): void;

  write(
    chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
  ): number;
  /**
   * Flush the internal buffer
   *
   * If {@link ArrayBufferSink.start} was passed a `stream` option, this will return a `ArrayBuffer`
   * If {@link ArrayBufferSink.start} was passed a `stream` option and `asUint8Array`, this will return a `Uint8Array`
   * Otherwise, this will return the number of bytes written since the last flush
   *
   * This API might change later to separate Uint8ArraySink and ArrayBufferSink
   */
  flush(): number | Uint8Array | ArrayBuffer;
  end(): ArrayBuffer | Uint8Array;
}
```

Previous

Binary data

Next

File I/O

Edit on GitHub



Page URL: https://bun.sh/docs/api/file-io

# File I/O

Edit on GitHub

Note — The Bun.file and Bun.write APIs documented on this page are heavily optimized and represent the recommended way to perform file-system tasks using Bun. For operations that are not yet available with Bun.file, such as mkdir, you can use Bun's nearly complete implementation of the node:fs module.

Bun provides a set of optimized APIs for reading and writing files.

## Reading files (Bun.file())

Bun.file(path): BunFile

Create a BunFile instance with the Bun.file(path) function. A BunFile represents a lazily-loaded file; initializing it does not actually read the file from disk.

```typescript
const foo = Bun.file("foo.txt"); // relative to cwd
foo.size; // number of bytes
foo.type; // MIME type
```

The reference conforms to the Blob interface, so the contents can be read in various formats.

```typescript
const foo = Bun.file("foo.txt");

await foo.text(); // contents as a string
await foo.stream(); // contents as ReadableStream
await foo.arrayBuffer(); // contents as ArrayBuffer
```

File references can also be created using numerical file descriptors or file:// URLs.

```typescript
Bun.file(1234);
Bun.file(new URL(import.meta.url)); // reference to the current file
```

A BunFile can point to a location on disk where a file does not exist.

```typescript
const notreal = Bun.file("notreal.txt");
notreal.size; // 0
notreal.type; // "text/plain;charset=utf-8"
```

The default MIME type is text/plain;charset=utf-8, but it can be overridden by passing a second argument to Bun.file.

```typescript
const notreal = Bun.file("notreal.json", { type: "application/json" });
notreal.type; // => "application/json;charset=utf-8"
```

For convenience, Bun exposes stdin, stdout and stderr as instances of BunFile.

```typescript
Bun.stdin; // readonly
Bun.stdout;
Bun.stderr;
```

## Writing files (Bun.write())

Bun.write(destination, data): ```Promise<number>```

The Bun.write function is a multi-tool for writing payloads of all kinds to disk.

The first argument is the destination which can have any of the following types:

The second argument is the data to be written. It can be any of the following:

All possible permutations are handled using the fastest available system calls on the current platform.

See syscalls

To write a string to disk:

```typescript
const data = `It was the best of times, it was the worst of times.`;
await Bun.write("output.txt", data);
```

To copy a file to another location on disk:

```typescript
const input = Bun.file("input.txt");
const output = Bun.file("output.txt"); // doesn't exist yet!
await Bun.write(output, input);
```

To write a byte array to disk:

```typescript
const encoder = new TextEncoder();
const data = encoder.encode("datadatadata"); // Uint8Array
await Bun.write("output.txt", data);
```

To write a file to stdout:

```typescript
const input = Bun.file("input.txt");
await Bun.write(Bun.stdout, input);
```

To write the body of an HTTP response to disk:

```typescript
const response = await fetch("https://bun.sh");
await Bun.write("index.html", response);
```

## Incremental writing with FileSink

Bun provides a native incremental file writing API called FileSink. To retrieve a FileSink instance from a BunFile:

```typescript
const file = Bun.file("output.txt");
const writer = file.writer();
```

To incrementally write to the file, call .write().

```typescript
const file = Bun.file("output.txt");
const writer = file.writer();

writer.write("it was the best of times\n");
writer.write("it was the worst of times\n");
```

These chunks will be buffered internally. To flush the buffer to disk, use .flush(). This returns the number of flushed bytes.

```typescript
writer.flush(); // write buffer to disk
```

The buffer will also auto-flush when the FileSink's high water mark is reached; that is, when its internal buffer is full. This value can be configured.

```typescript
const file = Bun.file("output.txt");
const writer = file.writer({ highWaterMark: 1024 * 1024 }); // 1MB
```

To flush the buffer and close the file:

```typescript
writer.end();
```

Note that, by default, the bun process will stay alive until this FileSink is explicitly closed with .end(). To opt out of this behavior, you can "unref" the instance.

```typescript
writer.unref();

// to "re-ref" it later
writer.ref();
```

## Benchmarks

The following is a 3-line implementation of the Linux cat command.

```typescript
// Usage
// $ bun ./cat.ts ./path-to-file

import { resolve } from "path";

const path = resolve(process.argv.at(-1));
await Bun.write(Bun.stdout, Bun.file(path));
```

To run the file:

```typescript
bun ./cat.ts ./path-to-file
```

It runs 2x faster than GNU cat for large files on Linux.

## Reference

```typescript
interface Bun {
  stdin: BunFile;
  stdout: BunFile;
  stderr: BunFile;

  file(path: string | number | URL, options?: { type?: string }): BunFile;

  write(
    destination: string | number | BunFile | URL,
    input:
      | string
      | Blob
      | ArrayBuffer
      | SharedArrayBuffer
      | TypedArray
      | Response,
  ): Promise<number>;
}

interface BunFile {
  readonly size: number;
  readonly type: string;

  text(): Promise<string>;
  stream(): Promise<ReadableStream>;
  arrayBuffer(): Promise<ArrayBuffer>;
  json(): Promise<any>;
  writer(params: { highWaterMark?: number }): FileSink;
}

export interface FileSink {
  write(
    chunk: string | ArrayBufferView | ArrayBuffer | SharedArrayBuffer,
  ): number;
  flush(): number | Promise<number>;
  end(error?: Error): number | Promise<number>;
  start(options?: { highWaterMark?: number }): void;
  ref(): void;
  unref(): void;
}
```

Previous

Streams

Next

import.meta

Edit on GitHub



Page URL: https://bun.sh/docs/api/import-meta

# import.meta

Edit on GitHub

The import.meta object is a way for a module to access information about itself. It's part of the JavaScript language, but its contents are not standardized. Each "host" (browser, runtime, etc) is free to implement any properties it wishes on the import.meta object.

Bun implements the following properties.

```typescript
import.meta.dir;   // => "/path/to/project"
import.meta.file;  // => "file.ts"
import.meta.path;  // => "/path/to/project/file.ts"

import.meta.main;  // `true` if this file is directly executed by `bun run`
                   // `false` otherwise

import.meta.resolveSync("zod")
// resolve an import specifier relative to the directory
```

import.meta.resolve{Sync}

Resolve a module specifier (e.g. "zod" or "./file.tsx) to an absolute path. While file would be imported if the specifier were imported from this file?

```typescript
import.meta.resolveSync("zod");
// => "/path/to/project/node_modules/zod/index.ts"

import.meta.resolveSync("./file.tsx");
// => "/path/to/project/file.tsx"
```

Previous

File I/O

Next

SQLite

Edit on GitHub



Page URL: https://bun.sh/docs/api/sqlite

# SQLite

Edit on GitHub

Bun natively implements a high-performance SQLite3 driver. To use it import from the built-in bun:sqlite module.

```typescript
import { Database } from "bun:sqlite";

const db = new Database(":memory:");
const query = db.query("select 'Hello world' as message;");
query.get(); // => { message: "Hello world" }
```

The API is simple, synchronous, and fast. Credit to better-sqlite3 and its contributors for inspiring the API of bun:sqlite.

Features include:

The bun:sqlite module is roughly 3-6x faster than better-sqlite3 and 8-9x faster than deno.land/x/sqlite for read queries. Each driver was benchmarked against the Northwind Traders dataset. View and run the benchmark source.

## Database

To open or create a SQLite3 database:

```typescript
import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite");
```

To open an in-memory database:

```typescript
import { Database } from "bun:sqlite";

// all of these do the same thing
const db = new Database(":memory:");
const db = new Database();
const db = new Database("");
```

To open in readonly mode:

```typescript
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite", { readonly: true });
```

To create the database if the file doesn't exist:

```typescript
import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite", { create: true });
```

### .close()

To close a database:

```typescript
const db = new Database();
db.close();
```

Note: close() is called automatically when the database is garbage collected. It is safe to call multiple times but has no effect after the first.

### .serialize()

bun:sqlite supports SQLite's built-in mechanism for serializing and deserializing databases to and from memory.

```typescript
const olddb = new Database("mydb.sqlite");
const contents = olddb.serialize(); // => Uint8Array
const newdb = Database.deserialize(contents);
```

Internally, .serialize() calls sqlite3_serialize.

### .query()

Use the db.query() method on your Database instance to prepare a SQL query. The result is a Statement instance that will be cached on the Database instance. The query will not be executed.

```typescript
const query = db.query(`select "Hello world" as message`);
```

Note — Use the .prepare() method to prepare a query without caching it on the Database instance.

```typescript
// compile the prepared statement
const query = db.prepare("SELECT * FROM foo WHERE bar = ?");
```

## Statements

A Statement is a prepared query, which means it's been parsed and compiled into an efficient binary form. It can be executed multiple times in a performant way.

Create a statement with the .query method on your Database instance.

```typescript
const query = db.query(`select "Hello world" as message`);
```

Queries can contain parameters. These can be numerical (?1) or named ($param or :param or @param).

```typescript
const query = db.query(`SELECT ?1, ?2;`);
const query = db.query(`SELECT $param1, $param2;`);
```

Values are bound to these parameters when the query is executed. A Statement can be executed with several different methods, each returning the results in a different form.

### .all()

Use .all() to run a query and get back the results as an array of objects.

```typescript
const query = db.query(`select $message;`);
query.all({ $message: "Hello world" });
// => [{ message: "Hello world" }]
```

Internally, this calls sqlite3_reset and repeatedly calls sqlite3_step until it returns SQLITE_DONE.

### .get()

Use .get() to run a query and get back the first result as an object.

```typescript
const query = db.query(`select $message;`);
query.get({ $message: "Hello world" });
// => { $message: "Hello world" }
```

Internally, this calls sqlite3_reset followed by sqlite3_step until it no longer returns SQLITE_ROW. If the query returns no rows, undefined is returned.

### .run()

Use .run() to run a query and get back undefined. This is useful for queries schema-modifying queries (e.g. CREATE TABLE) or bulk write operations.

```typescript
const query = db.query(`create table foo;`);
query.run();
// => undefined
```

Internally, this calls sqlite3_reset and calls sqlite3_step once. Stepping through all the rows is not necessary when you don't care about the results.

### .values()

Use values() to run a query and get back all results as an array of arrays.

```typescript
const query = db.query(`select $message;`);
query.values({ $message: "Hello world" });

query.values(2);
// [
//   [ "Iron Man", 2008 ],
//   [ "The Avengers", 2012 ],
//   [ "Ant-Man: Quantumania", 2023 ],
// ]
```

Internally, this calls sqlite3_reset and repeatedly calls sqlite3_step until it returns SQLITE_DONE.

### .finalize()

Use .finalize() to destroy a Statement and free any resources associated with it. Once finalized, a Statement cannot be executed again. Typically, the garbage collector will do this for you, but explicit finalization may be useful in performance-sensitive applications.

```typescript
const query = db.query("SELECT title, year FROM movies");
const movies = query.all();
query.finalize();
```

### .toString()

Calling toString() on a Statement instance prints the expanded SQL query. This is useful for debugging.

```typescript
import { Database } from "bun:sqlite";

// setup
const query = db.query("SELECT $param;");

console.log(query.toString()); // => "SELECT NULL"

query.run(42);
console.log(query.toString()); // => "SELECT 42"

query.run(365);
console.log(query.toString()); // => "SELECT 365"
```

Internally, this calls sqlite3_expanded_sql. The parameters are expanded using the most recently bound values.

## Parameters

Queries can contain parameters. These can be numerical (?1) or named ($param or :param or @param). Bind values to these parameters when executing the query:

```typescript
const query = db.query("SELECT * FROM foo WHERE bar = $bar");
const results = query.all({
  $bar: "bar",
});
```

```typescript
[
  { "$bar": "bar" }
]
```

Numbered (positional) parameters work too:

```typescript
const query = db.query("SELECT ?1, ?2");
const results = query.all("hello", "goodbye");
```

```typescript
[
  {
    "?1": "hello",
    "?2": "goodbye"
  }
]
```

## Transactions

Transactions are a mechanism for executing multiple queries in an atomic way; that is, either all of the queries succeed or none of them do. Create a transaction with the db.transaction() method:

```typescript
const insertCat = db.prepare("INSERT INTO cats (name) VALUES ($name)");
const insertCats = db.transaction(cats => {
  for (const cat of cats) insertCat.run(cat);
});
```

At this stage, we haven't inserted any cats! The call to db.transaction() returns a new function (insertCats) that wraps the function that executes the queries.

To execute the transaction, call this function. All arguments will be passed through to the wrapped function; the return value of the wrapped function will be returned by the transaction function. The wrapped function also has access to the this context as defined where the transaction is executed.

```typescript
const insert = db.prepare("INSERT INTO cats (name) VALUES ($name)");
const insertCats = db.transaction(cats => {
  for (const cat of cats) insert.run(cat);
  return cats.length;
});

const count = insertCats([
  { $name: "Keanu" },
  { $name: "Salem" },
  { $name: "Crookshanks" },
]);

console.log(`Inserted ${count} cats`);
```

The driver will automatically begin a transaction when insertCats is called and commit it when the wrapped function returns. If an exception is thrown, the transaction will be rolled back. The exception will propagate as usual; it is not caught.

Nested transactions — Transaction functions can be called from inside other transaction functions. When doing so, the inner transaction becomes a savepoint.

View nested transaction example

```typescript
// setup
import { Database } from "bun:sqlite";
const db = Database.open(":memory:");
db.run(
  "CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT, dollars INTEGER);",
);
db.run(
  "CREATE TABLE cats (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, age INTEGER)",
);
const insertExpense = db.prepare(
  "INSERT INTO expenses (note, dollars) VALUES (?, ?)",
);
const insert = db.prepare("INSERT INTO cats (name, age) VALUES ($name, $age)");
const insertCats = db.transaction(cats => {
  for (const cat of cats) insert.run(cat);
});

const adopt = db.transaction(cats => {
  insertExpense.run("adoption fees", 20);
  insertCats(cats); // nested transaction
});

adopt([
  { $name: "Joey", $age: 2 },
  { $name: "Sally", $age: 4 },
  { $name: "Junior", $age: 1 },
]);
```

Transactions also come with deferred, immediate, and exclusive versions.

```typescript
insertCats(cats); // uses "BEGIN"
insertCats.deferred(cats); // uses "BEGIN DEFERRED"
insertCats.immediate(cats); // uses "BEGIN IMMEDIATE"
insertCats.exclusive(cats); // uses "BEGIN EXCLUSIVE"
```

### .loadExtension()

To load a SQLite extension, call .loadExtension(name) on your Database instance

```typescript
import { Database } from "bun:sqlite";

const db = new Database();
db.loadExtension("myext");
```

For macOS users

MacOS users By default, macOS ships with Apple's proprietary build of SQLite, which doesn't support extensions. To use extensions, you'll need to install a vanilla build of SQLite.

```typescript
brew install sqlite
```

To point bun:sqlite to the new build, call Database.setCustomSQLite(path) before creating any Database instances. (On other operating systems, this is a no-op.) Pass a path to the SQLite .dylib file, not the executable. With recent versions of Homebrew this is something like /opt/homebrew/Cellar/sqlite/<version>/libsqlite3.dylib.

```typescript
import { Database } from "bun:sqlite";

Database.setCustomSQLite("/path/to/libsqlite.dylib");

const db = new Database();
db.loadExtension("myext");
```

## Reference

```typescript
class Database {
  constructor(
    filename: string,
    options?:
      | number
      | {
          readonly?: boolean;
          create?: boolean;
          readwrite?: boolean;
        },
  );

  query<Params, ReturnType>(sql: string): Statement<Params, ReturnType>;
}

class Statement<Params, ReturnType> {
  all(params: Params): ReturnType[];
  get(params: Params): ReturnType | undefined;
  run(params: Params): void;
  values(params: Params): unknown[][];

  finalize(): void; // destroy statement and clean up resources
  toString(): string; // serialize to SQL

  columnNames: string[]; // the column names of the result set
  paramsCount: number; // the number of parameters expected by the statement
  native: any; // the native object representing the statement
}

type SQLQueryBindings =
  | string
  | bigint
  | TypedArray
  | number
  | boolean
  | null
  | Record<string, string | bigint | TypedArray | number | boolean | null>;
```

### Datatypes

Previous

import.meta

Next

FileSystemRouter

Edit on GitHub



Page URL: https://bun.sh/docs/api/file-system-router

# FileSystemRouter

Edit on GitHub

Bun provides a fast API for resolving routes against file-system paths. This API is primarily intended for library authors. At the moment only Next.js-style file-system routing is supported, but other styles may be added in the future.

## Next.js-style

The FileSystemRouter class can resolve routes against a pages directory. (The Next.js 13 app directory is not yet supported.) Consider the following pages directory:

```typescript
pages
├── index.tsx
├── settings.tsx
├── blog
│   ├── [slug].tsx
│   └── index.tsx
└── [[...catchall]].tsx
```

The FileSystemRouter can be used to resolve routes against this directory:

```typescript
const router = new Bun.FileSystemRouter({
  style: "nextjs",
  dir: "./pages",
  origin: "https://mydomain.com",
  assetPrefix: "_next/static/"
});
router.match("/");

// =>
{
  filePath: "/path/to/pages/index.tsx",
  kind: "exact",
  name: "/",
  pathname: "/",
  src: "https://mydomain.com/_next/static/pages/index.tsx"
}
```

Query parameters will be parsed and returned in the query property.

```typescript
router.match("/settings?foo=bar");

// =>
{
  filePath: "/Users/colinmcd94/Documents/bun/fun/pages/settings.tsx",
  kind: "dynamic",
  name: "/settings",
  pathname: "/settings?foo=bar",
  src: "https://mydomain.com/_next/static/pages/settings.tsx"
  query: {
    foo: "bar"
  }
}
```

The router will automatically parse URL parameters and return them in the params property:

```typescript
router.match("/blog/my-cool-post");

// =>
{
  filePath: "/Users/colinmcd94/Documents/bun/fun/pages/blog/[slug].tsx",
  kind: "dynamic",
  name: "/blog/[slug]",
  pathname: "/blog/my-cool-post",
  src: "https://mydomain.com/_next/static/pages/blog/[slug].tsx"
  params: {
    slug: "my-cool-post"
  }
}
```

The .match() method also accepts Request and Response objects. The url property will be used to resolve the route.

```typescript
router.match(new Request("https://example.com/blog/my-cool-post"));
```

The router will read the directory contents on initialization. To re-scan the files, use the .reload() method.

```typescript
router.reload();
```

## Reference

```typescript
interface Bun {
  class FileSystemRouter {
    constructor(params: {
      dir: string;
      style: "nextjs";
      origin?: string;
      assetPrefix?: string;
    });

    reload(): void;

    match(path: string | Request | Response): {
      filePath: string;
      kind: "exact" | "catch-all" | "optional-catch-all" | "dynamic";
      name: string;
      pathname: string;
      src: string;
      params?: Record<string, string>;
      query?: Record<string, string>;
    } | null
  }
}
```

Previous

SQLite

Next

TCP sockets

Edit on GitHub



Page URL: https://bun.sh/docs/api/tcp

# TCP sockets

Edit on GitHub

Use Bun's native TCP API to implement performance sensitive systems like database clients, game servers, or anything that needs to communicate over TCP (instead of HTTP). This is a low-level API intended for library authors and for advanced use cases.

## Start a server (Bun.listen())

To start a TCP server with Bun.listen:

```typescript
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {}, // message received from client
    open(socket) {}, // socket opened
    close(socket) {}, // socket closed
    drain(socket) {}, // socket ready for more data
    error(socket, error) {}, // error handler
  },
});
```

An API designed for speed

In Bun, a set of handlers are declared once per server instead of assigning callbacks to each socket, as with Node.js EventEmitters or the web-standard WebSocket API.

```typescript
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    open(socket) {},
    data(socket, data) {},
    drain(socket) {},
    close(socket) {},
    error(socket, error) {},
  },
});
```

For performance-sensitive servers, assigning listeners to each socket can cause significant garbage collector pressure and increase memory usage. By contrast, Bun only allocates one handler function for each event and shares it among all sockets. This is a small optimization, but it adds up.

Contextual data can be attached to a socket in the open handler.

```typescript
type SocketData = { sessionId: string };

Bun.listen<SocketData>({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {
      socket.write(`${socket.data.sessionId}: ack`);
    },
    open(socket) {
      socket.data = { sessionId: "abcd" };
    },
  },
});
```

To enable TLS, pass a tls object containing key and cert fields.

```typescript
Bun.listen({
  hostname: "localhost",
  port: 8080,
  socket: {
    data(socket, data) {},
  },
  tls: {
    // can be string, BunFile, TypedArray, Buffer, or array thereof
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
  },
});
```

The key and cert fields expect the contents of your TLS key and certificate. This can be a string, BunFile, TypedArray, or Buffer.

```typescript
Bun.listen({
  // ...
  tls: {
    // BunFile
    key: Bun.file("./key.pem"),
    // Buffer
    key: fs.readFileSync("./key.pem"),
    // string
    key: fs.readFileSync("./key.pem", "utf8"),
    // array of above
    key: [Bun.file("./key1.pem"), Bun.file("./key2.pem")],
  },
});
```

The result of Bun.listen is a server that conforms to the TCPSocket interface.

```typescript
const server = Bun.listen({
  /* config*/
});

// stop listening
// parameter determines whether active connections are closed
server.stop(true);

// let Bun process exit even if server is still listening
server.unref();
```

## Create a connection (Bun.connect())

Use Bun.connect to connect to a TCP server. Specify the server to connect to with hostname and port. TCP clients can define the same set of handlers as Bun.listen, plus a couple client-specific handlers.

```typescript
// The client
const socket = Bun.connect({
  hostname: "localhost",
  port: 8080,

  socket: {
    data(socket, data) {},
    open(socket) {},
    close(socket) {},
    drain(socket) {},
    error(socket, error) {},

    // client-specific handlers
    connectError(socket, error) {}, // connection failed
    end(socket) {}, // connection closed by server
    timeout(socket) {}, // connection timed out
  },
});
```

To require TLS, specify tls: true.

```typescript
// The client
const socket = Bun.connect({
  // ... config
  tls: true,
});
```

## Hot reloading

Both TCP servers and sockets can be hot reloaded with new handlers.

```typescript
const server = Bun.listen({ /* config */ })

// reloads handlers for all active server-side sockets
server.reload({
  socket: {
    data(){
      // new 'data' handler
    }
  }
})
```

```typescript
const socket = Bun.connect({ /* config */ })
socket.reload({
  data(){
    // new 'data' handler
  }
})
```

## Buffering

Currently, TCP sockets in Bun do not buffer data. For performance-sensitive code, it's important to consider buffering carefully. For example, this:

```typescript
socket.write("h");
socket.write("e");
socket.write("l");
socket.write("l");
socket.write("o");
```

...performs significantly worse than this:

```typescript
socket.write("hello");
```

To simplify this for now, consider using Bun's ArrayBufferSink with the {stream: true} option:

```typescript
const sink = new ArrayBufferSink({ stream: true, highWaterMark: 1024 });

sink.write("h");
sink.write("e");
sink.write("l");
sink.write("l");
sink.write("o");

queueMicrotask(() => {
  var data = sink.flush();
  if (!socket.write(data)) {
    // put it back in the sink if the socket is full
    sink.write(data);
  }
});
```

Corking — Support for corking is planned, but in the meantime backpressure must be managed manually with the drain handler.

Previous

FileSystemRouter

Next

Globals

Edit on GitHub



Page URL: https://bun.sh/docs/api/globals

# Globals

Edit on GitHub

Bun implements the following globals.

Previous

TCP sockets

Next

Child processes

Edit on GitHub



Page URL: https://bun.sh/docs/api/spawn

# Child processes

Edit on GitHub

Spawn child processes with Bun.spawn or Bun.spawnSync.

## Spawn a process (Bun.spawn())

Provide a command as an array of strings. The result of Bun.spawn() is a Bun.Subprocess object.

```typescript
Bun.spawn(["echo", "hello"]);
```

The second argument to Bun.spawn is a parameters object that can be used to configure the subprocess.

```typescript
const proc = Bun.spawn(["echo", "hello"], {
  cwd: "./path/to/subdir", // specify a working directory
  env: { ...process.env, FOO: "bar" }, // specify environment variables
  onExit(proc, exitCode, signalCode, error) {
    // exit handler
  },
});

proc.pid; // process ID of subprocess
```

## Input stream

By default, the input stream of the subprocess is undefined; it can be configured with the stdin parameter.

```typescript
const proc = Bun.spawn(["cat"], {
  stdin: await fetch(
    "https://raw.githubusercontent.com/oven-sh/bun/main/examples/hashing.js",
  ),
});

const text = await new Response(proc.stdout).text();
console.log(text); // "const input = "hello world".repeat(400); ..."
```

The "pipe" option lets incrementally write to the subprocess's input stream from the parent process.

```typescript
const proc = Bun.spawn(["cat"], {
  stdin: "pipe", // return a FileSink for writing
});

// enqueue string data
proc.stdin.write("hello");

// enqueue binary data
const enc = new TextEncoder();
proc.stdin.write(enc.encode(" world!"));

// send buffered data
proc.stdin.flush();

// close the input stream
proc.stdin.end();
```

## Output streams

You can read results from the subprocess via the stdout and stderr properties. By default these are instances of ReadableStream.

```typescript
const proc = Bun.spawn(["echo", "hello"]);
const text = await new Response(proc.stdout).text();
console.log(text); // => "hello"
```

Configure the output stream by passing one of the following values to stdout/stderr:

## Exit handling

Use the onExit callback to listen for the process exiting or being killed.

```typescript
const proc = Bun.spawn(["echo", "hello"], {
  onExit(proc, exitCode, signalCode, error) {
    // exit handler
  },
});
```

For convenience, the exited property is a Promise that resolves when the process exits.

```typescript
const proc = Bun.spawn(["echo", "hello"]);

await proc.exited; // resolves when process exit
proc.killed; // boolean — was the process killed?
proc.exitCode; // null | number
proc.signalCode; // null | "SIGABRT" | "SIGALRM" | ...
```

To kill a process:

```typescript
const proc = Bun.spawn(["echo", "hello"]);
proc.kill();
proc.killed; // true

proc.kill(); // specify an exit code
```

The parent bun process will not terminate until all child processes have exited. Use proc.unref() to detach the child process from the parent.

```typescript
const proc = Bun.spawn(["echo", "hello"]);
proc.unref();
```

## Blocking API (Bun.spawnSync())

Bun provides a synchronous equivalent of Bun.spawn called Bun.spawnSync. This is a blocking API that supports the same inputs and parameters as Bun.spawn. It returns a SyncSubprocess object, which differs from Subprocess in a few ways.

```typescript
const proc = Bun.spawnSync(["echo", "hello"]);

console.log(proc.stdout.toString());
// => "hello\n"
```

As a rule of thumb, the asynchronous Bun.spawn API is better for HTTP servers and apps, and Bun.spawnSync is better for building command-line tools.

## Benchmarks

⚡️ Under the hood, Bun.spawn and Bun.spawnSync use posix_spawn(3).

Bun's spawnSync spawns processes 60% faster than the Node.js child_process module.

```typescript
bun spawn.mjs
```

## Reference

A simple reference of the Spawn API and types are shown below. The real types have complex generics to strongly type the Subprocess streams with the options passed to Bun.spawn and Bun.spawnSync. For full details, find these types as defined bun.d.ts.

```typescript
interface Bun {
  spawn(command: string[], options?: SpawnOptions.OptionsObject): Subprocess;
  spawnSync(
    command: string[],
    options?: SpawnOptions.OptionsObject,
  ): SyncSubprocess;

  spawn(options: { cmd: string[] } & SpawnOptions.OptionsObject): Subprocess;
  spawnSync(
    options: { cmd: string[] } & SpawnOptions.OptionsObject,
  ): SyncSubprocess;
}

namespace SpawnOptions {
  interface OptionsObject {
    cwd?: string;
    env?: Record<string, string>;
    stdin?: SpawnOptions.Readable;
    stdout?: SpawnOptions.Writable;
    stderr?: SpawnOptions.Writable;
    onExit?: (
      proc: Subprocess,
      exitCode: number | null,
      signalCode: string | null,
      error: Error | null,
    ) => void;
  }

  type Readable =
    | "pipe"
    | "inherit"
    | "ignore"
    | null // equivalent to "ignore"
    | undefined // to use default
    | BunFile
    | ArrayBufferView
    | number;

  type Writable =
    | "pipe"
    | "inherit"
    | "ignore"
    | null // equivalent to "ignore"
    | undefined // to use default
    | BunFile
    | ArrayBufferView
    | number
    | ReadableStream
    | Blob
    | Response
    | Request;
}

interface Subprocess<Stdin, Stdout, Stderr> {
  readonly pid: number;
  // the exact stream types here are derived from the generic parameters
  readonly stdin: number | ReadableStream | FileSink | undefined;
  readonly stdout: number | ReadableStream | undefined;
  readonly stderr: number | ReadableStream | undefined;

  readonly exited: Promise<number>;

  readonly exitCode: number | undefined;
  readonly signalCode: Signal | null;
  readonly killed: boolean;

  ref(): void;
  unref(): void;
  kill(code?: number): void;
}

interface SyncSubprocess<Stdout, Stderr> {
  readonly pid: number;
  readonly success: boolean;
  // the exact buffer types here are derived from the generic parameters
  readonly stdout: Buffer | undefined;
  readonly stderr: Buffer | undefined;
}

type ReadableSubprocess = Subprocess<any, "pipe", "pipe">;
type WritableSubprocess = Subprocess<"pipe", any, any>;
type PipedSubprocess = Subprocess<"pipe", "pipe", "pipe">;
type NullSubprocess = Subprocess<null, null, null>;

type ReadableSyncSubprocess = SyncSubprocess<"pipe", "pipe">;
type NullSyncSubprocess = SyncSubprocess<null, null>;

type Signal =
  | "SIGABRT"
  | "SIGALRM"
  | "SIGBUS"
  | "SIGCHLD"
  | "SIGCONT"
  | "SIGFPE"
  | "SIGHUP"
  | "SIGILL"
  | "SIGINT"
  | "SIGIO"
  | "SIGIOT"
  | "SIGKILL"
  | "SIGPIPE"
  | "SIGPOLL"
  | "SIGPROF"
  | "SIGPWR"
  | "SIGQUIT"
  | "SIGSEGV"
  | "SIGSTKFLT"
  | "SIGSTOP"
  | "SIGSYS"
  | "SIGTERM"
  | "SIGTRAP"
  | "SIGTSTP"
  | "SIGTTIN"
  | "SIGTTOU"
  | "SIGUNUSED"
  | "SIGURG"
  | "SIGUSR1"
  | "SIGUSR2"
  | "SIGVTALRM"
  | "SIGWINCH"
  | "SIGXCPU"
  | "SIGXFSZ"
  | "SIGBREAK"
  | "SIGLOST"
  | "SIGINFO";
```

Previous

Globals

Next

Transpiler

Edit on GitHub



Page URL: https://bun.sh/docs/api/transpiler

# Transpiler

Edit on GitHub

Bun exposes its internal transpiler via the Bun.Transpiler class. To create an instance of Bun's transpiler:

```typescript
const transpiler = new Bun.Transpiler({
  loader: "tsx", // "js | "jsx" | "ts" | "tsx"
});
```

## .transformSync()

Transpile code synchronously with the .transformSync() method. Modules are not resolved and the code is not executed. The result is a string of vanilla JavaScript code.

```typescript
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import * as whatever from "./whatever.ts"
export function Home(props: {title: string}){
  return <p>{props.title}</p>;
}`;

const result = transpiler.transformSync(code);
```

```typescript
import { __require as require } from "bun:wrap";
import * as JSX from "react/jsx-dev-runtime";
var jsx = require(JSX).jsxDEV;

export default jsx(
  "div",
  {
    children: "hi!",
  },
  undefined,
  false,
  undefined,
  this,
);
```

To override the default loader specified in the new Bun.Transpiler() constructor, pass a second argument to .transformSync().

```typescript
await transpiler.transform("<div>hi!</div>", "tsx");
```

Nitty gritty

When .transformSync is called, the transpiler is run in the same thread as the currently executed code.

If a macro is used, it will be run in the same thread as the transpiler, but in a separate event loop from the rest of your application. Currently, globals between macros and regular code are shared, which means it is possible (but not recommended) to share states between macros and regular code. Attempting to use AST nodes outside of a macro is undefined behavior.

## .transform()

The transform() method is an async version of .transformSync() that returns a ```Promise<string>```.

```typescript
const transpiler = new Bun.Transpiler({ loader: "jsx" });
const result = await transpiler.transform("<div>hi!</div>");
console.log(result);
```

Unless you're transpiling many large files, you should probably use Bun.Transpiler.transformSync. The cost of the threadpool will often take longer than actually transpiling code.

```typescript
await transpiler.transform("<div>hi!</div>", "tsx");
```

Nitty gritty

The .tranform() method runs the transpiler in Bun's worker threadpool, so if you run it 100 times, it will run it across Math.floor($cpu_count * 0.8) threads, without blocking the main JavaScript thread.

If your code uses a macro, it will potentially spawn a new copy of Bun's JavaScript runtime environment in that new thread.

## .scan()

The Transpiler instance can also scan some source code and return a list of its imports and exports, plus additional metadata about each one. Type-only imports and exports are ignored.

```typescript
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import React from 'react';
import type {ReactNode} from 'react';
const val = require('./cjs.js')
import('./loader');

export const name = "hello";
`;

const result = transpiler.scan(code);
```

```typescript
{
  "exports": [
    "name"
  ],
  "imports": [
    {
      "kind": "import-statement",
      "path": "react"
    },
    {
      "kind": "import-statement",
      "path": "remix"
    },
    {
      "kind": "dynamic-import",
      "path": "./loader"
    }
  ]
}
```

Each import in the imports array has a path and kind. Bun categories imports into the following kinds:

## .scanImports()

For performance-sensitive code, you can use the .scanImports() method to get a list of imports. It's faster than .scan() (especially for large files) but marginally less accurate due to some performance optimizations.

```typescript
const transpiler = new Bun.Transpiler({
  loader: 'tsx',
});

const code = `
import React from 'react';
import type {ReactNode} from 'react';
const val = require('./cjs.js')
import('./loader');

export const name = "hello";
`;

const result = transpiler.scanImports(code);
```

```typescript
[
  {
    kind: "import-statement",
    path: "react"
  }, {
    kind: "require-call",
    path: "./cjs.js"
  }, {
    kind: "dynamic-import",
    path: "./loader"
  }
]
```

## Reference

```typescript
type Loader = "jsx" | "js" | "ts" | "tsx";

interface TranspilerOptions {
  // Replace key with value. Value must be a JSON string.
  // { "process.env.NODE_ENV": "\"production\"" }
  define?: Record<string, string>,

  // Default loader for this transpiler
  loader?: Loader,

  // Default platform to target
  // This affects how import and/or require is used
  target?: "browser" | "bun" | "node",

  // Specify a tsconfig.json file as stringified JSON or an object
  // Use this to set a custom JSX factory, fragment, or import source
  // For example, if you want to use Preact instead of React. Or if you want to use Emotion.
  tsconfig?: string | TSConfig,

  // Replace imports with macros
  macro?: MacroMap,

  // Specify a set of exports to eliminate
  // Or rename certain exports
  exports?: {
      eliminate?: string[];
      replace?: Record<string, string>;
  },

  // Whether to remove unused imports from transpiled file
  // Default: false
  trimUnusedImports?: boolean,

  // Whether to enable a set of JSX optimizations
  // jsxOptimizationInline ...,

  // Experimental whitespace minification
  minifyWhitespace?: boolean,

  // Whether to inline constant values
  // Typically improves performance and decreases bundle size
  // Default: true
  inline?: boolean,
}

// Map import paths to macros
interface MacroMap {
  // {
  //   "react-relay": {
  //     "graphql": "bun-macro-relay/bun-macro-relay.tsx"
  //   }
  // }
  [packagePath: string]: {
    [importItemName: string]: string,
  },
}

class Bun.Transpiler {
  constructor(options: TranspilerOptions)

  transform(code: string, loader?: Loader): Promise<string>
  transformSync(code: string, loader?: Loader): string

  scan(code: string): {exports: string[], imports: Import}
  scanImports(code: string): Import[]
}

type Import = {
  path: string,
  kind:
  // import foo from 'bar'; in JavaScript
  | "import-statement"
  // require("foo") in JavaScript
  | "require-call"
  // require.resolve("foo") in JavaScript
  | "require-resolve"
  // Dynamic import() in JavaScript
  | "dynamic-import"
  // @import() in CSS
  | "import-rule"
  // url() in CSS
  | "url-token"
  // The import was injected by Bun
  | "internal" 
  // Entry point (not common)
  | "entry-point"
}

const transpiler = new Bun.Transpiler({ loader: "jsx" });
```

Previous

Child processes

Next

Hashing

Edit on GitHub



Page URL: https://bun.sh/docs/api/hashing

# Hashing

Edit on GitHub

Bun implements the createHash and createHmac functions from node:crypto in addition to the Bun-native APIs documented below.

## Bun.password

Bun.password is a collection of utility functions for hashing and verifying passwords with various cryptographically secure algorithms.

```typescript
const password = "super-secure-pa$$word";

const hash = await Bun.password.hash(password);
// => $argon2id$v=19$m=65536,t=2,p=1$tFq+9AVr1bfPxQdh6E8DQRhEXg/M/SqYCNu6gVdRRNs$GzJ8PuBi+K+BVojzPfS5mjnC8OpLGtv8KJqF99eP6a4

const isMatch = await Bun.password.verify(password, hash);
// => true
```

The second argument to Bun.password.hash accepts a params object that lets you pick and configure the hashing algorithm.

```typescript
const password = "super-secure-pa$$word";

// use argon2 (default)
const argonHash = await Bun.password.hash(password, {
  algorithm: "argon2id", // "argon2id" | "argon2i" | "argon2d"
  memoryCost: 4, // memory usage in kibibytes
  timeCost: 3, // the number of iterations
});

// use bcrypt
const bcryptHash = await Bun.password.hash(password, {
  algorithm: "bcrypt",
  cost: 4, // number between 4-31
});
```

The algorithm used to create the hash is stored in the hash itself. When using bcrypt, the returned hash is encoded in Modular Crypt Format for compatibility with most existing bcrypt implementations; with argon2 the result is encoded in the newer PHC format.

The verify function automatically detects the algorithm based on the input hash and use the correct verification method. It can correctly infer the algorithm from both PHC- or MCF-encoded hashes.

```typescript
const password = "super-secure-pa$$word";

const hash = await Bun.password.hash(password, {
  /* config */
});

const isMatch = await Bun.password.verify(password, hash);
// => true
```

Synchronous versions of all functions are also available. Keep in mind that these functions are computationally expensive, so using a blocking API may degrade application performance.

```typescript
const password = "super-secure-pa$$word";

const hash = Bun.password.hashSync(password, {
  /* config */
});

const isMatch = Bun.password.verifySync(password, hash);
// => true
```

## Bun.hash

Bun.hash is a collection of utilities for non-cryptographic hashing. Non-cryptographic hashing algorithms are optimized for speed of computation over collision-resistance or security.

The standard Bun.hash functions uses Wyhash to generate a 64-bit hash from an input of arbitrary size.

```typescript
Bun.hash("some data here");
// 11562320457524636935n
```

The input can be a string, TypedArray, DataView, ArrayBuffer, or SharedArrayBuffer.

```typescript
const arr = new Uint8Array([1, 2, 3, 4]);

Bun.hash("some data here");
Bun.hash(arr);
Bun.hash(arr.buffer);
Bun.hash(new DataView(arr.buffer));
```

Optionally, an integer seed can be specified as the second parameter. For 64-bit hashes seeds above Number.MAX_SAFE_INTEGER should be given as BigInt to avoid loss of precision.

```typescript
Bun.hash("some data here", 1234);
// 15724820720172937558n
```

Additional hashing algorithms are available as properties on Bun.hash. The API is the same for each, only changing the return type from number for 32-bit hashes to bigint for 64-bit hashes.

```typescript
Bun.hash.wyhash("data", 1234); // equivalent to Bun.hash()
Bun.hash.crc32("data", 1234);
Bun.hash.adler32("data", 1234);
Bun.hash.cityHash32("data", 1234);
Bun.hash.cityHash64("data", 1234);
Bun.hash.murmur32v3("data", 1234);
Bun.hash.murmur32v2("data", 1234);
Bun.hash.murmur64v2("data", 1234);
```

## Bun.CryptoHasher

Bun.CryptoHasher is a general-purpose utility class that lets you incrementally compute a hash of string or binary data using a range of cryptographic hash algorithms. The following algorithms are supported:

```typescript
const hasher = new Bun.CryptoHasher("sha256");
hasher.update("hello world");
hasher.digest();
// Uint8Array(32) [ <byte>, <byte>, ... ]
```

Once initialized, data can be incrementally fed to to the hasher using .update(). This method accepts string, TypedArray, and ArrayBuffer.

```typescript
const hasher = new Bun.CryptoHasher("sha256");

hasher.update("hello world");
hasher.update(new Uint8Array([1, 2, 3]));
hasher.update(new ArrayBuffer(10));
```

If a string is passed, an optional second parameter can be used to specify the encoding (default 'utf-8'). The following encodings are supported:

```typescript
hasher.update("hello world"); // defaults to utf8
hasher.update("hello world", "hex");
hasher.update("hello world", "base64");
hasher.update("hello world", "latin1");
```

After the data has been feed into the hasher, a final hash can be computed using .digest(). By default, this method returns a Uint8Array containing the hash.

```typescript
const hasher = new Bun.CryptoHasher("sha256");
hasher.update("hello world");

hasher.digest();
// => Uint8Array(32) [ 185, 77, 39, 185, 147, ... ]
```

The .digest() method can optionally return the hash as a string. To do so, specify an encoding:

```typescript
hasher.digest("base64");
// => "uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek="

hasher.digest("hex");
// => "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
```

Alternatively, the method can write the hash into a pre-existing TypedArray instance. This may be desirable in some performance-sensitive applications.

```typescript
const arr = new Uint8Array(32);

hasher.digest(arr);

console.log(arr);
// => Uint8Array(32) [ 185, 77, 39, 185, 147, ... ]
```

Previous

Transpiler

Next

Console

Edit on GitHub



Page URL: https://bun.sh/docs/api/console

# Console

Edit on GitHub

Note — Bun provides a browser- and Node.js-compatible console global. This page only documents Bun-native APIs.

In Bun, the console object can be used as an AsyncIterable to sequentially read lines from process.stdin.

```typescript
for await (const line of console) {
  console.log(line);
}
```

This is useful for implementing interactive programs, like the following addition calculator.

```typescript
console.log(`Let's add some numbers!`);
console.write(`Count: 0\n> `);

let count = 0;
for await (const line of console) {
  count += Number(line);
  console.write(`Count: ${count}\n> `);
}
```

To run the file:

```typescript
bun adder.ts
```

Previous

Hashing

Next

FFI

Edit on GitHub



Page URL: https://bun.sh/docs/api/ffi

# FFI

Edit on GitHub

Use the built-in bun:ffi module to efficiently call native libraries from JavaScript. It works with languages that support the C ABI (Zig, Rust, C/C++, C#, Nim, Kotlin, etc).

## Usage (bun:ffi)

To print the version number of sqlite3:

```typescript
import { dlopen, FFIType, suffix } from "bun:ffi";

// `suffix` is either "dylib", "so", or "dll" depending on the platform
// you don't have to use "suffix", it's just there for convenience
const path = `libsqlite3.${suffix}`;

const {
  symbols: {
    sqlite3_libversion, // the function to call
  },
} = dlopen(
  path, // a library name or file path
  {
    sqlite3_libversion: {
      // no arguments, returns a string
      args: [],
      returns: FFIType.cstring,
    },
  },
);

console.log(`SQLite 3 version: ${sqlite3_libversion()}`);
```

## Performance

According to our benchmark, bun:ffi is roughly 2-6x faster than Node.js FFI via Node-API.

Bun generates & just-in-time compiles C bindings that efficiently convert values between JavaScript types and native types. To compile C, Bun embeds TinyCC, a small and fast C compiler.

## Usage

### Zig

```typescript
// add.zig
pub export fn add(a: i32, b: i32) i32 {
  return a + b;
}
```

To compile:

```typescript
zig build-lib add.zig -dynamic -OReleaseFast
```

Pass a path to the shared library and a map of symbols to import into dlopen:

```typescript
import { dlopen, FFIType, suffix } from "bun:ffi";

const path = `libadd.${suffix}`;

const lib = dlopen(path, {
  add: {
    args: [FFIType.i32, FFIType.i32],
    returns: FFIType.i32,
  },
});

lib.symbols.add(1, 2);
```

### Rust

```typescript
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

To compile:

```typescript
rustc --crate-type cdylib add.rs
```

## FFI types

The following FFIType values are supported.

## Strings

JavaScript strings and C-like strings are different, and that complicates using strings with native libraries.

How are JavaScript strings and C strings different?

JavaScript strings:

C strings:

To solve this, bun:ffi exports CString which extends JavaScript's built-in String to support null-terminated strings and add a few extras:

```typescript
class CString extends String {
  /**
   * Given a `ptr`, this will automatically search for the closing `\0` character and transcode from UTF-8 to UTF-16 if necessary.
   */
  constructor(ptr: number, byteOffset?: number, byteLength?: number): string;

  /**
   * The ptr to the C string
   *
   * This `CString` instance is a clone of the string, so it
   * is safe to continue using this instance after the `ptr` has been
   * freed.
   */
  ptr: number;
  byteOffset?: number;
  byteLength?: number;
}
```

To convert from a null-terminated string pointer to a JavaScript string:

```typescript
const myString = new CString(ptr);
```

To convert from a pointer with a known length to a JavaScript string:

```typescript
const myString = new CString(ptr, 0, byteLength);
```

The new CString() constructor clones the C string, so it is safe to continue using myString after ptr has been freed.

```typescript
my_library_free(myString.ptr);

// this is safe because myString is a clone
console.log(myString);
```

When used in returns, FFIType.cstring coerces the pointer to a JavaScript string. When used in args, FFIType.cstring is identical to ptr.

## Function pointers

Note — Async functions are not yet supported.

To call a function pointer from JavaScript, use CFunction. This is useful if using Node-API (napi) with Bun, and you've already loaded some symbols.

```typescript
import { CFunction } from "bun:ffi";

let myNativeLibraryGetVersion = /* somehow, you got this pointer */

const getVersion = new CFunction({
  returns: "cstring",
  args: [],
  ptr: myNativeLibraryGetVersion,
});
getVersion();
```

If you have multiple function pointers, you can define them all at once with linkSymbols:

```typescript
import { linkSymbols } from "bun:ffi";

// getVersionPtrs defined elsewhere
const [majorPtr, minorPtr, patchPtr] = getVersionPtrs();

const lib = linkSymbols({
  // Unlike with dlopen(), the names here can be whatever you want
  getMajor: {
    returns: "cstring",
    args: [],

    // Since this doesn't use dlsym(), you have to provide a valid ptr
    // That ptr could be a number or a bigint
    // An invalid pointer will crash your program.
    ptr: majorPtr,
  },
  getMinor: {
    returns: "cstring",
    args: [],
    ptr: minorPtr,
  },
  getPatch: {
    returns: "cstring",
    args: [],
    ptr: patchPtr,
  },
});

const [major, minor, patch] = [
  lib.symbols.getMajor(),
  lib.symbols.getMinor(),
  lib.symbols.getPatch(),
];
```

## Callbacks

Use JSCallback to create JavaScript callback functions that can be passed to C/FFI functions. The C/FFI function can call into the JavaScript/TypeScript code. This is useful for asynchronous code or whenever you want to call into JavaScript code from C.

```typescript
import { dlopen, JSCallback, ptr, CString } from "bun:ffi";

const {
  symbols: { search },
  close,
} = dlopen("libmylib", {
  search: {
    returns: "usize",
    args: ["cstring", "callback"],
  },
});

const searchIterator = new JSCallback(
  (ptr, length) => /hello/.test(new CString(ptr, length)),
  {
    returns: "bool",
    args: ["ptr", "usize"],
  },
);

const str = Buffer.from("wwutwutwutwutwutwutwutwutwutwutut\0", "utf8");
if (search(ptr(str), searchIterator)) {
  // found a match!
}

// Sometime later:
setTimeout(() => {
  searchIterator.close();
  close();
}, 5000);
```

When you're done with a JSCallback, you should call close() to free the memory.

⚡️ Performance tip — For a slight performance boost, directly pass JSCallback.prototype.ptr instead of the JSCallback object:

```typescript
const onResolve = new JSCallback(arg => arg === 42, {
  returns: "bool",
  args: ["i32"],
});
const setOnResolve = new CFunction({
  returns: "bool",
  args: ["function"],
  ptr: myNativeLibrarySetOnResolve,
});

// This code runs slightly faster:
setOnResolve(onResolve.ptr);

// Compared to this:
setOnResolve(onResolve);
```

## Pointers

Bun represents pointers as a number in JavaScript.

How does a 64 bit pointer fit in a JavaScript number?

64-bit processors support up to 52 bits of addressable space. JavaScript numbers support 53 bits of usable space, so that leaves us with about 11 bits of extra space.

Why not BigInt? BigInt is slower. JavaScript engines allocate a separate BigInt which means they can't fit into a regular JavaScript value. If you pass a BigInt to a function, it will be converted to a number

To convert from a TypedArray to a pointer:

```typescript
import { ptr } from "bun:ffi";
let myTypedArray = new Uint8Array(32);
const myPtr = ptr(myTypedArray);
```

To convert from a pointer to an ArrayBuffer:

```typescript
import { ptr, toArrayBuffer } from "bun:ffi";
let myTypedArray = new Uint8Array(32);
const myPtr = ptr(myTypedArray);

// toArrayBuffer accepts a `byteOffset` and `byteLength`
// if `byteLength` is not provided, it is assumed to be a null-terminated pointer
myTypedArray = new Uint8Array(toArrayBuffer(myPtr, 0, 32), 0, 32);
```

To read data from a pointer, you have two options. For long-lived pointers, use a DataView:

```typescript
import { toArrayBuffer } from "bun:ffi";
let myDataView = new DataView(toArrayBuffer(myPtr, 0, 32));

console.log(
  myDataView.getUint8(0, true),
  myDataView.getUint8(1, true),
  myDataView.getUint8(2, true),
  myDataView.getUint8(3, true),
);
```

For short-lived pointers, use read:

```typescript
import { read } from "bun:ffi";

console.log(
  // ptr, byteOffset
  read.u8(myPtr, 0),
  read.u8(myPtr, 1),
  read.u8(myPtr, 2),
  read.u8(myPtr, 3),
);
```

The read function behaves similarly to DataView, but it's usually faster because it doesn't need to create a DataView or ArrayBuffer.

### Memory management

bun:ffi does not manage memory for you. You must free the memory when you're done with it.

#### From JavaScript

If you want to track when a TypedArray is no longer in use from JavaScript, you can use a FinalizationRegistry.

#### From C, Rust, Zig, etc

If you want to track when a TypedArray is no longer in use from C or FFI, you can pass a callback and an optional context pointer to toArrayBuffer or toBuffer. This function is called at some point later, once the garbage collector frees the underlying ArrayBuffer JavaScript object.

The expected signature is the same as in JavaScriptCore's C API:

```typescript
typedef void (*JSTypedArrayBytesDeallocator)(void *bytes, void *deallocatorContext);
```

```typescript
import { toArrayBuffer } from "bun:ffi";

// with a deallocatorContext:
toArrayBuffer(
  bytes,
  byteOffset,

  byteLength,

  // this is an optional pointer to a callback
  deallocatorContext,

  // this is a pointer to a function
  jsTypedArrayBytesDeallocator,
);

// without a deallocatorContext:
toArrayBuffer(
  bytes,
  byteOffset,

  byteLength,

  // this is a pointer to a function
  jsTypedArrayBytesDeallocator,
);
```

### Memory safety

Using raw pointers outside of FFI is extremely not recommended. A future version of Bun may add a CLI flag to disable bun:ffi.

### Pointer alignment

If an API expects a pointer sized to something other than char or u8, make sure the TypedArray is also that size. A u64* is not exactly the same as [8]u8* due to alignment.

### Passing a pointer

Where FFI functions expect a pointer, pass a TypedArray of equivalent size:

```typescript
import { dlopen, FFIType } from "bun:ffi";

const {
  symbols: { encode_png },
} = dlopen(myLibraryPath, {
  encode_png: {
    // FFIType's can be specified as strings too
    args: ["ptr", "u32", "u32"],
    returns: FFIType.ptr,
  },
});

const pixels = new Uint8ClampedArray(128 * 128 * 4);
pixels.fill(254);
pixels.subarray(0, 32 * 32 * 2).fill(0);

const out = encode_png(
  // pixels will be passed as a pointer
  pixels,

  128,
  128,
);
```

The auto-generated wrapper converts the pointer to a TypedArray.

Hardmode

If you don't want the automatic conversion or you want a pointer to a specific byte offset within the TypedArray, you can also directly get the pointer to the TypedArray:

```typescript
import { dlopen, FFIType, ptr } from "bun:ffi";

const {
  symbols: { encode_png },
} = dlopen(myLibraryPath, {
  encode_png: {
    // FFIType's can be specified as strings too
    args: ["ptr", "u32", "u32"],
    returns: FFIType.ptr,
  },
});

const pixels = new Uint8ClampedArray(128 * 128 * 4);
pixels.fill(254);

// this returns a number! not a BigInt!
const myPtr = ptr(pixels);

const out = encode_png(
  myPtr,

  // dimensions:
  128,
  128,
);
```

### Reading pointers

```typescript
const out = encode_png(
  // pixels will be passed as a pointer
  pixels,

  // dimensions:
  128,
  128,
);

// assuming it is 0-terminated, it can be read like this:
let png = new Uint8Array(toArrayBuffer(out));

// save it to disk:
await Bun.write("out.png", png);
```

Previous

Console

Next

HTMLRewriter

Edit on GitHub



Page URL: https://bun.sh/docs/api/html-rewriter

# HTMLRewriter

Edit on GitHub

Bun provides a fast native implementation of the HTMLRewriter pattern developed by Cloudflare. It provides a convenient, EventListener-like API for traversing and transforming HTML documents.

```typescript
const rewriter = new HTMLRewriter();

rewriter.on("*", {
  element(el) {
    console.log(el.tagName); // "body" | "div" | ...
  },
});
```

To parse and/or transform the HTML:

```typescript
rewriter.transform(
  new Response(`
<!DOCTYPE html>
<html>
<!-- comment -->
<head>
  <title>My First HTML Page</title>
</head>
<body>
  <h1>My First Heading</h1>
  <p>My first paragraph.</p>
</body>
`));
```

View the full documentation on the Cloudflare website.

Previous

FFI

Next

Testing

Edit on GitHub



Page URL: https://bun.sh/docs/api/test

# Testing

Edit on GitHub

See the bun test documentation.

Previous

HTMLRewriter

Next

Utils

Edit on GitHub



Page URL: https://bun.sh/docs/api/utils

# Utils

Edit on GitHub

## Bun.version

A string containing the version of the bun CLI that is currently running.

```typescript
Bun.version;
// => "0.6.4"
```

## Bun.revision

The git commit of Bun that was compiled to create the current bun CLI.

```typescript
Bun.revision;
// => "f02561530fda1ee9396f51c8bc99b38716e38296"
```

## Bun.env

An alias for process.env.

## Bun.main

An absolute path to the entrypoint of the current program (the file that was executed with bun run).

```typescript
Bun.main;
// /path/to/script.ts
```

This is particular useful for determining whether a script is being directly executed, as opposed to being imported by another script.

```typescript
if (import.meta.path === Bun.main) {
  // this script is being directly executed
} else {
  // this file is being imported from another script
}
```

This is analogous to the require.main = module trick in Node.js.

## Bun.sleep()

Bun.sleep(ms: number)

Returns a Promise that resolves after the given number of milliseconds.

```typescript
console.log("hello");
await Bun.sleep(1000);
console.log("hello one second later!");
```

Alternatively, pass a Date object to receive a Promise that resolves at that point in time.

```typescript
const oneSecondInFuture = new Date(Date.now() + 1000);

console.log("hello");
await Bun.sleep(oneSecondInFuture);
console.log("hello one second later!");
```

## Bun.sleepSync()

Bun.sleepSync(ms: number)

A blocking synchronous version of Bun.sleep.

```typescript
console.log("hello");
Bun.sleepSync(1000); // blocks thread for one second
console.log("hello one second later!");
```

## Bun.which()

Bun.which(bin: string)

Returns the path to an executable, similar to typing which in your terminal.

```typescript
const ls = Bun.which("ls");
console.log(ls); // "/usr/bin/ls"
```

By default Bun looks at the current PATH environment variable to determine the path. To configure PATH:

```typescript
const ls = Bun.which("ls", {
  PATH: "/usr/local/bin:/usr/bin:/bin",
});
console.log(ls); // "/usr/bin/ls"
```

Pass a cwd option to resolve for executable from within a specific directory.

```typescript
const ls = Bun.which("ls", {
  cwd: "/tmp",
  PATH: "",
});

console.log(ls); // null
```

## Bun.peek()

Bun.peek(prom: Promise)

Reads a promise's result without await or .then, but only if the promise has already fulfilled or rejected.

```typescript
import { peek } from "bun";

const promise = Promise.resolve("hi");

// no await!
const result = peek(promise);
console.log(result); // "hi"
```

This is important when attempting to reduce number of extraneous microticks in performance-sensitive code. It's an advanced API and you probably shouldn't use it unless you know what you're doing.

```typescript
import { peek } from "bun";
import { expect, test } from "bun:test";

test("peek", () => {
  const promise = Promise.resolve(true);

  // no await necessary!
  expect(peek(promise)).toBe(true);

  // if we peek again, it returns the same value
  const again = peek(promise);
  expect(again).toBe(true);

  // if we peek a non-promise, it returns the value
  const value = peek(42);
  expect(value).toBe(42);

  // if we peek a pending promise, it returns the promise again
  const pending = new Promise(() => {});
  expect(peek(pending)).toBe(pending);

  // If we peek a rejected promise, it:
  // - returns the error
  // - does not mark the promise as handled
  const rejected = Promise.reject(
    new Error("Successfully tested promise rejection"),
  );
  expect(peek(rejected).message).toBe("Successfully tested promise rejection");
});
```

The peek.status function lets you read the status of a promise without resolving it.

```typescript
import { peek } from "bun";
import { expect, test } from "bun:test";

test("peek.status", () => {
  const promise = Promise.resolve(true);
  expect(peek.status(promise)).toBe("fulfilled");

  const pending = new Promise(() => {});
  expect(peek.status(pending)).toBe("pending");

  const rejected = Promise.reject(new Error("oh nooo"));
  expect(peek.status(rejected)).toBe("rejected");
});
```

## Bun.openInEditor()

Opens a file in your default editor. Bun auto-detects your editor via the $VISUAL or $EDITOR environment variables.

```typescript
const currentFile = import.meta.url;
Bun.openInEditor(currentFile);
```

You can override this via the debug.editor setting in your bunfig.toml

```typescript
[debug]
editor = "code"
```

Or specify an editor with the editor param. You can also specify a line and column number.

```typescript
Bun.openInEditor(import.meta.url, {
  editor: "vscode", // or "subl"
  line: 10,
  column: 5,
});
```

Bun.ArrayBufferSink;

## Bun.deepEquals()

Nestedly checks if two objects are equivalent. This is used internally by expect().toEqual() in bun:test.

```typescript
const foo = { a: 1, b: 2, c: { d: 3 } };

// true
Bun.deepEquals(foo, { a: 1, b: 2, c: { d: 3 } });

// false
Bun.deepEquals(foo, { a: 1, b: 2, c: { d: 4 } });
```

A third boolean parameter can be used to enable "strict" mode. This is used by expect().toStrictEqual() in the test runner.

```typescript
const a = { entries: [1, 2] };
const b = { entries: [1, 2], extra: undefined };

Bun.deepEquals(a, b); // => true
Bun.deepEquals(a, b, true); // => false
```

In strict mode, the following are considered unequal:

```typescript
// undefined values
Bun.deepEquals({}, { a: undefined }, true); // false

// undefined in arrays
Bun.deepEquals(["asdf"], ["asdf", undefined], true); // false

// sparse arrays
Bun.deepEquals([, 1], [undefined, 1], true); // false

// object literals vs instances w/ same properties
class Foo {
  a = 1;
}
Bun.deepEquals(new Foo(), { a: 1 }, true); // false
```

## Bun.escapeHTML()

Bun.escapeHTML(value: string | object | number | boolean): string

Escapes the following characters from an input string:

This function is optimized for large input. On an M1X, it processes 480 MB/s - 20 GB/s, depending on how much data is being escaped and whether there is non-ascii text. Non-string types will be converted to a string before escaping.

## Bun.fileURLToPath()

Converts a file:// URL to an absolute path.

```typescript
const path = Bun.fileURLToPath(new URL("file:///foo/bar.txt"));
console.log(path); // "/foo/bar.txt"
```

## Bun.pathToFileURL()

Converts an absolute path to a file:// URL.

```typescript
const url = Bun.pathToFileURL("/foo/bar.txt");
console.log(url); // "file:///foo/bar.txt"
```

## Bun.gzipSync()

Compresses a Uint8Array using zlib's GZIP algorithm.

```typescript
const buf = Buffer.from("hello".repeat(100)); // Buffer extends Uint8Array
const compressed = Bun.gzipSync(buf);

buf; // => Uint8Array(500)
compressed; // => Uint8Array(30)
```

Optionally, pass a parameters object as the second argument:

zlib compression options

```typescript
export type ZlibCompressionOptions = {
  /**
   * The compression level to use. Must be between `-1` and `9`.
   * - A value of `-1` uses the default compression level (Currently `6`)
   * - A value of `0` gives no compression
   * - A value of `1` gives least compression, fastest speed
   * - A value of `9` gives best compression, slowest speed
   */
  level?: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * How much memory should be allocated for the internal compression state.
   *
   * A value of `1` uses minimum memory but is slow and reduces compression ratio.
   *
   * A value of `9` uses maximum memory for optimal speed. The default is `8`.
   */
  memLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  /**
   * The base 2 logarithm of the window size (the size of the history buffer).
   *
   * Larger values of this parameter result in better compression at the expense of memory usage.
   *
   * The following value ranges are supported:
   * - `9..15`: The output will have a zlib header and footer (Deflate)
   * - `-9..-15`: The output will **not** have a zlib header or footer (Raw Deflate)
   * - `25..31` (16+`9..15`): The output will have a gzip header and footer (gzip)
   *
   * The gzip header will have no file name, no extra data, no comment, no modification time (set to zero) and no header CRC.
   */
  windowBits?:
    | -9
    | -10
    | -11
    | -12
    | -13
    | -14
    | -15
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31;
  /**
   * Tunes the compression algorithm.
   *
   * - `Z_DEFAULT_STRATEGY`: For normal data **(Default)**
   * - `Z_FILTERED`: For data produced by a filter or predictor
   * - `Z_HUFFMAN_ONLY`: Force Huffman encoding only (no string match)
   * - `Z_RLE`: Limit match distances to one (run-length encoding)
   * - `Z_FIXED` prevents the use of dynamic Huffman codes
   *
   * `Z_RLE` is designed to be almost as fast as `Z_HUFFMAN_ONLY`, but give better compression for PNG image data.
   *
   * `Z_FILTERED` forces more Huffman coding and less string matching, it is
   * somewhat intermediate between `Z_DEFAULT_STRATEGY` and `Z_HUFFMAN_ONLY`.
   * Filtered data consists mostly of small values with a somewhat random distribution.
   */
  strategy?: number;
};
```

## Bun.gunzipSync()

Decompresses a Uint8Array using zlib's GUNZIP algorithm.

```typescript
const buf = Buffer.from("hello".repeat(100)); // Buffer extends Uint8Array
const compressed = Bun.gunzipSync(buf);

const dec = new TextDecoder();
const uncompressed = Bun.inflateSync(compressed);
dec.decode(uncompressed);
// => "hellohellohello..."
```

## Bun.deflateSync()

Compresses a Uint8Array using zlib's DEFLATE algorithm.

```typescript
const buf = Buffer.from("hello".repeat(100));
const compressed = Bun.deflateSync(buf);

buf; // => Uint8Array(25)
compressed; // => Uint8Array(10)
```

The second argument supports the same set of configuration options as Bun.gzipSync.

## Bun.inflateSync()

Decompresses a Uint8Array using zlib's INFLATE algorithm.

```typescript
const buf = Buffer.from("hello".repeat(100));
const compressed = Bun.deflateSync(buf);

const dec = new TextDecoder();
const decompressed = Bun.inflateSync(compressed);
dec.decode(decompressed);
// => "hellohellohello..."
```

## Bun.inspect()

Serializes an object to a string exactly as it would be printed by console.log.

```typescript
const obj = { foo: "bar" };
const str = Bun.inspect(obj);
// => '{\nfoo: "bar" \n}'

const arr = new Uint8Array([1, 2, 3]);
const str = Bun.inspect(arr);
// => "Uint8Array(3) [ 1, 2, 3 ]"
```

## Bun.inspect.custom

This is the symbol that Bun uses to implement Bun.inspect. You can override this to customize how your objects are printed. It is identical to util.inspect.custom in Node.js.

```typescript
class Foo {
  [Bun.inspect.custom]() {
    return "foo";
  }
}

const foo = new Foo();
console.log(foo); // => "foo"
```

## Bun.nanoseconds()

Returns the number of nanoseconds since the current bun process started, as a number. Useful for high-precision timing and benchmarking.

```typescript
Bun.nanoseconds();
// => 7288958
```

## Bun.readableStreamTo*()

Bun implements a set of convenience functions for asynchronously consuming the body of a ReadableStream and converting it to various binary formats.

```typescript
const stream = (await fetch("https://bun.sh")).body;
stream; // => ReadableStream

await Bun.readableStreamToArrayBuffer(stream);
// => ArrayBuffer

await Bun.readableStreamToBlob(stream);
// => Blob

await Bun.readableStreamToJSON(stream);
// => object

await Bun.readableStreamToText(stream);
// => string

// returns all chunks as an array
await Bun.readableStreamToArray(stream);
// => unknown[]

// returns all chunks as a FormData object (encoded as x-www-form-urlencoded)
await Bun.readableStreamToFormData(stream);

// returns all chunks as a FormData object (encoded as multipart/form-data)
await Bun.readableStreamToFormData(stream, multipartFormBoundary);
```

## Bun.resolveSync()

Resolves a file path or module specifier using Bun's internal module resolution algorithm. The first argument is the path to resolve, and the second argument is the "root". If no match is found, an Error is thrown.

```typescript
Bun.resolveSync("./foo.ts", "/path/to/project");
// => "/path/to/project/foo.ts"

Bun.resolveSync("zod", "/path/to/project");
// => "/path/to/project/node_modules/zod/index.ts"
```

To resolve relative to the current working directory, pass process.cwd or "." as the root.

```typescript
Bun.resolveSync("./foo.ts", process.cwd());
Bun.resolveSync("./foo.ts", "/path/to/project");
```

To resolve relative to the directory containing the current file, pass import.meta.dir.

```typescript
Bun.resolveSync("./foo.ts", import.meta.dir);
```

## serialize & deserialize in bun:jsc

To save a JavaScript value into an ArrayBuffer & back, use serialize and deserialize from the "bun:jsc" module.

```typescript
import { serialize, deserialize } from "bun:jsc";

const buf = serialize({ foo: "bar" });
const obj = deserialize(buf);
console.log(obj); // => { foo: "bar" }
```

Internally, structuredClone and postMessage serialize and deserialize the same way. This exposes the underlying HTML Structured Clone Algorithm to JavaScript as an ArrayBuffer.

Previous

Testing

Next

Node-API

Edit on GitHub



Page URL: https://bun.sh/docs/api/node-api

# Node-API

Edit on GitHub

Node-API is an interface for building native add-ons to Node.js. Bun implements 95% of this interface from scratch, so most existing Node-API extensions will work with Bun out of the box. Track the completion status of it in this issue.

As in Node.js, .node files (Node-API modules) can be required directly in Bun.

```typescript
const napi = require("./my-node-module.node");
```

Alternatively, use process.dlopen:

```typescript
let mod = { exports: {} };
process.dlopen(mod, "./my-node-module.node");
```

Bun polyfills the detect-libc package, which is used by many Node-API modules to detect which .node binding to require.

Previous

Utils

Next

Roadmap

Edit on GitHub



Page URL: https://bun.sh/docs/project/roadmap

# Roadmap

Edit on GitHub

Bun is a project with an incredibly large scope and is still in its early days. Long-term, Bun aims to provide an all-in-one toolkit to replace the complex, fragmented toolchains common today: Node.js, Jest, Webpack, esbuild, Babel, yarn, PostCSS, etc.

Refer to Bun's Roadmap on GitHub to learn more about the project's long-term plans and priorities.

Previous

Node-API

Next

Benchmarking

Edit on GitHub



Page URL: https://bun.sh/docs/project/benchmarking

# Benchmarking

Edit on GitHub

Bun is designed for speed. Hot paths are extensively profiled and benchmarked. The source code for all of Bun's public benchmarks can be found in the /bench directory of the Bun repo.

## Measuring time

To precisely measure time, Bun offers two runtime APIs functions:

## Benchmarking tools

When writing your own benchmarks, it's important to choose the right tool.

## Measuring memory usage

Bun has two heaps. One heap is for the JavaScript runtime and the other heap is for everything else.

### JavaScript heap stats

The bun:jsc module exposes a few functions for measuring memory usage:

```typescript
import { heapStats } from "bun:jsc";
console.log(heapStats());
```

View example statistics

```typescript
{
  heapSize: 1657575,
  heapCapacity: 2872775,
  extraMemorySize: 598199,
  objectCount: 13790,
  protectedObjectCount: 62,
  globalObjectCount: 1,
  protectedGlobalObjectCount: 1,
  // A count of every object type in the heap
  objectTypeCounts: {
    CallbackObject: 25,
    FunctionExecutable: 2078,
    AsyncGeneratorFunction: 2,
    'RegExp String Iterator': 1,
    FunctionCodeBlock: 188,
    ModuleProgramExecutable: 13,
    String: 1,
    UnlinkedModuleProgramCodeBlock: 13,
    JSON: 1,
    AsyncGenerator: 1,
    Symbol: 1,
    GetterSetter: 68,
    ImportMeta: 10,
    DOMAttributeGetterSetter: 1,
    UnlinkedFunctionCodeBlock: 174,
    RegExp: 52,
    ModuleLoader: 1,
    Intl: 1,
    WeakMap: 4,
    Generator: 2,
    PropertyTable: 95,
    'Array Iterator': 1,
    JSLexicalEnvironment: 75,
    UnlinkedFunctionExecutable: 2067,
    WeakSet: 1,
    console: 1,
    Map: 23,
    SparseArrayValueMap: 14,
    StructureChain: 19,
    Set: 18,
    'String Iterator': 1,
    FunctionRareData: 3,
    JSGlobalLexicalEnvironment: 1,
    Object: 481,
    BigInt: 2,
    StructureRareData: 55,
    Array: 179,
    AbortController: 2,
    ModuleNamespaceObject: 11,
    ShadowRealm: 1,
    'Immutable Butterfly': 103,
    Primordials: 1,
    'Set Iterator': 1,
    JSGlobalProxy: 1,
    AsyncFromSyncIterator: 1,
    ModuleRecord: 13,
    FinalizationRegistry: 1,
    AsyncIterator: 1,
    InternalPromise: 22,
    Iterator: 1,
    CustomGetterSetter: 65,
    Promise: 19,
    WeakRef: 1,
    InternalPromisePrototype: 1,
    Function: 2381,
    AsyncFunction: 2,
    GlobalObject: 1,
    ArrayBuffer: 2,
    Boolean: 1,
    Math: 1,
    CallbackConstructor: 1,
    Error: 2,
    JSModuleEnvironment: 13,
    WebAssembly: 1,
    HashMapBucket: 300,
    Callee: 3,
    symbol: 37,
    string: 2484,
    Performance: 1,
    ModuleProgramCodeBlock: 12,
    JSSourceCode: 13,
    JSPropertyNameEnumerator: 3,
    NativeExecutable: 290,
    Number: 1,
    Structure: 1550,
    SymbolTable: 108,
    GeneratorFunction: 2,
    'Map Iterator': 1
  },
  protectedObjectTypeCounts: {
    CallbackConstructor: 1,
    BigInt: 1,
    RegExp: 2,
    GlobalObject: 1,
    UnlinkedModuleProgramCodeBlock: 13,
    HashMapBucket: 2,
    Structure: 41,
    JSPropertyNameEnumerator: 1
  }
}
```

JavaScript is a garbage-collected language, not reference counted. It's normal and correct for objects to not be freed immediately in all cases, though it's not normal for objects to never be freed.

To force garbage collection to run manually:

```typescript
Bun.gc(true); // synchronous
Bun.gc(false); // asynchronous
```

Heap snapshots let you inspect what objects are not being freed. You can use the bun:jsc module to take a heap snapshot and then view it with Safari or WebKit GTK developer tools. To generate a heap snapshot:

```typescript
import { generateHeapSnapshot } from "bun";

const snapshot = generateHeapSnapshot();
await Bun.write("heap.json", JSON.stringify(snapshot, null, 2));
```

To view the snapshot, open the heap.json file in Safari's Developer Tools (or WebKit GTK)

Once imported, you should see something like this:

### Native heap stats

Bun uses mimalloc for the other heap. To report a summary of non-JavaScript memory usage, set the MIMALLOC_SHOW_STATS=1 environment variable. and stats will print on exit.

```typescript
MIMALLOC_SHOW_STATS=1 bun script.js

# will show something like this:
heap stats:    peak      total      freed    current       unit      count
  reserved:   64.0 MiB   64.0 MiB      0       64.0 MiB                        not all freed!
 committed:   64.0 MiB   64.0 MiB      0       64.0 MiB                        not all freed!
     reset:      0          0          0          0                            ok
   touched:  128.5 KiB  128.5 KiB    5.4 MiB   -5.3 MiB                        ok
  segments:      1          1          0          1                            not all freed!
-abandoned:      0          0          0          0                            ok
   -cached:      0          0          0          0                            ok
     pages:      0          0         53        -53                            ok
-abandoned:      0          0          0          0                            ok
 -extended:      0
 -noretire:      0
     mmaps:      0
   commits:      0
   threads:      0          0          0          0                            ok
  searches:     0.0 avg
numa nodes:       1
   elapsed:       0.068 s
   process: user: 0.061 s, system: 0.014 s, faults: 0, rss: 57.4 MiB, commit: 64.0 MiB
```

Previous

Roadmap

Next

Development

Edit on GitHub



Page URL: https://bun.sh/docs/project/development

# Development

Edit on GitHub

Configuring a development environment for Bun can take 10-30 minutes depending on your internet connection and computer speed. You will need ~10GB of free disk space for the repository and build artifacts.

If you are using Windows, you must use a WSL environment as Bun does not yet compile on Windows natively.

Before starting, you will need to already have a release build of Bun installed, as we use our bundler to transpile and minify our code.

```typescript
curl -fsSL https://bun.sh/install | bash # for macOS, Linux, and WSL
```

```typescript
npm install -g bun # the last `npm` command you'll ever need
```

```typescript
brew tap oven-sh/bun # for macOS and Linux
```

```typescript
docker pull oven/bun
```

```typescript
proto install bun
```

## Install LLVM

Bun requires LLVM 15 and Clang 15 (clang is part of LLVM). This version requirement is to match WebKit (precompiled), as mismatching versions will cause memory allocation failures at runtime. In most cases, you can install LLVM through your system package manager:

```typescript
brew install llvm@15
```

```typescript
# LLVM has an automatic installation script that is compatible with all versions of Ubuntu
```

```typescript
sudo pacman -S llvm clang lld
```

If none of the above solutions apply, you will have to install it manually.

Make sure LLVM 15 is in your path:

```typescript
which clang-15
```

If not, run this to manually link it:

```typescript
# use fish_add_path if you're using fish
```

## Install Dependencies

Using your system's package manager, install the rest of Bun's dependencies:

```typescript
brew install automake ccache cmake coreutils esbuild gnu-sed go libiconv libtool ninja pkg-config rust
```

```typescript
sudo apt install cargo ccache cmake git golang libtool ninja-build pkg-config rustc esbuild
```

```typescript
pacman -S base-devel ccache cmake esbuild git go libiconv libtool make ninja pkg-config python rust sed unzip
```

Ubuntu — Unable to locate package esbuild

The apt install esbuild command may fail with an Unable to locate package error if you are using a Ubuntu mirror that does not contain an exact copy of the original Ubuntu server. Note that the same error may occur if you are not using any mirror but have the Ubuntu Universe enabled in the sources.list. In this case, you can install esbuild manually:

```typescript
curl -fsSL https://esbuild.github.io/dl/latest | sh
```

In addition to this, you will need an npm package manager (bun, npm, etc) to install the package.json dependencies.

## Install Zig

Zig can be installed either with our npm package @oven/zig, or by using zigup.

```typescript
bun install -g @oven/zig
```

We last updated Zig on July 18th, 2023

## First Build

After cloning the repository, run the following command to run the first build. This may take a while as it will clone submodules and build dependencies.

```typescript
make setup
```

The binary will be located at packages/debug-bun-{platform}-{arch}/bun-debug. It is recommended to add this to your $PATH. To verify the build worked, lets print the version number on the development build of Bun.

```typescript
packages/debug-bun-*/bun-debug --version
```

Note: make setup is just an alias for the following:

```typescript
make assert-deps submodule npm-install-dev node-fallbacks runtime_js fallback_decoder bun_error mimalloc picohttp zlib boringssl libarchive lolhtml sqlite usockets uws tinycc c-ares zstd base64 cpp zig link
```

## Rebuilding

Bun uses a series of make commands to rebuild parts of the codebase. The general rule for rebuilding is there is make link to rerun the linker, and then different make targets for different parts of the codebase. Do not pass -j to make as these scripts will break if run out of order, and multiple cores will be used when possible during the builds.

make setup cloned a bunch of submodules and built the subprojects. When a submodule is out of date, run make submodule to quickly reset/update all your submodules, then you can rebuild individual submodules with their respective command.

The above will probably also need Zig and/or C++ code rebuilt.

## VSCode

VSCode is the recommended IDE for working on Bun, as it has been configured. Once opening, you can run Extensions: Show Recommended Extensions to install the recommended extensions for Zig and C++. ZLS is automatically configured.

### ZLS

ZLS is the language server for Zig. The latest binary that the extension auto-updates may not function with the version of Zig that Bun uses. It may be more reliable to build ZLS from source:

```typescript
git clone https://github.com/zigtools/zls
```

Then add absolute paths to Zig and ZLS in your vscode config:

```typescript
{
  "zig.zigPath": "/path/to/zig/install/zig",
  "zig.zls.path": "/path/to/zls/zig-out/bin/zls"
}
```

## JavaScript builtins

When you change anything in src/js/builtins/* or switch branches, run this:

```typescript
make js cpp
```

That inlines the TypeScript code into C++ headers.

Make sure you have ccache installed, otherwise regeneration will take much longer than it should.

For more information on how src/js works, see src/js/README.md in the codebase.

## Code generation scripts

Bun leverages a lot of code generation scripts.

The ./src/bun.js/bindings/headers.h file has bindings to & from Zig <> C++ code. This file is generated by running the following:

```typescript
make headers
```

This ensures that the types for Zig and the types for C++ match up correctly, by using comptime reflection over functions exported/imported.

TypeScript files that end with *.classes.ts are another code generation script. They generate C++ boilerplate for classes implemented in Zig. The generated code lives in:

```typescript
make codegen
```

Lastly, we also have a code generation script for our native stream implementations. To run that, run:

```typescript
make generate-sink
```

You probably won't need to run that one much.

## Modifying ESM modules

Certain modules like node:fs, node:stream, bun:sqlite, and ws are implemented in JavaScript. These live in src/js/{node,bun,thirdparty} files and are pre-bundled using Bun. The bundled code is committed so CI builds can run without needing a copy of Bun.

When these are changed, run:

```typescript
$ make js
```

In debug builds, Bun automatically loads these from the filesystem, wherever it was compiled, so no need to re-run make dev.

## Release build

To build a release build of Bun, run:

```typescript
make release-bindings -j12
```

The binary will be located at packages/bun-{platform}-{arch}/bun.

## Valgrind

On Linux, valgrind can help find memory issues.

Keep in mind:

You'll need a very recent version of Valgrind due to DWARF 5 debug symbols. You may need to manually compile Valgrind instead of using it from your Linux package manager.

--fair-sched=try is necessary if running multithreaded code in Bun (such as the bundler). Otherwise it will hang.

```typescript
valgrind --fair-sched=try --track-origins=yes bun-debug <args>
```

## Updating WebKit

The Bun team will occasionally bump the version of WebKit used in Bun. When this happens, you may see something like this with you run git status.

```typescript
git status
```

For performance reasons, make submodule does not automatically update the WebKit submodule. To update, run the following commands from the root of the Bun repo:

```typescript
bun install
```

## Troubleshooting

### 'span' file not found on Ubuntu

⚠️ Please note that the instructions below are specific to issues occurring on Ubuntu. It is unlikely that the same issues will occur on other Linux distributions.

The Clang compiler typically uses the libstdc++ C++ standard library by default. libstdc++ is the default C++ Standard Library implementation provided by the GNU Compiler Collection (GCC). While Clang may link against the libc++ library, this requires explicitly providing the -stdlib flag when running Clang.

Bun relies on C++20 features like std::span, which are not available in GCC versions lower than 11. GCC 10 doesn't have all of the C++20 features implemented. As a result, running make setup may fail with the following error:

```typescript
fatal error: 'span' file not found
#include <span>
         ^~~~~~
```

To fix the error, we need to update the GCC version to 11. To do this, we'll need to check if the latest version is available in the distribution's official repositories or use a third-party repository that provides GCC 11 packages. Here are general steps:

```typescript
sudo apt update
```

Now, we need to set GCC 11 as the default compiler:

```typescript
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-11 100
```

### libarchive

If you see an error when compiling libarchive, run this:

```typescript
brew install pkg-config
```

### missing files on zig build obj

If you see an error about missing files on zig build obj, make sure you built the headers.

```typescript
make headers
```

### cmakeconfig.h not found

If you see an error about cmakeconfig.h not being found, this is because the precompiled WebKit did not install properly.

```typescript
bun install
```

Check to see the command installed webkit, and you can manully look for node_modules/bun-webkit-{platform}-{arch}:

```typescript
# this should reveal two directories. if not, something went wrong
```

### macOS library not found for -lSystem

If you see this error when compiling, run:

```typescript
xcode-select --install
```

## Arch Linux / Cannot find libatomic.a

Bun requires libatomic to be statically linked. On Arch Linux, it is only given as a shared library, but as a workaround you can symlink it to get the build working locally.

```typescript
sudo ln -s /lib/libatomic.so /lib/libatomic.a
```

The built version of bun may not work on other systems if compiled this way.

Previous

Benchmarking

Next

License

Edit on GitHub



Page URL: https://bun.sh/docs/project/licensing

# License

Edit on GitHub

Bun itself is MIT-licensed.

## JavaScriptCore

Bun statically links JavaScriptCore (and WebKit) which is LGPL-2 licensed. WebCore files from WebKit are also licensed under LGPL2. Per LGPL2:

(1) If you statically link against an LGPL’d library, you must also provide your application in an object (not necessarily source) format, so that a user has the opportunity to modify the library and relink the application.

You can find the patched version of WebKit used by Bun here: https://github.com/oven-sh/webkit. If you would like to relink Bun with changes:

This compiles JavaScriptCore, compiles Bun’s .cpp bindings for JavaScriptCore (which are the object files using JavaScriptCore) and outputs a new bun binary with your changes.

## Linked libraries

Bun statically links these libraries:

## Polyfills

For compatibility reasons, the following packages are embedded into Bun's binary and injected if imported.

## Additional credits

Previous

Development

Edit on GitHub

