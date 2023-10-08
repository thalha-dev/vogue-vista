# VOGUE VISTA - ONLINE SHOE STORE

Vogue Vista is an innovative online shoe store powered by the MERN (MongoDB, Express.js, React, Node.js) stack. Explore an exquisite collection of shoes curated for every style and occasion. Whether you're looking for casual sneakers, elegant formal shoes, or something in between, Vogue Vista has you covered.

## Project Highlights

- A user-friendly and visually appealing web application for shoe enthusiasts.
- Seamless browsing and shopping experience with intuitive navigation.
- Secure user authentication and role-based access control.
- Integration with popular payment gateway Stripe for smooth transactions.
- High-quality images powered by ImageKit for an immersive shopping experience.
- Responsive design.

## Setting Up Environment Variables

To run Vogue Vista successfully, you'll need to set up the following environment variables in a `.env` file. These variables are required for both the frontend and backend directories.

**Frontend Environment Variables (For `.env` in the frontend directory):**

```
VITE_ROLE_USER=(number same as in backend)
VITE_ROLE_ADMIN=(number same as in backend)
VITE_SERVER_URI=
VITE_CLIENT_URI=
VITE_PUBLISHABLE_API_KEY=(given by stripe)
```

**Backend Environment Variables (For `.env` in the backend directory):**

```
DATABASE_URI=(given by MongoDB atlas)
CLIENT_URI=
ACCESS_TOKEN_SECRET=(sting with mixed characters)
REFRESH_TOKEN_SECRET=(sting with mixed characters)
USER_ROLE=(number same as in frontend)
ADMIN_ROLE=(number same as in frontend)
IMAGEKIT_PUBLIC_KEY=(given by Imagekit)
IMAGEKIT_PRIVATE_KEY=(given by Imagekit)
IMAGEKIT_URL_ENDPOINT=(need to create in Imagekit)
STRIPE_SECRET_KEY=(given by stripe)
```

## Installing dependencies

**Run `npm install` in both the directories**

## To run locally

**Run `npm run dev` in both the directories**
