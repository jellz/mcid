# 🔒 MCID

MCID is an API for developers to easily authenticate external users with their Minecraft: Java Edition accounts. This can be used to build _Login with Minecraft_ and other identity linking systems involving Minecraft accounts.

- **Built with** TypeScript, Express, Redis & node-minecraft-protocol
- **Data collection is limited** to temporary tokens (three-minute expiry) and generalised analytics (# of total codes generated & time of last generation). All users are forgotten.
- **Supports connections with Minecraft: Java Edition versions 1.8 - 1.19.3**

### Breakdown

The MCID application runs in one Docker container and depends on a Redis instance. The backend architecture can be broken down into three parts: the Minecraft server (using node-minecraft-protocol), the web server (using Express), and the Redis instance storing ephemeral data in between. The app also includes a React frontend (served by the web server), but this isn't necessary for using the service for authentication.

The Minecraft server generates codes upon connection and stores them in Redis, for the webserver to verify when the API endpoint is called (see [API usage](https://mcid.party)).

### Feedback / Contributing

Contributions are welcome! Feel free to make pull requests with enhancements or bug fixes if you can spare the time, or if you just have an idea or find a bug, you can [create an issue](https://github.com/jellz/mcid/issues).

Feel free to ask any questions about the project or public instance on the [Issues page](https://github.com/jellz/mcid/issues) or by [emailing me](mailto:danielgulic@gmail.com).

### Usage

Previously, a hosted instance was publicly available at [mcid.party](https://mcid.party), but this is no longer available. Developers wishing to use this software for their own applications/services are encouraged to self-host it by building and running the Docker Compose file. Please feel free to get in touch using the channels in the section above if you have any questions about self-hosting.

### License

> See [COPYING](https://github.com/jellz/mcid/tree/master/COPYING) file

Copyright (C) 2021 Daniel Gulic

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

---

**Twemoji** - used for the logo

Copyright 2020 Twitter, Inc and other contributors  
Code licensed under the MIT License: http://opensource.org/licenses/MIT  
Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
