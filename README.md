## Notes

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


### Date

22/11/2020

### Location of deployed application

API URL: https://8k670x86l6.execute-api.us-east-1.amazonaws.com/v1

| Method | Endpoint       | payload                                         |
| ------ | -------------- | ----------------------------------------------- |
| POST   | /auth/register | { "username": "new_user", "password": "123123"} |
| GET    | /current       | NA                                              |
| PUT    | /current       | { "current": 123123}                            |
| GET    | /next          | NA                                              |

Resources `/current` and `/next` are protected and will only accept requests containing Authorization Header with Bearer token

### Time spent

| Date  | TimeSpent |
| ----- | --------- |
| 17/11 | 3h        |
| 18/11 | 3h        |
| 19/11 | 3h        |
| 20/11 | 4h        |
| 21/11 | 2h        |
| 22/12 | 4h        |
| Total | ~21h      |

Sorry took longer than expected. I did not notice today is the 6th day and not the 5th.

### Assumptions made

- Did not know if there was any cost limitation
  - Consequence: Used RDS with mysql
- Did not know about scalability requirements
  - Consequence: Used lambda, but decided for a mixed approach with express framework (makes it easy to swap to non-serverless if needed)
- Assumed there could be problems with concurrency
  - Consequence: Created simple retry rule to improve experience and always look for latest next identifier
- Thinking about mimicking the real world, I wanted have a CI/CD in place, so I used github actions and also IaC with Terraform in order to make the project easier to maintain and deploy


### Shortcuts/Compromises made

- Whish I could have added more unit tests
- Whish I could have added integration or end-to-end tests
- Started to implement OAuth2 but it was taking longer than expected to integrate with node library, so I decided to leave for the end and ran out of time

### Stretch goals attempted

- Deployed API on AWS, using Infrastructed as Code with Terraform
- Wanted to finish OAuth implementation, but I used too much time with code refactoring and iac. What I did was to prepare for receiving OAuthClients but did not finish
  
### Instructions to run assignment locally

To run locally:

1 - Clone repository

2 - Inside cloned folder run:

```console
  docker-compose up -d
``` 

Now you are able to access the API using the URL http://localhost:3000 

Before interacting with the api we need to run database migrations:

```console
  export DB_CONNECTION_STRING=mysql://root:root@localhost:3306/integer_saas
  npm run migrate
``` 

Now you can start registering your user through the POST /auth/register endpoint with a payload such as

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
- Did not setup Route 53, I did not have a domain under my name or a certificate

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
  - continuous integration / deployment with github actions

Postman Collection link to make it easier to use API:

https://www.getpostman.com/collections/71b0f70ea693ff3ba2f3 (just need to set `server` variable to be equal the API URL and the Bearer token)

### Your feedback on this technical challenge

I had fun making challenge. I think its simple but it gives opportunity to the candidate to demonstrate what he knows. I deninitely wanted to do more, but I might have used too much time because I focused on the Stretch Goals.  