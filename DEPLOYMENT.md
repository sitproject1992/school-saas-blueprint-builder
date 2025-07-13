# Deployment Guide

This guide provides instructions for setting up a local development environment and for deploying the application to a cloud provider.

## Local Development Setup

To set up a local development environment, you will need to have the following installed:

*   [Node.js](https://nodejs.org/) (v16 or later)
*   [npm](https://www.npmjs.com/)
*   [Supabase CLI](https://supabase.com/docs/guides/cli)

Once you have these installed, you can follow these steps to set up the project:

1.  Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Set up your Supabase project:

    ```bash
    supabase init
    ```

4.  Link your local repository to your Supabase project:

    ```bash
    supabase link --project-ref your-project-ref
    ```

5.  Push the database schema to your Supabase project:

    ```bash
    supabase db push
    ```

6.  Start the development server:

    ```bash
    npm run dev
    ```

## Cloud Deployment

To deploy the application to a cloud provider, you can use a service like [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). These services provide a simple and easy way to deploy modern web applications.

To deploy the application to Vercel, you can follow these steps:

1.  Create a new project in Vercel and connect it to your GitHub repository.
2.  Configure the build settings:
    *   **Build command:** `npm run build`
    *   **Output directory:** `dist`
3.  Add the following environment variables:
    *   `VITE_SUPABASE_URL`: The URL of your Supabase project.
    *   `VITE_SUPABASE_ANON_KEY`: The anonymous key for your Supabase project.
4.  Deploy the application.

To deploy the application to Netlify, you can follow these steps:

1.  Create a new site in Netlify and connect it to your GitHub repository.
2.  Configure the build settings:
    *   **Build command:** `npm run build`
    *   **Publish directory:** `dist`
3.  Add the following environment variables:
    *   `VITE_SUPABASE_URL`: The URL of your Supabase project.
    *   `VITE_SUPABASE_ANON_key`: The anonymous key for your Supabase project.
4.  Deploy the application.
