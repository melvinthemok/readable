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

4. While adding attendance details for each Fitzroy student, please choose either 'Yes' or 'No' for 'Book Completed?' if the 'Fitzroy Book Level' selected is not 'Other activity'. Conversely, do not select any value for 'Book completed?' if the student did 'Other activity' during that session.

5. If you have comments to add for a student for a particular session, do so at `/comments/new`.
