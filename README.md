## Notes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


### Date

23/11/2020

### Location of deployed application

API URL: https://8k670x86l6.execute-api.us-east-1.amazonaws.com/v1

| Method | Endpoint       | payload                                         |
| ------ | -------------- | ----------------------------------------------- |
| POST   | /auth/register | { "username": "new_user", "password": "123123"} |
| GET    | /current       | NA                                              |
| PUT    | /current       | { "current": 123123}                            |
| GET    | /next          | NA                                              |


### Time spent

start date: 17/12 at 7pm  -> total 3h
date: 18/12               -> + total 3h
date: 19/12               -> + total 4h
date: 20/12               -> + total 2h
date: 21/12               -> + total 4h
date: 22/12               -> + total 6h

Total spent: approximately 22h

### Assumptions made

- Did not know if there was any cost limitation
  - Consequence: Used RDS with mysql
- Did not know about scalability requirements
  - Consequence: Used lambda, but decided for a mixed approach with express framework (makes it easy to swap to non-serverless)
- Assumed there could be concurrency asking for identifiers
  - Consequence: Created simple retry rule to improve experience and always look for latest next identifier


### Shortcuts/Compromises made

- Whish I could have added more unit tests
- Whish I could have added integration or end-to-end tests
- Started to implement OAuth2 but it was taking longer than expected to integrate with node library, so I decided to leave for the end and ran out of time

### Stretch goals attempted

- Deployed API on AWS, using Infrastructed as Code with Terraform
- Wanted to finish OAuth implementation, but I used too much time with code refactoring and iac
- Unfortuately I didn't even start the UI. I wanted to add a simple React component but didn't want to use more than 5 days
  
### Instructions to run assignment locally

To run locally:

1 - Clone repository
2 - Inside cloned folder run:

```console
  docker-compose up -d
``` 

Now you are able to access the API using the URL http://localhost:3000 

But to start interacting with the api we need to setup the database:

```console
  export DB_CONNECTION_STRING=mysql://root:root@localhost:3306/integer_saas
  npm run migrate
``` 

Now you can start registering your user through the POST http://localhost:3000/auth/register endpoint with a payload such as

```JSON
{
    "username": "new_username",
    "password": "12345"
}
```


#### To run unit tests locally:

1 - Clone repository
2 - Inside cloned folder run:

```console
  npm run install && npm run unit-test
``` 

### What did you not include in your solution that you want us to know about?

- I know enough of React to make a simple UI but I didn't find the time to do it
- I was not sure if API Key meant the access token or it was an api key + access token, so I added an api key using api gateway and implemented authentication on the application with the access token.

### Other information about your submission that you feel it's important that we know if applicable.

- I tried to use a layered architecure approach, so basically the project is organised in the following way:

| Layer | Title                  |
| ----- | ---------------------- |
| 1     | Infrastructure         |
| 2     | Application            |
| 3     | Routing and Validation |
| 4     | Services               |
| 5     | Repositories           |
| 6     | Domain Models          |

Dependencies are supposed to work from 1 -> 6, meaning 3 can depend on 4, but not vice-versa.

- I'm aware that my implementation may be too complex for such a simple problem, but I wanted to use the opportunity to demonstrate a few concepts:
  - layered architecture approach 
  - unit tests organization
  - infrastructure as code with terraform
  - using containers with docker

### Your feedback on this technical challenge

I had fun making challenge. I think its simple but it gives opportunity to the candidate to demonstrate what he knows. I deninitely wanted to do more, but I might have used too much time because I focused on the Stretch Goals.  