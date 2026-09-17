# Meta Horizon Worlds Development

A portfolio-focused reference repository for immersive experience development in **Meta Horizon Worlds** for **Meta Quest**.

This repository documents reusable engineering patterns for spatial experiences, interactive world behavior, gameplay-style systems, and iterative Quest testing. It is intentionally structured as a public reference project rather than a copy of any private or published world.

## Focus Areas

- Meta Horizon Worlds development
- Meta Quest immersive experiences
- TypeScript world scripting patterns
- Interactive objects and player interactions
- Event-driven world behavior
- Reusable gameplay and experience components
- State and lifecycle management
- Spatial UX and experience flow
- Performance-conscious world design
- Rapid prototyping and iterative Quest testing
- AI-assisted development with human review

## Repository Structure

```text
docs/               Architecture, design notes, and spatial UX guidance
src/
  core/             Shared world infrastructure and reusable primitives
  interactions/     Player/object interaction patterns
  systems/          World-level behavior and state systems
  examples/         Sanitized reference implementations
```

## Development Philosophy

The examples in this repository emphasize separation of concerns, explicit state transitions, event-driven communication, reusable components, and maintainable TypeScript. World behavior should remain understandable as an experience grows rather than becoming a collection of tightly coupled scripts.

## Portfolio Scope

The project demonstrates engineering concepts applicable to Meta Horizon Worlds without publishing proprietary world assets, private project data, credentials, or source code belonging to another project or organization.

This repository does **not** claim to be a Unity, Unreal Engine, or native Meta XR SDK project. Its scope is Meta Horizon Worlds development and Meta Quest experience design.

## Roadmap

Initial increments will establish:

1. World architecture and scripting conventions.
2. A typed event-bus pattern for decoupled world behavior.
3. Interaction and state-machine examples.
4. Reusable experience components.
5. Spatial UX and performance documentation.
6. Automated validation for portable TypeScript logic where practical.

## Author

**Edgar Villegas**  
Senior / Lead Full-Stack Software Engineer  
Software Architecture & Modernization · AI-Assisted Development · Meta Horizon Worlds / XR

## License

MIT License. See `LICENSE`.
