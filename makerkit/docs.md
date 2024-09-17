---
label: "Adding a Super Admin"
title: "Adding a Super Admin to your Next.js Supabase application"
description: "In this post, you will learn how to set up a Super Admin in your Next.js Supabase application"
position: 0
---

The Super Admin panel allows you to manage users and accounts.

To access the super admin panel at `/admin`, you will need to assign a user as a super admin.

To do so, pick the user ID of the user you want to assign as a super admin and run the following SQL query from your Supabase SQL Query editor:

```sql
UPDATE auth.users SET raw_app_meta_data = raw_app_meta_data || '{"role": "super-admin"}' WHERE id='<user_id>';
```

Please replace `<user_id>` with the user ID you want to assign as a super admin.

---
title: 'Understanding Analytics and Events in Makerkit'
label: 'Analytics and Events in Makerkit'
description: 'Learn how to use the Analytics and App Events systems in Makerkit to track user behavior and app-wide occurrences.'
position: 0
---

Makerkit provides two powerful, interconnected systems for tracking user behavior and app-wide occurrences: **Analytics** and **App Events**.

While these systems are separate, they are designed to work seamlessly together, providing a flexible and maintainable approach to event tracking and analysis in your SaaS application.

One doesn't need the other to function, but they are designed to work together. Here's a brief overview of each system.

## Analytics Providers

The Analytics system is implemented in the `@kit/analytics` package, and is abstracted to allow for easy integration with various analytics services, and not lock you into a specific provider.

The implementations are made possible using Makerkit Plugins, which means you can install them using the normal plugins system. By default, Makerkit provides three analytics providers: Google Analytics, Umami, and PostHog.

However, should you prefer different providers than the ones provided by default, you can easily create your own custom analytics provider.

[Read more about creating a custom analytics provider](custom-analytics-provider).

## Understanding the Relationship Between Analytics and App Events

While separate, the Analytics and App Events systems in Makerkit are designed to work together to provide a centralized approach to event tracking and analysis in your SaaS application.

- **App Events**: A client-side event system for emitting and listening to important app-wide occurrences. Use this to bubble up important events in your app that you can handle centrally.
- **Analytics**: A centralized system for tracking and analyzing user behavior and app usage. Use this to track important events and user interactions in your app.

While these systems can be used independently, they shine when used together, creating a powerful, centralized approach to event handling and analytics.

<Image src="/assets/images/docs/analytics-events-overview.webp" alt="Analytics and Events in Makerkit" width={1062} height={342} />

## Recommended Approach: Centralized Analytics

We strongly recommend using a centralized approach to analytics by leveraging the App Events system. Instead of scattering `analytics.trackEvent()` calls throughout your codebase, use App Events to emit important occurrences, then handle these events centrally to track analytics.

Benefits of this approach:

1. **Cleaner Code**: Keeps your components focused on their primary responsibilities.
2. **Easier Maintenance**: Centralizes all analytics logic in one place.
3. **Flexibility**: Easily change or extend analytics tracking without modifying component code.
4. **Consistency**: Ensures a standardized approach to event tracking across your app.
5. **Visibility**: Provides a clear picture of all events emitted in your app in one place.

Of course - this is just a recommendation. Nothing prevents you from using the `analytics` object directly in your components. However, we believe that the centralized approach provides a cleaner and more maintainable solution for most SaaS applications.

## Using App Events with Analytics

Here's how to use the pre-configured App Events system for analytics in your Makerkit project:

1. Emit events in your components:

```typescript
import { useAppEvents } from '@kit/shared/events';

function SomeComponent() {
  const { emit } = useAppEvents();

  const handleSignUp = (userId: string) => {
    emit({ type: 'user.signedUp', payload: { userId } });
  };

  // ...
}
```

That's it! Makerkit automatically handles these events and tracks them in your configured analytics service.

## Extending with Custom Events

You can easily extend the system with your own custom events:

### Define your custom events

Create a new file to define your custom events:

```typescript
import { ConsumerProvidedEventTypes } from '@kit/shared/events';

export interface MyAppEvents extends ConsumerProvidedEventTypes {
  'feature.used': { featureName: string };
  'subscription.changed': { newPlan: string };
}
```

### Use your custom events

Once you've defined your custom events, you can use them in your components:

```typescript
import { useAppEvents } from '@kit/shared/events';
import { MyAppEvents } from './myAppEvents';

function SomeComponent() {
  const { emit } = useAppEvents<MyAppEvents>();

  const handleFeatureUse = () => {
    emit({ type: 'feature.used', payload: { featureName: 'coolFeature' } });
  };

  // ...
}
```

### Emit and handle your custom events

A common pattern is to emit custom events in your components and handle them in a centralized location. You can easily extend the App Events system to handle your custom events.

Here's an example of how you might handle custom events in your analytics provider:

```typescript title="apps/web/components/analytics-provider.tsx" {18-21}
const analyticsMapping: AnalyticsMapping = {
  'user.signedIn': (event) => {
    const userId = event.payload.userId;

    if (userId) {
      analytics.identify(userId);
    }
  },
  'user.signedUp': (event) => {
    analytics.trackEvent(event.type, event.payload);
  },
  'checkout.started': (event) => {
    analytics.trackEvent(event.type, event.payload);
  },
  'user.updated': (event) => {
    analytics.trackEvent(event.type, event.payload);
  },
  'feature.used': (event) => {
    analytics.trackEvent(event.type, event.payload);
  },
};
```

By following this approach, you can easily extend the App Events system with your own custom events, providing a flexible and maintainable approach to event tracking in your SaaS application.

## Default Event Types

Makerkit provides a set of default event types that are automatically tracked in your analytics service. These events are emitted by the Makerkit components and can be used to track common user interactions and app-wide occurrences.

Here are some of the default event types provided by Makerkit:
1. `user.signedIn`: Emitted when a user signs in. We use this event to identify the user in the analytics service. This makes sure that all subsequent events are associated with the user.
2. `user.signedUp`: Emitted when a user signs up. This event is used to track user signups in the analytics service. NB: this does not work automatically for social signups.
3. `checkout.started`: Emitted when a user starts the checkout process. This event is used to track the start of the checkout process in the analytics service.
4. `user.updated`: Emitted when a user updates their authentication details. This event is used to track user updates in the analytics service.

In addition to this, Makerkit tracks page views automatically. This means that you don't need to manually track page views in your application. However, you can still use the `trackPageView` method to manually track page views if needed.

### When to use Custom Events

As Makerkit becomes more and more like a framework, there is a need to expose more customization options to developers, ideally without the need to customize the core codebase. This is where Custom Events come in - which allow you to listen to and emit custom events in your application.

Custom Events are useful when you need to track specific user interactions or app-wide occurrences that are not covered by the default event types. For example, you might want to track when a user interacts with a specific feature, or for tracking specific user actions in your app.

By using Custom Events, you can extend the App Events system to track any event that is important to your application, providing a flexible and maintainable approach to event tracking in your SaaS application.

Other use cases may include:
1. Propagating events from Makerkit's deep components to the top-level application (please do let us know if you need any)
2. Centralizing event tracking for third-party integrations (e.g., tracking events in Segment, Amplitude, etc.)
3. Tracking user interactions with specific features in your application

## Conclusion

By using the Analytics and App Events systems in Makerkit, you can easily track (or react to) user behavior and app-wide occurrences in your SaaS application. The centralized approach to event tracking provides a clean and maintainable solution for tracking analytics, while the flexibility of Custom Events allows you to extend the system to track any event that is important to your application.
---
title: 'Using the Analytics API in your Makerkit project'
label: 'Analytics API'
position: 1
description: 'Learn how to use the Analytics API in your Makerkit project to track user behavior and app usage.'
---

Makerkit provides a powerful and flexible Analytics API that integrates seamlessly with the App Events system. This API allows you to track user behavior and app usage easily and consistently across your SaaS application.

## Core Concepts of the Analytics API

The Analytics API is built around three main concepts:

1. **Identify**: Associate user data with a unique user ID.
2. **Track Events**: Record specific events or actions taken by users.
3. **Track Page Views**: Record when users view specific pages in your application.

### Using the Analytics API

The Analytics API is available through the `analytics` object imported from `@kit/analytics`.

#### Identifying Users

Use the `identify` method to associate a user with their actions:

```typescript
import { analytics } from '@kit/analytics';

void analytics.identify(userId, {
  email: user.email,
  plan: user.subscriptionPlan,
  // ... other user properties
});
```

#### Tracking Events

Use the `trackEvent` method to record specific actions or events:

```typescript
void analytics.trackEvent('Button Clicked', {
  buttonName: 'Submit',
  page: 'Sign Up',
});
```

#### Tracking Page Views

**Makerkit automatically tracks page views for you.** However, you can also manually track page views if needed.

Use the `trackPageView` method to record when users view specific pages:

```typescript
void analytics.trackPageView('Sign Up');
```

NB: The `trackPageView` method is automatically called when the route changes in a Next.js application.

### Integration with App Events

While you can use these methods directly, we recommend leveraging the App Events system for a more centralized approach. Makerkit automatically maps common app events to analytics tracking:

```typescript
import { useAppEvents } from '@kit/shared/events';

function SomeComponent() {
  const { emit } = useAppEvents();

  const handleSignUp = (userId: string) => {
    emit({ type: 'user.signedUp', payload: { userId } });
    // This automatically calls analytics.identify and analytics.trackEvent
  };

  // ...
}
```

### Extending the Analytics API

You can extend the analytics functionality by creating custom event mappings:

```typescript
import { analytics } from '@kit/analytics';
import { useAppEvents } from '@kit/shared/events';

interface MyAppEvents {
  'feature.used': { featureName: string };
}

export function useMyAnalytics() {
  const { emit } = useAppEvents<MyAppEvents>();

  return {
    trackFeatureUse: (featureName: string) => {
      emit({ type: 'feature.used', payload: { featureName } });
      // If you need additional tracking logic:
      void analytics.trackEvent('Feature Used', { featureName });
    },
  };
}
```

## Best Practices

When implementing analytics in your Makerkit project, consider the following best practices:

1. **Use App Events**: Whenever possible, use the App Events system instead of calling analytics methods directly. This keeps your analytics logic centralized and easier to maintain.
2. **Consistent Naming**: Use consistent naming conventions for your events and properties across your application.
3. **Relevant Data**: Only track data that's relevant and useful for your business goals. Avoid tracking sensitive or personal information.
4. **Testing**: Always test your analytics implementation to ensure events are being tracked correctly.
5. **Documentation**: Keep a record of all the events and properties you're tracking. This will be invaluable as your application grows.

By leveraging Makerkit's Analytics API in conjunction with the App Events system, you can create a robust, maintainable analytics setup that grows with your SaaS application. This approach provides the flexibility to track the data you need while keeping your codebase clean and organized.
---
title: 'Creating a Custom Analytics Provider in Makerkit'
label: 'Custom Analytics Provider'
description: 'Learn how to create a custom analytics provider in Makerkit to integrate with your preferred analytics service.'
position: 5
---

The Analytics package in Makerkit is meant to be flexible and extensible. You can easily create custom analytics providers to integrate with your preferred analytics service.

To create a custom analytics provider, you need to implement the `AnalyticsService` interface and then register it with the `AnalyticsManager`.

You can define one or more custom analytics providers, and the `AnalyticsManager` will handle the initialization and tracking of events for each provider.

NB: the methods expect to be Promise-based, so you can use async/await or return a Promise, or use the keyword `void` to ignore the return value and use it in non-async functions.

## Create your custom analytics service

Let's create a custom analytics service that implements the `AnalyticsService` interface:

```typescript title="packages/analytics/src/my-custom-analytics-service.ts"
import { AnalyticsService } from './path-to-types';

class MyCustomAnalyticsService implements AnalyticsService {
  async initialize() {
    // Initialize your analytics service
  }

  async identify(userId: string, traits?: Record<string, string>) {
    // Implement user identification
  }

  async trackPageView(url: string) {
    // Implement page view tracking
  }

  async trackEvent(eventName: string, eventProperties?: Record<string, string | string[]>) {
    // Implement event tracking
  }
}
```

### Register your custom provider

Update your analytics configuration file to include your custom provider:

```typescript title="packages/analytics/src/index.ts" {6, 8}
import { createAnalyticsManager } from './analytics-manager';
import { MyCustomAnalyticsService } from './my-custom-analytics-service';
import type { AnalyticsManager } from './types';

export const analytics: AnalyticsManager = createAnalyticsManager({
  providers: {
    myCustom: (config) => new MyCustomAnalyticsService(config),
    null: () => NullAnalyticsService,
  },
});
```

## Using the Custom Analytics Provider

Once you've created and registered your custom analytics provider, you can use it in your application as you would with any other analytics provider:

All the registered providers will dispatch the same events, so you can use them interchangeably:

```typescript
const analytics = createAnalyticsManager({
  providers: {
    googleAnalytics: (config) => new GoogleAnalyticsService(config),
    mixpanel: (config) => new MixpanelService(config),
    myCustom: (config) => new MyCustomAnalyticsService(config),
    null: () => NullAnalyticsService,
  },
});
```

That's it! You've successfully created a custom analytics provider in Makerkit. You can now integrate with any analytics service of your choice.

## Using the Custom Analytics Provider

Once you've created and registered your custom analytics provider, you can use it in your application as you would with any other analytics provider:

```typescript
import { analytics } from '@kit/analytics';

void analytics.identify('user123', { name: 'John Doe' });
void analytics.trackEvent('Button Clicked', { buttonName: 'Submit' });
```

That's it! You've successfully created a custom analytics provider in Makerkit. You can now integrate with any analytics service of your choice.
---
title: 'Using the Google Analytics Provider in Next.js Supabase Turbo'
label: 'Google Analytics'
description: 'Learn how to use the Google Analytics provider in Next.js Supabase Turbo'
position: 2
---

The [Google Analytics](https://marketingplatform.google.com/about/analytics/) provider in Next.js Supabase Turbo is a simple way to integrate Google Analytics into your Next.js application using the Makerkit's Analytics package.

## Installation

First, you need to pull the `@kit/analytics` package into your project using the CLI

```bash
npx @makerkit/cli@latest plugins install
```

When prompted, select the `Google Analytics` package from the list of available packages. Once the command completes, you should see the `packages/plugins/google-analytics` directory in your project.

You can now import this package into your project:

```bash
pnpm add "@kit/google-analytics@workspace:*" --filter "@kit/analytics" -D
```

You can now use the Google Analytics plugin in the Analytics package. Update the `packages/analytics/src/index.ts` file as follows:

```tsx title="packages/analytics/src/index.ts"
import { createGoogleAnalyticsService } from '@kit/google-analytics';

import { createAnalyticsManager } from './analytics-manager';
import type { AnalyticsManager } from './types';

export const analytics: AnalyticsManager = createAnalyticsManager({
    providers: {
        'google-analytics': createGoogleAnalyticsService,
    },
});
```

## Configuration

Please add the following environment variables to your `.env` file:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-measurement-id
```

This is the Measurement ID of your Google Analytics property. You can find it in the Google Analytics dashboard.

Additionally, you can add the following environment variable to your `.env` file:

```bash
NEXT_PUBLIC_GA_DISABLE_PAGE_VIEWS_TRACKING=true
NEXT_PUBLIC_GA_DISABLE_LOCALHOST_TRACKING=true
```

---
title: 'Using the PostHog Analytics Provider in Next.js Supabase Turbo'
label: 'PostHog'
description: 'Learn how to use the PostHog Analytics provider in Next.js Supabase Turbo'
position: 3
---

The [Posthog](https://posthog.com) provider in Next.js Supabase Turbo is a simple way to integrate PostHog Analytics into your Next.js application using the Makerkit's Analytics package.

## Installation

First, you need to pull the `@kit/analytics` package into your project using the CLI

```bash
npx @makerkit/cli@latest plugins install
```

When prompted, select the `PostHog` package from the list of available packages. Once the command completes, you should see the `packages/plugins/posthog` directory in your project.

You can now import this package into your project:

```bash
pnpm add "@kit/posthog@workspace:*" --filter "@kit/analytics" -D
```

You can now use the Google Analytics plugin in the Analytics package. Update the `packages/analytics/src/index.ts` file as follows:

```tsx title="packages/analytics/src/index.ts"
import { createPostHogAnalyticsService } from '@kit/posthog';

import { createAnalyticsManager } from './analytics-manager';
import type { AnalyticsManager } from './types';

export const analytics: AnalyticsManager = createAnalyticsManager({
  providers: {
    posthog: createPostHogAnalyticsService,
  },
});
```

## Configuration

Please add the following environment variables to your `.env` file:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your-project-key
NEXT_PUBLIC_POSTHOG_HOST=your-host
NEXT_PUBLIC_POSTHOG_INGESTION_URL=your-ingestion-url
```

### Ingestion Rewrites

In your apps/web/next.config.mjs file, add the following config:

```js title="apps/web/next.config.mjs"
/** @type {import('next').NextConfig} */
const config = {
  // ...other config
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async rewrites() {
    // NOTE: change `eu` to `us` if applicable
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*'
      }
    ];
  }
}
```

### CSRF Exclusion

In your `apps/web/middleware.ts` file, exclude the PostHog ingestion URL from CSRF protection:

```ts title="apps/web/middleware.ts"
export const config = {
  matcher: ['/((?!_next/static|_next/image|images|locales|assets|ingest/*|api/*).*)'],
};
```
---
title: 'Using the Umami Analytics Provider in Next.js Supabase Turbo'
label: 'Umami'
description: 'Learn how to use the Umami Analytics provider in Next.js Supabase Turbo'
position: 4
---

The [Umami](https://umami.is/) analytics provider in Next.js Supabase Turbo is a simple way to integrate Umami Analytics into your Next.js application using the Makerkit's Analytics package.

## Installation

First, you need to pull the `@kit/analytics` package into your project using the CLI

```bash
npx @makerkit/cli@latest plugins install
```

When prompted, select the `Umami` package from the list of available packages. Once the command completes, you should see the `packages/plugins/umami` directory in your project.

You can now import this package into your project:

```bash
pnpm add "@kit/umami@workspace:*" --filter "@kit/analytics" -D
```

You can now use the Google Analytics plugin in the Analytics package. Update the `packages/analytics/src/index.ts` file as follows:

```tsx title="packages/analytics/src/index.ts"
import { createUmamiAnalyticsService } from '@kit/umami';

import { createAnalyticsManager } from './analytics-manager';
import type { AnalyticsManager } from './types';

export const analytics: AnalyticsManager = createAnalyticsManager({
    providers: {
        umami: createUmamiAnalyticsService,
    },
});
```

## Configuration

Please add the following environment variables to your `.env` file:

```bash
NEXT_PUBLIC_UMAMI_HOST=your-umami-host
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-website-id
```

The `NEXT_PUBLIC_UMAMI_HOST` is the URL of your Umami instance's script. Since Umami can be self-hosted, this can be any valid URL - or can be Umami's cloud service. For example, `https://umami.is/umami.js`. Please replace with the correct path to your Umami instance's JS script.

The `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is the ID of your website in your Umami instance. This is a required field to track events in your website.

NB: by default, Umami doesn't track events on localhost. You can use the `NEXT_PUBLIC_UMAMI_DISABLE_LOCALHOST_TRACKING` environment variable to enable tracking on localhost.

```
NEXT_PUBLIC_UMAMI_DISABLE_LOCALHOST_TRACKING=false
```

This is useful for testing your analytics setup locally.

---
label: "Account API"
position: 0
title: "Account API"
description: "A quick introduction to the Account API in Makerkit"
---

You can use the Account API for retrieving information about the personal user account.

## Using the Account API

To use the Account API, you need to import the `createAccountsApi` function from `@kit/account/api`. We need to pass a valid `SupabaseClient` to the function - so we can interact with the database from the server.

```tsx
import { createAccountsApi } from '@kit/accounts/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function ServerComponent() {
  const client = getSupabaseServerClient();
  const api = createAccountsApi(client);

  // use api
}
```

If you're in a Server Action context, you'd use:

```tsx
'use server';

import { createAccountsApi } from '@kit/accounts/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function myServerAction() {
  const client = getSupabaseServerClient();
  const api = createAccountsApi(client);
  
  // use api
}
```

## Methods

The Account API provides the following methods:

### Get the account workspace data

Get the account workspace data using the `getAccountWorkspace` method. This method returns the workspace data for the user account.

```tsx
const api = createAccountsApi(client);
const workspace = await api.getAccountWorkspace();
```

This is already called in the user account layout, so it's very unlikely you'll need to call this method.

### Load the user accounts

Load the user accounts using the `loadUserAccounts` method.

This method returns an array of user accounts. Each account has a `label`, `value`, and `image` property.

```tsx
const api = createAccountsApi(client);
const accounts = await api.loadUserAccounts();
```

### Get the subscription data

Get the subscription data for the given user using the `getSubscription` method.

This method returns the subscription data for the given user account.

```tsx
const api = createAccountsApi(client);
const subscription = await api.getSubscription(accountId);
```

Returns the table `subscriptions` and `subscription_items`.

### Get the billing customer ID

Get the billing customer ID for the given user using the `getCustomerId` method.

This method returns the billing customer ID for the given user account.

```tsx
const api = createAccountsApi(client);
const customerId = await api.getCustomerId(accountId);
```
---
label: "Account Workspace API"
position: 4
title: "Account Workspace API"
description: "The account workspace API allows you to retrieve all the data related to the current account."
---

When within the layout `/home/[account]` - you have access to data fetched from the account workspace API.

The data in this layout has most of the information you need around the currently selected account and the user.

## Accessing the Team Account Workspace Data in Server Components

To access the data, you can use the `loadTeamWorkspace` loader function. This function is cached per-request, so you can call it multiple times without worrying about performance.

While multiple calls to this function are deduped within a single request, bear in mind that this request will be called when navigating to the page. If you only require a small subset of data, it would be best to make more granular requests.

```tsx
import { loadTeamWorkspace } from '~/home/[account]/_lib/server/team-account-workspace.loader';

export default async function SomeAccountPage() {
  const data = await loadTeamWorkspace();

  // use data
}
```

The data returned from the `loadTeamWorkspace` function is an object with the following properties:

- `account`: The account object
- `user`: The user object coming from Supabase Auth
- `accounts`: An array of all accounts the user is a member of

Here is an example of the data structure:

```tsx
import type { User } from '@supabase/supabase-js';

{
  account: {
    id: string;
    name: string;
    picture_url: string;
    slug: string;
    role: string;
    role_hierarchy_level: number;
    primary_owner_user_id: string;
    subscription_status: string;
    permissions: string[];
  };

  user: User;

  accounts: Array<{
   id: string | null;
    name: string | null;
    picture_url: string | null;
    role: string | null;
    slug: string | null;
  }>;
}
```

The `account` object contains the following properties:
1. `id`: The account ID
2. `name`: The account name
3. `picture_url`: The account picture URL
4. `slug`: The account slug
5. `role`: The user's role in the account
6. `role_hierarchy_level`: The user's role hierarchy level
7. `primary_owner_user_id`: The primary owner user ID
8. `subscription_status`: The subscription status of the account. This can be 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused'.
9. `permissions`: An array of permissions the user has in the account

## Accessing the Account Workspace Data in Client Components

The data fetched from the account workspace API is available in the context. You can access this data using the `useAccountWorkspace` hook.

```tsx
'use client';

import { useTeamAccountWorkspace } from '@kit/team-accounts/hooks/use-team-account-workspace';

export default function SomeComponent() {
  const { account, user, accounts } = useTeamAccountWorkspace();

  // use account, user, and accounts
}
```

The `useTeamAccountWorkspace` hook returns the same data structure as the `loadTeamWorkspace` function.

NB: the hooks **is not to be used** is Server Components, only in Client Components. Additionally, this is only available in the pages under `/home/[account]` layout.
---
label: "Authentication API"
position: 2
title: "Authentication API"
description: "A quick introduction to the Authentication API in Makerkit"
---

To check if users are authed, or to retrieve information about the currently signed-in user, use the `requireUser` function:

```tsx
import { redirect } from 'next/navigation';
import { requireUser } from '@kit/supabase/require-user';

import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function ServerComponent() {
  const client = getSupabaseServerClient();
  const auth = await requireUser(client);

  // check if the user needs redirect
  if (auth.error) {
    redirect(auth.redirectTo);
  }

  // user is authed!
  const user = auth.data;
}
```

NB: use the correct Supabase client based on the context. In this case, we use the server component client.

```tsx
'use server';

import { redirect } from 'next/navigation';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function myServerAction() {
  const client = getSupabaseServerClient();
  const auth = await requireUser(client);

  // check if the user needs redirect
  if (auth.error) {
    redirect(auth.redirectTo);
  }

  // user is authed!
  const user = auth.data;
}
```

If the user needs MFA and is not yet verified, the `redirect` function will redirect the user to the MFA verification page. This is why it is important to check the `redirectTo` property in the response.

---
label: "Team Account API"
position: 1
title: "Team Account API"
description: "A quick introduction to the Team Account API in Makerkit"
---

You can use the Team Account API for retrieving information about the team account.

## Using the Team Account API

To use the Team Account API, you need to import the `createTeamAccountsApi` function from `@kit/team-account/api`.

We need to pass a valid `SupabaseClient` to the function - so we can interact with the database from the server.

```tsx
import { createTeamAccountsApi } from '@kit/team-accounts/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

async function ServerComponent() {
  const client = getSupabaseServerClient();
  const api = createTeamAccountsApi(client);

  // use api
}
```

If you're in a Server Action context, you'd use:

```tsx
'use server';

import { createTeamAccountsApi } from '@kit/team-accounts/api';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function myServerAction() {
  const client = getSupabaseServerClient();
  const api = createTeamAccountsApi(client);

  // use api
}
```

## Methods

The Account API provides the following methods:

### Get the team account by ID

Retrieves the team account by ID using the `getTeamAccountById` method.

You can also use this method to check if the user is already in the account.

```tsx
const api = createTeamAccountsApi(client);
const account = await api.getTeamAccountById('account-id');
```

### Get the team account subscription

Get the subscription data for the account using the `getSubscription` method.

```tsx
const api = createTeamAccountsApi(client);
const subscription = await api.getSubscription('account-id');
```

### Get the team account order

Get the orders data for the given account using the `getOrder` method.

```tsx
const api = createTeamAccountsApi(client);
const order = await api.getOrder('account-id');
```

### Get the account workspace data

Get the account workspace data.

```tsx
const api = createTeamAccountsApi(client);
const workspace = await api.getAccountWorkspace('account-slug');
```

This method is already called in the account layout and is unlikely to be used in other contexts. This is used to hydrate the workspace data in the context.

Since it's already loaded, you can use the data from the context.

### Checking a user's permission within an account

Check if the user has permission to perform a specific action within the account using the `hasPermission` method.

```tsx
const api = createTeamAccountsApi(client);

const hasPermission = await api.hasPermission({
  accountId: 'account-id',
  userId: 'user-id',
  permission: 'billing.manage',
});
```

### Getting the members count in the account

Get the number of members in the account using the `getMembersCount` method.

```tsx
const api = createTeamAccountsApi(client);
const membersCount = await api.getMembersCount('account-id');
```

### Get the billing customer ID

Get the billing customer ID for the given account using the `getCustomerId` method.

```tsx
const api = createTeamAccountsApi(client);
const customerId = await api.getCustomerId('account-id');
```

### Retrieve an invitation

Get the invitation data from the invite token.

```tsx
const api = createTeamAccountsApi(client);
const invitation = await api.getInvitation(adminClient, 'invite-token');
```

This method is used to get the invitation data from the invite token. It's used when the user is not yet part of the account and needs to be invited. The `adminClient` is used to read the pending membership. The method returns the invitation data if it exists, otherwise `null`.

---
label: "User Workspace API"
position: 3
title: "User Workspace API"
description: "The user workspace API allows you to retrieve all the data related to the current user."
---

When within the layout `/home/(user)` - you have access to data fetched from the user workspace API.

The data in this layout has most of the information you need around the currently selected account and the user.

To access the data, you can use the `loadUserWorkspace` loader function. This function is cached per-request, so you can call it multiple times without worrying about performance.

While multiple calls to this function are deduped within a single request, bear in mind that this request will be called when navigating to the page. If you only require a small subset of data, it would be best to make more granular requests.

```tsx
import { loadUserWorkspace } from '~/home/_lib/server/load-user-workspace';

export default async function SomeUserPage() {
  const data = await loadUserWorkspace();

  // use data
}
```

The data returned from the `loadUserWorkspace` function is an object with the following properties:

- `user`: The user object coming from Supabase Auth
- `account`: The account object of the user
- `accounts`: An array of all accounts the user is a member of

Here is an example of the data structure:

```tsx
import type { User } from '@supabase/supabase-js';

{
  account: {
    id: string | null;
    name: string | null;
    picture_url: string | null;
    public_data: Json | null;
    subscription_status: string | null;
  };

  user: User;

  accounts: Array<{
   id: string | null;
    name: string | null;
    picture_url: string | null;
    role: string | null;
    slug: string | null;
  }>;
}
```

The `account` object contains the following properties:
- `id`: The account ID
- `name`: The account name
- `picture_url`: The account picture URL
- `public_data`: The account public data
- `subscription_status`: The subscription status of the account. This can be 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused'.


## Accessing the User Workspace Data in Client Components

The data fetched from the user workspace API is available in the context. You can access this data using the `useUserWorkspace` hook.

```tsx
'use client';

import { useUserWorkspace } from '@kit/accounts/hooks/use-user-workspace';

export default function SomeComponent() {
  const { account, user, accounts } = useUserWorkspace();

  // use account, user, and accounts
}
```

The `useUserWorkspace` hook returns the same data structure as the `loadUserWorkspace` function.

NB: the hooks **is not to be used** is Server Components, only in Client Components. Additionally, this is only available in the pages under `/home/(user)` layout.

---
label: "Billing API"
title: "The Billing service API allows you to communicate with the billing service in Makerkit"
position: 10
description: "Learn how to use the Billing service API in Makerkit to manage billing for your preferred payment gateway"
---

The Billing service API allows you to communicate with the billing service in Makerkit. You can use the API to manage billing for your preferred payment gateway.

To instantiate the billing service, you need to import the `createBillingGatewayService` function from the `@kit/billing-gateway` package. You can then use this service to manage subscriptions, one-off payments, and more.

```tsx
import { createBillingGatewayService } from '@kit/billing-gateway';

const service = createBillingGatewayService('stripe');
```

Of course - it's best to get the billing provider from the `subscriptions` record. This way, you can switch between providers without changing the code.

The `createBillingGatewayService` instantiates a class that provides a set of methods for managing billing operations. The provider is determined by the `BillingProviderSchema` passed to the constructor. The `BillingGatewayService` class is a TypeScript class that provides a set of methods for managing billing operations. It uses the Strategy design pattern to delegate the actual implementation of these operations to a provider-specific strategy. The provider is determined by the BillingProviderSchema passed to the constructor.

The class provides methods for creating and retrieving checkout sessions, creating a billing portal session, cancelling a subscription, reporting and querying usage, and updating a subscription. Each of these methods accepts a parameter object that is validated and parsed using the corresponding Zod schema.

## Methods

### Creating a checkout session

The `createCheckoutSession` method creates a checkout session for billing. It takes an object of type CreateBillingCheckoutSchema as a parameter, which contains the necessary information for creating a checkout session.

Below is the Zod schema accepted by the `createCheckoutSession` method:

```tsx
returnUrl: z.string().url(),
accountId: z.string().uuid(),
plan: PlanSchema,
customerId: z.string().optional(),
customerEmail: z.string().email().optional(),
enableDiscountField: z.boolean().optional(),
variantQuantities: z.array(
  z.object({
    variantId: z.string().min(1),
    quantity: z.number(),
  }),
)
```

### Retrieving a checkout session

The `retrieveCheckoutSession` method retrieves the checkout session from the specified provider. It takes an object of type RetrieveCheckoutSessionSchema as a parameter, which contains the necessary information to retrieve the checkout session.

The method accepts the following Zod schema:

```tsx
sessionId: z.string(),
```

### Creating a billing portal session

The `createBillingPortalSession` method creates a billing portal session. It takes an object of type CreateBillingPortalSessionSchema as a parameter, which contains the necessary information to create a billing portal session.

```tsx
returnUrl: z.string().url(),
customerId: z.string().min(1),
```

### Cancelling a subscription

The `cancelSubscription` method cancels a subscription. It takes an object of type CancelSubscriptionParamsSchema as a parameter, which contains the necessary information to cancel a subscription.

The method accepts the Zod schema:

```tsx
subscriptionId: z.string(),
invoiceNow: z.boolean().optional(),
```

### Reporting metered usage

The `reportUsage` method reports the usage of the billing to the provider. It takes an object of type ReportBillingUsageSchema as a parameter, which contains the necessary information to report the usage.

The method accepts the following Zod schema:

```tsx
id: z.string({
  description:
    'The id of the usage record. For Stripe a customer ID, for LS a subscription item ID.',
}),
eventName: z
  .string({
    description: 'The name of the event that triggered the usage',
  })
  .optional(),
usage: z.object({
  quantity: z.number(),
  action: z.enum(['increment', 'set']).optional(),
}),
```

### Querying metered usage

The `queryUsage` method queries the usage of the metered billing. It takes an object of type QueryBillingUsageSchema as a parameter, which contains the necessary information to query the usage.

To query usage, please provide the following Zod schema:

```tsx

const TimeFilter = z.object(
  {
    startTime: z.number(),
    endTime: z.number(),
  },
  {
    description: `The time range to filter the usage records. Used for Stripe`,
  },
);

const PageFilter = z.object(
  {
    page: z.number(),
    size: z.number(),
  },
  {
    description: `The page and size to filter the usage records. Used for LS`,
  },
);

export const QueryBillingUsageSchema = z.object({
  id: z.string({
    description:
      'The id of the usage record. For Stripe a meter ID, for LS a subscription item ID.',
  }),
  customerId: z.string({
    description: 'The id of the customer in the billing system',
  }),
  filter: z.union([TimeFilter, PageFilter]),
});

```

### Updating a subscription

The `updateSubscriptionItem` method updates a subscription with the specified parameters. It takes an object of type UpdateSubscriptionParamsSchema as a parameter, which contains the necessary information to update a subscription.

The method acceps the following Zod schema:

```tsx
subscriptionId: z.string().min(1),
subscriptionItemId: z.string().min(1),
quantity: z.number().min(1),
```
---
label: "Billing Schema"
title: "Writing the billing schema in the Next.js Supabase Kit"
position: 1
description: "Learn how to configure the plans in your Makerkit application"
---

The billing schema replicates your billing provider's schema, so that:

1. we can display the data in the UI (pricing table, billing section, etc.)
2. create the correct checkout session
3. make some features work correctly - such as per-seat billing

The billing schema is common to all billing providers. Some billing providers have some differences in what you can or cannot do. In these cases, the schema will try to validate and enforce the rules - but it's up to you to make sure the data is correct.

The schema is based on three main entities:

1. **Products**: The main product you are selling (e.g., "Pro Plan", "Starter Plan", etc.)
2. **Plans**: The pricing plan for the product (e.g., "Monthly", "Yearly", etc.)
3. **Line Items**: The line items for the plan (e.g., "flat subscription", "metered usage", "per seat", etc.)

#### Getting the schema right is important

Getting the IDs of your plans is extremely important - as these are used to:
1. create the correct checkout
2. populate the data in the DB

Please take it easy while you configure this, do one step at a time, and test it thoroughly.

#### Setting the Billing Provider

The billing provider is already set as `process.env.NEXT_PUBLIC_BILLING_PROVIDER` and defaults to `stripe`.

For clarity - this is set in the `apps/web/config/billing.config.ts` file:

```tsx
export default createBillingSchema({
  // also update config.billing_provider in the DB to match the selected
  provider,
  // products configuration
  products: []
});
```

We will now add the products to the configuration.

#### Products

Products are the main product you are selling. They are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [],
    }
  ]
});
```

Let's break down the fields:

1. **id**: The unique identifier for the product. **This is chosen by you, it doesn't need to be the same one as the one in the provider**.
2. **name**: The name of the product
3. **description**: The description of the product
4. **currency**: The currency of the product
5. **badge**: A badge to display on the product (e.g., "Value", "Popular", etc.)

The majority of these fields are going to populate the pricing table in the UI.

#### Plans

Plans are the pricing plans for the product. They are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **name**: The name of the plan
- **id**: The unique identifier for the plan. **This is chosen by you, it doesn't need to be the same one as the one in the provider**.
- **trialDays**: The number of days for the trial period
- **paymentType**: The payment type (e.g., `recurring`, `one-time`)
- **interval**: The interval of the payment (e.g., `month`, `year`)
- **lineItems**: The line items for the plan

Now, we will be looking at the line items. The line items are the items that make up the plan, and can be of different types:
1. **Flat Subscription**: A flat subscription (e.g., $10/month) - specified as `flat`
2. **Metered Billing**: Metered billing (e.g., $0.10 per 1,000 requests) - specified as `metered`
3. **Per-Seat Billing**: Per-seat billing (e.g., $10 per seat) - specified as `per-seat`

You can add one or more line items to the plan when using Stripe. When using Lemon Squeezy, you can only add one line item - but you can decorate it with the necessary metadata to achieve a similar result.

#### Flat Subscriptions

Flat subscriptions are defined by the following fields:

```tsx

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `flat`.

The cost is set for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the cost is correctly set in the billing provider**.

#### Metered Billing

Metered billing is defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'metered',
              unit: 'GBs',
              tiers: [
                {
                    upTo: 10,
                    cost: 0.1,
                },
                {
                    upTo: 100,
                    cost: 0.05,
                },
                {
                    upTo: 'unlimited',
                    cost: 0.01,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item. This can be set to `0` as the cost is calculated based on the tiers.
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `metered`.
- **unit**: The unit of the line item (e.g., `GBs`, `requests`, etc.). You can use a translation key here.
- **tiers**: The tiers of the line item. Each tier is defined by the following fields:
  - **upTo**: The upper limit of the tier. If the usage is below this limit, the cost is calculated based on this tier.
  - **cost**: The cost of the tier. This is the cost per unit.
  
The tiers data is used exclusively for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the tiers are correctly set in the billing provider**.

#### Per-Seat Billing

Per-seat billing is defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'per_seat',
              tiers: [
                {
                    upTo: 3,
                    cost: 0,
                },
                {
                    upTo: 5,
                    cost: 7.99,
                },
                {
                    upTo: 'unlimited',
                    cost: 5.99,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item. This can be set to `0` as the cost is calculated based on the tiers.
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `per-seat`.
- **tiers**: The tiers of the line item. Each tier is defined by the following fields:
  - **upTo**: The upper limit of the tier. If the usage is below this limit, the cost is calculated based on this tier.
  - **cost**: The cost of the tier. This is the cost per unit.

If you set the first tier to `0`, it basically means that the first `n` seats are free. This is a common practice in per-seat billing.

Please remember that the cost is set for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the cost is correctly set in the billing provider**.

#### One-Off Payments

One-off payments are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          paymentType: 'one-time',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **name**: The name of the plan
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **paymentType**: The payment type (e.g., `recurring`, `one-time`). In this case, it's `one-time`.
- **lineItems**: The line items for the plan
  - **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
  - **name**: The name of the line item
  - **cost**: The cost of the line item
  - **type**: The type of the line item (e.g., `flat`). It can only be `flat` for one-off payments.

### Adding more Products, Plans, and Line Items

Simply add more products, plans, and line items to the arrays. The UI **should** be able to handle it in most traditional cases. If you have a more complex billing schema, you may need to adjust the UI accordingly.

## Custom Plans

Sometimes - you want to display a plan in the pricing table - but not actually have it in the billing provider. This is common for custom plans, free plans that don't require the billing provider subscription, or plans that are not yet available.

To do so, let's add the `custom` flag to the plan:

```tsx
{
  name: 'Enterprise Monthly',
  id: 'enterprise-monthly',
  paymentType: 'recurring',
  label: 'common:contactUs',
  href: '/contact',
  custom: true,
  interval: 'month',
  lineItems: [],
}
```

Here's the full example:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Enterprise',
          id: 'enterprise',
          paymentType: 'recurring',
          label: 'common:contactUs',
          href: '/contact',
          custom: true,
          interval: 'month',
          lineItems: [],
        }
      ],
    }
  ]
});
```

As you can see, the plan is now a custom plan. The UI will display the plan in the pricing table, but it won't be available for purchase.

We do this by adding the following fields:

- **custom**: A flag to indicate that the plan is custom. This will prevent the plan from being available for purchase.
- **label**: The translation key for the label. This is used to display the label in the pricing table.
- **href**: The link to the page where the user can contact you. This is used in the pricing table.
- **lineItems**: The line items for the plan. This is empty as there are no line items for the plan. It must be an empty array.

### Custom Button Label
You can also provide a custom button label for the plan. This is done by adding the `buttonLabel` field:

```tsx
{
  name: 'Enterprise',
  id: 'enterprise',
  paymentType: 'recurring',
  label: 'common:contactUs',
  href: '/contact',
  custom: true,
  interval: 'month',
  lineItems: [],
  buttonLabel: 'common:contactUs',
}
```

As usual, strings can either be a translation key or a string. If it's a translation key, it will be translated using the `i18n` library.
---
label: "Handling Webhooks"
title: "Learn how to handle billing webhooks with your custom code in Makerkit"
position: 9
description: "Learn how to handle billing webhooks with your custom code in Makerkit"
---

Makerkit takes care of handling billing webhooks to update the Database based on the events received from Stripe.

Sometimes - you will need to set more webhooks, or do something custom with the webhooks.

In these cases, you can customize the billing webhook handler in Makerkit at `api/billing/webhooks/route.ts`.

By default, the webhook handler is set to `service.handleWebhookEvent(request)`:

```tsx
await service.handleWebhookEvent(request);
```

However, you can extend it using the callbacks provided by the `BillingService`:

```tsx
await service.handleWebhookEvent(request, {
  onPaymentFailed: async (sessionId) => {},
  onPaymentSucceeded: async (sessionId) => {},
  onCheckoutSessionCompleted: async (subscription, customerId) => {},
  onSubscriptionUpdated: async (subscription) => {},
  onSubscriptionDeleted: async (subscriptionId) => {},
});
```

You can provide one or more of the callbacks to handle the events you are interested in.

If the event is not in one of these methods, you can handle it in the `onEvent` method:

```tsx
await service.handleWebhookEvent(request, {
  async onEvent(data: unknown) {
    logger.info(
      `Received billing event`,
    );

    // Your custom code here
  }
});
```

However, you need to set the correct interface for the `data` parameter to handle the event correctly.

For example, to handle the `invoice.payment_succeeded` event, you can use the `onEvent` method:

```tsx
await service.handleWebhookEvent(request, {
  async onEvent(data: unknown) {
    if (data.type === 'invoice.payment_succeeded') {
      const invoice = data as Stripe.Invoice;
      // Your custom code here
    }
  }
});
```

You can find the list of events and their data in the [Stripe documentation](https://stripe.com/docs/api/events/types).

---
label: "How Billing works"
title: "How Billing works in the Next.js Supabase SaaS kit"
description: "A quick introduction to billing in Makerkit and how to set it up in the Next.js Supabase SaaS kit"
position: 0
---


The billing package is used to manage subscriptions, one-off payments, and more.

The billing package is abstracted from the billing gateway package, which is used to manage the payment gateway (e.g., Stripe, Lemon Squeezy, etc.).

To set up the billing package, you need to set the following environment variables:

```bash
NEXT_PUBLIC_BILLING_PROVIDER=stripe # or lemon-squeezy
```

## Billing in Makerkit

Makerkit implements two packages for managing billing:

1. `core`: this package is responsible for exporting the billing service and the schema getFontDefinitionFromNetwork
2. `gateway`: the gateway is a router that handles the billing service and the billing provider (e.g., Stripe, Lemon Squeezy, etc.)

Then, we define a package for each provider:

1. `stripe`: this package is responsible for handling the Stripe API
2. `lemon-squeezy`: this package is responsible for handling the Lemon Squeezy API
3. `paddle`: this package is responsible for handling the Paddle API (Coming soon)

To summarize:

1. core defines the service and the schema
2. the provider's packages define the API calls based on the provider's API
3. the gateway package is responsible for routing the requests to the correct provider

Whatever provider you choose, you need to set the environment variable `NEXT_PUBLIC_BILLING_PROVIDER` to the provider you want to use. The Gateway Service will then route the requests to the correct provider. This means you can switch between providers without changing the code. The schema is the same for all providers - but the details of the API calls are different - so some details apply.

## Subscriptions vs. One-off payments

Makerkit supports both one-off payments and subscriptions. You have the choice to use one or both. What Makerkit cannot assume with certainty is the billing mode you want to use. By default, we assume you want to use subscriptions, as this is the most common billing mode for SaaS applications.

This means that - by default - Makerkit will be looking for a subscription plan when visiting the billing section of the personal or team account. This means we fetch data from the tables `subscriptions` and `subscription_items`.

If you want to use one-off payments, you need to set the billing mode to `one-time`:

```bash
BILLING_MODE=one-time
```

By doing so, Makerkit will be looking for one-off payments when visiting the billing section of the personal or team account. This means we fetch data from the tables `orders` and `order_items`.

### But - I want to use both

Perfect - you can, but you need to customize the pages to display the correct data.

---

Depending on the service you use, you will need to set the environment variables accordingly. By default - the billing package uses Stripe. Alternatively, you can use Lemon Squeezy. In the future, we will also add Paddle.
---
label: 'Credits Based Billing'
title: 'How to configure per seat billing in Makerkit'
position: 7
description: 'Learn how to configure credit based usage in your Next.js Supabase application'
---

Credit-based billing is a billing model where you charge your users based on the number of credits they consume. This model is useful when you want to charge your users based on the number of actions they perform in your application.

As you may know, this is extremely popular for AI SaaS products, where users may have a limited amount of tokens (or credits) to perform actions - such as requesting data from an LLM.

Makerkit doesn't have a built-in credit-based billing system, but you can easily implement it using the existing billing system.

To do so, we can introduce two new tables to our database: `plans` and `credits`. The `plans` table will store the pricing information for each plan, and the `credits` table will store the credits consumed by each user.

Here's how you can set it up:

### Step 1: Create the `plans` table

First we need to create a `plans` table to store the pricing information for each plan.

```sql
create table public.plans (
  id serial primary key,
  name text not null,
  variant_id text not null
);

alter table public.plans enable row level security;

-- allow authenticated users to read plans
create policy read_plans
  on public.plans
  for select
  to authenticated
  using (true);
```

We've created a `plans` table with two columns: `name` and `variant_id`. The `name` column stores the name of the plan, and the `variant_id` column stores the ID of the plan variant.

We also enabled row-level security on the `plans` table and created a policy that allows authenticated users to read the plans.

### Step 2: Create the `credits` table

Next, we need to create a `credits` table to store the credits consumed by each user.

```sql
create table public.credits (
  account_id uuid not null references public.accounts(id),
  tokens integer not null
);

alter table public.credits enable row level security;

-- allow authenticated users to read their credits
create policy read_credits
  on public.credits
  for select
  to authenticated
  using (
    account_id = (select auth.uid())
  );
```

In the above SQL, we create two tables: `plans` and `credits`. The `plans` table stores the pricing information for each plan, and the `credits` table stores the credits consumed by each user.

We also enabled row-level security on the `credits` table and created a policy that allows authenticated users to read their credits.

### Step 3: Functions to manage credits

Next, we need to create functions to manage the credits. We'll call these functions `has_credits` and `consume_credits`.

```sql
create or replace function public.has_credits(account_id uuid, tokens integer)
  returns boolean
  set search_path = ''
  as $$
  begin
    return (select tokens >= tokens from public.credits where account_id = account_id);
  end;
  $$ language plpgsql;

grant execute on function public.has_credits to authenticated, service_role;
```

The `has_credits` function checks if the user has enough credits to perform an action. It takes the `account_id` and the number of tokens required as arguments and returns `true` if the user has enough credits, `false` otherwise.

```sql
create or replace function public.consume_credits(account_id uuid, tokens integer)
  returns void
  set search_path = ''
  as $$
  begin
    update public.credits set tokens = tokens - tokens where account_id = account_id;
  end;
  $$ language plpgsql;

grant execute on function public.has_credits to service_role;
```

You can now use these functions in your RLS policies, or in your application code to manage credits.

NB: we only allow authenticated users to read their credits. To update the credits, we use the service role key, since we lock down the `credits` table to only allow authenticated users to read their credits.

### Step 4: Using credits in your application

Now that you have set up the `plans` and `credits` tables, you can use them in your application to manage credits.

For example, when a user performs an action that consumes credits, you can call the `consume_credits` function to deduct the credits from the user's account. You can use the Supabase client to call the function from your application code.

NB: the `callOpenAIApi` is a placeholder for your API call to OpenAI. You should replace it with your actual API call.

NB: we assume this is in a route handler, so we use the `getSupabaseRouteHandlerClient` client. If you're in a server action, you should use the `getSupabaseServerClient` client. [Learn more about the Supabase clients here](supabase-clients).

```tsx
export function async consumeApi(accountId: string) {
  // Call the OpenAI API to get the usage
  const { usage, data } = await callOpenAIApi();

  const client = getSupabaseRouteHandlerClient({
    admin: true,
  });

  await client.rpc('consume_credits', {
    account_id: accountId,
    tokens: usage,
  });

  return data;
}
```

You can also use the function `has_credits` as part of your RLS policy to restrict access to certain resources based on the user's credits.

```sql
create policy tasks_write_policy
  on public.tasks
  for select
  using (
    (select auth.uid()) === account_id and
    public.has_credits((select auth.uid()), 1)
  );
```

### Step 5: Recharge credits

You can use webhooks from your billing provider to recharge credits when a user makes a payment. To do so, listen to events and update the `credits` table accordingly.

In the example below, we extend the webook handler to listen to the `onInvoicePaid` event and update the `credits` table with the new credits.

1. First, update the existing webhook handler to listen to the `onInvoicePaid` event.
2. Then, update the `credits` table with the new credits.

```tsx title="apps/web/app/api/billing/webhook.ts"
import { getBillingEventHandlerService } from '@kit/billing-gateway';
import { enhanceRouteHandler } from '@kit/next/routes';
import { getLogger } from '@kit/shared/logger';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

import billingConfig from '~/config/billing.config';
import { Database } from '~/lib/database.types';

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export const POST = enhanceRouteHandler(
  async ({ request }) => {
    const provider = billingConfig.provider;
    const logger = await getLogger();

    const ctx = {
      name: 'billing.webhook',
      provider,
    };

    logger.info(ctx, `Received billing webhook. Processing...`);

    const supabaseClientProvider = () =>
      getSupabaseServerAdminClient();

    const service = await getBillingEventHandlerService(
      supabaseClientProvider,
      provider,
      billingConfig,
    );

    try {
      await service.handleWebhookEvent(request, {
        onInvoicePaid: async (data) => {
          const accountId = data.target_account_id;
          const lineItems = data.line_items;

          // we only expect one line item in the invoice
          // if you add more than one, you need to handle that here
          // by finding the correct line item to get the variant ID
          const variantId = lineItems[0]?.variant_id;

          if (!variantId) {
            logger.error(
              {
                accountId,
              },
              'Variant ID not found in line items',
            );

            throw new Error('Variant ID not found in invoice');
          }

          await updateMessagesCountQuota({
            variantId,
            accountId,
          });
        },
      });

      logger.info(ctx, `Successfully processed billing webhook`);

      return new Response('OK', { status: 200 });
    } catch (error) {
      logger.error({ ...ctx, error }, `Failed to process billing webhook`);

      return new Response('Failed to process billing webhook', {
        status: 500,
      });
    }
  },
  {
    auth: false,
  },
);

async function updateMessagesCountQuota(params: {
  variantId: string;
  accountId: string;
}) {
  const client = getSupabaseRouteHandlerClient<Database>({ admin: true });

  // get the max messages for the price based on the price ID
  const plan = await client
    .from('plans')
    .select('tokens_quota')
    .eq('variant_id', params.variantId)
    .single();

  if (plan.error) {
    throw plan.error;
  }

  const { tokens_quota } = plan.data;

  // upsert the message count for the account
  // and set the period start and end dates (from the subscription)
  const response = await client
    .from('credits')
    .update({
      tokens_quota,
    })
    .eq('account_id', params.accountId);

  if (response.error) {
    throw response.error;
  }
}
```

We assume that we have a table named `plans` that stores the pricing information for each plan. We also assume that we have a table named `credits` that stores the credits consumed by each user.
The `credits` table has a column named `tokens_quota` that stores the number of credits available to the user.

In the `onInvoicePaid` event handler, we get the variant ID from the invoice line items and update the `credits` table with the new credits.
---
label: "Lemon Squeezy"
title: "Configuring Lemon Squeezy Billing"
position: 3
description: "Lemon Squeezy is a payment processor that allows you to charge your users for your SaaS product. It is a Merchant of Record, which means they handle all the billing and compliance for you."
---

For using Lemon Squeezy, we need to first set it as the default billing provider:

```bash
NEXT_PUBLIC_BILLING_PROVIDER=lemon-squeezy
```

Also, we need to switch the DB config to use Lemon Squeezy

```sql
update config set billing_provider = 'lemon-squeezy';
```

Then, you'll need to set the following environment variables:

```bash
LEMON_SQUEEZY_SECRET_KEY=
LEMON_SQUEEZY_SIGNING_SECRET=
LEMON_SQUEEZY_STORE_ID=
```

I am aware you know this, but never add these variables to the `.env` file. Instead, add them to the environment variables of your CI/CD system.

To test locally, you can add them to the `.env.local` file. This file is not committed to Git, therefore it is safe to store sensitive information in it.

### Schema Definition

Makerkit's billing configuration allows adding multiple line items into a single subscription: for example, you can mix flat fees, metered usage, and per-seat billing.

Lemon Squeezy **does not support multiple line items** like Stripe. The billing schema will fail validation if you do so, and you will need to adjust it.

However, with Lemon Squeezy, you can adjust various fields to fit your needs, albeit with very limited flexibility.

#### Metered Usage

Metered Usage can only be applied to the entire subscription, not to individual line items. For example, if you have a plan that charges $1 per 1000 requests, you can set the `tiers` property to charge $1 per 1000 requests.

However, you cannot have a plan that charges $1 per 1000 requests for one line item and $2 per 1000 requests for another line item. Or using a flat fee for one line item and metered usage for another.

#### Setup Fee + Metered Usage

Lemon Squeezy has support for the property `setupFee`: this property allows you to create a metered usage plan with a setup fee. That is, assuming you have a plan that charges a flat fee of $10 and then $1 per 1000 requests, you can set the `setupFee` to 10 and then set up the `tiers` to charge $1 per 1000 requests.

NB: the setup fee is only charged once, when the subscription is created.

### Testing locally

To receive webhooks from Lemon Squeezy, you need a proxy. You can create one for free with `ngrok` (or others). Once set up, create a webhook in Lemon Squeezy pointing to `{proxy-url}/api/billing/webhook` where `{proxy-url}` is a valid URL pointing to your local machine.

If your proxy is for example `https://myawesomeproxy.com` you will use `https://myawesomeproxy.com/api/billing/webhook` as the endpoint in Lemon Squeezy.

### Production

When going to production, you will set your exact application URL and scratch `{proxy-url}`. Don't forget, please.

Please set the following webhook events in Lemon Squeezy:

1. `order_created`
2. `subscription_created`
3. `subscription_updated`
4. `subscription_expired`

---
label: "Metered Usage"
title: "Configuring Metered Usage Billing"
position: 5
description: "Metered usage billing is a billing model where you charge your customers based on their usage of your product. This model is common in APIs, where you charge based on the number of requests made to your API."
---

Metered usage billing is a billing model where you charge your customers based on their usage of your product. This model is common in APIs, where you charge based on the number of requests made to your API.

As we have already seen in the schema definition section, we can define a metered usage plan in the billing schema. This plan will charge the customer based on the number of requests they make to your API.

### Providers Differences

NB: different providers (Stripe, Lemon Squeezy, etc.) have different ways of handling metered usage billing: we keep the API consistent across all providers - but the details of how you report usage to the billing provider may differ. Please read the provider's documentation to understand how to report usage to the billing provider.

### Defining a Metered Usage Plan

Let's assume we have the following schema:

```tsx

export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'metered',
              unit: 'GBs',
              tiers: [
                {
                    upTo: 10,
                    cost: 0.1,
                },
                {
                    upTo: 100,
                    cost: 0.05,
                },
                {
                    upTo: 'unlimited',
                    cost: 0.01,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

What happens here is that we create a checkout in Stripe that charges the customer based on the number of GBs they use. The first 10 GBs are free, the next 90 GBs are charged at $0.05 per GB, and anything above 100 GBs is charged at $0.01 per GB.

When the checkout succeeds, we store two records:

1. A `subscriptions` record that represents the subscription the customer has to the plan. This is the overall subscription record - and contains details like the customer's ID, the plan ID, the status of the subscription, etc.
2. A `subscription_items` record that represents the line item the customer is subscribed to. This is needed for reporting charges to the billing provider.

The billing service in Makerkit has a unified interface for interacting with your billing provider - whichever it may be. This means that you can switch from Stripe to Lemon Squeezy or any other billing provider without changing your code. As such - this is valid for all billing providers supported by Makerkit.

When we report a charge, we need three things:
1. the subscription ID (and billing provider it is associated with) or the Customer ID (Stripe)
2. the line item ID (Lemon Squeezy only)
3. the next quantity of the line item

The billing service will then calculate the charge based on the quantity and the cost of the line item and charge the user accordingly.

On our side, we need to identify what the user is being charged for. This is why we store the `subscription_items` record. This record contains the `subscription_id`, the `product_id`, the `variant_id` (price ID in Stripe) and the `line_item_id` - which we can use to identify what the user is being charged for. You can query the items using these details to retrieve the ID of the line item the user is being charged for.

We assume an account uses a function `consumeApi` to consume the API. This (hypothetical) function will be called every time the user makes a request to the API. We can then use this function to report the usage to the billing provider.

```tsx
export async function consumeApi(accountId: string): number {}
```

When the user makes a request to the API, we can call this function to report the usage to the billing provider.

```tsx
async function apiHandler(accountId: string) {
  try {
    // assume consumeApi returns the number of requests made
    const quantity = await consumeApi(accountId);

    await reportUsage(accountId, quantity);
  } catch (error) {
    console.error(error);
  }
}
```

### Reporting Usage in Stripe

Makerkit uses the newest [usage reporting API in Stripe](https://docs.stripe.com/billing/subscriptions/usage-based/implementation-guide). This API allows you to report usage for a subscription item. You can report usage for a subscription item by calling the `reportUsage` method on the billing service.

Unlike the previous version of the API, you don't need a subscription item ID, but the customer ID and the metric name you're reporting.

We assume you have created a metric in Stripe named `api_requests` that you use to report the usage.

```tsx
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createAccountsApi } from '@kit/accounts/api';

async function reportUsage(
  accountId: string,
  quantity: number
) {
  // use the correct client: in this case, the server action client
  const client = getSupabaseServerClient();
  const api = createAccountsApi(client);

  const subscription = await api.getSubscription(accountId);

  // if the subscription is not active, we don't report usage
  if (!subscription) {
    throw new Error('No active subscription found');
  }

  // get the billing provider
  const service = await getBillingGatewayProvider(this.client);
  const customerId = await api.getCustomerId(accountId);

  if (!customerId) {
    throw new Error(`No customer ID found for account ${accountId}`);
  }

  // now we can report the usage to the billing provider
  return service.reportUsage({
    id: customerId,
    eventName: 'api_requests',
    usage: {
      quantity,
    }
  });
}
```

As you can see, we use the following parameters to report usage:
1. `id`: the customer ID of the user/account in Stripe
2. `eventName`: the name of the metric you're reporting
3. `usage`: the quantity of the metric you're reporting

### Reporting Usage in Lemon Squeezy

In Lemon Squeezy, you need to report usage for a subscription item.

Given an account ID - we need to retrieve the subscription ID and the line item ID. We can then report the usage to the billing provider.

```tsx
import { getBillingGatewayProvider } from '@kit/billing-gateway';
import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { createAccountsApi } from '@kit/accounts/api';

async function reportUsage(
  accountId: string, 
  quantity: number
) {
  // use the correct client: in this case, the server action client
  const client = getSupabaseServerClient();
  const api = createAccountsApi(client);

  const subscription = await api.getSubscription(accountId);

  // if the subscription is not active, we don't report usage
  if (!subscription) {
    console.error('No active subscription found');
    return;
  }

  // now, we need to find the line item the user is being charged for
  // let's use Supabase for this!
  // we use the product ID to identify the line item
  // in your case, you have more choices to identify the line item
  const {
    data: subscriptionItem,
    error
  } = await client.from('subscription_items')
    .select('id')
    .eq('subscription_id', subscription.id)
    .eq('product_id', 'starter-pro')
    .eq('type', 'metered')
    .single();

  // get the billing provider
  const service = await getBillingGatewayProvider(this.client);

  // now we can report the usage to the billing provider
  return service.reportUsage({
    id: subscriptionItem.id,
    usage: {
      quantity,
      action: 'increment'
    }
  });
}
```
---
label: "One Off Payments"
title: "Configuring One Off Payments"
position: 8
description: "How to configure one-off payments in Makerkit for products that are not recurring in nature."
---

While not exactly a common SaaS billing mode, Makerkit offers support for one-off payments.

You can use the tables `orders` and `orders_items` to store single orders for products not recurring in nature. You can use this in two ways:

1. **Lifetime Access**: for products that are not recurring but offer lifetime access.
2. **Multiple one-off payments**: for products that are not recurring but can be purchased multiple times. For example, you have multiple add-ons that can be purchased separately.

Some of this will require custom code, but generally speaking, Makerkit does its best to support this use case in a broad sense. The specifics of your implementation will depend on your product and business model and may require additional customization.

## Schema Definition

One-off payments are defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          paymentType: 'one-time',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 9.99,
              type: 'flat',
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **name**: The name of the plan
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **paymentType**: The payment type (e.g., `recurring`, `one-time`). In this case, it's `one-time`.
- **lineItems**: The line items for the plan
  - **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
  - **name**: The name of the line item
  - **cost**: The cost of the line item
  - **type**: The type of the line item (e.g., `flat`). It can only be `flat` for one-off payments.

When a products gets purchased, Makerkit will create an order in the `orders` table and an order item in the `orders_items` table. You can use this data to fulfill the order and grant access to the product.

If you would like to switch from `subscriptions` to `orders` as your primary billing mechanism, you can do so by setting the following environment variable:

```bash
BILLING_MODE=one-time
```

When this flags in set to `one-time`, Makerkit's plan's page will be looking for a valid order in the `orders` table instead of a subscription in the `subscriptions` table. This means that the billing section will display one-off payments instead of subscriptions.

As mentioned - this is a best-effort implementation. You may need to customize the billing pages to fit your specific use case.
---
label: 'Paddle'
title: 'Configuring Paddle Billing'
position: 4
description: 'Paddle is a payment processor that allows you to charge your users for your SaaS product. It is a Merchant of Record, which means they handle all the billing and compliance for you.'
---

Hi, Paddle is not yet available.

The integration will be developed after Paddle releases their Customer Portal.

Stay tuned!

---
label: "Per Seat Billing"
title: "How to configure per seat billing in Makerkit"
position: 6
description: "Learn how to setup per seat billing in Makerkit to charge customers for additional seats (users) in your application."
---

Per Seat billing is a common pricing model for SaaS applications where customers are charged based on the number of seats (users) they have in the application. In this guide, we'll show you how to configure per seat billing in Makerkit.

Makerkit will automatically:
1. understand if your pricing model depends on the number of seats (using the `per_seat` line item type in your pricing model)
2. calculate the number of seats based on the members count in a Team account
3. report the number of seats to your billing system when subscribing
4. report the number of seats to your billing system when adding or removing members

## Define a per-seat billing schema

Per-seat billing is defined by the following fields:

```tsx
export default createBillingSchema({
  provider,
  products: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'The perfect plan to get started',
      currency: 'USD',
      badge: `Value`,
      plans: [
        {
          name: 'Starter Monthly',
          id: 'starter-monthly',
          trialDays: 7,
          paymentType: 'recurring',
          interval: 'month',
          lineItems: [
            {
              id: 'price_1NNwYHI1i3VnbZTqI2UzaHIe',
              name: 'Addon 2',
              cost: 0,
              type: 'per_seat',
              tiers: [
                {
                    upTo: 3,
                    cost: 0,
                },
                {
                    upTo: 5,
                    cost: 7.99,
                },
                {
                    upTo: 'unlimited',
                    cost: 5.99,
                }
              ]
            },
          ],
        }
      ],
    }
  ]
});
```

Let's break down the fields:
- **id**: The unique identifier for the line item. **This must match the price ID in the billing provider**. The schema will validate this, but please remember to set it correctly.
- **name**: The name of the line item
- **cost**: The cost of the line item. This can be set to `0` as the cost is calculated based on the tiers.
- **type**: The type of the line item (e.g., `flat`, `metered`, `per-seat`). In this case, it's `per-seat`.
- **tiers**: The tiers of the line item. Each tier is defined by the following fields:
- **upTo**: The upper limit of the tier. If the usage is below this limit, the cost is calculated based on this tier.
- **cost**: The cost of the tier. This is the cost per unit.

If you set the first tier to `0`, it basically means that the first `n` seats are free. This is a common practice in per-seat billing.

Please remember that the cost is set for UI purposes. **The billing provider will handle the actual billing** - therefore, **please make sure the cost is correctly set in the billing provider**.

## Report the number of seats

This is done automatically for you. Makerkit will report the number of seats to your billing provider when subscribing, and when adding or removing members.
---
label: "Stripe"
title: "Configuring Stripe Billing"
description: "Learn how to configure Stripe in the Makerkit Next.js Supabase SaaS Kit"
position: 2
---

Stripe is the default billing provider in both the local config and the DB, so you don't need to set these values if you want to use Stripe.

For Stripe, you'll need to set the following environment variables:

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

While the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is public and can be added anywhere - **please do not add the secret keys** to the `.env` file.

During development, you can place them in `.env.local` as it's not committed to the repository. In production, you can set them in the environment variables of your hosting provider.

## Stripe CLI

The Stripe CLI which allows you to listen to Stripe events straight to your own localhost. You can install and use the CLI using a variety of methods, but we recommend using Docker - since you already have it installed.

First - login to your Stripe account using the project you want to run:

```bash
docker run --rm -it --name=stripe -v ~/.config/stripe:/root/.config/stripe stripe/stripe-cli:latest login
```

Copy the webhook secret displayed in the terminal and set it as the `STRIPE_WEBHOOK_SECRET` environment variable in your `.env.local` file:

```bash
STRIPE_WEBHOOK_SECRET=*your_webhook_secret*
```

Now, you can listen to Stripe events running the following command:

```bash
pnpm run stripe:listen
```

**If you have not logged in - the first time you set it up, you are required to sign in**. This is a one-time process. Once you sign in, you can use the CLI to listen to Stripe events.

**Please sign in and then re-run the command**. Now, you can listen to Stripe events.

If you're not receiving events, please make sure that:

1. the webhook secret is correct
2. the account you signed in is the same as the one you're using in your app

## Configuring the Stripe Customer Portal

Stripe requires you to set up the Customer Portal so that users can manage their billing information, invoices and plan settings from there.

<Image src='/assets/images/docs/stripe-customer-portal.webp' width="2712" height="1870" />

1. Please make sure to enable the setting that lets users switch plans
2. Configure the behavior of the cancellation according to your needs

## Setting Production Webhooks in Stripe

When going to production, you will need to set the webhook URL and the events you want to listen to in Stripe.

The webhook path is `/api/billing/webhook`. If your app is hosted at `https://myapp.com` then you need to enter `https://myapp.com/api/billing/webhook`.

Makerkit needs the following events to work:

1. `checkout.session.completed`
2. `customer.subscription.updated`
3. `customer.subscription.deleted`

Only if you're using one-off payments, please add:

1. `checkout.session.async_payment_failed`
2. `checkout.session.async_payment_succeeded`

If your application needs more events, please add them, [but remember to handle them](billing-webhooks).

You can [handle additional events](billing-webhooks) by adding the required handlers in the `api/billing/webhook/route.ts` file.

---
label: "App Breadcrumbs"
title: "App Breadcrumbs Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the App Breadcrumbs component in the Next.js Supabase SaaS kit"
position: 6
---

The `AppBreadcrumbs` component creates a dynamic breadcrumb navigation based on the current URL path. It's designed to work with Next.js and uses the `usePathname` hook from Next.js for routing information.

## Features

- Automatically generates breadcrumbs from the current URL path
- Supports custom labels for path segments
- Limits the number of displayed breadcrumbs with an ellipsis for long paths
- Internationalization support with the `Trans` component
- Responsive design with different text sizes for mobile and desktop

## Usage

```tsx
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';

function MyPage() {
  return (
    <AppBreadcrumbs
      values={{
        "custom-slug": "Custom Label"
      }}
      maxDepth={4}
    />
  );
}
```

When you have IDs in your URL, you can use the `values` prop to provide custom labels for those segments. For example, if your URL is `/users/123`, you can set `values={{ "123": "User Profile" }}` to display "User Profile" instead of "123" in the breadcrumb.

```tsx
<AppBreadcrumbs
  values={{
    "123": "User"
  }}
/>
```

This will display "User" instead of "123" in the breadcrumb.

## Props

The component accepts two optional props:

1. `values`: An object where keys are URL segments and values are custom labels.
- Type: `Record<string, string>`
- Default: `{}`
2. `maxDepth`: The maximum number of breadcrumb items to display before using an ellipsis.
- Type: `number`
- Default: `6`

## Functionality

- The component splits the current path into segments and creates a breadcrumb item for each.
- If the number of segments exceeds `maxDepth`, it shows an ellipsis (...) to indicate hidden segments.
- The last breadcrumb item is not clickable and represents the current page.
- Custom labels can be provided through the `values` prop.
- For segments without custom labels, it attempts to use an i18n key (`common.routes.[unslugified-path]`). If no translation is found, it falls back to the unslugified path.

## Styling

- The component uses Tailwind CSS classes for styling.
- Breadcrumb items are capitalized.
- On larger screens (lg breakpoint), the text size is slightly smaller.

## Dependencies

This component relies on several other components and utilities:

- Next.js `usePathname` hook
- Custom UI components (Breadcrumb, BreadcrumbItem, etc.) from Shadcn UI
- `If` component for conditional rendering
- `Trans` component for internationalization

This component provides a flexible and easy-to-use solution for adding breadcrumb navigation to your Next.js application. It's particularly useful for sites with deep hierarchical structures or those requiring dynamic breadcrumb generation.
---
label: "Bordered Navigation Menu"
title: "Bordered Navigation Menu Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Bordered Navigation Menu component in the Next.js Supabase SaaS kit"
position: 8
---

The BorderedNavigationMenu components provide a stylish and interactive navigation menu with a bordered, underline-style active state indicator. These components are built on top of the NavigationMenu from Shadcn UI and are designed to work seamlessly with Next.js routing.

## BorderedNavigationMenu

This component serves as a container for navigation menu items.

### Usage

```jsx
import { BorderedNavigationMenu, BorderedNavigationMenuItem } from '@kit/ui/bordered-navigation-menu';

function MyNavigation() {
  return (
    <BorderedNavigationMenu>
      <BorderedNavigationMenuItem path="/home" label="Home" />
      <BorderedNavigationMenuItem path="/about" label="About" />
      {/* Add more menu items as needed */}
    </BorderedNavigationMenu>
  );
}
```

### Props

- `children: React.ReactNode`: The navigation menu items to be rendered.

## BorderedNavigationMenuItem

This component represents an individual item in the navigation menu.

### Props

- `path: string` (required): The URL path for the navigation item.
- `label: React.ReactNode | string` (required): The text or content to display for the item.
- `end?: boolean | ((path: string) => boolean)`: Determines if the path should match exactly or use a custom function for active state.
- `active?: boolean`: Manually set the active state of the item.
- `className?: string`: Additional CSS classes for the menu item container.
- `buttonClassName?: string`: Additional CSS classes for the button element.

### Features

1. **Automatic Active State**: Uses Next.js's `usePathname` to automatically determine if the item is active based on the current route.
2. **Custom Active State Logic**: Allows for custom active state determination through the `end` prop.
3. **Internationalization**: Supports i18n through the `Trans` component for string labels.
4. **Styling**: Utilizes Tailwind CSS for styling, with active items featuring an underline animation.

### Example

```jsx
<BorderedNavigationMenuItem
  path="/dashboard"
  label="common:dashboardLabel"
  end={true}
  className="my-custom-class"
  buttonClassName="px-4 py-2"
/>
```

## Styling

The components use Tailwind CSS for styling. Key classes include:

- Menu container: `relative h-full space-x-2`
- Menu item button: `relative active:shadow-sm`
- Active indicator: `absolute -bottom-2.5 left-0 h-0.5 w-full bg-primary animate-in fade-in zoom-in-90`

You can further customize the appearance by passing additional classes through the `className` and `buttonClassName` props.

## Best Practices

1. Use consistent labeling and paths across your application.
2. Leverage the `Trans` component for internationalization of labels.
3. Consider the `end` prop for more precise control over the active state for nested routes.
4. Use the `active` prop sparingly, preferring the automatic active state detection when possible.

These components provide a sleek, accessible way to create navigation menus in your Next.js application, with built-in support for styling active states and internationalization.
---
label: "Card Button"
title: "Card Button Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Card Button component in the Next.js Supabase SaaS kit"
position: 7
---

The CardButton components provide a set of customizable, interactive card-like buttons for use in React applications. These components are built with flexibility in mind, allowing for easy composition and styling.

## Components

### CardButton

The main wrapper component for creating a card-like button.

#### Props

- `asChild?: boolean`: If true, the component will render its children directly.
- `className?: string`: Additional CSS classes to apply to the button.
- `children: React.ReactNode`: The content of the button.
- `...props`: Any additional button props.

#### Usage

```jsx
<CardButton onClick={handleClick}>
  {/* Card content */}
</CardButton>
```

### CardButtonTitle

Component for rendering the title of the card button.

#### Props

- `className?: string`: Additional CSS classes for the title.
- `asChild?: boolean`: If true, renders children directly.
- `children: React.ReactNode`: The title content.

#### Usage

```jsx
<CardButtonTitle>My Card Title</CardButtonTitle>
```

### CardButtonHeader

Component for the header section of the card button.

#### Props

- `className?: string`: Additional CSS classes for the header.
- `asChild?: boolean`: If true, renders children directly.
- `displayArrow?: boolean`: Whether to display the chevron icon (default: true).
- `children: React.ReactNode`: The header content.

#### Usage

```jsx
<CardButtonHeader displayArrow={false}>
  <CardButtonTitle>Header Content</CardButtonTitle>
</CardButtonHeader>
```

### CardButtonContent

Component for the main content area of the card button.

#### Props

- `className?: string`: Additional CSS classes for the content area.
- `asChild?: boolean`: If true, renders children directly.
- `children: React.ReactNode`: The main content.

#### Usage

```jsx
<CardButtonContent>
  <p>Main card content goes here</p>
</CardButtonContent>
```

### CardButtonFooter

Component for the footer section of the card button.

#### Props

- `className?: string`: Additional CSS classes for the footer.
- `asChild?: boolean`: If true, renders children directly.
- `children: React.ReactNode`: The footer content.

#### Usage

```jsx
<CardButtonFooter>
  <span>Footer information</span>
</CardButtonFooter>
```

## Styling

These components use Tailwind CSS for styling. Key features include:

- Hover and active states for interactive feedback
- Responsive sizing and layout
- Dark mode support
- Customizable through additional class names

## Example

Here's a complete example of how to use these components together:

```jsx
import {
  CardButton,
  CardButtonTitle,
  CardButtonHeader,
  CardButtonContent,
  CardButtonFooter
} from '@kit/ui/card-button';

function MyCardButton() {
  return (
    <CardButton onClick={() => console.log('Card clicked')}>
      <CardButtonHeader>
        <CardButtonTitle>Featured Item</CardButtonTitle>
      </CardButtonHeader>
      <CardButtonContent>
        <p>This is a detailed description of the featured item.</p>
      </CardButtonContent>
      <CardButtonFooter>
        <span>Click to learn more</span>
      </CardButtonFooter>
    </CardButton>
  );
}
```

## Accessibility

- The components use semantic HTML elements when not using the `asChild` prop.
- Interactive elements are keyboard accessible.

## Best Practices

1. Use clear, concise titles in `CardButtonTitle`.
2. Provide meaningful content in `CardButtonContent` for user understanding.
3. Use `CardButtonFooter` for calls-to-action or additional information.
4. Leverage the `asChild` prop when you need to change the underlying element (e.g., for routing with Next.js `Link` component).

These CardButton components provide a flexible and customizable way to create interactive card-like buttons in your React application, suitable for various use cases such as feature showcases, navigation elements, or clickable information cards.
---
label: "Cookie Banner"
title: "Cookie Banner Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Cookie Banner component in the Next.js Supabase SaaS kit"
position: 7
---

This module provides a `CookieBanner` component and a `useCookieConsent` hook for managing cookie consent in React applications.

## CookieBanner Component

The CookieBanner component displays a consent banner for cookies and tracking technologies.

### Usage

```jsx
import dynamic from 'next/dynamic';

const CookieBanner = dynamic(() => import('@kit/ui/cookie-banner').then(m => m.CookieBanner), {
  ssr: false
});

function App() {
  return (
    <div>
      {/* Your app content */}
      <CookieBanner />
    </div>
  );
}
```

### Features

- Displays only when consent status is unknown
- Automatically hides after user interaction
- Responsive design (different layouts for mobile and desktop)
- Internationalization support via the `Trans` component
- Animated entrance using Tailwind CSS

## useCookieConsent Hook

This custom hook manages the cookie consent state and provides methods to update it.

### Usage

```jsx
import { useCookieConsent } from '@kit/ui/cookie-banner';

function MyComponent() {
  const { status, accept, reject, clear } = useCookieConsent();

  // Use these values and functions as needed
}
```

### API

- `status: ConsentStatus`: Current consent status (Accepted, Rejected, or Unknown)
- `accept(): void`: Function to accept cookies
- `reject(): void`: Function to reject cookies
- `clear(): void`: Function to clear the current consent status

## ConsentStatus Enum

```typescript
enum ConsentStatus {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Unknown = 'unknown'
}
```

## Key Features

1. **Persistent Storage**: Consent status is stored in localStorage for persistence across sessions.
2. **Server-Side Rendering Compatible**: Checks for browser environment before accessing localStorage.
3. **Customizable**: The `COOKIE_CONSENT_STATUS` key can be configured as needed.
4. **Reactive**: The banner automatically updates based on the consent status.

## Styling

The component uses Tailwind CSS for styling, with support for dark mode and responsive design.

## Accessibility

- Uses Radix UI's Dialog primitive for improved accessibility
- Autofocu s on the "Accept" button for keyboard navigation

## Internationalization

The component uses the `Trans` component for internationalization. Ensure you have the following keys in your i18n configuration:

- `cookieBanner.title`
- `cookieBanner.description`
- `cookieBanner.reject`
- `cookieBanner.accept`

## Best Practices

1. Place the `CookieBanner` component at the root of your application to ensure it's always visible when needed.
2. Use the `useCookieConsent` hook to conditionally render content or initialize tracking scripts based on the user's consent.
3. Provide clear and concise information about your cookie usage in the banner description.
4. Ensure your privacy policy is up-to-date and accessible from the cookie banner or nearby.

## Example: Conditional Script Loading

```jsx
function App() {
  const { status } = useCookieConsent();

  useEffect(() => {
    if (status === ConsentStatus.Accepted) {
      // Initialize analytics or other cookie-dependent scripts
    }
  }, [status]);

  return (
    <div>
      {/* Your app content */}
      <CookieBanner />
    </div>
  );
}
```

This cookie consent management system provides a user-friendly way to comply with cookie laws and regulations while maintaining a good user experience.
---
label: "Data Table"
title: "Data Table Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Data Table component in the Next.js Supabase SaaS kit"
position: 2
---

The DataTable component is a powerful and flexible table component built on top of TanStack Table (React Table v8). It provides a range of features for displaying and interacting with tabular data, including pagination, sorting, and custom rendering.

## Usage

```tsx
import { DataTable } from '@kit/ui/enhanced-data-table';

function MyComponent() {
  const columns = [
    // Define your columns here
  ];

  const data = [
    // Your data array
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={10}
      pageIndex={0}
      pageCount={5}
    />
  );
}
```

## Props

- `data: T[]` (required): An array of objects representing the table data.
- `columns: ColumnDef<T>[]` (required): An array of column definitions.
- `pageIndex?: number`: The current page index (0-based).
- `pageSize?: number`: The number of rows per page.
- `pageCount?: number`: The total number of pages.
- `onPaginationChange?: (pagination: PaginationState) => void`: Callback function for pagination changes.
- `tableProps?: React.ComponentProps<typeof Table>`: Additional props to pass to the underlying Table component.

## Pagination

The DataTable component handles pagination internally but can also be controlled externally. It provides navigation buttons for first page, previous page, next page, and last page.

## Sorting

Sorting is handled internally by the component. Click on column headers to sort by that column.

## Filtering

The component supports column filtering, which can be implemented in the column definitions.

## Example with ServerDataLoader

Here's an example of how to use the DataTable component with ServerDataLoader:

```jsx
import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';
import { DataTable } from '@kit/ui/enhanced-data-table';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

function AccountsPage({ searchParams }) {
  const client = getSupabaseServerAdminClient();
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const filters = getFilters(searchParams);

  return (
    <ServerDataLoader
      table={'accounts'}
      client={client}
      page={page}
      where={filters}
    >
      {({ data, page, pageSize, pageCount }) => (
        <DataTable
          columns={[
            // Define your columns here
          ]}
          data={data}
          page={page}
          pageSize={pageSize}
          pageCount={pageCount}
        />
      )}
    </ServerDataLoader>
  );
}
```

This example demonstrates how to use ServerDataLoader to fetch data from a Supabase table and pass it to the DataTable component. The ServerDataLoader handles the data fetching and pagination, while the DataTable takes care of rendering and client-side interactions.

## Customization

The DataTable component is built with customization in mind. You can customize the appearance using Tailwind CSS classes and extend its functionality by passing custom props to the underlying Table component.

## Internationalization

The component uses the `Trans` component for internationalization. Ensure you have your i18n setup correctly to leverage this feature.

The DataTable component provides a powerful and flexible solution for displaying tabular data in your React applications, with built-in support for common table features and easy integration with server-side data loading.
---
label: "Empty State"
title: "Empty State Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Empty State component in the Next.js Supabase SaaS kit"
position: 7
---

The `EmptyState` component is a flexible and reusable UI element designed to display when there's no content to show. It's perfect for scenarios like empty lists, search results with no matches, or initial states of features.

## Components

1. `EmptyState`: The main wrapper component
2. `EmptyStateHeading`: For the main heading
3. `EmptyStateText`: For descriptive text
4. `EmptyStateButton`: For a call-to-action button

## Usage

```jsx
import { EmptyState, EmptyStateHeading, EmptyStateText, EmptyStateButton } from '@kit/ui/empty-state';

function MyComponent() {
  return (
    <EmptyState>
      <EmptyStateHeading>No results found</EmptyStateHeading>
      <EmptyStateText>Try adjusting your search or filter to find what you're looking for.</EmptyStateText>
      <EmptyStateButton>Clear filters</EmptyStateButton>
    </EmptyState>
  );
}
```

## Component Details

### EmptyState

The main container that wraps all other components.

- **Props**: Accepts all standard `div` props
- **Styling**:
- Flex container with centered content
- Rounded corners with a dashed border
- Light shadow for depth

### EmptyStateHeading

Used for the main heading of the empty state.

- **Props**: Accepts all standard `h3` props
- **Styling**:
- Large text (2xl)
- Bold font
- Tight letter spacing

### EmptyStateText

For descriptive text explaining the empty state or providing guidance.

- **Props**: Accepts all standard `p` props
- **Styling**:
- Small text
- Muted color for less emphasis

### EmptyStateButton

A button component for primary actions.

- **Props**: Accepts all props from the base `Button` component
- **Styling**:
- Margin top for spacing
- Inherits styles from the base `Button` component

## Features

1. **Flexible Structure**: Components can be used in any order, and additional custom elements can be added.
2. **Automatic Layout**: The component automatically arranges its children in a centered, vertical layout.
3. **Customizable**: Each subcomponent accepts className props for custom styling.
4. **Type-Safe**: Utilizes TypeScript for prop type checking.

## Customization

You can customize the appearance of each component by passing a `className` prop:

```tsx
<EmptyState className="bg-gray-100">
  <EmptyStateHeading className="text-primary">Custom Heading</EmptyStateHeading>
  <EmptyStateText className="text-lg">Larger descriptive text</EmptyStateText>
  <EmptyStateButton className="bg-secondary">Custom Button</EmptyStateButton>
</EmptyState>
```

This `EmptyState` component provides a clean, consistent way to handle empty states in your application. Its modular design allows for easy customization while maintaining a cohesive look and feel across different use cases.
---
label: "Conditional Rendering"
title: "Dynamic Conditional Rendering in the Next.js Supabase SaaS kit"
description: "Learn how to use the If component in the Next.js Supabase SaaS kit"
position: 4
---

The `If` component is a utility component for conditional rendering in React applications. It provides a clean, declarative way to render content based on a condition, with support for fallback content.

## Features

- Conditional rendering based on various types of conditions
- Support for render props pattern
- Optional fallback content
- Memoized for performance optimization

## Usage

```jsx
import { If } from '@kit/ui/if';

function MyComponent({ isLoggedIn, user }) {
  return (
    <If condition={isLoggedIn} fallback={<LoginPrompt />}>
      {(value) => <WelcomeMessage user={user} />}
    </If>
  );
}
```

## Props

The `If` component accepts the following props:

- `condition: Condition<Value>` (required): The condition to evaluate. Can be any value, where falsy values (`false`, `null`, `undefined`, `0`, `''`) are considered false.
- `children: React.ReactNode | ((value: Value) => React.ReactNode)` (required): The content to render when the condition is truthy. Can be a React node or a function (render prop).
- `fallback?: React.ReactNode` (optional): Content to render when the condition is falsy.

## Types

```typescript
type Condition<Value = unknown> = Value | false | null | undefined | 0 | '';
```

## Examples

### Basic usage

```jsx
<If condition={isLoading}>
  <LoadingSpinner />
</If>
```

### With fallback

```jsx
<If condition={hasData} fallback={<NoDataMessage />}>
  <DataDisplay data={data} />
</If>
```

### Using render props

```jsx
<If condition={user}>
  {(user) => <UserProfile username={user.name} />}
</If>
```

## Performance

The `If` component uses `useMemo` to optimize performance by memoizing the rendered output. This means it will only re-render when the `condition`, `children`, or `fallback` props change.

## Best Practices

1. Use the `If` component for simple conditional rendering to improve readability.
2. Leverage the render props pattern when you need to use the condition's value in the rendered content.
3. Provide a fallback for better user experience when the condition is false.
4. Remember that the condition is re-evaluated on every render, so keep it simple to avoid unnecessary computations.

## Typescript Support

The `If` component is fully typed and supports generic types for the condition value. This allows for type-safe usage of the render props pattern:

```typescript
<If<User> condition={user}>
  {(user) => <UserProfile name={user.name} email={user.email} />}
</If>
```

The `If` component provides a clean and efficient way to handle conditional rendering in React applications, improving code readability and maintainability.
---
label: "Loading Overlay"
title: "Loading Overlay Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Loading Overlay component in the Next.js Supabase SaaS kit"
position: 3
---

The LoadingOverlay component is a versatile UI element designed to display a loading state with a spinner and optional content. It's perfect for indicating background processes or page loads in your application.

## Features

- Customizable appearance through CSS classes
- Option for full-page overlay or inline loading indicator
- Spinner animation with customizable styling
- Ability to include additional content or messages

## Usage

```jsx
import { LoadingOverlay } from '@kit/ui/loading-overlay';

function MyComponent() {
  return (
    <LoadingOverlay>
      Loading your content...
    </LoadingOverlay>
  );
}
```

## Props

The LoadingOverlay component accepts the following props:

- `children?: React.ReactNode`: Optional content to display below the spinner.
- `className?: string`: Additional CSS classes to apply to the container.
- `spinnerClassName?: string`: CSS classes to apply to the spinner component.
- `fullPage?: boolean`: Whether to display as a full-page overlay. Defaults to `true`.

## Examples

### Full-page overlay

```jsx
<LoadingOverlay>
  Please wait while we load your dashboard...
</LoadingOverlay>
```

### Inline loading indicator

```jsx
<LoadingOverlay fullPage={false} className="h-40">
  Fetching results...
</LoadingOverlay>
```

### Customized appearance

```jsx
<LoadingOverlay
  className="bg-gray-800 text-white"
  spinnerClassName="text-blue-500"
>
  Processing your request...
</LoadingOverlay>
```

## Styling

The LoadingOverlay uses Tailwind CSS for styling. Key classes include:

- Flex layout with centered content: `flex flex-col items-center justify-center`
- Space between spinner and content: `space-y-4`
- Full-page overlay (when `fullPage` is true):
```
fixed left-0 top-0 z-[100] h-screen w-screen bg-background
  ```

You can further customize the appearance by passing additional classes through the `className` and `spinnerClassName` props.

## Accessibility

When using the LoadingOverlay, consider adding appropriate ARIA attributes to improve accessibility, such as `aria-busy="true"` on the parent element that's in a loading state.

## Best Practices

1. Use full-page overlays sparingly to avoid disrupting user experience.
2. Provide clear, concise messages to inform users about what's loading.
3. Consider using inline loading indicators for smaller UI elements or partial page updates.
4. Ensure sufficient contrast between the overlay and the spinner for visibility.

The LoadingOverlay component provides a simple yet effective way to indicate loading states in your application, enhancing user experience by providing visual feedback during asynchronous operations or content loads.

---
label: "Marketing Components"
title: "Marketing Components in the Next.js Supabase SaaS kit"
description: "Learn how to use the Marketing components in the Next.js Supabase SaaS kit"
position: 8
---

Marketing components are designed to help you create beautiful and engaging marketing pages for your SaaS application. These components are built on top of the Shadcn UI library and are designed to work seamlessly with Next.js routing.

## Hero

The Hero component is a versatile and customizable landing page hero section for React applications.

### Import

```jsx
import { Hero } from '@kit/ui/marketing';
```

### Usage

```jsx
import { Hero, Pill, CtaButton } from '@kit/ui/marketing';
import Image from 'next/image';

function LandingPage() {
  return (
    <Hero
      pill={<Pill>New Feature</Pill>}
      title="Welcome to Our App"
      subtitle="Discover the power of our innovative solution"
      cta={<CtaButton>Get Started</CtaButton>}
      image={
        <Image
          src="/hero-image.jpg"
          alt="Hero Image"
          width={1200}
          height={600}
        />
      }
    />
  );
}
```

### Styling

The Hero component uses Tailwind CSS for styling. You can customize its appearance by:

1. Modifying the default classes in the component.
2. Passing additional classes via the `className` prop.
3. Overriding styles in your CSS using the appropriate selectors.

### Animations

By default, the Hero component applies entrance animations to its elements. You can disable these animations by setting the `animate` prop to `false`.

### Accessibility

The Hero component uses semantic HTML elements and follows accessibility best practices:

- The main title uses an `<h1>` tag (via the `HeroTitle` component).
- The subtitle uses an `<h3>` tag for proper heading hierarchy.

Ensure that any images passed via the `image` prop include appropriate `alt` text for screen readers.

### Notes

- The Hero component is designed to be flexible and can accommodate various content types through its props.
- For optimal performance, consider lazy-loading large images passed to the `image` prop.
- The component is responsive and adjusts its layout for different screen sizes.

### A Larger example straight from the kit

Below is a larger example of a Hero component with additional elements like a pill, CTA button, and image:

```tsx
import { Hero, Pill, CtaButton, GradientSecondaryText } from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';
import { LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

<Hero
  pill={
    <Pill label={'New'}>
      <span>The leading SaaS Starter Kit for ambitious developers</span>
    </Pill>
  }
  title={
    <>
      <span>The ultimate SaaS Starter</span>
      <span>for your next project</span>
    </>
  }
  subtitle={
    <span>
      Build and Ship a SaaS faster than ever before with the next-gen SaaS
      Starter Kit. Ship your SaaS in days, not months.
    </span>
  }
  cta={<MainCallToActionButton />}
  image={
    <Image
      priority
      className={
        'delay-250 rounded-2xl border border-gray-200 duration-1000 ease-out animate-in fade-in zoom-in-50 fill-mode-both dark:border-primary/10'
      }
      width={3558}
      height={2222}
      src={`/images/dashboard.webp`}
      alt={`App Image`}
    />
  }
/>

function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link href={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ArrowRightIcon
              className={
                'h-4 animate-in fade-in slide-in-from-left-8' +
                ' delay-1000 duration-1000 zoom-in fill-mode-both'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'}>
        <Link href={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton>
    </div>
  );
}
```

## HeroTitle

The `HeroTitle` component is a specialized heading component used within the Hero component to display the main title.

### Props

The `HeroTitle` component accepts the following props:

1. `asChild?: boolean`: Whether to render the component as a child of the `Slot` component.
2. `HTMLAttributes<HTMLHeadingElement>`: Additional attributes to apply to the heading element.

### Usage

```tsx
import { HeroTitle } from '@kit/ui/marketing';

function LandingPage() {
  return (
    <HeroTitle asChild>
      Welcome to Our App
    </HeroTitle>
  );
}
```

## Pill

The `Pill` component is a small, rounded content container often used for highlighting or categorizing information.

### Usage

Use the `Pill` component to create a small, rounded content container with optional label text.

```tsx
import { Pill } from '@kit/ui/marketing';

function LandingPage() {
  return (
    <Pill label="New">
      Discover the power of our innovative
    </Pill>
  );
}
```

## Features

The `FeatureShowcase`, `FeatureShowcaseIconContainer`, `FeatureGrid`, and `FeatureCard` components are designed to showcase product features on marketing pages.

### FeatureShowcase

The `FeatureShowcase` component is a layout component that showcases a feature with an icon, heading, and description.

### FeatureShowcaseIconContainer

The `FeatureShowcaseIconContainer` component is a layout component that contains an icon for the `FeatureShowcase` component.

### FeatureGrid

The `FeatureGrid` component is a layout component that arranges `FeatureCard` components in a grid layout.

### FeatureCard

The `FeatureCard` component is a card component that displays a feature with a label, description, and optional image.

### Usage

Use the `FeatureShowcase` component to showcase a feature with an icon, heading, and description.

```tsx
 <div className={'container mx-auto'}>
  <div
    className={'flex flex-col space-y-16 xl:space-y-32 2xl:space-y-36'}
  >
    <FeatureShowcase
      heading={
        <>
          <b className="font-semibold dark:text-white">
            The ultimate SaaS Starter Kit
          </b>
          .{' '}
          <GradientSecondaryText>
            Unleash your creativity and build your SaaS faster than ever
            with Makerkit.
          </GradientSecondaryText>
        </>
      }
      icon={
        <FeatureShowcaseIconContainer>
          <LayoutDashboard className="h-5" />
          <span>All-in-one solution</span>
        </FeatureShowcaseIconContainer>
      }
    >
      <FeatureGrid>
        <FeatureCard
          className={
            'relative col-span-2 overflow-hidden bg-violet-500 text-white lg:h-96'
          }
          label={'Beautiful Dashboard'}
          description={`Makerkit provides a beautiful dashboard to manage your SaaS business.`}
        >
          <Image
            className="absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border border-border lg:top-36 lg:flex lg:h-auto lg:w-10/12"
            src={'/images/dashboard-header.webp'}
            width={'2061'}
            height={'800'}
            alt={'Dashboard Header'}
          />
        </FeatureCard>

        <FeatureCard
          className={
            'relative col-span-2 w-full overflow-hidden lg:col-span-1'
          }
          label={'Authentication'}
          description={`Makerkit provides a variety of providers to allow your users to sign in.`}
        >
          <Image
            className="absolute left-16 top-32 hidden h-auto w-8/12 rounded-l-2xl lg:flex"
            src={'/images/sign-in.webp'}
            width={'1760'}
            height={'1680'}
            alt={'Sign In'}
          />
        </FeatureCard>

        <FeatureCard
          className={
            'relative col-span-2 overflow-hidden lg:col-span-1 lg:h-96'
          }
          label={'Multi Tenancy'}
          description={`Multi tenant memberships for your SaaS business.`}
        >
          <Image
            className="absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border lg:top-28 lg:flex lg:h-auto lg:w-8/12"
            src={'/images/multi-tenancy.webp'}
            width={'2061'}
            height={'800'}
            alt={'Multi Tenancy'}
          />
        </FeatureCard>

        <FeatureCard
          className={'relative col-span-2 overflow-hidden lg:h-96'}
          label={'Billing'}
          description={`Makerkit supports multiple payment gateways to charge your customers.`}
        >
          <Image
            className="absolute right-0 top-0 hidden h-full w-full rounded-tl-2xl border border-border lg:top-36 lg:flex lg:h-auto lg:w-11/12"
            src={'/images/billing.webp'}
            width={'2061'}
            height={'800'}
            alt={'Billing'}
          />
        </FeatureCard>
      </FeatureGrid>
    </FeatureShowcase>
  </div>
</div>
```

## SecondaryHero

The `SecondaryHero` component is a secondary hero section that can be used to highlight additional features or content on a landing page.

```tsx
<SecondaryHero
  pill={<Pill>Get started for free. No credit card required.</Pill>}
  heading="Fair pricing for all types of businesses"
  subheading="Get started on our free plan and upgrade when you are ready."
/>
```

## Header

The `Header` component is a navigation header that can be used to display links to different sections of a marketing page.

```tsx
export function SiteHeader(props: { user?: User | null }) {
  return (
    <Header
      logo={<AppLogo />}
      navigation={<SiteNavigation />}
      actions={<SiteHeaderAccountSection user={props.user ?? null} />}
    />
  );
}
```

## Footer

The `Footer` component is a footer section that can be used to display links, social media icons, and other information on a marketing page.

```tsx
import { Footer } from '@kit/ui/marketing';
import { Trans } from '@kit/ui/trans';

import { AppLogo } from '~/components/app-logo';
import appConfig from '~/config/app.config';

export function SiteFooter() {
  return (
    <Footer
      logo={<AppLogo className="w-[85px] md:w-[95px]" />}
      description={<Trans i18nKey="marketing:footerDescription" />}
      copyright={
        <Trans
          i18nKey="marketing:copyright"
          values={{
            product: appConfig.name,
            year: new Date().getFullYear(),
          }}
        />
      }
      sections={[
        {
          heading: <Trans i18nKey="marketing:about" />,
          links: [
            { href: '/blog', label: <Trans i18nKey="marketing:blog" /> },
            { href: '/contact', label: <Trans i18nKey="marketing:contact" /> },
          ],
        },
        {
          heading: <Trans i18nKey="marketing:product" />,
          links: [
            {
              href: '/docs',
              label: <Trans i18nKey="marketing:documentation" />,
            },
          ],
        },
        {
          heading: <Trans i18nKey="marketing:legal" />,
          links: [
            {
              href: '/terms-of-service',
              label: <Trans i18nKey="marketing:termsOfService" />,
            },
            {
              href: '/privacy-policy',
              label: <Trans i18nKey="marketing:privacyPolicy" />,
            },
            {
              href: '/cookie-policy',
              label: <Trans i18nKey="marketing:cookiePolicy" />,
            },
          ],
        },
      ]}
    />
  );
}
```

## CtaButton

The `CtaButton` component is a call-to-action button that can be used to encourage users to take a specific action.

```tsx
function MainCallToActionButton() {
  return (
    <div className={'flex space-x-4'}>
      <CtaButton>
        <Link href={'/auth/sign-up'}>
          <span className={'flex items-center space-x-0.5'}>
            <span>
              <Trans i18nKey={'common:getStarted'} />
            </span>

            <ArrowRightIcon
              className={
                'h-4 animate-in fade-in slide-in-from-left-8' +
                ' delay-1000 duration-1000 zoom-in fill-mode-both'
              }
            />
          </span>
        </Link>
      </CtaButton>

      <CtaButton variant={'link'}>
        <Link href={'/contact'}>
          <Trans i18nKey={'common:contactUs'} />
        </Link>
      </CtaButton>
    </div>
  );
}
```

## GradientSecondaryText

The `GradientSecondaryText` component is a text component that applies a gradient color to the text.

```tsx
function GradientSecondaryTextExample() {
  return (
    <p>
      <GradientSecondaryText>
        Unleash your creativity and build your SaaS faster than ever with
        Makerkit.
      </GradientSecondaryText>
    </p>
  );
}
```

## GradientText

The `GradientText` component is a text component that applies a gradient color to the text.

```tsx
function GradientTextExample() {
  return (
    <p>
      <GradientText className={'from-primary/60 to-primary'}>
        Unleash your creativity and build your SaaS faster than ever with
        Makerkit.
      </GradientText>
    </p>
  );
}
```

You can use the Tailwind CSS gradient utility classes to customize the gradient colors.

```tsx
<GradientText className={'from-violet-500 to-purple-700'}>
  Unleash your creativity and build your SaaS faster than ever with Makerkit.
</GradientText>
```

## NewsletterSignupContainer

The `NewsletterSignupContainer` is a comprehensive component for handling newsletter signups in a marketing context. It manages the entire signup flow, including form display, loading state, and success/error messages.

### Import

```jsx
import { NewsletterSignupContainer } from '@kit/ui/marketing';
```

### Props

The `NewsletterSignupContainer` accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSignup` | `(email: string) => Promise<void>` | (Required) | Async function to handle the signup process |
| `heading` | `string` | 'Subscribe to our newsletter' | The main heading for the signup section |
| `description` | `string` | 'Get the latest updates and offers directly to your inbox.' | A brief description of the newsletter |
| `successMessage` | `string` | 'Thank you for subscribing!' | Message displayed on successful signup |
| `errorMessage` | `string` | 'An error occurred. Please try again.' | Message displayed if signup fails |
| `className` | `string` | `undefined` | Additional CSS classes for the container |

The component also accepts all standard HTML div attributes.

### Usage

```tsx
'use client';

import { NewsletterSignupContainer } from '@kit/ui/marketing';

function WrapperNewsletterComponent() {
  const handleNewsletterSignup = async (email: string) => {
    // Implement your signup logic here
    await apiClient.subscribeToNewsletter(email);
  };

  return (
    <NewsletterSignupContainer 
      onSignup={handleNewsletterSignup}
      heading="Join Our Community"
      description="Be the first to know about new features and updates."
      successMessage="You're all set! Check your inbox for a confirmation email."
      errorMessage="Oops! Something went wrong. Please try again later."
      className="max-w-md mx-auto"
    />
  );
}
```

Wrap the component into a parent `client` component as you'll need to pass the `onSignup` function to the component.

The `onSignup` function should handle the signup process, such as making an API request to subscribe the user to the newsletter, whichever provider you're using.

### Behavior

1. Initially displays the newsletter signup form.
2. When the form is submitted, it shows a loading spinner.
3. On successful signup, displays a success message.
4. If an error occurs during signup, shows an error message.

### Styling

The component uses Tailwind CSS for styling. The container is flexbox-based and centers its content. You can customize the appearance by passing additional classes via the `className` prop.

### Accessibility

- Uses semantic HTML structure with appropriate headings.
- Provides clear feedback for form submission states.
- Error and success messages are displayed using the `Alert` component for consistent styling and accessibility.

### Notes

- It integrates with other Makerkit UI components like `Alert`, `Heading`, and `Spinner`.
- The actual signup logic is decoupled from the component, allowing for flexibility in implementation.

---
label: "Multi Step Forms"
title: "Multi Step Forms in the Next.js Supabase SaaS kit"
description: "Building multi-step forms in the Next.js Supabase SaaS kit"
position: 0
---

The Multi-Step Form Component is a powerful and flexible wrapper around React Hook Form, Zod, and Shadcn UI. It provides a simple API to create multi-step forms with ease, perfect for complex registration processes, surveys, or any scenario where you need to break down a long form into manageable steps.

## Features

- Easy integration with React Hook Form and Zod for form management and validation
- Built-in step management
- Customizable layout and styling
- Progress tracking with optional Stepper component
- TypeScript support for type-safe form schemas

## Usage

Here's a basic example of how to use the Multi-Step Form Component:

```tsx
import { MultiStepForm, MultiStepFormStep } from '@kit/ui/multi-step-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const FormSchema = createStepSchema({
  step1: z.object({ /* ... */ }),
  step2: z.object({ /* ... */ }),
});

export function MyForm() {
  const form = useForm({
    resolver: zodResolver(FormSchema),
    // ...
  });

  const onSubmit = (data) => {
    // Handle form submission
  };

  return (
    <MultiStepForm schema={FormSchema} form={form} onSubmit={onSubmit}>
      <MultiStepFormStep name="step1">
        {/* Step 1 fields */}
      </MultiStepFormStep>
      <MultiStepFormStep name="step2">
        {/* Step 2 fields */}
      </MultiStepFormStep>
    </MultiStepForm>
  );
}
```

## Key Components

### MultiStepForm

The main wrapper component that manages the form state and step progression.

Props:
- `schema`: Zod schema for form validation
- `form`: React Hook Form's `useForm` instance
- `onSubmit`: Function to handle form submission
- `className`: Optional CSS classes

### MultiStepFormStep

Represents an individual step in the form.

Props:
- `name`: Unique identifier for the step (should match a key in your schema)
- `children`: Step content

### MultiStepFormHeader

Optional component for adding a header to your form, often used with the Stepper component.

### MultiStepFormContextProvider

Provides access to form context within child components.

### useMultiStepFormContext

The hook returns an object with the following properties:

- `form: UseFormReturn<z.infer<Schema>>` - The original form object.
- `currentStep: string` - The name of the current step.
- `currentStepIndex: number` - The index of the current step (0-based).
- `totalSteps: number` - The total number of steps in the form.
- `isFirstStep: boolean` - Whether the current step is the first step.
- `isLastStep: boolean` - Whether the current step is the last step.
- `nextStep: (e: React.SyntheticEvent) => void` - Function to move to the next step.
- `prevStep: (e: React.SyntheticEvent) => void` - Function to move to the previous step.
- `goToStep: (index: number) => void` - Function to jump to a specific step by index.
- `direction: 'forward' | 'backward' | undefined` - The direction of the last step change.
- `isStepValid: () => boolean` - Function to check if the current step is valid.
- `isValid: boolean` - Whether the entire form is valid.
- `errors: FieldErrors<z.infer<Schema>>` - Form errors from React Hook Form.
- `mutation: UseMutationResult` - A mutation object for handling form submission.

## Example

Here's a more complete example of a multi-step form with three steps: Account, Profile, and Review. The form uses Zod for schema validation and React Hook Form for form management.

```tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@kit/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import {
  MultiStepForm,
  MultiStepFormContextProvider,
  MultiStepFormHeader,
  MultiStepFormStep,
  createStepSchema,
  useMultiStepFormContext,
} from '@kit/ui/multi-step-form';
import { Stepper } from '@kit/ui/stepper';

const FormSchema = createStepSchema({
  account: z.object({
    username: z.string().min(3),
    email: z.string().email(),
  }),
  profile: z.object({
    password: z.string().min(8),
    age: z.coerce.number().min(18),
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function MultiStepFormDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      account: {
        username: '',
        email: '',
      },
      profile: {
        password: '',
      },
    },
    reValidateMode: 'onBlur',
    mode: 'onBlur',
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <MultiStepForm
      className={'space-y-10 p-8 rounded-xl border'}
      schema={FormSchema}
      form={form}
      onSubmit={onSubmit}
    >
      <MultiStepFormHeader
        className={'flex w-full flex-col justify-center space-y-6'}
      >
        <h2 className={'text-xl font-bold'}>Create your account</h2>

        <MultiStepFormContextProvider>
          {({ currentStepIndex }) => (
            <Stepper
              variant={'numbers'}
              steps={['Account', 'Profile', 'Review']}
              currentStep={currentStepIndex}
            />
          )}
        </MultiStepFormContextProvider>
      </MultiStepFormHeader>

      <MultiStepFormStep name="account">
        <AccountStep />
      </MultiStepFormStep>

      <MultiStepFormStep name="profile">
        <ProfileStep />
      </MultiStepFormStep>

      <MultiStepFormStep name="review">
        <ReviewStep />
      </MultiStepFormStep>
    </MultiStepForm>
  );
}

function AccountStep() {
  const { form, nextStep, isStepValid } = useMultiStepFormContext();

  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="account.username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="account.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button onClick={nextStep} disabled={!isStepValid()}>
            Next
          </Button>
        </div>
      </div>
    </Form>
  );
}

function ProfileStep() {
  const { form, nextStep, prevStep } = useMultiStepFormContext();

  return (
    <Form {...form}>
      <div className={'flex flex-col gap-4'}>
        <FormField
          name="profile.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="profile.age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type={'button'} variant={'outline'} onClick={prevStep}>
            Previous
          </Button>

          <Button onClick={nextStep}>Next</Button>
        </div>
      </div>
    </Form>
  );
}

function ReviewStep() {
  const { prevStep, form } = useMultiStepFormContext<typeof FormSchema>();
  const values = form.getValues();

  return (
    <div className={'flex flex-col space-y-4'}>
      <div className={'flex flex-col space-y-4'}>
        <div>Great! Please review the values.</div>

        <div className={'flex flex-col space-y-2 text-sm'}>
          <div>
            <span>Username</span>: <span>{values.account.username}</span>
          </div>
          <div>
            <span>Email</span>: <span>{values.account.email}</span>
          </div>
          <div>
            <span>Age</span>: <span>{values.profile.age}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type={'button'} variant={'outline'} onClick={prevStep}>
          Back
        </Button>

        <Button type={'submit'}>Create Account</Button>
      </div>
    </div>
  );
}
```

The inner components `AccountStep`, `ProfileStep`, and `ReviewStep` represent the individual steps of the form. They use the `useMultiStepFormContext` hook to access form utilities like `nextStep`, `prevStep`, and `isStepValid`.

These are built using ShadcnUI - so please [do refer to the ShadcnUI documentation](https://ui.shadcn.com/docs/components/form) for more information on how to use the components.

## Tips

1. Use the `createStepSchema` helper to easily create Zod schemas for your multi-step form.
2. Leverage the `useMultiStepFormContext` hook in your step components to access form utilities.
3. Combine with the Stepper component for visual progress indication.
4. Customize the look and feel using the provided `className` props and your own CSS.

The Multi-Step Form Component simplifies the creation of complex, multi-step forms while providing a great user experience. It's flexible enough to handle a wide variety of use cases while keeping your code clean and maintainable.



---
label: "Page"
title: "Page Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Page component in the Next.js Supabase SaaS kit"
position: 5
---

The Page component is a versatile layout component that provides different page structures based on the specified style. It's designed to create consistent layouts across your application with support for sidebar and header-based designs.

## Usage

```jsx
import { Page, PageNavigation, PageBody, PageHeader } from '@kit/ui/page';

function MyPage() {
  return (
    <Page style="sidebar">
      <PageNavigation>
        {/* Navigation content */}
      </PageNavigation>
      <PageHeader title="Dashboard" description="Welcome to your dashboard">
        {/* Optional header content */}
      </PageHeader>
      <PageBody>
        {/* Main page content */}
      </PageBody>
    </Page>
  );
}
```

## Page Component Props

- `style?: 'sidebar' | 'header' | 'custom'`: Determines the layout style (default: 'sidebar')
- `contentContainerClassName?: string`: Custom class for the content container
- `className?: string`: Additional classes for the main container
- `sticky?: boolean`: Whether to make the header sticky (for 'header' style)

## Sub-components

### PageNavigation

Wraps the navigation content, typically used within the Page component.

### PageMobileNavigation

Wraps the mobile navigation content, displayed only on smaller screens.

### PageBody

Contains the main content of the page.

Props:
- `className?: string`: Additional classes for the body container

### PageHeader

Displays the page title and description.

Props:
- `title?: string | React.ReactNode`: The page title
- `description?: string | React.ReactNode`: The page description
- `className?: string`: Additional classes for the header container

### PageTitle

Renders the main title of the page.

### PageDescription

Renders the description text below the page title.

## Layout Styles

### Sidebar Layout

The default layout, featuring a sidebar navigation and main content area.

### Header Layout

A layout with a top navigation bar and content below.

### Custom Layout

Allows for complete custom layouts by directly rendering children.

## Examples

### Sidebar Layout

```jsx
<Page style="sidebar">
  <PageNavigation>
    <SidebarContent />
  </PageNavigation>
  <PageHeader title="Dashboard" description="Overview of your account">
    <UserMenu />
  </PageHeader>
  <PageBody>
    <DashboardContent />
  </PageBody>
</Page>
```

### Header Layout

```jsx
<Page style="header" sticky={true}>
  <PageNavigation>
    <HeaderNavLinks />
  </PageNavigation>
  <PageMobileNavigation>
    <MobileMenu />
  </PageMobileNavigation>
  <PageBody>
    <PageHeader title="Profile" description="Manage your account settings" />
    <ProfileSettings />
  </PageBody>
</Page>
```

## Customization

The Page component and its sub-components use Tailwind CSS classes for styling. You can further customize the appearance by passing additional classes through the `className` props or by modifying the default classes in the component implementation.

## Best Practices

1. Use consistent layout styles across similar pages for a cohesive user experience.
2. Leverage the PageHeader component to provide clear page titles and descriptions.
3. Utilize the PageNavigation and PageMobileNavigation components to create responsive navigation experiences.
4. When using the 'custom' style, ensure you handle responsive behavior manually.

The Page component and its related components provide a flexible system for creating structured, responsive layouts in your React application, promoting consistency and ease of maintenance across your project.
---
label: "Stepper"
title: "Stepper Component in the Next.js Supabase SaaS kit"
description: "Learn how to use the Stepper component in the Next.js Supabase SaaS kit"
position: 1
---

The Stepper component is a versatile UI element designed to display a series of steps in a process or form. It provides visual feedback on the current step and supports different visual styles.

## Usage

```jsx
import { Stepper } from '@kit/ui/stepper';

function MyComponent() {
  return (
    <Stepper
      steps={['Step 1', 'Step 2', 'Step 3']}
      currentStep={1}
      variant="default"
    />
  );
}
```

## Props

The Stepper component accepts the following props:

- `steps: string[]` (required): An array of strings representing the labels for each step.
- `currentStep: number` (required): The index of the currently active step (0-based).
- `variant?: 'numbers' | 'default'` (optional): The visual style of the stepper. Defaults to 'default'.

## Variants

The Stepper component supports two visual variants:

1. `default`: Displays steps as a horizontal line with labels underneath.
2. `numbers`: Displays steps as numbered circles with labels between them.

## Features

- Responsive design that adapts to different screen sizes
- Dark mode support
- Customizable appearance through CSS classes and variants
- Accessibility support with proper ARIA attributes

## Component Breakdown

### Main Stepper Component

The main `Stepper` function renders the overall structure of the component. It:

- Handles prop validation and default values
- Renders nothing if there are fewer than two steps
- Uses a callback to render individual steps
- Applies different CSS classes based on the chosen variant

### Steps Rendering

Steps are rendered using a combination of divs and spans, with different styling applied based on:

- Whether the step is currently selected
- The chosen variant (default or numbers)

### StepDivider Component

For the 'numbers' variant, a `StepDivider` component is used to render the labels between numbered steps. It includes:

- Styling for selected and non-selected states
- A divider line between steps (except for the last step)

## Styling

The component uses a combination of:

- Tailwind CSS classes for basic styling
- `cva` (Class Variance Authority) for managing variant-based styling
- `classNames` function for conditional class application

## Accessibility

- The component uses `aria-selected` to indicate the current step
- Labels are associated with their respective steps for screen readers

## Customization

You can further customize the appearance of the Stepper by:

1. Modifying the `classNameBuilder` function to add or change CSS classes
2. Adjusting the Tailwind CSS classes in the component JSX
3. Creating new variants in the `cva` configuration

## Example

```jsx
<Stepper
  steps={['Account', 'Personal Info', 'Review']}
  currentStep={1}
  variant="numbers"
/>
```

This will render a numbered stepper with three steps, where "Personal Info" is the current (selected) step.

The Stepper component provides a flexible and visually appealing way to guide users through multi-step processes in your application. Its support for different variants and easy customization makes it adaptable to various design requirements.
---
label: "Application Configuration"
title: "Setting your application configuration"
description: "Learn how to setup the overall settings of your Next.js Supabase application"
position: 1
---

The application configuration is set at `apps/web/config/app.config.ts`. This configuration stores some overall variables for your application.

This configuration is set at application-level. The configuration gets propagated to the packages that the app imports, so you can control the behavior and logic of the package. This also allows you to host multiple apps in the same monorepo, as every application defines its own configuration.

The recommendation is **to not update this directly** - instead, please define the environment variables below and override the default behavior. The configuration is validated using the Zod schema `AppConfigSchema`, so if something is off, you'll see the errors.

```tsx
const appConfig = AppConfigSchema.parse({
  name: process.env.NEXT_PUBLIC_PRODUCT_NAME,
  title: process.env.NEXT_PUBLIC_SITE_TITLE,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_SITE_URL,
  locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  theme: process.env.NEXT_PUBLIC_DEFAULT_THEME_MODE,
  themeColor: process.env.NEXT_PUBLIC_THEME_COLOR,
  themeColorDark: process.env.NEXT_PUBLIC_THEME_COLOR_DARK,
  production,
});
```

For example, to set the product name and app URL, you'd update the variables:

```bash
NEXT_PUBLIC_SITE_URL=https://myapp.com
NEXT_PUBLIC_PRODUCT_NAME="My wonderful AI App"
```
---
label: "Authentication Configuration"
title: "Setting your authentication configuration"
description: "Learn how to setup the authentication configuration of your Next.js Supabase application"
position: 2
---

Makerkit supports three different authentication methods:

1. **Password** - the traditional email/password method, set to `true` by default
2. **Magic Link** - magic link, set to `false` by default
3. **oAuth** - oAuth providers, by default we set Google Auth

The authentication configuration is set at `apps/web/config/auth.config.ts`.

The recommendation is **to not update this directly** - instead, please define the environment variables below and override the default behavior. The configuration is validated using the Zod schema `AuthConfigSchema`, so if something is off, you'll see the errors.

```tsx
const authConfig = AuthConfigSchema.parse({
  // NB: This is a public key, so it's safe to expose.
  // Copy the value from the Supabase Dashboard.
  captchaTokenSiteKey: process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,

  // whether to display the terms checkbox during sign-up
  displayTermsCheckbox:
    process.env.NEXT_PUBLIC_DISPLAY_TERMS_AND_CONDITIONS_CHECKBOX === 'true',

  // NB: Enable the providers below in the Supabase Console
  // in your production project
  providers: {
    password: process.env.NEXT_PUBLIC_AUTH_PASSWORD === 'true',
    magicLink: process.env.NEXT_PUBLIC_AUTH_MAGIC_LINK === 'true',
    oAuth: ['google'],
  },
} satisfies z.infer<typeof AuthConfigSchema>);
```

For example, if you wanted to switch from password auth to magic link, you'd set the below variables:

```bash
NEXT_PUBLIC_AUTH_PASSWORD=false
NEXT_PUBLIC_AUTH_MAGIC_LINK=true
```

## Third Party Providers

To display third-party providers in the UI, you need to set the `oAuth` array to include the provider you want to display. The default is Google.

```tsx
providers: {
  oAuth: ['google'],
}
```

**The configuration is done on Supabase's side - not on Makerkit's side**.

Third Party providers need to be configured, managed and enabled fully on the provider's and Supabase's side. Makerkit does not need any configuration (beyond setting the provider to be displayed in the UI).

Please [read Supabase's documentation](https://supabase.com/docs/guides/auth/social-login) on how to set up third-party providers.

For local development, also check out [Supabase's documentation on how to set up OAuth providers locally](https://supabase.com/docs/guides/cli/managing-config).

### Scopes

Scopes are used to request specific permissions from the user. Different providers support and require different scopes.

To add your required scopes, please specify them in the `OAuthProviders` component.

```tsx title="packages/features/auth/src/components/oauth-providers.tsx"
/**
 * @name OAUTH_SCOPES
 * @description
 * The OAuth scopes are used to specify the permissions that the application is requesting from the user.
 *
 * Please add your OAuth providers here and the scopes you want to use.
 *
 * @see https://supabase.com/docs/guides/auth/social-login
 */
const OAUTH_SCOPES: Partial<Record<Provider, string>> = {
  azure: 'email',
  // add your OAuth providers here
};
```

For example, if you want to request the user's email address, you can add the `email` scope to the Google provider.

```tsx title="packages/features/auth/src/components/oauth-providers.tsx"
const OAUTH_SCOPES: Partial<Record<Provider, string>> = {
  azure: 'email',
  google: 'email',
};
```

## Password Requirements

To set the password requirements, you can set the following environment variables:

```bash
NEXT_PUBLIC_PASSWORD_REQUIRE_UPPERCASE=true
NEXT_PUBLIC_PASSWORD_REQUIRE_NUMBERS=true
NEXT_PUBLIC_PASSWORD_REQUIRE_SPECIAL_CHARS=true
```

The above will enforce the following rules:
1. At least one uppercase letter
2. At least one number
3. At least one special character

## Displaying Terms and Conditions

To display the terms and conditions checkbox during sign-up, set the following environment variable:

```bash
NEXT_PUBLIC_DISPLAY_TERMS_AND_CONDITIONS_CHECKBOX=true
```

This is off by default.
---
title: Environment Variables in the Next.js Supabase Starter Kit
label: Environment Variables
position: 0
description: Learn how to configure environment variables in the Next.js Supabase Starter Kit.
---

Environment variables are defined in the `.env` file in the root of the `apps/web` package.

1. **Shared Environment Variables**: Shared environment variables are defined in the `.env` file. These are the env variables shared between environments (e.g., development, staging, production).
2. **Environment Variables**: Environment variables for a specific environment are defined in the `.env.development` and `.env.production` files. These are the env variables specific to the development and production environments.
3. **Secret Keys**: Secret keys and sensitive information are not stored in the `.env` file. Instead, they are stored in the environment variables of the CI/CD system.
4. **Secret keys to be used locally**: If you need to use secret keys locally, you can store them in the `.env.local` file. This file is not committed to Git, therefore it is safe to store sensitive information in it.

---

The majority of the environment variables are defined in the `apps/web/.env` file. These are the env variables
shared between environments (eg. they will be the same for development, staging, and production).

**NB: You will not add any secret keys or sensitive information here.** Only configuration, paths, feature flags, etc.

```bash
# SHARED ENVIRONMENT VARIABLES
# HERE YOU CAN ADD ALL THE **PUBLIC** ENVIRONMENT VARIABLES THAT ARE SHARED ACROSS ALL THE ENVIRONMENTS
# PLEASE DO NOT ADD ANY CONFIDENTIAL KEYS OR SENSITIVE INFORMATION HERE
# ONLY CONFIGURATION, PATH, FEATURE FLAGS, ETC.
# TO OVERRIDE THESE VARIABLES IN A SPECIFIC ENVIRONMENT, PLEASE ADD THEM TO THE SPECIFIC ENVIRONMENT FILE (e.g. .env.development, .env.production)

# SITE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCT_NAME=Makerkit
NEXT_PUBLIC_SITE_TITLE="Makerkit - The easiest way to build and manage your SaaS"
NEXT_PUBLIC_SITE_DESCRIPTION="Makerkit is the easiest way to build and manage your SaaS. It provides you with the tools you need to build your SaaS, without the hassle of building it from scratch."
NEXT_PUBLIC_DEFAULT_THEME_MODE=light
NEXT_PUBLIC_THEME_COLOR="#ffffff"
NEXT_PUBLIC_THEME_COLOR_DARK="#0a0a0a"

# AUTH
NEXT_PUBLIC_AUTH_PASSWORD=true
NEXT_PUBLIC_AUTH_MAGIC_LINK=false
NEXT_PUBLIC_CAPTCHA_SITE_KEY=

# BILLING
NEXT_PUBLIC_BILLING_PROVIDER=stripe

# CMS
CMS_CLIENT=keystatic

# KEYSTATIC
NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH=./content

# LOCALES PATH
NEXT_PUBLIC_LOCALES_PATH=apps/web/public/locales

# PATHS (to be used in "packages")
SIGN_IN_PATH=/auth/sign-in
SIGN_UP_PATH=/auth/sign-up
TEAM_ACCOUNTS_HOME_PATH=/home
INVITATION_PAGE_PATH=/join

# FEATURE FLAGS
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=true
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION=true
```

Please update the `apps/web/.env` file with the appropriate values.

This is complemented by the environment variables defined in the `apps/web/.env.development` and `apps/web/.env.production` files.

### Secret Keys

Secret keys and sensitive information are to be never stored in the `.env` file. Instead, **they are stored in the environment variables of the CI/CD system**.

What does this mean? It means that you will need to add the secret keys to the environment variables of your CI/CD system (e.g., GitHub Actions, Vercel, Cloudflare, your VPS, Netlify, etc.). This is not a Makerkit-specific requirement, but a best practice for security for any application. Ultimately, it's your choice.

Below are some of the additional secret keys that you may need to add to your environment variables:

#### Supabase

For Supabase, you'll need to add the following environment variables:

```bash
SUPABASE_SERVICE_ROLE_KEY=
```

#### Stripe

Please check the [Stripe documentation](stripe).

#### Lemon Squeezy

Please check the [Lemon Squeezy documentation](lemon-squeezy).

#### Mailers

Please check the [Mailers documentation](email-configuration).

#### Monitoring

Please check the [Monitoring documentation](monitoring).

#### CMS

Please check the [CMS documentation](cms).

### Feature Flags

To enable or disable certain application features, please toggle the values below:

```BASH
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=true
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION=true
```

The following feature flags are available:

1. **NEXT_PUBLIC_ENABLE_THEME_TOGGLE** - you can hide the theme toggle (if you want to force a single theme)
2. **NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION** - to prevent users from self-deleting their personal account
3. **NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING** - to enable/disable billing for personal accounts
4. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION** - to prevent team accounts from self-deleting the account
5. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING** - to enable/disable billing for team accounts
6. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS** - to disable team accounts
7. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION** - to enable/disable the ability to create a team account

#### Personal Accounts vs Team Accounts

The starter kit supports two types of accounts:

1. Personal accounts are accounts that are owned by a single user.
2. Team accounts are accounts that group multiple users together.

This allows you to:

1. Serve B2C customers (personal accounts)
2. Serve B2B customers (team accounts)
3. Allow both (for example, like GitHub)

In the vast majority of cases, **you will want to enable billing for personal OR team accounts**. I have not seen many cases where billing both was required.

To do so, please set the following variables accordingly.

For enabling personal accounts billing only:

```bash
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=true
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=false
```

You may also want to fully disable team accounts:

```bash
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=false
```

To enable team accounts billing only:

```bash
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=false
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=true
```

To enable both, leave them both as `true`.

Please remember that for ensuring DB consistency, you need to also set them at DB level by adjusting the table `config`:

```sql
create table if not exists public.config(
    enable_team_accounts boolean default true not null,
    enable_account_billing boolean default true not null,
    enable_team_account_billing boolean default true not null,
    billing_provider public.billing_provider default 'stripe' not null
);
```

To enable personal account billing:

```sql
update config set enable_account_billing = true;
```

To enable team account billing:

```sql
update config set enable_team_account_billing = true;
```

To disable team accounts:

```sql
update config set enable_team_accounts = false;
```

To leave them both enabled, just leave them as they are.

## Contact Form submissions

To receive submissions from the contact form, you need to set up the following environment variables:

```bash
CONTACT_EMAIL=
```

This email will receive the submissions from the contact form.

## List of Environment Variables for the Web App

### NEXT_PUBLIC_SITE_URL

The URL of the site. This is used for generating absolute URLs across the site (where needed). When going to production, this should be set to the production URL - including `https` as protocol (e.g., `https://example.com`). The configuration will validate that the URL is valid - so the build will fail if the URL is not valid.

```
NEXT_PUBLIC_SITE_URL=https://example.com
```

### NEXT_PUBLIC_PRODUCT_NAME

The name of the product. This is used in various places across the site.

```
NEXT_PUBLIC_PRODUCT_NAME=Makerkit
```

### NEXT_PUBLIC_SITE_TITLE

The title of the site. This is used in the `<title>` tag of the site.

```
NEXT_PUBLIC_SITE_TITLE=Makerkit - The easiest way to start your next project
```

### NEXT_PUBLIC_SITE_DESCRIPTION

The description of the site. This is used in the `<meta name="description">` tag of the site.

```
NEXT_PUBLIC_SITE_DESCRIPTION=Makerkit is the easiest way to start your next project. It comes with everything you need to get started.
```

### NEXT_PUBLIC_DEFAULT_THEME_MODE

The default theme mode of the site. This can be either `light` or `dark` or `system` (to follow the system theme).

```
NEXT_PUBLIC_DEFAULT_THEME_MODE=light
```

### NEXT_PUBLIC_DEFAULT_LOCALE

The default locale of the site. This is used for the default language of the site.

```
NEXT_PUBLIC_DEFAULT_LOCALE=en
```

### NEXT_PUBLIC_AUTH_PASSWORD

Use this variable to enable or disable password-based authentication. If you set this to `true`, users will be able to sign up and sign in using their email and password. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_AUTH_PASSWORD=true
```

### NEXT_PUBLIC_AUTH_MAGIC_LINK

Use this variable to enable or disable magic link-based authentication. If you set this to `true`, users will be able to sign up and sign in using a magic link sent to their email. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_AUTH_MAGIC_LINK=true
```

### CONTACT_EMAIL

The email address where the contact form submissions will be sent.

```
CONTACT_EMAIL=info@makerkit.dev
```

### NEXT_PUBLIC_ENABLE_THEME_TOGGLE

Use this variable to enable or disable the theme toggle. If you set this to `true`, the theme toggle will be shown. If you set this to `false`, the theme toggle won't be shown.

```
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=true
```

### NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION

Use this variable to enable or disable personal account deletion. If you set this to `true`, users will be able to delete their personal account. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=true
```

### NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING

Use this variable to enable or disable billing for personal accounts. If you set this to `true`, users will be able to add their billing information. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=true
```

### NEXT_PUBLIC_ENABLE_TEAM_ACCOUNT_DELETION

Use this variable to enable or disable team accounts deletion. If you set this to `true`, users will be able to delete their team account. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNT_DELETION=true
```

### NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING

Use this variable to enable or disable billing for team accounts. If you set this to `true`, users will be able to add their billing information. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=true
```

### NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS

Use this variable to enable or disable team accounts. If you set this to `true`, users will be able to create team accounts. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=true
```

### NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING

Use this variable to enable or disable billing for team accounts. If you set this to `true`, users will be able to add their billing information. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=true
```

### NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION

Use this variable to enable or disable team accounts creation. If you set this to `true`, users will be able to create team accounts. If you set this to `false`, the form won't be shown.

```
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION=true
```

### NEXT_PUBLIC_ENABLE_NOTIFICATIONS

Use this variable to enable or disable notifications.

If you set this to `true`, users will be able to see the notifications dropdown. If you set this to `false`, the notifications dropdown won't be shown.

```
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### NEXT_PUBLIC_REALTIME_NOTIFICATIONS

Use this variable to enable or disable real-time notifications.

If you set it to `true` we will use Supabase Realtime to show notifications in real-time. If you set it to `false`, notifications will be fetched lazily.

This is preferable for billing reasons, as real-time notifications can be expensive.

```
NEXT_PUBLIC_REALTIME_NOTIFICATIONS=true
```

### NEXT_PUBLIC_ENABLE_VERSION_UPDATER

Use this variable to enable or disable the version updater. If enabled, the version updater will check for new versions of the app and prompt the user to update.

NB: if you use Vercel, this is redundant, as Vercel uses Skew Protection to automatically reload the page when a new version is deployed.

```
NEXT_PUBLIC_ENABLE_VERSION_UPDATER=true
```

This is disabled by default.

### NEXT_PUBLIC_SUPABASE_URL

The URL of the Supabase project.

```
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
```

### NEXT_PUBLIC_SUPABASE_ANON_KEY

The anonymous key of the Supabase project. You find this in your Supabase project settings.

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### SUPABASE_SERVICE_ROLE_KEY

The service role key of the Supabase project. You find this in your Supabase project settings.

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### NEXT_PUBLIC_BILLING_PROVIDER

The billing provider to use. This can be either `stripe` or `lemon-squeezy`.

```
NEXT_PUBLIC_BILLING_PROVIDER=stripe
```

### NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

If you are using Stripe as your billing provider, you need to set this variable to your Stripe publishable key.

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

### STRIPE_SECRET_KEY

If you are using Stripe as your billing provider, you need to set this variable to your Stripe secret key.

```
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### STRIPE_WEBHOOK_SECRET

If you are using Stripe as your billing provider, you need to set this variable to your Stripe webhook secret.

```
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

This variable is the "Signing Secret" from the Stripe webhook settings, after creating a webhook endpoint.

### LEMON_SQUEEZY_SECRET_KEY

If you are using Lemon Squeezy as your billing provider, you need to set this variable to your Lemon Squeezy secret key.

```
LEMON_SQUEEZY_SECRET_KEY=your-lemon-squeezy-secret-key
```

### LEMON_SQUEEZY_STORE_ID

If you are using Lemon Squeezy as your billing provider, you need to set this variable to your Lemon Squeezy store ID.

```
LEMON_SQUEEZY_STORE_ID=your-lemon-squeezy-store-id
```

### LEMON_SQUEEZY_SIGNING_SECRET

If you are using Lemon Squeezy as your billing provider, you need to set this variable to your Lemon Squeezy signing secret.

```
LEMON_SQUEEZY_SIGNING_SECRET=your-lemon-squeezy-signing-secret
```

### SUPABASE_DB_WEBHOOK_SECRET

This is a secret key that you must generate and set in both the the environment variable and in the Supabase webhook headers when ccreating a webhook.

This is used to verify that the webhook is coming from the correct source.

Please use any random string for this. For example, make a strong password using a password manager.

```
SUPABASE_DB_WEBHOOK_SECRET=********
```

### CMS_CLIENT

The CMS client to use. This can be either `wordpress` or `keystatic`.

```
CMS_CLIENT=keystatic
```

### WORDPRESS_API_URL

If you are using WordPress as your CMS client, you need to set this variable to your WordPress API URL.

```
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
```

### MAILER_PROVIDER

The mailer provider to use. This can be either `nodemailer` or `resend`.

```
MAILER_PROVIDER=nodemailer
```

Resend uses an HTTP API to send emails. Nodemailer uses SMTP. It is mandatory to use Resend when using the edge runtime, since it doesn't support Nodemailer, which requires a Node.js runtime.

### RESEND_API_KEY

If you are using Resend as your mailer provider, you need to set this variable to your Resend API key.

```
RESEND_API_KEY=your-resend-api-key
```

### EMAIL_SENDER

The email address to use as the sender of the emails.

```
EMAIL_SENDER=info@makerkit.dev
```

### EMAIL_HOST

If you are using Nodemailer as your mailer provider, you need to set this variable to your SMTP host.

```
EMAIL_HOST=smtp.your-email-provider.com
```

### EMAIL_PORT

If you are using Nodemailer as your mailer provider, you need to set this variable to your SMTP port.

```
EMAIL_PORT=587
```

### EMAIL_USER

If you are using Nodemailer as your mailer provider, you need to set this variable to your SMTP user.

```
EMAIL_USER=your-email-user
```

### EMAIL_PASSWORD

If you are using Nodemailer as your mailer provider, you need to set this variable to your SMTP password.

```
EMAIL_PASSWORD=your-email-password
```

### EMAIL_TLS

If you are using Nodemailer as your mailer provider, you need to set this variable to your SMTP TLS setting.

```
EMAIL_TLS=true
```

### NEXT_PUBLIC_CAPTCHA_SITE_KEY

If you want to protect your endpoints using Cloudflare's Captcha, you need to set this variable to your Captcha site key.

```
NEXT_PUBLIC_CAPTCHA_SITE_KEY=your-captcha-site-key
```

### CAPTCHA_SECRET_TOKEN

If you want to protect your endpoints using Cloudflare's Captcha, you need to set this variable to your Captcha secret token.

```
CAPTCHA_SECRET_TOKEN=your-captcha-secret-token
```

---
label: "Feature Flags"
title: "Setting your feature flags configuration"
description: "Learn how to setup the feature flags configuration of your Next.js Supabase application"
position: 4
---

The features flags configuration is set at `apps/web/config/feature-flags.config.ts`. We use this configuration to store feature flags, i.e. to enable or disable certain features in the app.

This configuration is set at application level. The configuration gets propagated to the packages that the app imports, so you can control the behavior and logic of the package. This also allows you to host multiple apps in the same monorepo, as every application defines its own configuration.

The recommendation is **to not update this directly** - instead, please define the environment variables below and override the default behavior. The configuration is validated using the Zod schema `FeatureFlagsSchema`, so if something is off, you'll see the errors.

```tsx

const featuresFlagConfig = FeatureFlagsSchema.parse({
  enableThemeToggle: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_THEME_TOGGLE,
    true,
  ),
  enableAccountDeletion: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION,
    false,
  ),
  enableTeamDeletion: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION,
    false,
  ),
  enableTeamAccounts: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS,
    true,
  ),
  enableTeamCreation: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION,
    true,
  ),
  enablePersonalAccountBilling: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING,
    false,
  ),
  enableTeamAccountBilling: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING,
    false,
  ),
  languagePriority: process.env
    .NEXT_PUBLIC_LANGUAGE_PRIORITY as LanguagePriority,
  enableNotifications: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
    true,
  ),
  realtimeNotifications: getBoolean(
    process.env.NEXT_PUBLIC_REALTIME_NOTIFICATIONS,
    false,
  ),
  enableVersionUpdater: getBoolean(
    process.env.NEXT_PUBLIC_ENABLE_VERSION_UPDATER,
    false,
  ),
} satisfies z.infer<typeof FeatureFlagsSchema>);

export default featuresFlagConfig;
```

You can update the following environment variables to override the default behavior:

```bash
NEXT_PUBLIC_ENABLE_THEME_TOGGLE=
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION=
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS=
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION=
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION=
NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING=
NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING=
NEXT_PUBLIC_LANGUAGE_PRIORITY=
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=
NEXT_PUBLIC_REALTIME_NOTIFICATIONS=
NEXT_PUBLIC_ENABLE_VERSION_UPDATER=
```

### Explanation

1. **NEXT_PUBLIC_ENABLE_THEME_TOGGLE**: use this feature if you want to set a specific theme mode (dark or light) and disallow switching to another mode
2. **NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_DELETION**: use this feature flag if you don't want users to self-delete their accounts
3. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS**: use this feature flag to enable or disable team accounts. For B2C apps, disabling may be your preference.
4. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_DELETION**: use this feature flag if you don't want users to self-delete their team accounts
5. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_CREATION**: use this feature flag to prevent users from creating a team account. This can be useful if you wish to manage the onboarding yourself.
6. **NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING**: use this feature to enable or disable the ability of personal accounts to subscribe to a plan.
7. **NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING**: use this feature to enable or disable the ability of team accounts to subscribe to a plan.
8. **NEXT_PUBLIC_LANGUAGE_PRIORITY**: use this feature to set the language priority. If set to `user`, the user's preferred language will be used. If set to `application`, the application's default language will be used.
9. **NEXT_PUBLIC_ENABLE_NOTIFICATIONS**: use this feature to enable or disable notifications in the app.
10. **NEXT_PUBLIC_REALTIME_NOTIFICATIONS**: use this feature to enable or disable real-time notifications in the app.
11. **NEXT_PUBLIC_ENABLE_VERSION_UPDATER**: use this feature to enable or disable the version updater in the app.

### Note

It is unlikely that both `NEXT_PUBLIC_ENABLE_PERSONAL_ACCOUNT_BILLING` and `NEXT_PUBLIC_ENABLE_TEAM_ACCOUNTS_BILLING` would both be enabled at once. In most cases, you want to enable it for users or team accounts.

---
label: "Paths Configuration"
title: "Setting your paths configuration"
description: "Learn how to setup the paths configuration of your Next.js Supabase application"
position: 3
---

The paths configuration is set at `apps/web/config/paths.config.ts`. This configuration stores all the paths that you'll be using in your application. It is a convenient way to store them in a central place rather than scatter them in the codebase using magic strings.

The configuration is validated using the Zod schema `PathsSchema`, so if something is off, you'll see the errors.

It **is unlikely you'll need to change this** unless you're heavily editing the codebase.

```tsx
const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    verifyMfa: '/auth/verify',
    callback: '/auth/callback',
    passwordReset: '/auth/password-reset',
    passwordUpdate: '/update-password',
  },
  app: {
    home: '/home',
    personalAccountSettings: '/home/settings',
    personalAccountBilling: '/home/billing',
    personalAccountBillingReturn: '/home/billing/return',
    accountHome: '/home/[account]',
    accountSettings: `/home/[account]/settings`,
    accountBilling: `/home/[account]/billing`,
    accountMembers: `/home/[account]/members`,
    accountBillingReturn: `/home/[account]/billing/return`,
    joinTeam: '/join',
  },
} satisfies z.infer<typeof PathsSchema>);
```
---
label: "Account Navigation Configuration"
title: "Setting your personal account navigation configuration"
description: "Learn how to setup the personal account navigation of your Next.js Supabase application"
position: 5
---

The personal account navigation is set at `apps/web/config/personal-account-navigation.config.tsx`. We use this configuration to define the navigation menu of the personal account. By default, it has three routes: home page, settings, and billing (if enabled).

We define it in one place so we can build different views at once (for example, the mobile menu).

**Please update this file to add more routes to the sidebar.**

```tsx title="apps/web/config/personal-account-navigation.config.tsx"
const routes = [
  {
    label: 'common:homeTabLabel',
    path: pathsConfig.app.home,
    Icon: <Home className={iconClasses} />,
    end: true,
  },
  {
    label: 'account:accountTabLabel',
    path: pathsConfig.app.personalAccountSettings,
    Icon: <User className={iconClasses} />,
  },
];

if (featureFlagsConfig.enablePersonalAccountBilling) {
  routes.push({
    label: 'common:billingTabLabel',
    path: pathsConfig.app.personalAccountBilling,
    Icon: <CreditCard className={iconClasses} />,
  });
}

export const personalAccountSidebarConfig = SidebarConfigSchema.parse({
  routes,
  style: process.env.NEXT_PUBLIC_USER_NAVIGATION_STYLE,
});
```

You can choose the style of the navigation by setting the `NEXT_PUBLIC_USER_NAVIGATION_STYLE` environment variable. The default style is `sidebar`.

```bash
NEXT_PUBLIC_USER_NAVIGATION_STYLE=sidebar
```

Alternatively, you can set the style to `header`:

```bash
NEXT_PUBLIC_TEAM_NAVIGATION_STYLE=header
```


---
label: "Team Account Navigation Configuration"
title: "Setting your team account navigation configuration"
description: "Learn how to setup the team account navigation of your Next.js Supabase application"
position: 6
---

The team account navigation is set at `apps/web/config/team-account-navigation.config.tsx`. We use this configuration to define the menu of the team account. By default, it has four routes: dashboard, settings, members, and billing (if enabled).

We define it in one place so we can build different views at once (for example, the mobile menu).

**Please update this file to add more routes to the sidebar.**

```tsx title="apps/web/config/team-account-navigation.config.tsx"
const getRoutes = (account: string) => [
  {
    label: 'common:dashboardTabLabel',
    path: pathsConfig.app.accountHome.replace('[account]', account),
    Icon: <LayoutDashboard className={iconClasses} />,
    end: true,
  },
  {
    label: 'common:settingsTabLabel',
    collapsible: false,
    children: [
      {
        label: 'common:settingsTabLabel',
        path: createPath(pathsConfig.app.accountSettings, account),
        Icon: <Settings className={iconClasses} />,
      },
      {
        label: 'common:accountMembers',
        path: createPath(pathsConfig.app.accountMembers, account),
        Icon: <Users className={iconClasses} />,
      },
      featureFlagsConfig.enableTeamAccountBilling
        ? {
            label: 'common:billingTabLabel',
            path: createPath(pathsConfig.app.accountBilling, account),
            Icon: <CreditCard className={iconClasses} />,
          }
        : undefined,
    ].filter(Boolean),
  },
];

export function getTeamAccountSidebarConfig(account: string) {
  return SidebarConfigSchema.parse({
    routes: getRoutes(account),
    style: process.env.NEXT_PUBLIC_TEAM_NAVIGATION_STYLE,
  });
}

function createPath(path: string, account: string) {
  return path.replace('[account]', account);
}
```

You can choose the style of the navigation by setting the `NEXT_PUBLIC_TEAM_NAVIGATION_STYLE` environment variable. The default style is `sidebar`.

```bash
NEXT_PUBLIC_TEAM_NAVIGATION_STYLE=sidebar
```

Alternatively, you can set the style to `header`:

```bash
NEXT_PUBLIC_TEAM_NAVIGATION_STYLE=header
```
---
label: "CMS API"
title: "Introducing the CMS API that allows you to pull content from your CMS"
description: "Introducing the CMS API that allows you to pull content from your CMS"
position: 3
---

To fetch content from your CMS, you can use the CMS API. The CMS API is an interface that allows you to pull content from your CMS and display it on your website. This is useful if you want to display dynamic content on your website that is stored in your CMS.

### Creating a CMS client

To create a CMS client, you can use the `createCmsClient` function. This function returns a client that you can use to fetch content from your CMS.

```tsx
import { createCmsClient } from '@kit/cms';

const client = await createCmsClient();
```

The implementation depends on the CMS you are using. By default, the CMS client uses the `keystatic` CMS. If you are using a different CMS, you can specify the CMS client to use by setting the `CMS_CLIENT` environment variable.

```
CMS_CLIENT=keystatic
```

### Fetching content items

To fetch content items from your CMS, you can use the `getContentItems` function.

```tsx
// import the createCmsClient function
import { createCmsClient } from '@kit/cms';

// create a client
const client = await createCmsClient();

// Fetch content items
const { items, count } = await client.getContentItems({
  collection: 'posts',
});
```

The `getContentItems` function takes an object with the following properties:

1. `collection` - The collection to fetch content items from.
2. `limit` - The number of content items to fetch.
3. `offset` - The offset to start fetching content items from.
4. `language` - The language to fetch content items in.
5. `sortBy` - The field to sort content items by.
6. `sortDirection` - The direction to sort content items in.
7. `status` - The status of the content items to fetch. It can be one of `published`, `draft`, `pending` or `review`. By default, only `published` content items are fetched.

```tsx
import { createCmsClient } from '@kit/cms';

const getContentItems = cache(
  async (language: string | undefined, limit: number, offset: number) => {
    const client = await createCmsClient();

    return client.getContentItems({
      collection: 'posts',
      limit,
      offset,
      language,
      sortBy: 'publishedAt',
      sortDirection: 'desc',
    });
  },
);
```

NB: how these values are used is entirely dependent on the CMS you are using. For example, Wordpress will only support `posts` or `pages` as collections.

Additionally: how the language filtering is implemented is also dependent on the CMS you are using.

### Fetching a single content item

To fetch a single content item from your CMS, you can use the `getContentItemBySlug` function.

```tsx
import { createCmsClient } from '@kit/cms';

const client = await createCmsClient();

// Fetch a single content item
const item = await client.getContentItemBySlug({
  slug: 'hello-world',
  collection: 'posts'
});
```

The `getContentItemBySlug` function takes an object with the following properties:

1. `slug` - The slug of the content item to fetch.
2. `collection` - The collection to fetch the content item from.
3. `status` (optional): The status of the content item to fetch. It can be one of `published`, `draft`, `pending` or `review`. By default, only `published` content items are fetched.

#### Rendering pages using content from your CMS

You can use the `getContentItemBySlug` function to fetch content from your CMS and render pages using that content.

For example, if you want to store your Terms and Conditions in your CMS, you can fetch the content item for the Terms and Conditions page and render the page using that content.

```tsx
import { createCmsClient } from '@kit/cms';

async function TermsAndConditionsPage() {
  const client = await createCmsClient();

  const { content, title } = await client.getContentItemBySlug({
    slug: 'terms-and-conditions',
    collection: 'pages',
  });

  return (
    <div>
      <h1>{title}</h1>
      <div>{content}</div>
    </div>
  );
}
```
---
title: "Using the CMS interface in Makerkit"
label: "CMS"
description: "The CMS library in Makerkit abstracts the implementation from where you store your data. It provides a simple API to interact with your data, and it's easy to extend and customize."
position: 0
---

Makerkit implements a CMS interface that abstracts the implementation from where you store your data. It provides a simple API to interact with your data, and it's easy to extend and customize.

By default, Makerkit ships with two CMS implementations: 

1. [Keystatic](https://keystatic.com) - a CMS that stores data in a JSON file or on your Github repository
2. [Wordpress](https://wordpress.org) - needs no introduction

You can also create your own CMS implementation by extending the `CMS` class.

By default, we use Keystatic using `local` mode (eg. storing data in a JSON file). You can change the mode to `github` to store data in your Github repository or `cloud` to use their cloud service.

Local mode is the easiest way to get started since you need no setup. However, assuming you want to use edge-rendering, you'll need to switch to a remote mode (eg. Github) or a remote-only CMS (eg. Wordpress).

---
label: "Creating your own CMS client"
title: "Creating your own CMS client with the CMS API"
description: "Learn how to create your own CMS client using the CMS API in Makerkit to fetch content from your CMS"
position: 4
---

Makerkit may not be able to accomodate everyone's preferences when it comes to CMSs. After all - there are too many to support! But that's okay - you can create your own CMS client using the CMS API in Makerkit.

To create your own CMS API, you need to implement the following methods:

```tsx
export abstract class CmsClient {
  /**
   * Retrieves content items based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of content items.
   */
  abstract getContentItems(options?: Cms.GetContentItemsOptions): Promise<{
    total: number;
    items: Cms.ContentItem[];
  }>;

  /**
   * Retrieves a content item by its ID and type.
   * @returns A promise that resolves to the content item, or undefined if not found.
   */
  abstract getContentItemBySlug(params: {
    slug: string;
    collection: string;
  }): Promise<Cms.ContentItem | undefined>;

  /**
   * Retrieves categories based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of categories.
   */
  abstract getCategories(
    options?: Cms.GetCategoriesOptions,
  ): Promise<Cms.Category[]>;

  /**
   * Retrieves a category by its slug.
   * @param slug - The slug of the category.
   * @returns A promise that resolves to the category, or undefined if not found.
   */
  abstract getCategoryBySlug(slug: string): Promise<Cms.Category | undefined>;

  /**
   * Retrieves tags based on the provided options.
   * @param options - Options for filtering and pagination.
   * @returns A promise that resolves to an array of tags.
   */
  abstract getTags(options?: Cms.GetTagsOptions): Promise<Cms.Tag[]>;

  /**
   * Retrieves a tag by its slug.
   * @param slug - The slug of the tag.
   * @returns A promise that resolves to the tag, or undefined if not found.
   */
  abstract getTagBySlug(slug: string): Promise<Cms.Tag | undefined>;
}
```

For a detailed view of the CMS interface, please refer to the API at `packages/cms/core/src/cms-client.ts`.

For example, let' assume you have an HTTP API to a private repository you can access at `https://my-cms-api.com`. You can create a CMS client that interacts with this API as follows:

```tsx
import { CmsClient } from '@kit/cms';

export class MyCmsClient implements CmsClient {
  async getContentItems(options) {
    const response = await fetch('https://my-cms-api.com/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const { total, items } = await response.json();

    return { total, items };
  }

  async getContentItemBySlug({ slug, collection }) {
    const response = await fetch(
      `https://my-cms-api.com/content/${collection}/${slug}`,
    );

    if (response.status === 404) {
      return undefined;
    }

    return response.json();
  }

  async getCategories(options) {
    const response = await fetch('https://my-cms-api.com/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    return response.json();
  }

  async getCategoryBySlug(slug) {
    const response = await fetch(`https://my-cms-api.com/categories/${slug}`);

    if (response.status === 404) {
      return undefined;
    }

    return response.json();
  }

  async getTags(options) {
    const response = await fetch('https://my-cms-api.com/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    return response.json();
  }

  async getTagBySlug(slug) {
    const response = await fetch(`https://my-cms-api.com/tags/${slug}`);

    if (response.status === 404) {
      return undefined;
    }

    return response.json();
  }
}
```

Of course, you can do the same using SDKs of your preferred CMS client, such as Payload CMS, Strapi, Sanity, and so on.

---
title: "Using KeyStatic in Makerkit"
label: "Keystatic"
description: "KeyStatic is a CMS that stores data in a JSON file or on your Github repository. It's the default CMS implementation in Makerkit."
position: 1
---

This implementation is used when the host app's environment variable is set as:

```bash
CMS_CLIENT=keystatic
```

Additionally, the following environment variables may be required:

```bash
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=local # local, cloud, github
KEYSTATIC_PATH_PREFIX=apps/web
NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH=./content # apps/web/content
```

You can also use Keystatic Cloud or GitHub as the storage kind as remote storage.

If `KEYSTATIC_STORAGE_KIND` is set to `cloud`, the following environment variables are required:

```bash
KEYSTATIC_STORAGE_KIND=cloud
KEYSTATIC_STORAGE_PROJECT=project-id
```

If `KEYSTATIC_STORAGE_KIND` is set to `github`, the following environment variables are required:

```bash
NEXT_PUBLIC_KEYSTATIC_STORAGE_KIND=github
NEXT_PUBLIC_KEYSTATIC_STORAGE_REPO=makerkit/next-supabase-saas-kit-turbo-demo
NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH=./content
KEYSTATIC_GITHUB_TOKEN=github_**********************************************
KEYSTATIC_PATH_PREFIX=apps/web
```

Of course, you need to replace the `NEXT_PUBLIC_KEYSTATIC_STORAGE_REPO` and `KEYSTATIC_GITHUB_TOKEN` with your own values.

GitHub mode requires the installation of a GitHub app for displaying the admin.

Please refer to the [Keystatic documentation](https://keystatic.com/docs/github-model) for more information.

If your content folder is not at `content`, you can set the `NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH` environment variable to the correct path. For example, if your content folder is at `data/content`, you can set the `NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH` environment variable as:

```bash
NEXT_PUBLIC_KEYSTATIC_CONTENT_PATH=data/content
```

## Adding the Keystatic admin to your app

To add the Keystatic admin to your app, please run the following command:

```bash
turbo gen keystatic
```

Your app will now have a new route at `/keystatic` where you can manage your content.

**Note**: your Github token must have permissions to read to the repository (for read-only).

---
title: "Using Wordpress in Makerkit"
label: "Wordpress"
description: "Wordpress is a popular CMS that you can use with Makerkit. Learn how to set it up and use it in your project."
position: 2
---

The Wordpress implementation is used when the host app's environment variable is set as:

```bash
CMS_CLIENT=wordpress
```

Additionally, please set the following environment variables:

```bash
WORDPRESS_API_URL=http://localhost:8080
```

For development purposes, we ship a Docker container that runs a Wordpress instance. To start the container, run:

```bash
docker-compose up
```

or

```bash
pnpm run start
```

from this package's root directory.

The credentials for the Wordpress instance are:

```bash
WORDPRESS_DB_HOST=db
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_NAME=wordpress
```

You will be asked to set up the Wordpress instance when you visit `http://localhost:8080` for the first time.

## Note for Wordpress REST API

To make the REST API in your Wordpress instance work, please change the permalink structure to `/%post%/` from the Wordpress admin panel.

## Blog

To include Blog Posts from Wordpress - please create a **post** with category named `blog` and add posts to it.

## Documentation

To include Documentation from Wordpress - please create a **page** with category named `documentation` and add pages to it.

This **involves enabling categories for pages. To do this, add the following code to your theme's `functions.php` file:

```php
function add_categories_to_pages() {
    register_taxonomy_for_object_type('category', 'page');
}
add_action('init', 'add_categories_to_pages');
```

Please refer to `wp-content/themes/twentytwentyfour/functions.php` for an example of a theme that includes this code.

## Language Filtering

To make the language filtering work, please add a tag with the language name to the post. For example, if you have a post in English, add the tag `en` to it, and if you have a post in German, add the tag `de` to it.
---
label: "Adding Shadcn UI components"
title: "How to add new Shadcn UI components to your Next.js Supabase application"
position: 2
description: "Update your Next.js Supabase application with new Shadcn UI components"
---

To install a Shadcn UI component, you can use the following command:

```bash
npx shadcn@latest add <component> -c ./packages/ui
```

For example, to install the `Button` component, you can use the following command:

```bash
npx shadcn@latest add button -c ./packages/ui
```

We pass the `--path` flag to specify the path where the component should be installed. You may need to adjust the path based on your project structure.

### Update the imports

**NB**: you may need to update the imports to the `cn` utility function to use the relative imports because it somehow breaks. Please do that.

### Export the component

To achieve optimal tree-shaking, we export each component individually using the `exports` field in the `package.json` file. This allows you to import the component directly from the package.

Once the component has been created, you can export by adding a new export to the `package.json` file.

We assume that the component is located at `src/shadcn/avatar.tsx`. To export the component, you can append a new export field to the `exports` map inside the `package.json` file:

```json
{
  "exports": {
    "./avatar": "./src/shadcn/avatar.tsx"
  }
}
```

Now you can import it directly from the package:

```tsx
import { Avatar } from '@kit/ui/avatar';
```

**NB**: this is an example, you need to adjust the component name based on the component you are exporting.
---
label: "Updating Fonts"
title: "Update the default fonts of your SaaS"
position: 3
description: "Learn how to update the fonts of your Makerkit application"
---

By default, Makerkit uses two fonts:

1. `font-sans`: using Apple's default font on Apple devices, or `Inter` on others
2. `font-heading`: uses `Urbanist` from Google Fonts

The fonts are defined at `apps/web/lib/fonts.ts`:

```tsx
import { Urbanist as HeadingFont, Inter as SansFont } from 'next/font/google';

/**
 * @sans
 * @description Define here the sans font.
 * By default, it uses the Inter font from Google Fonts.
 */
const sans = SansFont({
  subsets: ['latin'],
  variable: '--font-sans',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
});

/**
 * @heading
 * @description Define here the heading font.
 * By default, it uses the Urbanist font from Google Fonts.
 */
const heading = HeadingFont({
  subsets: ['latin'],
  variable: '--font-heading',
  fallback: ['system-ui', 'Helvetica Neue', 'Helvetica', 'Arial'],
  preload: true,
  weight: ['500', '700'],
});

// we export these fonts into the root layout
export { sans, heading };
```

To display a different font, please replace the imports from `next/font/google` if the font is there.

## Removing Apple's system as default font on Apple Devices

To set another font instead of Apple's system font, update the Tailwind configuration.

Open `tooling/tailwind/index.ts` and replace the line:

```
sans: ['-apple-system', 'var(--font-sans)', ...fontFamily.sans],
```

to

```
sans: ['var(--font-sans)', ...fontFamily.sans],
```
---
label: "Layout Style"
title: "Update the default layout style of your SaaS"
position: 4
description: "Learn how to update the default layout style of your Makerkit application"
---

By default, Makerkit uses the `sidebar` layout style for both the user and the team workspaces.

You can change the layout style by setting the `NEXT_PUBLIC_USER_NAVIGATION_STYLE` and `NEXT_PUBLIC_TEAM_NAVIGATION_STYLE` environment variables. The default style is `sidebar`.

To set the layout style to `header`, update the environment variables:

```bash
NEXT_PUBLIC_TEAM_NAVIGATION_STYLE=header
NEXT_PUBLIC_USER_NAVIGATION_STYLE=header
```

The default layout style is `sidebar`:

<Image src='/assets/images/docs/turbo-sidebar-layout.webp' width="2522" height="1910" />

And here is `header` layout:

<Image src='/assets/images/docs/turbo-header-layout.webp' width="3282" height="1918" />

---
label: "Updating the Logo"
title: "Updating the default application logo in your Makerkir application"
position: 1
description: "Updating the default application logo in your Makerkit application"
---

Of course - you'd like to have your own logo in your application. To do so, please update the component at `apps/web/components/app-logo.tsx` with your own logo.

You can either use an SVG component, or drop an image, or anything really. As long as it's rendered within this component, it doesn't matter how you do it.

The logo image will be used across the application, including the auth page, the site header, the site footer, and the app sidebar (when team accounts are disabled).

---
label: "Updating the theme"
title: "Updating the Shadcn theme in your Makerkit Application"
position: 0
description: "How to update the theme in your Makerkit application"
---

Makerkit uses [Shadcn UI](https://ui.shadcn.com) and it defines the theme according to its guidelines.

You can find the default theme inside the application at `apps/web/styles/global.css`.

If you want to override the default style, either define your own colors or pick a theme from the [Shadcn Themes page](https://ui.shadcn.com/themes), and copy/paste the theme into this file.
---
title: "Captcha Protection for your API Routes"
label: "Captcha Protection"
position: 6
---

For captcha protection, we use Cloudflare Turnstile. To enable it, you need to set the following environment variables:

```bash
CAPTCHA_SECRET_TOKEN=
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
```

You can find the `CAPTCHA_SECRET_TOKEN` in the Turnstile configuration. The `NEXT_PUBLIC_CAPTCHA_SITE_KEY` is public and safe to share. Instead, the `CAPTCHA_SECRET_TOKEN` should be kept secret.

This guide assumes you have correctly set up your Turnstile configuration. If you haven't, please refer to the [Turnstile documentation](https://developers.cloudflare.com/turnstile).

## Authentication

When you set the token in the environment variables, the kit will automatically protect your API routes with captcha.

**NB**: you also need to set the token in the Supabase Dashboard!

## Retrieving the Token

To retrieve the captcha token, you can use the `useCaptchaToken` function from `@kit/auth/captcha/client`:

```tsx
import { useCaptchaToken } from '@kit/auth/captcha/client';

function MyComponent() {
  const { captchaToken } = useCaptchaToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/my-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-captcha-token': captchaToken,
      },
      body: JSON.stringify({ message: 'Hello, world!' }),
    });
  };

  // your component code
}
```

When using Server Actions, use `enhanceAction` from `@kit/next/actions`:

```tsx
const MySchema = z.object({
  message: z.string(),
  captchaToken: z.string().min(1),
});

export const myServerAction = enhanceAction(async (data) => {
  // your action code
}, {
  captha: true,
  schema: MySchema
});
```

When calling the server action, you need to pass the captcha:

```tsx
function MyForm() {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
       const response = await myServerAction({
        message: 'Hello, world!',
        captchaToken,
      });
    } finally {
      // always reset the token!
      resetCaptchaToken();
    }
  };

  // your component code
}
```

A token is valid for one request only. You need to reset the token after each request.

The library will take care of renewing the token automatically when needed - but you need to reset it manually when consuming the token.

## Resetting the Token

The underlying library [React Turnstile](https://github.com/marsidev/react-turnstile) resets the token automatically - but we need to reset it manually when actually consuming the token since the token is only valid for one request. 

To reset the token, please call `resetCaptchaToken` from the `useCaptchaToken` hook - as shown in the example above.

You should be doing so in all situations, whether the request was successful or not.

## Verifying the Token

To verify the captcha manually server-side, please use the following code:

```tsx
import { verifyCaptchaToken } from '@kit/auth/captcha/server';

function assertCaptchaValidity(request: Request) {
  const token = request.headers.get('x-captcha-token');

  await verifyCaptchaToken(token);
}
```

If you use the utilities provided by the kit `enhanceAction` and `enhanceRouteHandler`, you don't need to worry about this, as the kit will automatically verify the captcha token for you (as long as it is passed).

---
title: "CSRF Protection for your API Routes"
label: "CSRF Protection"
position: 5
---

By default, all POST, PUT, PATCH and DELETE requests to your API routes are protected against CSRF attacks. This means that you need to send a CSRF token with your requests, otherwise they will be rejected.

There are two exceptions to this rule:

1. When using Server Actions, protection is built-in and you don't need to worry about it.
2. When the route is under the `api` path. In this case, the CSRF protection is disabled, since we use this prefix for webhooks or external services that need to access your API.

When using requests against API Route Handlers, you need to pass the CSRF token with your requests, otherwise the middleware will reject them.

To retrieve the CSRF token, you can use the `useGetCsrfToken` function from `@kit/shared/hooks`:

```tsx
'use client';

function MyComponent() {
  const csrfToken = useGetCsrfToken();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/my-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify({ message: 'Hello, world!' }),
    });
  };

  // your component code
}
```
---
title: "Using API Route Handlers in the Next.js Supabase SaaS Kit"
label: "Route Handlers"
description: "Learn how to write Route Handlers in the Next.js Supabase SaaS Kit to fetch and write data"
position: 2
---

API Route handlers are added using the convention `route.ts` and exporting one or many HTTP methods (e.g., `GET`, `POST`, `PUT`, `DELETE`).

While you won't be writing too many API route handlers (prefer Server Actions for mutations) - you can use the `enhanceRouteHandler` utility to help you with the following:

1. checks the user state (if the user is authenticated)
2. given a Zod schema, it validates the request body
3. given a captcha site key, it validates the captcha token
4. report an uncaught exception to the monitoring provider (if configured)

Fantastic, let's see how we can use it.

```tsx
import { z } from 'zod';

import { enhanceRouteHandler } from '@kit/next/routes';
import { NextResponse } from 'next/server';

const ZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const POST = enhanceRouteHandler(
  async function({ body, user, request }) {
    // 1. "body" has been validated against the Zod schema, and it's safe to use
    // 2. "user" is the authenticated user
    // 3. "request" is the request object that contains the headers, query, etc.

    // ... your code here
    return NextResponse.json({
      success: true,
    });
  },
  {
    schema: ZodSchema,
  },
);
```

### Using a Captcha token protection

If you want to protect your API route handlers with a captcha token, you can do so by passing the captcha site token to the `enhanceRouteHandler` function and setting the `captcha` flag to `true`.

```tsx
import { enhanceRouteHandler } from '@kit/next/routes';

export const POST = enhanceRouteHandler(
  async function({ body, user, request }) {
    // ... your code here
    return NextResponse.json({
      success: true,
    });
  },
  {
    captcha: true,
    schema: ZodSchema,
  },
);
```

When calling the API route handler, we must supply the captcha token in the request body.

The captcha token can be retrieved from the `useCaptchaToken` hook in the package `@kit/auth/captcha/client`.

```tsx
import { useCaptchaToken } from '@kit/auth/captcha/client';

function Component() {
  const captchaToken = useCaptchaToken();
  
  // ... your code here
}
```

Now, when calling the API route handler, we can pass the captcha and the CSRF token.

NB: The CSRF token **must be added for all API routes** making mutations in routes that are outside `/api/*`. Routes inside `/api/*` are not protected by default as they're meant to be used externally.

```tsx
import { useCaptchaToken } from '@kit/auth/captcha/client';
import { useCsrfToken } from '@kit/shared/hooks';

function Component() {
  const captchaToken = useCaptchaToken();
  const csrfToken = useCsrfToken();
  
  const onSubmit = async (params: {
    email: string;
    password: string;
  }) => {
    const response = await fetch('/my-api-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-csrf-token': csrfToken,
        'x-captcha-token': captchaToken,
      },
      body: JSON.stringify(params),
    });
    
    // ... your code here
  };
  
  // ... your code here
}
```

You can improve the above using React Query:

```tsx
import { useMutation } from '@tanstack/react-query';
import { useCaptchaToken } from '@kit/auth/captcha/client';

function Component() {
  const captchaToken = useCaptchaToken();
  const mutation = useMutateData();

  const onSubmit = async (params: {
    email: string;
    password: string;
  }) => {
    await mutation.mutateAsync(params);
  };
  
  // ... your code here
}

function useMutateData() {
  return useMutation({
    mutationKey: 'my-mutation',
    mutationFn: async (params: { email: string; password: string }) => {
      const response = await fetch('/my-api-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-captcha-token': captchaToken,
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('An error occurred');
      }

      return response.json();
    },
  });
}
```

NB: to use Captcha protection, you need to set the captcha token in the environment variables.

```bash
CAPTCHA_SECRET_TOKEN=
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
```

As a secret environment variable, please do not add it to the `.env` file. Instead, add it to the environment variables of your CI/CD system.

The only captcha provider supported is Cloudflare Turnstile.

## Capturing Exceptions

This function **automatically reports uncaught exceptions** if you configured a monitoring provider. The monitoring provider is set in the environment variable `MONITORING_PROVIDER`.

To disable it, pass `captureException: false` to the `enhanceAction` function.

```tsx {12}
import { enhanceRouteHandler } from '@kit/next/routes';

export const POST = enhanceRouteHandler(
  async function({ body, user, request }) {
    // ... your code here
    return NextResponse.json({
      success: true,
    });
  },
  {
    captcha: true,
    captureException: false,
    schema: ZodSchema,
  },
);
```
---
title: "Using Server Actions in the Next.js Supabase SaaS Kit"
label: "Server Actions"
description: "Learn how to write Server Actions to mutate and revalidate your data"
position: 1
---

Server Actions help us communicate with the server just by creating normal Javascript functions that Next.js converts to server POST endpoints. They are particularly useful to mutate data and revalidate the data that we fetched from Server Components.

Generally speaking, there is nothing special in Makerkit compared to any other Next.js application in how you will use Server Actions. However, I want to introduce you to a nifty utility to make your life easier while writing Server Actions: `enhanceAction`.

Let's first introduce Server Actions.

In the large majority of cases - you will be writing React Server Actions to update data in your DB. Server Actions are used to perform mutations on the server-side - while being called like normal functions.

To create a server action, it's enough to add `use server` at the top of the file and export the function.

```tsx
'use server';

// I am now a server action!
export const myServerAction = async function () {
  // ... your code here
  return {
    success: true,
  };
};
```

The above is a plain POST request that basically does nothing. Let's see how we can make it more useful.

Makerkit ships with a utility to help you write these actions. The utility is called `enhanceAction` and we import it from `@kit/next/actions`.

```tsx
import { enhanceAction } from '@kit/next/actions';
```

This utility helps us with three main things:
1. checks the user state (if the user is authenticated)
2. given a Zod schema, it validates the request body
3. given a captcha site key, it validates the captcha token
4. if you configured a monitoring provider, it sends the caught exception to the monitoring provider

Fantastic, let's see how we can use it.

```tsx
'use server';

import { z } from 'zod';
import { enhanceAction } from '@kit/next/actions';

const ZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const myServerAction = enhanceAction(
  async function (data, user) {
    // 1. "data" has been validated against the Zod schema, and it's safe to use
    // 2. "user" is the authenticated user
    
    // ... your code here
    return {
      success: true,
    };
  },
  {
    schema: ZodSchema,
  },
);
```

### Using a Captcha token protection

If you want to protect your server actions with a captcha token, you can do so by passing the captcha site token to the `enhanceAction` function and setting the `captcha` flag to `true`.

```tsx
'use server';

import { enhanceAction } from '@kit/next/actions';

export const myServerAction = enhanceAction(
  async function (data, user) {
    // ... your code here
    return {
      success: true,
    };
  },
  {
    captcha: true,
    schema: ZodSchema,
  },
);
```

When calling the server action, we must supply the captcha token in the request body.

The captcha token can be retrieved from the `useCaptchaToken` hook in the package `@kit/auth/captcha/client`.

```tsx
import { useCaptchaToken } from '@kit/auth/captcha/client';

function Component() {
  const captchaToken = useCaptchaToken();
  
  // ... your code here
}
```

Now, when calling the server action, we can pass the captcha

```tsx
import { useCaptchaToken } from '@kit/auth/captcha/client';

function Component() {
  const captchaToken = useCaptchaToken();
  
  const onSubmit = async (params: {
    email: string;
    password: string;
  }) => {
    const response = await myServerAction({
      ...params,
      captchaToken,
    });
    
    // ... your code here
  };
}
```

NB: to use Captcha protection, you need to set the captcha token in the environment variables.

```bash
CAPTCHA_SECRET_TOKEN=
NEXT_PUBLIC_CAPTCHA_SITE_KEY=
```

As a secret environment variable, please do not add it to the `.env` file. Instead, add it to the environment variables of your CI/CD system.

The only captcha provider supported is Cloudflare Turnstile.

#### Passing the Captcha Token

NB: you must pass the captcha token in the request body when calling the server action. The function's type checker will ensure that you pass the captcha token as it will error out if the token is not defined in the Zod schema as `captchaToken`.

## Capturing Exceptions

This function **automatically reports uncaught exceptions** if you configured a monitoring provider. The monitoring provider is set in the environment variable `MONITORING_PROVIDER`.

To disable it, pass `captureException: false` to the `enhanceAction` function.

```tsx {14}
'use server';

import { enhanceAction } from '@kit/next/actions';

export const myServerAction = enhanceAction(
  async function (data, user) {
    // ... your code here
    return {
      success: true,
    };
  },
  {
    captcha: true,
    captureException: false,
    schema: ZodSchema,
  },
);
```
---
title: "Fetching data from Server Components"
label: "Server Components"
position: 3
---

Server Components are the primary way we fetch and render data in the Next.js Supabase SaaS kit. 

When you create a new page and want to fetch some data, Server Components are the perfect place where to fetch it: it is done when you render your page (which means one less round-trip) and the data is streamed to the client (so it's very fast).

In Next.js, every component is a Server Component, unless you specify `use client`, which converts it to a client component. Client components are also server-rendered, however they're also rendered on the client. Server Components are only rendered on the server - so we can use data-fetching methods (using Supabase, in our case) and fetch all the required data for a particular layout or page.

For example, let's assume we have a page that displayes a list of tasks from a `tasks` table. This is a Next.js page, and therefore a Server Component. This means, it runs on the server and on the server only, and we can use to fetch data and render it streamed to the client. The client will never run the React code in this component: it will receive it and render it.

```tsx
export default async function TasksPage() {}
```

Let's now fetch some data from Supabase. To do so, we use the server component client.

```tsx
const supabase = getSupabaseServerClient();

const { data, error } = await supabase.from('tasks').select('*');
```

Now, let's put it all together:

```tsx
export default async function TasksPage() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.from('tasks').select('*');

  if (error) {
    return <p>Error :(</p>;
  }

  return <TasksList data={data}>
}
```

As you can see, we are fetching data and rendering it in `TasksList`. All on the server.
---
title: "Supabase Clients"
label: "Supabase Clients"
description: "Using Supabase with different clients"
position: 0
---

Before diving into the various ways we can communicate with the server, we need to introduce how we communicate with Supabase, which is hosting the database and therefore the source of our data.

## Using the Supabase client

Depending on whether you are running your code in the browser or on the server, you will need to use different clients to interact with Supabase.

### Using the Supabase client in the browser

To import the Supabase client in a browser environment,  you can use the `useSupabase` hook:

```tsx
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

export default function Home() {
  const supabase = useSupabase()

  return (
    <div>
      <h1>Supabase Browser Client</h1>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  )
}
```

### Using the Supabase client in a Server environment

To import the Supabase client in a server environment, you can use the `getSupabaseServerClient` function, and you can do the same across all server environments like Server Actions, Route Handlers, and Server Components:

```tsx
import { getSupabaseServerClient } from '@kit/supabase/server-client';

export async function myServerAction() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase.from('users').select('*')

  return {
    success: true,
  };
}
```

To use the Server Admin, e.g. an admin client with elevated privileges, you can use the `getSupabaseServerAdminClient` function:

```tsx
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

export async function myServerAction() {
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase.from('users').select('*')

  return {
    success: true,
  };
}
```

NB: The `getSupabaseServerAdminClient` function should only be used in server environments, as it requires the `SUPABASE_SERVICE_ROLE_KEY` environment variable to be set. Additionally, it should only be used in very exceptional cases, as it has elevated privileges. In most cases, please use the `getSupabaseServerClient` function.

### DEPRECATED: Older Versions of the Kit

In older versions of the kit, you may see different ways of importing the Supabase client. The code below will work, but please note that it is deprecated and will be removed in future versions of the kit.

Depending on where your code runs, you may need to use different clients to interact with Supabase. This is due to how cookies are set differently in various parts of the Next.js application.

You can use 4 different clients to interact with Supabase:

1. **Browser** - This runs in the browser and is used to interact with Supabase from the client
2. **Server Actions** - This runs in Server Actions and is used to interact with Supabase from the server
3. **Route Handlers** - This runs in Route Handlers and is used to interact with Supabase from the server
4. **Server Components** - This runs in Server Components and is used to interact with Supabase from the server

## Browser

To use the browser client, use the `useSupabase` hook:

```tsx
import { useSupabase } from '@kit/supabase/hooks/use-supabase';

export default function Home() {
  const supabase = useSupabase()

  return (
    <div>
      <h1>Supabase Browser Client</h1>
      <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </div>
  )
}
```

## Server Actions

To use the server actions client, use the `useSupabase` hook:

```tsx
'use server';

import { getSupabaseServerActionClient } from '@kit/supabase/server-actions-client';

export async function myServerAction() {
  const supabase = getSupabaseServerActionClient();

  const { data, error } = await supabase.from('users').select('*')

  return {
    success: true,
  };
}
```

## Route Handlers

To use the route handlers client, use the `getSupabaseRouteHandlerClient` function:

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseRouteHandlerClient } from '@kit/supabase/route-handlers-client';

export async function POST(req: NextRequest) {
  const supabase = getSupabaseRouteHandlerClient();

  const { data, error } = await supabase.from('users').select('*')

  return NextResponse.json({ data });
}
```

## Server Components

To use the server components client, use the `getSupabaseServerComponentClient` function:

```tsx
import { getSupabaseServerComponentClient } from '@kit/supabase/server-component-client';

export default async function TasksPage() {
  const supabase = getSupabaseServerComponentClient();

  const { data, error } = await supabase.from('users').select('*');

  return <TasksList tasks={data} />
}
```
---
label: "Adding a Turborepo application"
title: "Add a new Turborepo application to your Makerkit application"
description: "Learn how to add a new Turborepo application to your Makerkit application"
position: 12
---

This is an **advanced topic** - you should only follow these instructions if you are placing a new app within your monorepo and want to keep pulling updates from the Makerkit repository.

In some ways - creating a new repository may be the easiest way to manage your application. However, if you want to keep your application within the monorepo and pull updates from the Makerkit repository, you can follow these instructions.

---

To pull updates into a separate application outside of `web` - we can use `git subtree`.

Basically, we will create a subtree at `apps/web` and create a new remote branch for the subtree. When we create a new application, we will pull the subtree into the new application. This allows us to keep it in sync with the `apps/web` folder.

### 1. Create a subtree

First, we need to create a subtree for the `apps/web` folder. We will create a new branch called `web` and create a subtree for the `apps/web` folder. We will create a branch named `web-branch` and create a subtree for the `apps/web` folder.

```bash
git subtree split --prefix=apps/web --branch web-branch
```

### 2. Create a new application

Now, we can create a new application in the `apps` folder. For example, let's create a new application called `api`.

Let's say we want to create a new app `pdf-chat` at `apps/pdf-chat` with the same structure as the `apps/web` folder (which acts as the template for all new apps).

```bash
git subtree add --prefix=apps/pdf-chat origin web-branch --squash
```

You should now be able to see the `apps/pdf-chat` folder with the contents of the `apps/web` folder.

### 3. Update the new application

When you want to update the new application, follow these steps:

#### Pull updates from the Makerkit repository

The command below will update all the changes from the Makerkit repository:

```bash
git pull upstream main
```

#### Push the web-branch updates

After you have pulled the updates from the Makerkit repository, you can split the branch again and push the updates to the `web-branch`:

```bash
git subtree split --prefix=apps/web --branch web-branch
```

Now, you can push the updates to the `web-branch`:

```bash
git push origin web-branch
```

#### Pull the updates to the new application

Now, you can pull the updates to the new application:

```bash
git subtree pull --prefix=apps/pdf-chat origin web-branch --squash
```

---
label: "Adding a Turborepo package"
title: "Add a new Turborepo package to your Makerkit application"
description: "Learn how to add a new Turborepo package to your Makerkit application"
position: 11
---

This is an **advanced topic** - you should only follow these instructions if you are sure you want to add a new package to your Makerkit application instead of adding a folder to your application in `apps/web`. You don't need to do this to add a new page or component to your application.

---

To add a new package to your Makerkit application, you need to follow these steps.

First, enter the command below to create a new package in your Makerkit application:

```bash
turbo gen
```

Turborepo will ask you to enter the name of the package you want to create. Enter the name of the package you want to create and press enter.

If you don't want to add dependencies to your package, you can skip this step by pressing enter.

The command will have generated a new package under `packages` named `@kit/<package-name>`. If you named it `my-package`, the package will be named `@kit/my-package`.

Finally, to make fast refresh work when you make changes to the package, you need to add the package to the `next.config.mjs` file in the root of your Makerkit application `apps/web`.

```tsx
const INTERNAL_PACKAGES = [
  // all internal packages,
  '@kit/my-package',
];
```

## Exporting a module from a package

By default, the package exports a single module using the `index.ts` file. You can add more exports by creating new files in the package directory and exporting them from the `index.ts` file or creating export files in the package directory and adding them to the `exports` field in the `package.json` file.

### Exporting a module from index.ts

The easiest way to export a module from a package is to create a new file in the package directory and export it from the `index.ts` file.

```tsx
// packages/@kit/my-package/src/my-module.ts

export function myModule() {
  return 'Hello from my module';
}
```

Then, export the module from the `index.ts` file.

```tsx
// packages/@kit/my-package/src/index.ts
export * from './my-module';
```

### Exporting using the exports field in package.json

This can be very useful for tree-shaking. Assuming you have a file named `my-module.ts` in the package directory, you can export it by adding it to the `exports` field in the `package.json` file.

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./my-module": "./src/my-module.ts"
  }
}
```

When to do this?

1. when exporting two modules that don't share dependencies to ensure better tree-shaking. For example, if your exports contains both client and server modules.
2. for better organization of your package


For example, create two exports `client` and `server` in the package directory and add them to the `exports` field in the `package.json` file.

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts",
    "./server": "./src/server.ts"
  }
}
```

1. The `client` module can be imported using `import { client } from '@kit/my-package/client'`
2. The `server` module can be imported using `import { server } from '@kit/my-package/server'`

You can now use the package in your application by importing it using the package name.

```tsx
import { myModule } from '@kit/my-package';

console.log(myModule());
```

Et voilà! You have successfully added a new package to your Makerkit application. 🎉

---
label: "Starting developing your App"
position: 0
title: "How to approach local development"
description: "How to approach local development"
---

In the previous sections, you learned how to clone the repository, set environment variables, customize the look and feel of the app, and some basic API that you'll be using throughout the app. 

In this section, you'll learn how to start developing your app locally.

Buckle up, we have a lot to do!

---

Generally speaking, you will be doing the following:

1. **Customization**: Set environment variables (application name, feature flags). This is a quick starting point that will start turning Makerkit into your very own app.
2. **Database**: Drawing and writing the database schema. Of course, your app will store data and have its schema. It's time to draw it.
3. **Routing**: Adding new routes. Your new pages will need routes - unless you can reuse the "home" pages of the accounts.
4. **Fetching Data**: Fetching data from your DB and displaying it onto the new routes.
5. **Writing Data** Adding new forms. You will need to add forms to create new data.

In 90% of cases, the above is what you will be doing. The remaining 10% is adding new (very specific) features, which are a bit more complex - and not relevant to Makerkit itself.
---
label: "Database Functions"
position: 3
title: "Database Functions available in your Next.js Supabase schema"
description: "Learn the most useful database functions in your schema"
---

The database schema contains several functions that you can use so that you can extend your database with custom logic and RLS.

## Check if a user is the Owner of an Account

This function checks if the user is the owner of an account. It is used in the `accounts` table to restrict access to the account owner.

```sql
public.is_account_owner(account_id uuid)
```

This is `true` if the account is the user's account or if the user created a team account.

## Check if a user is a Member of an Account

This function checks if the user is a member of an account. It is used in the `accounts` table to restrict access to the account members.

```sql
public.has_role_on_account(
  account_id uuid,
  account_role varchar(50) default null
)
```

If the `account_role` is not provided, it will return `true` if the user is a member of the account. If the `account_role` is provided, it will return `true` if the user has the specified role on the account.

## Check if a user is a team member of an Account

Check if a user is a member of a team account. It is used in the `accounts` table to restrict access to the team members.

```sql
public.is_team_member(
  account_id uuid,
  user_id uuid
)
```

### Check if an account has permissions to action another account

This function checks if an account has permissions to action another account. It is used in the `accounts` table to restrict access to the account owner.

```sql
public.can_action_account_member(
  target_team_account_id uuid,
  target_user_id uuid
)
```

This function will:

1. check if the current user is the owner of the target account: if so, return `true`
2. check if the target user is the owner of the target account: if so, return `false`
3. compare the hierarchy of the roles between the two accounts: if the current user has a higher role than the target user, return `true`

This is useful to check if a user can remove another user from an account, or any other action that requires permissions.

### Check Permissions

Check if a user has a specific permission on an account.

```sql
public.has_permission(
  user_id uuid,
  account_id uuid,
  permission_name app_permissions
)
```

This function will return `true` if the user has the specified permission on the account.

The permissions are specified in the enum `app_permissions`. You can extend this enum to add more permissions.

### Check if a configuration is set

Check if a configuration is set in the `public.config` table.

```sql
public.is_set(
  field_name text
)
```

### Check if an account has an active subscription

Check if an account has an active subscription.

```sql
public.has_active_subscription(
  account_id uuid
)
```

This means that the subscription status is either `active` or `trialing`. In other words, the account billing is in good standing (eg. no unpaid invoice)

This is important because just checking if the subscription exists is not enough. You need to check if the subscription is active, as the status can vary (eg. `canceled`, `incomplete`, `incomplete_expired`, `past_due`, `unpaid`)
---
label: "Database Schema"
position: 2
title: "How to create new migrations and update the database schema in your Next.js Supabase application"
description: "Learn how to create new migrations and update the database schema in your Next.js Supabase application"
---

After creating your migration, it's time to add the required code.

In our example, we create the schema for a simple tasks application.

### Permissions

Makerkit defines a set of default permissions in an enum named `public.app_permissions`.

To add more permissions for your app, please update the enum:

```sql
-- insert new permissions
alter type public.app_permissions add value 'tasks.write';
alter type public.app_permissions add value 'tasks.delete';
commit;
```

In the case above, we added the permissions `tasks.write` and `tasks.delete`. We can use these in our RLS rules to make sure
the permissions are able to restrict access.

### Tasks Table

Let's now add the new `tasks` table

```sql
-- create tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title varchar(500) not null,
  description varchar(50000),
  done boolean not null default false,
  account_id uuid not null references public.accounts(id),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

grant select, insert, update, delete on table public.tasks to
    authenticated, service_role;
```

Let's explain:
- 1. `uuid` is a primary key generated automatically
- 2. `title` is a text field constrained to 500 chars. `not null` makes sure it cannot be null.
- 3. `description` is a text field constrained to 50000
- 4. `done` is a boolean field
- 5. `account_id` is the account that owns the task

We then add the required permissions to the roles `authenticated` and `service_role`.

Anonymous users have no access to this table.

### Accounts

Accounts are the primary entities of our schema. An account can be a user or a team.

We can connect an entity to the account that owns it using a foreign key

```sql
account_id uuid not null references public.accounts(id)
```

### Enabling RLS

When you create a new table, always enable RLS.

```sql
-- enable row level security
alter table tasks enable row level security;
```

### RLS Policies

RLS Policies are fundamental to protect our tables.

We insert an RLS policy for each action: `select`, `insert`, `update` and `delete`.

#### Selecting Tasks

When writing an RLS policy for selecting data from the `tasks` table, we need to make sure the user is the owner of the task or has the required permission.

Generally speaking, entities belong to `public.accounts` - and we can use the `account_id` to check if the user is the owner.

```sql
create policy select_tasks on public.tasks
    for select
    to authenticated
    using (
      account_id = auth.uid() or
      public.has_role_on_account(account_id)
    );
```

Did you know that an account can be a user or a team? We can use the `public.has_role_on_account` function to check if the user has a role on the account.

Therefore, this RLS policy works in both ways:

1. if the user is the owner of the task - we check that the `account_id` is equal to the `auth.uid()`
2. if the user has a role on the account - we check that the user has a role on the account

#### Inserting Tasks

When writing an RLS policy for inserting data into the `tasks` table, we need to make sure the user is the owner of the task or has the required permission.

```sql
create policy insert_tasks on public.tasks
    for insert
    with check (
        account_id = auth.uid() or
        public.has_permission(auth.uid(), account_id, 'tasks.write'::app_permissions)
    );
```

In th above, we check if the user is the owner of the task or has the `tasks.write` permission.

1. If the `account_id` is equal to the `auth.uid()` - the account is personal - so permissions are not required
2. If the user has the `tasks.write` permission - the user can insert the task

### Updating Tasks

When writing an RLS policy for updating data in the `tasks` table, we need to make sure the user is the owner of the task or has the required permission.

```sql
create policy update_tasks on public.tasks
    for update
    using (
        account_id = auth.uid() or
        public.has_permission(auth.uid(), account_id, 'tasks.write'::app_permissions)
    )
    with check (
        account_id = auth.uid() or
        public.has_permission(auth.uid(), account_id, 'tasks.write'::app_permissions)
    );
```

Did you know that we need to add the `using` and `with check` clauses?

- `using` is used to filter the rows that the user can update
- `with check` is used to check if the user can update the row

In the above, we check if the user is the owner of the task or has the `tasks.write` permission.

### Deleting Tasks

When writing an RLS policy for deleting data from the `tasks` table, we need to make sure the user is the owner of the task or has the required permission.

```sql
create policy delete_tasks on public.tasks
    for delete
    using (
        account_id = auth.uid() or
        public.has_permission(auth.uid(), account_id, 'tasks.delete'::app_permissions)
    );
```

In the above, we check if the user is the owner of the task or has the `tasks.delete` permission.

Our schema is now complete! Yay! 🎉

### Resetting Migrations

When adding a new schema, we need to reset the migrations.

```bash
pnpm run supabase:web:reset
```

Then, we generate the new types using the following command:

```bash
pnpm run supabase:web:typegen
```

You can now use the new types in your application when using the Supabase client.

---
label: "Database Webhooks"
position: 6
title: "How to handle custom database webhooks in your Next.js Supabase application"
description: "Learn how to handle custom database webhooks in your Next.js Supabase application"
---

Database webhooks allow you to listen to changes in your database and trigger custom logic when a change occurs. This is useful for sending notifications, updating caches, or triggering other services.

Makerkit handles some webhooks by default for functionalities such as deleting a subscription following a user deletion, or sending emails after a user signs up.

You can extend this functionality by adding your own webhook handlers:

```tsx title="apps/web/app/api/db/webhook/route.ts"
import {
  getDatabaseWebhookHandlerService,
} from '@kit/database-webhooks';

/**
 * @name POST
 * @description POST handler for the webhook route that handles the webhook event
 */
export async function POST(request: Request) {
  const service = getDatabaseWebhookHandlerService();

  try {
    // handle the webhook event
    await service.handleWebhook(request, {
      handleEvent(change) {
        if (change.type === 'INSERT' && change.table === 'invitations') {
          // do something with the invitation
        }
      },
    });

    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 500 });
  }
}
```

As you can see above - the `handleEvent` function is where you can add your custom logic to handle the webhook event. In this example, we check if the event is an `INSERT` event on the `invitations` table and then do something with the invitation.

The `change` object is of type `RecordChange` and contains the following properties:

```tsx
import { Database } from '@kit/supabase/database';

export type Tables = Database['public']['Tables'];

export type TableChangeType = 'INSERT' | 'UPDATE' | 'DELETE';

export interface RecordChange<
  Table extends keyof Tables,
  Row = Tables[Table]['Row'],
> {
  type: TableChangeType;
  table: Table;
  record: Row;
  schema: 'public';
  old_record: null | Row;
}
```

You may need to cast the type manually:

```tsx
type AccountChange = RecordChange<'accounts'>;
```

Now, the `AccountChange` type can be used to type the `change` object in the `handleEvent` function and is typed to the `accounts` table.
---
label: "External Marketing Website"
title: "External Marketing Website in the Next.js Supabase Turbo Starter Kit"
description: "Learn how to configure Makerkit to work with an external marketing website in the Next.js Supabase Turbo Starter Kit."
position: 9
---

Many teams prefer to create an external marketing website for their SaaS application. This allows them to have more control over the design and content of the website. For example, using services such as Framer, Webflow, or Wordpress.

In this case, we have to redirect all marketing pages to the external marketing website. You can do so tweaking the middleware in the `apps/web/middleware.ts` file.

Take the list of all your marketing pages, and then add a middleware to redirect all those pages to the external marketing website.

```tsx
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (isMarketingPage(req)) {
    return NextResponse.redirect('https://your-external-website.com' + req.nextUrl.pathname);
  }

  // leave the rest of the middleware unchanged
}

function isMarketingPage(req: NextRequest) {
  const marketingPages = [
    '/pricing',
    '/faq',
    '/contact',
    '/about',
    '/home',
    '/privacy-policy',
    '/terms-and-conditions',
    '/cookie-policy',
  ];

  return marketingPages.includes(req.nextUrl.pathname);
}
```

Should you add a new marketing page, you need to update the `isMarketingPage` function with the new page path.
---
label: "Legal Pages"
title: "Legal Pages in the Next.js Supabase Turbo Starter Kit"
description: "Learn how to create and update legal pages in the Next.js Supabase Turbo Starter Kit."
position: 8
---

Legal pages are defined in the `apps/web/app/(marketing)/(legal)` directory. 

Makerkit comes with the following legal pages:

1. Terms and Conditions
2. Privacy Policy
3. Cookie Policy

For obvious reasons, **these pages are empty and you need to fill in the content**.

Do yourself a favor and do not use ChatGPT to generate these pages.

### Using a CMS for legal pages

You can use a CMS to manage the content of the legal pages. To do this, use the [CMS Client](cms):

```tsx
import { createCmsClient } from '@kit/cms';

export async function MyPage() {
  const cms = await createCmsClient();

  const { title, content } = await cms.getContentBySlug({
    slug: `slug`,
    collection: `pages`
  });

  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```
---
label: "Loading data from the DB"
position: 4
title: "Learn how to load data from the Supabase database"
description: "In this page we learn how to load data from the Supabase database and display it in our Next.js application."
---

Now that our database supports the data we need, we can start loading it into our application. We will use the `@makerkit/data-loader-supabase-nextjs` package to load data from the Supabase database.

Please check the [documentation](https://github.com/makerkit/makerkit/tree/main/packages/data-loader/supabase/nextjs) for the `@makerkit/data-loader-supabase-nextjs` package to learn more about how to use it.

This nifty package allows us to load data from the Supabase database and display it in our server components with support for pagination.

In the snippet below, we will

1. Load the user's workspace data from the database. This allows us to get the user's account ID without further round-trips because the workspace is loaded by the user layout.
2. Load the user's tasks from the database.
3. Display the tasks in a table.
4. Use a search input to filter the tasks by title.

Let's take a look at the code:

```tsx
import { use } from 'react';

import { ServerDataLoader } from '@makerkit/data-loader-supabase-nextjs';

import { getSupabaseServerClient } from '@kit/supabase/server-client';
import { Button } from '@kit/ui/button';
import { Heading } from '@kit/ui/heading';
import { If } from '@kit/ui/if';
import { Input } from '@kit/ui/input';
import { PageBody } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

import { TasksTable } from './_components/tasks-table';
import { UserAccountHeader } from './_components/user-account-header';
import { loadUserWorkspace } from './_lib/server/load-user-workspace';

interface SearchParams {
  page?: string;
  query?: string;
}

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

function UserHomePage(props: { searchParams: SearchParams }) {
  const client = getSupabaseServerClient();
  const { user } = use(loadUserWorkspace());

  const page = parseInt(props.searchParams.page ?? '1', 10);
  const query = props.searchParams.query ?? '';

  return (
    <>
      <UserAccountHeader
        title={<Trans i18nKey={'common:homeTabLabel'} />}
        description={<Trans i18nKey={'common:homeTabDescription'} />}
      />

      <PageBody className={'space-y-4'}>
        <div className={'flex items-center justify-between'}>
          <div>
            <Heading level={4}>
              <Trans i18nKey={'tasks:tasksTabLabel'} defaults={'Tasks'} />
            </Heading>
          </div>

          <div className={'flex items-center space-x-2'}>
            <form className={'w-full'}>
              <Input
                name={'query'}
                defaultValue={query}
                className={'w-full lg:w-[18rem]'}
                placeholder={'Search tasks'}
              />
            </form>
          </div>
        </div>

        <ServerDataLoader
          client={client}
          table={'tasks'}
          page={page}
          where={{
            account_id: {
              eq: user.id,
            },
            title: {
              textSearch: query ? `%${query}%` : undefined,
            },
          }}
        >
          {(props) => {
            return (
              <div className={'flex flex-col space-y-8'}>
                <If condition={props.count === 0 && query}>
                  <div className={'flex flex-col space-y-2.5'}>
                    <p>
                      <Trans
                        i18nKey={'tasks:noTasksFound'}
                        values={{ query }}
                      />
                    </p>

                    <form>
                      <input type="hidden" name={'query'} value={''} />

                      <Button variant={'outline'} size={'sm'}>
                        <Trans i18nKey={'tasks:clearSearch'} />
                      </Button>
                    </form>
                  </div>
                </If>

                <TasksTable {...props} />
              </div>
            );
          }}
        </ServerDataLoader>
      </PageBody>
    </>
  );
}

export default withI18n(UserHomePage);
```

Let's break this down a bit, shall we:

1. We import the necessary components and functions.
2. We define the `SearchParams` interface to type the search parameters.
3. We define the `generateMetadata` function to generate the page metadata.
4. We define the `UserHomePage` component that loads the user's workspace and tasks from the database.
5. We define the `ServerDataLoader` component that loads the tasks from the database.
6. We render the tasks in a table and provide a search input to filter the tasks by title.
7. We export the `UserHomePage` component with the `withI18n` HOC. This helps bootstrap the i18n instance for the component.

### Tasks Table

Now, let's show the tasks table component:

```tsx
'use client';

import Link from 'next/link';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@kit/ui/button';
import { DataTable } from '@kit/ui/enhanced-data-table';

import { Database } from '~/lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

export function TasksTable(props: {
  data: Task[];
  page: number;
  pageSize: number;
  pageCount: number;
}) {
  const columns = useGetColumns();

  return (
    <div>
      <DataTable {...props} columns={columns} />
    </div>
  );
}

function useGetColumns(): ColumnDef<Task>[] {
  const { t } = useTranslation('tasks');

  return [
    {
      header: t('task'),
      cell: ({ row }) => (
        <Link
          className={'hover:underline'}
          href={`/home/tasks/${row.original.id}`}
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      header: t('createdAt'),
      accessorKey: 'created_at',
    },
    {
      header: t('updatedAt'),
      accessorKey: 'updated_at',
    },
    {
      header: '',
      id: 'actions',
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className={'flex justify-end space-x-2'}>
            <Link href={`/home/tasks/${id}`}>
              <Button variant={'ghost'} size={'icon'}>
                <Pencil className={'h-4'} />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];
}
```

In this snippet, we define the `TasksTable` component that renders the tasks in a table. We use the `DataTable` component from the `@kit/ui/enhanced-data-table` package to render the table.

We also define the `useGetColumns` hook that returns the columns for the table. We use the `useTranslation` hook from the `react-i18next` package to translate the column headers.
---
label: "Marketing Pages"
title: "Marketing Pages in the Next.js Supabase Turbo Starter Kit"
description: "Learn how to create and update marketing pages in the Next.js Supabase Turbo Starter Kit."
position: 7
---

Makerkit comes with pre-defined marketing pages to help you get started with your SaaS application. These pages are built with Next.js and Tailwind CSS and are located in the `apps/web/app/(marketing)` directory.

Makerkit comes with the following marketing pages:

- Home Page
- Contact Form
- Pricing Page
- FAQ
- Contact Page (with a contact form)

## Adding a new marketing page

To add a new marketing page to your Makerkit application, you need to follow these steps.

Create a folder in the `apps/web/app/(marketing)` directory with the path you want to use for the page. For example, to create a new page at `/about`, you would create a folder named `about`. Then, create the page file in the folder. For example, to create an `about` page, you would create an `page.tsx` file in the `about` folder.

```tsx
// apps/web/app/(marketing)/about/page.tsx
export default function AboutPage() {
  return <div></div>
}
```

This page inherits the layout at `apps/web/app/(marketing)/layout.tsx`. You can customize the layout by editing this file - but remember that it will affect all marketing pages.

## Contact Form

To make the contact form work, you need to add the following environment variables:

```bash
CONTACT_EMAIL=
```

In this variable, you need to set the email address where you want to receive the contact form submissions. The sender will be the same as the one configured in your [mailing configuration](email-configuration).
---
label: "Migrations"
position: 1
title: "How to create new migrations and update the database schema in your Next.js Supabase application"
description: "Learn how to create new migrations and update the database schema in your Next.js Supabase application"
---

Creating a schema for your data is one of the primary tasks when building a new application. In this guide, we'll walk through how to create new migrations and update the database schema in your Next.js Supabase application.

## A quick word on migrations

Supabase's hosted Studio is pretty great - but I don't think it should be used to perform schema changes. Instead, I recommend using your local Supabase Studio to make the changes and then generate the migration file. Then, you can push the migration to the remote Supabase instance.

At this point, you have two options:

1. create a migration with `pnpm --filter web supabase migration new <name>` and update the code manually
2. or, use the local Supabase Studio to make the changes and then run `pnpm --filter web supabase db diff -f <name>` which will generate the migration file for you. DOUBLY CHECK THE FILE!

Once you've tested it all and are happy with your local changes, push the migration to the remote Supabase instance with `pnpm --filter web supabase db push`.

Doing the opposite is also okay - but:

1. You're making changes against the production database - which is risky
2. You're not testing the changes locally - which is risky
3. You need to pull the changes from the remote Supabase instance to your local instance so they are in sync

## Creating a Migration

The first step towards building your app schema is to create a new migration.

To do so, run the command:

```
pnpm --filter web supabase migration new <name>
```

The migration will be generated at `apps/web/supabase/migrations`.

Once added some SQL commands, you need to reset the schema for it to take effect:

```
pnpm run supabase:web:reset
```

The schema is now populated! Yay!

### Generating Supabase types

Now that your schema is populated, you need to generate the types so that your Supabase client can work correctly.

Please run the following command:

```
pnpm run supabase:web:typegen
```

Your Supabase client will now correctly infer the types with your schema changes.
---
label: 'RBAC: Roles and Permissions'
title: 'RBAC: Understanding roles and permissions in Next.js Supabase'
description: 'Learn how to implement roles and permissions in Next.js Supabase'
position: 6
---

Makerkit implements granular RBAC for team members. This allows you to define roles and permissions for each team member - giving you fine-grained control over who can access what.

Makerkit implements two tables for roles and permissions:

- `roles` table: This table stores the roles for each team member.
- `role_permissions` table: This table stores the permissions for each role.

The table `role_permissions` has the following schema:

- `id`: The unique identifier for the role permission.
- `role`: The role for the team member.
- `permission`: The permission for the role.

The `roles` table has the following schema:

- `name`: The name of the role. This must be unique.
- `hierarchy_level`: The hierarchy level of the role.

We can use `hierarchy_level` to define the hierarchy of roles. For example, an `admin` role can have a higher hierarchy level than a `member` role. This will help you understand if a role has more permissions than another role.

And an enum for permissions `app_permissions`:

- `app_permissions` enum: This enum stores the permissions for each role.

By default, Makerkit comes with two roles: `owner` and `member` - and the following permissions:

```sql
create type public.app_permissions as enum(
  'roles.manage',
  'billing.manage',
  'settings.manage',
  'members.manage',
  'invites.manage'
);
```

You can add more roles and permissions as needed.

### Default roles and permissions

The default roles are defined as follows:

1. Members with `owner` role have full access to the application.
2. Members with `member` role have the following permissions: `members.manage` and `invites.manage`.

### Adding new roles and permissions

To add new permissions, you can update the `app_permissions` enum:

```sql
-- insert new permissions
alter type public.app_permissions add value 'tasks.write';
alter type public.app_permissions add value 'tasks.delete';
commit;
```

In the above, we added two new permissions: `tasks.write` and `tasks.delete`.

You can assign these permissions to roles in the `role_permissions` table for fine-grained access control:

```sql
insert into public.role_permissions (role, permission) values ('owner', 'tasks.write');
insert into public.role_permissions (role, permission) values ('owner', 'tasks.delete');
```

Of course - you will need to enforce these permissions in your application code and RLS.

### Using roles and permissions in RLS

To check if a user has a certain permission on an account, we can use the function `has_permission` - which you can use in your RLS to enforce permissions.

In the below, we create an RLS policy `insert_tasks` on the `tasks` table to check if a user can insert a new task. We use `public.has_permission` to check if the current user has the permission `tasks.write`:

```sql
create policy insert_tasks on public.tasks
    for insert
    with check (
        public.has_permission(auth.uid(), account_id, 'tasks.write'::app_permissions)
    );
```

And now we can also add a policy to check if a user can delete a task:

```sql
create policy delete_tasks on public.tasks
    for delete
    using (
        public.has_permission(auth.uid(), account_id, 'tasks.delete'::app_permissions)
    );
```

### Using roles and permissions in application code

You can use the exact same function `has_permission` in your application code to check if a user has a certain permission. You will call the function with the Supabase RPC method:

```tsx
async function hasPermissionToInsertTask(userId: string, accountId: string) {
  const { data: hasPermission, error } = await client.rpc('has_permission', {
    user_id: userId,
    account_id: accountId,
    permission: 'tasks.write',
  });

  if (error || !hasPermission) {
    throw new Error(`User has no permission to insert task`);
  }
}
```

You can now use `hasPermissionToInsertTask` to check if a user has permission to insert a task anywhere in your application code - provided you obtain the user and account IDs.

You can use this function to gate access to certain pages, or verify the user permissions before performing some server-side requests.

Of course, it's always worth making sure RLS is enforced on the database level as well.

### Using permissions client-side

While checks must be done always server-side, it is useful to have the permissions available client-side for UI purposes. For example, you may want to hide a certain button if the user does not have the permission to perform an action.

We fetch the permissions as part of the [Account Workspace API](account-workspace-api) - which is available to the layout around the account routes.

This API fetches the permissions for the current user and account and makes them available to the client-side simply by passing it from a page to the client components that require it.

Let's assume you have a page, and you want to check if the user has the permission to write tasks:

```tsx
import { loadTeamWorkspace } from '~/home/[account]/_lib/server/team-account-workspace.loader';

export default function TasksPage() {
  const data = await loadTeamWorkspace();
  const permissions = data.account.permissions; // string[]

  const canWriteTasks = permissions.includes('tasks.write');

  return (
    <div>
      {canWriteTasks && <button>Create Task</button>}
      // other UI elements // ...
    </div>
  );
}
```

You can also pass the permissions list to the components that need it as a prop.

This way, you can gate access to certain UI elements based on the user's permissions.

```tsx
import { loadTeamWorkspace } from '~/home/[account]/_lib/server/team-account-workspace.loader';

export default function TasksPage() {
  const data = await loadTeamWorkspace();
  const permissions = data.account.permissions; // string[]

  return (
    <div>
      <TaskList permissions={permissions} />
    </div>
  );
}
```

Similarly, you can use the permissions to gate access to certain routes or pages.

```tsx
import { loadTeamWorkspace } from '~/home/[account]/_lib/server/team-account-workspace.loader';

export default function TasksPage() {
  const data = await loadTeamWorkspace();
  const permissions = data.account.permissions; // string[]

  if (!permissions.includes('tasks.read')) {
    return <ErrorPage message="You do not have permission to write tasks" />;
  }

  return (
    <div>
      <TaskList permissions={permissions} />
    </div>
  );
}
```

Easy as that!

---
label: "SEO"
title: SEO - Improve your Next.js application's search engine optimization"
description:  "Learn how to improve your Makerkit application's search engine optimization (SEO)"
position: 10
---

SEO is an important part of building a website. It helps search engines understand your website and rank it higher in search results. In this guide, you'll learn how to improve your Makerkit application's search engine optimization (SEO).

Makerkit is already optimized for SEO out of the box. However, there are a few things you can do to improve your application's SEO:

1. **Content**: The most important thing you can do to improve your application's SEO is to **create high-quality content**. No amount of technical optimization can replace good content. Make sure your content is relevant, useful, and engaging - and make sure it's updated regularly.
2. **Write content helpful to your customers**: To write good content, the kit comes with a blog and documentation feature. You can use these features to create high-quality content that will help your website rank higher in search results - and help your customers find what they're looking for.
3. **Use the correct keywords**: Use descriptive titles and meta descriptions for your pages. Titles and meta descriptions are the first things users see in search results, so make sure they are descriptive and relevant to the content on the page. Use keywords that your customers are likely to search for.
4. **Optimize images**: Use descriptive filenames and alt text for your images. This helps search engines understand what the image is about and can improve your website's ranking in image search results.
5. **Website Speed**: This is much less important than it used to be, but it's still a factor. Make sure your website loads quickly and is mobile-friendly. You can use tools like Google's PageSpeed Insights to check your website's speed and get suggestions for improvement. Optimize all images and assets to reduce load times.
6. **Mobile Optimization**: Make sure your website is mobile-friendly. Google ranks mobile-friendly websites higher in search results. You can use Google's Mobile-Friendly Test to check if your website is mobile-friendly.
7. **Sitemap and Robots.txt**: Makerkit generates a sitemap and robots.txt file for your website. These files help search engines understand your website's structure and what pages they should index. Make sure to update the sitemap as you add new pages to your website.
8. **Backlinks**: Backlinks are links from other websites to your website. It's touted to be **the single most important factor in SEO** these days. The more backlinks you have from high-quality websites, the higher your website will rank in search results. You can get backlinks by creating high-quality content that other websites want to link to.

### Adding pages to the sitemap

Generally speaking, Google will find your pages without a sitemap as it follows the link in your website. However, you can add pages to the sitemap by adding them to the `apps/web/app/server-sitemap.xml/route.ts` route, which is used to generate the sitemap.

If you add more static pages to your website, you can add them to the `getPaths` function in the `apps/web/app/server-sitemap.xml/route.ts` file. For example, if you add a new page at `/about`, you can add it to the `getPaths` function like this:

```tsx title="apps/web/app/server-sitemap.xml/route.ts"
function getPaths() {
  const paths = [
    '/',
    '/faq',
    '/blog',
    '/docs',
    '/pricing',
    '/contact',
    '/cookie-policy',
    '/terms-of-service',
    '/privacy-policy',
    // add more paths here,
    '/about', // <-- add the new page here
  ];

  return paths.map((path) => {
    return {
      loc: new URL(path, appConfig.url).href,
      lastmod: new Date().toISOString(),
    };
  });
}
```

All the blog and documentation pages are automatically added to the sitemap. You don't need to add them manually.

### Adding your website to Google Search Console

Once you've optimized your website for SEO, you can add it to Google Search Console. Google Search Console is a free tool that helps you monitor and maintain your website's presence in Google search results.

You can use it to check your website's indexing status, submit sitemaps, and get insights into how Google sees your website.

The first thing you need to do is verify your website in Google Search Console. You can do this by adding a meta tag to your website's HTML or by uploading an HTML file to your website.

Once you've verified your website, you can submit your sitemap to Google Search Console. This will help Google find and index your website's pages faster.

Please submit your sitemap to Google Search Console by going to the `Sitemaps` section and adding the URL of your sitemap. The URL of your sitemap is `https://your-website.com/server-sitemap.xml`.

Of course, please replace `your-website.com` with your actual website URL.

### Backlinks

Backlinks are said to be the most important factor in modern SEO. The more backlinks you have from high-quality websites, the higher your website will rank in search results - and the more traffic you'll get.

How do you get backlinks? The best way to get backlinks is to create high-quality content that other websites want to link to. However, you can also get backlinks by:

1. **Guest posting**: Write guest posts for other websites in your niche. This is a great way to get backlinks and reach a new audience.
2. **Link building**: Reach out to other websites and ask them to link to your website. You can offer to write a guest post or provide a testimonial in exchange for a backlink.
3. **Social media**: Share your content on social media to reach a wider audience and get more backlinks.
4. **Directories**: Submit your website to online directories to get backlinks. Make sure to choose high-quality directories that are relevant to your niche.

All these methods can help you get more backlinks and improve your website's SEO - and help you rank higher in search results.

### Content

When it comes to internal factors, content is king. Make sure your content is relevant, useful, and engaging. Make sure it's updated regularly and optimized for SEO.

What should you write about? Most importantly, you want to think about how your customers will search for the problem your SaaS is solving. For example, if you're building a project management tool, you might want to write about project management best practices, how to manage a remote team, or how to use your tool to improve productivity.

You can use the blog and documentation features in Makerkit to create high-quality content that will help your website rank higher in search results - and help your customers find what they're looking for.

### Indexing and ranking take time

New websites can take a while to get indexed by search engines. It can take anywhere from a few days to a few weeks (in some cases, even months!) for your website to show up in search results. Be patient and keep updating your content and optimizing your website for search engines.

---

By following these tips, you can improve your Makerkit application's search engine optimization (SEO) and help your website rank higher in search results. Remember, SEO is an ongoing process, so make sure to keep updating your content and optimizing your website for search engines. Good luck!

---
label: "Writing data to Database"
position: 5
title: "Learn how to write data to the Supabase database"
description: "In this page we learn how to write data to the Supabase database in your Next.js app"
---

In this page, we will learn how to write data to the Supabase database in your Next.js app.

## Writing a Server Action to Add a Task

Server Actions are defined by adding `use server` at the top of the function or file. When we define a function as a Server Action, it will be executed on the server-side.

This is useful for various reasons:
1. By using Server Actions, we can revalidate data fetched through Server Components
2. We can execute server side code just by calling the function from the client side

In this example, we will write a Server Action to add a task to the database.

### Defining a Schema for the Task

We use Zod to validate the data that is passed to the Server Action. This ensures that the data is in the correct format before it is written to the database.

The convention in Makerkit is to define the schema in a separate file and import it where needed. We use the convention `file.schema.ts` to define the schema.

```tsx
import { z } from 'zod';

export const WriteTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
});
```

### Writing the Server Action to Add a Task

In this example, we write a Server Action to add a task to the database. We use the `revalidatePath` function to revalidate the `/home` page after the task is added.

```tsx
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';

import { getLogger } from '@kit/shared/logger';
import { requireUser } from '@kit/supabase/require-user';
import { getSupabaseServerClient } from '@kit/supabase/server-client';

import { WriteTaskSchema } from '~/(dashboard)/home/(user)/_lib/schema/write-task.schema';

export async function addTaskAction(params: z.infer<typeof WriteTaskSchema>) {
  'use server';

  const task = WriteTaskSchema.parse(params);

  const logger = await getLogger();
  const client = getSupabaseServerClient();
  const auth = await requireUser(client);

  if (!auth.data) {
    redirect(auth.redirectTo);
  }

  logger.info(task, `Adding task...`);

  const { data, error } = await client
    .from('tasks')
    .insert({ ...task, account_id: auth.data.id });

  if (error) {
    logger.error(error, `Failed to add task`);

    throw new Error(`Failed to add task`);
  }

  logger.info(data, `Task added successfully`);

  revalidatePath('/home', 'page');

  return null;
}
```

Let's focus on this bit for a second:

```tsx
const { data, error } = await client
    .from('tasks')
    .insert({ ...task, account_id: auth.data.id });
```

Do you see the `account_id` field? This is a foreign key that links the task to the user who created it. This is a common pattern in database design.

Now that we have written the Server Action to add a task, we can call this function from the client side. But we need a form, which we define in the next section.

### Creating a Form to Add a Task

We create a form to add a task. The form is a React component that accepts a `SubmitButton` prop and an `onSubmit` prop.

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@kit/ui/form';
import { Input } from '@kit/ui/input';
import { Textarea } from '@kit/ui/textarea';
import { Trans } from '@kit/ui/trans';

import { WriteTaskSchema } from '../_lib/schema/write-task.schema';

export function TaskForm(props: {
  task?: z.infer<typeof WriteTaskSchema>;
  onSubmit: (task: z.infer<typeof WriteTaskSchema>) => void;
  SubmitButton: React.ComponentType;
}) {
  const form = useForm({
    resolver: zodResolver(WriteTaskSchema),
    defaultValues: props.task,
  });

  return (
    <Form {...form}>
      <form
        className={'flex flex-col space-y-4'}
        onSubmit={form.handleSubmit(props.onSubmit)}
      >
        <FormField
          render={(item) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'tasks:taskTitle'} />
                </FormLabel>

                <FormControl>
                  <Input required {...item.field} />
                </FormControl>

                <FormDescription>
                  <Trans i18nKey={'tasks:taskTitleDescription'} />
                </FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
          name={'title'}
        />

        <FormField
          render={(item) => {
            return (
              <FormItem>
                <FormLabel>
                  <Trans i18nKey={'tasks:taskDescription'} />
                </FormLabel>

                <FormControl>
                  <Textarea {...item.field} />
                </FormControl>

                <FormDescription>
                  <Trans i18nKey={'tasks:taskDescriptionDescription'} />
                </FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
          name={'description'}
        />

        <props.SubmitButton />
      </form>
    </Form>
  );
}
```

### Using a Dialog component to display the form

We use the Dialog component from the `@kit/ui/dialog` package to display the form in a dialog. The dialog is opened when the user clicks on a button.

```tsx
'use client';

import { useState, useTransition } from 'react';

import { PlusCircle } from 'lucide-react';

import { Button } from '@kit/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kit/ui/dialog';
import { Trans } from '@kit/ui/trans';

import { TaskForm } from '../_components/task-form';
import { addTaskAction } from '../_lib/server/server-actions';

export function NewTaskDialog() {
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className={'mr-1 h-4'} />
          <span>
            <Trans i18nKey={'tasks:addNewTask'} />
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey={'tasks:addNewTask'} />
          </DialogTitle>

          <DialogDescription>
            <Trans i18nKey={'tasks:addNewTaskDescription'} />
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          SubmitButton={() => (
            <Button>
              {pending ? (
                <Trans i18nKey={'tasks:addingTask'} />
              ) : (
                <Trans i18nKey={'tasks:addTask'} />
              )}
            </Button>
          )}
          onSubmit={(data) => {
            startTransition(async () => {
              await addTaskAction(data);
              setIsOpen(false);
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
```

We can now import `NewTaskDialog` in the `/home` page and display the dialog when the user clicks on a button.

Let's go back to the home page and add the component right next to the input filter:

```tsx {18}
<div className={'flex items-center justify-between'}>
  <div>
    <Heading level={4}>
      <Trans i18nKey={'tasks:tasksTabLabel'} defaults={'Tasks'} />
    </Heading>
  </div>

  <div className={'flex items-center space-x-2'}>
    <form className={'w-full'}>
      <Input
        name={'query'}
        defaultValue={query}
        className={'w-full lg:w-[18rem]'}
        placeholder={'Search tasks'}
      />
    </form>

    <NewTaskDialog />
  </div>
</div>
```
---
title: "Setting the Supabase Auth Email Templates in Production"
label: "Authentication Emails"
description: "Configure the Supabase authentication URLs and emails in the Next.js Supabase Starter Kit."
position: 4
---

Makerkit provides a set of email templates that you can use for replacing the standard Supabase Auth emails. Additionally, you can customize these templates to match your brand.

**Please update the auth emails using the [following documentation in Supabase](https://supabase.com/docs/guides/auth/auth-email-templates#redirecting-the-user-to-a-server-side-endpoint)**.

<Alert type='warn'>
    Failure to do so will result in hiccups in the authentication flow when users click on an email and get redirected to a different browser than the one they used to sign up due to how the PKCE flow works.
</Alert>

## Setting the Email Templates in Supabase

Why should you use our email templates?

1. They will use the token hash strategy, which remediates the issue of users being redirected to a different browser than the one they used to sign up.
2. They look better than the default Supabase templates and you can customize them to match your brand.

## Customizing the Email Templates

Please clone the templates repository locally and customize them to your liking:

1. Clone our Emails Starter at [https://github.com/makerkit/makerkit-emails-starter](https://github.com/makerkit/makerkit-emails-starter)
2. Customize the templates as you see fit
3. Export the templates with your own information
4. Replace the templates in the `apps/web/supabase/templates` folder
5. Update the email templates in your Supabase settings

Now your emails from Supabase Auth will look great and match your brand! 🎉
---
label: "Email Configuration"
description: "Learn how to configure the mailer provider to start sending emails from your Next.js Supabase Starter Kit."
title: "Email Configuration in the Next.js Supabase Starter Kit"
position: 0
---

Before we delve into the configuration details, it's crucial to distinguish between Makerkit emails and Supabase Auth emails.

1. **Makerkit Emails**: These are transactional emails used for actions like team member invitations, account deletion confirmations, and any additional ones you'll be implementing.
2. **Supabase Auth Emails**: These emails are used for authentication-related actions, such as email verification and password reset.

To have a comprehensive email setup in your application, you'll need to configure both Makerkit and Supabase Auth emails.

This guide focuses on setting up Makerkit emails. For Supabase Auth, please refer to the [Supabase documentation](https://supabase.com/docs/guides/auth/auth-smtp).

---

Makerkit offers the `@kit/mailers` package to configure and send emails, providing a straightforward API for email operations.

There are three mailer implementations provided by Makerkit:

1. `nodemailer`: This is the default mailer that leverages the `nodemailer` library. It's ideal for Node.js environments as it's compatible with any SMTP server, ensuring you're not tied to a specific provider.
2. `resend`: This mailer uses the [Resend](https://resend.com) API via HTTP. It's a suitable choice if you opt for Resend.

The following sections will guide you on configuring the mailer provider to start sending emails from your Next.js Supabase Starter Kit.

## Configuration

To specify the mailer provider, set the `MAILER_PROVIDER` environment variable in the `apps/web/.env` file. For instance, to use the `nodemailer` mailer, set `MAILER_PROVIDER` to `nodemailer`:

```bash
MAILER_PROVIDER=nodemailer
```

By default, `nodemailer` is used.

### SMTP Configuration

If you're using the `nodemailer` mailer, you'll need to set the SMTP configuration in your environment variables. Here's an example of the SMTP configuration:

```bash
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_TLS=
```

The variables are:

1. `EMAIL_USER`: The email address user. This is provider-specific, so refer to your email provider's documentation.
2. `EMAIL_PASSWORD`: The password for the email account, provided by your email provider.
3. `EMAIL_HOST`: The SMTP server host. This is provider-specific, so refer to your email provider's documentation.
4. `EMAIL_PORT`: The SMTP server port. This is provider-specific, so refer to your email provider's documentation.
5. `EMAIL_TLS`: The TLS configuration. This is provider-specific, so refer to your email provider's documentation. Generally, you can set it to `true`.

If you prefer to use the Cloudflare Mailer or the Resend Mailer, set the `MAILER_PROVIDER` environment variable to `cloudflare` or `resend`, respectively.

## Resend API

As an alternative, you can use Resend.

Set the `MAILER_PROVIDER` environment variable to `resend` in the `apps/web/.env` file:

```bash
MAILER_PROVIDER=resend
```

And provide the Resend API key:

```bash
RESEND_API_KEY=your-api-key
EMAIL_USER=your-email
```

That's it! You're now ready to send emails from your Next.js Supabase Starter Kit using the configured mailer provider.
---
label: "Email Templates"
description: "Learn how to write email templates in the Next.js Supabase Starter Kit with React.Email"
title: "Email Templates in the Next.js Supabase Starter Kit"
position: 2
---

Email templates are a great way to send beautiful and consistent emails to your users. In the Next.js Supabase Starter Kit, we use [React.Email](https://react.email) to create email templates.

Templates are stored in the package `@kit/email-templates` which you can find in the `packages/email-templates` directory.

For example, here is our template for accepting an invitation to join a team:

```tsx
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  render,
} from '@react-email/components';

interface Props {
  teamName: string;
  teamLogo?: string;
  inviter: string | undefined;
  invitedUserEmail: string;
  link: string;
  productName: string;
}

export function renderInviteEmail(props: Props) {
  const previewText = `Join ${props.invitedUserEmail} on ${props.productName}`;

  return render(
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Tailwind>
        <Body className="mx-auto my-auto bg-gray-50 font-sans">
          <Container className="mx-auto my-[40px] w-[465px] rounded-lg border border-solid border-[#eaeaea] bg-white p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Join <strong>{props.teamName}</strong> on{' '}
              <strong>{props.productName}</strong>
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {props.invitedUserEmail},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              <strong>{props.inviter}</strong> has invited you to the{' '}
              <strong>{props.teamName}</strong> team on{' '}
              <strong>{props.productName}</strong>.
            </Text>
            {props.teamLogo && (
              <Section>
                <Row>
                  <Column align="center">
                    <Img
                      className="rounded-full"
                      src={props.teamLogo}
                      width="64"
                      height="64"
                    />
                  </Column>
                </Row>
              </Section>
            )}
            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded bg-[#000000] px-[20px] py-[12px] text-center text-[12px] font-semibold text-white no-underline"
                href={props.link}
              >
                Join {props.teamName}
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{' '}
              <Link href={props.link} className="text-blue-600 no-underline">
                {props.link}
              </Link>
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-[12px] leading-[24px] text-[#666666]">
              This invitation was intended for{' '}
              <span className="text-black">{props.invitedUserEmail}</span>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>,
  );
}
```

If you want to create your own email templates, you can create a new file in the `packages/email-templates/src` directory and export a function that returns the email template.

Then, import the function and transform the template into HTML that you can send using the mailer.

```tsx
import { getMailer } from '@kit/mailers';
import { renderInviteEmail } from '@kit/email-templates';

async function sendEmail() {
  const emailHtml = renderInviteEmail({
    teamName: 'My Team',
    teamLogo: 'https://example.com/logo.png',
    inviter: 'John Doe',
    invitedUserEmail: ''
  });

  const mailer = await getMailer();

  return mailer.sendEmail({
    to: '',
    from: '',
    subject: 'Join the team!',
    html: emailHtml
  });
}
```
---
label: "Sending Emails"
description: "Learn how to send emails in the Next.js Supabase Starter Kit."
title: "Sending Emails in the Next.js Supabase Starter Kit"
position: 1
---

The Mailer class is extremely simple:

```tsx
import { z } from 'zod';

import { MailerSchema } from './schema/mailer.schema';

export abstract class Mailer<Res = unknown> {
  abstract sendEmail(data: z.infer<typeof MailerSchema>): Promise<Res>;
}
```

The `sendEmail` method is an abstract method that you need to implement in your mailer provider. The method receives an object with the following properties:

Once you have configured the mailer provider, you can start sending emails using the `sendEmail` method. Here is an example of how to send an email using the default mailer:

```tsx
import { getMailer } from '@kit/mailers';

async function sendEmail(params: {
  from: string;
  to: string;
}) {
  const mailer = await getMailer();

  return mailer.sendEmail({
    to: params.from,
    from: params.to,
    subject: 'Hello',
    text: 'Hello, World!'
  });
}
```

The `sendEmail` method returns a promise that resolves when the email is sent successfully. If there is an error, the promise will be rejected with an error message.

If you want to send HTML emails, you can use the `html` property instead of the `text` property:

```tsx
import { getMailer } from '@kit/mailers';

async function sendEmail(params: {
  from: string;
  to: string;
}) {
  const mailer = await getMailer();

  return mailer.sendEmail({
    to: params.from,
    from: params.to,
    subject: 'Hello',
    html: '<h1>Hello, World!</h1>'
  });
}
```

Et voilà! You are now ready to send emails from your Next.js Supabase Starter Kit. 🚀
---
title: "Setting the Supabase Auth Settings in Production"
label: "Authentication"
description: "Configuring Authentication's production configuration in the Next.js Supabase SaaS kit"
position: 3
---

Supabase needs a few settings to be configured in their Dashboard to work correctly.

This guide will walk you through the steps to get your Supabase authentication set up in your Production environment. The dev environment does not require any configuration.

<Alert type={'warn'}>
  Skipping this step will result in your users not being able to log in or sign up.
</Alert>

## Third Party Providers

Third Party providers need to be configured, managed and enabled fully on the provider's and Supabase's side. Makerkit does not need any configuration (beyond setting the provider to be displayed in the UI).

Please [read Supabase's documentation](https://supabase.com/docs/guides/auth/social-login) on how to set up third-party providers.

## Authentication URLs

The first thing you need to do is to [set the authentication URLs in the Supabase Dashboard](https://supabase.com/docs/guides/auth/redirect-urls). These URLs are used to redirect users to the correct page after they have logged in or signed up.

1. Go to the [Supabase Dashboard](https://app.supabase.io/).
2. Click on the project you want to use.
3. Go to the **Authentication** tab.
4. Click on **URL Configuration**.
5. Add your Site URL to the **Site URL** field. This is the URL of your MakerKit site (e.g. `https://my-site.com`).
6. Add your Redirect URLs to the **Redirect URLs** field. This is the URL of your MakerKit site with `/auth/callback` appended to it (e.g. `https://my-site.com/auth/callback`).

Failure to set these URLs will result in your users not being able to log in or sign up.

## Custom SMTP

Supabase's SMTP settings have low limits and low deliverability. If you want your emails to go out and be delivered, please remember to set an alternative SMTP provider in the Supabase settings.

1. Go to the [Supabase Dashboard](https://app.supabase.io/).
2. Click on the project you want to use.
3. Go to the **Project Settings** tab.
4. Click on **Auth**.
5. Tweak the `SMTP Settings` settings to your liking according to your provider's documentation.

Please refer to the [Supabase documentation](https://supabase.com/docs/guides/auth/auth-smtp) for more information.

### Troubleshooting

If you are having authentication issues, ensure that the Site URL and Redirect URLs are correct. If you are using a custom domain, ensure that you are using the correct domain in the Site URL and Redirect URLs.

<Alert type="warn">
  NB: if your domain includes "www", ensure you include it in the Site URL and Redirect URLs. If your domain does not
  include "www", ensure you do not include it in the Site URL and Redirect URLs. If these do not match, your users will
  not be able to login.
</Alert>

If something is still not working, please open a support ticket with any useful information (such as server logs).
---
title: "Checklist for deploying your application to Production"
label: "Checklist"
description: "Let's deploy your Next.js Supabase SaaS app to production!"
position: 0
---

When you're ready to deploy your project to production, follow this checklist.

This process may take a few hours and some trial and error, so buckle up—you're almost there!

1. **Create a Supabase project**. [Link the project locally](https://supabase.com/docs/guides/cli/local-development#link-your-project) using the Supabase CLI (`supabase link`).
2. **Migrations**: [Push the migrations](https://supabase.com/docs/guides/cli/local-development#link-your-project) to the remote Supabase instance (`supabase db push`).
3. **Auth**: [Set your APP URL in the Supabase project settings](https://supabase.com/docs/guides/auth/redirect-urls). This is required for the OAuth flow. Make sure to add the path `/auth/callback` to the allowed URLs. If you don't have it yet, wait.
4. **Auth Providers**: [Set the OAuth providers in the Supabase](https://supabase.com/docs/guides/auth/social-login) project settings. If you use Google Auth, make sure to set it up. This requires creating a Google Cloud project and setting up the OAuth credentials.
5. **Auth Emails**: It is very much recommended to update the auth emails using the [following documentation](authentication-emails). The kit already implements the `confirm` route, but you need to update the emails in your Supabase settings.
6. **Deploy Next.js**: Deploy the Next.js app to Vercel or any another hosting provider. Copy the URL and set it in the Supabase project settings.
7. **Environment Variables**: The initial deploy **will likely fail** because you may not yet have a URL to set in your environment variables. This is normal. Once you have the URL, set the URL in the environment variables and redeploy.
8. **Webhooks**: [Set the DB Webhooks in Supabase](configuring-supabase-database-webhooks) pointing against your Next.js app at `/api/db/webhooks`.
9. **Emails**: Get some SMTP details from an email service provider like SendGrid or Mailgun or Resend and configure the emails in both the Environment Variables and the [Supabase project settings](https://supabase.com/docs/guides/auth/auth-smtp).
10. **Billing**: Create a Stripe/Lemon Squeezy account, make sure to update the environment variables with the correct values. Point webhooks from these to `/api/billing/webhook`. Please use the relative documentation for more details.

Other minor things to consider:

1. Update the legal pages with your company's information (privacy policy, terms of service, etc.).
2. Remove the placeholder blog and documentation content / or replace it with your own
3. Update the favicon and logo with your own branding
4. Update the FAQ and other static content with your own information

---

1. **Create a Supabase Project**
   - **Why it's necessary:** Creating a Supabase project is the foundational step to set up your database, authentication, and storage services in the cloud. This will serve as the backend for your SaaS application.
   - **Action:** Create a new Supabase project in the Supabase dashboard. Once created, [link the project locally](https://supabase.com/docs/guides/cli/local-development#link-your-project) using the Supabase CLI:
     ```bash
     supabase link
     ```
2. **Migrations**
   - **Why it's necessary:** Pushing database migrations ensures that your database schema in the remote Supabase instance is configured to match Makerkit's requirements. This step is crucial for the application to function correctly.
   - **Action:** Push the database migrations to your remote Supabase instance:
     ```bash
     supabase db push
     ```
3. **Auth Configuration**
   - **Why it's necessary:** Setting your APP URL in the Supabase project settings is critical for enabling OAuth flows and redirecting users correctly during authentication.
   - **Action:** [Set your APP URL in the Supabase project settings](https://supabase.com/docs/guides/auth/redirect-urls). Add the path `/auth/callback` to the allowed URLs.
4. **OAuth Providers**
   - **Why it's necessary:** Configuring OAuth providers like Google ensures that users can log in using their existing accounts, enhancing user convenience and security. This is all done externally, in both Google and Supabase - not in the application code.
   - **Action:** [Set up the OAuth providers](https://supabase.com/docs/guides/auth/social-login) in your Supabase project settings. For Google Auth, create a Google Cloud project and set up the OAuth credentials.
5. **Auth Emails**
   - **Why it's necessary:** To provide a correct user experience with Makerkit's SSR authentication, you need to update the authentication emails to include the token hash and prevent errors usually related to PKCE - i.e when users click on the email and are redirected to a different browser - resulting in an error.
   - **Action:** Update the authentication emails using the [Supabase documentation](https://supabase.com/docs/guides/auth/auth-smtp). The kit implements the `confirm` route, but you need to update the email templates in your Supabase settings.
6. **Deploy Next.js**
   - **Why it's necessary:** Because your users are waiting! Deploying your Next.js app to a hosting provider makes it accessible to users worldwide, allowing them to interact with your application.
   - **Action:** Deploy your Next.js app to Vercel or another hosting provider. Copy the deployment URL and set it in your Supabase project settings.
7. **Environment Variables**
   - **Why it's necessary:** Setting the correct environment variables is essential for the application to function correctly. These variables include API keys, database URLs, and other configuration details required for your app to connect to various services.
   - **Action:** Please [generate the environment variables using our script](production-environment-variables) and then add them to your hosting provider's environment variables. Redeploy the app once you have the URL to set in the environment variables.
8. **Webhooks**
   - **Why it's necessary:** Configuring database webhooks allows your application to respond to changes in the database in real-time, such as sending notifications or updating records, ensuring your app stays in sync with the database.
   - **Action:** [Set up the database webhooks in Supabase](https://supabase.com/docs/guides/database/webhooks) to point to your Next.js app at `/api/db/webhooks`.
9. **Emails Configuration**
   - **Why it's necessary:** Properly configuring your email service ensures that your application can send emails for account verification, password resets, and other notifications, which are crucial for user communication.
   - **Action:** Obtain SMTP details from an email service provider such as SendGrid, Mailgun, or Resend. Configure the emails in both the environment variables and the [Supabase project settings](https://supabase.com/docs/guides/auth/auth-smtp).
10. **Billing Setup**
    - **Why it's necessary:** Well - you want to get paid, right? Setting up billing ensures that you can charge your users for using your SaaS application, enabling you to monetize your service and cover operational costs. This can take a while.
    - **Action:** Create a Stripe or Lemon Squeezy account. Update the environment variables with the correct values for your billing service. Point webhooks from Stripe or Lemon Squeezy to `/api/billing/webhook`. Refer to the relevant documentation for more details on setting up billing.

**Note**: Please note that these steps are essential for setting up Makerkit and ensuring that your SaaS application functions correctly. Omitting any of these steps may result in errors or unexpected behavior in your application.

---
title: 'Deploy Next.js Supabase to Cloudflare'
label: 'Deploy to Cloudflare'
position: 6
description: 'Guide to deploy the Next.js SaaS boilerplate to Cloudflare Pages.'
---

To deploy the application to Cloudflare, you need to do the following:

1. Opt-in to the Edge runtime
2. Using the Cloudflare Mailer
3. Switching CMS
4. Setting Node.js Compatibility Flags
5. Environment variables
6. Workarounds

NB: deploying to Cloudflare requires a subscription to the Cloudflare Workers paid service due to the size limitations of the free tier. It starts at $5.

### 0. Limitations

Before you continue, **please evaluate the limitations of the Edge runtime**. The Edge runtime does not support all Node.js features, so you may need to adjust your application accordingly.

Cloudflare is cheaper and faster than many other providers, but running your application on Cloudflare Pages means not having access to the vast Node.js ecosystem.

Makerkit uses Cloudflare as a baseline, so you can deploy it to Cloudflare Pages without any issues. However, you will need to keep in mind the limitations of the Workers/Edge runtime when adding new features.

One more thing to consider is that the Edge runtime does run close to your users, but may run far from your database. Consider read replicas or other strategies to reduce latency in all situations.

If your mind is set on using Cloudflare, please follow the instructions below.

### 1. Opting into the Edge runtime

To opt-in to the Edge runtime, you need to do the following: open the root layout file of your app `apps/web/app/layout.tsx` and export the const runtime as `edge`:

```tsx
export const runtime = 'edge';
```

This will enable the Edge runtime for your application.

### 2. Using the Cloudflare Mailer or Resend Mailer

Since the default library `nodemailer` relies on Node.js, we cannot use it in the Edge runtime. Instead, we will Resend Mailer.

Set up SPF and DKIM records in your DNS settings.

Please follow [the Vercel Email documentation](https://github.com/Sh4yy/vercel-email?tab=readme-ov-file#setup-spf) to set up the SPF and DKIM records.

Alternatively, you can use the Resend Mailer. Set the `MAILER_PROVIDER` environment variable to `resend` in the `apps/web/.env` file:

```bash
MAILER_PROVIDER=resend
```

And provide the Resend API key:

```bash
RESEND_API_KEY=your-api-key
```

Alternatively, implement your own mailer using the abstract class we provide in the `packages/mailers` package.

### 3. Switching CMS

By default, Makerkit uses Keystatic as a CMS. Keystatic's local mode (which relies on the file system) is not supported in the Edge runtime. Therefore, you will need to switch to another CMS or use Keystatic's Github mode - which uses Github as data provider.

At this time, the other CMS supported is WordPress. Set `CMS_CLIENT` to `wordpress` in the `apps/web/.env` file:

```bash
CMS_CLIENT=wordpress
```

Alternatively, use the Keystatic remote mode through Github.

Please check the CMS documentation for more information.

### 4. Select "apps/web" as path to build

When prompted to select the path to build, select `apps/web` as the path to build - since our Next.js app is located in the `apps/web` directory.

If you have multiple apps, you can select the app you want to deploy.

### 5. Setting Node.js Compatibility Flags

Cloudflare requires you to set the Node.js compatibility flags. Please follow the instructions on the [Cloudflare documentation](https://developers.cloudflare.com/workers/runtime-apis/nodejs).

Please don't miss this step, as it's crucial for the application to work in the Edge runtime.

### 6. Environment variables

When adding environment variables, make sure to add all of them from the Cloudflare dashboard instead of the `.env` file. I cannot understand why, but the Workers did not pick up the environment variables from the `.env` file. So please do make sure to add all the environment variables from the Cloudflare dashboard.

### 7. Workarounds

An [issue with Cloudflare](https://github.com/cloudflare/workerd/issues/698) causes makes it impossible to deploy to Cloudflare Pages without two workarounds:

1. Monkey-patching the `fetch` function for Keystatic

#### Monkey-patching the `fetch` function

The below is needed if you use Keystatic in Github mode. If you use Wordpress or another CMS, you can skip this step.

Create a new file named `mock-workerd-fetch.ts` in the `packages/cms/keystatic/src` directory and add the following code:

```tsx
function mockWorkerdFetch() {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async function (...args) {
    try {
      return await originalFetch.apply(this, args);
    } catch (e) {
      if (!args[1] || typeof args[1] !== 'object') throw e;

      const unimplementedCacheError =
        e &&
        typeof e === 'object' &&
        'message' in e &&
        e.message ===
          "The 'cache' field on 'RequestInitializerDict' is not implemented.";
      if (!unimplementedCacheError) throw e;

      const newOpts = { ...args[1] };
      delete newOpts.cache;
      return originalFetch.apply(this, [args[0], newOpts]);
    }
  };
}

mockWorkerdFetch();
```

Open the file `packages/cms/keystatic/src/create-reader.ts` and add the following line at the top of the file:

```tsx
import './mock-workerd-fetch';
```

---
title: 'Setting the Database Webhooks required to run the Next.js Supabase SaaS kit'
label: 'Database Webhooks'
description: 'Database Webhooks from Supabase allow our app to intercept events and handle them. Learn how to setup database webhooks.'
position: 1
---

Makerkit uses Database Webhooks in response to changes in the database.

This allows the app to intercept events and handle them for various purposes, such as sending emails after an invitation, or canceling a subscription after a user deletes their account.

As such, it is mandatory to set up the Database Webhooks in your Supabase instance for the app to work correctly.

First, you need to generate a secret and set it using the environment variable `SUPABASE_DB_WEBHOOK_SECRET`.

We use this varable in two places:
1. In the Supabase webhooks headers, so the server can authenticate the request is coming from Supabase
2. In the server, so we can authenticate the request is coming from Supabase

Please set the `SUPABASE_DB_WEBHOOK_SECRET` environment variable:

```bash
SUPABASE_DB_WEBHOOK_SECRET=**************************************************
```

**Note**: Make it a strong secret key - and make sure to keep it secret!

Once you have set the environment variable, you need to deploy the Supabase DB webhooks to your Supabase instance.

Make sure to add the following header `X-Supabase-Event-Signature` with the value of the `SUPABASE_DB_WEBHOOK_SECRET` to the request.

In this way - your server will be able to authenticate the request and be sure it's coming from your Supabase instance.

As the endpoint, remember to use the `/api/db/webhook` endpoint. If your APP URL is `https://myapp.vercel.app`, the endpoint will be `https://myapp.vercel.app/api/db/webhook`. Please be sure to use your real APP URL.

#### Adding Database Webhooks from Supabase Studio

The below is only needed when going to production. The local development seed.sql script will add the webhooks for you.

While you can create a migration to add the database webhooks, you can also add them from the Supabase Studio.

Here are the steps to add the webhooks from the Supabase Studio:

1. Go to the Supabase Studio
2. Go to Database->Webhooks
3. Click on "Enable Webhooks"
4. Click on "Create a new hook"

Now, replicate the webhooks at `apps/web/supabase/seed.sql` using the UI:

1. Please remember to set the `X-Supabase-Event-Signature` header with the value of the `SUPABASE_DB_WEBHOOK_SECRET` to the request.
2. Please remember to set the endpoint to `/api/db/webhook` using your real APP URL. If your APP URL is `https://myapp.vercel.app`, the endpoint will be `https://myapp.vercel.app/api/db/webhook`.
3. Use 5000 as the timeout.

Alternatively, you can also set these using a migration - but it's not recommended since you'd need to store the secret in the migration file.

##### Webhooks to add

We need to add the following webhooks:

1. `delete` on `public.accounts`
2. `delete` on `public.subscriptions`
3. `insert` on `public.invitations`

Please make sure to add these webhooks to your Supabase instance.

---
title: "Generating and validating the environment variables needed for deployment"
label: "Environment Variables"
description: "Guide to generate and validate the environment variables needed for deployment"
position: 1
---

Makerkit has a lot of environment variables that need to be set for the project to work correctly. The environment variables are validated using Zod, so if you miss any, the project will not build correctly - at least in most cases.

While this can be annoying, you will agree with me that it's better to have a project that doesn't build than a project that doesn't work correctly.

## Before you start

Before you get started, make sure you have the following:

1. A Stripe/Lemon Squeezy account with the API keys and Webhook secret
2. A Supabase account with the API keys
3. A Mailer account with the API keys

If you don't have these, you can sign up for them. The project will not work correctly without these (well, you can fake them and deploy anyway, but it won't work correctly).

Why is Makerkit requiring these variables? I just want to deploy the project! Well, Makerkit tries quite hard to validate the project to make sure it works correctly. The environment variables are crucial for the project to work correctly. If you don't have them, the project will not work correctly. If you don't have the required services, maybe it's just not yet time to deploy the project.

## Generating the environment variables

Makerkit provides a script that will guide you through the process of generating the environment variables. To generate the environment variables, run the following command:

```bash
turbo gen env
```

This command will guide you through the process of generating the environment variables. It will ask you for the values of the environment variables and generate a `.env.local` at `turbo/generators/templates/env/.env.local`.

This file is to never be committed to the repository. It is a template file that you can use to set the environment variables in your deployment environment.

For example, if you're using Vercel, you can copy/paste the contents of the `.env.local` file into the Vercel environment variables. Depending on your deployment environment, you may need to set the environment variables in a different way - but the `.env.local` file will guide you on what to set.

## Validating the environment variables

After generating the environment variables, you can validate them by running the following command:

```bash
turbo gen validate-env
```

By default, this command will validate the environment variables in the `.env.local` file `turbo/generators/templates/env`.

The generator (at this time) validates each single variable, not the schema as a whole. It is assumed the previous step has generated the correct variables and the validation is just to ensure they are set. In the future, I plan on making the validation even smarter.

## Validate, Validate, Validate

The environment variables are crucial for the project to work correctly. If you miss any, the project will not work correctly. So please make sure to validate the environment variables before deploying the project.

---
title: "Deploy Next.js Supabase to Vercel"
label: "Deploy to Vercel"
position: 5
description: "Guide to deploy the Next.js SaaS boilerplate to Vercel"
---

Deploying to Vercel should be straightforward. You can deploy the Next.js SaaS boilerplate to Vercel by following these steps:

1. Connect your Repository to Vercel
2. Configure Environment Variables: the first time this may fail if you don't yet have a custom domain connected since you cannot place it in the environment variables yet. It's fine. Make the first deployment fail, then pick the domain and add it. Redeploy.
3. Deploy the Project

Vercel should be able to automatically infer the project settings and deploy it correctly.

<Image src="/assets/images/docs/vercel-turbo-preset.webp" width={1744} height={854} />

As you can see in the image, please make sure to:
1. use Next.js as the framework preset
2. point the root directory to the `apps/web` folder

<Alert type="warn">
  Please don't miss the steps above - they are crucial for the project to deploy correctly.
</Alert>

### Troubleshooting

In some cases, users have reported issues with the deployment to Vercel using the default parameters. If this is the case, please try the following:

1. Make sure to set the root directory to `apps/web`
2. Make sure to set the preset to Next.js
3. Manually enter the commands for installing and running the build, respectively: `pnpm i` for installing and `pnpm run build` for building the project. This is the case when Vercel tries to use `npm` instead of `pnpm`.

If the above steps don't work, please check the logs and see what the issue is. The logs should give you a hint on what is wrong.

## Environment Variables

Please make sure to set all the environment variables required for the project to work correctly.

A production deployment should be setting the below environment variables:

<Image src="/assets/images/docs/vercel-env-variables-turbo.webp" width={1694} height={1874} />

Failure to set the environment variables will result in the project not working correctly.

If the build fails, deep dive into the logs to see what is the issue. Our Zod configuration will validate and report any missing environment variables. To find out which environment variables are missing, please check the logs.

## Deploying to Vercel Edge Functions

If you want to deploy the project with Edge Functions, then the same steps as Cloudflare apply.

Please follow the same steps as for [Cloudflare](cloudflare) and then deploy the project to Vercel.

1. Switch to an HTTP-based mailer (Cloudflare Mailer or Resend Mailer)
2. Switch to a remote CMS (Wordpress or Keystatic Github mode)

The above should be all! By following the steps, you should be able to deploy the Next.js SaaS boilerplate to Vercel's Edge Functions with zero cold starts, better speed and lower costs!

Please be mindful of the limitations of the Edge runtime:

1. potentially higher latency to your database
2. limited Node.js features
3. limited access to the Node.js ecosystem

If you are fine with the above, then Vercel is a great choice for deploying your Next.js SaaS boilerplate.

## I have more apps - how do I deploy them?

Vercel should automatically take care of deploying the app named `web`.

If you have multiple apps, you may need to customize the build command to point to the app being deployed.

```
cd ../.. && turbo run build --filter=<app-name>
```

Please replace `<app-name>` with the name of the app you want to deploy.

For more info refer to the [Vercel documentation](https://vercel.com/docs/monorepos/turborepo).

---
title: "Clone the Next.js Supabase SaaS Kit Turbo Repository"
label: "Clone the Repository"
position: 4
description: "Clone the Next.js Supabase SaaS Kit Turbo repository to your local machine."
---
## Prerequisites

To get started with Makerkit, ensure you have the following prerequisites installed and set up:

- **Node.js 18.x or later**
- **Docker**
- **Pnpm**
- **Supabase account** (optional for local development)
- **Payment Gateway account** (Stripe or Lemon Squeezy)
- **Email Service account** (optional for local development)

## Cloning the Repository

Clone the repository using the following command:

```bash
git clone git@github.com:makerkit/next-supabase-saas-kit-turbo
```

**Note:** If your SSH key isn't set up, use HTTPS instead:

```bash
git clone https://github.com/makerkit/next-supabase-saas-kit-turbo
```

### Important: Use HTTPS for All Commands if Not Using SSH

If you are not using SSH, ensure you switch to HTTPS for all Git commands, not just the clone command.

## Configuring Git Remotes

After cloning the repository, remove the original `origin` remote:

```bash
git remote rm origin
```

Add the upstream remote pointing to the original repository to pull updates:

```bash
git remote add upstream git@github.com:makerkit/next-supabase-saas-kit-turbo
```

Once you have your own repository set up, add your repository as the `origin`:

```bash
git remote add origin <your-repository-url>
```

### Keeping Your Repository Up to Date

To pull updates from the upstream repository, run the following command daily (preferably with your morning coffee ☕):

```bash
git pull upstream main
```

This ensures your repository stays up to date with the latest changes.

## 0.1. Install Pnpm

Install Pnpm globally with the following command:

```bash
npm i -g pnpm
```

## 1. Setup Dependencies

Install the necessary dependencies for the project:

```bash
pnpm i
```

With these steps completed, your development environment will be set up and ready to go! 🚀

## 2. Post-merge Hooks

It's very useful to run the following command after pulling updates from the upstream repository:

```bash
pnpm i
```

This ensures that any new dependencies are installed and the project is up to date. We can run this command automatically after pulling updates by setting up a post-merge hook.

Create a new file named `post-merge` in the `.git/hooks` directory:

```bash
touch .git/hooks/post-merge
```

Add the following content to the `post-merge` file:

```bash
#!/bin/bash

pnpm i
```

Make the `post-merge` file executable:

```bash
chmod +x .git/hooks/post-merge
```

Now, every time you pull updates from the upstream repository, the `pnpm i` command will run automatically to ensure your project is up to date. This ensures you're always working with the latest changes and dependencies and avoid errors that may arise from outdated dependencies.
---
label: "Code Health and Testing"
title: "Code Health and Testing in Makerkit. Set up Github Actions, pre-commit hooks, and more."
position: 10
description: "Learn how to set up Github Actions, pre-commit hooks, and more in Makerkit to ensure code health and quality."
---

Makerkit provides a set of tools to ensure code health and quality in your project. This includes setting up Github Actions, pre-commit hooks, and more.

## Github Actions

By default, Makerkit sets up Github Actions to run tests on every push to the repository. You can find the Github Actions configuration in the `.github/workflows` directory.

The workflow has two jobs:

1. `typescript` - runs the Typescript compiler to check for type errors.
2. `test` - runs the Playwright tests in the `tests` directory.

### Enable E2E Tests

Since it needs some setup - these are not enabled by default. To enable E2E tests, you need to set the following environment variables in the Github Actions workflow:

```bash
ENABLE_E2E_JOB=true
```

### Configuring the E2E environment for Github Actions
To set up Github Actions for your project, please add the following secrets to your repository Github Actions settings:

1. `SUPABASE_SERVICE_ROLE_KEY` - the service role key for Supabase.
2. `SUPABASE_DB_WEBHOOK_SECRET` - the webhook secret for Supabase.
3. `STRIPE_SECRET_KEY` - the secret key for Stripe.
4. `STRIPE_WEBHOOK_SECRET` - the webhook secret for Stripe.

These are the same as the ones you have running the project locally. Don't use real secrets here - use the development app secrets that you use locally. **This is a testing environment**, and you don't want to expose your production secrets.

Additionally, please set the following environment variables in the Github Actions workflow:

1. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - this is the publishable key for Stripe.
2. `SUPABASE_DB_WEBHOOK_SECRET`: Use the value `WEBHOOKSECRET` for the webhook secret. Again, this is a testing environment, so we add testing values.

### Enable Stripe Tests

Since it needs some setup - these are not enabled by default. To enable Stripe tests, you need to set the following environment variables in the Github Actions workflow:

```bash
ENABLE_BILLING_TESTS=true
```

Of course - make sure you have the Stripe secrets set up in the Github Actions secrets.

## Pre-Commit Hook

It's recommended to set up a pre-commit hook to ensure that your code is linted correctly and passes the typechecker before committing.

### Setting up the Pre-Commit Hook

To do so, create a `pre-commit` file in the `./.git/hooks` directory with the following content:

```bash
#!/bin/sh

pnpm run typecheck
pnpm run lint
```

Turborepo will execute the commands for all the affected packages - while skipping the ones that are not affected.

### Make the Pre-Commit Hook Executable

Now, make the file executable:

```bash
chmod +x ./.git/hooks/pre-commit
```

To test the pre-commit hook, try to commit a file with linting errors or type errors. The commit should fail, and you should see the error messages in the console.

### What about the e2e tests?

You could also add tests - but it'll slow down your commits. It's better to run tests in Github Actions.

---
title: 'Common commands you need to know for the Next.js Supabase Turbo Starter Kit'
label: 'Common Commands'
position: 5
description: 'Learn about the common commands you need to know to work with the Next.js Supabase Turbo Starter Kit.'
---

Here are some common commands you'll need to know when working with the Next.js Supabase Turbo Starter Kit.

**Note:** You don't need these commands to kickstart your project, but it's useful to know they exist for when you need them.

## Installing Dependencies

To install the dependencies, run the following command:

```bash
pnpm i
```

This command will install all the necessary dependencies for the project.

## Starting the Development Server

Start the development server for the web application with:

```bash
pnpm run dev
```

## Running Supabase CLI Commands

Supabase is installed in the `apps/web` folder. To run commands with the Supabase CLI, use:

```bash
pnpm run --filter web supabase <command>
```

For example, if Supabase documentation recommends a command like:

```bash
supabase db link
```

You would run:

```bash
pnpm run --filter web supabase db link
```

## Starting Supabase

To start Supabase, run:

```bash
pnpm run supabase:web:start
```

This command starts the Supabase web server.

## Starting Stripe

To test the billing system, start Stripe with:

```bash
pnpm run stripe:listen
```

This routes webhooks to your local machine.

## Resetting Supabase

To reset the Supabase database, which is necessary when you update the schema or need a fresh start, run:

```bash
pnpm run supabase:web:reset
```

## Generate Supabase Types

When you update the Supabase schema, generate the latest types for the client by running:

```bash
pnpm run supabase:web:typegen
```

This should be done every time the Supabase schema is updated.

## Running Tests

To run the tests for the project, use:

```bash
pnpm run test
```

## Cleaning the Project

To clean the project, run:

```bash
pnpm run clean:workspaces
pnpm run clean
```

Then, reinstall the dependencies:

```bash
pnpm i
```

## Type-Checking the Project

To type-check the project, use:

```bash
pnpm run typecheck
```

## Linting the Project

To lint the project using ESLint, run:

```bash
pnpm run lint:fix
```

## Formatting the Project

To format the project using Prettier, run:

```bash
pnpm run format:fix
```

These commands will help you manage and maintain your project efficiently.
---
title: "Conventions in the Next.js Supabase Turbo Starter Kit"
label: "Conventions"
position: 3
---

Below are some of the conventions used in the Next.js Supabase Turbo Starter Kit.

You're not required to follow these conventions: they're simply a standard set of practices used in the core kit. If you like them - I encourage you to keep these during your usage of the kit - so to have consistent code style that you and your teammates understand.

### Turborepo Packages

In this project, we use Turborepo packages to define reusable code that can be shared across multiple applications.

- **Apps** are used to define the main application, including routing, layout, and global styles.
- Apps pass down configuration to the packages, and the packages provide the corresponding logic and components.

### Creating Packages

**Should you create a package for your app code?**

- **Recommendation:** Do not create a package for your app code unless you plan to reuse it across multiple applications or are experienced in writing library code.
- If your application is not intended for reuse, keep all code in the app folder. This approach saves time and reduces complexity, both of which are beneficial for fast shipping.
- **Experienced developers:** If you have the experience, feel free to create packages as needed.

### Imports and Paths

When importing modules from packages or apps, use the following conventions:

- **From a package:** Use `@kit/package-name` (e.g., `@kit/ui`, `@kit/shared`, etc.).
- **From an app:** Use `~/` (e.g., `~/lib/components`, `~/config`, etc.).

### Non-Route Folders

Non-route folders within the `app` directory are prefixed with an underscore (e.g., `_components`, `_lib`, etc.).

- This prefix indicates that these folders are not routes but are used for shared components, utilities, etc.

### Server Code

Files located in `server` folders are intended for server-side code only. They should not be used in client-side code.

- This convention helps clarify where the code is meant to run, which is particularly important in Next.js where the distinction can be blurry.
- For example, server-related code for a part of the app can be found in the `_lib/server` folder.
- Include the `server-only` package at the top of the file to ensure it is not accidentally imported in client-side code.
---
title: "FAQ - Questions about the Next.js SaaS Boilerplate"
label: "FAQ"
position: 11
description: "Frequently asked questions about the Next.js SaaS Boilerplate."
---
The below is a technical FAQ about this kit. For general questions about Makerkit, please see the [Makerkit FAQ](/faq).

## Technical FAQ

### Do I need to know Supabase to use the Next.js SaaS Boilerplate?

Yes, you should have a basic understanding of Supabase to use the Next.js SaaS Boilerplate. You'll need to know how to:

- Create a Supabase project
- Set up the database
- Understand PostgreSQL
- Use the Supabase client in your Next.js app

While you can use the kit to learn, it does not teach you how to use Supabase. For that, please refer to the [Supabase documentation](https://supabase.com/docs).

### Do I need to know Next.js to use the Next.js SaaS Boilerplate?

Yes, you should have a basic understanding of Next.js to use the Next.js SaaS Boilerplate.

### I don't know Supabase! Should I buy the Next.js SaaS Boilerplate?

You should be prepared for a learning curve or consider learning Supabase first. The Next.js SaaS Boilerplate is built on top of Supabase, so knowing how to use Supabase is essential.

### I don't know Turborepo! Should I buy the Next.js SaaS Boilerplate?

Yes, you can still use the Next.js SaaS Boilerplate without prior knowledge of Turborepo. Turborepo is used to manage the monorepo structure of the boilerplate. Your main focus will be on building your SaaS product within the `apps/web` directory, not on the tools used to build the boilerplate. Even without experience using Turborepo, you won't need to interact with it directly unless you plan to customize the core code in the `packages` directory.

### Will you add more packages in the future?

Very likely! This kit is designed to be modular, allowing for new features and packages to be added without interfering with your existing code. There are many ideas for new packages and features that may be added in the future.

### Can I use this kit for a non-SaaS project?

This kit is primarily intended for SaaS projects. If you're building a non-SaaS project, the Next.js SaaS Boilerplate might be overkill. You can still use it, but you might need to remove some features specific to SaaS projects.

### Can I use personal accounts only?

Yes, you can set a feature flag to disable team accounts and use personal accounts only.

### Can I use the React package X with this kit?

Yes, you can use any React package with this kit. The kit is a simple Next.js application, so you are generally only constrained by the underlying technologies (Next.js, Stripe, Supabase, etc.) and not by the kit itself. Since you own and can edit all the code, you can adapt the kit to your needs. However, if there are limitations with the underlying technology, you might need to work around them.

### Does Makerkit set up the production instance for me?

No, Makerkit does not set up the production instance for you. This includes setting up Supabase, Stripe, and any other services you need. Makerkit does not have access to your Stripe or Supabase accounts, so setup on your end is required. Makerkit provides the codebase and documentation to help you set up your SaaS project.

### How do I get support if I encounter issues?

For support, you can:

1. Visit our Discord
2. Contact us via support email

### Are there any example projects or demos?

Yes - you get access to the OpenAI demo.

### How do I deploy my application?

Please check the [production checklist](checklist) for more information.

### How do I contribute to the Next.js SaaS Boilerplate?

We welcome contributions! Please ping me if you'd like to contribute (licensees only).

### How do I update my project when a new version of the boilerplate is released?

Please [read the documentation for updating your Makerkit project](updating-codebase).

---
title: 'Functional Walkthrough - Next.js Supabase Turbo Starter Kit'
label: 'Walkthrough'
position: 8
description: 'A functional walkthrough of the Next.js Supabase Turbo Starter Kit. Understand the features and how to use the kit.'
---

This is a functional walkthrough of the Next.js Supabase Turbo Starter Kit. In this guide, you'll learn about the functional aspects of the kit.

## Overview of the Next.js Supabase Turbo Starter Kit

We can break down the Next.js Supabase Turbo Starter Kit into the following functional sections:

1. **Marketing / External Section** - the public-facing part of the application. This also includes the blog and documentation.
2. **Authentication** - the authentication system of the application.
3. **Personal Account Features** - the features available to personal accounts.
4. **Team Account Features** - the features available to team accounts.
5. **Invitations** - the invitation system of the application.
6. **Super Admin** - the super admin features of the application.

## Marketing / External Section

The marketing section is the public-facing part of the application. It is where users can learn about the product, the pricing and the legal information.

### Home Page

The home page is the landing page of the application. It showcases the features of the product and encourages users to sign up.

<Image src="/assets/images/docs/walkthrough/home-page.webp" width={3420} height={2142} />

### Pricing

The pricing page is where users can learn about the different pricing plans of the product.

<Image src="/assets/images/docs/walkthrough/pricing.webp" width={3420} height={2142} />

This section is also added to the home page.

### FAQ

The FAQ page is where users can find answers to common questions about the product.

<Image src="/assets/images/docs/walkthrough/faq.webp" width={3420} height={2142} />

### Contact

The contact page is where users can get in touch with the company. It includes a contact form that allows users to send messages to the company directly.

<Image src="/assets/images/docs/walkthrough/contact.webp" width={3420} height={2142} />

### Content Pages

Content pages can be displayed using the CMS that you have setup. By default, the kit implements a Blog and a Documentation systems using either Keystatic or Wordpress. You can choose which one you prefer.

#### Blog

The blog is where the company can publish articles about the product, the industry, and other topics.

Below is the page where all the latest blog posts are listed:

<Image src="/assets/images/docs/walkthrough/blog.webp" width={3420} height={2142} />

And here is an example of a blog post:

<Image src="/assets/images/docs/walkthrough/blog-post.webp" width={3420} height={2142} />

#### Documentation

The documentation is where users can learn how to use the product. It includes guides, tutorials, and reference material.

<Image src="/assets/images/docs/walkthrough/walkthrough-documentation.webp" width={3420} height={2142} />

### Legal Pages

The legal pages are, of course, empty and need to be filled in with the appropriate legal information.

Don't use ChatGPT to fill them up. It's a bad idea.

## Authentication

The authentication system is where users can sign up, sign in, reset their password. It also includes multi-factor authentication.

### Sign Up

The sign-up page is where users can create an account. They need to provide their email address and password.

<Image src="/assets/images/docs/walkthrough/sign-up.webp" width={3420} height={2142} />

Once successful, users are asked to confirm their email address. This is enabled by default - and due to security reasons, it's not possible to disable it.

<Image src="/assets/images/docs/walkthrough/sign-up-success.webp" width={3420} height={2142} />

### Sign In

The sign-in page is where users can log in to their account. They need to provide their email address and password.

<Image src="/assets/images/docs/walkthrough/sign-in.webp" width={3420} height={2142} />

### Password Reset

The password reset page is where users can reset their password. They need to provide their email address.

<Image src="/assets/images/docs/walkthrough/password-reset.webp" width={3420} height={2142} />

### Multi-Factor Authentication

Multi-Factor Authentication (MFA) is an additional layer of security that requires users to provide two or more verification factors to sign in to their account.

First, users need to enable MFA and add a factor:

<Image src="/assets/images/docs/walkthrough/setup-mfa.webp" width={3420} height={2142} />

Then, after signing in, users need to provide the verification code:

<Image src="/assets/images/docs/walkthrough/verify-mfa.webp" width={3420} height={2142} />

## Internal / Behind authentication pages

After signing in - users are redirected to the internal pages of the application. These pages are only accessible to authenticated users.

The internal part of the application is divided into two workspaces:

1. The user workspace
2. The team workspace (optional)

This is how this works:

1. **Personal Account** - all users have a personal account. This is where they can: manage their settings, choose a team account - and **optionally** subscribe to a plan, or access the features you provide.
2. **Team Account (optional)** - users can create a team account - and invite other users to join. The team account has its own workspace - where users can manage the team settings, members, and billing.

Generally speaking, **it's up to you** to decide what features are available to personal accounts and team accounts. You can choose to disable billing for personal accounts - and only enable it for team accounts - or vice versa.

One simple rule of a thumb is that personal accounts are for individuals - and team accounts are for organizations. Personal accounts cannot be disabled, as that would disallow users from accessing the application should they not be part of a team - which doesn't make sense.

## Personal Account Features

The personal account workspace is where users can access the features available to their personal account.

This is the home page after logging in - and it's the user workspace:

1. Home Page - empty by default (but you can optionally provide the list of teams the user is part of)
2. Account Settings
3. Billing (if enabled)

### Home Page of the user workspace

By default - the user home is an empty page - as it's likely you will want to place some content that is unique to your SaaS.

However, we provide a component that allows you to lists the team an account is part of: this is useful for B2B SaaS rather than B2C.

The internal pages have two layouts:

1. A sidebar layout (default)
2. A top navigation layout

You can choose any of the two - and also choose either one for the user layout or the account layout.

Below is the user home page with the sidebar layout:

<Image src="/assets/images/docs/walkthrough/user-home-sidebar.webp" width={3420} height={2142} />

And below is the user home page with the top navigation layout:

<Image src="/assets/images/docs/walkthrough/user-home-header.webp" width={3420} height={2142} />

You can choose the one that fits your needs.

### Account Settings of the user workspace

From the navigation - users can access their account settings. Here they can update their profile information, change their password, language, multi-factor authentication, and more.

We've used light mode so far - how about dark mode? Let's switch to dark mode:

<Image src="/assets/images/docs/walkthrough/user-account-settings.webp" width={3420} height={2142} />

### Billing of the user workspace

Users can check out and subscribe to a plan - or visit the billing portal - from the billing page.

**This is only visible if billing is enabled**: you can choose to disable billing for a personal account - and only enable it for team accounts - or vice versa.

<Image src="/assets/images/docs/walkthrough/user-billing.webp" width={3420} height={2142} />

Once choosing a plan - we load the embedded checkout form from Stripe (or Lemon Squeezy).

After subscribing, the billing page will show the subscription details.

<Image src="/assets/images/docs/walkthrough/user-billing-plan.webp" width={3420} height={2142} />

## Team Account Features

From the profile dropdown, users can choose:

1. Switch to a team account
2. Create a team account

<Image src="/assets/images/docs/walkthrough/user-profile-dropdown.webp" width={876} height={796} />

In a team account workspace - users can access the following features:

1. A team account home page: by default - we display a mock dashboard, just as an example.
2. Account settings: users can update the team account settings.
3. Members: users can view the members of the team account.
4. Billing: users can view the billing of the team account.

### Home Page of the team workspace

By default - the team home is a mock dashboard - just as an example. You can replace this with your own dashboard - or any other content.

<Image src="/assets/images/docs/walkthrough/team-account-dashboard.webp" width={3420} height={2142} />

### Account Settings of the team workspace

From the navigation - users can access the team account settings. Here they can update the team account information, or delete the team account (if owner), or leave the team account (if member).

<Image src="/assets/images/docs/walkthrough/team-account-settings.webp" width={3420} height={2142} />

### Members page of the team workspace

From the navigation - users can access the members of the team account.

Here they can:

1. view the members
2. invite new members
3. remove or update an existing member
4. transfer ownership to another member
5. remove or update an invitation

<Image src="/assets/images/docs/walkthrough/team-account-members.webp" width={3420} height={2142} />

### Billing of the team workspace

If enabled - users can view the billing of the team account - and subscribe to a plan or visit the billing portal.

<Image src="/assets/images/docs/walkthrough/team-account-billing.webp" width={3420} height={2142} />

## Joining a team account

When a user is invited to join a team account - they receive an email with an invitation link. After signing up or signing in - they are redirected to the join page.

<Image src="/assets/images/docs/walkthrough/sign-up-invite.webp" width={3420} height={2142} />

### Join Page

The join page is where users can join a team account.

<Image src="/assets/images/docs/walkthrough/join-team.webp" width={3420} height={2142} />

## Super Admin

The super admin is the administrator of the SaaS. They have access to a special set of features that allow them to manage the accounts of the SaaS.

### Home Page of the super admin

The home page is a small overview of the SaaS.

You can easily customize this page to show the most important metrics of your SaaS.

<Image src="/assets/images/docs/walkthrough/super-admin-dashboard.jpg" width={3420} height={2142} />

### Listing the accounts of the SaaS

The super admin can view all the accounts of the SaaS. They can filter the accounts by personal accounts, team accounts, or all accounts.

<Image src="/assets/images/docs/walkthrough/super-admin-accounts.webp" width={3420} height={2142} />

### Viewing the account details

The super admin can view the details of an account. They can see the account information, the members of the account, and the billing information.

Additionally, they can perform the following actions:

1. Ban the account (or unban)
2. Delete the account

<Image src="/assets/images/docs/walkthrough/super-admin-account.webp" width={3420} height={2142} />

## Conclusion

This concludes the functional walkthrough of the Next.js Supabase Turbo Starter Kit. You should now have a good understanding of the features of the kit and how to use it. If you have any questions, feel free to reach out to us. We're here to help!

---
title: 'Introduction to Next.js Supabase SaaS Kit Turbo Repository'
label: 'Introduction'
position: 1
description: 'Introducing the Next.js Supabase SaaS Kit Turbo repository, which is a Next.js starter kit for building SaaS applications with Supabase.'
---

# Next.js Supabase SaaS Kit Documentation

Welcome to the latest version of the Next.js Supabase SaaS Kit! This starter kit is designed to help you build robust SaaS applications using the powerful combination of Next.js and Supabase. Whether you're a beginner or an experienced developer, this documentation will guide you through the setup, configuration, and deployment of your SaaS application.

## What's New? 🎉

Compared to previous versions, this kit includes:

- **More Functionality:** Enhanced features to meet modern SaaS requirements.
- **Organized Code:** A cleaner, more maintainable codebase.
- **Modern Dependencies:** Up-to-date libraries and tools.

## Features

### Authentication

- **Sign Up, Sign In, Sign Out:** Easy and secure user authentication.
- **Forgot Password:** Simple password recovery process.

### Multi-Factor Authentication (MFA)

- **Enable MFA:** Add an extra layer of security to your account.

### Account Management

- **Personal Accounts:** Users have their own personal accounts in addition to organization accounts.
- **Organization Accounts:** Users can create and join organizations.
- **Organization Roles:** Assign different roles to users within organizations.
- **Organization Invitations:** Invite others to join your organization.

### Billing

- **Personal Account Billing:** Manage billing information for personal accounts.
- **Organization Billing:** Handle billing for organization accounts.
- **Subscriptions:** Support for various subscription plans, including flat, tiered, and per-seat models.
- **Multiple Billing Providers:** Out-of-the-box support for Stripe, Lemon Squeezy, and (soon) Paddle.

### Content Management Systems (CMS)

- **Multiple CMS Support:** Integration with Keystatic and WordPress.

### Monitoring

- **Monitoring Tools:** Built-in support for Sentry and Baselime.

## A Modular, Extensible, and Modern SaaS Starter Kit

### Modular Structure

The biggest change in this kit is its modular structure, which allows for:

- **🧩 Easy Feature Integration:** Plug new features into the kit with minimal changes.
- **🛠️ Simplified Maintenance:** Keep the codebase clean and maintainable.
- **🎯 Core Feature Separation:** Distinguish between core features and custom features.
- **🌟 Additional Modules:** Easily add modules like billing, CMS, monitoring, logger, mailer, and more.

## Scope of This Documentation

### Focus on the Kit

While building a SaaS application involves many moving parts, this documentation focuses specifically on the Next.js Supabase SaaS Kit. For in-depth information on the underlying technologies (Next.js, Supabase, Turbo, etc.), please refer to their respective official documentation.

This documentation will guide you through configuring, running, and deploying the kit, and will provide links to the official documentation of the underlying technologies where necessary. To fully grasp the kit's capabilities, it's essential to understand these technologies, so be sure to explore their documentation as well.

For anything strictly related to the Next.js Supabase SaaS Kit, this documentation has you covered!

### Refer to Official Documentation

For in-depth understanding of the underlying technologies, refer to their official documentation:

- **Next.js:** [Next.js Documentation](https://nextjs.org)
- **Supabase:** [Supabase Documentation](https://supabase.com)
- **Stripe:** [Stripe Documentation](https://stripe.com)

Understanding these technologies is crucial for building a successful SaaS application.

## Conclusion

This Next.js Supabase SaaS Kit is designed to accelerate your SaaS development with a robust, modular, and extensible foundation. Dive into the documentation, explore the features, and start building your SaaS application today! 🚀
---
title: "Guidelines for migrating from Makerkit v1"
label: "Migrating from v1"
position: 9
description: "Guidelines for migrating from Makerkit v1 to Next.js SaaS Boilerplate."
---

🚀 Welcome to your journey from Makerkit v1 to the Next.js SaaS Boilerplate! 

This guide is designed to help you understand the changes between the two versions and navigate your project migration to the new v2. Whether you're a seasoned developer or just starting out, we've got you covered!

Here's a roadmap of the steps you'll take:

1. **Bootstrap a new project**: Kickstart a new project using the Next.js SaaS Boilerplate v2 🎉
2. **Update Schema**: Tweak the Postgres schema foreign key references, and integrate your existing tables 🧩
3. **Move files from older app**: Transport your files to the new app structure 📦
4. **Update imports to existing files**: Refresh imports to align with the new file structure 🔄
5. **Update configuration**: Modify the configuration files to match the new schemas ⚙️

## 1. Bootstrap a new project

The Next.js SaaS Boilerplate is a fresh take on Makerkit v1. You'll need to create a new project using this innovative boilerplate. Follow the [installation guide](clone-repository) to get your new project up and running in no time!

## 2. Update Schema

The schema in the Next.js SaaS Boilerplate has evolved significantly from Makerkit v1. You'll need to update your Postgres schema to match the new one.

Previously, you'd have a foreign key set to the organization ID:

```sql
organization_id bigint not null references organizations(id) on delete cascade,
```

Now, you'll have a foreign key set to the account ID as a UUID:

```sql
account_id uuid not null references public.accounts(id) on delete cascade,
```

In v2, an account can be both a user or an organization. So, instead of referencing the organization ID as in v1, you'll now reference the account ID. 

## 3. Move files from older app

In v2, you have the flexibility to add these files to either the "user scope" (`/home`) or the "account scope" (`/home/[account]`). Choose the one that best suits your project needs.

## 4. Update imports to existing files

You'll need to update the imports to your existing files to match the new file structure. This applies to all the components and utilities that you imported from Makerkit. For instance, a button previously imported from `~/core/ui/Button`, will now be imported from `@kit/ui/button`.

## 5. Update configuration

Lastly, you'll need to update the configuration files to match the new schemas. The configuration is now split across various files at `apps/web/config`. Pay special attention to the billing schema, which is now more versatile (and a bit more complex).

Ready to get started? Let's dive in! 🏊‍♀️
---
title: "Navigating the your Next.js Supabase Turbo Starter Kit codebase"
label: "Navigating the Codebase"
position: 7
description: "Learn how to navigate the codebase of the Next.js Supabase Turbo Starter Kit. Understand the project structure and how to update the codebase."
---

As mentioned before, this SaaS Starter Kit is modular, thanks to Turborepo - which makes it easy to manage multiple packages in a single repository.

## Project Structure

The main directories in the project are:
1. `apps` - the location of the Next.js app
2. `packages` - the location of the shared code and the API

### `apps` Directory

This is where the app (or the apps, should you add more) lives. The main app is a Next.js app, which is a React framework that allows you to build static and server-rendered web applications.

The Next.js app defines:

1. the configuration of the project
2. the routes of the application

### `packages` Directory

This is where the shared code and the API live. The shared code is a collection of functions that are used by both the Next.js app and the API. The API is a serverless function that is used to interact with the Supabase database.

The shared code defines:

1. shared libraries (Supabase, Mailers, CMS, Billing, etc.)
2. shared features (admin, accounts, account, auth, etc.)
3. UI components (buttons, forms, modals, etc.)

All apps can use and reuse the API exported from the `packages` directory. This makes it easy to have one, or many apps in the same codebase, sharing the same code.

## Diving into the Codebase

The codebase is structured in a way that makes it easy to navigate and update. Here are some of the key files and directories you should be aware of:

```
- apps
--- web
----- app
----- components
----- config
----- lib
----- content
----- styles
----- supabase
```


### Diving into `apps/web`

The `apps/web` directory is where the Next.js app lives. Here are some of the key directories and files you should be aware of:

1. `app` - this is where the main app lives. This is where you define the routes of the application.
2. `components` - this is where you define the shared components of the application.
3. `config` - this is where you define the configuration of the application.
4. `lib` - this is where you define the shared libraries of the application.
5. `content` - this is where you define the content of the application (by default, uses Keystatic Markdoc files)
6. `styles` - this is where you define the styles of the application.
7. `supabase` - this is where you define the Supabase configuration, migrations and tests

### Diving into `app`

The `app` directory is where the routing of the application is defined. Here are some of the key files you should be aware of:

```
- app
--- home
--- (marketing)
--- auth
--- join
--- admin
--- update-password
--- server-sitemap.xml
```

Let's break down the directories:

1. `home` - this is where the internal home of the application lives. This is where you define the routes when the user is logged in.
2. `(marketing)` - this is where the marketing pages of the application live. This is where you define the routes when the user is not logged in. It's a pathless route, so you don't see it in the URL.
3. `auth` - this is where the authentication pages of the application live. This is where you define the routes for the login, signup, and forgot password pages.
4. `join` - this is where the join pages of the application live. This route is the route where the user can join a team account following an invitation.
5. `admin` - this is where the admin pages of the application live. This is where you define the routes for the super admin pages.
6. `update-password` - this is where the update password pages of the application live. This is the route the user is redirected to after resetting their password.
7. `server-sitemap.xml` - this is where the sitemap of the application is defined.

### Diving into `home`

The `home` directory is where the internal dashboard of the application lives. Here are some of the key files you should be aware of:

```
--- home
------ (user)
------ [account]
```

Let's break down the directories:

1. `(user)` - this is where the user pages of the application live. This is where you define the routes for the personal account pages.
2. `[account]` - this is where the account pages of the application live. This is where you define the routes for the team account pages.

The `home` path allows us to separate the marketing pages from the internal dashboard pages.

So the user home page would be `/home/user` and the account home page would be `/home/[account]`.





---
title: "Running the Next.js Supabase Turbo project"
label: "Running the Project"
position: 4
description: "Learn how to run the Next.js Supabase Turbo project on your local machine."
---
To run the project, follow these steps to start the development server, Supabase, and Stripe (optional for billing system testing).

## 1. Start the Development Server

To start the web application development server, run:

```bash
# Start the development server
pnpm dev
```

This command launches the web application.

For more details about the web application, please refer to `apps/web/README.md`.

### Quick Start Credentials

Use the following credentials to get started right away:

- **Email**: `test@makerkit.dev`
- **Password**: `testingpassword`

To confirm email addresses, visit [Inbucket](http://localhost:54324/status). Supabase uses Inbucket to capture emails sent during the authentication process.

## 2. Start Supabase

Ensure Docker is running, then start Supabase with:

```bash
pnpm run supabase:web:start
```

This command initiates the Supabase web server.

## 3. Start Stripe (Optional)

To test the billing system, start Stripe by running:

```bash
pnpm run stripe:listen
```

This command routes webhooks to your local machine.

You now have the Next.js Supabase Turbo project running on your local machine. 🚀

## Deploying to Production

When you're ready to deploy the project to production, follow the [checklist](checklist) to ensure everything is set up correctly.

**Note:** Using Supabase's hosted instance is similar to deploying to production. Therefore, you still need to follow the checklist to ensure everything is properly configured.
---
title: "Technical Details"
label: "Technical Details"
position: 2
description: "A detailed look at the technical details of the Next.js Supabase SaaS Kit."
---

The kit is built as a [Turborepo](https://turbo.build) monorepo, and is broadly using the following technologies:

1. Next.js App Router (using Turbopack for faster builds)
2. Supabase for the database, authentication and storage
3. Shadcn UI for the UI components
4. React Query, Zod, Lucide React and other libraries
5. Configurable mailers (SMTP with Nodemailer or Resend)

Makerkit's modular architecture allows you to easily add or remove features, and customize the application to your needs.

Additionally, the kit is designed to be easily deployable to Vercel, Cloudflare, or any other hosting provider. It also supports edge rendering so you can deploy the application to Cloudflare Workers and go FAST.

### Monorepo Structure

Below are the reusable packages that can be shared across multiple applications (or packages):

- **@kit/ui**: Shared UI components and styles (using Shadcn UI and some custom components)
- **@kit/shared**: Shared code and utilities
- **@kit/supabase**: Supabase package that defines the schema and logic for managing Supabase
- **@kit/i18n**: Internationalization package that defines utilities for managing translations
- **@kit/billing**: Billing package that defines the schema and logic for managing subscriptions
- **@kit/billing-gateway**: Billing gateway package that defines the schema and logic for managing payment gateways
- **@kit/email-templates**: Here we define the email templates using the react.email package.
- **@kit/mailers**: Mailer package that abstracts the email service provider (e.g., Resend, Cloudflare, SendGrid, Mailgun, etc.)
- **@kit/monitoring**: A unified monitoring package that defines the schema and logic for monitoring the application with third party services (e.g., Sentry, Baselime, etc.)
- **@kit/database-webhooks**: Database webhooks package that defines the actions following database changes (e.g., sending an email, updating a record, etc.)
- **@kit/cms**: CMS package that defines the schema and logic for managing content
- **@kit/next**: Next.js specific utilities

And features that can be added to the application:

- **@kit/auth**: Authentication package (using Supabase)
- **@kit/accounts**: Package that defines components and logic for managing personal accounts
- **@kit/team-accounts**: Package that defines components and logic for managing team
- **@kit/admin**: Admin package that defines the schema and logic for managing users, subscriptions, and more.
- **@kit/notifications**: Notifications package that defines the schema and logic for managing notifications

And billing packages that can be added to the application:

- **@kit/stripe**: Stripe package that defines the schema and logic for managing Stripe. This is used by the @kit/billing-gateway package and abstracts the Stripe API.
- **@kit/lemon-squeezy**: Lemon Squeezy package that defines the schema and logic for managing Lemon Squeezy. This is used by the @kit/billing-gateway package and abstracts the Lemon Squeezy API.
- **@kit/paddle**: Paddle package that defines the schema and logic for managing Paddle. This is used by the @kit/billing-gateway package and abstracts the Paddle API. (Coming once they release their customer portal)

The CMSs that can be added to the application:

- **@kit/keystatic**: [Keystatic](https://keystatic.com/) package that defines the schema and logic for managing Keystatic. This is used by the @kit/cms package and abstracts the Keystatic API
- **@kit/wordpress**:  WordPress package that defines the schema and logic for managing WordPress. This is used by the @kit/cms package and abstracts the WordPress API.

Also planned (post-release):

- **@kit/plugins**: Move the existing plugins to a separate package here
- **@kit/analytics**: A unified analytics package to track user behavior

### Application Configuration

The configuration is defined in the `apps/web/config` folder. Here you can find the following configuration files:

- **app.config.ts**: Application configuration (e.g., name, description, etc.)
- **auth.config.ts**: Authentication configuration
- **billing.config.ts**: Billing configuration
- **feature-flags.config.ts**: Feature flags configuration
- **paths.config.ts**: Paths configuration (e.g., routes, API paths, etc.)
- **personal-account-sidebar.config.ts**: Personal account sidebar configuration (e.g., links, icons, etc.)
- **team-account-sidebar.config.ts**: Team account sidebar configuration (e.g., links, icons, etc.)

---
title: "Updating your Next.js Supabase Turbo Starter Kit"
label: "Updating the Codebase"
position: 6
description: "Learn how to update your Next.js Supabase Turbo Starter Kit to the latest version."
---

🚀 Ready to keep your project at the cutting edge? 

This guide will walk you through the process of updating your codebase by pulling the latest changes from the GitHub repository and merging them into your project. This ensures you're always equipped with the latest features and bug fixes.

If you've been following along with our previous guides, you should already have a Git repository set up for your project, with an `upstream` remote pointing to the original repository.

Updating your project involves fetching the latest changes from the `upstream` remote and merging them into your project. Let's dive into the steps!

## 0. Stashing your changes

If you have uncommited changes, before updating your project, it's a good idea to stash your changes to avoid any conflicts during the update process. You can stash your changes by running:

```bash
git stash
```

This will save your changes temporarily, allowing you to update your project without any conflicts. Once you've updated your project, you can apply your changes back by running:

```bash
git stash pop
```

If you don't have any changes to stash, you can skip this step and proceed with the update process. 🛅

Alternatively, you can commit your changes.

## 1. Refresh the `upstream` remote

The first step is to fetch the latest changes from the `upstream` remote. You can do this by running the following command:

```bash
git pull upstream main
```

When prompted the first time, please opt for merging instead of rebasing.

Don't forget to run `pnpm i` in case there are any updates in the dependencies. 🔄

## 2. Resolve any conflicts

Encountered conflicts during the merge? No worries! You'll need to resolve them manually. Git will highlight the files with conflicts, and you can edit them to resolve the issues.

### 2.1 Conflicts in the lock file "pnpm-lock.yaml"

If you find conflicts in the `pnpm-lock.yaml` file, accept either of the two changes (avoid manual edits), then run:

```bash
pnpm i
```

Your lock file will now reflect both your changes and the updates from the `upstream` repository. 🎉

### 2.2 Conflicts in the DB types "database.types.ts"

Your types might differ from those in the `upstream` repository, so you'll need to rebuild them. To do this, reset the DB:

```bash
npm run supabase:web:reset
```

Next, regenerate the types with the following command:

```bash
npm run supabase:web:typegen
```

Your types will now reflect the changes from both the `upstream` repository and your project. 🚀

### Run a health check on your project after resolving conflicts

After resolving the conflicts, it's time to test your project to ensure everything is working as expected. Run your project locally and navigate through the various features to verify that everything is functioning correctly.

You can run the following commands for a quick health check:

```bash
pnpm run typecheck
```

And lint your code with:

```bash
pnpm run lint
```

If everything looks good, you're all set! Your project is now up to date with the latest changes from the `upstream` repository. 🎉

## Commit and push changes

Once everything is working fine, don't forget to commit your changes with git commit -m "COMMIT_MESSAGE" and push them to your remote repository with git push origin BRANCH_NAME.

Of course - please make sure to replace COMMIT_MESSAGE and BRANCH_NAME with your actual commit message and branch name. 🚀
---
title: 'Configuring Baselime in your Next.js Supabase SaaS kit'
label: 'Baselime'
position: 1
---

[Baselime](https://baselime.io) (now part of Cloudflare) is an observability platform that helps you monitor your application's performance and errors. In this guide, you'll learn how to configure Baselime in your Next.js Supabase SaaS kit.

To use [Baselime](https://baselime.io) to capture exceptions and performance metrics of your app, please define the below variables:

```bash
NEXT_PUBLIC_BASELIME_KEY=your_key
NEXT_PUBLIC_MONITORING_PROVIDER=baselime
```

You can find your Baselime key in the Baselime dashboard.

If you also want to enable OpenTelemetry, you can set the following variables:

```bash
ENABLE_MONITORING_INSTRUMENTATION=true
INSTRUMENTATION_SERVICE_NAME=your_service_name
```

---
title: "Setting Monitoring in Makerkit"
label: "Monitoring"
position: 0
description: "Introducing how Makerkit handles monitoring of performance metrics and exceptions in the Next.js Supabase SaaS kit"
---

Makerkit provides first-class support for two monitoring providers:

1. Baselime (now part of Cloudflare)
2. Sentry

Makerkit will set up a few things for you out of the box:

1. **Performance Metrics** - Instrumentation using Next.js's instrumentation hook
2. **Client exceptions** - Automatically capturing uncaught exceptions on the client
3. **Server exceptions** - Automatically capturing server-side exceptions when using the functions `enhanceAction` and `enhanceRouteHandler`

Additionally, it provides you with the tools to manually capturing exceptions, should you want to.

### Configuring Monitoring in Makerkit

To set up monitoring in your application, you need to define the two variables below:

```bash
# sentry or baselime
NEXT_PUBLIC_MONITORING_PROVIDER=

# performance monitoring (only required for Baselime)
ENABLE_MONITORING_INSTRUMENTATION=true
INSTRUMENTATION_SERVICE_NAME=your_service_name
```

1. **Monitoring Provider** - the monitoring provider to use. Based on this variable, Makerkit will provide the relative implementation.
2. **Enable Instrumentation** - if enabled, we report performance metrics to the provider using Next.js

For the provider's specific settings, please check the relative documentation.

#### Performance Monitoring

Performance monitoring uses Next.js' experimental instrumentation for reporting performance metrics using OpenTelemetry.

NB: Performance monitoring is only enabled for Node.js runtimes.
---
title: 'Configuring Sentry in your Next.js Supabase SaaS kit'
label: 'Sentry'
position: 2
---

[Sentry](https://sentry.com) is an observability platform that helps you monitor your application's performance and errors. In this guide, you'll learn how to configure Sentry in your Next.js Supabase SaaS kit.

To use [Sentry](https://sentry.com) to capture exceptions and performance metrics of your app, please define the below variables:

```bash
NEXT_PUBLIC_MONITORING_PROVIDER=sentry
NEXT_PUBLIC_SENTRY_DSN=your_dsn
```

Please install the package `@sentry/nextjs` in `apps/web/package.json` as a dependency.

```bash
pnpm i @sentry/nextjs --filter web
```

Finally, update the Next.js configuration in your `next.config.js` file:

```tsx title="next.config.mjs"
import { withSentryConfig } from '@sentry/nextjs';

// wrap your Next.js configuration with the Sentry configuration
withSentryConfig(nextConfig);
```

You can find your Sentry DSN in the Sentry dashboard.

To upload source maps to Sentry, use the following options:

```tsx title="next.config.mjs"
import { withSentryConfig } from '@sentry/nextjs';

export default withSentryConfig(
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(config),
  {
    org: 'your-sentry-org-name',
    project: 'your-sentry-project-name',

    // An auth token is required for uploading source maps.
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: !IS_PRODUCTION, // Used to suppress logs
    autoInstrumentServerFunctions: false,
    widenClientFileUpload: true,
  },
);
```

And make sure to add the `SENTRY_AUTH_TOKEN` to your CI environment variables.

```bash
SENTRY_AUTH_TOKEN=your_auth_token
```

---
title: "Configuring Notifications in the Next.js Supabase Starter Kit"
description: "Learn how to configure notifications in the Next.js Supabase Starter Kit."
label: "Notifications Configuration"
position: 0
---

Makerkit allows you to configure and send notifications using the `@kit/notifications` package. The package provides a simple API to send notifications.

There are two variables that you can set in the `.env` file to configure notifications:

1. **NEXT_PUBLIC_ENABLE_NOTIFICATIONS**: Set this to `true` to enable notifications.
2. **NEXT_PUBLIC_REALTIME_NOTIFICATIONS**: Set this to `true` to enable real-time notifications.

```bash
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_REALTIME_NOTIFICATIONS=true
```

1. If `NEXT_PUBLIC_ENABLE_NOTIFICATIONS` is set to `false`, the bell icon will not appear in the header. Otherwise, it will appear.
2. If `NEXT_PUBLIC_REALTIME_NOTIFICATIONS` is set to `false`, the notifications will not be real-time. Otherwise, they will be real-time.

### Why would you not want to enable notifications?

If you are not using notifications in your application, you can disable them to reduce the complexity of your application. This can be useful if you are building a simple application and do not need notifications.

### Real-time notifications

If you want to enable real-time notifications, you need to set the `NEXT_PUBLIC_REALTIME_NOTIFICATIONS` environment variable to `true`. This will enable real-time notifications in your application.

This may be your preference for a more cost-effective solution, as it will reduce the number of requests to the server.
---
title: "Sending a notification in the Next.js Supabase Starter Kit"
description: "Learn how to send a notification in the Next.js Supabase Starter Kit."
label: "Sending Notifications"
position: 1
---

Makerkit allows you to send notifications using the `@kit/notifications` package. The package provides a simple API to send notifications.

The `createNotificationsApi` provides an easy to use API to send notifications. You can send notifications to users after they sign up, create a task, or perform any other action.

The service is a server-side service, so you can use it in your server actions or route handlers. This service **cannot be used from the client-side** since the only role who can insert notifications is the `service_role` role.

Here is a super simple example of how you can send a notification after a user signs up.

```tsx
import { createNotificationsApi } from '@kit/notifications';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

async function sendNotificationAfterSignup(
  accountId: string,
) {
  const client = getSupabaseServerAdminClient();
  const api = createNotificationsApi(client);

  await api.createNotification({
    account_id: accountId,
    body: 'You have successfully signed up!',
  });
}
```

In this example, we are sending a notification to the user after they sign up. The `account_id` is the ID of the user who signed up, and the `body` is the message that will be displayed in the notification.

Users will see the notifications if:
1. they're sent to their own account
2. they're sent to a team they're a member of

### Notification channels

You can send notifications to different channels using the `channel` field. For example, you can send a notification to the `email` or `in_app`. In-app notifications will be displayed in the app, while email notifications will be sent to the user's email. By default, notifications are sent to the `in_app` channel.

The `createNotificationsApi` function takes the `client` parameter - eg. the Supabase client.

```tsx
import { createNotificationsApi } from '@kit/notifications';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

async function sendNotificationAfterSignup(
  accountId: string,
) {
  const client = getSupabaseServerAdminClient();
  const api = createNotificationsApi(client);

  await api.createNotification({
    account_id: accountId,
    body: 'You have successfully signed up!',
    channel: 'email',
  });
}
```

The example above sends an email notification to the user after they sign up.

NB: this require a Database trigger to send the email notification! Please dont't forget to add the trigger in your database.

---

NB: at the time of writing, this is not yet implemented in the Next.js Supabase Starter Kit. It is a feature that is planned for the future.

### Notification types

You can send different types of notifications using the `type` field. For example, you can send a `info`, `warning`, or `error` notification.

By default, notifications are sent as `info`.

```tsx
import { createNotificationsApi } from '@kit/notifications';
import { getSupabaseServerAdminClient } from '@kit/supabase/server-admin-client';

async function sendNotificationAfterSignup(
  accountId: string,
) {
  const client = getSupabaseServerAdminClient();
  const api = createNotificationsApi(client);

  await api.createNotification({
    account_id: accountId,
    body: 'You have successfully signed up!',
    type: 'info', // this is the default type, no need to specify it
  });
}
```

#### Warning notifications

To send a warning notification, you can use the `warning` type.

```tsx
api.createNotification({
  account_id: accountId,
  body: 'Your credit card is about to expire!',
  type: 'warning',
});
```

#### Error notifications

To send an error notification, you can use the `error` type.

```tsx
api.createNotification({
  account_id: accountId,
  body: 'There was an error processing your payment.',
  type: 'error',
});
```

### Notification Links

You can also include a link in the notification using the `link` field. This will create a clickable link in the notification.

```tsx
api.createNotification({
  account_id: accountId,
  body: 'You have created a task!',
  link: '/tasks/123',
});
```

The example above sends a notification to the user after they create a task. The notification will include a link to the task.

---
title: 'Add an AI Chatbot to the Next.js Supabase SaaS Starter kit'
label: 'AI Chatbot'
position: 4
description: 'Add an AI chatbot to your Next.js Supabase SaaS Starter kit to provide instant support to your users.'
---

This plugin allows you to create a chatbot for your app. Users can interact with the chatbot to get information about
your app.

The chatbot will index your app's content and provide answers to user queries.

## Installation

Install the chatbot plugin from your main app:

```bash
npx @makerkit/cli plugins install chatbot
```

Now, install the plugin from your main app by adding the following to your `package.json` file:

```json title="apps/web/package.json"
{
  "dependencies": {
    "@kit/chatbot": "workspace:*"
  }
}
```

And then run `pnpm install` to install the plugin.

## Import the Chatbot component

You can now import the Chatbot component in your app:

```tsx
import { Chatbot } from '@kit/chatbot';

<Chatbot sitename={'Makerkit'} />
```

## Create the API route handler

You can add this anywhere since it's configurable, but my suggestion is to add it to the `api/chat` directory. Create a new file called `route.ts` at `apps/web/app/api/chat/route.ts`:

```ts
import { handleChatBotRequest } from '@kit/chatbot/server';

export const POST = handleChatBotRequest;
```

If you use a different path, please set the `NEXT_PUBLIC_CHATBOT_API_URL` environment variable:

```bash
NEXT_PUBLIC_CHATBOT_API_URL=/api/some-other-path
```

## Add the Migration file

Copy the migration file at `packages/plugins/chatbot/migrations` into your apps migration directory at `apps/web/supabase/migrations`.

Make sure to reset the database after copying the migration file and make sure to push this to your remote instance.


## Configuration

The Chatbot component accepts the following props:

```tsx
interface ChatBotProps {
    siteName: string;

    conversationId?: string;
    defaultPrompts?: string[];
    isOpen?: boolean;
    isDisabled?: boolean;
    settings?: ChatbotSettings;
    storageKey?: string;

    onClear?: () => void;
    onMessage?: (message: string) => void;
}
```

## Customizing the Chatbot

You can customize the chatbot by providing a `settings` object:

```tsx
type Position = `bottom-left` | `bottom-right`;

interface Branding {
    primaryColor: string;
    accentColor: string;
    textColor: string;
}

export interface ChatbotSettings {
    title: string;
    position: Position;
    branding: Branding;
}
```

For example:

```tsx
<Chatbot
    settings={{
        title: 'Chat with us',
        position: 'bottom-right',
        branding: {
            primaryColor: '#000',
            accentColor: '#000',
            textColor: '#fff',
        },
    }}
/>
```

## Indexing Content

At this time - the Chatbot will crawl your app's content and index it - by reading the sitemap.xml file.

The crawler will infer the sitemap.xml from the website's robots.txt file. Otherwise, you can provide the sitemap.xml
URL using the `CHATBOT_WEBSITE_SITEMAP_URL` environment variable.

```bash
CHATBOT_WEBSITE_SITEMAP_URL=https://example.com/sitemap.xml
```

To index your website's content, the chatbot will read the `sitemap.xml` file. If the sitemap of your website is not located at `/sitemap.xml`, you can set the `CHATBOT_WEBSITE_SITEMAP_URL` environment variable to the correct URL.

```bash
CHATBOT_WEBSITE_SITEMAP_URL=https://example.com/my-sitemap.xml
```

To launch the chatbot crawler, run the command:

```bash
pnpm --filter chatbot indexer -- --url=<url> --include=<include-paths> --exclude=<excluded-paths>
```

For example:

```bash
pnpm --filter chatbot indexer -- --url=https://example.com --include=/docs,/blog --exclude=/blog/secret
```

The `--url` flag is required and should point to the website's root URL. The `--include` and `--exclude` flags are optional and should be comma-separated paths.

It's highly recommended to include the `--exclude` flag to prevent the chatbot from indexing way too many pages or stuff you don't want to be indexed.

## Environment Variables

### Chatbot Configuration

You can customize the chatbot model by providing the following environment variables at `packages/plugins/chatbot/.env.local`:

```
LLM_MODEL_NAME=gpt-3.5-turbo
LLM_BASE_URL=
LLM_API_KEY=
```

The model needs to be compatible with the OpenAI API.

1. `LLM_MODEL_NAME` - The model name to use. For example, `gpt-3.5-turbo`.
2. `LLM_BASE_URL` - The base URL for the API. For example, `https://api.openai.com/v1`. If you use OpenAI, you can leave this empty.
3. `LLM_API_KEY` - The API key to use. You can get this from OpenAI.

If you use an OpenAI-compatible model, you can set the `LLM_BASE_URL` to the URL of the API. Otherwise, you can leave it empty.

### Chatbot Indexer

In addition, we need to provide the following environment variables for the chatbot indexer:

```
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_URL=
```

1. `SUPABASE_SERVICE_ROLE_KEY` - The service role key for the Supabase instance.
2. `NEXT_PUBLIC_SUPABASE_URL` - The URL of the Supabase instance.

By adjusting these variables, you can choose which Supabase instance to use for the chatbot indexer. Normally, you would use the same Supabase instance as your app.

You can also use your local Supabase instance for development purposes.

In that case, these values would be the same ones you're using for your app's Supabase instance in `apps/web/.env.development`.

---
title: 'Add a Feedback Widget plugin to your Next.js Supabase SaaS Starter kit'
label: 'Feedback Widget'
position: 5
description: 'Add a Feedback Widget plugin to your Next.js Supabase SaaS Starter kit'
---

This plugin is a lighter version of the Roadmap plugin. It is recommended to install the Roadmap plugin if you need more features.

The feedback plugin allows you to add a feedback widget to your app. Users can provide feedback on your app, and you can view and manage feedback submissions in the admin panel.

### Installation

Pull the plugin from the main repository:

```
npx @makerkit/cli@latest plugins install feedback
```

Now, install the plugin from your main app by adding the following to your `package.json` file:

```json title="apps/web/package.json"
{
  "dependencies": {
    "@kit/feedback": "workspace:*"
  }
}
```

And then run `pnpm install` to install the plugin.

### Add the migrations

Since the feedback relies on a new table in the database, you will need to run the migrations to create the table. Please create a new migration file:

```
pnpm --filter web supabase migration new feedback
```

And copy the content of the migration file from the plugin repository to your new migration file.

Run the reset command to apply the migration:

```
pnpm run supabase:web:reset
```

### Import the component

Now, you can import the component from the plugin:

```tsx
import { FeedbackPopup } from '@kit/feedback';
```

And use it in your app:

```tsx
<FeedbackPopup>
    <Button>Gimme feedback</Button>
</FeedbackPopup>
```

You can also import the form alone - so you can customize its appearance:

```tsx
import {FeedbackForm} from '@kit/feedback';
```

And use it in your app:

```tsx
<FeedbackForm/>
```

## Adding the Admin Panel pages

Add the following to your `apps/web/admin/feedback/page.tsx` file:

```tsx title="apps/web/admin/feedback/page.tsx"
import { FeedbackSubmissionsPage } from '@kit/feedback/admin';

export default FeedbackSubmissionsPage;
```

And the submission detail page at `apps/web/admin/feedback/[id]/route.tsx`:

```tsx title="apps/web/admin/feedback/[id]/page.tsx"
import { FeedbackSubmissionPage } from '@kit/feedback/admin';

export default FeedbackSubmissionPage;
```

Add the sidebar item to `apps/web/app/admin/_components/admin-sidebar.tsx`:

```tsx title="apps/web/app/admin/_components/admin-sidebar.tsx"
<SidebarItem
    path={'/admin/feedback'}
    Icon={<MessageCircle className={'h-4'} />}
    >
    Feedback
</SidebarItem>
```

---
title: 'Installing Plugins in the Next.js Supabase SaaS Starter kit'
label: 'Installing Plugins'
position: 0
description: 'Learn how to install plugins in the Next.js Supabase SaaS Starter kit.'
---

Plugins are placed into a separate repository that mirrors the original repository structure. This allows us to build the plugins using the same files and structure as the main repository.0

You may wonder why we don't include the plugins in the main repository. The reason is that plugins are optional and may not be needed by all users. By keeping them separate, we can keep the main repository clean and focused on the core functionality. Instead you can install the plugins you need when you need them.

## Installing Plugins

To install a plugin, you can use the Makerkit CLI:

```bash
npx @makerkit/cli@latest plugins install
```

This command will prompt you to select a plugin to install. Once selected, the plugin will be installed in your project.

## How Makerkit installs plugins in your project

Plugins use `git subtree` to pull in the plugin repository into the `plugins` directory of your project. This allows you to keep the plugin up-to-date by pulling in changes from the plugin repository.

If you don't want to use git subtree, you can also manually clone a copy of the plugin repository, and then manually moving the folder from `packages/plugins` into your own repository.
---
title: 'Roadmap Plugin in the Next.js Supabase SaaS Starter kit'
label: 'Roadmap Plugin'
position: 2
description: 'Learn how to install the Roadmap plugin in the Next.js Supabase SaaS Starter kit.'
---

This plugin allows you to create a roadmap for your project and display it on your website.

Your users can see what features are planned, in progress, and completed and suggest new features or comment on existing ones.

## Functionality

The plugin provides the following functionality:

1. Display the feature requests on the website.
2. Allow users to suggest new features.
3. Allow users to comment on existing features.
4. Display the Feature Requests in the Admin panel.
5. Allow Admins to manage the Feature Requests, update their status, and delete them.
6. Allow Admins to manage the comments on the Feature Requests.

## Installation

To install the plugin, run the following command:

```bash
npx @makerkit/cli plugins install
```

Since this plugin depends on the Kanban plugin, you need to install both. Please select the `kanban` plugin from the list of available plugins.

Then, please select the `roadmap` plugin from the list of available plugins.

### Migration

Create a new migration file by running the following command:

```bash
pnpm --filter web supabase migration new roadmap
```

And place the content you can see at `packages/plugins/roadmap/migrations/migration.sql` into the newly created file.

Then run the migration:

```bash
pnpm run supabase:web:reset
```

And update the types:

```bash
pnpm run supabase:web:typegen
```

Once the plugin is added to your repository, please install it as a dependency in your application in the package.json file of `apps/web`:

```json
{
    "dependencies": {
      "@kit/roadmap": "workspace:*"
    }
}
```

Now run the following command to install the plugin:

```bash
pnpm i
```

## Displaying the Roadmap and Feature Requests

To display the roadmap and feature requests on your website, add the following code to the `apps/web/app/(marketing)/roadmap/page.tsx` file:

```tsx
import { RoadmapPage } from "@kit/roadmap/server";

export default RoadmapPage;
```

Let's now add the comments GET route at `apps/web/app/(marketing)/roadmap/comments/route.ts`:

```tsx
import { createFetchCommentsRouteHandler } from '@kit/roadmap/route-handler';

export const GET = createFetchCommentsRouteHandler;
```

## Admin Pages

To add the Admin pages from where you can manage the roadmap and feature requests, add the following code to the `apps/web/app/admin/roadmap/page.tsx` file:

```tsx
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { AdminIssuesPage } from '@kit/roadmap/admin';

export default AdminGuard(AdminIssuesPage);
```

And now, we add the feature request's detail page at `apps/web/app/admin/roadmap/[id]/page.tsx`:

```tsx
import { AdminGuard } from '@kit/admin/components/admin-guard';
import { AdminIssueDetailPage } from '@kit/roadmap/admin';

export default AdminGuard(AdminIssueDetailPage);
```

Add the sidebar item as well at `apps/web/app/admin/_components/admin-sidebar.tsx`:

```tsx
<SidebarItem
    path={'/admin/roadmap'}
    Icon={<FolderKanbanIcon className={'h-4'} />}
>
    Roadmap
</SidebarItem>
```

Import the `FolderKanbanIcon` icon from the existing `lucide-react` package.

You can now run the application and navigate to the Admin panel to manage the roadmap and feature requests.
---
title: 'Testimonials Plugin in the Next.js Supabase SaaS Starter kit'
label: 'Testimonials Plugin'
position: 3
description: 'Learn how to install the Testimonials plugin in the Next.js Supabase SaaS Starter kit.'
---

This plugin allows Makerkit users to easily collect and manage testimonials from their customers. It integrates seamlessly with the existing Makerkit structure and provides both backend and frontend components.

## Features

1. Testimonial submission form and manual entry
2. Admin panel for managing testimonials
3. API endpoints for CRUD operations
4. Widgets components for showing testimonials on the website

## Installation

To install the plugin, run the following command:

```bash
npx @makerkit/cli plugins install
```

Please select the `testimonial` plugin from the list of available plugins.

### Migration

Create a new migration file by running the following command:

```bash
pnpm --filter web supabase migration new testimonials
```

And place the content you can see at `packages/plugins/testimonial/migrations/migration.sql` into the newly created file.

Then run the migration:

```bash
pnpm run supabase:web:reset
```

And update the types:

```bash
pnpm run supabase:web:typegen
```

Once the plugin is added to your repository, please install it as a dependency in your application in the package.json file of `apps/web`:

```json
{
    "dependencies": {
      "@kit/testimonial": "workspace:*"
    }
}
```

Now run the following command to install the plugin:

```bash
pnpm i
```

You can now add the Admin pages from where you can manage the testimonials. To do so, add the following code to the `apps/web/app/admin/testimonials/page.tsx` file:

```tsx
import { TestimonialsPage } from '@kit/testimonial/admin';

export default TestimonialsPage;
```

And now the testimonial's page at  `apps/web/app/admin/testimonials/[id]/page.tsx`:

```tsx
import { TestimonialPage } from '@kit/testimonial/admin';

export default TestimonialPage;
```

Add the sidebar item as well at `apps/web/app/admin/_components/admin-sidebar.tsx`:

```tsx
<SidebarItem
    path={'/admin/testimonials'}
    Icon={<StarIcon className={'h-4'} />}
>
    Testimonials
</SidebarItem>
```

You can now run the application and navigate to the Admin panel to manage the testimonials.

## Displaying the Testimonial Form

To display the testimonial form on your website, you can import the form component from the plugin and use it in your page.

Create a new component, and import the form:

```tsx
'use client';

import { useState } from 'react';

import {
  TestimonialContainer,
  TestimonialForm,
  TestimonialSuccessMessage,
  VideoTestimonialForm,
} from '@kit/testimonial/client';

export function Testimonial() {
  const [success, setSuccess] = useState(false);
  const onSuccess = () => setSuccess(true);

  if (success) {
    return <SuccessMessage />;
  }

  return (
    <TestimonialContainer
      className={
        'w-full max-w-md rounded-lg border bg-background p-8 shadow-xl'
      }
      welcomeMessage={<WelcomeMessage />}
      enableTextReview={true}
      enableVideoReview={true}
      textReviewComponent={<TestimonialForm onSuccess={onSuccess} />}
      videoReviewComponent={<VideoTestimonialForm onSuccess={onSuccess} />}
      textButtonText="Write your thoughts"
      videoButtonText="Share a video message"
      backButtonText="Switch review method"
    />
  );
}

function SuccessMessage() {
  return (
    <div
      className={
        'w-full max-w-md rounded-lg border bg-background p-8 shadow-xl'
      }
    >
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">
            Thank you for your feedback!
          </h1>

          <p className="text-muted-foreground">
            Your review has been submitted successfully.
          </p>
        </div>

        <div>
          <TestimonialSuccessMessage />
        </div>
      </div>
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center space-y-1 text-center">
      <h1 className="text-2xl font-semibold">
        We&apos;d love to hear your feedback!
      </h1>

      <p className="text-muted-foreground">
        Your opinion helps us improve our service.
      </p>
    </div>
  );
}
```

Please customize the components as needed to fit your website's design.

## API Endpoints

Please add the GET and POST endpoints to fetch the testimonials at `apps/web/app/api/testimonials/route.ts`:

```ts
import {
  createTestimonialsRouteHandler,
  createVideoTestimonialRouteHandler,
} from '@kit/testimonial/server';

export const GET = createTestimonialsRouteHandler;
export const POST = createVideoTestimonialRouteHandler;
```

## Widgets

To display the testimonials on your website, you can use the following widget:

```tsx
import { TestimonialWallWidget } from '@kit/testimonial/widgets';

export default function TestimonialWidgetPage() {
    return (
        <div className={'flex h-full w-screen flex-1 flex-col items-center py-16'}>
            <TestimonialWallWidget />
        </div>
    );
}
```

Done! You now have a fully functional Testimonial Collection plugin integrated with your Makerkit application.

---
title: 'Add an AI Text Editor to the Next.js Supabase SaaS Starter kit'
label: 'Text Editor'
position: 6
description: 'Add an AI text editor to your Next.js Supabase SaaS Starter kit to provide a rich text editing experience to your users.'
---

A Text Editor built with Lexical.

### Installation

Pull the plugin from the main repository:

```
npx @makerkit/cli@latest plugins install text-editor
```

Now, install the plugin from your main app by adding the following to your `package.json` file:

```json title="apps/web/package.json"
{
  "dependencies": {
    "@kit/text-editor": "workspace:*"
  }
}
```

And then run `pnpm install` to install the plugin.

### AI Routes

Add the following AI Routes to your Next.js API routes:

One route at `apps/web/app/api/editor/edit/route.ts`:

```ts
import { createAIEditRouteHandler } from '@kit/text-editor/server';

export const POST = createAIEditRouteHandler;

```

And another route at `apps/web/app/api/editor/autocomplete/route.ts`:

```ts
import { createAIAutocompleteRouteHandler } from '@kit/text-editor/server';

export const POST = createAIAutocompleteRouteHandler;
```

### Import the component

Now, you can import the component from the plugin:

```tsx
import { TextEditor } from '@kit/text-editor';
import '@kit/text-editor/style';
```

And use it in your app:

```tsx
<TextEditor />
```

You can assign the following props to the `TextEditor` component:

```tsx
{
  className?: string;
  content?: string;
  placeholder?: () => React.ReactElement;
  onChange?: (content: string) => void;
}
```

---
title: 'Add a Waitlist to the Next.js Supabase SaaS Starter kit'
label: 'Waitlist'
position: 1
description: 'Add a waitlist to your Next.js Supabase SaaS Starter kit to collect emails from interested users.'
---

In this guide, you will learn how to add a waitlist to your Next.js Supabase SaaS Starter kit to collect emails from interested users. This feature is useful for building an audience before launching your product.

This plugin allows you to create a waitlist for your app. Users can sign up for the waitlist and receive an email when the app is ready.

### How it works

1. You disable sign up in your app from Supabase. This prevents any user from using the public API to sign up.
2. We create a new table in Supabase called `waitlist`. Users will sign up for the waitlist and their email will be stored in this table.
3. When you want to enable a sign up for a user, mark users as `approved` in the `waitlist` table.
4. The database trigger will create a new user in the `auth.users` table and send an email to the user with a link to set their password.
5. The user can now sign in to the app and update their password.
6. User gets removed from the waitlist as soon as the email is sent.

### Installation

#### Get the plugin using the CLI

Please run the following command in your terminal:

```bash
npx @makerkit/cli@latest plugins install waitlist
```

After completed, the CLI will install the plugin at `packages/plugins/waitlist`.

#### Add the plugin to your main app

Now, install the plugin from your main app by adding the following to your `package.json` file:

```json title="apps/web/package.json"
{
  "dependencies": {
    "@kit/waitlist": "workspace:*"
  }
}
```

And then run `pnpm install` to install the plugin.

#### Add migrations to your app

From the folder `packages/plugins/waitlist/migrations`, copy the migrations to your app's migrations folder at `apps/web/supabase/migrations`.

This will add the `waitlist` table to your database.

Now, re-run the migrations:

```bash
pnpm run supabase:web:reset
pnpm run supabase:web:typegen
```

You can now use the waitlist plugin in your app.

#### Replace the sign up form

Replace your sign up form with the waitlist form in your app (retain the existing imports):

```tsx
import { WaitlistSignupForm } from '@kit/waitlist/client';

function SignUpPage({ searchParams }: Props) {
  const inviteToken = searchParams.invite_token;

  const signInPath =
    pathsConfig.auth.signIn +
    (inviteToken ? `?invite_token=${inviteToken}` : '');

  return (
    <>
      <Heading level={4}>
        <Trans i18nKey={'auth:signUpHeading'} />
      </Heading>

      <WaitlistSignupForm />

      <div className={'justify-centers flex'}>
        <Button asChild variant={'link'} size={'sm'}>
          <Link href={signInPath}>
            <Trans i18nKey={'auth:alreadyHaveAnAccount'} />
          </Link>
        </Button>
      </div>
    </>
  );
}

export default withI18n(SignUpPage);
```

#### Adding the Database Webhook to listen for new signups

Let's extend the DB handler at `apps/web/api/db/webhook/route.ts`. This handler will listen for new signups and send an email to the user:

```tsx
import { getDatabaseWebhookHandlerService } from '@kit/database-webhooks';
import { enhanceRouteHandler } from '@kit/next/routes';

import appConfig from '~/config/app.config';
import pathsConfig from '~/config/paths.config';

/**
 * @name POST
 * @description POST handler for the webhook route that handles the webhook event
 */
export const POST = enhanceRouteHandler(
  async ({ request }) => {
    const service = getDatabaseWebhookHandlerService();

    try {
      // handle the webhook event
      await service.handleWebhook(request, {
        async handleEvent(payload) {
          if (payload.table === 'waitlist' && payload.record.approved) {
            const { handleApprovedUserChange } = await import(
              '@kit/waitlist/server'
            );

            const redirectTo = appConfig.url + pathsConfig.auth.passwordUpdate;

            await handleApprovedUserChange({
              email: payload.record.email,
              redirectTo,
            });
          }
        },
      });

      // return a successful response
      return new Response(null, { status: 200 });
    } catch (error) {
      // return an error response
      return new Response(null, { status: 500 });
    }
  },
  {
    auth: false,
  },
);
```

#### Adding the Trigger to the Database

We need to add a trigger to the `waitlist` table to listen for updates and send a webhook to the app when a user is approved.

During development, you can simply add the webhook to your seed file `apps/web/supabase/seed.sql`:

```sql
create trigger "waitlist_approved_update" after update
on "public"."waitlist"
for each row
when (new.approved = true)
execute function "supabase_functions"."http_request"(
  'http://host.docker.internal:3000/api/db/webhook',
  'POST',
  '{"Content-Type":"application/json", "X-Supabase-Event-Signature":"WEBHOOKSECRET"}',
  '{}',
  '5000'
);
```

The above creates a trigger that listens for updates to the `waitlist` table and sends a POST request to the webhook route.

**Note**: You need to add this trigger to your production database as well. You will replace your `WEBHOOKSECRET` with the secret you set in your `.env` file and the `host.docker.internal:3000` with your production URL.
Just like you did for the other existing triggers.

#### Approving users

Simply update the `approved` column in the `waitlist` table to `true` to approve a user. You can do so from the Supabase dashboard or by running a query.

Alternatively, run an update based on the created_at timestamp:

```sql
update public.waitlist
set approved = true
where created_at < '2024-07-01';
```

#### Email Templates and URL Configuration

Please make sure to [edit the email template](https://makerkit.dev/docs/next-supabase-turbo/authentication-emails) in your Supabase account.
The default email in Supabase does not support PKCE and therefore does not work. By updating it - we replace the existing strategy with the token-based strategy - which the `confirm` route in Makerkit can support.

Additionally, [please add the following URL to your Supabase Redirect URLS allow list](https://supabase.com/docs/guides/auth/redirect-urls):

```
<your-url>/password-reset
```

This will allow Supabase to redirect users to your app to set their password after they click the email link.

If you don't do this - the email links will not work.

#### Translations

Please add the following translations to your `auth.json` translation:

```json
{
  "waitlist": {
    "heading": "Join the Waitlist for Early Access",
    "submitButton": "Join Waitlist",
    "error": "Ouch, we couldn't add you to the waitlist. Please try again.",
    "errorDescription": "We couldn't add you to the waitlist. If you have already signed up, you are already on the waitlist.",
    "success": "You're on the waitlist!",
    "successDescription": "We'll let you know when you can sign up."
  }
}
```

---

Easy peasy! Now you have a waitlist for your app.
---
title: 'Disabling Personal Accounts in the Next.js Supabase Turbo SaaS Kit and Only Allowing Team Accounts'
label: 'Disabling Personal Accounts'
position: 1
description: 'Learn how to disable personal accounts in the Next.js Supabase Turbo SaaS kit and only allow team accounts'
---

The Next.js Supabase Turbo SaaS kit is designed to allow personal accounts by default. However, you can disable the personal account view, and only allow user to access team accounts.

Let's walk through the steps to disable personal accounts in the Next.js Supabase Turbo SaaS kit:

1. **Store team slug in cookies**: When a user logs in, store the team slug in a cookie. If none is provided, redirect the user to the team selection page.
2. **Set up Redirect**: Redirect customers to the latest selected team account
3. **Create a Team Selection Page**: Create a page where users can select the team they want to log in to.
4. **Duplicate the user settings page**: Duplicate the user settings page so they can access their own settings from within the team workspace

## Storing the User Cookie and Redirecting to the Team Selection Page

To make sure that users are always redirected to the team selection page, you need to store the team slug in a cookie. If the team slug is not found, redirect the user to the team selection page. We will do all of this in the middleware.

First, let's create these functions in the `apps/web/src/middleware.ts` file:

```tsx title="apps/web/src/middleware.ts"

function handleTeamAccountsOnly(request: NextRequest) {
  // always allow access to the teams page
  if (request.nextUrl.pathname === '/home/teams') {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === '/home') {
    return redirectToTeam(request);
  }

  if (isTeamAccountRoute(request) && !isUserRoute(request)) {
    return storeTeamSlug(request);
  }

  if (isUserRoute(request)) {
    return redirectToTeam(request);
  }

  return NextResponse.next();
}

function isUserRoute(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  return ['settings', 'billing', 'members'].includes(pathName.split('/')[2]!);
}

function isTeamAccountRoute(request: NextRequest) {
  const pathName = request.nextUrl.pathname;

  return pathName.startsWith('/home/');
}

function storeTeamSlug(request: NextRequest): NextResponse {
  const accountSlug = request.nextUrl.pathname.split('/')[2];
  const response = NextResponse.next();

  if (accountSlug) {
    response.cookies.set({
      name: LAST_TEAM_COOKIE,
      value: accountSlug,
      path: '/',
    });
  }

  return response;
}

function redirectToTeam(request: NextRequest): NextResponse {
  const lastTeamSlug = request.cookies.get(LAST_TEAM_COOKIE);

  if (lastTeamSlug) {
    return NextResponse.redirect(
      new URL(`/home/${lastTeamSlug.value}`, request.url),
    );
  }

  return NextResponse.redirect(new URL('/home/teams', request.url));
}
```

We will now add the `handleTeamAccountsOnly` function to the middleware chain in the `apps/web/src/middleware.ts` file. This function will check if the user is on a team account route and store the team slug in a cookie. If the user is on the home route, it will redirect them to the team selection page.

```tsx title="apps/web/src/middleware.ts" {31}
 {
  pattern: new URLPattern({ pathname: '/home/*?' }),
  handler: async (req: NextRequest, res: NextResponse) => {
    const {
      data: { user },
    } = await getUser(req, res);

    const origin = req.nextUrl.origin;
    const next = req.nextUrl.pathname;

    // If user is not logged in, redirect to sign in page.
    if (!user) {
      const signIn = pathsConfig.auth.signIn;
      const redirectPath = `${signIn}?next=${next}`;

      return NextResponse.redirect(new URL(redirectPath, origin).href);
    }

    const supabase = createMiddlewareClient(req, res);

    const requiresMultiFactorAuthentication =
      await checkRequiresMultiFactorAuthentication(supabase);

    // If user requires multi-factor authentication, redirect to MFA page.
    if (requiresMultiFactorAuthentication) {
      return NextResponse.redirect(
        new URL(pathsConfig.auth.verifyMfa, origin).href,
      );
    }

    return handleTeamAccountsOnly(req);
  },
}
```

In the above code snippet, we have added the `handleTeamAccountsOnly` function to the middleware chain.

## Creating the Team Selection Page

Next, we need to create a team selection page where users can select the team they want to log in to. We will create a new page at `apps/web/app/home/teams/page.tsx`:

```tsx title="apps/web/app/home/teams/page.tsx"
import { PageBody, PageHeader } from '@kit/ui/page';
import { Trans } from '@kit/ui/trans';

import { HomeAccountsList } from '~/home/(user)/_components/home-accounts-list';
import { createI18nServerInstance } from '~/lib/i18n/i18n.server';
import { withI18n } from '~/lib/i18n/with-i18n';

export const generateMetadata = async () => {
  const i18n = await createI18nServerInstance();
  const title = i18n.t('account:homePage');

  return {
    title,
  };
};

function TeamsPage() {
  return (
    <div className={'container flex flex-col flex-1 h-screen'}>
      <PageHeader
        title={<Trans i18nKey={'common:routes.home'} />}
        description={<Trans i18nKey={'common:homeTabDescription'} />}
      />

      <PageBody>
        <HomeAccountsList />
      </PageBody>
    </div>
  );
}

export default withI18n(TeamsPage);
```

The page is extremely minimal, it just displays a list of teams that the user can select from. You can customize this page to fit your application's design.

## Duplicating the User Settings Page

Finally, we need to duplicate the user settings page so that users can access their settings from within the team workspace.

We will create a new page called `user-settings.tsx` in the `apps/web/app/home/[account]` directory.

```tsx title="apps/web/app/home/[account]/user-settings/page.tsx"
import { AppBreadcrumbs } from '@kit/ui/app-breadcrumbs';
import { PageHeader } from '@kit/ui/page';

import UserSettingsPage, { generateMetadata } from '../../(user)/settings/page';

export { generateMetadata };

export default function Page() {
  return (
    <>
      <PageHeader title={'User Settings'} description={<AppBreadcrumbs />} />

      <UserSettingsPage />
    </>
  );
}
```

Feel free to customize the path or the content of the user settings page.

### Adding the page to the Navigation Menu

Finally, you can add the `Teams` page to the navigation menu.

You can do this by updating the `apps/web/config/team-account-navigation.config.tsx` file:

```tsx title="apps/web/config/team-account-navigation.config.tsx" {26-30}
import { CreditCard, LayoutDashboard, Settings, User, Users } from 'lucide-react';

import { NavigationConfigSchema } from '@kit/ui/navigation-schema';

import featureFlagsConfig from '~/config/feature-flags.config';
import pathsConfig from '~/config/paths.config';

const iconClasses = 'w-4';

const getRoutes = (account: string) => [
  {
    label: 'common:routes.dashboard',
    path: pathsConfig.app.accountHome.replace('[account]', account),
    Icon: <LayoutDashboard className={iconClasses} />,
    end: true,
  },
  {
    label: 'common:routes.settings',
    collapsible: false,
    children: [
      {
        label: 'common:routes.settings',
        path: createPath(pathsConfig.app.accountSettings, account),
        Icon: <Settings className={iconClasses} />,
      },
      {
        label: 'common:routes.account',
        path: createPath('/home/[account]/user-settings', account),
        Icon: <User className={iconClasses} />,
      },
      {
        label: 'common:routes.members',
        path: createPath(pathsConfig.app.accountMembers, account),
        Icon: <Users className={iconClasses} />,
      },
      featureFlagsConfig.enableTeamAccountBilling
        ? {
            label: 'common:routes.billing',
            path: createPath(pathsConfig.app.accountBilling, account),
            Icon: <CreditCard className={iconClasses} />,
          }
        : undefined,
    ].filter(Boolean),
  },
];

export function getTeamAccountSidebarConfig(account: string) {
  return NavigationConfigSchema.parse({
    routes: getRoutes(account),
    style: process.env.NEXT_PUBLIC_TEAM_NAVIGATION_STYLE,
  });
}

function createPath(path: string, account: string) {
  return path.replace('[account]', account);
}
```

In the above code snippet, we have added the `User Settings` page to the navigation menu.

## Removing Personal Account menu item

To remove the personal account menu item, you can update the `apps/web/src/components/navigation.tsx` file and remove the personal account menu item:

```tsx title="packages/features/accounts/src/components/account-selector.tsx"
<CommandGroup>
  <CommandItem
    onSelect={() => onAccountChange(undefined)}
    value={PERSONAL_ACCOUNT_SLUG}
  >
    <PersonalAccountAvatar />

    <span className={'ml-2'}>
      <Trans i18nKey={'teams:personalAccount'} />
    </span>

    <Icon item={PERSONAL_ACCOUNT_SLUG} />
  </CommandItem>
</CommandGroup>

<CommandSeparator />
```

Once you remove the personal account menu item, users will only see the team accounts in the navigation menu.

## Change Redirect in Layout

We now need to change the redirect (in case of errors) from `/home` to `/home/teams`. This is to avoid infinite redirects in case of errors.

```tsx title="apps/web/app/home/[account]/_lib/server/team-account-workspace.loader.ts" {13}
async function workspaceLoader(accountSlug: string) {
  const client = getSupabaseServerClient();
  const api = createTeamAccountsApi(client);

  const [workspace, user] = await Promise.all([
    api.getAccountWorkspace(accountSlug),
    requireUserInServerComponent(),
  ]);

  // we cannot find any record for the selected account
  // so we redirect the user to the home page
  if (!workspace.data?.account) {
    return redirect('/home/teams');
  }

  return {
    ...workspace.data,
    user,
  };
}
```

## Conclusion

By following these steps, you can disable personal accounts in the Next.js Supabase Turbo SaaS kit and only allow team accounts.

This can help you create a more focused and collaborative environment for your users. Feel free to customize the team selection page and user settings page to fit your application's design and requirements.
---
title: "Adding new translations"
label: "Adding new translations"
description: "Learn how to add new translations to your Makerkit project."
position: 1
---

Makerkit projects store translations at the application level, specifically in the `apps/web/public/locales` directory. By default, English translations are provided and can be found at `apps/web/public/locales/en`.

If you're looking to expand your application's language support, follow these two steps:

## 1. Create Language Files

First, create a new folder in `apps/web/public/locales/[lng]`, where `[lng]` represents the appropriate language code. This could be `de` for German, `it` for Italian, `es` for Spanish, `ja` for Japanese, and so on.

## 2. Update Language Settings

Next, add the new language to the settings file located at `apps/web/lib/i18n/i18n.settings.ts`:

```tsx
/**
 * The list of supported languages.
 * By default, only the default language is supported.
 * Add more languages here if needed.
 */
export const languages: string[] = [defaultLanguage, 'es'];
```

In the example above, the language `es` (Spanish) is added to the `languages` array. Feel free to add as many languages as your application requires.

## 3. Add new namespaces

If you want to add a new namespace (for example, `chatbots.json`) where you will store translations for chatbots, you can do so by creating a new file in the `apps/web/public/locales/[lng]` directory. For example, `apps/web/public/locales/en/chatbots.json`.

Then, you register the new namespace in the `i18n.settings.ts` file:

```tsx {8} title="apps/web/lib/i18n/i18n.settings.ts"
export const defaultI18nNamespaces = [
  'common',
  'auth',
  'account',
  'teams',
  'billing',
  'marketing',
  'chatbots',
];
```

In the example above, the `chatbots` namespace is added to the `defaultI18nNamespaces` array. And that's it! You can now start adding translations to your new namespace.
---
title: "Adding a language selector to your Makerkit application"
label: "Language Selector"
description: "Learn how to use the Language selector in your application."
position: 2
---

You can import and use the `LanguageSelector` component and drop it anywhere in your application to allow users to change the language of the application.

```tsx
import { LanguageSelector } from '@kit/ui/language-selector';

<LanguageSelector />
```

This component is automatically populated with the languages that you have defined in the `i18n` configuration. When a user selects a language, the application will automatically change the language and update the UI.

It is already part of the Account settings when more than one language is defined in the `i18n` configuration. If you want, add it to any other part of your application.

---
title: "Using translations in your Next.js Supabase project"
label: "Using translations"
description: "Makerkit uses i18next to translate your project into multiple languages. This guide will show you how to use translations in your Next.js Supabase project."
position: 0
---

Makerkit uses the library `i18next` for translations, but it's abstracted behind the `@kit/i18n` package. This abstraction ensures that any future changes to the translation library won't impact your code.

The translation system in Makerkit is versatile and can be used in:

1. Server components (RSC)
2. Client components
3. Server-side rendering

## Utilizing Translations in your Next.js Supabase Project

The guide below will show you how to use translations in your Next.js Supabase project in all the scenarios mentioned above.

### Initializing i18n in Server Components

When creating a new page, ensure to wrap it with the `withI18n` function. This function initializes the translations before rendering the server component.

Given that server components are rendered in parallel, it's uncertain which one will render first. Therefore, it's crucial to initialize the translations before rendering the server component on each page/layout.

```tsx
import { withI18n } from '~/lib/i18n/with-i18n';

const Page = () => {
  return <div>My page</div>;
};

export default withI18n(Page);
```

### Implementing Translations in Server Components

After initializing the translations, you can use the `Trans` component to translate strings in your server components.

```tsx
import { Trans } from '@kit/ui';

const Page = () => {
  return (
    <div>
      <Trans i18nKey="auth:signIn" />
    </div>
  );
};

export default withI18n(Page);
```

Ensure to import the `Trans` component from `@kit/ui` and not directly from `react-i18next`.

### Using the useTranslation Hook

The `useTranslation` hook is another way to translate strings in components that are not in the render path.

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <div>{t('auth:signIn')}</div>;
};
```

### Conclusion

By following these steps, you can easily add translations to your Next.js Supabase project. This approach ensures that your application is accessible to a global audience, providing a better user experience for all users.
---
title: 'Troubleshooting authentication issues in the Next.js Supabase kit'
label: 'Authentication'
position: 2
description: 'Troubleshoot issues related to authentication in the Next.js Supabase SaaS kit'
---

## Supabase redirects to localhost instead of my website URL

This is most likely an issue related to not having set up the Authentication URL in the Supabase settings as describe in [the going to production guide](authentication);

## Cannot Receive Emails from Supabase

This issue may arise if you have not setup an SMTP provider from within Supabase.

Supabase's own SMTP provider has low limits and low deliverability, therefore you must set up your own - and only use the default Supabase's one for testing purposes.

## Cannot sign in with oAuth provider

This is most likely a settings issues from within the Supabase dashboard or in the provider's settings.

Please [read Supabase's documentation](https://supabase.com/docs/guides/auth/social-login) on how to set up third-party providers.

---
title: 'Troubleshooting billing issues in the Next.js Supabase kit'
label: 'Billing'
position: 3
description: 'Troubleshoot issues related to billing in the Next.js Supabase SaaS kit'
---

## Cannot create a Checkout

This happen in the following cases:

1. The environment variables are not set correctly. Please make sure you have set the following environment variables in your `.env` file if locally - or in your hosting provider's dashboard if in production
2. The plan IDs used are incorrect. Make sure to use the exact plan IDs as they are in the payment provider's dashboard.

## The Database is not updated after subscribing to a plan

This may happen if the webhook is not set up correctly. Please make sure you have set up the webhook in the payment provider's dashboard and that the URL is correct.

If working locally, make sure that:

1. If using Stripe, that the Stripe CLI is up and running
2. If using Lemon Squeezy, that the webhook set in Lemon Squeezy is correct and that the server is running. Additionally, make sure the proxy is set up correctly if you are testing locally (see the Lemon Squeezy documentation for more information).

---
title: 'Troubleshooting deployment issues in the Next.js Supabase kit'
label: 'Deployment'
position: 4
description: 'Troubleshoot issues related to deploying the application in the Next.js Supabase SaaS kit'
---

## The deployment build fails

This is most likely an issue related to the environment variables not being set correctly in the deployment environment. Please analyse the logs of the deployment provider to see what is the issue.

The kit is very defensive about incorrect environment variables, and will throw an error if any of the required environment variables are not set. In this way - the build will fail if the environment variables are not set correctly - instead of deploying a broken application.

If you are deploying to Vercel, [please follow this guide](vercel).
---
title: 'Troubleshooting installation issues in the Next.js Supabase SaaS kit'
label: 'Installation'
position: 1
description: 'Troubleshoot issues related to installing the Next.js Supabase SaaS kit'
---

## Cannot clone the repository

Issues related to cloning the repository are usually related to a Git misconfiguration in your local machine. The commands displayed in this guide using SSH: these will work only if you have setup your SSH keys in Github.

If you run into issues, [please make sure you follow this guide to set up your SSH key in Github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

If this also fails, please use HTTPS instead. You will be able to see the commands in the repository's Github page under the "Clone" dropdown.

Please also make sure that the account that accepted the invite to Makerkit, and the locally connected account are the same.

## The Next.js dev server does not start

This may happen due to some issues in the packages. Try to clean the workspace and reinstall everything again:

```bash
pnpm run clean:workspace
pnpm run clean
pnpm i
```

You can now retry running the dev server.

## Supabase does not start

If you cannot run the Supabase local development environment, it's likely you have not started Docker locally. Supabase requires Docker to be installed and running.

Please make sure you have installed Docker (or compatible software such as Colima, Orbstack) and that is running on your local machine.

---
title: "Button Component"
label: "Button"
description: "The Button component is a simple styled wrapper around the native HTML button element."
position: 5
---

The Button component is a simple styled wrapper around the native HTML button element.

## Basic Usage

By default - the Button component will render a primary button with a solid background color. This is the same as setting the `variant` prop to `primary`.

```tsx
import { Button } from '~/core/ui/Button';

<Button>
  Click Me
</Button>
```

<DemoContainer>
  <Button>
    Click Me
  </Button>
</DemoContainer>

## Button Variants

The Button component has a number of variants that can be used to change the appearance of the button.

### Secondary

Use the `secondary` variant to render a button with a secondary background color.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="secondary">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="secondary">
    Click Me
  </Button>
</DemoContainer>

### Ghost

Use the `ghost` variant to render a button with a transparent background and a border.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="ghost">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="ghost">
    Click Me
  </Button>
</DemoContainer>

### Outline

Use the `outline` variant to render a button with a transparent background and a border.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="outline">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="outline">
    Click Me
  </Button>
</DemoContainer>

### Outline Primary

Use the `outlinePrimary` variant to render a button with a transparent background and a border with the primary color.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="outlinePrimary">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="outlinePrimary">
    Click Me
  </Button>
</DemoContainer>

### Link

Use the `link` variant to render a button that looks like a link.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="link">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="link">
    Click Me
  </Button>
</DemoContainer>

### Destructive

Use the `destructive` variant to render a button with a destructive color.

```tsx
import { Button } from '~/core/ui/Button';

<Button variant="destructive">
  Click Me
</Button>
```

<DemoContainer>
  <Button variant="destructive">
    Click Me
  </Button>
</DemoContainer>
---
title: "Card Button Component"
label: "Card Button"
description: "The Card Button component is a simple styled wrapper around the native HTML button element."
position: 6
---

The Card Button component is a simple styled wrapper around the native HTML button element.

## Basic Usage

By default - the Button component will render a primary button with a solid background color. This is the same as setting the `variant` prop to `primary`.

```tsx
import { CardButton } from '~/core/ui/CardButton';

<CardButton>
  Click Me
</CardButton>
```

<DemoContainer>
  <CardButton>
    Click Me
  </CardButton>
</DemoContainer>
---
title: "Checkbox Component"
label: "Checkbox"
description: "The Checkbox component is a simple wrapper around the HTML input[checkbox] element."
position: 8
---

Use the `Checkbox` component to render a checkbox input:

```tsx
import { Checkbox } from '~/core/ui/Checkbox';
import { Label } from '~/core/ui/Label';

<div className="flex flex-col space-y-4">
  <Label className='flex space-x-2 items-center'>
    <Checkbox />

    Remember Me
  </Label>

  <Label className='flex space-x-2 items-center'>
    <Checkbox />

    I accept the terms and conditions
  </Label>
</div>
```

<DemoContainer>
  <div className="flex flex-col space-y-2">
    <Label className='flex space-x-2 items-center'>
      <Checkbox />

      Remember Me
    </Label>

    <Label className='flex space-x-2 items-center'>
      <Checkbox />

      I accept the terms and conditions
    </Label>
  </div>
</DemoContainer>
---
title: "Icon Button Component"
label: "Icon Button"
description: "The Icon Button component is a simple styled wrapper around the native HTML button element."
position: 7
---

The Icon Button component is a simple styled wrapper around the native HTML button element that is used to trigger an action.

```tsx
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { IconButton } from '~/core/ui/IconButton';

<IconButton>
  <EllipsisVerticalIcon className='h-5' />
</IconButton>
```

<DemoContainer>
  <IconButton>
    <Icons.EllipsisVerticalIcon className='h-5' />
  </IconButton>
</DemoContainer>
---
title: "Image Upload Component"
label: "Image Upload"
description: "The Image Upload component is an input field to to upload images"
position: 9
---

Use the `ImageUploadInput` component to render a checkbox input:

```tsx
import { ImageUploadInput } from '~/core/ui/ImageUploadInput';
import { Label } from '~/core/ui/Label';

<Label>
  Avatar
  <ImageUploadInput>
    Load an image from your computer
  </ImageUploadInput>
</Label>
```

<DemoContainer contentStyle={{ padding: '1em' }}>
  <Label>
    Avatar
    <ImageUploadInput>
      Load an image from your computer
    </ImageUploadInput>
  </Label>
</DemoContainer>

### Props

The component, in addition to all the properties of the HTML `input` element, accepts the following props:

1. `image` - an initial image to display in the component (the URL of the image)
2. `onClear` - a callback function to be called when the user clicks the clear button
---
title: "Label"
label: "Label"
description: "The Label component is a simple styled wrapper around the native HTML label element."
position: 0
---

The Label component is a simple styled wrapper around the native HTML label element.

## Usage

Use the Label component to wrap a form input element. The `htmlFor` prop is used to associate the label with the input element.

```tsx
import { Label } from '~/core/ui/Label';

const MyComponent = () => (
  <Label htmlFor="my-input">My Label</Label>
);
```

<DemoContainer>
  <div>
    <Label>My Label</Label>
  </div>
</DemoContainer>
---
title: "Radio Group"
label: "Radio Group"
description: "Radio Group for selecting one of many options."
position: 4
---

The `Radio Group` field is used to create a drop-down list of options for the user to choose from. This component is built on top of the [Radix UI](https://radix-ui.com) library and styled using [Tailwind CSS](https://tailwindcss.com).

This component comes from the [Shadcn UI Library](https://ui.shadcn.com) - with minimal changes to the original component. I recommended to check out the original documentation for more information.

### Basic Radio Group

The below shows a basic Radio Group as provided by the Shadcn UI library.

```tsx
import { 
  RadioGroup,
  RadioGroupItem
} from '~/core/ui/RadioGroup';

import { Label } from '~/core/ui/Label';

<RadioGroup>
  <div className="flex items-center space-x-2">
    <RadioGroupItem id="r1" value={'Apple'} />
    <Label htmlFor="r1">Apple</Label>
  </div>

  <div className="flex items-center space-x-2">
    <RadioGroupItem id="r2" value={'Banana'} />
    <Label htmlFor="r2">Banana</Label>
  </div>

  <div className="flex items-center space-x-2">
    <RadioGroupItem id="r3" value={'Peach'} />
    <Label htmlFor="r3">Peach</Label>
  </div>
</RadioGroup>
```

<DemoContainer>
  <div className='p-4'>
    <RadioGroup.RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroup.RadioGroupItem id="r1" value={'Apple'} />
        <Label htmlFor="r1">Apple</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroup.RadioGroupItem id="r2" value={'Banana'} />
        <Label htmlFor="r2">Banana</Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroup.RadioGroupItem id="r3" value={'Peach'} />
        <Label htmlFor="r3">Peach</Label>
      </div>
    </RadioGroup.RadioGroup>
  </div>
</DemoContainer>

### Radio Group with labels

The below shows a Radio Group with a Label component for each option. This component is provided by Makerkit.

```tsx
import { 
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel
} from '~/core/ui/RadioGroup';

<RadioGroup className='max-w-xs w-full'>
  <RadioGroupItemLabel>
    <RadioGroupItem value={'Apple'} />
    Apple
  </RadioGroupItemLabel>

  <RadioGroupItemLabel>
    <RadioGroupItem value={'Banana'} />
    Banana
  </RadioGroupItemLabel>

  <RadioGroupItemLabel>
    <RadioGroupItem value={'Peach'} />
    Peach
  </RadioGroupItemLabel>
</RadioGroup>
```

<DemoContainer>
  <RadioGroup.RadioGroup className='max-w-xs w-full'>
    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Apple'} />
      Apple
    </RadioGroup.RadioGroupItemLabel>

    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Banana'} />
      Banana
    </RadioGroup.RadioGroupItemLabel>

    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Peach'} />
      Peach
    </RadioGroup.RadioGroupItemLabel>
  </RadioGroup.RadioGroup>
</DemoContainer>

### Radio Group with labels and descriptions

The below shows a Radio Group with a Label component for each option with a description. This component is provided by Makerkit.

```tsx
import { 
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemLabel
} from '~/core/ui/RadioGroup';

<RadioGroup className='max-w-xs w-full'>
  <RadioGroupItemLabel>
    <RadioGroupItem value={'Free'} />

    <div>
      <h3 className='font-semibold'>Free Plan</h3>

      <p className='text-xs'>
        Free forever. No credit card needed.
      </p>
    </div>
  </RadioGroupItemLabel>

  <RadioGroupItemLabel>
    <RadioGroupItem value={'Basic'} />

    <div>
      <h3 className='font-semibold'>Basic Plan</h3>

      <p className='text-xs'>
        $10 per month. Up to 10 users. 100GB storage.
      </p>
    </div>
  </RadioGroupItemLabel>

  <RadioGroupItemLabel>
    <RadioGroupItem value={'Enterprise'} />
    
    <div>
      <h3 className='font-semibold'>Enterprise Plan</h3>

      <p className='text-xs'>
        $99 per month. Unlimited 10 users. 5TB storage.
      </p>
    </div>
  </RadioGroupItemLabel>
</RadioGroup>
```

<DemoContainer>
  <RadioGroup.RadioGroup className='max-w-xs w-full'>
    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Free Plan'} />

      <div>
        <h3 className='font-semibold'>Free Plan</h3>

        <p className='text-xs'>
          Free forever. No credit card needed.
        </p>
      </div>
    </RadioGroup.RadioGroupItemLabel>

    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Basic Plan'} />
      <div>
        <h3 className='font-semibold'>Basic Plan</h3>

        <p className='text-xs'>
          $10 per month. Up to 10 users. 100GB storage.
        </p>
      </div>
    </RadioGroup.RadioGroupItemLabel>

    <RadioGroup.RadioGroupItemLabel>
      <RadioGroup.RadioGroupItem value={'Enterprise Plan'} />
      <div>
        <h3 className='font-semibold'>Enterprise Plan</h3>

        <p className='text-xs'>
          $99 per month. Unlimited 10 users. 5TB storage.
        </p>
      </div>
    </RadioGroup.RadioGroupItemLabel>
  </RadioGroup.RadioGroup>
</DemoContainer>

### API

The complete API documentation for the `RadioGroup` component is available [on the Shadcn UI documentation](https://ui.shadcn.com/docs/components/radio-group).
---
title: "Select Fields"
label: "Select"
description: "Select fields are used to create a drop-down list of options for the user to choose from."
position: 3
---

The `Select` field is used to create a drop-down list of options for the user to choose from. This component is built on top of the [Radix UI](https://radix-ui.com) library and styled using [Tailwind CSS](https://tailwindcss.com).

This component comes from the [Shadcn UI Library](https://ui.shadcn.com) - with minimal changes to the original component. I recommended to check out the original documentation for more information.

```tsx
import { 
  Select, 
  SelectTrigger, 
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem
} from '~/core/ui/Select';

<Select>
  <SelectTrigger>
    <SelectValue placeholder={'Pick a fruit...'} />
  </SelectTrigger>

  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>

      <SelectItem value={'Apple'}>Apple</SelectItem>
      <SelectItem value={'Banana'}>Banana</SelectItem>
      <SelectItem value={'Peach'}>Peach</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

<DemoContainer>
  <div className='w-full max-w-xs'>
    <Select.Select>
      <Select.SelectTrigger>
        <Select.SelectValue placeholder={'Pick a fruit...'} />
      </Select.SelectTrigger>

      <Select.SelectContent>
        <Select.SelectGroup>
          <Select.SelectLabel>Fruits</Select.SelectLabel>

          <Select.SelectItem value={'Apple'}>Apple</Select.SelectItem>
          <Select.SelectItem value={'Banana'}>Banana</Select.SelectItem>
          <Select.SelectItem value={'Peach'}>Peach</Select.SelectItem>
        </Select.SelectGroup>
      </Select.SelectContent>
    </Select.Select>
  </div>
</DemoContainer>

### API

The complete API documentation for the `Select` component is available [on the Shadcn UI documentation](https://ui.shadcn.com/docs/components/select).
---
title: "Input Fields"
label: "Text Field"
description: "Text field input for forms. Collect text-based data from users"
position: 1
---

The `TextField` component is a wrapper around the native `input` element. It provides a consistent styling and layout for text-based inputs. It can be combined with the `Label` and `Hint` components to create a complete form field.

### Basic TextField

The simplest usage of the `TextField` component is to use it as a wrapper around the native `input` element.

```tsx
import { TextFieldInput } from '~/core/ui/TextField';

<TextFieldInput
  placeholder="Enter your name"
/>
```

<DemoContainer>
  <TextField.Input
    className='max-w-sm'
    placeholder="Enter your name"
  />
</DemoContainer>

### TextField with Label

You can wrap the `TextFieldInput` component with the `TextFieldLabel` component to create a form field with a label.

```tsx
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';

<TextFieldLabel>
  Name
  <TextFieldInput
    placeholder="Enter your name"
  />
</TextFieldLabel>
```

<DemoContainer>
  <TextField.Label className='max-w-sm'>
    Name
    <TextField.Input
      placeholder="Enter your name"
    />
  </TextField.Label>
</DemoContainer>

### TextField with Label and Hint

You can add a hint to the `TextFieldLabel` component to provide additional information to the user.

```tsx
import { 
  TextFieldInput, 
  TextFieldLabel, 
  TextFieldHint 
} from '~/core/ui/TextField';

<TextFieldLabel>
  Name
  <TextFieldInput
    placeholder="Enter your name"
  />

  <TextFieldHint> 
    This is a hint
  </TextFieldHint>
</TextFieldLabel>
```

<DemoContainer>
  <TextField.Label className='max-w-sm'>
    Name
    <TextField.Input
      placeholder="Enter your name"
    />

    <TextField.Hint>
      This is a hint
    </TextField.Hint>
  </TextField.Label>
</DemoContainer>
---
title: "Textarea Fields"
label: "Textarea"
description: "Textarea fields are used to collect large amounts of text from users."
position: 2
---

The `Textarea` component is a wrapper around the native `textarea` element. It provides a consistent styling and layout for text-based inputs. It can be combined with the `Label` and `Hint` components from the `TextField` component to create a complete form field.

### Basic Textarea

The simplest usage of the `Textarea` component is to use it as a wrapper around the native `textarea` element.

```tsx
import { Textarea } from '~/core/ui/Textarea';

<Textarea
  className='max-w-sm h-36'
  placeholder="Describe yourself in 100 words or less."
/>
```

<DemoContainer>
  <Textarea
    className='max-w-sm h-36'
    placeholder="Describe yourself in 100 words or less."
  />
</DemoContainer>

### Textarea with Label

You can wrap the `Textarea` component with the `Textarea` component to create a form field with a label.

```tsx
import { Textarea } from '~/core/ui/Textarea';
import { TextFieldLabel } from '~/core/ui/TextField';

<TextFieldLabel>
  Who are you?
  <Textarea
    placeholder="Describe yourself in 100 words or less."
  />
</TextFieldLabel>
```

<DemoContainer>
  <TextField.Label className='max-w-sm'>
    Who are you?
    <Textarea
      className='h-36'
      placeholder="Describe yourself in 100 words or less."
    />
  </TextField.Label>
</DemoContainer>

### TextField with Label and Hint

You can add a hint to the `TextFieldLabel` component to provide additional information to the user.

```tsx
import { 
  TextFieldLabel, 
  TextFieldHint 
} from '~/core/ui/TextField';

import { Textarea } from '~/core/ui/Textarea';

<TextFieldLabel>
  Who are you?
  <Textarea
    className='h-36'
    placeholder="Describe yourself in 100 words or less."
  />

  <TextFieldHint> 
    This is a hint
  </TextFieldHint>
</TextFieldLabel>
```

<DemoContainer>
  <TextField.Label className='max-w-sm'>
    Who are you?
    <Textarea
      className='h-36'
      placeholder="Describe yourself in 100 words or less."
    />

    <TextField.Hint>
      Please provide details about yourself.
    </TextField.Hint>
  </TextField.Label>
</DemoContainer>
---
title: "The Makerkit UI components Reference API"
label: "Makerkit UI Components"
description: "The Makerkit UI components Reference API documentation. Learn how to use the Makerkit UI components Reference API and view usage examples and API reference documentation."
position: 0
---

This documentation contains information about the Makerkit UI components Reference API. The Makerkit UI components Reference API is a collection of React components that can be used to build Makerkit UI components.

The large part of the Makerkit UI components Reference API is based on the [Shadcn UI](https://ui.shadcn.com/) library. This library is itself based on [Radix UI](https://www.radix-ui.com/).

The components listed here are available in all the Makerkit SaaS Kits, and the differences should be minimal. With that said, you may still encounter some differences in the components' behavior and appearance, or import paths, and default/non-default exports.

This Reference API is a work in progress. We will be adding more components and examples over time.

Currently, the components are separated into the following categories:
- Forms
- Information
- Navigation
- Utility

## Forms

Forms are used to collect user input. They are made up of form elements such as text inputs, checkboxes, radio buttons, and more.

### Information

Information components are used to display information to the user. They are made up of elements such as headings, tables, alerts, and more.

### Navigation

Navigation components are used to help users navigate through a website or application. They are made up of elements such as menus, breadcrumbs, tabs, and more.

### Utility

Utility components are used to perform specific tasks. They are made up of elements such structural components, spinners, and more.
---
title: "Alert Component - Display a message to the user"
label: "Alert"
description: "The Alert component is used to display a message to the user."
position: 1
---

The Alert component is used to display a message to the user - and can be used to display an info, success, warning or error messages.

The default type, if none is specified, is `info`.

## Basic Usage

```tsx
import { Alert } from '~/core/ui/Alert';

<Alert> 
  This is an info message. 
</Alert>
```

<DemoContainer>
  <div className="w-full max-w-sm">
    <Alert>
      This is an info message.
    </Alert>
  </div>
</DemoContainer>

You can also specify a title for the alert:

```tsx
import { Alert, AlertHeading } from '~/core/ui/Alert';

<Alert>
  <AlertHeading>Alert Title</AlertHeading>
  This is an info message.
</Alert>
```

<DemoContainer>
  <div className="w-full max-w-sm">
    <Alert>
      <Alert.Heading>Alert Title</Alert.Heading>
      This is an info message.
    </Alert>
  </div>
</DemoContainer>

## Success

The `success` type can be used to display a success message:

```tsx
import { Alert, AlertHeading } from '~/core/ui/Alert';

<Alert type="success"> 
  <AlertHeading>Congrats!</AlertHeading>
  You have successfully completed this task.
</Alert>
```

<DemoContainer>
  <div className="w-full max-w-sm">
    <Alert type="success">
      <Alert.Heading>Congrats!</Alert.Heading>
      You have successfully completed this task.
    </Alert>
  </div>
</DemoContainer>

## Warning

The `warn` type can be used to display a warning message:

```tsx
import { Alert, AlertHeading } from '~/core/ui/Alert';

<Alert type="warn"> 
  <AlertHeading>Careful!</AlertHeading>
  You may want to double-check this before proceeding.
</Alert>
```

<DemoContainer>
  <div className="w-full max-w-sm">
    <Alert type="warn">
      <Alert.Heading>Careful!</Alert.Heading>
      You may want to double-check this before proceeding.
    </Alert>
  </div>
</DemoContainer>

## Error

The `error` type can be used to display an error message:

```tsx
import { Alert, AlertHeading } from '~/core/ui/Alert';

<Alert type="error"> 
  <AlertHeading>We hit an error</AlertHeading>
  
  <p>
    We are sorry, but we hit an error while processing your request. 
    Please try again later.
  </p>
</Alert>
```

<DemoContainer>
  <div className="w-full max-w-sm">
    <Alert type="error">
      <Alert.Heading>We hit an error</Alert.Heading>

      <p>
        We are sorry, but we hit an error while processing your request.
        Please try again later.
      </p>
    </Alert>
  </div>
</DemoContainer>
---
title: "Badge Component - Display a small amount of information to the user"
label: "Badge"
description: "The Badge component is used to display a small amount of information to the user."
position: 2
---

The `Badge` component is used to display a small amount of information to the user. It can be used to display a count of items or a status. The default type is `default` but it can also be `success`, `warning` or `error`.

```tsx
import { Badge } from '~/core/ui/Badge';

<Badge>
  User
</Badge>
```

<DemoContainer>
  <Badge>
    User
  </Badge>
</DemoContainer>

You can also set a smaller size by using the `size` prop.

```tsx
import { Badge } from '~/core/ui/Badge';

<Badge size='sm'>
  User
</Badge>
```

<DemoContainer>
  <Badge size='small'>
    User
  </Badge>
</DemoContainer>

Alternatively, provide a fully custom `Badge` using the `size`, `color` and `className` props.

```tsx
import { Badge } from '~/core/ui/Badge';

<Badge 
  size='custom' 
  color='custom' 
  className='py-2 px-4 rounded-sm  border'
>
  User
</Badge>
```

<DemoContainer>
  <Badge
    size='custom'
    color='custom'
    className='py-2 px-4 rounded-sm  border'
  >
    User
  </Badge>
</DemoContainer>

## Success

Create a success badge by using the `color` prop.

```tsx
import { Badge } from '~/core/ui/Badge';

<Badge color='success'>
  Success
</Badge>
```

<DemoContainer>
  <Badge color='success'>
    Success
  </Badge>
</DemoContainer>

Use an Icon next to the text:

```tsx
import { CheckIcon } from '@heroicons/react/24/outline';
import { Badge } from '~/core/ui/Badge';

<Badge size='small' color='success'>
  <CheckIcon className='h-3'>
  Success
</Badge>
```

<DemoContainer>
  <Badge size='small' color='success'>
    <Icons.CheckIcon className='h-3 mr-0' />
    Success
  </Badge>
</DemoContainer>

## Error

Create an errror badge by using the `color` prop.

```tsx
import { Badge } from '~/core/ui/Badge';

<Badge color='error'>
  Error
</Badge>
```

<DemoContainer>
  <Badge color='error'>
    Error
  </Badge>
</DemoContainer>

Use an Icon next to the text:

```tsx
import { CheckIcon } from '@heroicons/react/24/outline';
import { Badge } from '~/core/ui/Badge';

<Badge size='small' color='error'>
  <CheckIcon className='h-3'>
  Error
</Badge>
```

<DemoContainer>
  <Badge size='small' color='error'>
    <Icons.XMarkIcon className='h-3 mr-0' />
    Error
  </Badge>
</DemoContainer>

---
title: "DataTable Component - Display tabular data in more complex scenarios"
label: "DataTable"
description: "The data table component is used to display tabular data in more complex scenarios"
position: 5
---

The `DataTable` component is a simple wrapper around the amazing Tanstack Table component.

This abstraction is used to provide a more consistent API for the data table component. If you need more control over the table, you can use the `@tanstack/table` module directly.

```tsx
import { DataTable } from '~/core/ui/DataTable';

function DataTableExample() {
  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'First Name',
      accessorKey: 'firstName',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
  ];

  const data = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@example.com',
      phone: '098-765-4321',
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alicejohnson@example.com',
      phone: '111-222-3333',
    },
    {
      id: 4,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bobsmith@example.com',
      phone: '444-555-6666',
    },
    {
      id: 5,
      firstName: 'Charlie',
      lastName: 'Brown',
      phone: '777-888-9999',
      email: 'charliebrown@exmaple.com',
    },
  ];

  return <DataTable data={data} columns={columns} />;
}
```

<DemoContainer contentStyle={{ padding: '1em' }}>
  <Examples.DataTableExample />
</DemoContainer>

## Props

You can pass the following props to the `DataTable` component:

- `data` - The data to display in the table
- `columns` - The columns to display in the table
- `renderSubComponent` - A function that returns a React element to render as a sub component for each row
- `pageIndex` - The current page index
- `pageSize` - The current page size
- `pageCount` - The current page count
- `onPaginationChange` - A function that is called when the pagination changes
- `tableProps` - Additional props to pass to the table component

## More Examples

### Checkbox Selection

An example of how to use the `DataTable` component with checkbox selection.

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';

import DataTable from '~/core/ui/DataTable';
import { Checkbox } from '~/core/ui/Checkbox';

function DataTableExampleWithCheckboxes() {
  const [store, setStore] = useState<number[]>([]);

  const columns: ColumnDef<(typeof data)[number]>[] = [
    {
      id: 'checkbox',
      header: () => {
        return (
          <Checkbox
            checked={store.length === data.length}
            onCheckedChange={(checked) => {
              if (checked) {
                setStore(data.map((row) => row.id));
              } else {
                setStore([]);
              }
            }}
          />
        );
      },
      cell: ({ row }) => {
        const original = row.original;
        const id = original.id;

        return (
          <div>
            <Checkbox
              checked={store.includes(id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setStore((ids) => [...ids, original.id]);
                } else {
                  setStore(store.filter((id) => id !== original.id));
                }
              }}
            />
          </div>
        );
      },
    },
    {
      header: 'First Name',
      accessorKey: 'firstName',
    },
    {
      header: 'Last Name',
      accessorKey: 'lastName',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
  ];

  const data = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      phone: '123-456-7890',
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@example.com',
      phone: '098-765-4321',
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alicejohnson@example.com',
      phone: '111-222-3333',
    },
    {
      id: 4,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bobsmith@example.com',
      phone: '444-555-6666',
    },
    {
      id: 5,
      firstName: 'Charlie',
      lastName: 'Brown',
      phone: '777-888-9999',
      email: 'charliebrown@exmaple.com',
    },
  ];

  return <DataTable data={data} columns={columns} />;
}

export default DataTableExampleWithCheckboxes;
```

<DemoContainer contentStyle={{ padding: '1em' }}>
  <Examples.DataTableExampleWithCheckboxes />
</DemoContainer>




---
title: "Dialog Component - Display content in a layer above the rest of the page"
label: "Dialog"
description: "The Dialog component is used to display content in a layer above the rest of the page. It is used to display content that requires user interaction, interruption of the current process, or a simple modal window."
position: 4
---

The `Dialog` component is used to display content in a layer above the rest of the page. This component is built on top of the [Radix UI](https://radix-ui.com) library and styled using [Tailwind CSS](https://tailwindcss.com).

This component comes from the [Shadcn UI Library](https://ui.shadcn.com) - with minimal changes to the original component. I recommended to check out the original documentation for more information.

## Usage

Use the `Dialog` component to display content that requires user interaction, interruption of the current process, or a simple modal window.

```tsx
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '~/core/ui/Dialog';
import { Button } from '~/core/ui/Button';

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'outline'}>Open Dialog</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTitle>
          Deleting Item
        </DialogTitle>

        <div className='flex flex-col space-y-4'>
          <p>
            You are about to delete this item. This action cannot be undone.
          </p>

          <p>Are you sure you want to continue?</p>

          <div className='flex justify-end'>
            <Button variant='destructive'>
              Yup, I'm sure
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

<DemoContainer>
  <Dialog.Dialog>
    <Dialog.DialogTrigger asChild>
      <Button variant={'outline'}>Open Dialog</Button>
    </Dialog.DialogTrigger>

    <Dialog.DialogContent>
      <Dialog.DialogTitle>
        Deleting Item
      </Dialog.DialogTitle>

      <div className='flex flex-col space-y-4'>
        <p>
          You are about to delete this item. This action cannot be undone.
        </p>

        <p>Are you sure you want to continue?</p>

        <div className='flex justify-end'>
          <Button variant='destructive'>
            Yup, I'm sure
          </Button>
        </div>
      </div>
    </Dialog.DialogContent>
  </Dialog.Dialog>
</DemoContainer>
---
title: "Heading Component"
label: "Heading"
description: "Heading component for titles and subtitles."
position: 6
---

Use the `Heading` component to display titles and subtitles.

```tsx
import { Heading } from '~/core/ui/Heading';

<Heading type={1}>Heading 1</Heading>
<Heading type={2}>Heading 2</Heading>
<Heading type={3}>Heading 3</Heading>
<Heading type={4}>Heading 4</Heading>
<Heading type={5}>Heading 5</Heading>
<Heading type={6}>Heading 6</Heading>
```

<DemoContainer>
  <div className={'flex flex-col space-y-2'}>
    <Heading type={1}>Heading 1</Heading>
    <Heading type={2}>Heading 2</Heading>
    <Heading type={3}>Heading 3</Heading>
    <Heading type={4}>Heading 4</Heading>
    <Heading type={5}>Heading 5</Heading>
    <Heading type={6}>Heading 6</Heading>
  </div>
</DemoContainer>
---
title: "Modal Component - A high level wrapper around the Dialog component"
label: "Modal"
description: "The Modal component is used to display content in a layer above the rest of the page. It is used to display content that requires user interaction, interruption of the current process, or a simple modal window."
position: 3
---

The `Modal` component is a wrapper around the `Dialog` component - as in it uses some common defaults and provides a few extra props to make it easier to use. For maximum flexibility, you can use the `Dialog` component directly.

## Basic Usage

You can pass any content to the `Modal` component. The `Modal` component will take care of the rest. To trigger the modal you have two options:

1. Pass a `Trigger` prop to the `Modal` component. This will render the trigger component and handle the click event to open the modal.
2. Use the `open/setOpen` props to control the modal state yourself.

### Trigger

Below, we pass the `Trigger` prop to the `Modal` component. This will render the trigger component and handle the click event to open the modal.

```tsx
import { Modal } from '~/core/ui/Modal';
import { Button } from '~/core/ui/Button';

<Modal
  heading='Modal'
  Trigger={<Button variant='outline'>Click me</Button>}
>
  <div className='flex flex-col space-y-4'>
    <p>Are you sure you want to continue?</p>

    <div className='flex justify-end'>
      <Button variant='destructive'>
        Yup, I'm sure
      </Button>
    </div>
  </div>
</Modal>
```

<DemoContainer>
  <Modal heading='Modal' Trigger={<Button variant='outline'>Click me</Button>}>
    <div className='flex flex-col space-y-4'>
      <p>Are you sure you want to continue?</p>

      <div className='flex justify-end'>
        <Button variant='destructive'>
          Yup, I'm sure
        </Button>
      </div>
    </div>
  </Modal>
</DemoContainer>

### Open / setOpen using state

Alternatively, you can use the `open` and `setOpen` props to control the modal state yourself.

```tsx
import { useState } from 'react';
import { Modal } from '~/core/ui/Modal';
import { Button } from '~/core/ui/Button';

function Component() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant='outline' onClick={() => setOpen(true)}>
        Click me
      </Button>

      <Modal
        heading='Modal'
        open={open}
        setOpen={setOpen}
      >
        <div className='flex flex-col space-y-4'>
          <p>Are you sure you want to continue?</p>

          <div className='flex justify-end'>
            <Button variant='destructive'>
              Yup, I'm sure
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
```
---
title: "Table Component - Display tabular data in a simple way"
label: "Table"
description: "The table component is used to display tabular data in a simple way."
position: 4
---

The table component is used to display tabular data in a simple way. It simply wraps the HTML `<table>` element and provides some styling and responsive behavior.

```tsx
function CustomersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>MRR</TableHead>
          <TableHead>Logins</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow>
          <TableCell>Pippin Oddo</TableCell>
          <TableCell>Pro</TableCell>
          <TableCell>$100.2</TableCell>
          <TableCell>920</TableCell>
          <TableCell>
            <Tile.Badge trend={'up'}>Healthy</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Väinö Pánfilo</TableCell>
          <TableCell>Basic</TableCell>
          <TableCell>$40.6</TableCell>
          <TableCell>300</TableCell>
          <TableCell>
            <Tile.Badge trend={'stale'}>Possible Churn</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Giorgos Quinten</TableCell>
          <TableCell>Pro</TableCell>
          <TableCell>$2004.3</TableCell>
          <TableCell>1000</TableCell>
          <TableCell>
            <Tile.Badge trend={'up'}>Healthy</Tile.Badge>
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell>Adhelm Otis</TableCell>
          <TableCell>Basic</TableCell>
          <TableCell>$0</TableCell>
          <TableCell>10</TableCell>
          <TableCell>
            <Tile.Badge trend={'down'}>Churned</Tile.Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

<DemoContainer contentStyle={{padding: '1em'}}>
  <Table.Table>
    <Table.TableHeader>
      <Table.TableRow>
        <Table.TableHead>Customer</Table.TableHead>
        <Table.TableHead>Plan</Table.TableHead>
        <Table.TableHead>MRR</Table.TableHead>
        <Table.TableHead>Logins</Table.TableHead>
        <Table.TableHead>Status</Table.TableHead>
      </Table.TableRow>
    </Table.TableHeader>

    <Table.TableBody>
      <Table.TableRow>
        <Table.TableCell>Pippin Oddo</Table.TableCell>
        <Table.TableCell>Pro</Table.TableCell>
        <Table.TableCell>$100.2</Table.TableCell>
        <Table.TableCell>920</Table.TableCell>
        <Table.TableCell>
          <Tile.Badge trend={'up'}>Healthy</Tile.Badge>
        </Table.TableCell>
      </Table.TableRow>

      <Table.TableRow>
        <Table.TableCell>Väinö Pánfilo</Table.TableCell>
        <Table.TableCell>Basic</Table.TableCell>
        <Table.TableCell>$40.6</Table.TableCell>
        <Table.TableCell>300</Table.TableCell>
        <Table.TableCell>
          <Tile.Badge trend={'stale'}>Possible Churn</Tile.Badge>
        </Table.TableCell>
      </Table.TableRow>

      <Table.TableRow>
        <Table.TableCell>Giorgos Quinten</Table.TableCell>
        <Table.TableCell>Pro</Table.TableCell>
        <Table.TableCell>$2004.3</Table.TableCell>
        <Table.TableCell>1000</Table.TableCell>
        <Table.TableCell>
          <Tile.Badge trend={'up'}>Healthy</Tile.Badge>
        </Table.TableCell>
      </Table.TableRow>

      <Table.TableRow>
        <Table.TableCell>Adhelm Otis</Table.TableCell>
        <Table.TableCell>Basic</Table.TableCell>
        <Table.TableCell>$0</Table.TableCell>
        <Table.TableCell>10</Table.TableCell>
        <Table.TableCell>
          <Tile.Badge trend={'down'}>Churned</Tile.Badge>
        </Table.TableCell>
      </Table.TableRow>
    </Table.TableBody>
  </Table.Table>
</DemoContainer>
---
title: "Tooltip Component"
label: "Tooltip"
description: "The Tooltip component is used to display a tooltip."
position: 5
---

The `Tooltip` component can be used to display additional information when hovering an element. This component is built on top of the [Radix UI](https://radix-ui.com) library and styled using [Tailwind CSS](https://tailwindcss.com).

This component comes from the [Shadcn UI Library](https://ui.shadcn.com) - with minimal changes to the original component. I recommended to check out the original documentation for more information.

## Usage

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '~/core/ui/Tooltip';
import { Button } from '~/core/ui/Button';

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant='ghost'>Hover me</Button>
  </TooltipTrigger>

  <TooltipContent>
    Hello world
  </TooltipContent>
</Tooltip>
```

<DemoContainer>
  <Tooltip.Tooltip>
    <Tooltip.TooltipTrigger asChild>
      <Button variant='ghost'>Hover me</Button>
    </Tooltip.TooltipTrigger>

    <Tooltip.TooltipContent>
      Hello world
    </Tooltip.TooltipContent>
  </Tooltip.Tooltip>
</DemoContainer>
---
title: "Video Component - Display a video"
label: "Video"
description: "The Video component is used to display videos in your webpage using the HTML5 video tag."
position: 7
---

The `Video` component is used to display videos in your webpage using the HTML5 video tag.

```tsx
import { Video } from '~/core/ui/Video';

<Video src='/videos/video.mp4' />
```

The `Video` component is automatically lazy loaded, meaning that the video will only be loaded when it is visible in the viewport.

While loading, the `Video` component will display a loading indicator. Once the video is loaded, the loading indicator will be replaced by the video.

### Props

1. `src` - The source of the video.
2. `className` - The class name to apply to the video element.
3. `poster` - The poster image to display before the video is loaded.
4. `width` - The width of the video.
5. `type` - The type of the video. Defaults to `video/mp4`.
---
label: "Container"
title: "Container Component"
position: 0
description: "A container component to wrap content in a centered container."
---

The Container component is a simple component that wraps content in a centered container.

```tsx
const Container: React.FCC = ({ children }) => {
  return <div className="container mx-auto px-5">{children}</div>;
};
```

Use it anywhere you want to center content on the page:

```tsx
import { Container } from "~/core/ui/Container";

function App() {
  return (
    <Container>
      <p>Content</p>
    </Container>
  );
}
```
---
label: "Section"
title: "Section Component"
position: 1
description: "Section component. Organizes content into sections."
---

The Section component is used to organize content into sections. It is composed of a SectionHeader and SectionBody component.

In the kits, it used across the Settings pages to organize content into sections.

```tsx
import { Section, SectionHeader, SectionBody } from '~/core/ui/Section';
import { TextFieldInput, TextFieldLabel } from '~/core/ui/TextField';
import { Button } from '~/core/ui/Button';

<Section>
  <SectionHeader
    title={'Your Details'}
    description={`Please enter your details below.`}
  />

  <SectionBody className={'space-y-4'}>
    <TextFieldLabel>
      Name
      <TextFieldInput />
    </TextFieldLabel>

    <TextFieldLabel>
      Surname
      <TextFieldInput />
    </TextFieldLabel>

    <Button>
      Save
    </Button>
  </SectionBody>
</Section>
```

<DemoContainer contentStyle={{ padding: '1em' }}>
  <Section.Section>
    <Section.SectionHeader
      title={'Your Details'}
      description={`Please enter your details below.`}
    />

    <Section.SectionBody className={'space-y-4'}>
      <TextField.Label>
        Name
        <TextField.Input />
      </TextField.Label>

      <TextField.Label>
        Surname
        <TextField.Input />
      </TextField.Label>

      <Button>
        Save
      </Button>
    </Section.SectionBody>
  </Section.Section>
</DemoContainer>
---
label: "Tile"
title: "Tile Component"
position: 2
description: "Tile component - used to display a tile with an icon and text."
---

The Tile component is usually used in dashboards to display a tile with an icon and text.

```tsx
import { Tile } from '~/core/ui/Tile';

<div className={'grid grid-cols-2 gap-4'}>
  <Tile>
    <Tile.Heading>MRR</Tile.Heading>

    <Tile.Body>
      <div className={'flex justify-between space-x-8'}>
        <Tile.Figure>
          $13,322
        </Tile.Figure>

        <Tile.Trend trend={'up'}>+30%</Tile.Trend>
      </div>
    </Tile.Body>
  </Tile>

  <Tile>
    <Tile.Heading>Support Tickets</Tile.Heading>

    <Tile.Body>
      <div className={'flex justify-between space-x-8'}>
        <Tile.Figure>
          +133
        </Tile.Figure>

        <Tile.Trend trend={'down'}>+12%</Tile.Trend>
      </div>
    </Tile.Body>
  </Tile>
</div>
```

<DemoContainer>
  <div className={'grid grid-cols-2 gap-4'}>
    <Tile>
      <Tile.Heading>MRR</Tile.Heading>

      <Tile.Body>
        <div className={'flex justify-between space-x-8'}>
          <Tile.Figure>
            $13,322
          </Tile.Figure>

          <Tile.Trend trend={'up'}>+30%</Tile.Trend>
        </div>
      </Tile.Body>
    </Tile>

    <Tile>
      <Tile.Heading>Support Tickets</Tile.Heading>

      <Tile.Body>
        <div className={'flex justify-between space-x-8'}>
          <Tile.Figure>
            +133
          </Tile.Figure>

          <Tile.Trend trend={'down'}>+12%</Tile.Trend>
        </div>
      </Tile.Body>
    </Tile>
  </div>
</DemoContainer>
---
title: "Mobile Navigation Menu"
label: "Mobile Navigation Menu"
description: "The mobile navigation menu is a menu that is only visible on mobile devices. It is used to navigate the site on mobile devices."
position: 4
---

The mobile navigation menu is a menu that is only visible on mobile devices. It is used to navigate the site on mobile devices. It uses the `Dropdown` component to display the menu items with a full-width panel.

It can be used with the `NavigationMenu` component to display the same menu on desktop and mobile devices - while keeping the correct visibility on each device using Tailwind's responsive classes.

```tsx
import { MobileNavigationMenu } from '~/core/ui/MobileNavigationMenu';

<div className={'block w-full lg:hidden'}>
  <MobileNavigationMenu 
    links={[{
      label: 'Home',
      path: '/',
    }, {
      label: 'About',
      path: '/about',
    }]}
  />
</div>
```

<DemoContainer>
  <MobileNavigationMenu
    links={[{
      label: 'Home',
      path: '/docs/components/mobile-navigation-menu'
    }, {
      label: 'About',
      path: '/about',
    }]}
  />
</DemoContainer>
---
title: "Navigation Menu"
label: "Navigation Menu"
description: "The navigation menu component is used to display a list of links to pages within the site."
position: 1
---

The Navigation Menu component is used to display a list of links to pages within the site. This component is used in a variety of places throughout the Kits, including the main navigation menu, the settings menu, etc.

## Usage

Let's explore the different ways the Navigation Menu component can be used.

### Basic Usage

The most basic usage of the Navigation Menu component is to display a list of links to pages within the site. This is the default usage of the component.

```tsx
<NavigationMenu>
  <NavigationMenuItem link={{ path: '#', label: 'Home' }} />
  <NavigationMenuItem link={{ path: '/about', label: 'About' }} />
  <NavigationMenuItem link={{ path: '/contact', label: 'Contact' }} />
</NavigationMenu>
```

<DemoContainer iframeStyle={{ width: '1400px' }} contentStyle={{ 'justifyContent': 'start' }}>
  <div className={'w-[12rem] flex'}>
    <NavigationMenu>
      <NavigationMenuItem link={{ path: '', label: 'Home' }} />
      <NavigationMenuItem link={{ path: '#/about', label: 'About' }} />
      <NavigationMenuItem link={{ path: '#/contact', label: 'Contact' }} />
    </NavigationMenu>
  </div>
</DemoContainer>

### Bordered

To display a tabbed-style navigation menu, use the `bordered` prop.

```tsx
<NavigationMenu bordered>
  <NavigationMenuItem link={{ path: '/', label: 'Home' }} />
  <NavigationMenuItem link={{ path: '/about', label: 'About' }} />
  <NavigationMenuItem link={{ path: '/contact', label: 'Contact' }} />
</NavigationMenu>
```

<DemoContainer iframeStyle={{ width: '1400px' }} contentStyle={{ 'justifyContent': 'start' }}>
  <div className={'w-[12rem] flex'}>
    <NavigationMenu bordered>
      <NavigationMenuItem link={{ path: '', label: 'Home' }} />
      <NavigationMenuItem link={{ path: '#/about', label: 'About' }} />
      <NavigationMenuItem link={{ path: '#/Contact', label: 'Contact' }} />
    </NavigationMenu>
  </div>
</DemoContainer>

### Pill Vertical

To display secondary navigation menus, the pill vertical style can be ideal. This style is used in the settings menu for the sub-navigation menus.

```tsx
<NavigationMenu pill vertical>
  <NavigationMenuItem link={{ path: '/', label: 'Home' }} />
  <NavigationMenuItem link={{ path: '/about', label: 'About' }} />
  <NavigationMenuItem link={{ path: '/contact', label: 'Contact' }} />
</NavigationMenu>
```

<DemoContainer iframeStyle={{ width: '1400px' }} contentStyle={{ 'justifyContent': 'start' }}>
  <div className={'w-[12rem] flex'}>
    <NavigationMenu pill vertical>
      <NavigationMenuItem link={{ path: '', label: 'Home' }} />
      <NavigationMenuItem link={{ path: '#/about', label: 'About' }} />
      <NavigationMenuItem link={{ path: '#/contact', label: 'Contact' }} />
    </NavigationMenu>
  </div>
</DemoContainer>
---
title: "Sidebar"
label: "Sidebar"
description: "The Sidebar component is used to create a full-page Sidebar navigation menu."
position: 2
---

The Sidebar component is used to create a full-page Sidebar navigation menu. It is used in both the Kits Dashboard and the Admin pages.

## Usage

Let's explore the different ways the Sidebar component can be used.

### Basic Usage

Below is a basic example of how to use the Sidebar component.

```tsx
import { 
  Cog8ToothIcon, 
  CreditCardIcon, 
  Square3Stack3DIcon, 
  Squares2X2Icon 
} from "@heroicons/react/24/outline";

import { Sidebar, SidebarItem, SidebarContent } from "~/core/ui/Sidebar";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className={'py-4'}>
        <SidebarItem
          path={'#dashboard'}
          Icon={() => <Square3Stack3DIcon className={'w-4'} />}
        >
          Dashboard
        </SidebarItem>

        <SidebarItem
          path={'#workspace'}
          Icon={() => <Squares2X2Icon className={'w-4'} />}
        >
          Workspace
        </SidebarItem>

        <SidebarItem
          path={'#subscription'}
          Icon={() => <CreditCardIcon className={'w-4'} />}
        >
          Subscription
        </SidebarItem>

        <SidebarItem
          path={'#settings'}
          Icon={() => <Cog8ToothIcon className={'w-4'} />}
        >
          Settings
        </SidebarItem>
      </SidebarContent>
    </Sidebar>
  );
}
```

<DemoContainer iframeStyle={{ width: '1400px' }} contentStyle={{ 'justifyContent': 'start' }}>
  <Sidebar.Sidebar>
    <Sidebar.SidebarContent className='py-4'>
      <Sidebar.SidebarItem
        path={'/docs/components/sidebar'}
        Icon={() => <Icons.Square3Stack3DIcon className={'w-4'} />}
      >
        Dashboard
      </Sidebar.SidebarItem>

      <Sidebar.SidebarItem
        path={'#workspace'}
        Icon={() => <Icons.Squares2X2Icon className={'w-4'} />}
      >
        Workspace
      </Sidebar.SidebarItem>

      <Sidebar.SidebarItem
        path={'#subscription'}
        Icon={() => <Icons.CreditCardIcon className={'w-4'} />}
      >
        Subscription
      </Sidebar.SidebarItem>

      <Sidebar.SidebarItem
        path={'#settings'}
        Icon={() => <Icons.Cog8ToothIcon className={'w-4'} />}
      >
        Settings
      </Sidebar.SidebarItem>
    </Sidebar.SidebarContent>
  </Sidebar.Sidebar>
</DemoContainer>

### Sidebar with Groups

You can create groups of Sidebar items by using the `SidebarGroup` component.

```tsx
import { 
  Cog8ToothIcon, 
  CreditCardIcon, 
  Square3Stack3DIcon, 
  Squares2X2Icon 
} from "@heroicons/react/24/outline";

import { Sidebar, SidebarItem, SidebarContent } from "~/core/ui/Sidebar";

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className={'py-4'}>
        <SidebarGroup label='App' collapsible={false}>
          <SidebarItem
            path={'#dashboard'}
            Icon={() => <Square3Stack3DIcon className={'w-4'} />}
          >
            Dashboard
          </SidebarItem>

          <SidebarItem
            path={'#workspace'}
            Icon={() => <Squares2X2Icon className={'w-4'} />}
          >
            Workspace
          </SidebarItem>
        </SidebarGroup>

        <SidebarGroup label='Settings' collapsible>
          <SidebarItem
            path={'#subscription'}
            Icon={() => <CreditCardIcon className={'w-4'} />}
          >
            Subscription
          </SidebarItem>

          <SidebarItem
            path={'#profile'}
            Icon={() => <Cog8ToothIcon className={'w-4'} />}
          >
            Profile
          </SidebarItem>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
```

<DemoContainer iframeStyle={{ width: '1400px' }} contentStyle={{ 'justifyContent': 'start' }}>
  <Sidebar.Sidebar>
    <Sidebar.SidebarContent className='py-4'>
      <Sidebar.SidebarGroup label='App' collapsible={false}>
        <Sidebar.SidebarItem
          path={'#dashboard'}
          Icon={() => <Icons.Square3Stack3DIcon className={'w-4'} />}
        >
          Dashboard
        </Sidebar.SidebarItem>

        <Sidebar.SidebarItem
          path={'/docs/components/sidebar'}
          Icon={() => <Icons.Squares2X2Icon className={'w-4'} />}
        >
          Workspace
        </Sidebar.SidebarItem>
      </Sidebar.SidebarGroup>

      <Sidebar.SidebarGroup label='Settings'>
        <Sidebar.SidebarItem
          path={'#subscription'}
          Icon={() => <Icons.CreditCardIcon className={'w-4'} />}
        >
          Subscription
        </Sidebar.SidebarItem>

        <Sidebar.SidebarItem
          path={'#settings'}
          Icon={() => <Icons.Cog8ToothIcon className={'w-4'} />}
        >
          Profile
        </Sidebar.SidebarItem>
      </Sidebar.SidebarGroup>
    </Sidebar.SidebarContent>
  </Sidebar.Sidebar>
</DemoContainer>

---

### API

The following props are available for the `Sidebar` components.

#### &lt;Sidebar&gt;

The Sidebar component accepts the following props:

1. `collapsed` - Whether the sidebar is initially collapsed or not. Defaults to `false`.

```tsx
<Sidebar collapsed={false}>
...
</Sidebar>
```

#### &lt;SidebarItem&gt;

The SidebarItem component accepts the following props:

1. `path` - The path to navigate to when the item is clicked.
2. `Icon` - The icon to display next to the item.
3. `end` - Whether the item should look as "active" when the path matches the current path. Defaults to `false`. By default, the path will match sub-paths up to 3 levels deep. For example, if the current path is `/dashboard`, then the item will look as "active" if the path is `/dashboard`, `/dashboard/overview`, `/dashboard/overview/1`, etc. If you want to match the path exactly, then set `end` to `true`. In this way, the item will only look as "active" if the path is `/dashboard`.

```tsx
<SidebarItem
  path={'/dashboard'}
  Icon={() => <Square3Stack3DIcon className={'w-4'} />}
  end={true}
>...</SidebarItem>
```

#### &lt;SidebarContent&gt;

The SidebarContent component accepts the following props:

1. `className` - The class name to apply to the content container.

```tsx
<SidebarContent className={'py-4'}>...<SidebarContent>
```

#### &lt;SidebarGroup&gt;

The SidebarGroup component accepts the following props:

1. `label` - The label of the group.
2. `collapsible` - Whether the group is collapsible or not. Defaults to `true`.
3. `collapsed` - Whether the group is initially collapsed or not. Defaults to `false`.

```tsx
<SidebarGroup 
  label='App' 
  collapsible={true} 
  collapsed={false}>
  ...
</SidebarGroup>
```
---
title: "Stepper"
label: "Stepper"
description: "The Stepper component is used to display a progress bar with a set of steps. It is used to indicate the current position in a process."
position: 3
---

## Basic Usage - Default

The basic usage of the Stepper component is to display a progress bar with a set of steps. It is used to indicate the current position in a process. By default, we display the `default` style.

```tsx
<Stepper 
  steps={['Details', 'Organization', "Complete"]} 
  currentStep={0} 
/> 
```

<DemoContainer>
  <div className="max-w-md w-full">
    <Stepper steps={['Details', 'Organization', "Complete"]} currentStep={0} />
  </div>
</DemoContainer>

### Numbers variant

The `numbers` variant displays the step number instead of the default dot.

```tsx
<Stepper 
  steps={['Details', 'Organization', "Complete"]} 
  currentStep={0} 
  variant="numbers"
/>
```

<DemoContainer>
  <div className="max-w-md w-full">
    <Stepper steps={['Details', 'Organization', "Complete"]} currentStep={0} variant="numbers" />
  </div>
</DemoContainer>

### Props

The following props may be passed to configure the Stepper component.

1. `steps` - An array of strings that represent the steps in the stepper. You can also pass translation keys to localize the stepper, such as `common.step1`.
2. `currentStep` - The current step in the stepper. This is a zero-based index.
3. `variant` - The variant of the stepper. The default is `default`. The other option is `numbers`.

---
title: "Client Only - Display content only on the client in JSX"
label: "Client Only"
position: 2
description: "The ClientOnly component allows to display content only on the client in JSX."
---

The `ClientOnly` component allows to render content only on the client/browser. This is useful when you want to render content that is not supported by the server (e.g. `window` or `document`).

```tsx
import { ClientOnly } from '~/core/ui/If';

<ClientOnly>
  <div>Only rendered on the client</div>
</ClientOnly>
```

An alternative to this component can be using the `dynamic` function from `next/dynamic`:

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./DynamicComponent'), {
  ssr: false,
});
```

If you're using Next.js, consider using the `dynamic` function instead of `ClientOnly`.
---
title: "Conditional Statements"
label: "If"
position: 0
description: "The If component allows to use conditions to execute a block of code if a condition is true as a JSX component."
---

The `If` component allows to use conditions to execute a block of code if a condition is true as a JSX component.

This component is useful to avoid the use of ternary operators in JSX code.

```tsx
import If from '~/core/ui/If';

<If condition={true}>
  <p>
    This content will be displayed
  </p>
</If>

<If condition={false} fallback={'I get displayed instead'}>
  <p>
    This content will not be displayed
  </p>
</If>
```

<DemoContainer>
  <div className={'flex flex-col'}>
    <If condition={true}>
      <p>This content will be displayed</p>
    </If>

    <If condition={false} fallback={'I get displayed instead'}>
      <p>This content will not be displayed</p>
    </If>
  </div>
</DemoContainer>
---
title: "Lazy Render"
label: "Lazy Render"
position: 5
description: "Lazy render component when it is visible in the viewport."
---

The `LazyRender` component is used to lazy render a component when it is visible in the viewport. This is useful for rendering components that are not visible on the initial page load, but are visible after scrolling down the page.

This is extremely useful in situations where you want to delay loading a heavy component until it is visible in the viewport. For example, with videos.

## Usage

```tsx
import { LazyRender } from '~/core/ui/LazyRender';

<LazyRender>
  <Video />
</LazyRender>
```

## Props

The `LazyRender` component accepts the following props:

1. **threshold** - The percentage of the component that must be visible in the viewport before it is rendered. Defaults to `0`.
2. **rootMargin** - The margin around the viewport that must be visible before the component is rendered. Defaults to `0px`.
3. **onVisible** - A callback that is called when the component is visible in the viewport.

---
title: "Loading Overlay Component - Display a Loading overlay while loading data"
label: "Loading Overlay"
position: 4
description: "The Loading Overlay is a component to display a spinner while loading data."
---

Use the `LoadingOverlay` component to display an animated SVG spinner while loading data, while also displaying a message. This is useful for full-page loading states.

### Basic Usage

The most basic usage of the `LoadingOverlay` component is to display a spinner.

```tsx
import LoadingOverlay from '~/core/ui/LoadingOverlay';

<LoadingOverlay />;
```

<DemoContainer>
  <LoadingOverlay />
</DemoContainer>

### With Message

The `LoadingOverlay` component can also display a message.

```tsx
import LoadingOverlay from '~/core/ui/LoadingOverlay';

<LoadingOverlay>
  Loading Tasks. Please wait...
</LoadingOverlay>;
```

<DemoContainer>
  <LoadingOverlay>
    Loading Tasks. Please wait...
  </LoadingOverlay>
</DemoContainer>

### Full Page

The `LoadingOverlay` component can also be used as a full-page loading overlay.

```tsx
import LoadingOverlay from '~/core/ui/LoadingOverlay';

<LoadingOverlay fullPage>
  Loading Tasks. Please wait...
</LoadingOverlay>;
```

<DemoContainer>
  <LoadingOverlay fullPage>
    Loading Tasks. Please wait...
  </LoadingOverlay>
</DemoContainer>

### With Logo

The `LoadingOverlay` component can also display a logo. The component will use the `Logo` component from the `~/core/ui/Logo` module.

```tsx
import LoadingOverlay from '~/core/ui/LoadingOverlay';

<LoadingOverlay displayLogo fullPage>
  Loading Page. Please wait...
</LoadingOverlay>;
```

<DemoContainer>
  <LoadingOverlay displayLogo fullPage>
    Loading Page. Please wait...
  </LoadingOverlay>
</DemoContainer>
---
title: "Spinner Component - Display a spinner while loading data"
label: "Spinner"
position: 3
description: "Spinner is a component to display a spinner while loading data."
---

Use the `Spinner` component to display an animated SVG spinner while loading data. For a more complete component, check out the `LoadingOverlay` component instead, which wraps the `Spinner` component and displays a message.

```tsx
import Spinner from '~/core/ui/Spinner';

<Spinner />;
```

<DemoContainer>
  <Spinner />
</DemoContainer>
