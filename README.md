# Caching-Proxy

## Difference between the express and cli
Express → receives HTTP requests from browsers.
CLI → receives commands from the terminal.

### What is cli?
Answer - Command line interface

## 2. How does a terminal execute commands?

Suppose you type

hello world

The shell (Bash, Zsh, PowerShell, etc.) splits it into tokens:

Program : hello

Arguments:
world

The shell then executes

hello("world")

conceptually.

Every CLI tool receives these arguments.