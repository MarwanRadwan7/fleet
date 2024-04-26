# Fleet

[![Version][version-shield]](version-url)
[![Stargazers][stars-shield]][stars-url]
[![MIT License][license-shield]][license-url]

<p align="center">
  <a href="#" target="blank"><img src="/docs/fleet-logo.png" width="200" height="200" alt="fleet Logo" /></a>
</p>

  <p align="center">Fleet is a social media application to share your thoughts, make new fiends and text with your friends</p>
    <p align="center">

</p>

## Docs

- [API Documentation](https://app.swaggerhub.com/apis/MarwanRadwan/Fleet/1.5): list of the application 's backend endpoints.
- [Database Schema](/docs/fleet-db.png): Database Design of the app and it also available in `.dbml` format.
- ### App is Built With:
  - TypeScript
  - NestJS
  - PostgreSQL
  - TypeORM
  - Redis Caching
  - SocketIO
  - Cloudinary

## Installation

```bash
$ npm install
```

## Features

- App comes with following features:
  - Protected endpoints either the REST or WebSockets with JWT Tokens.
  - Cached Responses for better performance.
  - Exceptions and Error handling.
  - RateLimiting for the endpoints.
  - SQL Injection and CORS protection.
- Users can do the following:
  - Posting with the ability to attach media to the posts.
  - Find the posts with hashtags they are interested in.
  - Comment and like other user's posts.
  - Follow other users amd block unwanted users.
  - Create public chat groups.
  - Chat in public groups or with other users privately.
  - Get a feed of posts either from their following users or get the top trending posts based on the overall interactions.

## Running the app

The `.env` file should have these environment variables similar to the [example.env](./docs/example.env)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

Fleet is [MIT licensed](LICENSE).

[version-shield]: https://img.shields.io/github/package-json/v/MarwanRadwan7/fleet?style=for-the-badge
[version-url]: https://github.com/MarwanRadwan7/fleet
[contributors-shield]: https://img.shields.io/github/contributors/MarwanRadwan7/fleet.svg?style=for-the-badge
[contributors-url]: https://github.com/MarwanRadwan7/fleet/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/MarwanRadwan7/fleet.svg?style=for-the-badge
[forks-url]: https://github.com/MarwanRadwan7/fleet/forks
[stars-shield]: https://img.shields.io/github/stars/MarwanRadwan7/fleet.svg?style=for-the-badge
[stars-url]: https://github.com/MarwanRadwan7/fleet/stargazers
[issues-shield]: https://img.shields.io/github/issues/MarwanRadwan7/fleet.svg?style=for-the-badge
[issues-url]: https://github.com/MarwanRadwan7/fleet/issues
[license-shield]: https://img.shields.io/github/license/MarwanRadwan7/fleet.svg?style=for-the-badge
[license-url]: https://github.com/MarwanRadwan7/fleet/blob/main/LICENSE
