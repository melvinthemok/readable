# ReadAble

## Development

1. Install mongodb if you haven't

   `brew install mongodb`

2. Clone this repo (or a fork of it)

   `git@github.com:melvinthemok/readable.git`

3. Add your own .env file with values for the following keys

   `SESSION_SECRET`

   `ADMIN_PASSWORD`

   `SIGNUP_PASSWORD`

4. Install packages

   `yarn install`

5. Run mongoDB daemon

   `mongod`

6. Run the app

   `yarn dev-start`

## Testing

1. Set up app as described above.

2. Run tests with

   `yarn test`

## Deployment

Automatic deployment upon merging to master.

## Usage

1. All CatchPlus personnel and tutors should sign up for an account at `/auth/catchPlus/signup` or `/auth/tutor/signup`. Tutors who are also ReadAble admins should fill in their admin password.

2. ReadAble admin(s) should add to list of historical ReadAble sessions at `/history`.

3. Add students at `/students/new`.

4. If you have comments to add for student(s) for a particular session, do so at `/comments/new`.
