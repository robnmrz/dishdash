Read `CLAUDE.md` before starting

In this second step we're creating the golang backend called swishdish-api. Please create it in the root folder of this project. Please create the API using the modern ServeMux router in golang so don't use any 3. party dependencies for implementing the api Use a middleware for authentication.

In the first step please implement the following endpoints:
- jwt based sign up / sign in
- endpoints needed for the onbaording flow

Alongside this, make sure to provide database migration .sql files and use golang migrate to autmatically apply new migrations. Make sure the relevant tables and columns are in place.

Please also add a Dockerfile and docker-compose.yaml to run the backend with the postgres database. Make sure the Dockerfile results in a small and efficient container.

### Check when done
- all necessary endpoint for auth and onboarding are available
- the golang binary compiles correctly
