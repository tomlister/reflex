# reflex
home automation with automatic device discovery. no user setup required

Reflex leverages multicast dns to perform device discovery over your home network.
Utilising websockets, reflex allows programmers to quickly setup a channel for sending and receiving data.

Check out the [examples](https://github.com/tomlister/reflex/tree/master/examples) directory to get started.

## Roadmap
We're still developing this software. The current roadmap is for core functionality only.
- [x] Automatic Discovery
- [x] Websocket Handling
- [ ] Device Types
- [ ] Reflex Event System

## Diagrams
### MDNS
![multicast dns diagram](https://raw.githubusercontent.com/tomlister/reflex/master/docs/mdns-diagram.png)
### Connection Setup
![handshake diagram](https://raw.githubusercontent.com/tomlister/reflex/master/docs/handshake.png)
