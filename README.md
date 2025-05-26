This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## MongoDB Setup

1. Install Docker Desktop
2. `docker run -d --name mongo-ptw -p 27018:27018 mongo:latest mongod --port 27018` 27017 is usually the default port for MongoDB, but I have another mongodb instance running on port 27017 already. That's why I'm using 27018 as the port in the command.
