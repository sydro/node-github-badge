Nodejs Github Badge
======================================
Node implementation of _Github Badge_ ( [**berkerpeksag/github-badge**](https://github.com/berkerpeksag/github-badge) )

# Installation

Clone this repository and then run *npm install*

```
npm install
```

# Start

Run server:

```
npm start
```

# Usage

In a browser:

[http://localhost:8080/badge/**nickname**]()


# Customize config.json

Run with customized config.json

```
docker run -d -p 8080:8080 -v $(pwd)/config.json:/opt/app/config.json sydro/node-github-badge
```

```
{
  "PORT": 8080,
  "GITHUB_URL": "https://www.github.com/",
  "CACHE_INTERVAL": 86400000,
  "CACHE_DIR": "./cache/",
  "USERS_ACCEPTED": [ "sydro" ]
}

```
