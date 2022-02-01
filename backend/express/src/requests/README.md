# REST Client

## Getting Started

Use **auth.rest POST /login** to log into existing account  
Optional: Create new account with **user.rest POST /user**

### Setup environment variables

Environment variables are used to share ids and token across all rest files. 

1. Copy values from the responses body

    **user_id** and **token**   => auth.rest POST /login  
    **exercise_id**         => exercise.rest GET /all


2. Paste values into the given variable placeholders

    .vscode/settings.json

